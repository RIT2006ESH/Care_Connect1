// src/api/api.js
// Central API client for the Care Connect backend.
// Replaces every localStorage.getItem/setItem("appointments", ...) call.

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  const token = localStorage.getItem("token"); // JWT is the one thing still worth keeping client-side
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  // 204 No Content etc.
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// --- Auth ---
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const register = (payload) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(payload) });

// --- Appointments ---
export const bookAppointment = (payload) =>
  // payload: { doctorId, date, time, mode, reason }
  request("/appointments", { method: "POST", body: JSON.stringify(payload) });

export const getTodaysAppointmentsForDoctor = (doctorId) =>
  request(`/appointments/doctor/${doctorId}/today`);

export const getAppointmentHistoryForDoctor = (doctorId) =>
  request(`/appointments/doctor/${doctorId}/history`);

export const getAppointmentsForPatient = (patientId) =>
  request(`/appointments/patient/${patientId}`);

export const updateAppointmentStatus = (appointmentId, status) =>
  // status: "COMPLETED" | "CANCELLED" | "UPCOMING"
  request(`/appointments/${appointmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// --- Doctors (admin) ---
export const getAllDoctors = () => request("/doctors");

export const getDoctorStats = (doctorId) => request(`/doctors/${doctorId}/stats`);

// --- Reviews ---
export const leaveReview = (payload) =>
  // payload: { doctorId, appointmentId?, rating, comment }
  request("/reviews", { method: "POST", body: JSON.stringify(payload) });

export const getReviewsForDoctor = (doctorId) => request(`/reviews/doctor/${doctorId}`);