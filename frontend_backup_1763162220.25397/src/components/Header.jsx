import React, {useState, useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(()=>{
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('click', handler);
    return ()=> window.removeEventListener('click', handler);
  },[]);

  useEffect(()=>{
    const onStorage = () => setUser(JSON.parse(localStorage.getItem("user")) || null);
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const initials = (name, email) => {
    if (name) return name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
    if (email) return email[0].toUpperCase();
    return 'SS';
  };

  return (
    <div className="header">
      <div className="brand">
        <div className="logo-circle">SS</div>
        <div className="site-title">SwaraSadhana</div>
      </div>

      <div className="header-right">
        <Link to="/" className="link-btn">Home</Link>
        {user && <Link to="/progress" className="link-btn">Progress</Link>}
        {!user && <Link to="/login" className="link-btn">Login</Link>}
        {!user && <Link to="/signup" className="link-btn primary">Signup</Link>}

        {user && (
          <div style={{position:'relative'}} ref={ref}>
            <button className="profile-btn" onClick={()=>setOpen(o=>!o)}>
              <div className="avatar">{initials(user.name, user.email)}</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start', marginLeft:6}}>
                <div style={{fontWeight:700, fontSize:13}}>{user.name || user.email}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>{user.email}</div>
              </div>
            </button>
            {open && (
              <div className="dropdown">
                <p style={{fontWeight:700}}>{user.name || user.email}</p>
                <p style={{fontSize:13,color:'var(--muted)'}}>{user.email}</p>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
