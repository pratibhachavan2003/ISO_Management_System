import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAudits.css";

const AuditManagementPage = () => {

  const [audits, setAudits] = useState([]);
  const [counts, setCounts] = useState({
    assignedAudits: 0,
    inProgressAudits: 0,
    completedAudits: 0,
  });

  const [activeTab, setActiveTab] = useState("ASSIGNED");
  const [loading, setLoading] = useState(false);

  // ================= FETCH COUNTS =================
  const fetchCounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/counts"
      );
      setCounts(res.data);
    } catch (err) {
      console.error("Error fetching counts", err);
    }
  };

  // ================= FETCH AUDITS =================
  const fetchAuditsByStatus = async (status) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/audits?status=${status}`
      );

      setAudits(res.data || []);
      setActiveTab(status);

    } catch (err) {
      console.error("Error fetching audits", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchCounts();
    fetchAuditsByStatus("ASSIGNED");
  }, []);

  return (
    <div className="audit-management-page">

      {/* ===== STATUS CARDS ===== */}
      <div className="audit-cards">

        <div
          className={`audit-card ${activeTab === "ASSIGNED" ? "active" : ""}`}
          onClick={() => fetchAuditsByStatus("ASSIGNED")}
        >
          <h3>Assigned Audits</h3>
          <p>{counts.assignedAudits}</p>
        </div>

        <div
          className={`audit-card ${activeTab === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => fetchAuditsByStatus("IN_PROGRESS")}
        >
          <h3>In Progress</h3>
          <p>{counts.inProgressAudits}</p>
        </div>

        <div
          className={`audit-card ${activeTab === "COMPLETED" ? "active" : ""}`}
          onClick={() => fetchAuditsByStatus("COMPLETED")}
        >
          <h3>Completed</h3>
          <p>{counts.completedAudits}</p>
        </div>

      </div>

      {/* ===== TABLE ===== */}
      <table className="audit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Audit Name</th>
            <th>Date</th>
            <th>Auditor</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : audits.length === 0 ? (
            <tr>
              <td colSpan="5">No Records Found</td>
            </tr>
          ) : (
            audits.map((audit) => (
              <tr key={audit.id}>
                <td>{audit.id}</td>
                <td>{audit.auditName}</td>
                <td>{audit.auditDate}</td>
                <td>{audit.assignedAuditor || "Not Assigned"}</td>
                <td>{audit.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
};

export default AuditManagementPage;