import Web3 from 'web3';
import ABI from '../../shared/abi/CollegeVoting.json';
const getWeb3 = () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return web3;
  } else {
    // fallback to provider from env (read-only)
    const provider = new Web3.providers.HttpProvider(import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545');
    return new Web3(provider);
  }
};

export function getContract(web3) {
  const addr = import.meta.env.VITE_CONTRACT_ADDRESS;
  return new web3.eth.Contract(ABI, addr);
}

export default getWeb3;
