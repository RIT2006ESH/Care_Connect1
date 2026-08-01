const USERS_KEY = "care-connect-users";
const SESSION_KEY = "care-connect-session";

const seededUsers = [
  {
    id: "user-001",
    role: "user",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "Password123!",
    phone: "+1 555-010-2000",
  },
  {
    id: "doctor-001",
    role: "doctor",
    name: "Dr. Sarah Johnson",
    email: "doctor@example.com",
    password: "Password123!",
    phone: "+1 555-010-3000",
  },
  {
    id: "admin-001",
    role: "admin",
    name: "Admin User",
    email: "admin@example.com",
    password: "Password123!",
    phone: "+1 555-010-4000",
  },
];

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getUsers = () => {
  if (typeof window === "undefined") return seededUsers;

  const storedUsers = safeParse(window.localStorage.getItem(USERS_KEY), null);
  if (Array.isArray(storedUsers) && storedUsers.length > 0) {
    return storedUsers;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers));
  return seededUsers;
};

export const saveUsers = (users) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

export const findUserByCredentials = (email, password, role) => {
  const users = getUsers();
  return users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password &&
      user.role === role
  );
};

export const createUser = ({ name, email, password, phone, role }) => {
  const users = getUsers();
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const nextUser = {
    id: `${role}-${Date.now()}`,
    role,
    name,
    email,
    password,
    phone,
  };

  saveUsers([...users, nextUser]);
  return nextUser;
};

export const buildSession = (user) => ({
  id: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
});

export const getDashboardPathForRole = (role) => {
  if (role === "doctor") return "/doctor-dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
};
