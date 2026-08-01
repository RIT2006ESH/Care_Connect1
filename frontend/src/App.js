import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Page and component imports
import Layout from "./components/Layout";
import EmergencyAlert from "./pages/EmergencyAlert";
import Home from "./pages/Home";
import SymptomChecker from "./pages/DiseasePredictor";
import HealthNotices from "./pages/HealthNotices";
import AuthPages from "./pages/AuthPages";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import AppointmentPage from "./pages/AppointmentPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import { AdminDashboardPage, AdminModulePage } from "./admin/AdminPages";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main routes wrapped by Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="symptom-checker" element={<SymptomChecker />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="appointment"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <AppointmentPage />
                </ProtectedRoute>
              }
            />
            <Route path="emergency-alert" element={<EmergencyAlert />} />
            <Route path="health-notices" element={<HealthNotices />} />
            <Route path="auth" element={<AuthPages />} />
            <Route
              path="doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users/doctors" element={<AdminModulePage moduleKey="doctors" />} />
              <Route path="users/patients" element={<AdminModulePage moduleKey="patients" />} />
              <Route path="users/staff" element={<AdminModulePage moduleKey="staff" />} />
              <Route path="hospitals" element={<AdminModulePage moduleKey="hospitals" />} />
              <Route path="appointments" element={<AdminModulePage moduleKey="appointments" />} />
              <Route path="health-notices" element={<AdminModulePage moduleKey="notices" />} />
              <Route path="emergency-alerts" element={<AdminModulePage moduleKey="alerts" />} />
              <Route path="disease-analytics" element={<AdminModulePage moduleKey="diseaseAnalytics" />} />
              <Route path="weather-monitoring" element={<AdminModulePage moduleKey="weatherMonitoring" />} />
              <Route path="reports" element={<AdminModulePage moduleKey="reports" />} />
              <Route path="notifications" element={<AdminModulePage moduleKey="notifications" />} />
              <Route path="feedback-complaints" element={<AdminModulePage moduleKey="feedbackComplaints" />} />
              <Route path="audit-logs" element={<AdminModulePage moduleKey="auditLogs" />} />
              <Route path="roles-permissions" element={<AdminModulePage moduleKey="rolesPermissions" />} />
              <Route path="security-center" element={<AdminModulePage moduleKey="securityCenter" />} />
              <Route path="settings" element={<AdminModulePage moduleKey="settings" />} />
            </Route>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
