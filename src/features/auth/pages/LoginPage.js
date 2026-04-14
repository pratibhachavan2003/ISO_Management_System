import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        alert(errText || "Login failed");
        return;
      }

      const data = await response.json();

      console.log("LOGIN RESPONSE =>", data);

      if (data.message === "Login Successfully") {
        const roleid = Number(data.roleid);

        // Save login data
        localStorage.setItem("username", data.username || email);
        localStorage.setItem("roleid", String(roleid));
        localStorage.setItem("email", email);

        // Role-based routing
        if (roleid === 1) {
          navigate("/admin"); // Admin
        } 
        else if (roleid === 2) {
          navigate("/user"); // User / Client
        } 
        else if (roleid === 3) {
          navigate("/staff"); // Coordinator (only if route exists)
        } 
        else if (roleid === 4) {
          navigate("/auditor"); // Auditor
        } 
        else {
          navigate("/");
        }

      } else {
        alert(data.message || "Invalid Login");
      }

    } catch (err) {
      console.error(err);
      alert("Server not reachable. Start Spring Boot on port 8080.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Submit */}
        <button type="submit">Login</button>

        <p>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;