import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";

const AddEmployee = () => {
  const navigate = useNavigate();

  // ✅ Role Mapping (Automatic RoleID)
  const roles = [
    { roleName: "Admin", roleId: 1 },
    { roleName: "User", roleId: 2 },
    { roleName: "Coordinator", roleId: 3 },
    { roleName: "Auditor", roleId: 4 },
  ];

  // ✅ Employee State
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleName: "",
    roleId: "",
  });

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Role Dropdown Change (Safe + No Crash)
  const handleRoleChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setEmployee((prev) => ({
        ...prev,
        roleName: "",
        roleId: "",
      }));
      return;
    }

    const selectedRole = roles.find((role) => role.roleName === value);
    if (!selectedRole) return;

    setEmployee((prev) => ({
      ...prev,
      roleName: selectedRole.roleName,
      roleId: selectedRole.roleId,
    }));
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ optional: block submit if role not selected
    if (!employee.roleId) {
      alert("Please select a role");
      return;
    }

    try {
      // ✅ IMPORTANT: POST to /api/users (same as table)
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          password: employee.password,
          roleid: employee.roleId, // ✅ table uses roleid
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        alert(msg || "❌ Failed to Add Employee!");
        return;
      }

      alert("✅ Employee Added Successfully!");

      // ✅ go back to list (table will fetch again if you refresh or you can click refresh btn)
      navigate("/admin/users");
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Server Error!");
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

        <select
          name="roleName"
          value={employee.roleName}
          onChange={handleRoleChange}
          required
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleName}>
              {role.roleName}
            </option>
          ))}
        </select>

        {employee.roleId && (
          <p className="role-id-display">
            ✅ Role ID Assigned: <b>{employee.roleId}</b>
          </p>
        )}

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
