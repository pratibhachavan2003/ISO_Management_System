import React, { useMemo, useState } from "react";
import "./AdminAudits.css";

const emptyAudit = (label) => ({
  label,                 // "Audit 1" / "Audit 2"
  status: "Pending",     // Pending | In Progress | Completed
  date: "",              // YYYY-MM-DD
  remarks: "",
});

function pillClass(status) {
  if (status === "Completed") return "ok";
  if (status === "In Progress") return "warn";
  return "pending";
}

export default function AdminAudits() {
  // Demo users (later you can fetch from API)
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "Admin",
      lastName: "User",
      email: "admin@iso.com",
      audits: [emptyAudit("Audit 1"), emptyAudit("Audit 2")],
    },
    {
      id: 2,
      firstName: "Deepak",
      lastName: "Kumar",
      email: "deepak@iso.com",
      audits: [
        { ...emptyAudit("Audit 1"), status: "Completed", date: "2026-02-05", remarks: "All OK" },
        { ...emptyAudit("Audit 2"), status: "Pending", date: "", remarks: "" },
      ],
    },
    {
      id: 3,
      firstName: "Employee",
      lastName: "One",
      email: "employee1@iso.com",
      audits: [
        { ...emptyAudit("Audit 1"), status: "In Progress", date: "2026-02-09", remarks: "Evidence pending" },
        { ...emptyAudit("Audit 2"), status: "Pending", date: "", remarks: "" },
      ],
    },
  ]);

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  // editing = { userId, auditIndex, label, status, date, remarks }

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.id} ${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  const openEdit = (userId, auditIndex) => {
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    const a = u.audits[auditIndex];
    setEditing({
      userId,
      auditIndex,
      label: a.label,
      status: a.status,
      date: a.date,
      remarks: a.remarks,
    });
  };

  const saveEdit = () => {
    if (!editing) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== editing.userId) return u;
        const audits = [...u.audits];
        audits[editing.auditIndex] = {
          ...audits[editing.auditIndex],
          status: editing.status,
          date: editing.date,
          remarks: editing.remarks,
        };
        return { ...u, audits };
      })
    );

    setEditing(null);
  };

  return (
    <div className="audits-page">
      <div className="audits-head">
        <div>
          <h2>🧪 Audit Management</h2>
          <p className="muted">Audit 1 and Audit 2 tracking for each user.</p>
        </div>

        <input
          className="audit-search"
          placeholder="Search by name / email / id..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="audits-grid">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          filteredUsers.map((u) => (
            <div className="user-audit-card" key={u.id}>
              <div className="user-line">
                <div>
                  <div className="user-title">
                    {u.firstName} {u.lastName} <span className="user-id">#{u.id}</span>
                  </div>
                  <div className="user-sub">{u.email}</div>
                </div>
              </div>

              <div className="audit-two">
                {u.audits.map((a, idx) => (
                  <div className="audit-box" key={a.label}>
                    <div className="audit-box-head">
                      <div className="audit-name">{a.label}</div>
                      <span className={`status-pill ${pillClass(a.status)}`}>{a.status}</span>
                    </div>

                    <div className="audit-row">
                      <span className="audit-k">Date</span>
                      <span className="audit-v">{a.date || "—"}</span>
                    </div>

                    <div className="audit-row">
                      <span className="audit-k">Remarks</span>
                      <span className="audit-v">{a.remarks?.trim() ? a.remarks : "—"}</span>
                    </div>

                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(u.id, idx)}>
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>
                Edit {editing.label} (User #{editing.userId})
              </h3>
              <button className="icon-btn" onClick={() => setEditing(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <label>
                Status
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </label>

              <label>
                Remarks
                <textarea
                  rows={4}
                  value={editing.remarks}
                  onChange={(e) => setEditing({ ...editing, remarks: e.target.value })}
                  placeholder="Write remarks..."
                />
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
