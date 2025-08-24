async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  const Voting = await ethers.getContractFactory('CollegeVoting');
  const voting = await Voting.deploy();
  await voting.deployed();
  console.log('CollegeVoting deployed to:', voting.address);
}
main().catch((e) => { console.error(e); process.exit(1); });
