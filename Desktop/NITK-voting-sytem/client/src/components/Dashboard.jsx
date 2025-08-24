import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getWeb3, { getContract } from '../web3';
import Vote from './Vote';

export default function Dashboard({ token, user, onLogout }) {
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const [voters, setVoters] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(()=>{ (async ()=>{
    try {
      const res = await axios.get(api + '/api/vote/voters');
      setVoters(res.data.users);
    } catch(e){ console.error(e); }
  })(); }, []);

  const connectWallet = async ()=>{
    try {
      const w3 = await getWeb3();
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWeb3(w3);
      setContract(getContract(w3));
      alert('Wallet connected');
    } catch(e){ alert('Install MetaMask and connect'); }
  };

  return (
    <div style={{padding:20}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>NITK Voting DApp</h1>
        <div>
          <strong>{user.roll}</strong> <button onClick={onLogout}>Logout</button>
        </div>
      </header>
      <div style={{display:'flex',gap:20,marginTop:16}}>
        <div style={{flex:1}}>
          <h3>Voter List (shows who has voted)</h3>
          <table className="voter-table">
            <thead><tr><th>Roll</th><th>Dept</th><th>Year</th><th>Voted</th></tr></thead>
            <tbody>
              {voters.map(v=>(
                <tr key={v.roll}><td>{v.roll}</td><td>{v.dept}</td><td>{v.year}</td><td>{v.hasVoted? '✅':'❌'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{width:420}}>
          <h3>Cast Vote</h3>
          <button onClick={connectWallet}>Connect Wallet (MetaMask)</button>
          <Vote token={token} user={user} web3={web3} contract={contract} apiBase={api} />
          <hr />
          <h4>Admin (owner) tools</h4>
          <p>Owner can fetch encrypted votes and decrypt via server.</p>
          <button onClick={async ()=>{
            try {
              const res = await axios.get(api + '/api/admin/encrypted', { headers:{ Authorization:'Bearer '+token } });
              console.log(res.data);
              alert('Encrypted list printed to console (developer).');
            } catch(e){ alert(e.response?.data?.error || e.toString()); }
          }}>Fetch Encrypted (owner)</button>
        </div>
      </div>
    </div>
  );
}
