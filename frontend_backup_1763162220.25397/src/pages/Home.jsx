import Header from "../components/Header";import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user, onLogout }) => (
  <div className="header" style={{ position: "sticky", top: 0, zIndex: 50 }}>
    <div className="brand">
      <div className="logo-circle">SS</div>
      <div className="site-title">SwaraSadhana</div>
    </div>
    <div>
      {user ? (
        <>
          <span style={{ marginRight: 10 }}>Hello, {user.name || user.email}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </div>
  </div>
);

const courses = ["Vocals", "Flute", "Guitar", "Ukelele", "Keyboard"];

export default function Home({ user, onLogout }) {
  return (    <div>     <Header />
    <div>
      <Header user={user} onLogout={onLogout} />

      <section className="hero">
        <div className="hero-left">
          <h1>Welcome to SwaraSadhana</h1>
          <p>Learn music at your own pace — explore courses in vocals, flute, guitar, and more!</p>
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        <h2>Courses</h2>
        <div className="courses-grid">
          {courses.map((c) => (
            <div key={c} className="course-card">
              <h3>{c}</h3>
              <p>Choose level and start lessons</p>
              <div className="course-actions">
                <Link to={`/course/${encodeURIComponent(c)}/beginner`}><button className="btn-level">Beginner</button></Link>
                <Link to={`/course/${encodeURIComponent(c)}/advanced`}><button className="btn-level">Advanced</button></Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
}
