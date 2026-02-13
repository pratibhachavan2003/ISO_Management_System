import React from "react";
import "../HomePage.css";

export default function FAQs() {
  const faqs = [
    ["How long does ISO certification take?", "Usually 2–8 weeks depending on scope and readiness."],
    ["Do you provide documentation templates?", "Yes, SOPs, manuals, forms and records as required by the standard."],
    ["Is ISO certification expensive?", "Cost depends on company size, scope and certification body charges."],
    ["Do you help for internal audits?", "Yes, internal audits and corrective action support are included."],
    ["Do you support during external audit?", "Yes, we support Stage 1 and Stage 2 audits and closure of findings."],
    ["Which ISO should I select?", "ISO 9001 (Quality), ISO 14001 (Environment), ISO 45001 (Safety), ISO 27001 (Security)."],
    ["Can small companies get ISO certified?", "Yes, we make a simple system suitable for startups and SMEs."],
    ["What is the difference between Stage 1 and Stage 2 audit?", "Stage 1 checks readiness, Stage 2 is final certification audit."],
  ];

  return (
    <section className="section section-soft">
      <div className="container">
        <div className="section-head">
          <h2>FAQs</h2>
          <p className="muted">
            Common questions about ISO certification, implementation and consultancy support.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className="faq-item" key={i}>
              <h3 className="faq-q">{f[0]}</h3>
              <p className="faq-a muted">{f[1]}</p>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginTop: 30 }} />
        <div className="section-head" style={{ marginTop: 18 }}>
          <h2>Still have questions?</h2>
          <p className="muted">Visit Contact page and send your requirement.</p>
        </div>
      </div>
    </section>
  );
}
