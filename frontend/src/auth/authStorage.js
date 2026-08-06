// src/auth/authStorage.js
// Session/token persistence for the browser. The actual user database
// (create/find/verify) now lives on the backend — this file just keeps
// the logged-in user's info and JWT around across page reloads.

const SESSION_KEY = "care-connect-session";
const TOKEN_KEY = "token"; // must match the key api.js reads in authHeaders()

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getSession = () => {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(SESSION_KEY), null);
};

export const saveSession = (session) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
};

// Turns a backend AuthResponse into the session shape the rest of the
// app already expects (same fields as before: id, role, name, email, phone).
export const buildSession = (authResponse) => ({
  id: authResponse.id,
  role: authResponse.role,
  name: authResponse.name,
  email: authResponse.email,
  phone: authResponse.phone || "",
});

export const getDashboardPathForRole = (role) => {
  if (role === "doctor") return "/doctor-dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
};