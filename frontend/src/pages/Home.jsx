// frontend/src/pages/Home.jsx
import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const ALL_COURSES = ["Vocals", "Flute", "Guitar", "Ukelele", "Keyboard"];

export default function Home() {
  const [showWhy, setShowWhy] = useState(false);
  const openWhy = () => setShowWhy(true);
  const closeWhy = () => setShowWhy(false);

  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const primary = user?.primaryInstrument || ALL_COURSES[0];

  const otherCourses = useMemo(
    () => ALL_COURSES.filter((c) => c !== primary),
    [primary]
  );

  return (
    <div>
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-left">
            <h1 id="hero-heading">Learn music with SwaraSadhana</h1>
            <p>
              Hand-picked lessons, clear progress tracking, and structured
              courses to take your music journey forward.
            </p>
            <div className="hero-cta" style={{ marginTop: 18 }}>
              <button className="btn-outline" onClick={openWhy}>
                Why SwaraSadhana?
              </button>
            </div>
          </div>

          <div style={{ width: 360 }}>
            <div
              style={{
                background: "white",
                padding: 14,
                borderRadius: 12,
                boxShadow: "0 8px 30px rgba(17,24,40,0.04)",
              }}
            >
              <h4 style={{ margin: 0 }}>Featured</h4>
              <p className="small-muted" style={{ marginTop: 6 }}>
                Start your first lesson here!
              </p>
              <Link to={`/course/${encodeURIComponent(primary)}/beginner`}>
                <button className="btn-cta" style={{ marginTop: 8 }}>
                  Start Lesson
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* If user is logged in, show primary course first */}
        {user ? (
          <>
            <section className="section" style={{ marginTop: 24 }}>
              <h2>Your primary course</h2>
              <div className="courses-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="course-card" key={primary}>
                  <h3>{primary}</h3>
                  <p className="small-muted">
                    This is your chosen primary instrument.
                  </p>
                  <div className="course-actions">
                    <Link to={`/course/${encodeURIComponent(primary)}/beginner`}>
                      <button className="btn-level">Beginner</button>
                    </Link>
                    <Link to={`/course/${encodeURIComponent(primary)}/advanced`}>
                      <button className="btn-level">Advanced</button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="section" style={{ marginTop: 24 }}>
              <h2>Other courses</h2>
              <div className="courses-grid">
                {otherCourses.map((c) => (
                  <div key={c} className="course-card">
                    <h3>{c}</h3>
                    <p className="small-muted">
                      Structured lessons for {c} — curated for beginners and
                      advanced learners.
                    </p>
                    <div className="course-actions">
                      <Link to={`/course/${encodeURIComponent(c)}/beginner`}>
                        <button className="btn-level">Beginner</button>
                      </Link>
                      <Link to={`/course/${encodeURIComponent(c)}/advanced`}>
                        <button className="btn-level">Advanced</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          // Not logged in: show all courses (previous behaviour)
          <section className="section">
            <h2>Courses</h2>
            <div className="courses-grid">
              {ALL_COURSES.map((c) => (
                <div key={c} className="course-card">
                  <h3>{c}</h3>
                  <p className="small-muted">
                    Structured lessons for {c} — curated for beginners and
                    advanced learners.
                  </p>
                  <div className="course-actions">
                    <Link to={`/course/${encodeURIComponent(c)}/beginner`}>
                      <button className="btn-level">Beginner</button>
                    </Link>
                    <Link to={`/course/${encodeURIComponent(c)}/advanced`}>
                      <button className="btn-level">Advanced</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="about" className="section" style={{ marginTop: 30 }}>
          <h2>About SwaraSadhana</h2>
          <p className="small-muted">
            SwaraSadhana organizes freely available tutorial videos into curated
            learning paths. Each course contains lessons grouped by level so
            learners can progress step-by-step and track completions.
          </p>
        </section>

        {/* Why modal */}
        {showWhy && (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 120,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.35)",
              }}
              onClick={closeWhy}
            ></div>
            <div
              style={{
                background: "white",
                padding: 20,
                borderRadius: 10,
                boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                maxWidth: 700,
                zIndex: 121,
              }}
            >
              <h3 style={{ marginTop: 0 }}>Why SwaraSadhana?</h3>
              <p style={{ color: "var(--muted)" }}>
                SwaraSadhana is a compact, practical music learning platform
                built for hobbyists and beginners. It curates short, high-quality
                YouTube tutorial videos into structured courses (Vocals, Flute,
                Guitar, Ukelele, Keyboard). Users can track lesson progress,
                mark lessons as done, and jump between levels. The goal is
                simple: provide clear, guided practice paths without the
                overhead of one-on-one lessons — ideal for learners who want
                reliable structure and measurable progress.
              </p>
              <div style={{ textAlign: "right" }}>
                <button className="btn-cta" onClick={closeWhy}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
