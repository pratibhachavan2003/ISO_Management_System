import React from "react";
import "../home/HomePage.css";

export default function AboutPage() {
  const whyUs = [
    ["Practical Implementation", "We build a working ISO system aligned with your real workflow."],
    ["Audit Ready Documentation", "Documents are prepared in standard audit-friendly format."],
    ["Expert Guidance", "Consultants guide you step-by-step from start to certification."],
    ["Support After Certification", "We help you maintain and improve system after certification."],
  ];

  const teamFocus = [
    "Documentation & templates",
    "Implementation planning",
    "Training sessions",
    "Internal audit support",
    "Certification audit support",
    "Continual improvement",
  ];

  return (
    <section className="section section-soft">
      <div className="container two-col">
        <div>
          <h2>About ISO Consultancy System</h2>
          <p className="muted">
            Our mission is to simplify ISO standards for organizations by providing complete supportG��
            documentation, training, audits, and certification preparation. We focus on practical
            implementation, not only theory.
          </p>

          <div className="bullets" style={{ marginTop: 16 }}>
            {whyUs.map((b, i) => (
              <div className="bullet" key={i}>
                <span className="dot" />
                <div>
                  <h4>{b[0]}</h4>
                  <p className="muted">{b[1]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="divider" style={{ marginTop: 20 }} />
          <p className="muted" style={{ marginTop: 14 }}>
            <b>We support:</b> ISO 9001, ISO 14001, ISO 45001, ISO 27001, ISO 22000 and more.
          </p>
        </div>

        <div className="image-box">
          <div className="image-card">
            <h3>Our Team Focus</h3>
            <div className="pills">
              {teamFocus.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <div className="divider" />
            <p className="muted">
              Our ISO experts make compliance simple and achievable for any organization size.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
