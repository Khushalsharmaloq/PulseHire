import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  CircleUserRound,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Link } from "react-router-dom";


const CandidateDashboard = () => {
  return (
    <div className="candidate-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="candidate-sidebar">

        <div className="dashboard-brand">

          <Link
            to="/candidate/dashboard"
            className="dashboard-brand"
          >
            <div className="dashboard-brand-icon">
              <BriefcaseBusiness size={19} />
            </div>

            <span>PulseHire</span>
          </Link>

        </div>


        <div className="sidebar-section">

          <span className="sidebar-label">
            WORKSPACE
          </span>


          <nav className="sidebar-nav">

            <Link
              to="/candidate/dashboard"
              className="sidebar-link active"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>


            <Link
              to="/candidate/profile"
              className="sidebar-link"
            >
              <CircleUserRound size={17} />
              My Profile
            </Link>


            <Link
              to="/candidate/skill-proof"
              className="sidebar-link"
            >
              <BadgeCheck size={17} />
              My Skills
            </Link>


            <Link
              to="/candidate/skill-proof"
              className="sidebar-link"
            >
              <FileCheck2 size={17} />
              Skill Proof
            </Link>


            <Link
              to="/candidate/skill-gap"
              className="sidebar-link"
            >
              <Target size={17} />
              Skill Gap
            </Link>


            <Link
              to="/candidate/learning"
              className="sidebar-link"
            >
              <BookOpen size={17} />
              Learning
            </Link>


            <Link
              to="/candidate/jobs"
              className="sidebar-link"
            >
              <Search size={17} />
              Find Jobs
            </Link>


            <Link
              to="/candidate/applications"
              className="sidebar-link"
            >
              <BriefcaseBusiness size={17} />
              Applications
            </Link>

          </nav>

        </div>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              TC
            </div>


            <div>
              <strong>
                Test Candidate
              </strong>

              <span>
                Candidate
              </span>
            </div>

          </div>


          <button
            className="logout-button"
            type="button"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="candidate-main">


        {/* TOP BAR */}

        <header className="candidate-topbar">

          <div>

            <span className="dashboard-eyebrow">
              CANDIDATE WORKSPACE
            </span>

            <h1>
              Good morning, Candidate.
            </h1>

          </div>


          <div className="topbar-actions">

            <Link
              to="/candidate/jobs"
              className="topbar-search"
            >
              <Search size={17} />
              Search jobs
            </Link>


            <Link
              to="/candidate/profile"
              className="topbar-avatar"
            >
              TC
            </Link>

          </div>

        </header>


        {/* =====================================================
            PROFILE READINESS
        ===================================================== */}

        <section className="readiness-banner">

          <div className="readiness-content">

            <div className="readiness-icon">
              <ShieldCheck size={24} />
            </div>


            <div>

              <span>
                YOUR HIRING READINESS
              </span>

              <h2>
                Your profile is 82% ready.
              </h2>

              <p>
                Verify your remaining skills and close your
                skill gaps to improve your hiring readiness.
              </p>

            </div>

          </div>


          <Link
            to="/candidate/profile"
            className="dashboard-action"
          >
            Improve Profile
            <ArrowRight size={16} />
          </Link>

        </section>


        {/* =====================================================
            OVERVIEW CARDS
        ===================================================== */}

        <section className="dashboard-stats">


          <Link
            to="/candidate/skill-proof"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">
              <BadgeCheck size={20} />
            </div>

            <div>
              <span>
                Verified Skills
              </span>

              <strong>
                3
              </strong>

              <small>
                of 5 skills
              </small>
            </div>

          </Link>


          <Link
            to="/candidate/skill-gap"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">
              <Target size={20} />
            </div>

            <div>
              <span>
                Skill Gap
              </span>

              <strong>
                20%
              </strong>

              <small>
                2 skills to improve
              </small>
            </div>

          </Link>


          <Link
            to="/candidate/applications"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <span>
                Applications
              </span>

              <strong>
                4
              </strong>

              <small>
                1 interview stage
              </small>
            </div>

          </Link>


          <Link
            to="/candidate/profile"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>

            <div>
              <span>
                Profile Strength
              </span>

              <strong>
                82%
              </strong>

              <small>
                Strong progress
              </small>
            </div>

          </Link>


        </section>


        {/* =====================================================
            TWO COLUMN AREA
        ===================================================== */}

        <section className="dashboard-grid">


          {/* SKILLS */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <span className="panel-label">
                  VERIFIED SKILLS
                </span>

                <h3>
                  Your skill identity
                </h3>

              </div>


              <Link to="/candidate/skill-proof">
                View all
                <ChevronRight size={15} />
              </Link>

            </div>


            <div className="dashboard-skill-list">


              <div className="dashboard-skill">

                <div className="skill-name">
                  <span>React</span>
                  <BadgeCheck size={16} />
                </div>

                <span className="skill-status">
                  Verified
                </span>

              </div>


              <div className="dashboard-skill">

                <div className="skill-name">
                  <span>Node.js</span>
                  <BadgeCheck size={16} />
                </div>

                <span className="skill-status">
                  Verified
                </span>

              </div>


              <div className="dashboard-skill">

                <div className="skill-name">
                  <span>MongoDB</span>
                  <BadgeCheck size={16} />
                </div>

                <span className="skill-status">
                  Verified
                </span>

              </div>


              <div className="dashboard-skill pending">

                <div className="skill-name">
                  <span>Express.js</span>
                </div>

                <span className="skill-pending">
                  Pending proof
                </span>

              </div>


            </div>

          </div>


          {/* SKILL GAP */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <span className="panel-label">
                  SKILL GAP INTELLIGENCE
                </span>

                <h3>
                  What to improve next
                </h3>

              </div>

              <Target size={20} />

            </div>


            <div className="gap-highlight">

              <div className="gap-percentage">
                20%
              </div>


              <div>

                <strong>
                  Skill gap detected
                </strong>

                <p>
                  You're missing 4 skills required
                  by your target opportunities.
                </p>

              </div>

            </div>


            <div className="gap-skills">

              <span>JavaScript</span>
              <span>Express.js</span>
              <span>MongoDB</span>

            </div>


            <Link
              to="/candidate/learning"
              className="panel-button"
            >
              Explore learning resources
              <ArrowRight size={15} />
            </Link>

          </div>

        </section>


        {/* =====================================================
            RECENT APPLICATIONS
        ===================================================== */}

        <section className="dashboard-panel applications-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                APPLICATION ACTIVITY
              </span>

              <h3>
                Recent applications
              </h3>

            </div>


            <Link to="/candidate/applications">
              View all
              <ChevronRight size={15} />
            </Link>

          </div>


          <div className="application-list">


            <div className="application-row">

              <div className="company-placeholder">
                M
              </div>

              <div className="application-info">

                <strong>
                  MERN Stack Developer Intern
                </strong>

                <span>
                  Technology Company
                </span>

              </div>

              <span className="application-status interview">
                Interview
              </span>

            </div>


            <div className="application-row">

              <div className="company-placeholder">
                A
              </div>

              <div className="application-info">

                <strong>
                  Backend Developer Intern
                </strong>

                <span>
                  Software Company
                </span>

              </div>

              <span className="application-status pending">
                Under Review
              </span>

            </div>


            <div className="application-row">

              <div className="company-placeholder">
                P
              </div>

              <div className="application-info">

                <strong>
                  React Developer
                </strong>

                <span>
                  Product Startup
                </span>

              </div>

              <span className="application-status rejected">
                Rejected
              </span>

            </div>


          </div>

        </section>


        {/* =====================================================
            LEARNING
        ===================================================== */}

        <section className="dashboard-panel learning-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                RECOMMENDED LEARNING
              </span>

              <h3>
                Close your skill gaps
              </h3>

            </div>

            <BookOpen size={20} />

          </div>


          <div className="learning-grid">


            <div className="learning-card">

              <span className="resource-type">
                DOCUMENTATION
              </span>

              <h4>
                JavaScript Fundamentals
              </h4>

              <p>
                Strengthen your JavaScript fundamentals
                and modern development knowledge.
              </p>

              <Link to="/candidate/learning">
                Start learning
                <ArrowRight size={14} />
              </Link>

            </div>


            <div className="learning-card">

              <span className="resource-type">
                COURSE
              </span>

              <h4>
                MongoDB Fundamentals
              </h4>

              <p>
                Learn data modeling, queries and
                database development.
              </p>

              <Link to="/candidate/learning">
                Start learning
                <ArrowRight size={14} />
              </Link>

            </div>


            <div className="learning-card">

              <span className="resource-type">
                DOCUMENTATION
              </span>

              <h4>
                Express.js
              </h4>

              <p>
                Learn how to build web applications
                and APIs with Express.js.
              </p>

              <Link to="/candidate/learning">
                Start learning
                <ArrowRight size={14} />
              </Link>

            </div>


          </div>

        </section>


      </main>

    </div>
  );
};


export default CandidateDashboard;