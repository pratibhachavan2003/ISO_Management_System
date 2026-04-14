import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AuditManagementPage.css";

const AuditManagementPage = () => {

  const [audits, setAudits] = useState([]);
  const [activeStatus, setActiveStatus] = useState("ASSIGNED");
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchAudits = async (status) => {
    try {
      setLoading(true);

      const url =
        status === "NON_CONFORMITIES"
          ? "http://localhost:8080/api/audit/rejected"
          : `http://localhost:8080/api/audit/audits?status=${status}`;

      const res = await axios.get(url);

      console.log("API DATA:", res.data);

      setAudits(res.data || []);
      setActiveStatus(status);

    } catch (error) {
      console.error("Error fetching audits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits("ASSIGNED");
  }, []);

  // ================= UI =================
  return (
    <div className="audit-management-page">

      <div className="audit-section" style={{ marginBottom: "16px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Audit Management</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Review assigned audits, progress, completed audits, and rejected audits under Non Conformities.
        </p>
      </div>

      {/* BUTTONS */}
      <div className="audit-buttons">
        <button
          className={activeStatus === "ASSIGNED" ? "active" : ""}
          onClick={() => fetchAudits("ASSIGNED")}
        >
          Assigned
        </button>

        <button
          className={activeStatus === "IN_PROGRESS" ? "active" : ""}
          onClick={() => fetchAudits("IN_PROGRESS")}
        >
          In Progress
        </button>

        <button
          className={activeStatus === "COMPLETED" ? "active" : ""}
          onClick={() => fetchAudits("COMPLETED")}
        >
          Completed
        </button>

        <button
          className={activeStatus === "NON_CONFORMITIES" ? "active" : ""}
          onClick={() => fetchAudits("NON_CONFORMITIES")}
        >
          Non Conformities
        </button>
      </div>

      {/* TABLE */}
      <table className="audit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Audit Type</th>
            <th>ISO Standard</th>
            <th>Date</th>
            <th>Location</th>
            <th>Auditor</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8">Loading...</td>
            </tr>
          ) : audits.length === 0 ? (
            <tr>
              <td colSpan="8">No Records Found</td>
            </tr>
          ) : (
            audits.map((audit) => (
              <tr key={audit.auditId}>
                <td>{audit.auditId}</td>
                <td>{audit.auditType}</td>
                <td>{audit.isoStandards?.join(", ")}</td>
                <td>{audit.preferredDate}</td>
                <td>{audit.auditLocation}</td>
                <td>{audit.assignedAuditor || "Not Assigned"}</td>
                <td>{audit.duration}</td>
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