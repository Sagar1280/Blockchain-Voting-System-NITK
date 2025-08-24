import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roll, setRoll] = useState('221 EC 149');
  const [dept, setDept] = useState('EC');
  const [year, setYear] = useState('221');
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  const register = async () => {
    try {
      await axios.post(api + '/api/auth/register', { email, password, roll, dept, year });
      alert('Registered. Now login.');
    } catch (e) { alert(e.response?.data?.error || e.toString()); }
  };

  const login = async () => {
    try {
      const res = await axios.post(api + '/api/auth/login', { email, password });
      onLogin(res.data.token, res.data.user);
    } catch (e) { alert(e.response?.data?.error || e.toString()); }
  };

  return (
    <div className="center">
      <div className="card">
        <h2>NITK Voting — Login / Register</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input placeholder="Roll (e.g., 221 EC 149)" value={roll} onChange={e=>setRoll(e.target.value)} />
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Dept" value={dept} onChange={e=>setDept(e.target.value)} />
          <input placeholder="Year" value={year} onChange={e=>setYear(e.target.value)} />
        </div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
        <p style={{fontSize:12}}>Demo: register with NITK-style roll and then login. This DApp uses MetaMask to submit on-chain vote.</p>
      </div>
    </div>
  );
}
