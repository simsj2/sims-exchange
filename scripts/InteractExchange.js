// const { ethers } = require("hardhat");
const hre = require("hardhat");

// senderAddress is my account which received the initialSupply of SimsCoins
const simsExchangeAddress = '0x25009196CC75B658fA4B615b6D3c326045c6896a';
const simsCoinAddress = '0xa6c0D367e372E85F80B2fc75A65B80C9e9E23761';
const senderAddress = "0x3164E9dc79d58e24e2542831984aA1912CbDbbe4";

const main = async () => {

    // Establish SimsCoin and SimsExchange contract at the addresses they were deployed to
    const factoryCoin = await hre.ethers.getContractFactory("SimsCoin");
    const contractCoin = await factoryCoin.attach(simsCoinAddress);
    const factoryExchange = await hre.ethers.getContractFactory("SimsExchange");
    const contractExchange = await factoryExchange.attach(simsExchangeAddress);

    // Approve exchange to send up to 1,000,000 of the user's SimsCoin
    await contractCoin.approve(simsExchangeAddress, ethers.utils.parseEther("1000000"));
    
    // Check SimsCoin balances of the senderAddress (me) and SimsExchange before and after transfer
    const balanceSenderBefore = await contractCoin.balanceOf(senderAddress);
    const balanceExchangeBefore = await contractCoin.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance before is ${ethers.utils.formatEther(balanceSenderBefore)} SimsCoin`);
    console.log(`sims exchange balance before is ${ethers.utils.formatEther(balanceExchangeBefore)} SimsCoin `);

    // Sell 0.05 SimsCoin with a gasLimit of 2,000,000
    await contractExchange.sellFunction(ethers.utils.parseEther("0.05"), {gasLimit: 2000000});
 
    const balanceSenderAfter = await contractCoin.balanceOf(senderAddress);
    const balanceExchangeAfter = await contractCoin.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance after is ${ethers.utils.formatEther(balanceSenderAfter)} SimsCoin`);
    console.log(`sims exchange balance after is ${ethers.utils.formatEther(balanceExchangeAfter)} SimsCoin`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
  });