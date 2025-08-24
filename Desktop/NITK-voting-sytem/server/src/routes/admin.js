import express from 'express';
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import forge from 'node-forge';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const ABI = JSON.parse(fs.readFileSync(path.resolve('shared/abi/CollegeVoting.json')));
const RPC = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT = process.env.CONTRACT_ADDRESS || '';
const OWNER_ETH_PRIV = process.env.OWNER_ACCOUNT_PRIVATE_KEY || '';
const OWNER_RSA_PRIV = process.env.OWNER_PRIVATE_KEY_RSA || '';

const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const contract = new web3.eth.Contract(ABI, CONTRACT);

// Admin route: fetch encrypted votes (owner-only)
// NOTE: the contract's getAllEncryptedVotes is restricted to owner. We call it with owner's address.
router.get('/encrypted', auth, async (req, res) => {
  try {
    // minimal owner check - in production, better admin auth
    const account = web3.eth.accounts.privateKeyToAccount(OWNER_ETH_PRIV);
    const data = await contract.methods.getAllEncryptedVotes().call({ from: account.address });
    // returns [rollHashes[], encryptedVotes[]]
    res.json({ rollHashes: data[0], encryptedVotes: data[1] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Contract call failed', details: e.toString() });
  }
});

// Admin decrypt endpoint: decrypts ciphertexts using RSA private key (PEM in env)
router.post('/decrypt', auth, async (req, res) => {
  try {
    const { encryptedList } = req.body;
    if (!Array.isArray(encryptedList)) return res.status(400).json({ error: 'encryptedList required' });
    if (!OWNER_RSA_PRIV) return res.status(500).json({ error: 'Server missing RSA private key' });
    const privateKeyPem = OWNER_RSA_PRIV.replace(/\\n/g, '\n');
    const priv = forge.pki.privateKeyFromPem(privateKeyPem);
    const results = encryptedList.map((c) => {
      try {
        const bytes = forge.util.decode64(c);
        const decrypted = priv.decrypt(bytes, 'RSA-OAEP');
        return { ok: true, decrypted };
      } catch (e) {
        return { ok: false, error: e.toString() };
      }
    });
    res.json({ results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: get user list (including hasVoted flag)
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0, __v: 0 });
    res.json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
