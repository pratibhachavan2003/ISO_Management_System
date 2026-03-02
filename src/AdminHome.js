import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminHome() {
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

      // refresh pending list (if status changed to Approved/Rejected, it will disappear from pending)
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
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Email</th>
              <th>Audit Type</th>
              <th>Preferred Date</th>
              <th>Duration</th>
              <th>Location</th>

              {/* ✅ new columns */}
              <th>Assign Auditor</th>
              <th>Admin Comment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingAudits.map((audit) => {
              const row = edits[audit.auditId] || {
                assignedAuditor: "",
                adminComment: "",
                status: "pending",
              };

              return (
                <tr key={audit.auditId}>
                  <td>{audit.auditId}</td>
                  <td>{audit.loginEmail}</td>
                  <td>{audit.auditType}</td>
                  <td>{audit.preferredDate}</td>
                  <td>{audit.duration}</td>
                  <td>{audit.auditLocation}</td>

                  {/* ✅ Assign Auditor */}
                  <td style={{ minWidth: 180 }}>
                    <input
                      className="admin-input"
                      value={row.assignedAuditor}
                      onChange={(e) =>
                        onEditChange(audit.auditId, "assignedAuditor", e.target.value)
                      }
                      placeholder="Auditor name/email"
                    />
                    {/* optional status select */}
                    <select
                      className="admin-select"
                      value={row.status}
                      onChange={(e) =>
                        onEditChange(audit.auditId, "status", e.target.value)
                      }
                      style={{ marginTop: 6 }}
                    >
                      <option value="pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* ✅ Admin Comment */}
                  <td style={{ minWidth: 260 }}>
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

                  {/* ✅ Save */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-primary"
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
      )}
    </section>
  );
}