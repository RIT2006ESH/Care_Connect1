export const sidebarSections = [
  {
    label: "Dashboard",
    items: [
      { label: "Overview", path: "/admin/dashboard", icon: "fas fa-th-large" },
    ],
  },
  {
    label: "User Management",
    items: [
      { label: "Doctors", path: "/admin/users/doctors", icon: "fas fa-user-md" },
      { label: "Patients", path: "/admin/users/patients", icon: "fas fa-procedures" },
      { label: "Staff", path: "/admin/users/staff", icon: "fas fa-user-friends" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Hospital Management", path: "/admin/hospitals", icon: "fas fa-hospital" },
      { label: "Appointment Management", path: "/admin/appointments", icon: "fas fa-calendar-check" },
      { label: "Health Notices", path: "/admin/health-notices", icon: "fas fa-bullhorn" },
      { label: "Emergency Alerts", path: "/admin/emergency-alerts", icon: "fas fa-exclamation-triangle" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Disease Analytics", path: "/admin/disease-analytics", icon: "fas fa-chart-line" },
      { label: "Weather Monitoring", path: "/admin/weather-monitoring", icon: "fas fa-cloud-sun-rain" },
      { label: "Reports", path: "/admin/reports", icon: "fas fa-file-export" },
      { label: "Notification Center", path: "/admin/notifications", icon: "fas fa-bell" },
      { label: "Feedback & Complaints", path: "/admin/feedback-complaints", icon: "fas fa-comment-dots" },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Audit Logs", path: "/admin/audit-logs", icon: "fas fa-clipboard-list" },
      { label: "Role & Permissions", path: "/admin/roles-permissions", icon: "fas fa-user-shield" },
      { label: "Security Center", path: "/admin/security-center", icon: "fas fa-shield-alt" },
      { label: "Settings", path: "/admin/settings", icon: "fas fa-cogs" },
    ],
  },
];

export const dashboardStats = [
  { label: "Total Doctors", value: "148", delta: "+12 this month", icon: "fas fa-user-md", tone: "info" },
  { label: "Total Patients", value: "2,864", delta: "+118 this week", icon: "fas fa-users", tone: "success" },
  { label: "Total Hospitals", value: "18", delta: "3 networks", icon: "fas fa-hospital", tone: "primary" },
  { label: "Total Staff", value: "96", delta: "4 open roles", icon: "fas fa-user-friends", tone: "warning" },
  { label: "Active Appointments", value: "342", delta: "+28 today", icon: "fas fa-calendar-check", tone: "success" },
  { label: "Emergency Cases", value: "9", delta: "2 escalated", icon: "fas fa-ambulance", tone: "danger" },
  { label: "Active Health Notices", value: "11", delta: "4 scheduled", icon: "fas fa-bullhorn", tone: "primary" },
  { label: "Weather Alerts", value: "5", delta: "Heat wave watch", icon: "fas fa-cloud-sun-rain", tone: "warning" },
];

export const dashboardQuickActions = [
  { label: "Add Doctor", icon: "fas fa-user-plus", tone: "primary" },
  { label: "Create Notice", icon: "fas fa-plus-circle", tone: "success" },
  { label: "Send Alert", icon: "fas fa-bell", tone: "warning" },
  { label: "Export Report", icon: "fas fa-file-export", tone: "info" },
];

export const dashboardActivities = [
  { title: "Doctor license verified", meta: "Dr. Sarah Johnson • 10 mins ago" },
  { title: "Emergency alert scheduled", meta: "Flood warning • 25 mins ago" },
  { title: "Complaint assigned to support", meta: "Ticket #CC-1421 • 40 mins ago" },
  { title: "New patient registered", meta: "Rachel Gomez • 1 hour ago" },
  { title: "Health notice published", meta: "Vaccination drive • 2 hours ago" },
];

export const dashboardAppointments = [
  { id: "APT-3001", patient: "Aarav Shah", doctor: "Dr. Emily Brown", time: "09:30 AM", mode: "Online", status: "Confirmed" },
  { id: "APT-3002", patient: "Maya Patel", doctor: "Dr. David Brown", time: "10:15 AM", mode: "Offline", status: "Pending" },
  { id: "APT-3003", patient: "Noah Wilson", doctor: "Dr. Sarah Johnson", time: "11:00 AM", mode: "Online", status: "Rescheduled" },
  { id: "APT-3004", patient: "Liam Turner", doctor: "Dr. Michael Chen", time: "12:30 PM", mode: "Offline", status: "Confirmed" },
];

export const dashboardAnalytics = [
  { label: "Appointment load", value: "86%", helper: "Peak on weekdays" },
  { label: "User retention", value: "91%", helper: "Weekly active users" },
  { label: "Emergency response", value: "2m 14s", helper: "Average escalation time" },
  { label: "Weather warning reach", value: "98%", helper: "Alerts delivered" },
];

const makeRecords = (items) => items.map((item, index) => ({ id: item.id || String(index + 1), ...item }));

const doctorRows = makeRecords([
  { id: "DOC-1001", name: "Dr. Sarah Johnson", specialty: "Cardiology", hospital: "CareConnect General", license: "Verified", status: "Active", patients: 184 },
  { id: "DOC-1002", name: "Dr. Michael Chen", specialty: "Dermatology", hospital: "Northview Hospital", license: "Pending", status: "Suspended", patients: 96 },
  { id: "DOC-1003", name: "Dr. Emily Williams", specialty: "Neurology", hospital: "Metro Health", license: "Verified", status: "Active", patients: 141 },
  { id: "DOC-1004", name: "Dr. David Brown", specialty: "General Physician", hospital: "City Medical Center", license: "Verified", status: "Active", patients: 218 },
  { id: "DOC-1005", name: "Dr. Aisha Khan", specialty: "Pediatrics", hospital: "Sunrise Clinic", license: "Under Review", status: "Inactive", patients: 77 },
]);

const patientRows = makeRecords([
  { id: "PAT-2101", name: "Rachel Gomez", age: 34, gender: "Female", condition: "Hypertension", status: "Active", visits: 12 },
  { id: "PAT-2102", name: "Aarav Shah", age: 47, gender: "Male", condition: "Diabetes", status: "Blocked", visits: 18 },
  { id: "PAT-2103", name: "Maya Patel", age: 28, gender: "Female", condition: "Asthma", status: "Active", visits: 7 },
  { id: "PAT-2104", name: "Noah Wilson", age: 56, gender: "Male", condition: "Cardiac Care", status: "Active", visits: 19 },
  { id: "PAT-2105", name: "Sophia Lee", age: 41, gender: "Female", condition: "Orthopedic Rehab", status: "Unblocked", visits: 5 },
]);

const staffRows = makeRecords([
  { id: "STF-3001", name: "Priya Nair", role: "Receptionist", department: "Front Desk", status: "Active", shift: "Morning" },
  { id: "STF-3002", name: "Daniel Reed", role: "Nurse", department: "Inpatient Care", status: "Active", shift: "Night" },
  { id: "STF-3003", name: "Emma Thompson", role: "Operator", department: "Call Center", status: "Inactive", shift: "Evening" },
  { id: "STF-3004", name: "Olivia Martin", role: "Admin", department: "Operations", status: "Active", shift: "Day" },
]);

const hospitalRows = makeRecords([
  { id: "HSP-4001", name: "CareConnect General", city: "Pune", capacity: 420, contacts: "+91 98765 43210", status: "Active" },
  { id: "HSP-4002", name: "Northview Hospital", city: "Mumbai", capacity: 315, contacts: "+91 98765 43211", status: "Active" },
  { id: "HSP-4003", name: "Metro Health", city: "Bengaluru", capacity: 280, contacts: "+91 98765 43212", status: "Inactive" },
  { id: "HSP-4004", name: "Sunrise Clinic", city: "Chennai", capacity: 120, contacts: "+91 98765 43213", status: "Active" },
]);

const appointmentRows = makeRecords([
  { id: "APT-5001", patient: "Aarav Shah", doctor: "Dr. Sarah Johnson", date: "2026-08-01", mode: "Online", status: "Pending" },
  { id: "APT-5002", patient: "Maya Patel", doctor: "Dr. Michael Chen", date: "2026-08-01", mode: "Offline", status: "Approved" },
  { id: "APT-5003", patient: "Noah Wilson", doctor: "Dr. David Brown", date: "2026-08-02", mode: "Online", status: "Rescheduled" },
  { id: "APT-5004", patient: "Sophia Lee", doctor: "Dr. Emily Williams", date: "2026-08-02", mode: "Offline", status: "Cancelled" },
]);

const noticeRows = makeRecords([
  { id: "NTC-6001", title: "Heat Wave Advisory", severity: "High", location: "North District", startDate: "2026-08-01", status: "Published" },
  { id: "NTC-6002", title: "Vaccination Drive", severity: "Medium", location: "Central City", startDate: "2026-08-03", status: "Draft" },
  { id: "NTC-6003", title: "Clinic Maintenance", severity: "Low", location: "West Zone", startDate: "2026-08-05", status: "Scheduled" },
]);

const alertRows = makeRecords([
  { id: "ALT-7001", type: "Heat Wave", severity: "Critical", state: "Maharashtra", city: "Pune", status: "Published" },
  { id: "ALT-7002", type: "Flood", severity: "High", state: "Kerala", city: "Kochi", status: "Scheduled" },
  { id: "ALT-7003", type: "AQI Warning", severity: "Medium", state: "Delhi", city: "New Delhi", status: "Draft" },
]);

const diseaseRows = makeRecords([
  { id: "DGN-8001", disease: "Dengue", trend: "+14%", risk: "High", location: "South Zone", weekly: 42 },
  { id: "DGN-8002", disease: "Influenza", trend: "+8%", risk: "Medium", location: "North Zone", weekly: 78 },
  { id: "DGN-8003", disease: "Malaria", trend: "+5%", risk: "High", location: "River Belt", weekly: 26 },
]);

const weatherRows = makeRecords([
  { id: "WTH-9001", metric: "Temperature", value: "34°C", state: "Maharashtra", status: "High" },
  { id: "WTH-9002", metric: "Humidity", value: "71%", state: "Gujarat", status: "Normal" },
  { id: "WTH-9003", metric: "AQI", value: "186", state: "Delhi", status: "Warning" },
]);

const reportRows = makeRecords([
  { id: "RPT-1001", report: "Doctor Utilization", format: "PDF/CSV", status: "Ready", updated: "Today" },
  { id: "RPT-1002", report: "Patient Trends", format: "Excel", status: "Ready", updated: "Today" },
  { id: "RPT-1003", report: "Emergency Summary", format: "PDF", status: "Scheduled", updated: "Yesterday" },
]);

const notificationRows = makeRecords([
  { id: "NTF-1101", channel: "Broadcast", audience: "All Staff", schedule: "Immediate", status: "Sent" },
  { id: "NTF-1102", channel: "Email", audience: "Doctors", schedule: "08:00 AM", status: "Scheduled" },
  { id: "NTF-1103", channel: "SMS", audience: "Patients", schedule: "Draft", status: "Draft" },
]);

const feedbackRows = makeRecords([
  { id: "FDB-1201", type: "Complaint", subject: "Waiting time", assignee: "Support Team", status: "Open" },
  { id: "FDB-1202", type: "Feedback", subject: "Excellent care", assignee: "Quality Desk", status: "Closed" },
  { id: "FDB-1203", type: "Complaint", subject: "Billing issue", assignee: "Accounts", status: "In Progress" },
]);

const auditRows = makeRecords([
  { id: "AUD-1301", timestamp: "2026-08-01 09:15", user: "Admin User", module: "Doctors", action: "Verified license", ipAddress: "192.168.0.21", status: "Success" },
  { id: "AUD-1302", timestamp: "2026-08-01 09:45", user: "Support Staff", module: "Complaints", action: "Assigned ticket", ipAddress: "192.168.0.34", status: "Success" },
  { id: "AUD-1303", timestamp: "2026-08-01 10:05", user: "System", module: "Security", action: "Blocked login", ipAddress: "192.168.0.12", status: "Flagged" },
]);

const rolesRows = makeRecords([
  { id: "ROL-1401", role: "Super Admin", permissions: "Full access", members: 2, status: "Active" },
  { id: "ROL-1402", role: "Hospital Admin", permissions: "Hospital scope", members: 6, status: "Active" },
  { id: "ROL-1403", role: "Doctor", permissions: "Clinical operations", members: 148, status: "Active" },
  { id: "ROL-1404", role: "Receptionist", permissions: "Appointments", members: 18, status: "Active" },
]);

const securityRows = makeRecords([
  { id: "SEC-1501", metric: "Failed Logins", value: 14, detail: "3 suspicious IPs", status: "Watch" },
  { id: "SEC-1502", metric: "Blocked Users", value: 6, detail: "Manual review pending", status: "Review" },
  { id: "SEC-1503", metric: "Active Sessions", value: 248, detail: "42 mobile sessions", status: "Normal" },
]);

const settingsRows = makeRecords([
  { id: "SET-1601", setting: "General Settings", value: "Configured", status: "Enabled" },
  { id: "SET-1602", setting: "Email Configuration", value: "Verified", status: "Enabled" },
  { id: "SET-1603", setting: "Database Backup", value: "Daily 02:00 AM", status: "Scheduled" },
]);

export const moduleRegistry = {
  doctors: {
    title: "Doctors",
    subtitle: "View, verify, suspend, and manage medical practitioners.",
    breadcrumb: ["User Management", "Doctors"],
    variant: "table",
    summaryCards: [
      { label: "Total Doctors", value: "148" },
      { label: "Verified Licenses", value: "136" },
      { label: "Suspended", value: "6" },
      { label: "New This Month", value: "+12" },
    ],
    filters: [
      { label: "All Doctors", value: "all" },
      { label: "Active", value: "active" },
      { label: "Suspended", value: "suspended" },
      { label: "Verification Pending", value: "pending" },
    ],
    columns: [
      { key: "id", label: "Doctor ID" },
      { key: "name", label: "Doctor" },
      { key: "specialty", label: "Specialty" },
      { key: "hospital", label: "Hospital" },
      { key: "license", label: "License" },
      { key: "status", label: "Status" },
    ],
    rows: doctorRows,
    formFields: [
      { key: "name", label: "Doctor Name", type: "text" },
      { key: "specialty", label: "Specialty", type: "text" },
      { key: "hospital", label: "Hospital", type: "text" },
      { key: "license", label: "License Status", type: "select", options: ["Verified", "Pending", "Under Review"] },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended"] },
    ],
  },
  patients: {
    title: "Patients",
    subtitle: "Track patient profiles, histories, and access status.",
    breadcrumb: ["User Management", "Patients"],
    variant: "table",
    summaryCards: [
      { label: "Total Patients", value: "2,864" },
      { label: "Active", value: "2,715" },
      { label: "Blocked", value: "21" },
      { label: "New This Week", value: "+118" },
    ],
    filters: [
      { label: "All Patients", value: "all" },
      { label: "Active", value: "active" },
      { label: "Blocked", value: "blocked" },
      { label: "Unblocked", value: "unblocked" },
    ],
    columns: [
      { key: "id", label: "Patient ID" },
      { key: "name", label: "Patient" },
      { key: "age", label: "Age" },
      { key: "gender", label: "Gender" },
      { key: "condition", label: "Condition" },
      { key: "status", label: "Status" },
    ],
    rows: patientRows,
    formFields: [
      { key: "name", label: "Patient Name", type: "text" },
      { key: "age", label: "Age", type: "number" },
      { key: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"] },
      { key: "condition", label: "Medical Condition", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Blocked", "Unblocked"] },
    ],
  },
  staff: {
    title: "Staff",
    subtitle: "Manage receptionists, nurses, operators, and admins.",
    breadcrumb: ["User Management", "Staff"],
    variant: "table",
    summaryCards: [
      { label: "Total Staff", value: "96" },
      { label: "Receptionists", value: "18" },
      { label: "Nurses", value: "42" },
      { label: "Admins", value: "8" },
    ],
    filters: [
      { label: "All Staff", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    columns: [
      { key: "id", label: "Staff ID" },
      { key: "name", label: "Staff Member" },
      { key: "role", label: "Role" },
      { key: "department", label: "Department" },
      { key: "shift", label: "Shift" },
      { key: "status", label: "Status" },
    ],
    rows: staffRows,
    formFields: [
      { key: "name", label: "Staff Name", type: "text" },
      { key: "role", label: "Role", type: "select", options: ["Receptionist", "Nurse", "Operator", "Admin"] },
      { key: "department", label: "Department", type: "text" },
      { key: "shift", label: "Shift", type: "select", options: ["Morning", "Day", "Evening", "Night"] },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
    ],
  },
  hospitals: {
    title: "Hospital Management",
    subtitle: "Maintain hospital records, contacts, capacity, and status.",
    breadcrumb: ["Operations", "Hospital Management"],
    variant: "table",
    summaryCards: [
      { label: "Hospitals", value: "18" },
      { label: "Active", value: "16" },
      { label: "Capacity", value: "1,435" },
      { label: "Emergency Lines", value: "18" },
    ],
    filters: [
      { label: "All Hospitals", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    columns: [
      { key: "id", label: "Hospital ID" },
      { key: "name", label: "Hospital" },
      { key: "city", label: "City" },
      { key: "capacity", label: "Capacity" },
      { key: "contacts", label: "Emergency Contact" },
      { key: "status", label: "Status" },
    ],
    rows: hospitalRows,
    formFields: [
      { key: "name", label: "Hospital Name", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "capacity", label: "Capacity", type: "number" },
      { key: "contacts", label: "Emergency Contact", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
    ],
  },
  appointments: {
    title: "Appointment Management",
    subtitle: "Approve, cancel, reschedule, and assign doctors to appointments.",
    breadcrumb: ["Operations", "Appointment Management"],
    variant: "table",
    summaryCards: [
      { label: "Appointments", value: "342" },
      { label: "Pending", value: "41" },
      { label: "Approved", value: "286" },
      { label: "Cancelled", value: "15" },
    ],
    filters: [
      { label: "All Appointments", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Cancelled", value: "cancelled" },
    ],
    columns: [
      { key: "id", label: "Appointment ID" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "date", label: "Date" },
      { key: "mode", label: "Mode" },
      { key: "status", label: "Status" },
    ],
    rows: appointmentRows,
    formFields: [
      { key: "patient", label: "Patient Name", type: "text" },
      { key: "doctor", label: "Assign Doctor", type: "text" },
      { key: "date", label: "Appointment Date", type: "date" },
      { key: "mode", label: "Mode", type: "select", options: ["Online", "Offline"] },
      { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Cancelled", "Rescheduled"] },
    ],
  },
  notices: {
    title: "Health Notices",
    subtitle: "Draft, publish, archive, and schedule public health notices.",
    breadcrumb: ["Operations", "Health Notices"],
    variant: "table",
    summaryCards: [
      { label: "Notices", value: "11" },
      { label: "Published", value: "7" },
      { label: "Scheduled", value: "2" },
      { label: "Drafts", value: "2" },
    ],
    filters: [
      { label: "All Notices", value: "all" },
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
      { label: "Scheduled", value: "scheduled" },
    ],
    columns: [
      { key: "id", label: "Notice ID" },
      { key: "title", label: "Title" },
      { key: "severity", label: "Severity" },
      { key: "location", label: "Target Location" },
      { key: "startDate", label: "Start Date" },
      { key: "status", label: "Status" },
    ],
    rows: noticeRows,
    formFields: [
      { key: "title", label: "Title", type: "text" },
      { key: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High", "Critical"] },
      { key: "location", label: "Target Location", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Scheduled", "Published", "Archived"] },
    ],
  },
  alerts: {
    title: "Emergency Alerts",
    subtitle: "Prepare and publish emergency alerts for active public risks.",
    breadcrumb: ["Operations", "Emergency Alerts"],
    variant: "table",
    summaryCards: [
      { label: "Alerts", value: "9" },
      { label: "Critical", value: "3" },
      { label: "Scheduled", value: "2" },
      { label: "Published", value: "4" },
    ],
    filters: [
      { label: "All Alerts", value: "all" },
      { label: "Draft", value: "draft" },
      { label: "Scheduled", value: "scheduled" },
      { label: "Published", value: "published" },
    ],
    columns: [
      { key: "id", label: "Alert ID" },
      { key: "type", label: "Type" },
      { key: "severity", label: "Severity" },
      { key: "state", label: "Target State" },
      { key: "city", label: "Target City" },
      { key: "status", label: "Status" },
    ],
    rows: alertRows,
    formFields: [
      { key: "type", label: "Alert Type", type: "select", options: ["Heat Wave", "Flood", "Cyclone", "Earthquake", "Disease Outbreak", "AQI Warning"] },
      { key: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High", "Critical"] },
      { key: "state", label: "Target State", type: "text" },
      { key: "city", label: "Target City", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Scheduled", "Published"] },
    ],
  },
  diseaseAnalytics: {
    title: "Disease Analytics",
    subtitle: "Analyze trends, risk regions, and predictions across diseases.",
    breadcrumb: ["Insights", "Disease Analytics"],
    variant: "analytics",
    summaryCards: [
      { label: "Weekly Cases", value: "146" },
      { label: "High Risk Zones", value: "7" },
      { label: "Prediction Confidence", value: "93%" },
      { label: "Monthly Trend", value: "+11%" },
    ],
    rows: diseaseRows,
  },
  weatherMonitoring: {
    title: "Weather Monitoring",
    subtitle: "Monitor temperature, humidity, rainfall, wind, UV, and AQI.",
    breadcrumb: ["Insights", "Weather Monitoring"],
    variant: "analytics",
    summaryCards: [
      { label: "Temperature", value: "34°C" },
      { label: "Humidity", value: "71%" },
      { label: "AQI", value: "186" },
      { label: "Alerts", value: "5" },
    ],
    rows: weatherRows,
  },
  reports: {
    title: "Reports",
    subtitle: "Generate and export reports for doctors, patients, hospitals, and alerts.",
    breadcrumb: ["Insights", "Reports"],
    variant: "analytics",
    summaryCards: [
      { label: "Ready Reports", value: "18" },
      { label: "PDF", value: "8" },
      { label: "Excel", value: "6" },
      { label: "CSV", value: "4" },
    ],
    rows: reportRows,
  },
  notifications: {
    title: "Notification Center",
    subtitle: "Broadcast notifications across email, SMS, and push channels.",
    breadcrumb: ["Insights", "Notification Center"],
    variant: "table",
    summaryCards: [
      { label: "Broadcasts", value: "6" },
      { label: "Email", value: "4" },
      { label: "SMS", value: "3" },
      { label: "History Items", value: "23" },
    ],
    filters: [
      { label: "All Channels", value: "all" },
      { label: "Broadcast", value: "broadcast" },
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
    ],
    columns: [
      { key: "id", label: "Notification ID" },
      { key: "channel", label: "Channel" },
      { key: "audience", label: "Audience" },
      { key: "schedule", label: "Schedule" },
      { key: "status", label: "Status" },
    ],
    rows: notificationRows,
    formFields: [
      { key: "channel", label: "Channel", type: "select", options: ["Broadcast", "Email", "SMS", "Push"] },
      { key: "audience", label: "Audience", type: "text" },
      { key: "schedule", label: "Schedule", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Scheduled", "Sent"] },
    ],
  },
  feedbackComplaints: {
    title: "Feedback & Complaints",
    subtitle: "Assign, resolve, and close patient and doctor feedback items.",
    breadcrumb: ["Insights", "Feedback & Complaints"],
    variant: "table",
    summaryCards: [
      { label: "Open Tickets", value: "12" },
      { label: "Resolved", value: "28" },
      { label: "Escalated", value: "4" },
      { label: "Feedback Items", value: "31" },
    ],
    filters: [
      { label: "All Items", value: "all" },
      { label: "Complaint", value: "complaint" },
      { label: "Feedback", value: "feedback" },
      { label: "Closed", value: "closed" },
    ],
    columns: [
      { key: "id", label: "Ticket ID" },
      { key: "type", label: "Type" },
      { key: "subject", label: "Subject" },
      { key: "assignee", label: "Assigned To" },
      { key: "status", label: "Status" },
    ],
    rows: feedbackRows,
    formFields: [
      { key: "type", label: "Type", type: "select", options: ["Complaint", "Feedback"] },
      { key: "subject", label: "Subject", type: "text" },
      { key: "assignee", label: "Assign To", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Resolved", "Closed"] },
    ],
  },
  auditLogs: {
    title: "Audit Logs",
    subtitle: "Track every action across users, modules, IP addresses, and statuses.",
    breadcrumb: ["Governance", "Audit Logs"],
    variant: "table",
    summaryCards: [
      { label: "Entries", value: "1,245" },
      { label: "Flagged", value: "19" },
      { label: "Today", value: "84" },
      { label: "Unique Users", value: "31" },
    ],
    filters: [
      { label: "All Logs", value: "all" },
      { label: "Success", value: "success" },
      { label: "Flagged", value: "flagged" },
    ],
    columns: [
      { key: "timestamp", label: "Timestamp" },
      { key: "user", label: "User" },
      { key: "module", label: "Module" },
      { key: "action", label: "Action" },
      { key: "ipAddress", label: "IP Address" },
      { key: "status", label: "Status" },
    ],
    rows: auditRows,
  },
  rolesPermissions: {
    title: "Role & Permissions",
    subtitle: "Manage access levels, permission matrices, and assignments.",
    breadcrumb: ["Governance", "Role & Permissions"],
    variant: "table",
    summaryCards: [
      { label: "Roles", value: "6" },
      { label: "Permissions", value: "48" },
      { label: "Assigned Users", value: "264" },
      { label: "Pending Requests", value: "8" },
    ],
    filters: [
      { label: "All Roles", value: "all" },
      { label: "Active", value: "active" },
      { label: "Custom", value: "custom" },
    ],
    columns: [
      { key: "id", label: "Role ID" },
      { key: "role", label: "Role" },
      { key: "permissions", label: "Permissions" },
      { key: "members", label: "Members" },
      { key: "status", label: "Status" },
    ],
    rows: rolesRows,
    formFields: [
      { key: "role", label: "Role Name", type: "text" },
      { key: "permissions", label: "Permission Scope", type: "text" },
      { key: "members", label: "Assigned Users", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
    ],
  },
  securityCenter: {
    title: "Security Center",
    subtitle: "Monitor failed logins, blocked users, sessions, and suspicious activity.",
    breadcrumb: ["Governance", "Security Center"],
    variant: "table",
    summaryCards: [
      { label: "Failed Logins", value: "14" },
      { label: "Blocked Users", value: "6" },
      { label: "Active Sessions", value: "248" },
      { label: "Suspicious Activities", value: "3" },
    ],
    filters: [
      { label: "All Events", value: "all" },
      { label: "Watch", value: "watch" },
      { label: "Review", value: "review" },
      { label: "Normal", value: "normal" },
    ],
    columns: [
      { key: "id", label: "Security ID" },
      { key: "metric", label: "Metric" },
      { key: "value", label: "Value" },
      { key: "detail", label: "Detail" },
      { key: "status", label: "Status" },
    ],
    rows: securityRows,
  },
  settings: {
    title: "Settings",
    subtitle: "Manage system, branding, integrations, backups, and profile settings.",
    breadcrumb: ["Governance", "Settings"],
    variant: "settings",
    summaryCards: [
      { label: "Configured Modules", value: "13" },
      { label: "API Keys", value: "4" },
      { label: "Backups", value: "Daily" },
      { label: "Theme", value: "Green Light" },
    ],
    rows: settingsRows,
    sections: [
      {
        title: "General Settings",
        description: "Organization name, contact details, and locale.",
        items: ["Hospital name", "Region", "Timezone", "Language"],
      },
      {
        title: "System Settings",
        description: "Platform preferences and retention settings.",
        items: ["Session timeout", "Audit retention", "Default landing page", "Maintenance mode"],
      },
      {
        title: "Email & SMS",
        description: "Configure outgoing notifications and templates.",
        items: ["SMTP host", "Sender address", "SMS gateway", "Template library"],
      },
      {
        title: "Backup & Restore",
        description: "Create backup snapshots and restore environments.",
        items: ["Database backup", "Restore point", "Export schedule", "Retention policy"],
      },
    ],
  },
};

export const dashboardChartSeries = {
  appointments: [
    { name: "Mon", online: 42, offline: 26 },
    { name: "Tue", online: 54, offline: 34 },
    { name: "Wed", online: 50, offline: 40 },
    { name: "Thu", online: 68, offline: 46 },
    { name: "Fri", online: 74, offline: 52 },
    { name: "Sat", online: 58, offline: 36 },
    { name: "Sun", online: 38, offline: 22 },
  ],
  users: [
    { name: "Doctors", value: 148 },
    { name: "Patients", value: 2864 },
    { name: "Staff", value: 96 },
  ],
};
