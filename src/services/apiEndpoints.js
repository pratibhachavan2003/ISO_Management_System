const apiEndpoints = {
  adminPendingAudits: "/audit/pending",
  adminAudits: "/audit/audits",
  auditCounts: "/audit/counts",
  auditRequests: "/audit/audit-details",
  userNotifications: "/audit/audit-details/user",
  rejectedAudits: "/audit/rejected",
  auditorMyAudits: "/auditor/my-audits",
  auditorAuditById: (id) => `/auditor/audit/${id}`,
  auditorAuditUpdates: (id) => `/auditor/audit/${id}/updates`,
  auditorRemark: (id) => `/auditor/audit/${id}/remark`,
  auditorStatus: (id) => `/auditor/audit/${id}/status`,
};

export default apiEndpoints;
