// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

async function main() {
  // Initial supply of 1 billion SimsCoins (18 extra 0's for the decimals)
  const initialSupply = ethers.BigNumber.from("1000000000000000000000000000");
  const defaultOperators = [];

  const SimsCoin = await hre.ethers.getContractFactory("SimsCoin");
  const simsCoin = await SimsCoin.deploy(initialSupply, defaultOperators);

  await simsCoin.deployed();

  console.log("SimsCoin deployed to:", simsCoin.address);
}

// We recommend this pattern to be able to use async/await everywher and properly handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
