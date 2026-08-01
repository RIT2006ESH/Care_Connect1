import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // adjust path/hook name if yours differs
import './Home.css';

const CONTENT_ENDPOINT = '/api/landing-content';

const FALLBACK_DATA = {
  hero: {
    eyebrow: 'AI-powered guidance, real doctors',
    headingPrimary: 'Health',
    headingDark: 'Assistant',
    lede: 'Check symptoms, book doctors, and get trusted health advice — all in one place, whenever you need it.',
    meta: [
      { icon: 'fa-shield-halved', label: 'Private & secure' },
      { icon: 'fa-user-doctor', label: 'Verified doctors' },
      { icon: 'fa-bolt', label: 'Instant insights' },
    ],
  },
  stats: [
    { value: 50000, suffix: '+', label: 'Patients helped' },
    { value: 1200, suffix: '+', label: 'Verified doctors' },
    { value: 4.8, suffix: '/5', label: 'Average rating', decimals: 1 },
    { value: 24, suffix: '/7', label: 'Always available' },
  ],
  features: [
    { icon: 'fa-stethoscope', title: 'Symptom Checker', desc: 'Enter your symptoms and get instant AI-based health insights to guide your next step.', cta: 'Try Symptom Checker', to: '/symptom-checker' },
    { icon: 'fa-calendar-days', title: 'Book an Appointment', desc: 'Consult with doctors online or in person, on whichever schedule works for you.', cta: 'Book Now', to: '/appointments' },
    { icon: 'fa-bullhorn', title: 'Health Notices', desc: 'Stay updated with government advisories, outbreak alerts, and everyday health tips.', cta: 'View Notices', to: '/health-notices' },
  ],
  steps: [
    { title: "Tell us what's wrong", desc: 'Describe your symptoms and get instant AI-based guidance.' },
    { title: 'Pick your doctor', desc: 'Match with a verified doctor by specialty and availability.' },
    { title: 'Book your visit', desc: 'Confirm a time online or in person — no phone calls needed.' },
  ],
  testimonials: [
    { quote: "Care Connect caught what I would've ignored and got me into a clinic the same afternoon.", name: 'Aditi R.', role: 'Care Connect patient' },
    { quote: 'Booking a specialist used to take three calls. Now it takes two taps.', name: 'Marcus T.', role: 'Care Connect patient' },
    { quote: 'The symptom checker told me exactly which department to book — no guesswork.', name: 'Priya N.', role: 'Care Connect patient' },
  ],
};

function initials(name) {
  return name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// Maps a logged-in user's role to their dashboard route.
// Adjust these paths to match your actual router config in App.js.
const ROLE_DASHBOARD_ROUTES = {
  doctor: '/doctor-dashboard',
  patient: '/dashboard',
  admin: '/admin-dashboard',
};

function getDashboardRoute(role) {
  return ROLE_DASHBOARD_ROUTES[role] || '/dashboard';
}

// Counts a single stat value up from 0 once it scrolls into view.
function useCountUp(targetRef, value, decimals, suffix, start) {
  const [display, setDisplay] = useState(decimals ? (0).toFixed(decimals) + suffix : '0' + suffix);
  useEffect(() => {
    if (!start) return;
    const duration = 1200;
    const startTime = performance.now();
    let frame;
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplay((decimals ? current.toFixed(decimals) : Math.round(current).toLocaleString()) + suffix);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value, decimals, suffix]);
  return display;
}

// Generic scroll-reveal wrapper: fades/slides children in once visible.
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

function StatCard({ stat }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const display = useCountUp(ref, stat.value, stat.decimals || 0, stat.suffix, inView);

  return (
    <div className="stat" ref={ref}>
      <h3>{display}</h3>
      <p>{stat.label}</p>
    </div>
  );
}

function Testimonials({ list }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % list.length), 6000);
    return () => clearInterval(id);
  }, [list.length]);

  if (!list.length) return null;
  const t = list[active];

  return (
    <Reveal className="testimonial" >
      <i className="fa-solid fa-quote-left" />
      <blockquote key={active}>{t.quote}</blockquote>
      <div className="author">
        <span className="author-avatar">{initials(t.name)}</span>
        <div style={{ textAlign: 'left' }}>
          <div className="author-name">{t.name}</div>
          <div className="author-role">{t.role}</div>
        </div>
      </div>
      <div className="testimonial-dots">
        {list.map((_, i) => (
          <button
            key={i}
            aria-label={`Show review ${i + 1}`}
            className={i === active ? 'active' : ''}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </Reveal>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth(); // expects user.role to be 'doctor' | 'patient' | 'admin'
  const dashboardRoute = getDashboardRoute(user?.role);
  const [data, setData] = useState(null); // null = still loading

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch(CONTENT_ENDPOINT, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Content endpoint returned ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      // No live content API yet, or the request failed — fall back
      // to local defaults so the page still renders fully.
      setData(FALLBACK_DATA);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const content = data || FALLBACK_DATA;
  const loading = data === null;

  return (
    <div className="home">
      <header className="hero">
        <div className="hero-inner">
          <div className="reveal is-visible">
            <span className="eyebrow">
              <span className="dot" />
              <span className={loading ? 'skeleton' : ''}>{content.hero.eyebrow}</span>
            </span>
            <h2>
              <span className="line-primary">{content.hero.headingPrimary}</span>
              <br />
              <span className="line-dark">{content.hero.headingDark}</span>
            </h2>
            <p className={`lede ${loading ? 'skeleton' : ''}`}>{content.hero.lede}</p>
            <div className="hero-actions">
              <button className="btn-primary-lg" type="button" onClick={() => navigate(dashboardRoute)}>
                <i className="fa-solid fa-table-cells-large" /> Go to dashboard
              </button>
              <button className="btn-ghost-lg" type="button" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
                See how it works
              </button>
            </div>
            <div className="hero-meta">
              {content.hero.meta.map((m) => (
                <span key={m.label}>
                  <i className={`fa-solid ${m.icon}`} /> {m.label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-art reveal is-visible">
            <div className="float-chip chip-a"><i className="fa-solid fa-calendar-check" /> Appointment confirmed</div>
            <svg viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a doctor consulting a patient">
              <defs>
                <radialGradient id="ringGrad" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#E6F6F4" />
                  <stop offset="60%" stopColor="#CFEDEA" />
                  <stop offset="100%" stopColor="#BEE6E1" />
                </radialGradient>
                <linearGradient id="doctorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#0F766E" />
                </linearGradient>
                <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>
              <circle cx="230" cy="210" r="175" fill="url(#ringGrad)" />
              <g opacity="0.45" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round">
                <line x1="80" y1="95" x2="80" y2="107" /><line x1="74" y1="101" x2="86" y2="101" />
                <line x1="368" y1="130" x2="368" y2="142" /><line x1="362" y1="136" x2="374" y2="136" />
                <line x1="70" y1="300" x2="70" y2="312" /><line x1="64" y1="306" x2="76" y2="306" />
              </g>
              <path d="M60 245 h60 l14 -34 l18 60 l16 -46 l12 20 h60" fill="none" stroke="#0D9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
              <g transform="translate(158,150)">
                <rect x="0" y="46" width="76" height="150" rx="30" fill="url(#doctorGrad)" />
                <circle cx="38" cy="26" r="30" fill="#3F3630" />
                <circle cx="38" cy="30" r="24" fill="#F3D2A6" />
                <path d="M10 46 q28 22 56 0" fill="none" stroke="#0D3B36" strokeWidth="4" strokeLinecap="round" />
                <circle cx="14" cy="70" r="15" fill="none" stroke="#0B2C28" strokeWidth="4" />
                <line x1="14" y1="85" x2="14" y2="100" stroke="#0B2C28" strokeWidth="4" />
                <line x1="14" y1="100" x2="0" y2="110" stroke="#0B2C28" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g transform="translate(248,168)">
                <rect x="0" y="34" width="66" height="118" rx="28" fill="url(#patientGrad)" />
                <circle cx="33" cy="18" r="26" fill="#F3D2A6" />
                <path d="M10 6 q23 -18 46 0 q4 12 -4 20 q2 -16 -42 -16 q-6 8 0 16 z" fill="#3F3630" />
              </g>
              <g transform="translate(330,238)">
                <path d="M28 0 C10 -14 -14 4 0 24 C10 36 20 44 28 54 C36 44 46 36 56 24 C70 4 46 -14 28 0 Z" fill="#DC2626" />
              </g>
            </svg>
            <div className="float-chip chip-b"><i className="fa-solid fa-file-waveform" /> Symptom check ready</div>
          </div>
        </div>
      </header>

      <section className="stats">
        <div className="stats-inner">
          {content.stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>
      </section>

      <section className="features" id="features">
        <p className="section-eyebrow">What you can do</p>
        <h2 className="section-title">Everything for your care, in one place</h2>
        <p className="section-sub">From a quick symptom check to booking your next visit, Care Connect keeps your health on track.</p>
        <div className="dashboard-grid">
          {content.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100} className="card-wrap">
              <div className="card">
                <span className="icon-badge"><i className={`fa-solid ${f.icon}`} /></span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <button className="btn-card" type="button" onClick={() => f.to && navigate(f.to)}>
                  {f.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-inner">
          <p className="section-eyebrow">Getting started</p>
          <h2 className="section-title">Three steps to your next visit</h2>
          <p className="section-sub">No hold music, no paperwork at the door — just a clear path from symptom to appointment.</p>
          <div className="steps">
            {content.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="step-wrap">
                <div className="step">
                  <div className="step-num">{i + 1}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials list={content.testimonials} />

      <section className="cta-band">
        <Reveal>
          <div className="cta-inner">
            <div>
              <h3>Your health, one tap away.</h3>
              <p>Jump into your dashboard to check symptoms, book a doctor, or catch up on notices.</p>
            </div>
            <button className="btn-on-dark" type="button" onClick={() => navigate(dashboardRoute)}>
              Go to dashboard
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}