import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardCards from "./DashboardCards";


function AdminDashboard() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <DashboardCards />

        <div className="table-section">
          <h3>User Management</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Auditor</td>
                <td>Quality</td>
                <td className="status active">Active</td>
                <td>Edit</td>
              </tr>
              <tr>
                <td>Admin</td>
                <td>Admin</td>
                <td>Management</td>
                <td className="status compliant">Compliant</td>
                <td>Edit</td>
              </tr>
              <tr>
                <td>Employee</td>
                <td>Employee</td>
                <td>Production</td>
                <td className="status non">Non-Compliant</td>
                <td>Edit</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
