import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminHome() {
  const navigate = useNavigate();

  const [pendingAudits, setPendingAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // local edit state per row: { [auditId]: { assignedAuditor, adminComment, status } }
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  const fetchPendingAudits = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/pending");
      if (!res.ok) throw new Error("Failed to fetch audits");

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      setPendingAudits(list);

      // initialize edit state with existing values
      const init = {};
      list.forEach((a) => {
        init[a.auditId] = {
          assignedAuditor: a.assignedAuditor || "",
          adminComment: a.adminComment || "",
          status: a.status || "pending",
        };
      });
      setEdits(init);
    } catch (e) {
      console.error("Fetch error:", e);
      setPendingAudits([]);
      setEdits({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAudits();
  }, []);

  const onEditChange = (auditId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [auditId]: {
        ...prev[auditId],
        [field]: value,
      },
    }));
  };

  const openDocuments = (auditId) => {
    localStorage.setItem("adminAuditId", String(auditId));
    navigate("/admin/documents");
  };

  const saveReview = async (auditId) => {
    const payload = edits[auditId] || {};

    if (!payload.assignedAuditor?.trim()) {
      alert("Please assign an auditor before saving.");
      return;
    }

    try {
      setSavingId(auditId);

      const res = await fetch(
        `http://localhost:8080/api/pending/Assigned/${auditId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignedAuditor: payload.assignedAuditor,
            adminComment: payload.adminComment,
            status: payload.status || "pending",
          }),
        }
      );

      const msg = await res.text();

      if (!res.ok) {
        alert(msg || "Failed to save");
        return;
      }

      alert(msg || "Saved ✅");
      await fetchPendingAudits();
    } catch (e) {
      console.error(e);
      alert("Server error while saving");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="table-section">
      <h3 style={{ marginTop: 0 }}>Pending Audit Requests</h3>

      {loading ? (
        <p>Loading audits...</p>
      ) : pendingAudits.length === 0 ? (
        <p>No pending audits 🎉</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-email">User Email</th>
                <th className="col-type">Audit Type</th>
                <th className="col-date">Preferred Date</th>
                <th className="col-duration">Duration</th>
                <th className="col-location">Location</th>
                <th className="col-auditor">Assign Auditor</th>
                <th className="col-comment">Admin Comment</th>
                <th className="col-documents">Documents</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingAudits.map((audit) => {
                const row = edits[audit.auditId] || {
                  assignedAuditor: "",
                  adminComment: "",
                  status: "pending",
                };

                const statusClass = `admin-select status-${String(
                  row.status || "pending"
                ).toLowerCase()}`;

                return (
                  <tr key={audit.auditId}>
                    <td className="col-id">{audit.auditId}</td>
                    <td className="col-email">{audit.loginEmail}</td>
                    <td className="col-type">{audit.auditType}</td>
                    <td className="col-date">{audit.preferredDate}</td>
                    <td className="col-duration">{audit.duration}</td>
                    <td className="col-location">{audit.auditLocation}</td>

                    <td className="col-auditor">
                      <div className="auditor-stack">
                        <input
                          className="admin-input"
                          value={row.assignedAuditor}
                          onChange={(e) =>
                            onEditChange(audit.auditId, "assignedAuditor", e.target.value)
                          }
                          placeholder="Auditor name/email"
                        />

                        <select
                          className={statusClass}
                          value={row.status}
                          onChange={(e) =>
                            onEditChange(audit.auditId, "status", e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    <td className="col-comment">
                      <textarea
                        className="admin-textarea"
                        value={row.adminComment}
                        onChange={(e) =>
                          onEditChange(audit.auditId, "adminComment", e.target.value)
                        }
                        rows={3}
                        placeholder="Write comment for auditor/user..."
                      />
                    </td>

                    <td className="col-documents documents-cell">
                      <button
                        className="documents-btn"
                        type="button"
                        onClick={() => openDocuments(audit.auditId)}
                      >
                        Documents
                      </button>
                    </td>

                    <td className="col-action action-cell">
                      <button
                        className="save-btn"
                        type="button"
                        onClick={() => saveReview(audit.auditId)}
                        disabled={savingId === audit.auditId}
                      >
                        {savingId === audit.auditId ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}