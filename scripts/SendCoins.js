//const { ethers } = require("hardhat");
const hre = require("hardhat");

// senderAddress is my account which received the initialSupply of SimsCoins
const simsExchangeAddress = '0x25009196CC75B658fA4B615b6D3c326045c6896a';
const simsCoinAddress = '0xa6c0D367e372E85F80B2fc75A65B80C9e9E23761';
const senderAddress = "0x3164E9dc79d58e24e2542831984aA1912CbDbbe4";

const main = async () => {

    // Establish SimsCoin contract at the address it was deployed to
    const factory = await hre.ethers.getContractFactory("SimsCoin");
    const contract = await factory.attach(simsCoinAddress);

    // Check SimsCoin balances of the msg.sender (me) and SimsExchange before and after transfer
    const balanceSenderBefore = await contract.balanceOf(senderAddress);
    const balanceExchangeBefore = await contract.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance before is ${ethers.utils.formatEther(balanceSenderBefore)} ether`);
    console.log(`sims exchange balance before is ${ethers.utils.formatEther(balanceExchangeBefore)} ether `);

    await contract.transfer(simsExchangeAddress, balanceSenderBefore);

    const balanceSenderAfter = await contract.balanceOf(senderAddress);
    const balanceExchangeAfter = await contract.balanceOf(simsExchangeAddress);
    console.log(`msg.sender balance after is ${ethers.utils.formatEther(balanceSenderAfter)} ether`);
    console.log(`sims exchange balance after is ${ethers.utils.formatEther(balanceExchangeAfter)} ether `);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
  });