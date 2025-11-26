import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")) || null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(sessionStorage.getItem("user")) || null);
    const onUserChanged = () => setUser(JSON.parse(sessionStorage.getItem("user")) || null);
    window.addEventListener("storage", onStorage);
    window.addEventListener("user-changed", onUserChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-changed", onUserChanged);
    };
  }, []);

  const logout = () => {
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("user-changed"));
    setUser(null);
    navigate("/login");
  };

  const initials = (name, email) => {
    if (name) return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
    if (email) return email[0].toUpperCase();
    return "SS";
  };

  const onHome = location.pathname === "/";

  return (
    <header className="header" role="banner">
      <div className="brand" style={{ alignItems: "center", gap: 12 }}>
        <div className="logo-circle" aria-hidden>SS</div>
        <div className="site-title">SwaraSadhana</div>
      </div>

      <nav className="header-right" role="navigation" aria-label="Main nav">
        {user && !onHome && (
          <Link to="/" className="link-btn ghost" aria-label="Home button" title="Home">🏠</Link>
        )}

        {user && <Link to="/progress" className="link-btn primary" aria-label="Progress">Progress</Link>}

        {!user && <Link to="/login" className="link-btn">Login</Link>}
        {!user && <Link to="/signup" className="link-btn primary">Signup</Link>}

        {user && (
          <div style={{ position: "relative" }} ref={ref}>
            <button className="profile-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="true" aria-expanded={open}>
              <div className="avatar">{initials(user.name, user.email)}</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 8 }}>
                <div style={{ fontWeight: 700 }}>{user.name || user.email}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{user.email}</div>
              </div>
            </button>

            {open && (
              <div className="dropdown" role="menu">
                <p style={{ fontWeight: 700 }}>{user.name || user.email}</p>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>{user.email}</p>
                <button onClick={logout} >Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
