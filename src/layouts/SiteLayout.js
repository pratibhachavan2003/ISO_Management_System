import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../pages/home/HomePage.css";

export default function SiteLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ✅ Close mobile menu when route changes */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ✅ Add shadow when scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home">
      {/* ================= STICKY NAVBAR ================= */}
      <header className={`nav nav-sticky ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <div className="brand" onClick={() => navigate("/")}>
            <span className="brand-badge">ISO</span>
            <span className="brand-name">Consultancy System</span>
          </div>

          {/* ================= DESKTOP LINKS ================= */}
          <nav className="nav-links desktop-only">
            {/* ✅ HOME BUTTON */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/process"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Process
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              FAQs
            </NavLink>

            <NavLink
              to="/feedback"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Feedback
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* ================= DESKTOP AUTH BUTTONS ================= */}
          <div className="nav-actions desktop-only">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>

          {/* ================= MOBILE HAMBURGER ================= */}
          <button
            className="nav-hamburger mobile-only"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          {/* ✅ HOME BUTTON */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            Services
          </NavLink>

          <NavLink
            to="/process"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            Process
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/faqs"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            FAQs
          </NavLink>

          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            Feedback
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `mobile-link ${isActive ? "active" : ""}`
            }
          >
            Contact
          </NavLink>

          {/* Mobile Login/Signup */}
          <div className="mobile-actions">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Spacer (prevents content hiding behind navbar) */}
      <div className="nav-spacer" />

      {/* ================= PAGE CONTENT ================= */}
      <main key={location.pathname} className="page-animate">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer-grid">
          {/* Brand */}
          <div>
            <div className="brand footer-brand">
              <span className="brand-badge">ISO</span>
              <span className="brand-name">Consultancy System</span>
            </div>

            <p className="muted">
              ISO certification and compliance services with expert guidance.
            </p>

            {/* Social Icons */}
            <div className="footer-social">
              <a
                className="social-btn"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                f
              </a>

              <a
                className="social-btn"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                ⌁
              </a>

              <a
                className="social-btn"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                in
              </a>

              <a
                className="social-btn"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4>Quick Links</h4>
            <button
              className="footer-link"
              onClick={() => navigate("/services")}
            >
              Services
            </button>
            <button
              className="footer-link"
              onClick={() => navigate("/process")}
            >
              Process
            </button>
            <button className="footer-link" onClick={() => navigate("/about")}>
              About
            </button>
            <button
              className="footer-link"
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <p className="muted">Email: support@iso-system.com</p>
            <p className="muted">Phone: +91 90000 00000</p>
            <p className="muted">Office Hours: Mon–Sat (9AM–6PM)</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="muted">
            © {new Date().getFullYear()} ISO Consultancy System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
