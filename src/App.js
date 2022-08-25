import sims from './sims.PNG';
import './App.css';
import React, { Component }  from 'react';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import 'bootstrap/dist/css/bootstrap.css';

// App() handles the connection to MetaMask, interaction with smart contracts, and establishment of the front end
function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [buyData, setBuyData] = useState('');
  const [sellData, setSellData] = useState('');
  const [form, setForm] = useState(true);

  // Sets the contracts to constants that can be mor easily interacted with
  const simsExchangeAddress = '0x25009196CC75B658fA4B615b6D3c326045c6896a';
  const simsCoinAddress = '0xa6c0D367e372E85F80B2fc75A65B80C9e9E23761';
  const abiSimsExchange = ['function buyFunction() public payable', 'function sellFunction(uint256 _sellInput) public payable'];
  const abiSimsCoin = ['function approve(address spender, uint256 value) public virtual override returns (bool)'];
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractSimsExchange = new ethers.Contract(simsExchangeAddress, abiSimsExchange, signer);
  const contractSimsCoin = new ethers.Contract(simsCoinAddress, abiSimsCoin, signer);

  // Handles the passing of props from the BuyForm
  const childToParentBuy = (BuyInput) => {
    setBuyData(BuyInput);
  }

  // Handles the passing of props from the SellForm
  const childToParentSell = (SellInput) => {
    setSellData(SellInput);
  }

  // Checks on page load if the browser has a MetaMask wallet, then sets the accounts and balance states
  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
        return <h1>Please install wallet.</h1>
      }
      sethaveMetamask(true);
      setAccountAddress('');
      setAccountBalance('');

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })

    };
    checkMetamaskAvailability();
  }, []);

  // Handles the connection to the wallet, sets the account address and balances, and ensures the user is connected to the Goerli chain
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
        alert('Please install wallet');
      }
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x5',
                  chainName: 'Goerli Test Network',
                  nativeCurrency: {
                    name: 'Görli Ether',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://goerli.infura.io/v3/'],
                  blockExplorerUrls: ['https://goerli.etherscan.io']
                },
              ],
            });
          } catch (addError) {
            setIsConnected(false);
            alert('add');
          }
        }
        setIsConnected(false);
        alert('switch');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);

    } catch (error) {
      setIsConnected(false);
    }
  }
    
  // Checks which form button is selected
  function checkFunction() {
    if (form == true) {
      buyFunction();
    } else {
      sellFunction();
    }
  }

  // Upon clicking exchange, this function translates the user input into a call to the SimsExchange contract's buyFunction
  async function buyFunction() {
    if (buyData > 0) {
      const buyDataString = buyData.toString();
      const buyAmount = ethers.utils.parseEther(buyDataString);
      const buyTx = await contractSimsExchange.buyFunction({value: buyAmount});  
      if (await buyTx.wait()) {
        alert('Transaction confirmed!');
      } else {
        alert('Transaction failed!');
      }
    } else {
      alert('Input must be greater than zero');
    }
  }

  /*
   * Upon clicking exchange, this function translates the user input into a call to the SimsExchange contract's sellFunction 
   * and approves the transfer
   */
  async function sellFunction() {
    if (sellData > 0) {
      const sellDataString = sellData.toString();
      const sellAmount = ethers.utils.parseEther(sellDataString);
      await contractSimsCoin.approve(simsExchangeAddress, ethers.utils.parseEther("1000000"));
      const sellTx = await contractSimsExchange.sellFunction(sellAmount);
      if (await sellTx.wait()) {
        alert('Transaction confirmed!');
      } else {
        alert('Transaction failed!');
      }
    } else {
      alert('Input must be greater than zero');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* Checks if the user's browser has MetaMask */}
        {haveMetamask ? (
          <div className="App-header">
            {/* If user clicks connect, they "enter" the exchange */}
            {isConnected ? (
            <div>
              {/* Shows the user's account information */}
              <p className="Wallet">
                <span className="Space">
                  Wallet Address: {accountAddress.slice(0, 4)}...{accountAddress.slice(38, 42)}
                </span>
                <span>
                  Wallet Balance: {accountBalance.slice(0,6)} ETH
                </span>
              </p> 
              <div>
                {/* Establishes the form selection buttons */}
                <button className="btn BuyFormButton" onClick={(event)=>{setForm(true)}}>
                  Buy Form
                </button>
                <button className="btn SellFormButton" onClick={(event)=>{setForm(false)}} >
                  Sell Form
                </button>
                {/* Displays the form corresponding to the button selected */}
                {form ? (<BuyForm childToParentBuy={childToParentBuy}/>) : (<SellForm childToParentSell={childToParentSell} />)}
                <input type="submit" className="Exchange" value="Exchange" onClick={checkFunction} />
              </div>
            </div>
            ) : (
              <div>
                {/* If not connected, will show the home page */}
                <img src={sims} className="App-logo" alt="logo" />
                <div className="Entrance">
                  <div>Click Connect to Enter Sims Exchange!</div>
                  <button className="btn" onClick={connectWallet}>
                    Connect
                  </button>
                  <div>
                    {ethereum ? '' : 'Please install wallet'}
                  </div>  
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Please Install MataMask</p>
        )}
      </header>
    </div>
  );
}

export default App;