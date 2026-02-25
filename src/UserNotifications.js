import React, { useEffect, useState } from "react";
import "./UserNotifications.css";

const API_BASE = "http://localhost:8080";

export default function UserNotifications() {
  const loginEmail = localStorage.getItem("username") || "";
  const [profileId, setProfileId] = useState(localStorage.getItem("profileId") || "");
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfileIdByEmail = async () => {
    if (!loginEmail) return "";

    try {
      const res = await fetch(
        `${API_BASE}/api/profile?loginEmail=${encodeURIComponent(loginEmail)}`
      );
      if (!res.ok) return "";

      const data = await res.json();
      const p = data?.profile ? data.profile : data; // supports both response styles

      const pid = p?.profileId ? String(p.profileId) : "";
      if (pid) {
        localStorage.setItem("profileId", pid);
        setProfileId(pid);
      }
      return pid;
    } catch (e) {
      console.error("fetchProfileIdByEmail error:", e);
      return "";
    }
  };

  const loadMyAudits = async (pid) => {
    try {
      const res = await fetch(`${API_BASE}/api/audits/my?profileId=${pid}`);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to load audits");
      }
      const data = await res.json();
      setAudits(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErrorMsg("Could not load audit requests.");
      setAudits([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg("");

      // 1) ensure profileId
      let pid = profileId;
      if (!pid) pid = await fetchProfileIdByEmail();

      // 2) if still missing, stop
      if (!pid) {
        setLoading(false);
        setErrorMsg(
          "Profile not found. Please complete your Profile once or login again."
        );
        return;
      }

      // 3) load audits
      await loadMyAudits(pid);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginEmail]);

  return (
    <div className="notif-page">
      <h2 className="notif-title">🔔 Notifications</h2>

      {!loginEmail ? (
        <p className="notif-empty">Please login again.</p>
      ) : loading ? (
        <p className="notif-empty">Loading...</p>
      ) : errorMsg ? (
        <p className="notif-empty">{errorMsg}</p>
      ) : audits.length === 0 ? (
        <p className="notif-empty">No audit requests yet.</p>
      ) : (
        <div className="notif-list">
          {audits.map((a) => (
            <div key={a.auditId} className="notif-card">
              <div className="notif-top">
                <div>
                  <div className="notif-type">{a.auditType}</div>
                  <div className="notif-sub">
                    Preferred Date: <b>{a.preferredDate || "-"}</b> • Location:{" "}
                    <b>{a.auditLocation || "-"}</b>
                  </div>
                </div>

                <span className={`badge ${String(a.status || "").toLowerCase()}`}>
                  {a.status || "Pending"}
                </span>
              </div>

              <div className="notif-body">
                <div>
                  <b>Scope:</b> {a.scope || "-"}
                </div>
                <div>
                  <b>Notes:</b> {a.notes || "-"}
                </div>
                <div>
                  <b>Assigned Auditor:</b> {a.assignedAuditor || "Not assigned"}
                </div>
                <div>
                  <b>Admin Comment:</b> {a.adminComment || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}