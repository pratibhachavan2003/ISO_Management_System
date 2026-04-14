import React, { useEffect, useState } from "react";
import "../home/HomePage.css";

export default function Feedback() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    rating: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [fetching, setFetching] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadFeedback = async () => {
    try {
      setFetching(true);
      const res = await fetch("http://localhost:8080/api/feedback/feedback");
      if (!res.ok) throw new Error("Failed to load feedback");
      const data = await res.json();
      setFeedbackList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load feedback error:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/api/feedback/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Failed to submit feedback");
      }

      setMsg("G�� Feedback submitted! Thank you.");
      setForm({
        name: "",
        email: "",
        type: "",
        rating: "",
        message: "",
      });

      // reload saved feedback after submit
      loadFeedback();
    } catch (error) {
      console.error("Error:", error);
      setMsg("G�� " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Feedback</h2>
          <p className="muted">
            Your feedback helps us improve our consultancy and website.
          </p>
        </div>

        <div className="feedback-grid">
          <div className="feedback-card">
            <h3>Send Feedback</h3>
            <p className="muted">We read every message and improve the system.</p>

            <form className="feedback-form" onSubmit={submit}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Feedback Type</option>
                <option value="Service Quality">Service Quality</option>
                <option value="Website / UI">Website / UI</option>
                <option value="Support">Support</option>
                <option value="Suggestion">Suggestion</option>
              </select>

              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                required
              >
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

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>

              {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
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

        <div style={{ marginTop: "40px" }}>
          <h3>What our users say</h3>
          <p className="muted">Recent feedback from users</p>

          {fetching ? (
            <p>Loading feedback...</p>
          ) : feedbackList.length === 0 ? (
            <p className="muted">No feedback available yet.</p>
          ) : (
            <div className="feedback-grid" style={{ marginTop: "20px" }}>
              {feedbackList.map((item) => (
                <div className="feedback-card" key={item.id}>
                  <h4 style={{ marginBottom: "6px" }}>{item.name}</h4>
                  <p className="muted" style={{ marginBottom: "8px" }}>
                    {item.type} G�� {item.rating}
                  </p>
                  <p>{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
