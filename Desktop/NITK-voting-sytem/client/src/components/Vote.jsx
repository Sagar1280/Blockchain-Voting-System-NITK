import React, { useState } from 'react';
import JSEncrypt from 'jsencrypt';
import axios from 'axios';

export default function Vote({ token, user, web3, contract, apiBase }) {
  const [choice, setChoice] = useState('Option A');
  const ownerPub = (import.meta.env.VITE_OWNER_PUBLIC_KEY || '').replace(/\\n/g, '\n');
  const encryptChoice = (text) => {
    if (!ownerPub) return btoa(text); // fallback
    const js = new JSEncrypt();
    js.setPublicKey(ownerPub);
    const enc = js.encrypt(text);
    return enc || btoa(text);
  };

  const submit = async () => {
    if (!web3 || !contract) return alert('Connect wallet first');
    try {
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      // roll hash: keccak256 of roll string
      const roll = user.roll;
      const rollHash = web3.utils.keccak256(roll);
      const encrypted = encryptChoice(choice);
      // submit tx
      await contract.methods.submitVote(rollHash, encrypted).send({ from });
      // record on server
      await axios.post(apiBase + '/api/vote/record', { roll }, { headers: { Authorization: 'Bearer ' + token } });
      alert('Vote cast and recorded. Thank you.');
    } catch (e) {
      console.error(e);
      alert(e.message || e.toString());
    }
  };

  return (
    <div style={{marginTop:12}}>
      <div>
        <select value={choice} onChange={e=>setChoice(e.target.value)}>
          <option> ADWIADH </option>
          <option> GAGAN </option>
          <option> PRANIL </option>
        </select>
      </div>
      <button onClick={submit} style={{marginTop:8}}>Submit Vote</button>
    </div>
  );
}
