import Header from "../components/Header";\nimport React, {useState} from "react";
import { login } from "../services/api";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({email,password});
      onLogin(user);
    } catch (err) {
      setErr(err?.response?.data?.error || 'Login failed');
    }
  };

  return (\n    <div>\n      <Header />
    <div>
      <div className="header">
        <div className="brand">
          <div className="logo-circle">SS</div>
          <div className="site-title">SwaraSadhana</div>
        </div>
        <div>
          <Link to="/" style={{marginRight:12}}>Home</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-title">Welcome back — Login</div>
          <form onSubmit={submit}>
            <div className="auth-grid">
              <div className="form-row">
                <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div className="form-row">
                <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
            </div>
            <div style={{marginTop:14, textAlign:'center'}}>
              <button className="primary" type="submit">Login</button>
            </div>
            {err && <div style={{color:'red',marginTop:12, textAlign:'center'}}>{err}</div>}
            <div className="small-muted">New here? <Link to="/signup">Create an account</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
