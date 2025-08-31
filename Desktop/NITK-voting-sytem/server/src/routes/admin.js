import express from 'express';
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import forge from 'node-forge';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'shared', 'abi', 'CollegeVoting.json')));
const RPC = 'http://127.0.0.1:8545';
const CONTRACT = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Hardcoded private keys for testing purposes
const OWNER_ETH_PRIV = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const OWNER_RSA_PRIV = "-----BEGIN RSA PRIVATE KEY-----\\nMIIEpAIBAAKCAQEAoCawzuCRF/XcMHvZe8TcmJ/fkMpMn8XNpb+JhR05zDDG66Bn\\nPP1qGb/f3FtmAfzT0d/B6yYA35kip7elZtzPVLeEOSihY0GC+FM59HWA9+knmt/k\\n4xieDW1Tt1fdgJhM58kcHQiRX2XMxwbzYXiphb55v88/vBOYOTMdWregiAm9kYNL\\nxVv5HmS4XGBoezR/RDZgUhclJdH5HQYb8IBPtz80TBYhrw5Ryjg38RXxljRbkuW+\\nVMnhIP3tIvMwbzR2vu9mmPz86MeTRnFctxkzciOFU/C81KXmDB15lPpSLN8MhN7p\\nssC3rdl2scAvGT9dkqcTHqEOB26PMaYJ1c3euQIDAQABAoIBAAh9r1Id8JNnTaKk\\nblt0NzNAXAdpMmF7iJ5eZq7QEIhq7aEAgs4RAYHBUop0WMGHjhN1MZWDZk3J6LR2\\nYCab/mzCGMM5tuoe8bqzbuyEbloL2osI49xxKbAR49EMr4m/NBSgl6+nt01qME6S\\nZ8T7M2xhNO3z0a/pugsOUrgZ6ZZMwxXX1dBAy8oY2CAXMTEP9P0WGcbNB6YdQH7q\\nCY5Qd3pxBteMvsHfjKIcMZROMoN6JzKi82ShfORi+n02WICqWk8oVU/656XOmhrL\\nlVlBNvR++8on4/Ao4EjVQRZdXGQxOkxd4RBc7IwWBtu5NqlAD45SD+xq+6JcqFgp\\nS0ZpISECgYEA0t+gfoHUAFpiDA0UDLckEK1ltSoofguLz7LR/EYCBH9mV5vFbYQ4\\nEMVTDE4KDvcolC6yTNFFMRuyqk/9nazr+by3h2UZ8VlFO+ib+aJ77WH39MVjZy5h\\nJG+/Lr9OUXBMsonQsBpiwMg5pKCpTW7dXhj4jZgRy5zhM9Evo0xpuWcCgYEAwmxR\\nJRRIzbjc+8+krOOcdkXWpX18B1Zs9/2Q0p+8Jd8Bb81TL6bvHoPA8daJtn0bGld3\\n9cTHklBa3W6AcwDxbfc3vTC6NPaWlYtjbIwsfBCEvakygnDd+EzIcOEuc8DfepNO\\ndqFbPrr/SM1NUwsj2qiEzYumcGOnfAdXTTa+8t8CgYEArjzW+RC/IleMIhcAVQ1S\\nQHF10351HMjfigtgVEloS10VLBhqxfX0+W6CE228A+eW4PHAo5ZazJvtQap8jTcf\\neCfFoZsZF4HCoiCuGFN4gIltfxNF8jCxVZD78F1kEghvZypWg9wZct8+OdgCbBfJ\\n04FghmZ7dbk3n0AeU5jE1ssCgYEAhvpiP4bcoI52RRA8eJcw2d/UjGIZCJMU5fqR\\nX9jr67LuMWtwFEYl/p5kBsH2K86hUWFmdCcgktDctJxx6uW9t6WJefxpWjnUA5CY\\n/xQ2Eg/5yB6+ZVbsk+Tix5NeB5jgzh2UvMF7MorqjuWRiFTUmIqkYHtSmvZkobQL\\nBR075isCgYBQbrv6xFpwuhlmzQt6fD2rPkQScjWHiS61ufRxgaek26R+pfaIr2Gn\\nDEO49AQSYFLnAQ12DHAT2+aIZsNOYoNbRn2AHE0jcCAtR0x42xD8v9mXe+x34Es7\\n29NqA5kUPPbys7IqdCgeQvdB92lM5S+R7+T0qumFxddTOO005CrwUw==\\n-----END RSA PRIVATE KEY-----";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const contract = new web3.eth.Contract(ABI, CONTRACT);

// Admin route: fetch encrypted votes (owner-only)
router.get('/encrypted', auth, async (req, res) => {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(OWNER_ETH_PRIV);
    const data = await contract.methods.getAllEncryptedVotes().call({ from: account.address });
    console.log('Encrypted votes fetched:', data);
    res.json({ rollHashes: data[0], encryptedVotes: data[1] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Contract call failed', details: e.toString() });
  }
});

// Admin decrypt endpoint: decrypts ciphertexts using RSA private key
router.post('/decrypt', auth, async (req, res) => {
  try {
    const { encryptedList } = req.body;
    if (!Array.isArray(encryptedList)) return res.status(400).json({ error: 'encryptedList required' });
    
    const privateKeyPem = OWNER_RSA_PRIV.replace(/\\n/g, '\n');
    const priv = forge.pki.privateKeyFromPem(privateKeyPem);
    const results = encryptedList.map((c) => {
      try {
        const bytes = forge.util.decode64(c);
        const decrypted = priv.decrypt(bytes, 'RSA-OAEP');
        return { ok: true, decrypted: decrypted.toString('utf8') };
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