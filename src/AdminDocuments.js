// src/AdminDocuments.js
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function AdminDocuments() {
  const [activeTab, setActiveTab] = useState("doccontrol");

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Document Control</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setActiveTab("doccontrol")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            fontWeight: 800,
            cursor: "pointer",
            background: activeTab === "doccontrol" ? "rgba(0,0,0,0.06)" : "white",
          }}
        >
          Document Control
        </button>
      </div>

      {activeTab === "doccontrol" ? <DocumentControlTab /> : <DocumentControlTab />}
    </div>
  );
}

function DocumentControlTab() {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [q, setQ] = useState("");

  const fetchDocs = async () => {
    try {
      setLoading(true);

      // ✅ correct endpoint
      const res = await fetch(`${API_BASE}/api/admin/documents`);
      if (!res.ok) throw new Error("Failed to load documents");

      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch docs error:", e);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return docs;

    return docs.filter((d) => {
      const text =
        `${d.id} ${d.auditId} ${d.documentCategory} ${d.originalFileName} ${d.fileType}`.toLowerCase();
      return text.includes(query);
    });
  }, [docs, q]);

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: 0 }}>All Uploaded Documents</h3>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Showing records from <b>/api/admin/documents</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: auditId / category / file"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              minWidth: 320,
            }}
          />
          <button
            onClick={fetchDocs}
            type="button"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: 16 }}>Loading documents...</div>
      ) : filtered.length === 0 ? (
        <div style={{ marginTop: 16 }}>No documents found.</div>
      ) : (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={th}>ID</th>
                <th style={th}>Audit ID</th>
                <th style={th}>Category</th>
                <th style={th}>Original File</th>
                <th style={th}>Type</th>
                <th style={th}>Size</th>
                <th style={th}>Uploaded At</th>
                <th style={th}>Download</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td style={td}>{d.id}</td>
                  <td style={td}>{d.auditId}</td>
                  <td style={td}>{d.documentCategory}</td>
                  <td style={td}>{d.originalFileName}</td>
                  <td style={td}>{d.fileType}</td>
                  <td style={td}>{formatBytes(d.fileSize || 0)}</td>
                  <td style={td}>{d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : "-"}</td>
                  <td style={td}>
                    <a
                      href={`${API_BASE}/api/admin/documents/download/${d.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.15)",
                        textDecoration: "none",
                        fontWeight: 800,
                      }}
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: "10px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.15)",
  fontSize: 13,
  opacity: 0.8,
};

const td = {
  padding: "10px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.10)",
  fontSize: 13,
};

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}