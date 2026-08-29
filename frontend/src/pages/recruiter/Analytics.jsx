import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Target,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";


const Analytics = () => {
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
              <CheckCircle2 size={17} />
              Verification
            </Link>


            <Link
              to="/recruiter/analytics"
              className="sidebar-link active"
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

        <header className="analytics-header">

          <div>

            <span className="dashboard-eyebrow">
              RECRUITMENT ANALYTICS
            </span>

            <h1>
              Hiring performance.
            </h1>

            <p>
              Understand how your jobs, candidates, and
              skill requirements are performing.
            </p>

          </div>


          <div className="analytics-period">

            <span>
              PERIOD
            </span>

            <strong>
              Last 30 days
            </strong>

          </div>

        </header>


        {/* ===================================================
            OVERVIEW
            =================================================== */}

        <section className="analytics-stats">

          <div className="analytics-stat-card">

            <div className="analytics-stat-top">

              <span>
                ACTIVE JOBS
              </span>

              <BriefcaseBusiness size={15} />

            </div>

            <strong>
              8
            </strong>

            <div className="analytics-change positive">

              <ArrowUpRight size={11} />

              14%

              <span>
                vs previous period
              </span>

            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="analytics-stat-top">

              <span>
                APPLICATIONS
              </span>

              <FileCheck2 size={15} />

            </div>

            <strong>
              126
            </strong>

            <div className="analytics-change positive">

              <ArrowUpRight size={11} />

              22%

              <span>
                vs previous period
              </span>

            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="analytics-stat-top">

              <span>
                QUALIFIED CANDIDATES
              </span>

              <Users size={15} />

            </div>

            <strong>
              34
            </strong>

            <div className="analytics-change positive">

              <ArrowUpRight size={11} />

              18%

              <span>
                vs previous period
              </span>

            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="analytics-stat-top">

              <span>
                AVG. TIME TO REVIEW
              </span>

              <Clock3 size={15} />

            </div>

            <strong>
              2.4d
            </strong>

            <div className="analytics-change negative">

              <ArrowDownRight size={11} />

              12%

              <span>
                faster than before
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            MAIN ANALYTICS GRID
            =================================================== */}

        <div className="analytics-grid">


          {/* =================================================
              APPLICATION FUNNEL
              ================================================= */}

          <section className="analytics-panel">

            <div className="analytics-panel-header">

              <div>

                <span className="panel-label">
                  APPLICATION FUNNEL
                </span>

                <h2>
                  Candidate progression
                </h2>

              </div>

              <BarChart3 size={17} />

            </div>


            <div className="funnel-list">

              <div className="funnel-row">

                <div className="funnel-label">

                  <span>
                    Applications
                  </span>

                  <strong>
                    126
                  </strong>

                </div>

                <div className="funnel-bar">

                  <div
                    className="funnel-fill"
                    style={{ width: "100%" }}
                  />

                </div>

              </div>


              <div className="funnel-row">

                <div className="funnel-label">

                  <span>
                    Shortlisted
                  </span>

                  <strong>
                    58
                  </strong>

                </div>

                <div className="funnel-bar">

                  <div
                    className="funnel-fill"
                    style={{ width: "72%" }}
                  />

                </div>

              </div>


              <div className="funnel-row">

                <div className="funnel-label">

                  <span>
                    Interview
                  </span>

                  <strong>
                    31
                  </strong>

                </div>

                <div className="funnel-bar">

                  <div
                    className="funnel-fill"
                    style={{ width: "48%" }}
                  />

                </div>

              </div>


              <div className="funnel-row">

                <div className="funnel-label">

                  <span>
                    Offer
                  </span>

                  <strong>
                    9
                  </strong>

                </div>

                <div className="funnel-bar">

                  <div
                    className="funnel-fill"
                    style={{ width: "28%" }}
                  />

                </div>

              </div>


              <div className="funnel-row">

                <div className="funnel-label">

                  <span>
                    Hired
                  </span>

                  <strong>
                    6
                  </strong>

                </div>

                <div className="funnel-bar">

                  <div
                    className="funnel-fill"
                    style={{ width: "19%" }}
                  />

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              SKILL DEMAND
              ================================================= */}

          <section className="analytics-panel">

            <div className="analytics-panel-header">

              <div>

                <span className="panel-label">
                  SKILL DEMAND
                </span>

                <h2>
                  Most requested skills
                </h2>

              </div>

              <Target size={17} />

            </div>


            <div className="skill-demand-list">

              <div className="skill-demand-row">

                <div>

                  <strong>
                    React
                  </strong>

                  <span>
                    78% of active jobs
                  </span>

                </div>

                <strong>
                  24
                </strong>

              </div>


              <div className="skill-demand-row">

                <div>

                  <strong>
                    Node.js
                  </strong>

                  <span>
                    64% of active jobs
                  </span>

                </div>

                <strong>
                  19
                </strong>

              </div>


              <div className="skill-demand-row">

                <div>

                  <strong>
                    TypeScript
                  </strong>

                  <span>
                    52% of active jobs
                  </span>

                </div>

                <strong>
                  15
                </strong>

              </div>


              <div className="skill-demand-row">

                <div>

                  <strong>
                    MongoDB
                  </strong>

                  <span>
                    43% of active jobs
                  </span>

                </div>

                <strong>
                  12
                </strong>

              </div>


              <div className="skill-demand-row">

                <div>

                  <strong>
                    AWS
                  </strong>

                  <span>
                    31% of active jobs
                  </span>

                </div>

                <strong>
                  9
                </strong>

              </div>

            </div>

          </section>

        </div>


        {/* ===================================================
            LOWER GRID
            =================================================== */}

        <div className="analytics-lower-grid">


          {/* =================================================
              TOP JOBS
              ================================================= */}

          <section className="analytics-panel">

            <div className="analytics-panel-header">

              <div>

                <span className="panel-label">
                  JOB PERFORMANCE
                </span>

                <h2>
                  Top performing roles
                </h2>

              </div>


              <Link to="/recruiter/jobs">

                View all

                <ChevronRight size={13} />

              </Link>

            </div>


            <div className="job-performance-list">

              <div className="job-performance-row">

                <div className="job-performance-number">
                  01
                </div>

                <div>

                  <strong>
                    Senior Full Stack Developer
                  </strong>

                  <span>
                    42 applications · 12 shortlisted
                  </span>

                </div>

                <div className="job-performance-score">
                  86%
                </div>

              </div>


              <div className="job-performance-row">

                <div className="job-performance-number">
                  02
                </div>

                <div>

                  <strong>
                    Frontend Engineer
                  </strong>

                  <span>
                    31 applications · 9 shortlisted
                  </span>

                </div>

                <div className="job-performance-score">
                  79%
                </div>

              </div>


              <div className="job-performance-row">

                <div className="job-performance-number">
                  03
                </div>

                <div>

                  <strong>
                    Backend Developer
                  </strong>

                  <span>
                    24 applications · 7 shortlisted
                  </span>

                </div>

                <div className="job-performance-score">
                  72%
                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              VERIFICATION IMPACT
              ================================================= */}

          <section className="analytics-panel verification-impact">

            <div className="analytics-panel-header">

              <div>

                <span className="panel-label">
                  VERIFIED SKILL IMPACT
                </span>

                <h2>
                  Better candidate signals
                </h2>

              </div>

              <CheckCircle2 size={17} />

            </div>


            <div className="impact-score">

              <strong>
                84%
              </strong>

              <span>
                of shortlisted candidates have
                at least 3 verified skills.
              </span>

            </div>


            <div className="impact-row">

              <span>
                Verified candidates
              </span>

              <strong>
                2.4×
              </strong>

            </div>


            <div className="impact-row">

              <span>
                Faster screening
              </span>

              <strong>
                31%
              </strong>

            </div>


            <div className="impact-row">

              <span>
                Better skill match
              </span>

              <strong>
                27%
              </strong>

            </div>

          </section>

        </div>


        {/* ===================================================
            INSIGHT
            =================================================== */}

        <section className="analytics-insight">

          <div className="analytics-insight-icon">
            <Target size={19} />
          </div>


          <div>

            <span className="panel-label">
              PULSEHIRE INSIGHT
            </span>

            <h2>
              Verified skills are improving your shortlist quality.
            </h2>

            <p>
              Candidates with verified technical evidence are
              progressing through your hiring funnel faster than
              candidates relying only on resume claims.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default Analytics;