import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  MapPin,
  Target,
  User,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";


const JobDetails = () => {
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
            BACK
            =================================================== */}

        <Link
          to="/candidate/jobs"
          className="job-details-back"
        >

          <ArrowLeft size={13} />

          Back to opportunities

        </Link>


        {/* ===================================================
            JOB HEADER
            =================================================== */}

        <section className="job-details-header">

          <div className="job-details-company">

            <div className="job-details-logo">
              TN
            </div>


            <div>

              <span className="panel-label">
                TECHNOVA SYSTEMS
              </span>

              <h1>
                Senior Full Stack Developer
              </h1>


              <div className="job-details-meta">

                <span>
                  <MapPin size={12} />
                  Bengaluru
                </span>

                <span>
                  Full-time
                </span>

                <span>
                  3–5 years experience
                </span>

                <span>
                  Posted 2 days ago
                </span>

              </div>

            </div>

          </div>


          <div className="job-details-header-match">

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

        </section>


        {/* ===================================================
            MAIN GRID
            =================================================== */}

        <div className="job-details-layout">


          {/* =================================================
              LEFT
              ================================================= */}

          <div className="job-details-left">


            {/* =================================================
                ABOUT ROLE
                ================================================= */}

            <section className="job-details-panel">

              <span className="panel-label">
                ABOUT THE ROLE
              </span>

              <h2>
                Build products that solve real problems.
              </h2>

              <p>
                TechNova Systems is looking for a Senior Full
                Stack Developer to build and maintain scalable
                web applications across the product ecosystem.
              </p>

              <p>
                You'll work closely with product, design and
                engineering teams to build reliable interfaces,
                APIs and data-driven features.
              </p>

            </section>


            {/* =================================================
                RESPONSIBILITIES
                ================================================= */}

            <section className="job-details-panel">

              <span className="panel-label">
                RESPONSIBILITIES
              </span>

              <div className="job-responsibilities">

                <div>
                  <CheckCircle2 size={13} />
                  Build and maintain React applications.
                </div>

                <div>
                  <CheckCircle2 size={13} />
                  Design and implement REST APIs.
                </div>

                <div>
                  <CheckCircle2 size={13} />
                  Work with MongoDB and application data.
                </div>

                <div>
                  <CheckCircle2 size={13} />
                  Collaborate with cross-functional teams.
                </div>

                <div>
                  <CheckCircle2 size={13} />
                  Write maintainable and production-ready code.
                </div>

              </div>

            </section>


            {/* =================================================
                REQUIREMENTS
                ================================================= */}

            <section className="job-details-panel">

              <span className="panel-label">
                ROLE REQUIREMENTS
              </span>

              <div className="requirement-list">


                <div className="requirement-row verified">

                  <CheckCircle2 size={15} />

                  <div>

                    <strong>
                      React
                    </strong>

                    <span>
                      Required · You have verified evidence
                    </span>

                  </div>

                  <BadgeCheck size={14} />

                </div>


                <div className="requirement-row verified">

                  <CheckCircle2 size={15} />

                  <div>

                    <strong>
                      Node.js
                    </strong>

                    <span>
                      Required · You have verified evidence
                    </span>

                  </div>

                  <BadgeCheck size={14} />

                </div>


                <div className="requirement-row verified">

                  <CheckCircle2 size={15} />

                  <div>

                    <strong>
                      MongoDB
                    </strong>

                    <span>
                      Required · You have verified evidence
                    </span>

                  </div>

                  <BadgeCheck size={14} />

                </div>


                <div className="requirement-row gap">

                  <Clock3 size={15} />

                  <div>

                    <strong>
                      TypeScript
                    </strong>

                    <span>
                      Required · Your current readiness is 64%
                    </span>

                  </div>

                  <Target size={14} />

                </div>


                <div className="requirement-row missing">

                  <XCircle size={15} />

                  <div>

                    <strong>
                      Docker
                    </strong>

                    <span>
                      Preferred · Limited evidence available
                    </span>

                  </div>

                  <Target size={14} />

                </div>

              </div>

            </section>


            {/* =================================================
                EXPERIENCE
                ================================================= */}

            <section className="job-details-panel">

              <span className="panel-label">
                EXPERIENCE
              </span>

              <p>
                3–5 years of professional software development
                experience with strong experience building
                modern web applications.
              </p>

              <p>
                Experience with cloud deployment, testing,
                CI/CD and scalable architecture is a plus.
              </p>

            </section>

          </div>


          {/* =================================================
              RIGHT
              ================================================= */}

          <aside className="job-details-right">


            {/* =================================================
                APPLY
                ================================================= */}

            <section className="job-apply-card">

              <div>

                <span className="panel-label">
                  YOUR FIT
                </span>

                <div className="apply-score">
                  94%
                </div>

                <strong>
                  Excellent match
                </strong>

                <p>
                  Your verified skills align strongly
                  with this role.
                </p>

              </div>


              <Link
                to="/candidate/applications"
                className="apply-job-button"
              >

                Apply for this role

                <ArrowRight size={15} />

              </Link>


              <span className="apply-note">
                Your verified skill profile will be shared
                with the recruiter.
              </span>

            </section>


            {/* =================================================
                MATCH BREAKDOWN
                ================================================= */}

            <section className="match-breakdown-card">

              <span className="panel-label">
                MATCH BREAKDOWN
              </span>


              <div className="match-breakdown-row">

                <div>

                  <span>
                    Verified skills
                  </span>

                  <strong>
                    3 / 3
                  </strong>

                </div>

                <CheckCircle2 size={14} />

              </div>


              <div className="match-breakdown-row">

                <div>

                  <span>
                    Skill gaps
                  </span>

                  <strong>
                    1 major
                  </strong>

                </div>

                <Target size={14} />

              </div>


              <div className="match-breakdown-row">

                <div>

                  <span>
                    Experience
                  </span>

                  <strong>
                    Strong
                  </strong>

                </div>

                <CheckCircle2 size={14} />

              </div>


              <div className="match-breakdown-row">

                <div>

                  <span>
                    Overall readiness
                  </span>

                  <strong>
                    80%
                  </strong>

                </div>

                <Target size={14} />

              </div>

            </section>


            {/* =================================================
                SKILL GAP
                ================================================= */}

            <section className="job-gap-action-card">

              <div className="job-gap-action-icon">
                <Target size={18} />
              </div>


              <span className="panel-label">
                BEFORE YOU APPLY
              </span>

              <h3>
                One skill could make you stronger.
              </h3>

              <p>
                TypeScript is frequently required for
                similar roles. Your current readiness is 64%.
              </p>


              <Link
                to="/candidate/learning"
              >

                Improve this skill

                <ArrowRight size={12} />

              </Link>

            </section>


          </aside>

        </div>


        {/* ===================================================
            PRINCIPLE
            =================================================== */}

        <section className="job-details-principle">

          <div className="job-details-principle-icon">
            <BadgeCheck size={21} />
          </div>


          <div>

            <span className="panel-label">
              PULSEHIRE DIFFERENCE
            </span>

            <h2>
              Your application carries evidence, not just claims.
            </h2>

            <p>
              When you apply through PulseHire, recruiters can
              see the skills you have demonstrated and the
              evidence supporting them. Skill gaps remain
              visible too — creating a more honest and useful
              hiring signal.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default JobDetails;