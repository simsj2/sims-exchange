const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, waffle } = require('hardhat');
const hre = require("hardhat");

describe("SimsExchange", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.

  // Sets contracts and user addresses
  const simsExchangeAddress = '0x25009196CC75B658fA4B615b6D3c326045c6896a';
  const simsCoinAddress = '0xa6c0D367e372E85F80B2fc75A65B80C9e9E23761';
  const senderAddress = "0x3164E9dc79d58e24e2542831984aA1912CbDbbe4";      

  async function buyFx() {

    // Contracts are deployed using the first signer/account by default
    const factoryCoin = await hre.ethers.getContractFactory("SimsCoin");
    const contractCoin = await factoryCoin.attach(simsCoinAddress);
    const factoryExchange = await hre.ethers.getContractFactory("SimsExchange");
    const contractExchange = await factoryExchange.attach(simsExchangeAddress);
    
    return { contractCoin, contractExchange  };
  }

  // Tests the exchange of GoerliETH for SimsCoin
  it("Should exchange GoerliETH for SimsCoin", async function () {
    const { contractCoin, contractExchange } = await loadFixture(buyFx);
    const balanceSenderBefore = await contractCoin.balanceOf(senderAddress);
    const balanceExchangeBefore = await contractCoin.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance before is ${ethers.utils.formatEther(balanceSenderBefore)} SimsCoin`);
    console.log(`sims exchange balance before is ${ethers.utils.formatEther(balanceExchangeBefore)} SimsCOin `);

    await contractExchange.buyFunction({value: ethers.utils.parseEther("0.001"), gasLimit: 2000000});

    const balanceSenderAfter = await contractCoin.balanceOf(senderAddress);
    const balanceExchangeAfter = await contractCoin.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance after is ${ethers.utils.formatEther(balanceSenderAfter)} SimsCoin`);
    console.log(`sims exchange balance after is ${ethers.utils.formatEther(balanceExchangeAfter)} SimsCoin`);
    expect(balanceSenderAfter).to.equal("0.01");
  });
    
  // Tests the exchange of SimsCoin for GoerliETH
  it("Should exchange SimsCoin for GoerliETH", async function () {
    const { contractCoin, contractExchange } = await loadFixture(buyFx);

    await contractCoin.approve(simsExchangeAddress, ethers.utils.parseEther("10000"));

    const balanceSenderBefore = await contractCoin.balanceOf(senderAddress);
    const balanceExchangeBefore = await contractCoin.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance before is ${ethers.utils.formatEther(balanceSenderBefore)} SimsCoin`);
    console.log(`sims exchange balance before is ${ethers.utils.formatEther(balanceExchangeBefore)} SimsCOin `);

    await contractExchange.sellFunction(ethers.utils.parseEther("0.05"), {gasLimit: 2000000});

    const balanceSenderAfter = await contractCoin.balanceOf(senderAddress);
    const balanceExchangeAfter = await contractCoin.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance after is ${ethers.utils.formatEther(balanceSenderAfter)} SimsCoin`);
    console.log(`sims exchange balance after is ${ethers.utils.formatEther(balanceExchangeAfter)} SimsCoin`);
    expect(balanceSenderAfter).to.equal("0.05");
  });
});
