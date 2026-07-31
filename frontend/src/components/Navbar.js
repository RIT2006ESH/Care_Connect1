import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css'
import { useAuth } from "../auth/AuthContext";
const Navbar = ({ theme, toggleTheme }) => {
  const [isMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY > 50) {
          navbarRef.current.style.boxShadow = "0 4px 20px var(--shadow)";
        } else {
          navbarRef.current.style.boxShadow = "0 2px 10px var(--shadow)";
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleLogoutClick = () => {
    signOut();
    navigate("/");
  };
  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-heartbeat"></i>
          Care Connect
        </Link>
        <ul className={isMenuOpen ? "nav-links active" : "nav-links"}>
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/appointment">Appointment</Link>
            </li>
            <li>
              <Link to="/symptom-checker">Symptom Checker</Link>
            </li>
            <li>
              <Link to="http://127.0.0.1:5001/">Health Notices</Link>
            </li>
          </>
        </ul>
        <div className="nav-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--text)", fontWeight: "500" }}>
              {isAuthenticated ? `Welcome, ${user?.name?.split(" ")[0] || "User"}` : "Welcome"}
            </span>
          </div>
          {isAuthenticated ? (
            <button className="btn btn-primary" onClick={handleLogoutClick}>
              Logout
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
