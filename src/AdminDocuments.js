import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function AdminDocuments() {
  const auditId = localStorage.getItem("adminAuditId") || "";

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null); // { id, fileType, fileName }
  const [error, setError] = useState("");

  // ✅ local review inputs per docId
  // { [docId]: { status: "Pending|Approved|Rejected", comment: "" } }
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

      // ✅ init review state from backend values if present
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Your working view endpoint
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

  const status = (payload.status || "").trim(); // "Approved" / "Rejected"
  const comment = (payload.comment || "").trim();

  try {
    setSavingDocId(docId);

    // ✅ REJECT
    if (status === "Rejected") {
      if (!comment) {
        alert("Please write rejection reason");
        setSavingDocId(null); // ✅ very important
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

    // ✅ APPROVE (NO JSON BODY)
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

    // ✅ Pending or invalid
    alert("Please select Approved or Rejected");
  } catch (e) {
    console.error(e);
    alert("Server error while updating document");
  } finally {
    setSavingDocId(null);
  }
};

      

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Documents for Audit #{auditId || "?"}</h2>

      {error ? <div style={{ color: "red", marginBottom: 12 }}>{error}</div> : null}

      {loading ? (
        <p>Loading...</p>
      ) : docs.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>File Type</th>
              <th>Status</th>
              <th>Admin Comment</th>
              <th>View</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {docs.map((d) => {
              const id = d.id || d.documentId;
              const row = review[id] || { status: d.status || "Pending", comment: d.adminComment || "" };

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{d.originalFileName || d.fileName || "-"}</td>
                  <td>{d.fileType || "-"}</td>

                  {/* ✅ Status dropdown */}
                  <td style={{ minWidth: 140 }}>
                    <select
                      value={row.status}
                      onChange={(e) => onReviewChange(id, "status", e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* ✅ Admin comment */}
                  <td style={{ minWidth: 260 }}>
                    <textarea
                      value={row.comment}
                      onChange={(e) => onReviewChange(id, "comment", e.target.value)}
                      rows={2}
                      placeholder="Write reason / instructions for user..."
                      style={{ width: "100%" }}
                    />
                  </td>

                  {/* ✅ View */}
                  <td>
                    <button
                      onClick={() =>
                        setSelected({
                          id,
                          fileType: d.fileType,
                          fileName: d.originalFileName || d.fileName,
                        })
                      }
                    >
                      View
                    </button>
                  </td>

                  {/* ✅ Save review */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button onClick={() => saveReview(id)} disabled={savingDocId === id}>
                      {savingDocId === id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ✅ MODAL PREVIEW */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 900,
              height: "85vh",
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {selected.fileName || "Document"} (ID: {selected.id})
              </div>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ flex: 1 }}>
              {isPdf(selected.fileType) ? (
                <iframe
                  title="pdf-view"
                  src={viewUrl(selected.id)}
                  style={{ width: "100%", height: "100%", border: 0 }}
                />
              ) : isImage(selected.fileType) ? (
                <img
                  alt="preview"
                  src={viewUrl(selected.id)}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <iframe
                  title="file-view"
                  src={viewUrl(selected.id)}
                  style={{ width: "100%", height: "100%", border: 0 }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}