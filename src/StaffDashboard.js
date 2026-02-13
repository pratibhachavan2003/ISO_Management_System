import React from "react";

export default function StaffDashboard() {
  const roleid = localStorage.getItem("roleid");

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h2>📌 Staff Dashboard</h2>

      {roleid === "3" && <p>Welcome Coordinator ✅</p>}
      {roleid === "4" && <p>Welcome Auditor ✅</p>}

      <p>This dashboard is common for both roles.</p>
    </div>
  );
}
