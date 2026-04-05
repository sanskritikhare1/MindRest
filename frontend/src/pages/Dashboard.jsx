import React, { useEffect, useState } from "react";
import DriftChart from "../components/Driftchart";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/dashboard", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        });
        const result = await response.json();
        setData(result);
      } catch (err) { console.error("Failed", err); }
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={styles.loader}>Initializing...</div>;

  const recentMoods = data?.recent_moods || [];
  const riskLevel = recentMoods[0]?.risk_level || "Low";
  const score = recentMoods[0]?.score || 0;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* HEADER AREA */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>Rest is priority.</h1>
          <div style={styles.predictionCard}>
            <span style={{ fontSize: '18px' }}>🧠</span>
            <p style={styles.predSub}><b>PREDICTION:</b> High demand in 2h.</p>
          </div>
        </div>

        {/* TOP STATS - 4 COLS */}
        <div style={styles.topStatsRow}>
          {[
            { label: "Streak", value: `${data?.streak || 0} Days`, icon: "🔥" },
            { label: "Data Points", value: recentMoods.length, icon: "📊" },
            { label: "Load Level", value: riskLevel, icon: "⚡" },
            { label: "Trend", value: "Stable", icon: "📈" }
          ].map((stat, i) => (
            <div key={i} style={styles.miniStatCard}>
              <p style={styles.miniLabel}>{stat.icon} {stat.label}</p>
              <p style={styles.miniValue}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID - STRETCH TO FIT SCREEN */}
        <div style={styles.dashboardGrid}>

          <div style={{ ...styles.card, gridArea: 'chart' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={styles.cardTitle}>Exhaustion Trend</h3>
              <span style={{ fontSize: '10px', color: '#2A9D8F' }}>● {riskLevel.toUpperCase()}</span>
            </div>
            <div style={{ height: '200px' }}>
              {recentMoods.length > 0 ? <DriftChart data={recentMoods} /> : <div style={styles.empty}>No data yet.</div>}
            </div>
          </div>

          <div style={{ ...styles.card, gridArea: 'load', textAlign: 'center' }}>
            <h3 style={styles.cardTitle}>Neural Load</h3>
            <div style={styles.gaugeWrapper}>
              <svg width="110" height="110">
                <circle cx="55" cy="55" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                <circle cx="55" cy="55" r="40" fill="transparent" stroke="#2A9D8F" strokeWidth="8"
                  strokeDasharray={251} strokeDashoffset={251 - (score * 25)} strokeLinecap="round"
                  transform="rotate(-90 55 55)" />
              </svg>
              <div style={styles.gaugeCenterText}>{score * 10}%</div>
            </div>
            <p style={{ fontSize: '10px', color: '#94A3B8' }}>Optimal Zone</p>
          </div>

          <div style={{ ...styles.aiInsightCard, gridArea: 'insight' }}>
            <p style={styles.aiTag}>NEURAL AI INSIGHT</p>
            <h2 style={styles.aiQuote}>"Your neural markers suggest a shift toward subconscious problem solving."</h2>
            <button style={styles.recoveryBtn}>Initiate Recovery</button>
          </div>

          <div style={{ ...styles.card, gridArea: 'reset' }}>
            <h3 style={styles.cardTitle}>Quick Reset</h3>
            <div style={styles.checkList}>
              {["Hydration", "Visual Reset", "Breathing"].map((task, i) => (
                <div key={i} style={styles.checkItem}><input type="checkbox" /> {task}</div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", backgroundColor: "#F8FAFB", padding: "15px", boxSizing: 'border-box', overflow: 'hidden' },
  wrapper: { maxWidth: "1200px", margin: "0 auto", height: '100%', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  mainTitle: { fontSize: '1.6rem', fontWeight: '900', color: '#264653', margin: 0 },
  predictionCard: { backgroundColor: '#fff', padding: '8px 15px', borderRadius: '15px', display: 'flex', gap: '10px', border: '1px solid #F1F5F9' },
  predSub: { fontSize: '10px', color: '#64748B', margin: 0 },
  topStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' },
  miniStatCard: { backgroundColor: '#fff', padding: '10px 15px', borderRadius: '20px', border: '1px solid #F1F5F9' },
  miniLabel: { fontSize: '9px', color: '#94A3B8', margin: 0, fontWeight: '700' },
  miniValue: { fontSize: '1rem', fontWeight: '800', color: '#264653', margin: 0 },

  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridTemplateRows: '1.2fr 1fr',
    gridTemplateAreas: `
      "chart load"
      "insight reset"
    `,
    gap: '15px',
    flex: 1
  },

  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '30px', border: '1px solid #F1F5F9' },
  aiInsightCard: { background: '#0a2528', padding: '20px', borderRadius: '30px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  cardTitle: { fontSize: '0.9rem', fontWeight: '800', margin: 0, color: '#264653' },
  gaugeWrapper: { position: 'relative', display: 'flex', justifyContent: 'center', margin: '10px 0' },
  gaugeCenterText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: '900', fontSize: '14px', color: '#264653' },
  aiTag: { fontSize: '8px', color: '#2A9D8F', fontWeight: '800', textAlign: 'right' },
  aiQuote: { fontSize: '0.95rem', fontWeight: '300', fontStyle: 'italic', margin: '10px 0', lineHeight: '1.4' },
  recoveryBtn: { backgroundColor: '#2A9D8F', color: '#fff', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  checkList: { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' },
  checkItem: { background: '#F8FAFB', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'center' },
  empty: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', fontSize: '12px', border: '1px dashed #F1F5F9', borderRadius: '15px' }
};