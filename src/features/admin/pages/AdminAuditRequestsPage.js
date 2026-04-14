import React, { useEffect, useState } from "react";
import "./AdminAuditRequests.css";

const API_BASE = "http://localhost:8080";

export default function AdminAuditRequests() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/audit/pending`);
      const data = await res.json();
      setAudits(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateStatus = async (auditId, status) => {
    const adminComment = prompt("Admin Comment (optional):") || "";
    const assignedAuditor = status === "Approved" ? (prompt("Assigned Auditor (optional):") || "") : "";

    const endpoint =
      status === "Rejected"
        ? `${API_BASE}/api/audit/reject/${auditId}`
        : `${API_BASE}/api/audit/pending/Assigned/${auditId}`;

    const body =
      status === "Rejected"
        ? { adminComment, status }
        : { status, adminComment, assignedAuditor };

    await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    loadAll();
  };

  return (
    <div className="admin-audit-page">
      <h2 className="admin-title">📋 Audit Requests (Admin)</h2>

      {loading ? (
        <p className="admin-empty">Loading...</p>
      ) : audits.length === 0 ? (
        <p className="admin-empty">No requests.</p>
      ) : (
        <div className="admin-list">
          {audits.map((a) => (
            <div key={a.auditId} className="admin-card">
              <div className="admin-row">
                <div>
                  <div className="admin-type">{a.auditType}</div>
                  <div className="admin-sub">
                    Profile: <b>{a.profileId}</b> • Date: <b>{a.preferredDate || "-"}</b> • {a.auditLocation || "-"}
                  </div>
                </div>
                <span className={`badge ${String(a.status).toLowerCase()}`}>{a.status}</span>
              </div>

              <div className="admin-body">
                <div><b>Scope:</b> {a.scope || "-"}</div>
                <div><b>Notes:</b> {a.notes || "-"}</div>
                <div><b>Admin Comment:</b> {a.adminComment || "—"}</div>
                <div><b>Assigned Auditor:</b> {a.assignedAuditor || "Not assigned"}</div>
              </div>

              <div className="admin-actions">
                <button className="btn approve" onClick={() => updateStatus(a.auditId, "Approved")}>
                  Approve
                </button>
                <button className="btn reject" onClick={() => updateStatus(a.auditId, "Rejected")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}