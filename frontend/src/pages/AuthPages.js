import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardPathForRole } from "../auth/authStorage";
import { useAuth } from "../auth/AuthContext";

function AuthPages() {
  const navigate = useNavigate();
  const { session, signIn, signUp } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentRole, setCurrentRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const demoCredentials = useMemo(
    () => [
      { role: "user", email: "jane@example.com", password: "Password123!" },
      { role: "doctor", email: "doctor@example.com", password: "Password123!" },
      { role: "admin", email: "admin@example.com", password: "Password123!" },
    ],
    []
  );

  useEffect(() => {
    if (session) {
      navigate(getDashboardPathForRole(session.role), { replace: true });
    }
  }, [navigate, session]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      agreeToTerms: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required.");
      }

      if (!isSignIn) {
        if (!formData.name.trim()) {
          throw new Error("Full name is required for sign up.");
        }
        if (formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (!formData.agreeToTerms) {
          throw new Error("Please accept the terms and conditions.");
        }

        signUp({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
          role: currentRole,
        });
      } else {
        signIn({
          email: formData.email.trim(),
          password: formData.password,
          role: currentRole,
        });
      }

      resetForm();
      navigate(getDashboardPathForRole(currentRole), { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Authentication failed.");
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn((prev) => !prev);
    setError("");
    resetForm();
  };

  const handleDemoFill = (credential) => {
    setCurrentRole(credential.role);
    setIsSignIn(true);
    setFormData((prev) => ({
      ...prev,
      email: credential.email,
      password: credential.password,
    }));
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top, rgba(20, 184, 166, 0.16), transparent 35%), linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    },
    authCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1.25rem",
      boxShadow: "0 18px 60px rgba(15, 23, 42, 0.14)",
      maxWidth: "1080px",
      width: "100%",
      overflow: "hidden",
      border: "1px solid rgba(226, 232, 240, 0.9)",
    },
    authLayout: {
      display: "grid",
      gridTemplateColumns: "minmax(280px, 0.9fr) minmax(0, 1.1fr)",
      minHeight: "640px",
    },
    promoPanel: {
      background:
        "linear-gradient(160deg, #0F766E 0%, #14B8A6 52%, #0B3B38 100%)",
      color: "white",
      padding: "2.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "1.5rem",
    },
    promoBadge: {
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      padding: "0.45rem 0.8rem",
      borderRadius: "999px",
      backgroundColor: "rgba(255,255,255,0.14)",
      fontSize: "0.82rem",
      fontWeight: "700",
      letterSpacing: "0.02em",
    },
    promoTitle: {
      fontSize: "2.2rem",
      lineHeight: 1.05,
      fontWeight: "800",
      margin: 0,
    },
    promoText: {
      fontSize: "1rem",
      lineHeight: 1.7,
      margin: 0,
      maxWidth: "32ch",
      opacity: 0.96,
    },
    promoList: {
      display: "grid",
      gap: "0.85rem",
      marginTop: "1rem",
    },
    promoItem: {
      display: "flex",
      gap: "0.8rem",
      alignItems: "flex-start",
      padding: "0.95rem 1rem",
      borderRadius: "0.9rem",
      backgroundColor: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.14)",
    },
    promoIcon: {
      width: "2rem",
      height: "2rem",
      borderRadius: "0.6rem",
      backgroundColor: "rgba(255,255,255,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: "1rem",
    },
    promoItemTitle: {
      margin: 0,
      fontWeight: "800",
      fontSize: "0.95rem",
    },
    promoItemText: {
      margin: "0.2rem 0 0",
      fontSize: "0.9rem",
      lineHeight: 1.5,
      opacity: 0.9,
    },
    promoFooter: {
      fontSize: "0.9rem",
      lineHeight: 1.6,
      opacity: 0.9,
    },
    header: {
      background:
        "linear-gradient(135deg, rgba(15,118,110,0.08), rgba(20,184,166,0.12))",
      padding: "2rem 2rem 1.25rem",
      textAlign: "center",
      color: "#0F172A",
      borderBottom: "1px solid #E2E8F0",
    },
    headerTitle: {
      fontSize: "1.75rem",
      fontWeight: "800",
      margin: "0 0 0.45rem",
    },
    headerSubtitle: {
      fontSize: "1rem",
      opacity: "0.78",
      margin: 0,
    },
    formContainer: {
      padding: "1.75rem 2rem 2rem",
    },
    tabContainer: {
      display: "flex",
      gap: "0.75rem",
      marginBottom: "1rem",
      backgroundColor: "#F8FAFC",
      padding: "0.5rem",
      borderRadius: "0.9rem",
      flexWrap: "wrap",
    },
    tab: {
      flex: 1,
      padding: "0.8rem",
      border: "none",
      backgroundColor: "transparent",
      color: "#64748B",
      fontWeight: "700",
      fontSize: "0.98rem",
      cursor: "pointer",
      borderRadius: "0.75rem",
      minWidth: "120px",
    },
    tabActive: {
      backgroundColor: "#FFFFFF",
      color: "#0F766E",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: "0.45rem",
      fontSize: "0.92rem",
    },
    input: {
      width: "100%",
      padding: "0.9rem 1rem",
      borderRadius: "0.7rem",
      border: "1px solid #D7DEE8",
      backgroundColor: "#F8FAFC",
      color: "#0F172A",
      fontSize: "1rem",
      boxSizing: "border-box",
      minHeight: "52px",
    },
    passwordContainer: {
      position: "relative",
    },
    eyeIcon: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#64748B",
      fontSize: "0.85rem",
      userSelect: "none",
      padding: "0.2rem 0.4rem",
      borderRadius: "999px",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.55rem",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#0F766E",
    },
    checkboxLabel: {
      fontSize: "0.92rem",
      color: "#475569",
      cursor: "pointer",
    },
    link: {
      color: "#0F766E",
      fontWeight: "700",
      cursor: "pointer",
    },
    button: {
      width: "100%",
      padding: "1rem",
      backgroundColor: "#0F766E",
      color: "white",
      border: "none",
      borderRadius: "0.75rem",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "0.5rem",
      minHeight: "54px",
    },
    helperBox: {
      marginTop: "1rem",
      padding: "1rem",
      borderRadius: "0.9rem",
      backgroundColor: "#ECFEFF",
      border: "1px solid #A5F3FC",
      color: "#155E75",
    },
    helperGrid: {
      display: "grid",
      gap: "0.5rem",
      marginTop: "0.75rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    },
    helperButton: {
      border: "1px solid #A5F3FC",
      backgroundColor: "white",
      color: "#0F766E",
      borderRadius: "0.7rem",
      padding: "0.75rem",
      cursor: "pointer",
      fontWeight: "700",
      minHeight: "46px",
    },
    footer: {
      textAlign: "center",
      marginTop: "1.5rem",
      color: "#64748B",
      fontSize: "0.95rem",
    },
    error: {
      color: "#DC2626",
      fontSize: "0.92rem",
      marginBottom: "1rem",
      textAlign: "center",
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
    },
    demoTitle: {
      margin: "0 0 0.25rem",
      fontSize: "0.98rem",
      fontWeight: "800",
    },
    demoText: {
      margin: 0,
      fontSize: "0.92rem",
      lineHeight: 1.5,
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        * {
          box-sizing: border-box;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #0F766E !important;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
        }
        input::placeholder {
          color: #94A3B8;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
        }
        .tab:hover {
          background-color: rgba(15, 118, 110, 0.05);
        }
        .link:hover {
          text-decoration: underline;
        }
        .auth-shell {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        @media (max-width: 640px) {
          .auth-shell {
            align-items: flex-start;
          }
          .auth-card {
            border-radius: 1rem;
          }
          .auth-layout {
            grid-template-columns: 1fr !important;
          }
          .promo-panel {
            padding: 1.5rem !important;
          }
          .promo-title {
            font-size: 1.7rem !important;
          }
        }
      `}</style>

      <div className="auth-shell">
      <div style={styles.authCard} className="auth-card">
        <div style={styles.authLayout} className="auth-layout">
          <aside style={styles.promoPanel} className="promo-panel">
            <div>
              <span style={styles.promoBadge}>Care Connect</span>
              <h2 style={styles.promoTitle} className="promo-title">
                Secure health access for every role.
              </h2>
              <p style={styles.promoText}>
                Sign in as a patient, doctor, or admin. The app now uses a clean local auth flow with role-based routing.
              </p>
            </div>

            <div style={styles.promoList}>
              <div style={styles.promoItem}>
                <div style={styles.promoIcon}>1</div>
                <div>
                  <p style={styles.promoItemTitle}>User dashboard</p>
                  <p style={styles.promoItemText}>Book appointments and review your health history.</p>
                </div>
              </div>
              <div style={styles.promoItem}>
                <div style={styles.promoIcon}>2</div>
                <div>
                  <p style={styles.promoItemTitle}>Doctor workspace</p>
                  <p style={styles.promoItemText}>Manage visits, prescriptions, and availability.
                  </p>
                </div>
              </div>
              <div style={styles.promoItem}>
                <div style={styles.promoIcon}>3</div>
                <div>
                  <p style={styles.promoItemTitle}>Admin controls</p>
                  <p style={styles.promoItemText}>Track notices and system activity from one place.</p>
                </div>
              </div>
            </div>

            <p style={styles.promoFooter}>
              Demo accounts are available below for quick testing while the backend remains local.
            </p>
          </aside>

          <section>
            <div style={styles.header}>
              <h1 style={styles.headerTitle}>Sign in</h1>
              <p style={styles.headerSubtitle}>
                Use a demo role or create a local account
              </p>
            </div>

            <div style={styles.formContainer}>
              <div style={styles.tabContainer}>
                {[
                  { key: "user", label: "User" },
                  { key: "doctor", label: "Doctor" },
                  { key: "admin", label: "Admin" },
                ].map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    style={{
                      ...styles.tab,
                      ...(currentRole === role.key ? styles.tabActive : {}),
                    }}
                    className="tab"
                    onClick={() => setCurrentRole(role.key)}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              <div style={styles.tabContainer}>
                <button
                  type="button"
                  style={{ ...styles.tab, ...(isSignIn ? styles.tabActive : {}) }}
                  className="tab"
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  style={{ ...styles.tab, ...(!isSignIn ? styles.tabActive : {}) }}
                  className="tab"
                  onClick={() => setIsSignIn(false)}
                >
                  Sign Up
                </button>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                {!isSignIn && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={styles.input}
                    />
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    style={styles.input}
                  />
                </div>

                {!isSignIn && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number (optional)"
                      style={styles.input}
                    />
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      style={styles.input}
                    />
                    <span
                      style={styles.eyeIcon}
                      onClick={() => setShowPassword((prev) => !prev)}
                      role="button"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>

                {!isSignIn && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm Password</label>
                    <div style={styles.passwordContainer}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        style={styles.input}
                      />
                      <span
                        style={styles.eyeIcon}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        role="button"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </span>
                    </div>
                  </div>
                )}

                <div style={styles.formGroup}>
                  {isSignIn ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          id="remember"
                          style={styles.checkbox}
                        />
                        <label htmlFor="remember" style={styles.checkboxLabel}>
                          Remember me
                        </label>
                      </div>
                      <span style={styles.link} className="link">
                        Forgot Password?
                      </span>
                    </div>
                  ) : (
                    <div style={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        id="terms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        style={styles.checkbox}
                      />
                      <label htmlFor="terms" style={styles.checkboxLabel}>
                        I agree to the <span style={styles.link}>Terms & Conditions</span>
                      </label>
                    </div>
                  )}
                </div>

                <button type="submit" style={styles.button}>
                  {isSignIn ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div style={styles.helperBox}>
                <p style={styles.demoTitle}>Demo accounts</p>
                <p style={styles.demoText}>
                  Use these to sign in locally while the app runs without a real backend.
                </p>
                <div style={styles.helperGrid}>
                  {demoCredentials.map((credential) => (
                    <button
                      key={credential.role}
                      type="button"
                      style={styles.helperButton}
                      onClick={() => handleDemoFill(credential)}
                    >
                      {credential.role}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.footer}>
                {isSignIn ? (
                  <p>
                    Don&apos;t have an account?{" "}
                    <span
                      style={styles.link}
                      className="link"
                      onClick={toggleAuthMode}
                    >
                      Sign Up
                    </span>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <span
                      style={styles.link}
                      className="link"
                      onClick={toggleAuthMode}
                    >
                      Sign In
                    </span>
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}

export default AuthPages;
