import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ✅ PUBLIC SITE LAYOUT (Navbar + Footer for all public pages) */
import SiteLayout from "./SiteLayout";

/* ✅ PUBLIC PAGES */
import HomePage from "./HomePage";
import Services from "./pages/Services";
import Process from "./pages/Process";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";

/* ✅ AUTH PAGES */
import Login from "./Login";
import Signup from "./Signup";

/* ✅ ADMIN PAGES */
import AdminLayout from "./AdminLayout";
import AdminHome from "./AdminHome";
import UserManagementTable from "./UserManagementTable";
import AddEmployee from "./AddEmployee";
import AdminDocuments from "./AdminDocuments";
import AdminAudits from "./AdminAudits";
import AdminNC from "./AdminNC";

/* ✅ USER / STAFF DASHBOARD */
import UserDashboard from "./UserDashboard";
import AuditorDashboard from "./AuditorDashboard";

/* ✅ NEW PAGES */
import UserNotifications from "./UserNotifications";
import AdminAuditRequests from "./AdminAuditRequests";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC PAGES (Navbar + Footer) ================= */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<Process />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ================= AUTH PAGES (NO SiteLayout) ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= ADMIN ROUTES (Nested AdminLayout) ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} /> {/* /admin */}
          <Route path="users" element={<UserManagementTable />} /> {/* /admin/users */}
          <Route path="add-employee" element={<AddEmployee />} /> {/* /admin/add-employee */}
          <Route path="documents" element={<AdminDocuments />} /> {/* /admin/documents */}
          <Route path="audits" element={<AdminAudits />} /> {/* /admin/audits */}

          {/* ✅ NEW: Admin Audit Requests page */}
          <Route path="audit-requests" element={<AdminAuditRequests />} /> {/* /admin/audit-requests */}

          <Route path="nc" element={<AdminNC />} /> {/* /admin/nc */}
        </Route>

        {/* ================= USER / STAFF ROUTES ================= */}
        <Route path="/user" element={<UserDashboard />} />

        {/* ✅ NEW: User Notifications page */}
        <Route path="/user/notifications" element={<UserNotifications />} /> {/* /user/notifications */}

        <Route path="/auditor" element={<AuditorDashboard />} />

        {/* ================= 404 PAGE ================= */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "60px" }}>
              404 Page Not Found ❌
            </h2>
          }
          
        />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;