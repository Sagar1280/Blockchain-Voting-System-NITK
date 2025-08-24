require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: '0.8.24',
  networks: {
    localhost: {
      url: RPC_URL || 'http://127.0.0.1:8545',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};
