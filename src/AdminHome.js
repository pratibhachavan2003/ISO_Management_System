import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminHome() {
  // ✅ Default stats (fallback)
  const [stats, setStats] = useState({
    users: 120,
    documents: 85,
    ncs: 12,
    audits: 3,
  });
  const [loading, setLoading] = useState(false);

  // ✅ OPTIONAL: fetch real stats from backend (if you have)
  // Example endpoints:
  // /api/users/count
  // /api/documents/count
  // /api/nc/count
  // /api/audits/upcoming/count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // ✅ If you don't have these APIs, comment this block.
        // const [u, d, n, a] = await Promise.all([
        //   fetch("http://localhost:8080/api/users/count").then((r) => r.json()),
        //   fetch("http://localhost:8080/api/documents/count").then((r) => r.json()),
        //   fetch("http://localhost:8080/api/nc/count").then((r) => r.json()),
        //   fetch("http://localhost:8080/api/audits/upcoming/count").then((r) => r.json()),
        // ]);
        // setStats({
        //   users: u,
        //   documents: d,
        //   ncs: n,
        //   audits: a,
        // });

      } catch (e) {
        console.error("Stats fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <section className="dashboard-cards">
        <div className="stat-card">
          <p className="stat-label">Total Users</p>
          <h3 className="stat-value">{loading ? "..." : stats.users}</h3>
          <p className="stat-foot">Active users in system</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">ISO Documents</p>
          <h3 className="stat-value">{loading ? "..." : stats.documents}</h3>
          <p className="stat-foot">Policies, SOPs, Records</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Open NCs</p>
          <h3 className="stat-value">{loading ? "..." : stats.ncs}</h3>
          <p className="stat-foot">Need corrective action</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Upcoming Audits</p>
          <h3 className="stat-value">{loading ? "..." : stats.audits}</h3>
          <p className="stat-foot">Scheduled this month</p>
        </div>
      </section>

      {/* ✅ Extra Section (optional) */}
      <section className="table-section">
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-primary">Create Audit</button>
          <button className="btn">Add Document</button>
          <button className="btn">View NC Report</button>
        </div>
      </section>
    </>
  );
}
