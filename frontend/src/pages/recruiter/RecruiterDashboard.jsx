import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Plus,
  Target,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";


const RecruiterDashboard = () => {
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
              className="sidebar-link active"
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
            TOP BAR
            =================================================== */}

        <header className="recruiter-topbar">

          <div>

            <span className="dashboard-eyebrow">
              RECRUITER WORKSPACE
            </span>

            <h1>
              Good morning, TechNova.
            </h1>

          </div>


          <div className="recruiter-top-actions">

            <button
              className="recruiter-notification"
              type="button"
            >

              <Bell size={16} />

              <span></span>

            </button>


            <Link
              to="/recruiter/jobs/create"
              className="recruiter-create-button"
            >

              <Plus size={14} />

              Post a Job

            </Link>

          </div>

        </header>


        {/* ===================================================
            SUMMARY
            =================================================== */}

        <section className="recruiter-summary">

          <Link
            to="/recruiter/jobs"
            className="recruiter-stat"
          >

            <div className="recruiter-stat-icon">
              <BriefcaseBusiness size={16} />
            </div>

            <span>
              ACTIVE JOBS
            </span>

            <strong>
              4
            </strong>

            <small>
              currently hiring
            </small>

          </Link>


          <Link
            to="/recruiter/candidates"
            className="recruiter-stat"
          >

            <div className="recruiter-stat-icon">
              <Users size={16} />
            </div>

            <span>
              CANDIDATES
            </span>

            <strong>
              86
            </strong>

            <small>
              total applicants
            </small>

          </Link>


          <Link
            to="/recruiter/verification"
            className="recruiter-stat"
          >

            <div className="recruiter-stat-icon">
              <BadgeCheck size={16} />
            </div>

            <span>
              VERIFIED
            </span>

            <strong>
              61
            </strong>

            <small>
              skill profiles
            </small>

          </Link>


          <Link
            to="/recruiter/candidates"
            className="recruiter-stat"
          >

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
              above 80% match
            </small>

          </Link>

        </section>


        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <div className="recruiter-dashboard-grid">


          {/* =================================================
              JOB PERFORMANCE
              ================================================= */}

          <section className="recruiter-dashboard-panel">

            <div className="recruiter-panel-heading">

              <div>

                <span className="panel-label">
                  JOB PERFORMANCE
                </span>

                <h2>
                  Your active roles.
                </h2>

              </div>


              <Link to="/recruiter/jobs">

                View all

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="recruiter-job-list">


              {/* JOB 1 */}

              <article className="recruiter-job-row">

                <div className="recruiter-job-icon">
                  FS
                </div>


                <div className="recruiter-job-info">

                  <h3>
                    Senior Full Stack Developer
                  </h3>

                  <span>
                    Bengaluru · Full-time
                  </span>

                </div>


                <div className="recruiter-job-metric">

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    32
                  </strong>

                </div>


                <div className="recruiter-job-metric">

                  <span>
                    STRONG MATCH
                  </span>

                  <strong>
                    11
                  </strong>

                </div>


                <span className="job-active-status">
                  Active
                </span>

              </article>


              {/* JOB 2 */}

              <article className="recruiter-job-row">

                <div className="recruiter-job-icon">
                  RE
                </div>


                <div className="recruiter-job-info">

                  <h3>
                    React Engineer
                  </h3>

                  <span>
                    Remote · Full-time
                  </span>

                </div>


                <div className="recruiter-job-metric">

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    24
                  </strong>

                </div>


                <div className="recruiter-job-metric">

                  <span>
                    STRONG MATCH
                  </span>

                  <strong>
                    7
                  </strong>

                </div>


                <span className="job-active-status">
                  Active
                </span>

              </article>


              {/* JOB 3 */}

              <article className="recruiter-job-row">

                <div className="recruiter-job-icon">
                  BE
                </div>


                <div className="recruiter-job-info">

                  <h3>
                    Backend Engineer
                  </h3>

                  <span>
                    Hyderabad · Full-time
                  </span>

                </div>


                <div className="recruiter-job-metric">

                  <span>
                    APPLICANTS
                  </span>

                  <strong>
                    18
                  </strong>

                </div>


                <div className="recruiter-job-metric">

                  <span>
                    STRONG MATCH
                  </span>

                  <strong>
                    4
                  </strong>

                </div>


                <span className="job-active-status">
                  Active
                </span>

              </article>


            </div>

          </section>


          {/* =================================================
              CANDIDATE SIGNAL
              ================================================= */}

          <section className="recruiter-dashboard-panel recruiter-signal-panel">

            <div className="recruiter-panel-heading">

              <div>

                <span className="panel-label">
                  CANDIDATE SIGNAL
                </span>

                <h2>
                  Skill verification.
                </h2>

              </div>

            </div>


            <div className="signal-score">

              <div className="signal-circle">
                71%
              </div>

              <div>

                <strong>
                  Applicants with verified skills
                </strong>

                <p>
                  Most of your strongest applicants
                  have evidence-backed profiles.
                </p>

              </div>

            </div>


            <div className="signal-bar">

              <div
                style={{ width: "71%" }}
              ></div>

            </div>


            <div className="signal-breakdown">

              <Link to="/recruiter/verification">

                <span>
                  Verified
                </span>

                <strong>
                  61
                </strong>

              </Link>


              <Link to="/recruiter/verification">

                <span>
                  Pending
                </span>

                <strong>
                  17
                </strong>

              </Link>


              <Link to="/recruiter/verification">

                <span>
                  Unverified
                </span>

                <strong>
                  8
                </strong>

              </Link>

            </div>

          </section>


        </div>


        {/* ===================================================
            TOP CANDIDATES
            =================================================== */}

        <section className="recruiter-dashboard-panel recruiter-candidates-panel">

          <div className="recruiter-panel-heading">

            <div>

              <span className="panel-label">
                TOP CANDIDATES
              </span>

              <h2>
                Candidates worth reviewing.
              </h2>

            </div>


            <Link to="/recruiter/candidates">

              Explore candidates

              <ArrowRight size={12} />

            </Link>

          </div>


          <div className="recruiter-candidate-table">


            {/* HEADER */}

            <div className="recruiter-candidate-table-header">

              <span>
                CANDIDATE
              </span>

              <span>
                ROLE
              </span>

              <span>
                MATCH
              </span>

              <span>
                VERIFIED SKILLS
              </span>

              <span>
                STATUS
              </span>

              <span></span>

            </div>


            {/* CANDIDATE 1 */}

            <div className="recruiter-candidate-row">

              <div className="recruiter-candidate-name">

                <div className="candidate-table-avatar">
                  AK
                </div>

                <div>

                  <strong>
                    Arjun Kumar
                  </strong>

                  <span>
                    Full Stack Developer
                  </span>

                </div>

              </div>


              <span>
                Senior Full Stack
              </span>


              <strong className="candidate-match">
                94%
              </strong>


              <div className="table-skills">

                <span>
                  React ✓
                </span>

                <span>
                  Node ✓
                </span>

                <span>
                  Mongo ✓
                </span>

              </div>


              <span className="candidate-status verified">
                Verified
              </span>


              <Link to="/recruiter/candidates/arjun">

                View

                <ArrowRight size={11} />

              </Link>

            </div>


            {/* CANDIDATE 2 */}

            <div className="recruiter-candidate-row">

              <div className="recruiter-candidate-name">

                <div className="candidate-table-avatar">
                  RS
                </div>

                <div>

                  <strong>
                    Riya Sharma
                  </strong>

                  <span>
                    Frontend Developer
                  </span>

                </div>

              </div>


              <span>
                React Engineer
              </span>


              <strong className="candidate-match">
                91%
              </strong>


              <div className="table-skills">

                <span>
                  React ✓
                </span>

                <span>
                  TS ✓
                </span>

                <span>
                  Testing ✓
                </span>

              </div>


              <span className="candidate-status verified">
                Verified
              </span>


              <Link to="/recruiter/candidates/riya">

                View

                <ArrowRight size={11} />

              </Link>

            </div>


            {/* CANDIDATE 3 */}

            <div className="recruiter-candidate-row">

              <div className="recruiter-candidate-name">

                <div className="candidate-table-avatar">
                  VM
                </div>

                <div>

                  <strong>
                    Vikram Mehta
                  </strong>

                  <span>
                    Backend Developer
                  </span>

                </div>

              </div>


              <span>
                Backend Engineer
              </span>


              <strong className="candidate-match">
                87%
              </strong>


              <div className="table-skills">

                <span>
                  Node ✓
                </span>

                <span>
                  Mongo ✓
                </span>

                <span>
                  Docker ✓
                </span>

              </div>


              <span className="candidate-status pending">
                Review
              </span>


              <Link to="/recruiter/candidates/vikram">

                View

                <ArrowRight size={11} />

              </Link>

            </div>


          </div>

        </section>


        {/* ===================================================
            RECRUITER INSIGHT
            =================================================== */}

        <section className="recruiter-insight">

          <div className="recruiter-insight-icon">
            <BadgeCheck size={21} />
          </div>


          <div>

            <span className="panel-label">
              PULSEHIRE RECRUITER SIGNAL
            </span>

            <h2>
              Review evidence, not just resumes.
            </h2>

            <p>
              PulseHire surfaces candidates based on their
              demonstrated skills, verification status and
              role-specific fit — helping recruiters spend
              less time filtering claims and more time
              evaluating relevant talent.
            </p>

          </div>


          <Link to="/recruiter/candidates">

            Review candidates

            <ArrowRight size={12} />

          </Link>

        </section>


      </main>

    </div>
  );
};


export default RecruiterDashboard;