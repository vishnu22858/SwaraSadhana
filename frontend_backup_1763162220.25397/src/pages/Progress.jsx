import React, {useEffect, useState} from "react";
import { getProgress, getTutorials } from "../services/api";
import { Link } from "react-router-dom";

export default function Progress(){
  const [progress, setProgress] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = user?.id;

  useEffect(()=>{
    async function load(){
      if (!userId) return;
      try {
        const p = await getProgress(userId);
        setProgress(p || []);
        const all = await getTutorials();
        setTutorials(all || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  },[userId]);

  const courses = Array.from(new Set((tutorials || []).map(t=>t.course))).sort();

  const calc = (course) => {
    const courseTuts = (tutorials || []).filter(t=>t.course===course);
    const total = courseTuts.length;
    const done = courseTuts.filter(ct => (progress || []).some(p=>p.tutorialId === ct.id)).length;
    const pct = total ? Math.round((done/total)*100) : 0;
    return { total, done, pct };
  };

  return (
    <div style={{padding:20, fontFamily:'Arial, sans-serif'}}>
      <h2>My Progress</h2>
      <div className="progress-container">
        {courses.length ? courses.map(course=>{
          const {total, done, pct} = calc(course);
          return (
            <div key={course} className="progress-row">
              <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{fontWeight:700}}>{course}</div>
                <div style={{fontSize:13,color:'var(--muted)'}}>{done} of {total} lessons completed</div>
              </div>
              <div style={{flex:1, marginLeft:16, marginRight:16}}>
                <div className="progress-bar"><div className="progress-fill" style={{width: pct + '%'}}></div></div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <Link to={`/course/${encodeURIComponent(course)}/beginner`}><button className="link-btn">Jump to course</button></Link>
              </div>
            </div>
          );
        }) : <div style={{color:'var(--muted)'}}>No progress yet.</div>}
      </div>
    </div>
  );
}
