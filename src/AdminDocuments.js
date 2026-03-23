import React, { useEffect, useState } from "react";
import "./AdminDocuments.css";

const API_BASE = "http://localhost:8080";

export default function AdminDocuments() {
  const auditId = localStorage.getItem("adminAuditId") || "";

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [review, setReview] = useState({});
  const [savingDocId, setSavingDocId] = useState(null);

  const fetchDocs = async () => {
    try {
      setError("");
      setLoading(true);

      if (!auditId) {
        setDocs([]);
        return;
      }

      const res = await fetch(`${API_BASE}/api/${auditId}/documents`);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setDocs([]);
        setError("Failed to fetch documents.");
        return;
      }

      const list = Array.isArray(data) ? data : [];
      setDocs(list);

      const init = {};
      list.forEach((d) => {
        const id = d.id || d.documentId;
        if (!id) return;

        init[id] = {
          status: d.status || "Pending",
          comment: d.adminComment || "",
        };
      });
      setReview(init);
    } catch (e) {
      console.error(e);
      setDocs([]);
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const viewUrl = (docId) => `${API_BASE}/api/${auditId}/documents/${docId}`;

  const isImage = (type) => (type || "").startsWith("image/");
  const isPdf = (type) => (type || "").toLowerCase().includes("pdf");

  const onReviewChange = (docId, field, value) => {
    setReview((prev) => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || { status: "Pending", comment: "" }),
        [field]: value,
      },
    }));
  };

  const saveReview = async (docId) => {
    const payload = review[docId] || { status: "Pending", comment: "" };

    if (!auditId) {
      alert("Audit ID missing");
      return;
    }

    const status = (payload.status || "").trim();
    const comment = (payload.comment || "").trim();

    try {
      setSavingDocId(docId);

      if (status === "Rejected") {
        if (!comment) {
          alert("Please write rejection reason");
          setSavingDocId(null);
          return;
        }

        const endpoint = `${API_BASE}/api/${auditId}/documents/${docId}/reject`;

        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminComment: comment }),
        });

        const msg = await res.text();
        if (!res.ok) {
          alert(msg || "Failed to reject document");
          return;
        }

        alert(msg || "Document rejected ✅");
        await fetchDocs();
        return;
      }

      if (status === "Approved") {
        const endpoint = `${API_BASE}/api/${auditId}/documents/${docId}/approve`;

        const res = await fetch(endpoint, { method: "PUT" });

        const msg = await res.text();
        if (!res.ok) {
          alert(msg || "Failed to approve document");
          return;
        }

        alert(msg || "Document approved ✅");
        await fetchDocs();
        return;
      }

      alert("Please select Approved or Rejected");
    } catch (e) {
      console.error(e);
      alert("Server error while updating document");
    } finally {
      setSavingDocId(null);
    }
  };

  return (
    <div className="admin-docs-page">
      <h2 className="admin-docs-title">Documents for Audit #{auditId || "?"}</h2>

      {error ? <div className="admin-docs-error">{error}</div> : null}

      {loading ? (
        <p className="admin-docs-info">Loading...</p>
      ) : docs.length === 0 ? (
        <p className="admin-docs-info">No documents found.</p>
      ) : (
        <div className="admin-docs-table-wrap">
          <table className="admin-docs-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-name">File Name</th>
                <th className="col-type">File Type</th>
                <th className="col-status">Status</th>
                <th className="col-comment">Admin Comment</th>
                <th className="col-view">View</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>

            <tbody>
              {docs.map((d) => {
                const id = d.id || d.documentId;
                const row = review[id] || {
                  status: d.status || "Pending",
                  comment: d.adminComment || "",
                };

                return (
                  <tr key={id}>
                    <td className="col-id">
                      <span className="doc-id-badge">{id}</span>
                    </td>

                    <td className="file-name-cell col-name">
                      {d.originalFileName || d.fileName || "-"}
                    </td>

                    <td className="col-type">{d.fileType || d.docType || "-"}</td>

                    <td className="status-cell col-status">
                      <select
                        className="status-select"
                        value={row.status}
                        onChange={(e) => onReviewChange(id, "status", e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="comment-cell col-comment">
                      <textarea
                        className="comment-box"
                        value={row.comment}
                        onChange={(e) => onReviewChange(id, "comment", e.target.value)}
                        rows={2}
                        placeholder="Write reason / instructions for user..."
                      />
                    </td>

                    <td className="view-cell col-view">
                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelected({
                            id,
                            fileType: d.fileType || d.docType,
                            fileName: d.originalFileName || d.fileName,
                          })
                        }
                      >
                        View
                      </button>
                    </td>

                    <td className="action-cell col-action">
                      <button
                        className="save-btn"
                        onClick={() => saveReview(id)}
                        disabled={savingDocId === id}
                      >
                        {savingDocId === id ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="preview-overlay" onClick={() => setSelected(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <div className="preview-title">
                {selected.fileName || "Document"} (ID: {selected.id})
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>

            <div className="preview-body">
              {isPdf(selected.fileType) ? (
                <iframe
                  title="pdf-view"
                  src={viewUrl(selected.id)}
                  className="preview-frame"
                />
              ) : isImage(selected.fileType) ? (
                <img
                  alt="preview"
                  src={viewUrl(selected.id)}
                  className="preview-image"
                />
              ) : (
                <iframe
                  title="file-view"
                  src={viewUrl(selected.id)}
                  className="preview-frame"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}