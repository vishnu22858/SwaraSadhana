// frontend/src/pages/Progress.jsx
import React, { useEffect, useState } from "react";
import { getProgress, getTutorials } from "../services/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Progress() {
  const [progress, setProgress] = useState([]); // raw progress entries
  const [tutorials, setTutorials] = useState([]); // all tutorials
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const userId = user?.id || user?._id || user?.userId || null;

  useEffect(() => {
    async function load() {
      if (!userId) return;
      try {
        const p = (await getProgress(userId)) || [];
        setProgress(p);
        const all = (await getTutorials()) || [];
        setTutorials(all);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [userId]);

  // Compute courses list from tutorials
  const courses = Array.from(new Set((tutorials || []).map((t) => t.course))).sort();

  // Aggregate totals & done per course
  const summaryByCourse = {};
  (tutorials || []).forEach((t) => {
    const course = t.course || "Unknown";
    if (!summaryByCourse[course]) summaryByCourse[course] = { course, total: 0, done: 0 };
    summaryByCourse[course].total += 1;
    // mark done if there is a progress entry matching this tutorial id
    const done = (progress || []).some((p) => p.tutorialId === t.id || p.tutorialId === t._id || p.tutorialId === String(t.id));
    if (done) summaryByCourse[course].done += 1;
  });

  const summaryArray = Object.values(summaryByCourse);

  // primary course from user
  const primary = user?.primaryInstrument || (courses.length ? courses[0] : null);

  // find primary summary (fallback if not present)
  const primarySummary = summaryArray.find((s) => s.course === primary) || { course: primary, total: 0, done: 0 };

  // other courses that have any completed lessons (done > 0)
  const otherSummaries = summaryArray.filter((s) => s.course !== primary && s.done > 0);

  const percent = (item) => (item.total ? Math.round((item.done / item.total) * 100) : 0);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={{ paddingTop: 20 }}>
        <h2>My Progress</h2>
        <div className="progress-container">
          {/* Primary course block */}
          {primary ? (
            <div className="progress-row" style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: 700 }}>{primarySummary.course}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  {primarySummary.done} of {primarySummary.total} lessons completed
                </div>
              </div>
              <div style={{ flex: 1, marginLeft: 16, marginRight: 16 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: percent(primarySummary) + "%" }}></div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to={`/course/${encodeURIComponent(primary)}/beginner`}>
                  <button className="link-btn">Jump to course</button>
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--muted)" }}>No primary course set.</div>
          )}

          {/* Other course progresses (only show courses where done > 0) */}
          {otherSummaries.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3>Other course progresses</h3>
              {otherSummaries.map((item) => (
                <div key={item.course} style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid rgba(11,18,32,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{item.course}</strong>
                      <div className="small-muted">
                        {item.done} of {item.total} lessons completed
                      </div>
                    </div>
                    <div style={{ width: "40%", marginLeft: 12 }}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: percent(item) + "%" }}></div>
                      </div>
                    </div>
                    <div style={{ marginLeft: 12 }}>
                      <Link to={`/course/${encodeURIComponent(item.course)}/beginner`}>
                        <button className="link-btn ghost">Jump to course</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* If no progress at all */}
          {summaryArray.length === 0 && <div style={{ color: "var(--muted)" }}>No progress yet.</div>}
        </div>
      </div>
    </div>
  );
}
