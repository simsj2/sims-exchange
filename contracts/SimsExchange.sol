// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface tells the exchange how to interact with the SimsCoin contract
interface iSimsCoin {
    function balanceOf(address addr) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address holder, address recipient, uint256 amount) external returns(bool);
}

// Contract exchanges GoerliETH for SimsCoin
contract SimsExchange {
    
    // Events emit who interacted with the contract and for how much
    event Buy(address _buyer, uint256 _amount);
    event Sell(address _seller, uint256 _amount);

    // Exchange rate is 1 GoerliETH = 100 SimsCoin
    uint256 constant exchangeRate = 100;
    address _SimsCoin = 0xa6c0D367e372E85F80B2fc75A65B80C9e9E23761;
    address public owner;

    // Set the initial deployer as the owner of the exchange
    constructor() {
        owner = msg.sender;
    }

    // buyFunction gets called with an amount of GoerliETH, checks balances, transfers the exchanged rate of SimsCoin, then emits an event
    function buyFunction() public payable {
        uint256 buyAmount = msg.value * exchangeRate;
        require(iSimsCoin(_SimsCoin).balanceOf(address(this)) >= buyAmount);  
        iSimsCoin(_SimsCoin).transfer(msg.sender, buyAmount);
        emit Buy(msg.sender, buyAmount);
    }

    // sellFunction gets called with an amount of SimsCoin, checks balances, transfers the exchanged rate of GoerliETH, then emits an event
    function sellFunction(uint256 _sellInput) public {
        uint256 sellingFor = _sellInput / exchangeRate;
        require(address(this).balance > sellingFor);
        require(iSimsCoin(_SimsCoin).balanceOf(msg.sender) >= _sellInput);
        iSimsCoin(_SimsCoin).transferFrom(msg.sender, address(this), _sellInput); // SimsCoin tranfer is approved on the front-end before using transferFrom
        payable(msg.sender).transfer(sellingFor);        
        emit Sell(msg.sender, _sellInput);
    }

    // withdraw can be called by the owner in order to withdraw GoerliETH and SimsCoin from the exchange
    function withdraw() public {
        require(msg.sender == owner);
        payable(msg.sender).transfer(address(this).balance);
        uint256 SimsCoinBal = iSimsCoin(_SimsCoin).balanceOf(address(this));
        iSimsCoin(_SimsCoin).transfer(msg.sender, SimsCoinBal);
    }
}