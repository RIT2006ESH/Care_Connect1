import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { sidebarSections } from "./adminPortalData";
import "./adminPortal.css";

const AdminPortalContext = createContext(null);

export const useAdminPortal = () => {
  const context = useContext(AdminPortalContext);
  if (!context) {
    throw new Error("useAdminPortal must be used within AdminLayout");
  }
  return context;
};

const collectLinks = () =>
  sidebarSections.flatMap((section) => section.items.map((item) => item));

const findActiveLabel = (pathname) => {
  const allLinks = collectLinks();
  const matched = allLinks.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
  );
  return matched || allLinks[0];
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("care-connect-admin-theme") === "dark"
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "care-connect-admin-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const currentPage = useMemo(
    () => findActiveLabel(location.pathname),
    [location.pathname]
  );

  const showToast = (message, tone = "success") => {
    const nextToast = { id: Date.now(), message, tone };
    setToast(nextToast);
    window.clearTimeout(window.__careConnectAdminToast);
    window.__careConnectAdminToast = window.setTimeout(() => {
      setToast(null);
    }, 2600);
  };

  const handleSignOut = () => {
    navigate("/auth");
  };

  return (
    <AdminPortalContext.Provider value={{ showToast, currentPage }}>
      <div className={`admin-portal ${darkMode ? "admin-portal--dark" : ""}`}>
        <div
          className={`admin-portal__overlay ${mobileSidebarOpen ? "is-open" : ""}`}
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={`admin-sidebar ${sidebarCollapsed ? "is-collapsed" : ""} ${
            mobileSidebarOpen ? "is-mobile-open" : ""
          }`}
          aria-label="Admin sidebar"
        >
          <div className="admin-sidebar__header">
            <button
              type="button"
              className="admin-brand"
              onClick={() => navigate("/admin/dashboard")}
            >
              <span className="admin-brand__icon">
                <i className="fas fa-heartbeat" aria-hidden="true" />
              </span>
              <span className="admin-brand__text">
                <span className="admin-brand__title">CareConnect</span>
                <span className="admin-brand__badge">Admin</span>
              </span>
            </button>
            <button
              type="button"
              className="admin-sidebar__toggle"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars" aria-hidden="true" />
            </button>
          </div>

          <nav className="admin-sidebar__nav">
            {sidebarSections.map((section) => (
              <div key={section.label} className="admin-sidebar__group">
                <div className="admin-sidebar__group-label">{section.label}</div>
                <div className="admin-sidebar__links">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "is-active" : ""}`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <i className={item.icon} aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="admin-portal__content">
          <header className="admin-topbar">
            <div className="admin-topbar__left">
              <button
                type="button"
                className="admin-topbar__mobile-toggle"
                onClick={() => setMobileSidebarOpen((prev) => !prev)}
                aria-label="Open sidebar"
              >
                <i className="fas fa-bars" aria-hidden="true" />
              </button>
              <div className="admin-topbar__title-wrap">
                <div className="admin-topbar__eyebrow">Enterprise Admin Portal</div>
                <div className="admin-topbar__title">{currentPage.label}</div>
                <div className="admin-topbar__subtitle">{currentPage.path.replace("/admin/", "").replace(/\//g, " / ").replace(/-/g, " ")}</div>
              </div>
            </div>

            <div className="admin-topbar__right">
              <label className="admin-topbar__search" aria-label="Search portal">
                <i className="fas fa-search" aria-hidden="true" />
                <input type="search" placeholder="Search portal" />
              </label>
              <button
                type="button"
                className="admin-topbar__icon-btn"
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label="Toggle theme"
              >
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`} aria-hidden="true" />
              </button>
              <button type="button" className="admin-topbar__icon-btn" aria-label="Notifications">
                <i className="fas fa-bell" aria-hidden="true" />
                <span className="admin-topbar__badge">3</span>
              </button>
              <button type="button" className="admin-topbar__profile" onClick={handleSignOut}>
                <span className="admin-topbar__avatar">AD</span>
                <span className="admin-topbar__profile-text">
                  <strong>Admin User</strong>
                  <span>Super Admin</span>
                </span>
              </button>
            </div>
          </header>

          <main className="admin-main" role="main">
            <Outlet />
          </main>
        </div>

        {toast ? (
          <div className={`admin-toast admin-toast--${toast.tone}`} role="status" aria-live="polite">
            <i className="fas fa-check-circle" aria-hidden="true" />
            <span>{toast.message}</span>
          </div>
        ) : null}
      </div>
    </AdminPortalContext.Provider>
  );
};

export default AdminLayout;
