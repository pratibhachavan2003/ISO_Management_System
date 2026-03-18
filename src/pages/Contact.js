import React, { useState } from "react";
import "../HomePage.css";

export default function Contact() {
  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    isoStandardCodes: [],
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStandardChange = (e) => {
    setContact((prev) => ({
      ...prev,
      isoStandardCodes: e.target.value ? [e.target.value] : [],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Failed to send message");
      }

      setMsg("✅ Message sent! We will contact you soon.");

      setContact({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        isoStandardCodes: [],
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setMsg("❌ " + error.message);
    } finally {
      setLoading(false);
    }
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
            <input
              name="fullName"
              value={contact.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />

            <input
              name="email"
              type="email"
              value={contact.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />

            <input
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />

            <input
              name="companyName"
              value={contact.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />

            <select
              value={contact.isoStandardCodes[0] || ""}
              onChange={handleStandardChange}
              required
            >
              <option value="" disabled>Select ISO Standard</option>
              <option value="ISO9001">ISO 9001 (Quality)</option>
              <option value="ISO14001">ISO 14001 (Environment)</option>
              <option value="ISO45001">ISO 45001 (Safety)</option>
              <option value="ISO27001">ISO 27001 (Information Security)</option>
              <option value="ISO22000">ISO 22000 (Food Safety)</option>
            </select>

            <textarea
              name="message"
              rows="4"
              value={contact.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}