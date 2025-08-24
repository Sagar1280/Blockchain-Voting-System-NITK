async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  const Voting = await ethers.getContractFactory('CollegeVoting');
  const voting = await Voting.deploy();
  // Await is no longer needed after `Voting.deploy()`
// Awaiting the deploy() call is sufficient
  console.log('CollegeVoting deployed to:', voting.target);
}
main().catch((e) => { console.error(e); process.exit(1); });
