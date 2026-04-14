import React from "react";
import "../home/HomePage.css";

export default function Process() {
  const steps = [
    {
      title: "Consultation & Scope Finalization",
      desc: "We understand your company, identify processes and finalize certification scope.",
      output: "Scope document + standard selection",
    },
    {
      title: "Gap Analysis",
      desc: "We check your current system vs ISO requirements and prepare a detailed gap report.",
      output: "Gap report + implementation plan",
    },
    {
      title: "Documentation Preparation",
      desc: "We create policies, SOPs, manuals, formats and records needed for compliance.",
      output: "Complete documentation set",
    },
    {
      title: "Implementation & Training",
      desc: "We help implement processes and train staff to maintain records and follow SOPs.",
      output: "Working ISO system + trained team",
    },
    {
      title: "Internal Audit & NC Closure",
      desc: "Internal audit is performed to ensure readiness and close gaps before final audit.",
      output: "Audit report + corrective actions",
    },
    {
      title: "Certification Audit Support",
      desc: "Support during Stage 1 & Stage 2 audits and closure of external audit findings.",
      output: "Certification success support",
    },
  ];

  const deliverables = [
    "Quality Policy / Objectives",
    "Process SOPs & Work Instructions",
    "Risk Assessment & Opportunity Plan",
    "Internal Audit Checklist & Reports",
    "Management Review Meeting Support",
    "Corrective Action (CAPA) Records",
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Our Process</h2>
          <p className="muted">
            Simple, structured and fast implementation process designed for real business needs.
          </p>
        </div>

        <div className="timeline">
          {steps.map((t, i) => (
            <div className="step" key={i}>
              <div className="step-no">{i + 1}</div>
              <div>
                <h3>{t.title}</h3>
                <p className="muted">{t.desc}</p>
                <p className="muted">
                  <b>Output:</b> {t.output}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginTop: 30 }} />
        <div className="section-head" style={{ marginTop: 18 }}>
          <h2>What You Get</h2>
          <p className="muted">Key deliverables included in our ISO consultancy package.</p>
        </div>

        <div className="grid">
          {deliverables.map((d, i) => (
            <div className="service-card" key={i}>
              <h3>{d}</h3>
              <p className="muted">Prepared and customized based on your organization.</p>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginTop: 30 }} />
        <div className="section-head" style={{ marginTop: 18 }}>
          <h2>Typical Timeline</h2>
          <p className="muted">
            Small: 2G��4 weeks G�� Medium: 4G��8 weeks G�� Large: 8G��12 weeks (depends on scope & readiness)
          </p>
        </div>
      </div>
    </section>
  );
}
