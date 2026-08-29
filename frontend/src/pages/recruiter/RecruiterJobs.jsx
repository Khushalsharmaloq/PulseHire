import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Edit3,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";


const RecruiterJobs = () => {
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
              className="sidebar-link active"
            >
              <BriefcaseBusiness size={17} />
              My Jobs
            </Link>


            <Link
              to="/recruiter/applications"
              className="sidebar-link"
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
              JOB MANAGEMENT
            </span>

            <h1>
              Your hiring pipeline starts here.
            </h1>

          </div>


          <Link
            to="/recruiter/jobs/create"
            className="recruiter-create-button"
          >

            <Plus size={14} />

            Post a Job

          </Link>

        </header>


        {/* ===================================================
            JOB SUMMARY
            =================================================== */}

        <section className="recruiter-summary">

          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <BriefcaseBusiness size={16} />
            </div>

            <span>
              ACTIVE
            </span>

            <strong>
              4
            </strong>

            <small>
              jobs currently hiring
            </small>

          </div>


          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <Edit3 size={16} />
            </div>

            <span>
              DRAFTS
            </span>

            <strong>
              2
            </strong>

            <small>
              waiting to publish
            </small>

          </div>


          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <Users size={16} />
            </div>

            <span>
              APPLICANTS
            </span>

            <strong>
              86
            </strong>

            <small>
              across active jobs
            </small>

          </div>


          <div className="recruiter-stat">

            <div className="recruiter-stat-icon">
              <Target size={16} />
            </div>

            <span>
              STRONG MATCHES
            </span>

            <strong>
              23
            </strong>

            <small>
              above 80% fit
            </small>

          </div>

        </section>


        {/* ===================================================
            SEARCH + FILTER
            =================================================== */}

        <section className="recruiter-job-toolbar">

          <div className="recruiter-job-search">

            <Search size={14} />

            <input
              type="text"
              placeholder="Search your jobs..."
            />

          </div>


          <div className="recruiter-job-tabs">

            <button
              className="job-tab active"
              type="button"
            >
              All
            </button>


            <button
              className="job-tab"
              type="button"
            >
              Active
            </button>


            <button
              className="job-tab"
              type="button"
            >
              Drafts
            </button>


            <button
              className="job-tab"
              type="button"
            >
              Closed
            </button>

          </div>

        </section>


        {/* ===================================================
            ACTIVE JOBS
            =================================================== */}

        <section className="recruiter-jobs-section">

          <div className="recruiter-panel-heading">

            <div>

              <span className="panel-label">
                YOUR JOBS
              </span>

              <h2>
                Open positions.
              </h2>

            </div>


            <span className="recruiter-jobs-count">
              4 active
            </span>

          </div>


          <div className="recruiter-full-job-list">


            {/* =================================================
                JOB 1
                ================================================= */}

            <article className="recruiter-full-job-card">

              <div className="recruiter-full-job-header">

                <div className="recruiter-full-job-identity">

                  <div className="recruiter-job-icon large">
                    FS
                  </div>


                  <div>

                    <div className="recruiter-full-job-title">

                      <h3>
                        Senior Full Stack Developer
                      </h3>

                      <span className="full-job-status active">
                        Active
                      </span>

                    </div>


                    <p>
                      Bengaluru · Full-time · 3–5 years
                    </p>

                    <small>
                      Posted 2 days ago
                    </small>

                  </div>

                </div>


                <button
                  className="job-more-button"
                  type="button"
                >

                  <MoreHorizontal size={16} />

                </button>

              </div>


              <div className="recruiter-full-job-stats">

                <div>

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    32
                  </strong>

                </div>


                <div>

                  <span>
                    STRONG MATCHES
                  </span>

                  <strong>
                    11
                  </strong>

                </div>


                <div>

                  <span>
                    VERIFIED
                  </span>

                  <strong>
                    24
                  </strong>

                </div>


                <div>

                  <span>
                    MATCH RATE
                  </span>

                  <strong>
                    34%
                  </strong>

                </div>

              </div>


              <div className="recruiter-full-job-skills">

                <span>
                  REQUIRED SKILLS
                </span>

                <div>

                  <span>
                    React
                  </span>

                  <span>
                    Node.js
                  </span>

                  <span>
                    MongoDB
                  </span>

                  <span>
                    TypeScript
                  </span>

                  <span>
                    Docker
                  </span>

                </div>

              </div>


              <div className="recruiter-full-job-footer">

                <div className="verification-coverage">

                  <BadgeCheck size={13} />

                  <span>
                    75% of applicants have verified evidence
                  </span>

                </div>


                <Link
                  to="/recruiter/applications"
                >

                  Review applicants

                  <ArrowRight size={12} />

                </Link>

              </div>

            </article>


            {/* =================================================
                JOB 2
                ================================================= */}

            <article className="recruiter-full-job-card">

              <div className="recruiter-full-job-header">

                <div className="recruiter-full-job-identity">

                  <div className="recruiter-job-icon large">
                    RE
                  </div>


                  <div>

                    <div className="recruiter-full-job-title">

                      <h3>
                        React Engineer
                      </h3>

                      <span className="full-job-status active">
                        Active
                      </span>

                    </div>


                    <p>
                      Remote · Full-time · 2–4 years
                    </p>

                    <small>
                      Posted 5 days ago
                    </small>

                  </div>

                </div>


                <button
                  className="job-more-button"
                  type="button"
                >

                  <MoreHorizontal size={16} />

                </button>

              </div>


              <div className="recruiter-full-job-stats">

                <div>

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    24
                  </strong>

                </div>


                <div>

                  <span>
                    STRONG MATCHES
                  </span>

                  <strong>
                    7
                  </strong>

                </div>


                <div>

                  <span>
                    VERIFIED
                  </span>

                  <strong>
                    19
                  </strong>

                </div>


                <div>

                  <span>
                    MATCH RATE
                  </span>

                  <strong>
                    29%
                  </strong>

                </div>

              </div>


              <div className="recruiter-full-job-skills">

                <span>
                  REQUIRED SKILLS
                </span>

                <div>

                  <span>
                    React
                  </span>

                  <span>
                    TypeScript
                  </span>

                  <span>
                    Testing
                  </span>

                  <span>
                    JavaScript
                  </span>

                </div>

              </div>


              <div className="recruiter-full-job-footer">

                <div className="verification-coverage">

                  <BadgeCheck size={13} />

                  <span>
                    79% of applicants have verified evidence
                  </span>

                </div>


                <Link
                  to="/recruiter/applications"
                >

                  Review applicants

                  <ArrowRight size={12} />

                </Link>

              </div>

            </article>


            {/* =================================================
                JOB 3
                ================================================= */}

            <article className="recruiter-full-job-card">

              <div className="recruiter-full-job-header">

                <div className="recruiter-full-job-identity">

                  <div className="recruiter-job-icon large">
                    BE
                  </div>


                  <div>

                    <div className="recruiter-full-job-title">

                      <h3>
                        Backend Engineer
                      </h3>

                      <span className="full-job-status active">
                        Active
                      </span>

                    </div>


                    <p>
                      Hyderabad · Full-time · 2–4 years
                    </p>

                    <small>
                      Posted 1 week ago
                    </small>

                  </div>

                </div>


                <button
                  className="job-more-button"
                  type="button"
                >

                  <MoreHorizontal size={16} />

                </button>

              </div>


              <div className="recruiter-full-job-stats">

                <div>

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    18
                  </strong>

                </div>


                <div>

                  <span>
                    STRONG MATCHES
                  </span>

                  <strong>
                    4
                  </strong>

                </div>


                <div>

                  <span>
                    VERIFIED
                  </span>

                  <strong>
                    12
                  </strong>

                </div>


                <div>

                  <span>
                    MATCH RATE
                  </span>

                  <strong>
                    22%
                  </strong>

                </div>

              </div>


              <div className="recruiter-full-job-skills">

                <span>
                  REQUIRED SKILLS
                </span>

                <div>

                  <span>
                    Node.js
                  </span>

                  <span>
                    MongoDB
                  </span>

                  <span>
                    Express
                  </span>

                  <span>
                    Docker
                  </span>

                </div>

              </div>


              <div className="recruiter-full-job-footer">

                <div className="verification-coverage">

                  <BadgeCheck size={13} />

                  <span>
                    67% of applicants have verified evidence
                  </span>

                </div>


                <Link
                  to="/recruiter/applications"
                >

                  Review applicants

                  <ArrowRight size={12} />

                </Link>

              </div>

            </article>


            {/* =================================================
                JOB 4
                ================================================= */}

            <article className="recruiter-full-job-card">

              <div className="recruiter-full-job-header">

                <div className="recruiter-full-job-identity">

                  <div className="recruiter-job-icon large">
                    FE
                  </div>


                  <div>

                    <div className="recruiter-full-job-title">

                      <h3>
                        Frontend Developer
                      </h3>

                      <span className="full-job-status active">
                        Active
                      </span>

                    </div>


                    <p>
                      Bengaluru · Full-time · 1–3 years
                    </p>

                    <small>
                      Posted 2 weeks ago
                    </small>

                  </div>

                </div>


                <button
                  className="job-more-button"
                  type="button"
                >

                  <MoreHorizontal size={16} />

                </button>

              </div>


              <div className="recruiter-full-job-stats">

                <div>

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    12
                  </strong>

                </div>


                <div>

                  <span>
                    STRONG MATCHES
                  </span>

                  <strong>
                    1
                  </strong>

                </div>


                <div>

                  <span>
                    VERIFIED
                  </span>

                  <strong>
                    6
                  </strong>

                </div>


                <div>

                  <span>
                    MATCH RATE
                  </span>

                  <strong>
                    8%
                  </strong>

                </div>

              </div>


              <div className="recruiter-full-job-skills">

                <span>
                  REQUIRED SKILLS
                </span>

                <div>

                  <span>
                    React
                  </span>

                  <span>
                    JavaScript
                  </span>

                  <span>
                    CSS
                  </span>

                  <span>
                    Testing
                  </span>

                </div>

              </div>


              <div className="recruiter-full-job-footer">

                <div className="verification-coverage">

                  <BadgeCheck size={13} />

                  <span>
                    50% of applicants have verified evidence
                  </span>

                </div>


                <Link
                  to="/recruiter/applications"
                >

                  Review applicants

                  <ArrowRight size={12} />

                </Link>

              </div>

            </article>


          </div>

        </section>


        {/* ===================================================
            DRAFTS
            =================================================== */}

        <section className="recruiter-drafts-section">

          <div className="recruiter-panel-heading">

            <div>

              <span className="panel-label">
                DRAFTS
              </span>

              <h2>
                Jobs waiting to be published.
              </h2>

            </div>

          </div>


          <div className="recruiter-draft-grid">


            <article className="recruiter-draft-card">

              <div className="draft-icon">
                FE
              </div>


              <div>

                <h3>
                  Frontend Team Lead
                </h3>

                <p>
                  4 skills defined
                </p>

              </div>


              <Link
                to="/recruiter/jobs/create"
              >

                <Edit3 size={12} />

                Continue

              </Link>

            </article>


            <article className="recruiter-draft-card">

              <div className="draft-icon">
                FS
              </div>


              <div>

                <h3>
                  Full Stack Intern
                </h3>

                <p>
                  3 skills defined
                </p>

              </div>


              <Link
                to="/recruiter/jobs/create"
              >

                <Edit3 size={12} />

                Continue

              </Link>

            </article>

          </div>

        </section>


        {/* ===================================================
            INSIGHT
            =================================================== */}

        <section className="recruiter-insight">

          <div className="recruiter-insight-icon">
            <Target size={21} />
          </div>


          <div>

            <span className="panel-label">
              HIRING INSIGHT
            </span>

            <h2>
              Your strongest pipeline starts with clear skill requirements.
            </h2>

            <p>
              Define the skills that actually matter for each
              role. PulseHire can then compare candidates against
              those requirements using verified evidence instead
              of relying only on resume keywords.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default RecruiterJobs;