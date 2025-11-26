// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { login } from "../services/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      // if parent provided onLogin, call it; otherwise store and navigate
      if (onLogin) onLogin(user);
      else {
        sessionStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("user-changed"));
        navigate("/");
      }
    } catch (err) {
      setErr(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div>
      <Header />
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-title">Welcome back — Login</div>
          <form onSubmit={submit}>
            <div className="auth-grid">
              <div className="form-row">
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-row">
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 14, textAlign: "center" }}>
              <button className="primary" type="submit">Login</button>
            </div>
            {err && <div style={{ color: "red", marginTop: 12, textAlign: "center" }}>{err}</div>}
            <div className="small-muted">New here? <Link to="/signup">Create an account</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
