import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Target,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";


const RecruiterCandidateDetails = () => {
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
            BACK
            =================================================== */}

        <Link
          to="/recruiter/applications"
          className="candidate-details-back"
        >

          <ArrowLeft size={13} />

          Back to applications

        </Link>


        {/* ===================================================
            CANDIDATE HEADER
            =================================================== */}

        <section className="candidate-details-header">

          <div className="candidate-details-identity">

            <div className="candidate-details-avatar">
              AK
            </div>


            <div>

              <div className="candidate-details-name">

                <h1>
                  Arjun Kumar
                </h1>

                <span className="candidate-verified-badge">

                  <BadgeCheck size={11} />

                  Verified Profile

                </span>

              </div>


              <p>
                Full Stack Developer · 3 years experience
              </p>


              <div className="candidate-details-meta">

                <span>

                  <MapPin size={11} />

                  Bengaluru

                </span>


                <span>

                  <Mail size={11} />

                  arjun.k@example.com

                </span>


                <span>

                  <Code2 size={11} />

                  GitHub connected

                </span>

              </div>

            </div>

          </div>


          <div className="candidate-header-actions">

            <span className="application-status-badge review">
              Under Review
            </span>


            <button
              className="reject-candidate-button"
              type="button"
            >
              Reject
            </button>


            <button
              className="shortlist-candidate-button"
              type="button"
            >

              Shortlist

              <ArrowRight size={12} />

            </button>

          </div>

        </section>


        {/* ===================================================
            MATCH OVERVIEW
            =================================================== */}

        <section className="candidate-match-overview">

          <div className="candidate-match-score">

            <span>
              PULSEHIRE MATCH
            </span>

            <strong>
              94%
            </strong>

            <small>
              Excellent fit for this role
            </small>

          </div>


          <div className="candidate-match-breakdown">


            <div>

              <span>
                REQUIRED SKILLS
              </span>

              <strong>
                3 / 3
              </strong>

              <small>
                all verified
              </small>

            </div>


            <div>

              <span>
                PREFERRED SKILLS
              </span>

              <strong>
                1 / 1
              </strong>

              <small>
                partially demonstrated
              </small>

            </div>


            <div>

              <span>
                EVIDENCE STRENGTH
              </span>

              <strong>
                91%
              </strong>

              <small>
                strong evidence
              </small>

            </div>


            <div>

              <span>
                APPLICATION
              </span>

              <strong>
                2h ago
              </strong>

              <small>
                submitted today
              </small>

            </div>

          </div>

        </section>


        {/* ===================================================
            MAIN GRID
            =================================================== */}

        <div className="candidate-details-grid">


          {/* =================================================
              LEFT
              ================================================= */}

          <div className="candidate-details-main">


            {/* =================================================
                VERIFIED SKILLS
                ================================================= */}

            <section className="candidate-details-panel">

              <div className="candidate-panel-heading">

                <div>

                  <span className="panel-label">
                    VERIFIED SKILLS
                  </span>

                  <h2>
                    Skills backed by evidence.
                  </h2>

                  <p>
                    These skills have supporting evidence from
                    the candidate's connected projects and work.
                  </p>

                </div>


                <BadgeCheck size={17} />

              </div>


              <div className="candidate-skill-evidence-list">


                {/* REACT */}

                <article className="candidate-skill-evidence">

                  <div className="candidate-skill-status verified">

                    <BadgeCheck size={17} />

                  </div>


                  <div className="candidate-skill-info">

                    <div className="candidate-skill-title">

                      <h3>
                        React
                      </h3>

                      <span>
                        Required
                      </span>

                    </div>


                    <p>
                      Demonstrated through 4 projects and
                      recent code contributions.
                    </p>


                    <div className="evidence-tags">

                      <span>
                        4 Projects
                      </span>

                      <span>
                        GitHub Evidence
                      </span>

                      <span>
                        Recent Activity
                      </span>

                    </div>

                  </div>


                  <div className="skill-confidence">

                    <span>
                      CONFIDENCE
                    </span>

                    <strong>
                      96%
                    </strong>

                  </div>


                  <button
                    className="evidence-view-button"
                    type="button"
                  >

                    View

                    <ChevronRight size={11} />

                  </button>

                </article>


                {/* NODE */}

                <article className="candidate-skill-evidence">

                  <div className="candidate-skill-status verified">

                    <BadgeCheck size={17} />

                  </div>


                  <div className="candidate-skill-info">

                    <div className="candidate-skill-title">

                      <h3>
                        Node.js
                      </h3>

                      <span>
                        Required
                      </span>

                    </div>


                    <p>
                      Demonstrated through backend projects,
                      APIs and production-style applications.
                    </p>


                    <div className="evidence-tags">

                      <span>
                        3 Projects
                      </span>

                      <span>
                        API Evidence
                      </span>

                      <span>
                        GitHub Evidence
                      </span>

                    </div>

                  </div>


                  <div className="skill-confidence">

                    <span>
                      CONFIDENCE
                    </span>

                    <strong>
                      93%
                    </strong>

                  </div>


                  <button
                    className="evidence-view-button"
                    type="button"
                  >

                    View

                    <ChevronRight size={11} />

                  </button>

                </article>


                {/* MONGODB */}

                <article className="candidate-skill-evidence">

                  <div className="candidate-skill-status verified">

                    <BadgeCheck size={17} />

                  </div>


                  <div className="candidate-skill-info">

                    <div className="candidate-skill-title">

                      <h3>
                        MongoDB
                      </h3>

                      <span>
                        Required
                      </span>

                    </div>


                    <p>
                      Demonstrated through data-driven projects
                      and database integration.
                    </p>


                    <div className="evidence-tags">

                      <span>
                        3 Projects
                      </span>

                      <span>
                        Database Evidence
                      </span>

                    </div>

                  </div>


                  <div className="skill-confidence">

                    <span>
                      CONFIDENCE
                    </span>

                    <strong>
                      89%
                    </strong>

                  </div>


                  <button
                    className="evidence-view-button"
                    type="button"
                  >

                    View

                    <ChevronRight size={11} />

                  </button>

                </article>


                {/* TYPESCRIPT */}

                <article className="candidate-skill-evidence partial">

                  <div className="candidate-skill-status partial">

                    <Target size={17} />

                  </div>


                  <div className="candidate-skill-info">

                    <div className="candidate-skill-title">

                      <h3>
                        TypeScript
                      </h3>

                      <span>
                        Preferred
                      </span>

                    </div>


                    <p>
                      Some evidence found, but additional
                      experience would strengthen the profile.
                    </p>


                    <div className="evidence-tags">

                      <span>
                        1 Project
                      </span>

                      <span>
                        Partial Evidence
                      </span>

                    </div>

                  </div>


                  <div className="skill-confidence partial">

                    <span>
                      READINESS
                    </span>

                    <strong>
                      64%
                    </strong>

                  </div>


                  <button
                    className="evidence-view-button"
                    type="button"
                  >

                    View

                    <ChevronRight size={11} />

                  </button>

                </article>

              </div>

            </section>


            {/* =================================================
                PROJECT EVIDENCE
                ================================================= */}

            <section className="candidate-details-panel">

              <div className="candidate-panel-heading">

                <div>

                  <span className="panel-label">
                    PROJECT EVIDENCE
                  </span>

                  <h2>
                    Demonstrated through real work.
                  </h2>

                </div>

              </div>


              <div className="candidate-project-list">


                <article className="candidate-project">

                  <div className="project-icon">
                    FS
                  </div>


                  <div className="project-content">

                    <h3>
                      TaskFlow — Team Productivity Platform
                    </h3>

                    <p>
                      Full-stack collaboration platform with
                      authentication, task management and REST APIs.
                    </p>


                    <div className="project-skills">

                      <span>
                        React
                      </span>

                      <span>
                        Node.js
                      </span>

                      <span>
                        MongoDB
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="candidate-project-view"
                  >

                    View

                    <ArrowRight size={11} />

                  </button>

                </article>


                <article className="candidate-project">

                  <div className="project-icon">
                    EC
                  </div>


                  <div className="project-content">

                    <h3>
                      ShopSphere — E-commerce Application
                    </h3>

                    <p>
                      E-commerce application featuring product
                      management, cart functionality and API integration.
                    </p>


                    <div className="project-skills">

                      <span>
                        React
                      </span>

                      <span>
                        Node.js
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="candidate-project-view"
                  >

                    View

                    <ArrowRight size={11} />

                  </button>

                </article>

              </div>

            </section>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
              ================================================= */}

          <aside className="candidate-details-side">


            {/* ROLE FIT */}

            <section className="candidate-details-panel">

              <div className="candidate-panel-heading">

                <div>

                  <span className="panel-label">
                    ROLE FIT
                  </span>

                  <h2>
                    Requirement coverage
                  </h2>

                </div>

              </div>


              <div className="role-fit-list">


                <div className="role-fit-row">

                  <div>
                    <CheckCircle2 size={14} />
                  </div>

                  <span>
                    React
                  </span>

                  <strong>
                    96%
                  </strong>

                </div>


                <div className="role-fit-row">

                  <div>
                    <CheckCircle2 size={14} />
                  </div>

                  <span>
                    Node.js
                  </span>

                  <strong>
                    93%
                  </strong>

                </div>


                <div className="role-fit-row">

                  <div>
                    <CheckCircle2 size={14} />
                  </div>

                  <span>
                    MongoDB
                  </span>

                  <strong>
                    89%
                  </strong>

                </div>


                <div className="role-fit-row partial">

                  <div>
                    <Target size={14} />
                  </div>

                  <span>
                    TypeScript
                  </span>

                  <strong>
                    64%
                  </strong>

                </div>


                <div className="role-fit-row missing">

                  <div>
                    <XCircle size={14} />
                  </div>

                  <span>
                    Docker
                  </span>

                  <strong>
                    —
                  </strong>

                </div>

              </div>


              <div className="role-fit-summary">

                <span>
                  REQUIRED COVERAGE
                </span>

                <strong>
                  100%
                </strong>

                <p>
                  All required skills have supporting evidence.
                </p>

              </div>

            </section>


            {/* APPLICATION */}

            <section className="candidate-details-panel">

              <div className="candidate-panel-heading">

                <div>

                  <span className="panel-label">
                    APPLICATION
                  </span>

                  <h2>
                    Application details
                  </h2>

                </div>

              </div>


              <div className="application-detail-list">

                <div>

                  <span>
                    Applied for
                  </span>

                  <strong>
                    Senior Full Stack Developer
                  </strong>

                </div>


                <div>

                  <span>
                    Applied
                  </span>

                  <strong>
                    Today, 10:42 AM
                  </strong>

                </div>


                <div>

                  <span>
                    Source
                  </span>

                  <strong>
                    PulseHire
                  </strong>

                </div>

              </div>

            </section>


            {/* ACTION */}

            <section className="candidate-next-action">

              <span className="panel-label">
                RECOMMENDED ACTION
              </span>

              <h2>
                This candidate is worth reviewing.
              </h2>

              <p>
                All required skills are supported by evidence.
                TypeScript is the only meaningful development area.
              </p>


              <button
                className="candidate-shortlist-full"
                type="button"
              >

                Shortlist Candidate

                <ArrowRight size={12} />

              </button>

            </section>


          </aside>

        </div>


        {/* ===================================================
            FOOTER INSIGHT
            =================================================== */}

        <section className="recruiter-insight">

          <div className="recruiter-insight-icon">
            <BadgeCheck size={21} />
          </div>


          <div>

            <span className="panel-label">
              EVIDENCE-AWARE REVIEW
            </span>

            <h2>
              A high match score should always be explainable.
            </h2>

            <p>
              PulseHire shows recruiters which requirements are
              supported by evidence, where a candidate has gaps,
              and how strong the available evidence is.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default RecruiterCandidateDetails;