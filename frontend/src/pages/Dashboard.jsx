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
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
        });

        const data = await response.json();
        setData(data);

      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: "100px", textAlign: "center", color: "#64748B" }}>Loading dashboard...</div>;

  // Default Values
  const streak = data?.streak || 0;
  const recentMoods = data?.recent_moods || [];
  const recentJournals = data?.recent_journals || [];
  const riskLevel = recentMoods[0]?.risk_level || "No data yet";
  const recommendation = recentMoods[0]?.recommendation || "Take an assessment to get suggestions.";

  // ✅ NEW: Simple trend logic
  const getTrend = () => {
    if (recentMoods.length < 2) return "Not enough data";

    const last = recentMoods[0]?.score || 0;
    const prev = recentMoods[1]?.score || 0;

    if (last > prev) return "Improving";
    if (last < prev) return "Declining";
    return "Stable";
  };

  // ✅ NEW: Simple reason logic (use multiple inputs later if available)
  const getReason = () => {
    if (riskLevel.includes("High")) return "High stress or low sleep detected";
    if (riskLevel.includes("Moderate")) return "Some imbalance in daily routine";
    if (riskLevel.includes("Low")) return "Your habits are balanced";
    return "Complete an assessment to see insights";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFB", padding: "40px 24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Current Streak", value: `${streak} Days`, icon: "🔥" },
            { label: "Total Entries", value: recentJournals.length, icon: "📝" },
            { label: "Latest Status", value: riskLevel, icon: "📊" },
            { label: "Trend", value: getTrend(), icon: "📈" } // ✅ replaced useless “goal”
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #F1F5F9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "4px" }}>{stat.icon} {stat.label}</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#264653" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "40px", borderRadius: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h3 style={{ fontWeight: 600, color: "#264653", fontSize: "1.5rem" }}>Mood & Stress Trend</h3>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8", backgroundColor: "#F1F5F9", padding: "6px 12px", borderRadius: "100px", fontWeight: "600" }}>
              {getTrend()} {/* ✅ meaningful */}
            </span>
          </div>

          <div style={{ height: "320px", width: "100%" }}>
            {recentMoods.length > 0 ? (
              <DriftChart data={recentMoods} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", border: "2px dashed #F1F5F9", borderRadius: "20px" }}>
                No data yet. Take an assessment to see your trend.
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", marginBottom: "32px" }}>

          {/* Activity */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "28px", border: "1px solid #F1F5F9", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h4 style={{ marginBottom: "16px", fontWeight: 600, color: "#264653", fontSize: "1.1rem" }}>Your Activity</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: "1.6" }}>
              {recentJournals.length > 0
                ? `You have added ${recentJournals.length} entries. Regular tracking improves accuracy.`
                : "No entries yet. Start by writing a short note about your day."}
            </p>
          </div>

          {/* WHY + Suggestion (merged → better UX) */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "28px", border: "1px solid #F1F5F9", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h4 style={{ marginBottom: "16px", fontWeight: 600, color: "#264653", fontSize: "1.1rem" }}>Insight</h4>

            <div style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "10px" }}>
              <strong>Level:</strong> {riskLevel}
            </div>

            {/* WHY */}
            <div style={{ marginBottom: "12px", color: "#64748B" }}>
              <strong>Reason:</strong> {getReason()}
            </div>

            {/* ACTION */}
            <div style={{ padding: "14px", backgroundColor: "#F8FAFB", borderRadius: "16px", borderLeft: "4px solid #2A9D8F", fontStyle: "italic", color: "#475569" }}>
              {recommendation}
            </div>
          </div>

        </div>

        {/* Daily Tasks */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "28px", border: "1px solid #F1F5F9" }}>
          <h4 style={{ marginBottom: "16px", fontWeight: 600, color: "#264653" }}>Daily Checklist</h4>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {["Take Assessment", "Journal", "Breathing", "Relax"].map((task, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F8FAFB", padding: "10px 16px", borderRadius: "12px", fontSize: "0.9rem", color: "#475569" }}>
                <input type="checkbox" style={{ accentColor: "#2A9D8F" }} /> {task}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}