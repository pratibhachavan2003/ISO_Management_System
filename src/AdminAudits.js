import React, { useEffect, useState } from "react";
import axios from "axios";

const AuditManagementPage = () => {

  const [assignedAudits, setAssignedAudits] = useState([]);
  const [inProgressAudits, setInProgressAudits] = useState([]);
  const [completedAudits, setCompletedAudits] = useState([]);

  // ---------------- FETCH DATA ----------------
  const fetchAudits = async () => {
    try {
      const assigned = await axios.get(
        "http://localhost:8080/api/audits/assigned-audits"
      );

      const progress = await axios.get(
        "http://localhost:8080/api/audits/in-progress-audits"
      );

      const completed = await axios.get(
        "http://localhost:8080/api/audits/completed-audits"
      );

      setAssignedAudits(assigned.data);
      setInProgressAudits(progress.data);
      setCompletedAudits(completed.data);

    } catch (error) {
      console.error("Error fetching audits:", error);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // ---------------- TABLE UI ----------------
  const renderTable = (title, audits) => (
    <div className="audit-section">
      <h2>{title}</h2>

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
          {audits.length === 0 ? (
            <tr>
              <td colSpan="5">No Records Found</td>
            </tr>
          ) : (
            audits.map((audit) => (
              <tr key={audit.id}>
                <td>{audit.id}</td>
                <td>{audit.auditName}</td>
                <td>{audit.auditDate}</td>
                <td>{audit.assignedAuditor}</td>
                <td>{audit.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="audit-management-page">

      {renderTable("Assigned Audits", assignedAudits)}

      {renderTable("In Progress Audits", inProgressAudits)}

      {renderTable("Completed Audits", completedAudits)}

    </div>
  );
};

export default AuditManagementPage;