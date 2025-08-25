# NITK Voting DApp 

NITK Voting DApp
This project is a full-stack decentralized application (DApp) for a college voting system. It combines a traditional web application for user authentication and session management with a blockchain-based smart contract for secure, transparent, and immutable vote recording.

Features
Secure Authentication: A Node.js backend handles user registration and login, with password hashing for security.

Decentralized Voting: The core voting logic is handled by a Solidity smart contract deployed on an Ethereum-based blockchain.

Immutable Records: Once a vote is cast, it is recorded on the blockchain and cannot be altered.

Voter Anonymity: Votes are encrypted on the client side, and only a hash of the student's roll number is stored on the blockchain, protecting voter privacy.

Administrator Tools: The contract owner can retrieve all encrypted votes from the blockchain and use the backend server to decrypt and tally the results.

Project Architecture
The application is structured as a monorepo with three main components: a frontend, a backend server, and a smart contract project.

client: The React-based user interface.

server: The Node.js/Express backend API.

contracts: The Solidity smart contract and Hardhat development environment.

shared: A folder containing the contract's ABI (.json file) and other shared assets.

Technology Stack
Frontend
React: A JavaScript library for building the user interface.

Vite: A build tool and development server for fast development.

Web3.js: A library for interacting with the Ethereum blockchain and MetaMask.

Axios: A library for making API requests to the backend server.

JSEncrypt: A library for client-side vote encryption.

Backend
Node.js & Express: A web server to handle API routes, authentication, and database interaction.

MongoDB: The database for storing user information and their voting status.

Mongoose: An Object Data Modeling (ODM) library for Node.js to manage MongoDB data.

Bcryptjs: A library for hashing user passwords.

jsonwebtoken: A library for creating and verifying JWTs for user sessions.

node-forge: A library for server-side decryption of votes.

dotenv: A module to load environment variables from a .env file.

Blockchain
Solidity: The language for the CollegeVoting smart contract.

Hardhat: An Ethereum development environment for compiling, deploying, and testing smart contracts.

Local Setup & Installation
To run this project locally, you need to set up each component individually.

1. Install Dependencies
Open three separate terminals and navigate to each project folder to install its dependencies.

In the root directory

Bash

npm install
In the contracts directory

Bash

cd contracts
npm install
In the server directory

Bash

cd server
npm install
In the client directory

Bash

cd client
npm install


2. Deploy the Smart Contract
You need to deploy the smart contract to a local blockchain network to get its address.

Start the Hardhat node: In one terminal, navigate to the contracts directory and run:

Bash

npm run node
This will start a local blockchain and provide a list of test accounts and private keys. Keep this terminal open.

Deploy the contract: In a new terminal, also in the contracts directory, run:

Bash

npm run deploy
This will print the deployed contract's address. Copy this address.

3. Configure Environment Variables
Create .env files in your project to store sensitive information.

Root .env: Create a file named .env in the root directory (alongside contracts and server) and add your frontend variables:

# Frontend variables
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_OWNER_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
VITE_API_BASE=http://localhost:4000
Server .env: Create a file named .env in the server directory and add your backend variables:

# Backend variables
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password-encoded>@<cluster-name>.mongodb.net/<database-name>
JWT_SECRET=a_strong_random_secret
CONTRACT_ADDRESS=0xYourDeployedContractAddress
OWNER_PRIVATE_KEY_RSA="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
OWNER_ACCOUNT_PRIVATE_KEY=0xYourDeployerAccountPrivateKey
CHAIN_ID=31337
Note: Ensure CONTRACT_ADDRESS and VITE_CONTRACT_ADDRESS use the address you copied in the previous step.

4. Run the Application
With the setup complete, you can now run the backend and frontend.

Run the backend: In a new terminal, navigate to the server directory and run:

Bash

npm run dev
Run the frontend: In another new terminal, navigate to the client directory and run:

Bash

npm run dev
This will start the frontend on http://localhost:5173. Open this URL in your browser.

Connect MetaMask: You will need to add a custom network to MetaMask and import one of the test accounts from your npm run node terminal to get test ETH for transactions.

![Alt text](images/Metamask.jpg)

![Alt text](images/completion%20of%20vote.jpg)

![Alt text](images/Metamask2.jpg)

![Alt text](images/user_interface.jpg)

![Alt text](images/voted.jpg)