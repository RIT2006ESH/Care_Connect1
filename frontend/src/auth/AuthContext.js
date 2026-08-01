import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildSession,
  clearSession,
  createUser,
  findUserByCredentials,
  getSession,
  saveSession,
} from "./authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    if (session) {
      saveSession(session);
    } else {
      clearSession();
    }
  }, [session]);

  const signIn = ({ email, password, role }) => {
    const user = findUserByCredentials(email, password, role);
    if (!user) {
      throw new Error("Invalid email, password, or role.");
    }

    const nextSession = buildSession(user);
    setSession(nextSession);
    return nextSession;
  };

  const signUp = ({ name, email, password, phone, role }) => {
    const user = createUser({ name, email, password, phone, role });
    const nextSession = buildSession(user);
    setSession(nextSession);
    return nextSession;
  };

  const signOut = () => {
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session,
      isAuthenticated: Boolean(session),
      signIn,
      signUp,
      signOut,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};