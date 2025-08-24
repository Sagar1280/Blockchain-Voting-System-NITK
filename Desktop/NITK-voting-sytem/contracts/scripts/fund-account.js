const { ethers } = require('hardhat');
const { setBalance } = require('@nomicfoundation/hardhat-network-helpers');

async function main() {
  // Replace this with the public address of your MetaMask account
  const accountAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const amountToFund = ethers.parseEther("10000"); // Amount to fund in Wei (10000 ETH)

  console.log(`Funding account ${accountAddress} with ${ethers.formatEther(amountToFund)} ETH...`);

  // Set the balance of the account
  await setBalance(accountAddress, amountToFund);

  console.log('Account funded successfully!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});