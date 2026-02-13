import React, { useState } from "react";
import "../HomePage.css";

export default function Feedback() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    rating: "",
    message: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("✅ Feedback submitted! Thank you.");
    setForm({ name: "", email: "", type: "", rating: "", message: "" });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Feedback</h2>
          <p className="muted">Your feedback helps us improve our consultancy and website.</p>
        </div>

        <div className="feedback-grid">
          <div className="feedback-card">
            <h3>Send Feedback</h3>
            <p className="muted">We read every message and improve the system.</p>

            <form className="feedback-form" onSubmit={submit}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" required />

              <select name="type" value={form.type} onChange={handleChange} required>
                <option value="" disabled>Select Feedback Type</option>
                <option value="Service Quality">Service Quality</option>
                <option value="Website / UI">Website / UI</option>
                <option value="Support">Support</option>
                <option value="Suggestion">Suggestion</option>
              </select>

              <select name="rating" value={form.rating} onChange={handleChange} required>
                <option value="" disabled>Select Rating</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>

              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your feedback..."
                required
              />

              <button type="submit" className="btn btn-primary">
                Submit Feedback
              </button>
            </form>
          </div>

          <div className="feedback-card soft">
            <h3>How we use feedback</h3>
            <p className="muted">We improve based on your feedback:</p>

            <div className="bullets" style={{ marginTop: 12 }}>
              {[
                "Better UI/UX design",
                "More ISO templates and examples",
                "Faster consultancy support",
                "Improved training content",
              ].map((x, i) => (
                <div className="bullet" key={i}>
                  <span className="dot" />
                  <p className="muted" style={{ margin: 0 }}>{x}</p>
                </div>
              ))}
            </div>

            <div className="divider" />
            <p className="muted">Thank you for helping us improve.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
