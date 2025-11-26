import React from "react";

export default function TutorialCard({ tut, completed, handleMarkDone, handleUnmarkDone }) {
  if (!tut) return null;
  const url = tut.youtube || "";
  const videoId = (() => {
    try {
      const u = new URL(url);
      return u.searchParams.get("v") || u.pathname.split('/').pop();
    } catch { return null; }
  })();

  return (
    <div style={{border:'1px solid rgba(255,255,255,0.06)', padding:12, borderRadius:8, background:'rgba(255,255,255,0.03)'}}>
      <h3 style={{color:'#fff'}}>{tut.title}</h3>
      {videoId ? <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${videoId}`} title={tut.title} frameBorder="0" allowFullScreen></iframe> : <div>Invalid URL</div>}
      <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
        <div style={{color:'#d1d5db'}}>{tut.duration}</div>
        <button onClick={()=> completed ? handleUnmarkDone(tut.id) : handleMarkDone(tut.id)} style={{padding:'8px 12px', background: completed ? '#16a34a' : 'linear-gradient(90deg,#ff6b00,#ff9f43)', color:'#fff', border:'none', borderRadius:6}}>
          {completed ? 'Completed ✓ (Undo)' : 'Mark as done'}
        </button>
      </div>
    </div>
  );
}
