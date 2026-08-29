import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Target,
  User,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";


const Applications = () => {
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
              className="sidebar-link"
            >
              <BriefcaseBusiness size={17} />
              Find Jobs
            </Link>


            <Link
              to="/candidate/applications"
              className="sidebar-link active"
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
              APPLICATIONS
            </span>

            <h1>
              Track where your skills are taking you.
            </h1>

          </div>

        </header>


        {/* ===================================================
            APPLICATION SUMMARY
            =================================================== */}

        <section className="candidate-application-summary">

          <div className="candidate-application-stat">

            <span>
              TOTAL APPLICATIONS
            </span>

            <strong>
              7
            </strong>

            <small>
              submitted
            </small>

          </div>


          <div className="candidate-application-stat">

            <span>
              SHORTLISTED
            </span>

            <strong>
              2
            </strong>

            <small>
              moving forward
            </small>

          </div>


          <div className="candidate-application-stat">

            <span>
              UNDER REVIEW
            </span>

            <strong>
              3
            </strong>

            <small>
              recruiter reviewing
            </small>

          </div>


          <div className="candidate-application-stat">

            <span>
              INTERVIEWS
            </span>

            <strong>
              1
            </strong>

            <small>
              scheduled
            </small>

          </div>

        </section>


        {/* ===================================================
            ACTIVE APPLICATIONS
            =================================================== */}

        <section className="candidate-applications-section">

          <div className="candidate-section-heading">

            <div>

              <span className="panel-label">
                ACTIVE APPLICATIONS
              </span>

              <h2>
                Your current opportunities.
              </h2>

            </div>

          </div>


          <div className="candidate-application-list">


            {/* =================================================
                APPLICATION 1
                ================================================= */}

            <article className="candidate-application-card">

              <div className="application-company">

                <div className="application-company-icon">
                  TN
                </div>


                <div>

                  <h3>
                    Senior Full Stack Developer
                  </h3>

                  <p>
                    TechNova Systems · Bengaluru
                  </p>

                  <small>
                    Applied 2 days ago
                  </small>

                </div>

              </div>


              <div className="candidate-application-match">

                <span>
                  SKILL MATCH
                </span>

                <strong>
                  94%
                </strong>

                <small>
                  Excellent fit
                </small>

              </div>


              <div className="candidate-application-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span className="mini-skill">
                    React
                  </span>

                  <span className="mini-skill">
                    Node.js
                  </span>

                  <span className="mini-skill">
                    MongoDB
                  </span>

                </div>

              </div>


              <div className="candidate-application-status">

                <span className="status-badge review">

                  <Clock3 size={11} />

                  Under Review

                </span>

                <small>
                  Recruiter reviewing profile
                </small>

              </div>


              <Link
                to="/candidate/jobs/technova-full-stack"
                className="application-details-link"
              >

                Details

                <ArrowRight size={13} />

              </Link>

            </article>


            {/* =================================================
                APPLICATION 2
                ================================================= */}

            <article className="candidate-application-card shortlisted">

              <div className="application-company">

                <div className="application-company-icon">
                  PS
                </div>


                <div>

                  <h3>
                    Full Stack Engineer
                  </h3>

                  <p>
                    PixelStack · Remote
                  </p>

                  <small>
                    Applied 5 days ago
                  </small>

                </div>

              </div>


              <div className="candidate-application-match">

                <span>
                  SKILL MATCH
                </span>

                <strong>
                  89%
                </strong>

                <small>
                  Strong fit
                </small>

              </div>


              <div className="candidate-application-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span className="mini-skill">
                    React
                  </span>

                  <span className="mini-skill">
                    Node.js
                  </span>

                  <span className="mini-skill">
                    MongoDB
                  </span>

                </div>

              </div>


              <div className="candidate-application-status">

                <span className="status-badge shortlisted">

                  <CheckCircle2 size={11} />

                  Shortlisted

                </span>

                <small>
                  Recruiter wants to proceed
                </small>

              </div>


              <Link
                to="/candidate/jobs/pixelstack-full-stack"
                className="application-details-link"
              >

                Details

                <ArrowRight size={13} />

              </Link>

            </article>


            {/* =================================================
                APPLICATION 3
                ================================================= */}

            <article className="candidate-application-card">

              <div className="application-company">

                <div className="application-company-icon">
                  AC
                </div>


                <div>

                  <h3>
                    MERN Developer
                  </h3>

                  <p>
                    AppCore · Hyderabad
                  </p>

                  <small>
                    Applied 1 week ago
                  </small>

                </div>

              </div>


              <div className="candidate-application-match">

                <span>
                  SKILL MATCH
                </span>

                <strong>
                  84%
                </strong>

                <small>
                  Good fit
                </small>

              </div>


              <div className="candidate-application-skills">

                <span>
                  SKILL GAPS
                </span>

                <div>

                  <span className="mini-skill gap">
                    TypeScript
                  </span>

                  <span className="mini-skill gap">
                    Docker
                  </span>

                </div>

              </div>


              <div className="candidate-application-status">

                <span className="status-badge review">

                  <Clock3 size={11} />

                  Under Review

                </span>

                <small>
                  Application being evaluated
                </small>

              </div>


              <Link
                to="/candidate/jobs/mern-developer"
                className="application-details-link"
              >

                Details

                <ArrowRight size={13} />

              </Link>

            </article>


            {/* =================================================
                APPLICATION 4
                ================================================= */}

            <article className="candidate-application-card">

              <div className="application-company">

                <div className="application-company-icon">
                  DW
                </div>


                <div>

                  <h3>
                    React Developer
                  </h3>

                  <p>
                    DevWorks · Pune
                  </p>

                  <small>
                    Applied 2 weeks ago
                  </small>

                </div>

              </div>


              <div className="candidate-application-match">

                <span>
                  SKILL MATCH
                </span>

                <strong>
                  71%
                </strong>

                <small>
                  Moderate fit
                </small>

              </div>


              <div className="candidate-application-skills">

                <span>
                  SKILL GAP
                </span>

                <div>

                  <span className="mini-skill gap">
                    Testing
                  </span>

                  <span className="mini-skill gap">
                    TypeScript
                  </span>

                </div>

              </div>


              <div className="candidate-application-status">

                <span className="status-badge rejected">

                  <XCircle size={11} />

                  Not Selected

                </span>

                <small>
                  Another candidate selected
                </small>

              </div>


              <Link
                to="/candidate/jobs/react-developer"
                className="application-details-link"
              >

                Details

                <ArrowRight size={13} />

              </Link>

            </article>


          </div>

        </section>


        {/* ===================================================
            APPLICATION INSIGHT
            =================================================== */}

        <section className="application-insight-candidate">

          <div className="application-insight-candidate-icon">
            <Target size={20} />
          </div>


          <div>

            <span className="panel-label">
              APPLICATION INTELLIGENCE
            </span>

            <h2>
              Your strongest applications are skill-aligned.
            </h2>

            <p>
              Your applications with the highest verified
              skill match are currently receiving the strongest
              recruiter engagement. Closing your TypeScript
              and Docker gaps could improve your fit for
              additional opportunities.
            </p>


            <Link
              to="/candidate/skill-gap"
            >

              View your skill gaps

              <ArrowRight size={12} />

            </Link>

          </div>

        </section>


      </main>

    </div>
  );
};


export default Applications;