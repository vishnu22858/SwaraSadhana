import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CoursePage from "./pages/CoursePage";import Progress from "./pages/Progress";

export default function App(){
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")) || null);
  const navigate = useNavigate();

  useEffect(()=> {
    if (!user) {
      const stored = JSON.parse(sessionStorage.getItem("user"));
      if (stored) setUser(stored);
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    sessionStorage.setItem("user", JSON.stringify(u));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route path="/course/:course/:level" element={user ? <CoursePage user={user} /> : <Navigate to="/login" replace />} />\n        <Route path="/progress" element={user ? <Progress /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
