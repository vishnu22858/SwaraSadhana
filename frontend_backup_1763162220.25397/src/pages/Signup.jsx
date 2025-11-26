import Header from "../components/Header";import React, {useState} from "react";
import { register } from "../services/api";
import { Link } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [err,setErr]=useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register({email,password,name});
      onSignup(user);
    } catch (err) {
      setErr(err?.response?.data?.error || 'Signup failed');
    }
  };

  return (   <div>    <Header />
    <div>
      <div className="header">
        <div className="brand">
          <div className="logo-circle">SS</div>
          <div className="site-title">SwaraSadhana</div>
        </div>
        <div>
          <Link to="/" style={{marginRight:12}}>Home</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-title">Create an account</div>
          <form onSubmit={submit}>
            <div className="auth-grid">
              <div>
                <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <div>
                <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div>
                <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              <div>
                <select>
                  <option>Choose primary instrument</option>
                  <option>Vocals</option>
                  <option>Flute</option>
                  <option>Guitar</option>
                  <option>Ukelele</option>
                  <option>Keyboard</option>
                </select>
              </div>
            </div>
            <div style={{marginTop:14, textAlign:'center'}}>
              <button className="primary" type="submit">Sign up</button>
            </div>
            {err && <div style={{color:'red',marginTop:12, textAlign:'center'}}>{err}</div>}
            <div className="small-muted">Already have an account? <Link to="/login">Login</Link></div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
