import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <p className="tag">
              ISO Certification • Audits • Training • Documentation
            </p>

            <h1>
              Build Trust. Stay Compliant.
              <span className="grad"> Get ISO Certified Faster.</span>
            </h1>

            <p className="sub">
              We help organizations implement ISO standards with end-to-end support:
              documentation, gap analysis, internal audits, training, and certification
              preparation.
            </p>

            <div className="hero-cta">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/signup")}
              >
                Start Consultation
              </button>

              <button
                className="btn btn-outline btn-lg"
                onClick={() => navigate("/services")}
              >
                View Services
              </button>
            </div>

            <div className="stats">
              <div className="stat">
                <h3>200+</h3>
                <p>Clients Served</p>
              </div>
              <div className="stat">
                <h3>20+</h3>
                <p>Industries</p>
              </div>
              <div className="stat">
                <h3>98%</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="card glass">
              <h3>Request a Callback</h3>
              <p className="muted">We’ll call you within 24 hours.</p>

              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email Address" />
                <input type="text" placeholder="Company Name" />
                <select defaultValue="">
                  <option value="" disabled>
                    Select ISO Standard
                  </option>
                  <option>ISO 9001 (Quality)</option>
                  <option>ISO 14001 (Environment)</option>
                  <option>ISO 45001 (Safety)</option>
                  <option>ISO 27001 (Information Security)</option>
                  <option>ISO 22000 (Food Safety)</option>
                </select>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/signup")}
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="mini-cards">
              <div className="mini">
                <p className="mini-title">Free Gap Analysis</p>
                <p className="mini-sub">Know what’s missing</p>
              </div>
              <div className="mini">
                <p className="mini-title">Audit Ready</p>
                <p className="mini-sub">Complete documentation</p>
              </div>
              <div className="mini">
                <p className="mini-title">Expert Team</p>
                <p className="mini-sub">ISO consultants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES PREVIEW ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Our Services</h2>
            <p className="muted">
              Everything you need for ISO certification and compliance.
            </p>
          </div>

          <div className="grid">
            {[
              ["ISO Documentation", "Quality manual, SOPs, formats, and all required documents."],
              ["Gap Analysis", "Identify gaps vs ISO requirements and plan improvements."],
              ["Internal Audit", "Audit support with reports and corrective actions."],
              ["Training", "Awareness training, auditor training, and staff coaching."],
              ["Certification Support", "End-to-end assistance until successful certification."],
              ["Continual Improvement", "Ongoing support after certification for improvements."],
            ].map((s, i) => (
              <div className="service-card" key={i}>
                <div className="icon">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s[0]}</h3>
                <p className="muted">{s[1]}</p>
                <button className="link-btn" onClick={() => navigate("/services")}>
                  Learn more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT PREVIEW ================= */}
      <section className="section section-soft">
        <div className="container two-col">
          <div>
            <h2>Why Choose Us</h2>
            <p className="muted">
              We simplify ISO compliance with practical guidance and real documentation — not just theory.
            </p>

            <div className="bullets">
              {[
                ["Fast Implementation", "Clear roadmap and ready templates to reduce time."],
                ["Industry Experience", "Manufacturing, IT, healthcare, construction and more."],
                ["Audit Support", "We help you prepare, face audits, and close NCs."],
              ].map((b, i) => (
                <div className="bullet" key={i}>
                  <span className="dot" />
                  <div>
                    <h4>{b[0]}</h4>
                    <p className="muted">{b[1]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => navigate("/about")}>
                More about us →
              </button>
            </div>
          </div>

          <div className="image-box">
            <div className="image-card">
              <h3>Popular Standards</h3>
              <div className="pills">
                <span>ISO 9001</span>
                <span>ISO 14001</span>
                <span>ISO 45001</span>
                <span>ISO 27001</span>
                <span>ISO 22000</span>
              </div>
              <div className="divider" />
              <p className="muted">
                Choose the standard you need — we guide you from start to certification.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/contact")}>
                Request Callback
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS PREVIEW ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Our Process</h2>
            <p className="muted">Simple steps to get your ISO certification.</p>
          </div>

          <div className="timeline">
            {[
              ["Consultation", "Understand your needs and standard selection."],
              ["Gap Analysis", "Assess gaps and build an implementation plan."],
              ["Documentation", "Prepare required policies, SOPs and records."],
              ["Training", "Train your team and implement processes."],
              ["Internal Audit", "Audit support + corrective action closure."],
              ["Certification", "Support during external audit & certification."],
            ].map((t, i) => (
              <div className="step" key={i}>
                <div className="step-no">{i + 1}</div>
                <div>
                  <h3>{t[0]}</h3>
                  <p className="muted">{t[1]}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <button className="btn btn-outline" onClick={() => navigate("/process")}>
              View full process →
            </button>
          </div>
        </div>
      </section>

      {/* ================= FAQ PREVIEW ================= */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <h2>FAQs</h2>
            <p className="muted">Common questions about ISO consultancy and certification.</p>
          </div>

          <div className="faq-list">
            {[
              ["How long does ISO certification take?", "Typically 2–8 weeks depending on company size and readiness."],
              ["Which ISO is best for my business?", "ISO 9001, ISO 14001, ISO 45001, ISO 27001 based on your needs."],
              ["Do you provide documentation templates?", "Yes. We provide SOPs, formats, policies, manuals and records."],
              ["Do you support internal audits?", "Yes. We conduct internal audits and help close non-conformities."],
            ].map((f, i) => (
              <div className="faq-item" key={i}>
                <h3 className="faq-q">{f[0]}</h3>
                <p className="faq-a muted">{f[1]}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <button className="btn btn-outline" onClick={() => navigate("/faqs")}>
              View all FAQs →
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEEDBACK PREVIEW ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Feedback</h2>
            <p className="muted">Help us improve. Share your feedback.</p>
          </div>

          <div className="feedback-grid">
            <div className="feedback-card">
              <h3>Share Your Feedback</h3>
              <p className="muted">
                Your feedback helps us improve our consultancy and website experience.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/feedback")}>
                Give Feedback →
              </button>
            </div>

            <div className="feedback-card soft">
              <h3>Need Support?</h3>
              <p className="muted">
                For quick help, go to Contact page and send your requirement.
              </p>
              <button className="btn btn-outline" onClick={() => navigate("/contact")}>
                Contact Now →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
