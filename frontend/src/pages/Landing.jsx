import { useState } from "react";

import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
  GraduationCap,
  FileCheck2,
} from "lucide-react";

import { Link } from "react-router-dom";

import "../styles/landing.css";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <main className="landing-page">
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="landing-navbar">
        <div className="landing-container landing-nav-inner">
          {/* LOGO */}

          <Link to="/" className="landing-logo" onClick={closeMobileMenu}>
            <span className="landing-logo-mark">PH</span>

            <span className="landing-logo-text">
              Pulse<span>Hire</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="landing-nav-links">
            <a href="#features">Features</a>

            <a href="#how-it-works">How it works</a>

            <a href="#candidates">Candidates</a>

            <a href="#recruiters">Recruiters</a>
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="landing-nav-actions">
            <Link to="/login" className="landing-login-link">
              Sign in
            </Link>

            <Link to="/register" className="landing-nav-button">
              Get started
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <a href="#features" onClick={closeMobileMenu}>
              Features
            </a>

            <a href="#how-it-works" onClick={closeMobileMenu}>
              How it works
            </a>

            <a href="#candidates" onClick={closeMobileMenu}>
              Candidates
            </a>

            <a href="#recruiters" onClick={closeMobileMenu}>
              Recruiters
            </a>

            <div className="landing-mobile-actions">
              <Link to="/login" onClick={closeMobileMenu}>
                Sign in
              </Link>

              <Link
                to="/register"
                className="landing-mobile-primary"
                onClick={closeMobileMenu}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="landing-hero">
        <div className="landing-hero-glow landing-glow-one" />
        <div className="landing-hero-glow landing-glow-two" />

        <div className="landing-container landing-hero-grid">
          {/* HERO CONTENT */}

          <div className="landing-hero-content">
            <div className="landing-eyebrow">
              <span className="landing-eyebrow-dot" />
              EVIDENCE-BACKED HIRING
            </div>

            <h1>
              Hire for
              <span className="landing-gradient-text"> capability.</span>
              <br />
              Build careers
              <br />
              with
              <span className="landing-gradient-text"> proof.</span>
            </h1>

            <p className="landing-hero-description">
              PulseHire connects candidates and recruiters through skills,
              evidence, verification and meaningful opportunities — not just
              resumes and keywords.
            </p>

            <div className="landing-hero-actions">
              <Link to="/register" className="landing-primary-button">
                Create your profile
                <ArrowRight size={17} />
              </Link>

              <a href="#how-it-works" className="landing-secondary-button">
                See how it works
                <ChevronDown size={17} />
              </a>
            </div>

            <div className="landing-hero-trust">
              <div className="landing-trust-item">
                <ShieldCheck size={16} />

                <span>Skill-focused</span>
              </div>

              <div className="landing-trust-divider" />

              <div className="landing-trust-item">
                <FileCheck2 size={16} />

                <span>Evidence-backed</span>
              </div>

              <div className="landing-trust-divider" />

              <div className="landing-trust-item">
                <Target size={16} />

                <span>Opportunity-driven</span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="landing-hero-visual">
            <div className="landing-orbit landing-orbit-one" />
            <div className="landing-orbit landing-orbit-two" />

            <div className="landing-dashboard-card">
              {/* DASHBOARD HEADER */}

              <div className="landing-dashboard-header">
                <div>
                  <span className="landing-dashboard-label">
                    PROFESSIONAL SIGNAL
                  </span>

                  <strong>Candidate profile</strong>
                </div>

                <div className="landing-dashboard-avatar">KS</div>
              </div>

              {/* PROFILE */}

              <div className="landing-profile-row">
                <div className="landing-profile-avatar">
                  <UserRound size={23} />
                </div>

                <div className="landing-profile-info">
                  <strong>Verified professional</strong>

                  <span>Full Stack Developer</span>
                </div>

                <div className="landing-verified-badge">
                  <Check size={12} />
                  Verified
                </div>
              </div>

              {/* SKILL SCORE */}

              <div className="landing-signal-card">
                <div className="landing-signal-header">
                  <div>
                    <span>SKILL SIGNAL</span>

                    <strong>86%</strong>
                  </div>

                  <div className="landing-signal-icon">
                    <TrendingUp size={17} />
                  </div>
                </div>

                <div className="landing-progress">
                  <div className="landing-progress-fill" />
                </div>

                <div className="landing-progress-meta">
                  <span>Evidence strength</span>

                  <span>Strong</span>
                </div>
              </div>

              {/* SKILLS */}

              <div className="landing-skill-list">
                <div className="landing-skill-title">Verified capabilities</div>

                <div className="landing-skill-tags">
                  <span>
                    React
                    <Check size={11} />
                  </span>

                  <span>
                    Node.js
                    <Check size={11} />
                  </span>

                  <span>
                    MongoDB
                    <Check size={11} />
                  </span>

                  <span>
                    REST APIs
                    <Check size={11} />
                  </span>
                </div>
              </div>

              {/* MATCH */}

              <div className="landing-match-card">
                <div className="landing-match-icon">
                  <Target size={18} />
                </div>

                <div>
                  <span>ROLE MATCH</span>

                  <strong>Full Stack Engineer</strong>
                </div>

                <b>92%</b>
              </div>
            </div>

            {/* FLOATING CARD */}

            <div className="landing-floating-card landing-floating-verification">
              <div className="landing-floating-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>Skill verified</strong>

                <span>Evidence confirmed</span>
              </div>
            </div>

            <div className="landing-floating-card landing-floating-match">
              <div className="landing-floating-icon purple">
                <Sparkles size={17} />
              </div>

              <div>
                <strong>Opportunity match</strong>

                <span>Strong skill alignment</span>
              </div>
            </div>
          </div>
        </div>

        {/* HERO BOTTOM */}

        <div className="landing-container">
          <div className="landing-hero-bottom">
            <span>A better signal for modern hiring</span>

            <div className="landing-hero-bottom-line" />

            <span>Skills → Evidence → Verification → Opportunity</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROBLEM / INTRO
          ===================================================== */}

      <section className="landing-section landing-intro">
        <div className="landing-container">
          <div className="landing-section-heading centered">
            <span className="landing-section-label">THE PROBLEM</span>

            <h2>
              Resumes tell a story.
              <br />
              <span>Evidence tells you what someone can do.</span>
            </h2>

            <p>
              Traditional hiring often depends on keywords, titles and
              self-reported skills. PulseHire brings skills, evidence and
              opportunities together in one professional ecosystem.
            </p>
          </div>

          <div className="landing-problem-grid">
            <div className="landing-problem-card">
              <div className="landing-problem-number">01</div>

              <h3>Skills get lost in resumes</h3>

              <p>
                Candidates may have valuable capabilities that are difficult to
                discover through conventional resumes.
              </p>
            </div>

            <div className="landing-problem-card featured">
              <div className="landing-problem-number">02</div>

              <h3>Verification creates confidence</h3>

              <p>
                Give recruiters stronger signals by connecting professional
                skills with supporting evidence.
              </p>
            </div>

            <div className="landing-problem-card">
              <div className="landing-problem-number">03</div>

              <h3>The right opportunity matters</h3>

              <p>
                Help professionals discover opportunities where their
                capabilities are actually relevant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
          ===================================================== */}

      <section id="features" className="landing-section landing-features">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-section-label">
              ONE PROFESSIONAL ECOSYSTEM
            </span>

            <h2>
              Everything you need to turn
              <br />
              <span>skills into opportunities.</span>
            </h2>

            <p>
              PulseHire brings the important parts of professional hiring into
              one connected experience.
            </p>
          </div>

          <div className="landing-feature-grid">
            {/* FEATURE 1 */}

            <article className="landing-feature-card large">
              <div className="landing-feature-icon">
                <ShieldCheck size={22} />
              </div>

              <span className="landing-feature-number">01</span>

              <h3>Skill Proof</h3>

              <p>
                Build stronger professional signals by attaching meaningful
                evidence to the skills you claim.
              </p>

              <div className="landing-feature-mini">
                <div>
                  <Check size={13} />
                  Evidence-backed skills
                </div>

                <div>
                  <Check size={13} />
                  Verification workflow
                </div>

                <div>
                  <Check size={13} />
                  Recruiter visibility
                </div>
              </div>
            </article>

            {/* FEATURE 2 */}

            <article className="landing-feature-card">
              <div className="landing-feature-icon purple">
                <Target size={22} />
              </div>

              <span className="landing-feature-number">02</span>

              <h3>Smart Job Discovery</h3>

              <p>
                Explore opportunities based on your professional capabilities
                and interests.
              </p>
            </article>

            {/* FEATURE 3 */}

            <article className="landing-feature-card">
              <div className="landing-feature-icon green">
                <TrendingUp size={22} />
              </div>

              <span className="landing-feature-number">03</span>

              <h3>Skill Gap Insights</h3>

              <p>
                Understand where your current capabilities can grow and discover
                learning opportunities.
              </p>
            </article>

            {/* FEATURE 4 */}

            <article className="landing-feature-card">
              <div className="landing-feature-icon orange">
                <GraduationCap size={22} />
              </div>

              <span className="landing-feature-number">04</span>

              <h3>Learning Path</h3>

              <p>
                Turn skill gaps into actionable learning progress with resources
                connected to your goals.
              </p>
            </article>

            {/* FEATURE 5 */}

            <article className="landing-feature-card">
              <div className="landing-feature-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <span className="landing-feature-number">05</span>

              <h3>Recruiter Workspace</h3>

              <p>
                Manage jobs, candidates, applications and company information
                from one workspace.
              </p>
            </article>

            {/* FEATURE 6 */}

            <article className="landing-feature-card">
              <div className="landing-feature-icon purple">
                <BarChart3 size={22} />
              </div>

              <span className="landing-feature-number">06</span>

              <h3>Hiring Analytics</h3>

              <p>
                Understand applications, candidate activity and hiring
                performance through analytics.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
          ===================================================== */}

      <section id="how-it-works" className="landing-section landing-process">
        <div className="landing-container">
          <div className="landing-section-heading centered">
            <span className="landing-section-label">HOW IT WORKS</span>

            <h2>
              From capability
              <br />
              <span>to opportunity.</span>
            </h2>

            <p>
              A simple workflow designed to connect what people can do with
              where they can contribute.
            </p>
          </div>

          <div className="landing-process-grid">
            <div className="landing-process-line" />

            {/* STEP 1 */}

            <div className="landing-process-item">
              <div className="landing-process-number">01</div>

              <div className="landing-process-icon">
                <UserRound size={21} />
              </div>

              <h3>Build your profile</h3>

              <p>
                Create a professional profile that represents your skills and
                experience.
              </p>
            </div>

            {/* STEP 2 */}

            <div className="landing-process-item">
              <div className="landing-process-number">02</div>

              <div className="landing-process-icon">
                <FileCheck2 size={21} />
              </div>

              <h3>Add your proof</h3>

              <p>
                Connect relevant evidence and build stronger signals around your
                capabilities.
              </p>
            </div>

            {/* STEP 3 */}

            <div className="landing-process-item">
              <div className="landing-process-number">03</div>

              <div className="landing-process-icon">
                <Search size={21} />
              </div>

              <h3>Discover opportunities</h3>

              <p>
                Explore jobs and opportunities that align with your professional
                profile.
              </p>
            </div>

            {/* STEP 4 */}

            <div className="landing-process-item">
              <div className="landing-process-number">04</div>

              <div className="landing-process-icon">
                <TrendingUp size={21} />
              </div>

              <h3>Grow and progress</h3>

              <p>
                Track applications, identify skill gaps and continue developing
                your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CANDIDATE SECTION
          ===================================================== */}

      <section id="candidates" className="landing-section landing-audience">
        <div className="landing-container landing-audience-grid">
          <div className="landing-audience-content">
            <span className="landing-section-label">FOR CANDIDATES</span>

            <h2>
              Don't just say
              <span> you have the skill.</span>
              <br />
              Show it.
            </h2>

            <p>
              PulseHire gives professionals a structured way to present their
              capabilities, evidence, applications and learning progress.
            </p>

            <div className="landing-check-list">
              <div>
                <span>
                  <Check size={13} />
                </span>
                Build a skills-focused profile
              </div>

              <div>
                <span>
                  <Check size={13} />
                </span>
                Add evidence to your professional skills
              </div>

              <div>
                <span>
                  <Check size={13} />
                </span>
                Discover relevant job opportunities
              </div>

              <div>
                <span>
                  <Check size={13} />
                </span>
                Track applications and progress
              </div>
            </div>

            <Link to="/register" className="landing-text-button">
              Build your profile
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="landing-audience-visual">
            <div className="landing-profile-panel">
              <div className="landing-panel-top">
                <span>YOUR PROFESSIONAL SIGNAL</span>

                <span className="landing-live-dot">LIVE</span>
              </div>

              <div className="landing-large-profile">
                <div className="landing-large-avatar">
                  <UserRound size={30} />
                </div>

                <div>
                  <strong>Your professional profile</strong>

                  <span>Skills • Evidence • Experience</span>
                </div>
              </div>

              <div className="landing-profile-stat-grid">
                <div>
                  <span>SKILLS</span>

                  <strong>12</strong>
                </div>

                <div>
                  <span>VERIFIED</span>

                  <strong>8</strong>
                </div>

                <div>
                  <span>MATCH</span>

                  <strong>92%</strong>
                </div>
              </div>

              <div className="landing-profile-bar-title">
                <span>Profile strength</span>

                <strong>86%</strong>
              </div>

              <div className="landing-profile-bar">
                <span />
              </div>

              <div className="landing-profile-footer">
                <span>Keep building your professional signal</span>

                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECRUITER SECTION
          ===================================================== */}

      <section id="recruiters" className="landing-section landing-recruiter">
        <div className="landing-container landing-recruiter-grid">
          <div className="landing-recruiter-visual">
            <div className="landing-recruiter-window">
              <div className="landing-window-header">
                <div className="landing-window-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <span>Recruiter workspace</span>
              </div>

              <div className="landing-recruiter-body">
                <div className="landing-recruiter-sidebar">
                  <div className="landing-mini-logo">PH</div>

                  <span className="active" />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="landing-recruiter-main">
                  <div className="landing-recruiter-heading">
                    <div>
                      <span>TALENT OVERVIEW</span>

                      <strong>Find the right capabilities</strong>
                    </div>

                    <div className="landing-recruiter-count">248</div>
                  </div>

                  <div className="landing-candidate-row">
                    <div className="landing-candidate-avatar">AR</div>

                    <div className="landing-candidate-details">
                      <strong>Full Stack Developer</strong>

                      <span>React • Node.js • MongoDB</span>
                    </div>

                    <div className="landing-candidate-match">94%</div>
                  </div>

                  <div className="landing-candidate-row">
                    <div className="landing-candidate-avatar second">MK</div>

                    <div className="landing-candidate-details">
                      <strong>Backend Engineer</strong>

                      <span>Node.js • APIs • Databases</span>
                    </div>

                    <div className="landing-candidate-match">89%</div>
                  </div>

                  <div className="landing-candidate-row">
                    <div className="landing-candidate-avatar third">SP</div>

                    <div className="landing-candidate-details">
                      <strong>Software Engineer</strong>

                      <span>Java • Spring • SQL</span>
                    </div>

                    <div className="landing-candidate-match">87%</div>
                  </div>

                  <div className="landing-analytics-strip">
                    <div>
                      <span>ACTIVE JOBS</span>

                      <strong>18</strong>
                    </div>

                    <div>
                      <span>APPLICATIONS</span>

                      <strong>326</strong>
                    </div>

                    <div>
                      <span>VERIFIED</span>

                      <strong>74%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-recruiter-content">
            <span className="landing-section-label">FOR RECRUITERS</span>

            <h2>
              See beyond
              <span> the resume.</span>
            </h2>

            <p>
              Build a clearer picture of candidates through skills, evidence,
              applications and professional signals — all from one recruiter
              workspace.
            </p>

            <div className="landing-check-list">
              <div>
                <span>
                  <Check size={13} />
                </span>
                Post and manage opportunities
              </div>

              <div>
                <span>
                  <Check size={13} />
                </span>
                Review candidate profiles
              </div>

              <div>
                <span>
                  <Check size={13} />
                </span>
                Review skill verification
              </div>

              <div>
                <span>
                  <Check size={13} />
                </span>
                Track applications and analytics
              </div>
            </div>

            <Link to="/register" className="landing-text-button">
              Create recruiter account
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          LEARNING / GROWTH
          ===================================================== */}

      <section className="landing-section landing-growth">
        <div className="landing-container">
          <div className="landing-growth-card">
            <div className="landing-growth-content">
              <span className="landing-section-label">KEEP GROWING</span>

              <h2>
                Turn skill gaps
                <br />
                into your next advantage.
              </h2>

              <p>
                When there is a gap between your current capabilities and your
                target opportunity, PulseHire helps you understand what to
                improve and keep moving forward.
              </p>

              <div className="landing-growth-points">
                <div>
                  <div className="landing-growth-icon">
                    <Target size={17} />
                  </div>

                  <div>
                    <strong>Identify skill gaps</strong>

                    <span>Understand where your profile can improve.</span>
                  </div>
                </div>

                <div>
                  <div className="landing-growth-icon">
                    <GraduationCap size={17} />
                  </div>

                  <div>
                    <strong>Discover learning resources</strong>

                    <span>
                      Continue developing the capabilities that matter.
                    </span>
                  </div>
                </div>

                <div>
                  <div className="landing-growth-icon">
                    <TrendingUp size={17} />
                  </div>

                  <div>
                    <strong>Track your progress</strong>

                    <span>Keep your professional journey moving forward.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-growth-visual">
              <div className="landing-growth-ring">
                <div className="landing-growth-center">
                  <Sparkles size={22} />

                  <strong>78%</strong>

                  <span>Growth signal</span>
                </div>
              </div>

              <div className="landing-growth-floating one">
                <span>React</span>

                <Check size={12} />
              </div>

              <div className="landing-growth-floating two">
                <span>Node.js</span>

                <Check size={12} />
              </div>

              <div className="landing-growth-floating three">
                <span>System Design</span>

                <span className="growth-learning">Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section className="landing-cta">
        <div className="landing-cta-glow" />

        <div className="landing-container landing-cta-content">
          <div className="landing-cta-icon">
            <Sparkles size={22} />
          </div>

          <span className="landing-section-label">START WITH PULSEHIRE</span>

          <h2>
            Your next opportunity
            <br />
            starts with a stronger signal.
          </h2>

          <p>
            Build your profile. Prove your capabilities. Discover where they can
            take you.
          </p>

          <div className="landing-cta-actions">
            <Link to="/register" className="landing-primary-button">
              Get started
              <ArrowRight size={17} />
            </Link>

            <Link to="/login" className="landing-cta-login">
              Already have an account?
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-main">
            <div className="landing-footer-brand">
              <Link to="/" className="landing-logo">
                <span className="landing-logo-mark">PH</span>

                <span className="landing-logo-text">
                  Pulse<span>Hire</span>
                </span>
              </Link>

              <p>
                Evidence-backed hiring for a skills-first professional world.
              </p>
            </div>

            <div className="landing-footer-column">
              <strong>Product</strong>

              <a href="#features">Features</a>

              <a href="#how-it-works">How it works</a>

              <a href="#candidates">Candidates</a>

              <a href="#recruiters">Recruiters</a>
            </div>

            <div className="landing-footer-column">
              <strong>Account</strong>

              <Link to="/login">Sign in</Link>

              <Link to="/register">Create account</Link>
            </div>

            <div className="landing-footer-column">
              <strong>PulseHire</strong>

              <span>Skills</span>

              <span>Evidence</span>

              <span>Opportunities</span>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <span>
              © {new Date().getFullYear()} PulseHire. All rights reserved.
            </span>

            <span>Built for skills-first hiring.</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
