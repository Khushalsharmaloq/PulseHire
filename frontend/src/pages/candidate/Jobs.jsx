import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  Filter,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  Target,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";


const Jobs = () => {
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

            <span>
              PulseHire
            </span>
          </Link>

        </div>


        <div className="sidebar-section">

          <span className="sidebar-label">
            CANDIDATE WORKSPACE
          </span>


          <nav className="sidebar-nav">

            <Link
              to="/candidate/dashboard"
              className="sidebar-link"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>


            <Link
              to="/candidate/profile"
              className="sidebar-link"
            >
              <User size={17} />
              My Profile
            </Link>


            <Link
              to="/candidate/skill-proof"
              className="sidebar-link"
            >
              <BadgeCheck size={17} />
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
              className="sidebar-link active"
            >
              <BriefcaseBusiness size={17} />
              Find Jobs
            </Link>


            <Link
              to="/candidate/applications"
              className="sidebar-link"
            >
              <FileCheck2 size={17} />
              Applications
            </Link>

          </nav>

        </div>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              AK
            </div>


            <div>

              <strong>
                Arjun Kumar
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
          MAIN
          ===================================================== */}

      <main className="candidate-main">


        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="candidate-topbar">

          <div>

            <span className="dashboard-eyebrow">
              OPPORTUNITY DISCOVERY
            </span>

            <h1>
              Find roles where your skills matter.
            </h1>

          </div>

        </header>


        {/* ===================================================
            SEARCH
            =================================================== */}

        <section className="jobs-search-panel">

          <div className="jobs-search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search by role, skill or technology"
            />

          </div>


          <div className="jobs-location-box">

            <MapPin size={16} />

            <input
              type="text"
              placeholder="Location"
            />

          </div>


          <button
            className="jobs-search-button"
            type="button"
          >

            Search

            <ArrowRight size={14} />

          </button>


          <button
            className="jobs-filter-button"
            type="button"
          >

            <Filter size={15} />

            Filters

          </button>

        </section>


        {/* ===================================================
            SMART MATCH MESSAGE
            =================================================== */}

        <section className="jobs-match-banner">

          <div className="jobs-match-icon">
            <Target size={19} />
          </div>


          <div>

            <span className="panel-label">
              PULSEHIRE MATCHING
            </span>

            <h2>
              Jobs are ranked around your verified skills.
            </h2>

            <p>
              Your strongest matches prioritize roles where
              your verified capabilities align with what
              employers are looking for.
            </p>

          </div>


          <div className="jobs-match-score">

            <span>
              PROFILE READINESS
            </span>

            <strong>
              80%
            </strong>

          </div>

        </section>


        {/* ===================================================
            RESULTS HEADER
            =================================================== */}

        <section className="jobs-results-heading">

          <div>

            <span className="panel-label">
              RECOMMENDED FOR YOU
            </span>

            <h2>
              Opportunities matching your profile.
            </h2>

          </div>


          <span className="jobs-results-count">
            24 roles found
          </span>

        </section>


        {/* ===================================================
            JOB LIST
            =================================================== */}

        <section className="jobs-list">


          {/* =================================================
              JOB 1
              ================================================= */}

          <article className="job-discovery-card featured">

            <div className="job-main-info">

              <div className="job-company-logo">
                TN
              </div>


              <div>

                <div className="job-title-row">

                  <h3>
                    Senior Full Stack Developer
                  </h3>

                  <span className="job-featured">
                    TOP MATCH
                  </span>

                </div>


                <p>
                  TechNova Systems
                </p>


                <div className="job-meta">

                  <span>
                    <MapPin size={11} />
                    Bengaluru
                  </span>

                  <span>
                    Full-time
                  </span>

                  <span>
                    3–5 years
                  </span>

                </div>

              </div>

            </div>


            <div className="job-match-column">

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


            <div className="job-skill-column">

              <span>
                VERIFIED MATCH
              </span>

              <div>

                <span className="job-skill verified">
                  React
                  <BadgeCheck size={10} />
                </span>

                <span className="job-skill verified">
                  Node.js
                  <BadgeCheck size={10} />
                </span>

                <span className="job-skill verified">
                  MongoDB
                  <BadgeCheck size={10} />
                </span>

              </div>

            </div>


            <div className="job-gap-column">

              <span>
                SKILL GAP
              </span>

              <strong>
                1 skill
              </strong>

              <small>
                TypeScript
              </small>

            </div>


            <Link
              to="/candidate/jobs/technova-full-stack"
              className="job-view-button"
            >

              View Role

              <ArrowRight size={13} />

            </Link>

          </article>


          {/* =================================================
              JOB 2
              ================================================= */}

          <article className="job-discovery-card">

            <div className="job-main-info">

              <div className="job-company-logo">
                PS
              </div>


              <div>

                <div className="job-title-row">

                  <h3>
                    Full Stack Engineer
                  </h3>

                </div>


                <p>
                  PixelStack
                </p>


                <div className="job-meta">

                  <span>
                    <MapPin size={11} />
                    Remote
                  </span>

                  <span>
                    Full-time
                  </span>

                  <span>
                    2–4 years
                  </span>

                </div>

              </div>

            </div>


            <div className="job-match-column">

              <span>
                PULSEHIRE MATCH
              </span>

              <strong>
                89%
              </strong>

              <small>
                Strong fit
              </small>

            </div>


            <div className="job-skill-column">

              <span>
                VERIFIED MATCH
              </span>

              <div>

                <span className="job-skill verified">
                  React
                  <BadgeCheck size={10} />
                </span>

                <span className="job-skill verified">
                  Node.js
                  <BadgeCheck size={10} />
                </span>

              </div>

            </div>


            <div className="job-gap-column">

              <span>
                SKILL GAP
              </span>

              <strong>
                1 skill
              </strong>

              <small>
                Docker
              </small>

            </div>


            <Link
              to="/candidate/jobs/pixelstack-full-stack"
              className="job-view-button"
            >

              View Role

              <ArrowRight size={13} />

            </Link>

          </article>


          {/* =================================================
              JOB 3
              ================================================= */}

          <article className="job-discovery-card">

            <div className="job-main-info">

              <div className="job-company-logo">
                AC
              </div>


              <div>

                <div className="job-title-row">

                  <h3>
                    MERN Developer
                  </h3>

                </div>


                <p>
                  AppCore Technologies
                </p>


                <div className="job-meta">

                  <span>
                    <MapPin size={11} />
                    Hyderabad
                  </span>

                  <span>
                    Full-time
                  </span>

                  <span>
                    1–3 years
                  </span>

                </div>

              </div>

            </div>


            <div className="job-match-column">

              <span>
                PULSEHIRE MATCH
              </span>

              <strong>
                84%
              </strong>

              <small>
                Good fit
              </small>

            </div>


            <div className="job-skill-column">

              <span>
                VERIFIED MATCH
              </span>

              <div>

                <span className="job-skill verified">
                  React
                  <BadgeCheck size={10} />
                </span>

                <span className="job-skill verified">
                  MongoDB
                  <BadgeCheck size={10} />
                </span>

              </div>

            </div>


            <div className="job-gap-column">

              <span>
                SKILL GAP
              </span>

              <strong>
                2 skills
              </strong>

              <small>
                TypeScript · Docker
              </small>

            </div>


            <Link
              to="/candidate/jobs/mern-developer"
              className="job-view-button"
            >

              View Role

              <ArrowRight size={13} />

            </Link>

          </article>


          {/* =================================================
              JOB 4
              ================================================= */}

          <article className="job-discovery-card">

            <div className="job-main-info">

              <div className="job-company-logo">
                DW
              </div>


              <div>

                <div className="job-title-row">

                  <h3>
                    React Developer
                  </h3>

                </div>


                <p>
                  DevWorks
                </p>


                <div className="job-meta">

                  <span>
                    <MapPin size={11} />
                    Pune
                  </span>

                  <span>
                    Full-time
                  </span>

                  <span>
                    1–2 years
                  </span>

                </div>

              </div>

            </div>


            <div className="job-match-column">

              <span>
                PULSEHIRE MATCH
              </span>

              <strong>
                76%
              </strong>

              <small>
                Potential fit
              </small>

            </div>


            <div className="job-skill-column">

              <span>
                VERIFIED MATCH
              </span>

              <div>

                <span className="job-skill verified">
                  React
                  <BadgeCheck size={10} />
                </span>

                <span className="job-skill verified">
                  Node.js
                  <BadgeCheck size={10} />
                </span>

              </div>

            </div>


            <div className="job-gap-column">

              <span>
                SKILL GAP
              </span>

              <strong>
                2 skills
              </strong>

              <small>
                Testing · TypeScript
              </small>

            </div>


            <Link
              to="/candidate/jobs/react-developer"
              className="job-view-button"
            >

              View Role

              <ArrowRight size={13} />

            </Link>

          </article>


        </section>


        {/* ===================================================
            MATCH EXPLANATION
            =================================================== */}

        <section className="job-match-explanation">

          <div className="job-match-explanation-icon">
            <CheckCircle2 size={20} />
          </div>


          <div>

            <span className="panel-label">
              HOW PULSEHIRE MATCHES YOU
            </span>

            <h2>
              A high match doesn't mean every skill is perfect.
            </h2>

            <p>
              Your PulseHire match considers verified skills,
              required skills, skill gaps and your current
              readiness. A role can still be a strong opportunity
              even when you have a small gap — because the
              platform shows you exactly what to improve.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default Jobs;