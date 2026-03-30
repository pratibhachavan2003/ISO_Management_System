// src/UserNotifications.js
import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

const norm = (v) => (v == null ? "" : String(v)).trim();
const lower = (v) => norm(v).toLowerCase();

const chipStyle = (status) => {
  const s = lower(status);
  if (s === "approved")
    return { background: "rgba(34,197,94,.18)", border: "1px solid rgba(34,197,94,.35)" };
  if (s === "rejected")
    return { background: "rgba(239,68,68,.18)", border: "1px solid rgba(239,68,68,.35)" };
  return { background: "rgba(234,179,8,.18)", border: "1px solid rgba(234,179,8,.35)" };
};

export default function UserNotifications() {
  const loginEmail = localStorage.getItem("username") || "";

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [reUploading, setReUploading] = useState({});

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      if (!loginEmail) {
        setItems([]);
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/audit-details/user?loginEmail=${encodeURIComponent(loginEmail)}`
      );

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("Audit API failed:", res.status, t);
        setItems([]);
        return;
      }

      const data = await res.json().catch(() => []);
      const audits = Array.isArray(data) ? data : [];
      setItems(audits);
    } catch (e) {
      console.error("Notifications fetch error:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Re-upload rejected document
  const handleReUpload = async (auditId, docId, file) => {
    setReUploading((prev) => ({ ...prev, [docId]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);

      // ⚠️ keep this only if your backend mapping matches
      const res = await fetch(
        `${API_BASE}/api/audit/documents/${docId}/reupload`,
        { method: "PUT", body: formData }
      );

      const message = await res.text();
      if (!res.ok) throw new Error(message);

      alert("Document re-uploaded ✅ Admin will review again.");
      await fetchNotifications();
    } catch (e) {
      alert("Re-upload failed: " + (e?.message || "Unknown error"));
    } finally {
      setReUploading((prev) => ({ ...prev, [docId]: false }));
    }
  };

  return (
    <div className="products-wrap">
      <div className="products-header">
        <div>
          <h2 className="page-title">Notifications</h2>
          <div className="page-hint">Audit status + document status</div>
        </div>

        <button className="update-profile-btn" type="button" onClick={fetchNotifications}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="no-results">Loading notifications...</div>
      ) : items.length === 0 ? (
        <div className="no-results">No audits found.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((n) => {
            const auditId = n.auditId; // ✅ from your JSON
            const docsRaw = Array.isArray(n.documents) ? n.documents : [];

            const docs = docsRaw
              .map((d) => ({
                id: d.id,
                fileName: d.fileName || "-",
                docType: d.docType || "Document",
                status: norm(d.status) || "Pending",
                adminComment: d.adminComment || "",
              }))
              .filter((x) => x.id != null);

            return (
              <div
                key={auditId}
                style={{
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 14,
                  padding: 14,
                  background: "rgba(255,255,255,.06)",
                }}
              >
                {/* ===== Audit Header ===== */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 900 }}>
                    {n.auditType || "Audit Request"}
                    {n.preferredDate ? (
                      <span style={{ opacity: 0.8, fontWeight: 600 }}> • {n.preferredDate}</span>
                    ) : null}
                  </div>

                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12,
                      ...chipStyle(n.status),
                    }}
                  >
                    {n.status || "Pending"}
                  </span>
                </div>

                <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9, display: "grid", gap: 4 }}>
                  <div><b>Audit ID:</b> {auditId}</div>
                  <div><b>Location:</b> {n.auditLocation || "-"}</div>
                  <div><b>Duration:</b> {n.duration || "-"}</div>
                  <div>
                    <b>ISO:</b>{" "}
                    {Array.isArray(n.isoStandards) ? n.isoStandards.join(", ") : n.isoStandards || "-"}
                  </div>
                  {n.adminComment ? <div><b>Audit Comment:</b> {n.adminComment}</div> : null}
                </div>

                {/* ===== Documents ===== */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Documents</div>

                  {docs.length === 0 ? (
                    <div style={{ opacity: 0.85 }}>No documents uploaded yet.</div>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {docs.map((doc) => {
                        const s = lower(doc.status);

                        return (
                          <div
                            key={doc.id}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 12,
                              border:
                                s === "rejected"
                                  ? "1px solid rgba(239,68,68,0.35)"
                                  : s === "approved"
                                  ? "1px solid rgba(34,197,94,0.35)"
                                  : "1px solid rgba(234,179,8,0.35)",
                              background:
                                s === "rejected"
                                  ? "rgba(239,68,68,0.08)"
                                  : s === "approved"
                                  ? "rgba(34,197,94,0.08)"
                                  : "rgba(234,179,8,0.08)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 10,
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 900 }}>{doc.docType}</div>
                              <div style={{ fontSize: 12, opacity: 0.8 }}>{doc.fileName}</div>

                              {s === "rejected" && doc.adminComment ? (
                                <div style={{ marginTop: 6, fontSize: 12, color: "#ff6b6b", fontWeight: 800 }}>
                                  Reason: {doc.adminComment}
                                </div>
                              ) : null}
                            </div>

                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: 999,
                                  fontWeight: 900,
                                  fontSize: 12,
                                  ...chipStyle(doc.status),
                                }}
                              >
                                {doc.status}
                              </span>

                              {s === "rejected" ? (
                                <label
                                  style={{
                                    cursor: reUploading[doc.id] ? "not-allowed" : "pointer",
                                    padding: "8px 12px",
                                    borderRadius: 10,
                                    border: "1px solid rgba(239,68,68,0.45)",
                                    background: "rgba(239,68,68,0.12)",
                                    fontWeight: 900,
                                    opacity: reUploading[doc.id] ? 0.6 : 1,
                                  }}
                                >
                                  {reUploading[doc.id] ? "Uploading..." : "Re-upload"}
                                  <input
                                    type="file"
                                    style={{ display: "none" }}
                                    disabled={reUploading[doc.id]}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleReUpload(auditId, doc.id, f);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}