import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { getTutorials, getProgress, markProgress, unmarkProgress } from "../services/api";

function safeYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
    if (u.hostname && u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : null;
  } catch (e) {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{5,})/);
    return m ? m[1] : null;
  }
}

export default function CoursePage({ user }){
  const { course, level } = useParams();
  const [tutorials, setTutorials] = useState([]);
  const [progress, setProgress] = useState([]);
  const userId = user?.id;

  useEffect(()=>{
    async function load(){
      try {
        const t = await getTutorials(course, level);
        setTutorials(t || []);
      } catch (err) {
        console.error('load tutorials', err);
        setTutorials([]);
      }
      try {
        if (userId) {
          const p = await getProgress(userId);
          setProgress(p || []);
        } else {
          setProgress([]);
        }
      } catch (err) {
        console.error('load progress', err);
        setProgress([]);
      }
    }
    load();
  }, [course, level, userId]);

  const completedIds = new Set((progress || []).map(p=>p.tutorialId));

  const handleMark = async (tutorialId) => {
    if (!userId) { alert('Please login to track progress'); return; }
    try {
      const payload = { userId, tutorialId, completed: true };
      await markProgress(payload);
      setProgress(prev=>[...prev, payload]);
    } catch (err) {
      console.error('mark error', err);
      alert('Could not mark progress — check console.');
    }
  };

  const handleUnmark = async (tutorialId) => {
    if (!userId) return;
    try {
      await unmarkProgress(tutorialId, userId);
      setProgress(prev=>prev.filter(p=>p.tutorialId !== tutorialId));
    } catch (err) {
      console.error('unmark error', err);
      alert('Could not unmark progress — check console.');
    }
  };

  return (
    <div style={{padding:20, fontFamily:'Arial, sans-serif'}}>
      <h2>{course} — {level}</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16}}>
        {tutorials.length ? tutorials.map(t=>(
          <div key={t.id} style={{border:'1px solid rgba(255,255,255,0.06)', padding:12, borderRadius:8, background:'rgba(255,255,255,0.03)'}}>
            <h3 style={{marginTop:0, color:'#fff'}}>{t.title}</h3>
            <div style={{marginBottom:8}}>
              {safeYouTubeId(t.youtube) ? <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${safeYouTubeId(t.youtube)}`} title={t.title} frameBorder="0" allowFullScreen></iframe> : <div style={{padding:18, color:'#ddd'}}>Invalid or missing YouTube URL</div>}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{color:'#d1d5db'}}>{t.duration}</div>
              <button onClick={()=> completedIds.has(t.id) ? handleUnmark(t.id) : handleMark(t.id)} style={{padding:'8px 12px', background: completedIds.has(t.id) ? '#16a34a' : 'linear-gradient(90deg,#ff6b00,#ff9f43)', color:'#fff', border:'none', borderRadius:6, cursor:'pointer'}}>
                {completedIds.has(t.id) ? 'Completed ✓ (Undo)' : 'Mark as done'}
              </button>
            </div>
          </div>
        )) : <div style={{gridColumn:'1/-1', color:'#ddd'}}>No lessons found for this course / level.</div>}
      </div>
    </div>
  );
}
