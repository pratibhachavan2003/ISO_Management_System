import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../features/admin/pages/AdminDashboard.css";


export default function AdminLayout() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";
  const roleid = localStorage.getItem("roleid"); // ✅ 1 = Admin

  // ✅ Guard (Prevents blank page)
  if (roleid !== "1") {
    return (
      <div className="access-wrap">
        <div className="access-card">
          <h2>Access Denied ❌</h2>
          <p>You do not have permission to access Admin Dashboard.</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menu = [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/users", label: "User Management", icon: "👥" },
    { to: "/admin/documents", label: "Document Control", icon: "📄" },
    { to: "/admin/audits", label: "Audit Management", icon: "🧪" },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-badge">ISO</div>
          <div>
            <div className="brand-title">ISO Admin</div>
            <div className="brand-sub">Management System</div>
          </div>
        </div>

        <div className="sidebar-menu">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            >
              <span className="menu-icon">{m.icon}</span>
              <span className="menu-text">{m.label}</span>
            </NavLink>
          ))}
        </div>

        <button className="menu-item logout" onClick={handleLogout}>
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Logout</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2 className="topbar-title">ISO Management System – Admin</h2>
            <p className="topbar-sub">
              Welcome, <b>{username}</b>
            </p>
          </div>

          <div className="topbar-right">
            <div className="user-chip">
              <span className="dot-online" />
              <span>{username}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
