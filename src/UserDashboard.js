import React, { useEffect,useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
    const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // go to home page
  };

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "products":
        return <h3 className="coming-soon">📦 Products Section (Coming Soon)</h3>;
      case "notifications":
        return <h3 className="coming-soon">🔔 Notifications Section (Coming Soon)</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* ===== TOP HEADER ===== */}
      <header className="topbar">
        <div className="topbar-left">
         
        </div>

                <div className="topbar-right">
          <div className="user-pill">
            <span className="dot" />
            <span className="user-text">Welcome, {username}</span>
          </div>

          <button className="logout-btn" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        
      
      </header>

      {/* ===== TABS ===== */}
      <div className="tabs-wrap">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
            type="button"
          >
            Products
          </button>
          <button
            className={`tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
            type="button"
          >
            Notifications
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <main className="content">{renderContent()}</main>
    </div>
  );
};

/* ================= PROFILE SECTION ================= */

const ProfileSection = () => {
  const [openAddress, setOpenAddress] = useState(true);

  const countries = useMemo(() => ["Select", "India", "USA", "UK", "Canada"], []);
  const industries = useMemo(
    () => ["Select", "IT", "Manufacturing", "Healthcare", "Education", "Other"],
    []
  );

  const loginEmail = localStorage.getItem("username") || "";

  // ✅ split states: profile + organization (matches backend)
  const [profile, setProfile] = useState({
    loginEmail: loginEmail,
    notificationEmail: "",
    firstName: "",
    lastName: "",
    displayName: "",
    organizationSize: "Select",
    mobile: "",
    phone: "",
    fax: "",
    industry: "Select",
    jobTitle: "",
    language: "English",
  });

  const [organization, setOrganization] = useState({
    company: "",
    address: "",
    city: "",
    state: "",
    country: "Select",
    postalCode: "",
  });

  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const onOrgChange = (e) => {
    const { name, value } = e.target;
    setOrganization((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // ✅ build request exactly like ProfileOrganizationRequest
    const payload = {
      profile: {
        ...profile,
        loginEmail: loginEmail, // always keep from login/localStorage
      },
      organization:
        organization.company?.trim() ||
        organization.address?.trim() ||
        organization.city?.trim() ||
        organization.state?.trim() ||
        organization.postalCode?.trim() ||
        (organization.country && organization.country !== "Select")
          ? organization
          : null, // ✅ send null if org is empty (backend checks != null)
    };

    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const msg = await res.text();
      if (!res.ok) {
        alert(msg || "Profile save failed");
        return;
      }

      alert(msg || "Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Server not reachable. Check Spring Boot is running on port 8080.");
    }
  };

  return (
    <div className="profile-page">
      <div className="page-head">
        <h2 className="page-title">Profile</h2>
        <div className="page-hint">Fields marked * are required</div>
      </div>

      <form onSubmit={handleSave}>
        {/* ===== PROFILE CARD ===== */}
        <section className="panel">
          <div className="panel-body">
            <div className="two-col">
              {/* LEFT */}
              <div className="col">
                <Row label="Login Email">
                  <input name="loginEmail" value={loginEmail} disabled />
                </Row>

                <Row label="First name" required>
                  <input
                    name="firstName"
                    value={profile.firstName}
                    onChange={onProfileChange}
                    required
                  />
                </Row>

                <Row label="Last name" required>
                  <input
                    name="lastName"
                    value={profile.lastName}
                    onChange={onProfileChange}
                    required
                  />
                </Row>

                <Row label="Display name" required>
                  <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={onProfileChange}
                    required
                  />
                </Row>

                <Row label="Notification email">
                  <input
                    name="notificationEmail"
                    value={profile.notificationEmail}
                    onChange={onProfileChange}
                    placeholder="Enter email"
                  />
                </Row>

                <Row label="Language">
                  <select name="language" value={profile.language} onChange={onProfileChange}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </Row>
              </div>

              {/* RIGHT */}
              <div className="col">
                <Row label="Phone">
                  <input name="phone" value={profile.phone} onChange={onProfileChange} />
                </Row>

                <Row label="Mobile">
                  <input name="mobile" value={profile.mobile} onChange={onProfileChange} />
                </Row>

                <Row label="Fax">
                  <input name="fax" value={profile.fax} onChange={onProfileChange} />
                </Row>

                <Row label="Organization size">
                  <select
                    name="organizationSize"
                    value={profile.organizationSize}
                    onChange={onProfileChange}
                  >
                    <option>Select</option>
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>201–500</option>
                    <option>500+</option>
                  </select>
                </Row>

                <Row label="Industry">
                  <select name="industry" value={profile.industry} onChange={onProfileChange}>
                    {industries.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Row>

                <Row label="Job title">
                  <input name="jobTitle" value={profile.jobTitle} onChange={onProfileChange} />
                </Row>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ADDRESS CARD ===== */}
        <section className="panel">
          <button
            className="panel-head"
            type="button"
            onClick={() => setOpenAddress((s) => !s)}
            aria-expanded={openAddress}
          >
            <span className={`chev ${openAddress ? "open" : ""}`}>▸</span>
            <span className="panel-title">Organization information</span>
          </button>

          {openAddress && (
            <div className="panel-body">
              <div className="two-col">
                <div className="col">
                  <Row label="Company">
                    <input name="company" value={organization.company} onChange={onOrgChange} />
                  </Row>

                  <Row label="Address">
                    <textarea
                      name="address"
                      value={organization.address}
                      onChange={onOrgChange}
                      rows={4}
                    />
                  </Row>

                  <Row label="Postal code">
                    <input
                      name="postalCode"
                      value={organization.postalCode}
                      onChange={onOrgChange}
                    />
                  </Row>
                </div>

                <div className="col">
                  <Row label="City">
                    <input name="city" value={organization.city} onChange={onOrgChange} />
                  </Row>

                  <Row label="Country">
                    <select name="country" value={organization.country} onChange={onOrgChange}>
                      {countries.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Row>

                  <Row label="State">
                    <input name="state" value={organization.state} onChange={onOrgChange} />
                  </Row>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ACTIONS */}
        <div className="actions">
          <button className="save" type="submit">
            Save
          </button>
          <div className="req-note">
            <span className="req">*</span> required field
          </div>
        </div>
      </form>
    </div>
  );
};



const Row = ({ label, required, children }) => {
  return (
    <div className="row">
      <div className="row-label">
        {label} {required && <span className="req">*</span>}
      </div>
      <div className="row-control">{children}</div>
    </div>
  );
};

export default UserDashboard;
