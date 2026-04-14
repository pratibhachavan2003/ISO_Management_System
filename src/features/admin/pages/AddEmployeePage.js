import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";

const API = "http://localhost:8080/api/users/admin/add-employee"; 

export default function AddEmployee() {
  const navigate = useNavigate();

  const roles = [
    { roleName: "Admin", roleId: 1 },
    { roleName: "User", roleId: 2 },
    { roleName: "Coordinator", roleId: 3 },
    { roleName: "Auditor", roleId: 4 },
  ];

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleid: "", // ✅ backend expects roleid
  });

  


  const handleChange = (e) => {
    setEmployee((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;

    setEmployee((p) => ({
      ...p,
      roleid: value ? Number(value) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // ✅ basic validation
    if (employee.password !== employee.confirmPassword) {
      alert("❌ Password and Confirm Password do not match");
      return;
    }

    try {
      const payload = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: employee.password,
        confirmPassword: employee.confirmPassword,
        roleid: Number(employee.roleid),
      };

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const message = await res.text();

if (!res.ok) {
  alert("❌ " + message);  
  return;
}

alert("✅ " + message);

      alert("✅ Employee Added Successfully!");

      // ✅ Go back to users list and tell it to refresh
      navigate("/admin/users", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert("⚠️ Server Error! Check backend.");
    }
  };

  return (
    <div className="add-employee-container">
      <form className="employee-form" onSubmit={handleSubmit}>
        <h2>➕ Add Employee</h2>

        <input
          type="text"
          name="firstName"
          placeholder="Enter First Name"
          value={employee.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Enter Last Name"
          value={employee.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={employee.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={employee.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={employee.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* ✅ Role Dropdown (RoleID) */}
        <select value={employee.roleid} onChange={handleRoleChange} required>
          <option value="">-- Select Role --</option>
          {roles.map((r) => (
            <option key={r.roleId} value={r.roleId}>
              {r.roleName}
            </option>
          ))}
        </select>

        {employee.roleid && (
          <p className="role-id-display">
            ✅ Role ID Assigned: <b>{employee.roleid}</b>
          </p>
        )}

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}
