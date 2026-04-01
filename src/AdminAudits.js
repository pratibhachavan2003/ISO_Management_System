import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AuditManagementPage.css";

const AuditManagementPage = () => {

  const [assignedAudits, setAssignedAudits] = useState([]);
  const [inProgressAudits, setInProgressAudits] = useState([]);
  const [completedAudits, setCompletedAudits] = useState([]);

  const [activeSection, setActiveSection] = useState("assigned");

  // ================= FETCH DATA =================
  const fetchAudits = async () => {
    try {

      const assigned = await axios.get(
        "http://localhost:8080/api/audits?status=ASSIGNED"
      );

      const progress = await axios.get(
        "http://localhost:8080/api/audits?status=IN_PROGRESS"
      );

      const completed = await axios.get(
        "http://localhost:8080/api/audits?status=COMPLETED"
      );

      setAssignedAudits(assigned.data || []);
      setInProgressAudits(progress.data || []);
      setCompletedAudits(completed.data || []);

    } catch (error) {
      console.error("Error fetching audits:", error);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // ================= TABLE =================
  const renderTable = (title, audits) => (
    <div className="audit-section">
      <h2>{title}</h2>

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
          {audits.length === 0 ? (
            <tr>
              <td colSpan="8">No Records Found</td>
            </tr>
          ) : (
            audits.map((audit) => (
              <tr key={audit.auditId}>
                <td>{audit.auditId}</td>

                {/* FIXED FIELD */}
                <td>{audit.auditType}</td>

                {/* ARRAY DISPLAY */}
                <td>{audit.isoStandards?.join(", ")}</td>

                <td>{audit.preferredDate}</td>

                <td>{audit.auditLocation}</td>

                <td>
                  {audit.assignedAuditor || "Not Assigned"}
                </td>

                <td>{audit.duration}</td>

                <td className={`status ${audit.status?.toLowerCase()}`}>
                  {audit.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="audit-management-page">

      {/* ================= BUTTONS ================= */}
      <div className="audit-buttons">

        <button
          className={activeSection === "assigned" ? "active" : ""}
          onClick={() => setActiveSection("assigned")}
        >
          Assigned Audits
        </button>

        <button
          className={activeSection === "progress" ? "active" : ""}
          onClick={() => setActiveSection("progress")}
        >
          In Progress
        </button>

        <button
          className={activeSection === "completed" ? "active" : ""}
          onClick={() => setActiveSection("completed")}
        >
          Completed
        </button>

      </div>

      {/* ================= CONDITIONAL VIEW ================= */}
      {activeSection === "assigned" &&
        renderTable("Assigned Audits", assignedAudits)}

      {activeSection === "progress" &&
        renderTable("In Progress Audits", inProgressAudits)}

      {activeSection === "completed" &&
        renderTable("Completed Audits", completedAudits)}

    </div>
  );
};

export default AuditManagementPage;