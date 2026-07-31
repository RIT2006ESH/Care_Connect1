import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  // Theme state is managed here to be consistent across all pages
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const location = useLocation();

  const hideShellChrome = [
    "/auth",
    "/dashboard",
    "/doctor-dashboard",
    "/admin-dashboard",
    "/appointment",
  ].some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      {!hideShellChrome && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main className={hideShellChrome ? "app-shell app-shell--full" : "app-shell"}>
        {/* The Outlet component renders the active page component */}
        <Outlet />
      </main>
      {!hideShellChrome && <Footer />}
    </>
  );
};

export default Layout;
