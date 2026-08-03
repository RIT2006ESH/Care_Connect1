import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // TEMP DEBUG remove once the mismatch is found
    console.log("ProtectedRoute blocked:", {
      userRole: user?.role,
      allowedRoles,
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
