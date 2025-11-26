// frontend/src/pages/Signup.jsx
import React, { useState } from "react";
import { register } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [primaryInstrument, setPrimaryInstrument] = useState(""); 
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!primaryInstrument) {
      setErr("Please select your primary instrument.");
      return;
    }

    try {
      const payload = { email, password, name, primaryInstrument };

      const user = await register(payload);

      // If backend doesn't echo primaryInstrument, add it manually:
      const finalUser = {
        ...user,
        primaryInstrument
      };

      if (onSignup) {
        onSignup(finalUser);
      } else {
        sessionStorage.setItem("user", JSON.stringify(finalUser));
        window.dispatchEvent(new Event("user-changed"));
        navigate("/");
      }
    } catch (err) {
      setErr(err?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div>
      <Header />
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-title">Create an account</div>
          <form onSubmit={submit}>
            <div className="auth-grid">

              <div>
                <input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <select
                  value={primaryInstrument}
                  onChange={(e) => setPrimaryInstrument(e.target.value)}
                >
                  <option value="">Choose primary instrument</option>
                  <option value="Vocals">Vocals</option>
                  <option value="Flute">Flute</option>
                  <option value="Guitar">Guitar</option>
                  <option value="Ukelele">Ukelele</option>
                  <option value="Keyboard">Keyboard</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 14, textAlign: "center" }}>
              <button className="primary" type="submit">
                Sign up
              </button>
            </div>

            {err && (
              <div style={{ color: "red", marginTop: 12, textAlign: "center" }}>
                {err}
              </div>
            )}

            <div className="small-muted">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
