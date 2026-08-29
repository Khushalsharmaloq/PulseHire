import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  Filter,
  LayoutDashboard,
  LogOut,
  Search,
  Target,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";


const RecruiterApplications = () => {
  return (
    <div className="recruiter-dashboard">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="recruiter-sidebar">

        <Link
          to="/recruiter/dashboard"
          className="dashboard-brand"
        >

          <div className="dashboard-brand-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <span>
            PulseHire
          </span>

        </Link>


        <div className="sidebar-section">

          <span className="sidebar-label">
            RECRUITER WORKSPACE
          </span>


          <nav className="sidebar-nav">

            <Link
              to="/recruiter/dashboard"
              className="sidebar-link"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>


            <Link
              to="/recruiter/jobs"
              className="sidebar-link"
            >
              <BriefcaseBusiness size={17} />
              My Jobs
            </Link>


            <Link
              to="/recruiter/applications"
              className="sidebar-link active"
            >
              <FileCheck2 size={17} />
              Applications
            </Link>


            <Link
              to="/recruiter/candidates"
              className="sidebar-link"
            >
              <Users size={17} />
              Candidates
            </Link>


            <Link
              to="/recruiter/verification"
              className="sidebar-link"
            >
              <BadgeCheck size={17} />
              Verification
            </Link>


            <Link
              to="/recruiter/analytics"
              className="sidebar-link"
            >
              <BarChart3 size={17} />
              Analytics
            </Link>

          </nav>

        </div>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar recruiter-avatar">
              TN
            </div>


            <div>

              <strong>
                TechNova
              </strong>

              <span>
                Recruiter
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
          MAIN
          ===================================================== */}

      <main className="recruiter-main">


        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="recruiter-topbar">

          <div>

            <span className="dashboard-eyebrow">
              APPLICATION REVIEW
            </span>

            <h1>
              Review candidates by actual fit.
            </h1>

          </div>

        </header>


        {/* ===================================================
            JOB SELECTOR
            =================================================== */}

        <section className="application-job-selector">

          <div>

            <span className="panel-label">
              SELECTED ROLE
            </span>

            <h2>
              Senior Full Stack Developer
            </h2>

            <p>
              32 applications · Bengaluru · Full-time
            </p>

          </div>


          <select defaultValue="Senior Full Stack Developer">

            <option>
              Senior Full Stack Developer
            </option>

            <option>
              React Engineer
            </option>

            <option>
              Backend Engineer
            </option>

            <option>
              Frontend Developer
            </option>

          </select>

        </section>


        {/* ===================================================
            SUMMARY
            =================================================== */}

        <section className="recruiter-summary">

          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <Users size={16} />
            </div>

            <span>
              TOTAL
            </span>

            <strong>
              32
            </strong>

            <small>
              applications
            </small>

          </div>


          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <Target size={16} />
            </div>

            <span>
              STRONG MATCH
            </span>

            <strong>
              11
            </strong>

            <small>
              above 80%
            </small>

          </div>


          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <BadgeCheck size={16} />
            </div>

            <span>
              VERIFIED
            </span>

            <strong>
              24
            </strong>

            <small>
              evidence-backed
            </small>

          </div>


          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <FileCheck2 size={16} />
            </div>

            <span>
              TO REVIEW
            </span>

            <strong>
              15
            </strong>

            <small>
              awaiting review
            </small>

          </div>

        </section>


        {/* ===================================================
            FILTER TOOLBAR
            =================================================== */}

        <section className="applications-toolbar">

          <div className="applications-search">

            <Search size={14} />

            <input
              type="text"
              placeholder="Search candidates..."
            />

          </div>


          <div className="applications-filters">

            <button
              className="application-filter active"
              type="button"
            >
              All
            </button>

            <button
              className="application-filter"
              type="button"
            >
              Strong Match
            </button>

            <button
              className="application-filter"
              type="button"
            >
              Verified
            </button>

            <button
              className="application-filter"
              type="button"
            >
              Needs Review
            </button>

          </div>


          <button
            className="application-sort"
            type="button"
          >

            <Filter size={13} />

            Match Score

          </button>

        </section>


        {/* ===================================================
            APPLICATION LIST
            =================================================== */}

        <section className="applications-panel">

          <div className="applications-panel-heading">

            <div>

              <span className="panel-label">
                CANDIDATES
              </span>

              <h2>
                Applications ranked by relevance.
              </h2>

            </div>

            <span className="applications-count">
              Showing 1–4 of 32
            </span>

          </div>


          <div className="application-list">


            {/* =================================================
                APPLICATION 1
                ================================================= */}

            <article className="application-card top-match">

              <div className="application-candidate">

                <div className="application-avatar">
                  AK
                </div>


                <div>

                  <div className="application-name-row">

                    <h3>
                      Arjun Kumar
                    </h3>

                    <span className="top-match-label">
                      TOP MATCH
                    </span>

                  </div>


                  <p>
                    Full Stack Developer · 3 years
                  </p>


                  <span className="application-date">
                    Applied 2 hours ago
                  </span>

                </div>

              </div>


              <div className="application-match">

                <span>
                  PULSEHIRE MATCH
                </span>

                <strong>
                  94%
                </strong>

                <small>
                  Excellent fit
                </small>

              </div>


              <div className="application-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span className="application-skill">
                    React
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    Node.js
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    MongoDB
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="application-gap">

                <span>
                  SKILL GAP
                </span>

                <strong>
                  TypeScript
                </strong>

                <small>
                  64% readiness
                </small>

              </div>


              <div className="application-status">

                <span className="application-status-badge review">
                  Under Review
                </span>

              </div>


              <Link
                to="/recruiter/candidates/arjun"
                className="application-view"
              >

                Review

                <ArrowRight size={12} />

              </Link>

            </article>


            {/* =================================================
                APPLICATION 2
                ================================================= */}

            <article className="application-card">

              <div className="application-candidate">

                <div className="application-avatar">
                  RS
                </div>


                <div>

                  <div className="application-name-row">

                    <h3>
                      Riya Sharma
                    </h3>

                  </div>


                  <p>
                    Frontend Developer · 4 years
                  </p>


                  <span className="application-date">
                    Applied 5 hours ago
                  </span>

                </div>

              </div>


              <div className="application-match">

                <span>
                  PULSEHIRE MATCH
                </span>

                <strong>
                  91%
                </strong>

                <small>
                  Excellent fit
                </small>

              </div>


              <div className="application-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span className="application-skill">
                    React
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    TypeScript
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    Testing
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="application-gap">

                <span>
                  SKILL GAP
                </span>

                <strong>
                  Docker
                </strong>

                <small>
                  Preferred
                </small>

              </div>


              <div className="application-status">

                <span className="application-status-badge review">
                  Under Review
                </span>

              </div>


              <Link
                to="/recruiter/candidates/riya"
                className="application-view"
              >

                Review

                <ArrowRight size={12} />

              </Link>

            </article>


            {/* =================================================
                APPLICATION 3
                ================================================= */}

            <article className="application-card">

              <div className="application-candidate">

                <div className="application-avatar">
                  VM
                </div>


                <div>

                  <div className="application-name-row">

                    <h3>
                      Vikram Mehta
                    </h3>

                  </div>


                  <p>
                    Backend Developer · 3 years
                  </p>


                  <span className="application-date">
                    Applied yesterday
                  </span>

                </div>

              </div>


              <div className="application-match">

                <span>
                  PULSEHIRE MATCH
                </span>

                <strong>
                  87%
                </strong>

                <small>
                  Strong fit
                </small>

              </div>


              <div className="application-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span className="application-skill">
                    Node.js
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    MongoDB
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    Docker
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="application-gap">

                <span>
                  SKILL GAP
                </span>

                <strong>
                  React
                </strong>

                <small>
                  Required skill
                </small>

              </div>


              <div className="application-status">

                <span className="application-status-badge new">
                  New
                </span>

              </div>


              <Link
                to="/recruiter/candidates/vikram"
                className="application-view"
              >

                Review

                <ArrowRight size={12} />

              </Link>

            </article>


            {/* =================================================
                APPLICATION 4
                ================================================= */}

            <article className="application-card">

              <div className="application-candidate">

                <div className="application-avatar">
                  SP
                </div>


                <div>

                  <div className="application-name-row">

                    <h3>
                      Sameer Patel
                    </h3>

                  </div>


                  <p>
                    Full Stack Developer · 2 years
                  </p>


                  <span className="application-date">
                    Applied yesterday
                  </span>

                </div>

              </div>


              <div className="application-match">

                <span>
                  PULSEHIRE MATCH
                </span>

                <strong className="lower-match">
                  68%
                </strong>

                <small>
                  Potential fit
                </small>

              </div>


              <div className="application-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span className="application-skill">
                    React
                    <BadgeCheck size={9} />
                  </span>

                  <span className="application-skill">
                    JavaScript
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="application-gap">

                <span>
                  SKILL GAP
                </span>

                <strong>
                  3 skills
                </strong>

                <small>
                  Node · Mongo · Docker
                </small>

              </div>


              <div className="application-status">

                <span className="application-status-badge new">
                  New
                </span>

              </div>


              <Link
                to="/recruiter/candidates/sameer"
                className="application-view"
              >

                Review

                <ArrowRight size={12} />

              </Link>

            </article>


          </div>


          {/* =================================================
              PAGINATION
              ================================================= */}

          <div className="applications-pagination">

            <span>
              1–4 of 32 candidates
            </span>


            <div>

              <button
                type="button"
                disabled
              >
                Previous
              </button>

              <button
                type="button"
                className="page-active"
              >
                1
              </button>

              <button type="button">
                2
              </button>

              <button type="button">
                3
              </button>

              <button type="button">
                4
              </button>

              <button type="button">
                Next
              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            INSIGHT
            =================================================== */}

        <section className="recruiter-insight">

          <div className="recruiter-insight-icon">
            <CheckCircle2 size={21} />
          </div>


          <div>

            <span className="panel-label">
              RECRUITER INSIGHT
            </span>

            <h2>
              Start with evidence-backed candidates.
            </h2>

            <p>
              Match scores combine role requirements with
              verified candidate skills. Skill gaps remain
              visible so recruiters can make informed decisions
              instead of relying only on keyword matching.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default RecruiterApplications;