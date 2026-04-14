import { Route, Routes } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/home/HomePage";
import ServicesPage from "../pages/services/ServicesPage";
import ProcessPage from "../pages/process/ProcessPage";
import AboutPage from "../pages/about/AboutPage";
import FaqsPage from "../pages/faqs/FaqsPage";
import FeedbackPage from "../pages/feedback/FeedbackPage";
import ContactPage from "../pages/contact/ContactPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import AdminHomePage from "../features/admin/pages/AdminHomePage";
import UserManagementPage from "../features/user/pages/UserManagementPage";
import AddEmployeePage from "../features/admin/pages/AddEmployeePage";
import AdminDocumentsPage from "../features/admin/pages/AdminDocumentsPage";
import AdminAuditsPage from "../features/admin/pages/AdminAuditsPage";
import AdminAuditRequestsPage from "../features/admin/pages/AdminAuditRequestsPage";
import AdminNonConformancePage from "../features/admin/pages/AdminNonConformancePage";
import UserDashboardPage from "../features/user/pages/UserDashboardPage";
import UserNotificationsPage from "../features/user/pages/UserNotificationsPage";
import AuditorDashboardPage from "../features/audit/pages/AuditorDashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="add-employee" element={<AddEmployeePage />} />
        <Route path="documents" element={<AdminDocumentsPage />} />
        <Route path="audits" element={<AdminAuditsPage />} />
        <Route path="audit-requests" element={<AdminAuditRequestsPage />} />
        <Route path="nc" element={<AdminNonConformancePage />} />
      </Route>

      <Route path="/user" element={<UserDashboardPage />} />
      <Route path="/user/notifications" element={<UserNotificationsPage />} />
      <Route path="/auditor" element={<AuditorDashboardPage />} />

      <Route
        path="*"
        element={<h2 style={{ textAlign: "center", marginTop: "60px" }}>404 Page Not Found</h2>}
      />
    </Routes>
  );
}
