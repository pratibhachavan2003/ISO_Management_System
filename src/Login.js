import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ Combined Role Routing
  const getRouteByRoleId = (roleid) => {
    const id = Number(roleid);

    if (id === 1) return "/admin";   // Admin
    if (id === 2) return "/user";    // User / Faculty

    // ✅ Coordinator + Auditor Combined
    if (id === 3 || id === 4) return "/staff";

    return "/"; // fallback
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  localStorage.setItem("username", data.username || email);
  localStorage.setItem("roleid", String(roleid));

  if (roleid === 1) navigate("/admin");
  else if (roleid === 2) navigate("/user");
  else if (roleid === 3 || roleid === 4) navigate("/staff");
  else navigate("/");
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
