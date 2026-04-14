import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminHome() {
  const navigate = useNavigate();

  const [pendingAudits, setPendingAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // edit state
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  // ✅ FETCH WITH PAGE SUPPORT
  const fetchPendingAudits = async (pageNumber = 0) => {
  try {
    setLoading(true);

    const res = await fetch(
      `http://localhost:8080/api/audit/pending?page=${pageNumber}&size=5`
    );

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = await res.json();

    console.log("API RESPONSE:", data); // ✅ DEBUG

    // SAFE DATA HANDLING (main fix)
    const list = data?.content ?? [];

    setPendingAudits(list);
    setTotalPages(data?.totalPages ?? 0);
    setPage(data?.number ?? 0);

    const init = {};
    list.forEach((a) => {
      init[a.auditId] = {
        assignedAuditor: a.assignedAuditor || "",
        adminComment: a.adminComment || "",
        status: a.status || "pending",
      };
    });

    setEdits(init);
  } catch (err) {
    console.error("Fetch Error:", err);
    setPendingAudits([]); // prevents blank screen
  } finally {
    setLoading(false);
  }
};
  // load first page
  useEffect(() => {
    fetchPendingAudits(0);
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
    const selectedStatus = String(payload.status || "pending").toLowerCase();

    if (selectedStatus !== "rejected" && !payload.assignedAuditor?.trim()) {
      alert("Please assign an auditor before saving.");
      return;
    }

    try {
      setSavingId(auditId);

      const endpoint =
        selectedStatus === "rejected"
          ? `http://localhost:8080/api/audit/reject/${auditId}`
          : `http://localhost:8080/api/audit/pending/Assigned/${auditId}`;

      const body =
        selectedStatus === "rejected"
          ? { adminComment: payload.adminComment, status: "Rejected" }
          : {
              assignedAuditor: payload.assignedAuditor,
              adminComment: payload.adminComment,
              status: payload.status || "pending",
            };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const msg = await res.text();

      if (!res.ok) {
        alert(msg || "Failed to save");
        return;
      }

      alert(msg || "Saved ✅");

      // reload current page
      await fetchPendingAudits(page);
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
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Email</th>
                  <th>Audit Type</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>Assign Auditor</th>
                  <th>Admin Comment</th>
                  <th>Documents</th>
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

                      <td>
                        <input
                          className="admin-input"
                          value={row.assignedAuditor}
                          onChange={(e) =>
                            onEditChange(
                              audit.auditId,
                              "assignedAuditor",
                              e.target.value
                            )
                          }
                        />

                        <select
                          value={row.status}
                          onChange={(e) =>
                            onEditChange(
                              audit.auditId,
                              "status",
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="Assigned">Assigned</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      <td>
                        <textarea
                          className="admin-textarea"
                          value={row.adminComment}
                          onChange={(e) =>
                            onEditChange(
                              audit.auditId,
                              "adminComment",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <button
                          className="documents-btn"
                          onClick={() => openDocuments(audit.auditId)}
                        >
                          Documents
                        </button>
                      </td>

                      <td>
                        <button
                          className="save-btn"
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

          {/* ✅ PAGINATION BUTTONS */}
          <div className="pagination">

  {/* PREVIOUS BUTTON */}
  <button
    className="page-btn"
    disabled={page === 0}
    onClick={() => fetchPendingAudits(page - 1)}
  >
    ← Prev
  </button>

  {/* PAGE NUMBERS */}
  {[...Array(totalPages)].map((_, index) => {
    // show only nearby pages
    if (
      index === 0 ||
      index === totalPages - 1 ||
      Math.abs(index - page) <= 1
    ) {
      return (
        <button
          key={index}
          className={`page-btn ${page === index ? "active" : ""}`}
          onClick={() => fetchPendingAudits(index)}
        >
          {index + 1}
        </button>
      );
    }

    // show dots
    if (
      index === page - 2 ||
      index === page + 2
    ) {
      return <span key={index} className="dots">...</span>;
    }

    return null;
  })}

  {/* NEXT BUTTON */}
  <button
    className="page-btn"
    disabled={page === totalPages - 1}
    onClick={() => fetchPendingAudits(page + 1)}
  >
    Next →
  </button>

</div>
        </>
      )}
    </section>
  );
}