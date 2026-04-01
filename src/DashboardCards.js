import React from "react";

function DashboardCards() {
  return (
    <div className="cards">
      <div className="card">
        <h4>Total Users</h4>
        <p>120</p>
      </div>
      <div className="card">
        <h4>ISO Documents</h4>
        <p>85</p>
      </div>
      <div className="card">
        <h4>Open NCs</h4>
        <p>12</p>
      </div>
      <div className="card">
        <h4>Upcoming Audits</h4>
        <p>3</p>
      </div>
    </div>
  );
}

export default DashboardCards;
