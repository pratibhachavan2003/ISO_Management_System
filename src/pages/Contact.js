import React, { useState } from "react";
import "../HomePage.css";

export default function Contact() {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    standard: "",
    message: "",
  });

  const handleChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("✅ Message sent! We will contact you soon.");
    setContact({ name: "", email: "", phone: "", company: "", standard: "", message: "" });
  };

  return (
    <section className="section section-soft">
      <div className="container two-col">
        <div>
          <h2>Contact Us</h2>
          <p className="muted">
            Reach out for ISO consultancy, documentation, audits, training and certification support.
          </p>

          <div className="bullets" style={{ marginTop: 14 }}>
            {[
              ["Email", "support@iso-system.com"],
              ["Phone", "+91 90000 00000"],
              ["Office Hours", "Mon–Sat • 9:00 AM – 6:00 PM"],
              ["Response Time", "Within 24 hours"],
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

          <div className="divider" style={{ marginTop: 18 }} />
          <p className="muted" style={{ marginTop: 12 }}>
            Share your requirement and preferred ISO standard, we’ll guide you step-by-step.
          </p>
        </div>

        <div className="card glass">
          <h3>Send a Message</h3>
          <p className="muted">We’ll respond within 24 hours.</p>

          <form className="form" onSubmit={submit}>
            <input name="name" value={contact.name} onChange={handleChange} placeholder="Full Name" required />
            <input name="email" value={contact.email} onChange={handleChange} placeholder="Email Address" required />
            <input name="phone" value={contact.phone} onChange={handleChange} placeholder="Phone Number" required />
            <input name="company" value={contact.company} onChange={handleChange} placeholder="Company Name" required />

            <select name="standard" value={contact.standard} onChange={handleChange} required>
              <option value="" disabled>Select ISO Standard</option>
              <option value="ISO 9001">ISO 9001 (Quality)</option>
              <option value="ISO 14001">ISO 14001 (Environment)</option>
              <option value="ISO 45001">ISO 45001 (Safety)</option>
              <option value="ISO 27001">ISO 27001 (Information Security)</option>
              <option value="ISO 22000">ISO 22000 (Food Safety)</option>
            </select>

            <textarea
              name="message"
              rows="4"
              value={contact.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            />

            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
