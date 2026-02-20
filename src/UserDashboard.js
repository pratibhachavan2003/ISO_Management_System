import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [activeTab, setActiveTab] = useState("profile");

  // ✅ if profile already saved once, open products directly (optional)
  useEffect(() => {
    const profileCompleted = localStorage.getItem("profileCompleted") === "true";
    if (profileCompleted) setActiveTab("products");
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            onProfileSaved={() => {
              localStorage.setItem("profileCompleted", "true");
              setActiveTab("products");
            }}
          />
        );

      case "products":
        return (
          <ProductsSection
            onAfterSave={() => {
              setActiveTab("audit");
            }}
          />
        );

      case "audit":
        return <AuditRequestSection />;

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
        <div className="topbar-left" />

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
            className={`tab ${activeTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveTab("audit")}
            type="button"
          >
            Audit Request
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

const ProfileSection = ({ onProfileSaved }) => {
  const [openAddress, setOpenAddress] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ view mode vs edit mode
  const [isEditing, setIsEditing] = useState(false);

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

  // ✅ keep backup to cancel edit
  const [backup, setBackup] = useState(null);

  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const onOrgChange = (e) => {
    const { name, value } = e.target;
    setOrganization((p) => ({ ...p, [name]: value }));
  };

  /* ✅ LOAD SAVED PROFILE ON PAGE LOAD (so next login shows filled data) */
  const fetchProfile = async () => {
    if (!loginEmail) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/profile?loginEmail=${encodeURIComponent(loginEmail)}`
      );

      if (!res.ok) return;

      const data = await res.json();

      const profileToStore = data.profile ? data.profile : data;
      const orgToStore = data.organization ? data.organization : {};

      if (data.profile) {
        setProfile((p) => ({
          ...p,
          ...data.profile,
          loginEmail: loginEmail,
        }));
      } else {
        setProfile((p) => ({
          ...p,
          ...data,
          loginEmail: loginEmail,
        }));
      }

      if (data.organization) {
        setOrganization((o) => ({ ...o, ...data.organization }));
      }

      // ✅ Store for audit auto-fill
      localStorage.setItem("profileData", JSON.stringify(profileToStore));
      localStorage.setItem("orgData", JSON.stringify(orgToStore));
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      profile: {
        ...profile,
        loginEmail: loginEmail,
      },
      organization:
        organization.company?.trim() ||
        organization.address?.trim() ||
        organization.city?.trim() ||
        organization.state?.trim() ||
        organization.postalCode?.trim() ||
        (organization.country && organization.country !== "Select")
          ? organization
          : null,
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const msg = await res.text();
      if (!res.ok) {
        alert(msg || "Profile update failed");
        return;
      }

      alert(msg || "Profile updated successfully ✅");

      setIsEditing(false);
      setBackup(null);

      // ✅ Store latest for audit auto-fill
      localStorage.setItem("profileData", JSON.stringify(profile));
      localStorage.setItem("orgData", JSON.stringify(organization));

      await fetchProfile();

      if (typeof onProfileSaved === "function") onProfileSaved();
    } catch (err) {
      console.error(err);
      alert("Server not reachable. Check Spring Boot is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = () => {
    setBackup({
      profile: { ...profile },
      organization: { ...organization },
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (backup) {
      setProfile(backup.profile);
      setOrganization(backup.organization);
    }
    setIsEditing(false);
    setBackup(null);
  };

  const disabled = !isEditing || loading;

  return (
    <div className="profile-page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Profile</h2>
          <div className="page-hint">
            {loading ? "Loading profile..." : "View your profile details"}
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button type="button" className="edit-profile-btn" onClick={startEdit}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                className="cancel-profile-btn"
                onClick={cancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profileForm"
                className="update-profile-btn"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </>
          )}
        </div>
      </div>

      <form id="profileForm" onSubmit={handleSaveOrUpdate}>
        <section className="panel">
          <div className="panel-body">
            <div className="two-col">
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
                    disabled={disabled}
                  />
                </Row>

                <Row label="Last name" required>
                  <input
                    name="lastName"
                    value={profile.lastName}
                    onChange={onProfileChange}
                    required
                    disabled={disabled}
                  />
                </Row>

                <Row label="Display name" required>
                  <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={onProfileChange}
                    required
                    disabled={disabled}
                  />
                </Row>

                <Row label="Notification email">
                  <input
                    name="notificationEmail"
                    value={profile.notificationEmail}
                    onChange={onProfileChange}
                    placeholder="Enter email"
                    disabled={disabled}
                  />
                </Row>

                <Row label="Language">
                  <select
                    name="language"
                    value={profile.language}
                    onChange={onProfileChange}
                    disabled={disabled}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </Row>
              </div>

              <div className="col">
                <Row label="Phone">
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={onProfileChange}
                    disabled={disabled}
                  />
                </Row>

                <Row label="Mobile">
                  <input
                    name="mobile"
                    value={profile.mobile}
                    onChange={onProfileChange}
                    disabled={disabled}
                  />
                </Row>

                <Row label="Fax">
                  <input
                    name="fax"
                    value={profile.fax}
                    onChange={onProfileChange}
                    disabled={disabled}
                  />
                </Row>

                <Row label="Organization size">
                  <select
                    name="organizationSize"
                    value={profile.organizationSize}
                    onChange={onProfileChange}
                    disabled={disabled}
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
                  <select
                    name="industry"
                    value={profile.industry}
                    onChange={onProfileChange}
                    disabled={disabled}
                  >
                    {industries.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Row>

                <Row label="Job title">
                  <input
                    name="jobTitle"
                    value={profile.jobTitle}
                    onChange={onProfileChange}
                    disabled={disabled}
                  />
                </Row>
              </div>
            </div>
          </div>
        </section>

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
                    <input
                      name="company"
                      value={organization.company}
                      onChange={onOrgChange}
                      disabled={disabled}
                    />
                  </Row>

                  <Row label="Address">
                    <textarea
                      name="address"
                      value={organization.address}
                      onChange={onOrgChange}
                      rows={4}
                      disabled={disabled}
                    />
                  </Row>

                  <Row label="Postal code">
                    <input
                      name="postalCode"
                      value={organization.postalCode}
                      onChange={onOrgChange}
                      disabled={disabled}
                    />
                  </Row>
                </div>

                <div className="col">
                  <Row label="City">
                    <input
                      name="city"
                      value={organization.city}
                      onChange={onOrgChange}
                      disabled={disabled}
                    />
                  </Row>

                  <Row label="Country">
                    <select
                      name="country"
                      value={organization.country}
                      onChange={onOrgChange}
                      disabled={disabled}
                    >
                      {countries.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Row>

                  <Row label="State">
                    <input
                      name="state"
                      value={organization.state}
                      onChange={onOrgChange}
                      disabled={disabled}
                    />
                  </Row>
                </div>
              </div>
            </div>
          )}
        </section>

        {isEditing && (
          <div className="actions">
            <button className="save" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <div className="req-note">
              <span className="req">*</span> required field
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

/* ================= PRODUCTS SECTION (WITH SEARCH) ================= */

const ProductsSection = ({ onAfterSave }) => {
  const loginEmail = localStorage.getItem("username") || "";

  const isoProducts = [
    { id: "ISO9001", title: "ISO 9001", desc: "Quality Management System (QMS)" },
    { id: "ISO14001", title: "ISO 14001", desc: "Environmental Management System (EMS)" },
    { id: "ISO45001", title: "ISO 45001", desc: "Occupational Health & Safety (OH&S)" },
    { id: "ISO27001", title: "ISO 27001", desc: "Information Security (ISMS)" },
    { id: "ISO22000", title: "ISO 22000", desc: "Food Safety (FSMS)" },
  ];

  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedIsoProducts");
    return saved ? JSON.parse(saved) : [];
  });

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return isoProducts;
    return isoProducts.filter((p) =>
      `${p.id} ${p.title} ${p.desc}`.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const saveToBackend = async () => {
    try {
      await fetch("http://localhost:8080/api/user/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginEmail, products: selected }),
      });
    } catch (e) {
      // ignore if endpoint doesn't exist yet
    }
  };

  const handleSave = async () => {
    localStorage.setItem("selectedIsoProducts", JSON.stringify(selected));
    await saveToBackend();
    alert("Products saved ✅");

    if (typeof onAfterSave === "function") onAfterSave();
  };

  return (
    <div className="products-wrap">
      <div className="products-header">
        <div>
          <h2 className="page-title">ISO Products</h2>
          <div className="page-hint">Search and select ISO standards.</div>
        </div>

        <div className="product-search">
          <input
            className="product-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ISO products... (ex: 9001, security)"
          />
          {query && (
            <button
              className="product-search-clear"
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          No products found for <b>{query}</b>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((p) => {
            const active = selected.includes(p.id);
            return (
              <div
                key={p.id}
                className={`product-card ${active ? "selected" : ""}`}
                onClick={() => toggle(p.id)}
                role="button"
                tabIndex={0}
              >
                <div className="product-top">
                  <h3 className="product-title">{p.title}</h3>
                  <span className={`chip ${active ? "chip-on" : ""}`}>
                    {active ? "Selected" : "Select"}
                  </span>
                </div>

                <p className="muted">{p.desc}</p>

                <div className="check-row" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(p.id)}
                  />
                  <span>Include</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="products-actions">
        <button
          className="update-profile-btn"
          onClick={handleSave}
          disabled={selected.length === 0}
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
};

/* ================= AUDIT REQUEST FORM (AUTO-FILL + ISO STANDARDS SECTION) ================= */

const AuditRequestSection = () => {
  const loginEmail = localStorage.getItem("username") || "";

  const isoStandardOptions = useMemo(
    () => [
      { id: "ISO9001", label: "ISO 9001 (QMS)" },
      { id: "ISO14001", label: "ISO 14001 (EMS)" },
      { id: "ISO45001", label: "ISO 45001 (OH&S)" },
      { id: "ISO27001", label: "ISO 27001 (ISMS)" },
      { id: "ISO22000", label: "ISO 22000 (FSMS)" },
    ],
    []
  );

  const selectedFromProducts =
    JSON.parse(localStorage.getItem("selectedIsoProducts") || "[]") || [];

  const storedProfile = JSON.parse(localStorage.getItem("profileData") || "{}");
  const storedOrg = JSON.parse(localStorage.getItem("orgData") || "{}");

  const contactPerson =
    storedProfile.displayName ||
    `${storedProfile.firstName || ""} ${storedProfile.lastName || ""}`.trim();

  const [form, setForm] = useState({
    loginEmail,

    // auto-fill from profile/org
    companyName: storedOrg.company || "",
    contactPerson: contactPerson || "",
    designation: storedProfile.jobTitle || "",
    phone: storedProfile.mobile || storedProfile.phone || "",

    address: storedOrg.address || "",
    city: storedOrg.city || "",
    state: storedOrg.state || "",
    country:
      storedOrg.country && storedOrg.country !== "Select" ? storedOrg.country : "India",
    postalCode: storedOrg.postalCode || "",

    // ✅ ISO standards selection (editable in audit form)
    isoStandards: selectedFromProducts,

    // audit fields
    auditType: "Internal Audit",
    preferredDate: "",
    duration: "1 Day",
    auditLocation: "",
    scope: "",
    notes: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleIsoStandard = (id) => {
    setForm((f) => {
      const exists = (f.isoStandards || []).includes(id);
      const next = exists ? f.isoStandards.filter((x) => x !== id) : [...(f.isoStandards || []), id];
      // also keep products page synced (optional)
      localStorage.setItem("selectedIsoProducts", JSON.stringify(next));
      return { ...f, isoStandards: next };
    });
  };

  // ✅ refresh if profile/products updated
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("profileData") || "{}");
    const o = JSON.parse(localStorage.getItem("orgData") || "{}");
    const products = JSON.parse(localStorage.getItem("selectedIsoProducts") || "[]");

    const person =
      p.displayName || `${p.firstName || ""} ${p.lastName || ""}`.trim();

    setForm((f) => ({
      ...f,
      loginEmail,
      companyName: o.company || f.companyName,
      contactPerson: person || f.contactPerson,
      designation: p.jobTitle || f.designation,
      phone: p.mobile || p.phone || f.phone,
      address: o.address || f.address,
      city: o.city || f.city,
      state: o.state || f.state,
      country: o.country && o.country !== "Select" ? o.country : f.country,
      postalCode: o.postalCode || f.postalCode,
      isoStandards: products?.length ? products : f.isoStandards,
    }));
  }, [loginEmail]);

  const submitAuditRequest = async (e) => {
    e.preventDefault();

    if (!form.isoStandards || form.isoStandards.length === 0) {
      alert("Please select at least one ISO standard.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const msg = await res.text();
      if (!res.ok) {
        alert(msg || "Audit request failed");
        return;
      }

      alert(msg || "Audit request submitted ✅");

      // keep auto-filled info, clear audit-specific fields
      setForm((f) => ({
        ...f,
        auditType: "Internal Audit",
        preferredDate: "",
        duration: "1 Day",
        auditLocation: "",
        scope: "",
        notes: "",
      }));
    } catch (err) {
      console.error(err);
      alert("Server not reachable. Check Spring Boot is running on port 8080.");
    }
  };

  return (
    <div className="audit-wrap">
      <div className="products-header">
        <div>
          <h2 className="page-title">Audit Request Form</h2>
          <div className="page-hint">
            Auto-filled from Profile. Selected ISO:{" "}
            <b>{form.isoStandards?.length ? form.isoStandards.join(", ") : "None"}</b>
          </div>
        </div>
      </div>

      <form className="panel audit-form" onSubmit={submitAuditRequest}>
        <div className="panel-body">
          {/* ===== Applicant Info ===== */}
          <section className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-body">
              <h3 style={{ margin: 0, marginBottom: 10 }}>Applicant Information</h3>

              <div className="two-col">
                <div className="col">
                  <Row label="Login Email">
                    <input name="loginEmail" value={form.loginEmail} disabled />
                  </Row>

                  <Row label="Company Name" required>
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={onChange}
                      required
                    />
                  </Row>

                  <Row label="Contact Person" required>
                    <input
                      name="contactPerson"
                      value={form.contactPerson}
                      onChange={onChange}
                      required
                    />
                  </Row>

                  <Row label="Designation">
                    <input
                      name="designation"
                      value={form.designation}
                      onChange={onChange}
                    />
                  </Row>
                </div>

                <div className="col">
                  <Row label="Phone" required>
                    <input name="phone" value={form.phone} onChange={onChange} required />
                  </Row>

                  <Row label="Address">
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={onChange}
                      rows={3}
                    />
                  </Row>

                  <Row label="City">
                    <input name="city" value={form.city} onChange={onChange} />
                  </Row>

                  <Row label="State">
                    <input name="state" value={form.state} onChange={onChange} />
                  </Row>

                  <Row label="Country">
                    <input name="country" value={form.country} onChange={onChange} />
                  </Row>

                  <Row label="Postal Code">
                    <input name="postalCode" value={form.postalCode} onChange={onChange} />
                  </Row>
                </div>
              </div>
            </div>
          </section>

          {/* ===== ISO Standards Selection (NEW) ===== */}
          <section className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-body">
              <h3 style={{ margin: 0, marginBottom: 10 }}>ISO Standard Selection</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                {isoStandardOptions.map((opt) => {
                  const checked = (form.isoStandards || []).includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        padding: "10px 12px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: checked ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIsoStandard(opt.id)}
                      />
                      <span style={{ fontWeight: 800 }}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, color: "rgba(234,240,255,0.72)", fontSize: 12 }}>
                Tip: You can change ISO selections here (it will also sync with Products selection).
              </div>
            </div>
          </section>

          {/* ===== Audit Details ===== */}
          <section className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-body">
              <h3 style={{ margin: 0, marginBottom: 10 }}>Audit Details</h3>

              <div className="two-col">
                <div className="col">
                  <Row label="Preferred Date" required>
                    <input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={onChange}
                      required
                    />
                  </Row>

                  <Row label="Audit Type" required>
                    <select name="auditType" value={form.auditType} onChange={onChange}>
                      <option>Internal Audit</option>
                      <option>External Audit</option>
                      <option>Surveillance Audit</option>
                      <option>Certification Audit</option>
                    </select>
                  </Row>

                  <Row label="Duration">
                    <select name="duration" value={form.duration} onChange={onChange}>
                      <option>1 Day</option>
                      <option>2 Days</option>
                      <option>3 Days</option>
                      <option>1 Week</option>
                    </select>
                  </Row>
                </div>

                <div className="col">
                  <Row label="Audit Location" required>
                    <input
                      name="auditLocation"
                      value={form.auditLocation}
                      onChange={onChange}
                      placeholder="Office / Plant / City"
                      required
                    />
                  </Row>

                  <Row label="Scope of Certification">
                    <textarea
                      name="scope"
                      value={form.scope}
                      onChange={onChange}
                      rows={3}
                      placeholder="Describe activities, products, services covered..."
                    />
                  </Row>

                  <Row label="Notes">
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={onChange}
                      rows={3}
                      placeholder="Any special requirements..."
                    />
                  </Row>
                </div>
              </div>
            </div>
          </section>

          <div className="products-actions">
            <button className="update-profile-btn" type="submit">
              Submit Audit Request
            </button>
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
  