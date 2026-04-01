import React from "react";
import { useNavigate } from "react-router-dom";
import "../HomePage.css";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      title: "ISO Documentation",
      desc: "We prepare complete documentation as per your ISO standard and your real processes.",
      points: [
        "Quality Manual / Policy documents",
        "SOPs, procedures, work instructions",
        "Formats, registers, logs, records",
        "Document control + versioning support",
      ],
    },
    {
      title: "Gap Analysis",
      desc: "We evaluate current practices vs ISO clauses and prepare a clear action plan.",
      points: [
        "Gap report with clause mapping",
        "Risk & opportunity identification",
        "Implementation roadmap + timeline",
        "Department-wise responsibilities",
      ],
    },
    {
      title: "Training & Awareness",
      desc: "Training to ensure team understands ISO requirements and how to implement them.",
      points: [
        "ISO awareness for employees",
        "Internal auditor training",
        "Process owner training",
        "Management review guidance",
      ],
    },
    {
      title: "Internal Audit Support",
      desc: "We conduct internal audits and help close non-conformities before certification.",
      points: [
        "Audit plan + checklists",
        "Audit execution + evidence collection",
        "Audit reports + NC list",
        "Corrective action closure support",
      ],
    },
    {
      title: "Certification Support",
      desc: "Support during Stage 1 and Stage 2 audits with certification body coordination.",
      points: [
        "Audit readiness check",
        "Mock audit support",
        "Stage 1/2 audit support",
        "NC closure + final follow-up",
      ],
    },
    {
      title: "Continual Improvement",
      desc: "After certification, we help you maintain compliance and improve performance.",
      points: [
        "KPI monitoring & targets",
        "Risk review and mitigation",
        "Annual internal audits planning",
        "Continual improvement actions",
      ],
    },
  ];

  const standards = [
    ["ISO 9001", "Quality Management System (QMS)"],
    ["ISO 14001", "Environmental Management System (EMS)"],
    ["ISO 45001", "Occupational Health & Safety (OHSMS)"],
    ["ISO 27001", "Information Security Management System (ISMS)"],
    ["ISO 22000", "Food Safety Management System (FSMS)"],
    ["IATF 16949", "Automotive QMS (If Applicable)"],
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Our Services</h2>
          <p className="muted">
            End-to-end ISO consultancy services to help you get certified and stay compliant.
          </p>
        </div>

        <div className="grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="icon">{String(i + 1).padStart(2, "0")}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.desc}</p>

              <div className="bullets" style={{ marginTop: 12 }}>
                {s.points.map((p, idx) => (
                  <div className="bullet" key={idx}>
                    <span className="dot" />
                    <p className="muted" style={{ margin: 0 }}>{p}</p>
                  </div>
                ))}
              </div>

              <button className="link-btn" onClick={() => navigate("/contact")}>
                Enquire now →
              </button>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginTop: 30 }} />

        <div className="section-head" style={{ marginTop: 18 }}>
          <h2>Standards We Support</h2>
          <p className="muted">
            We guide you in selecting the right ISO standard for your business.
          </p>
        </div>

        <div className="grid">
          {standards.map((x, i) => (
            <div className="service-card" key={i}>
              <h3>{x[0]}</h3>
              <p className="muted">{x[1]}</p>
              <button className="btn btn-outline" onClick={() => navigate("/signup")}>
                Start consultation
              </button>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginTop: 30 }} />
        <div className="section-head" style={{ marginTop: 18 }}>
          <h2>Industries We Work With</h2>
          <p className="muted">
            Manufacturing • IT • Healthcare • Construction • Education • Service Businesses
          </p>
        </div>
      </div>
    </section>
  );
}
