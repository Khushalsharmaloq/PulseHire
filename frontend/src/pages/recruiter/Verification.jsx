import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Code2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Target,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";


const SkillVerification = () => {
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
              className="sidebar-link active"
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
          to="/recruiter/candidates/arjun"
          className="skill-verification-back"
        >

          <ArrowLeft size={13} />

          Back to candidate

        </Link>


        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="skill-verification-header">

          <div className="verification-candidate">

            <div className="verification-avatar">
              AK
            </div>


            <div>

              <span className="dashboard-eyebrow">
                SKILL VERIFICATION
              </span>

              <h1>
                Arjun Kumar
              </h1>

              <p>
                Reviewing evidence submitted for the Senior Full Stack Developer role.
              </p>

            </div>

          </div>


          <div className="verification-progress">

            <span>
              EVIDENCE REVIEW
            </span>

            <strong>
              3 of 4 skills verified
            </strong>

          </div>

        </header>


        {/* ===================================================
            SKILL SELECTOR
            =================================================== */}

        <section className="verification-skill-selector">

          <div className="verification-skill-tab active">

            <BadgeCheck size={14} />

            <div>

              <strong>
                React
              </strong>

              <span>
                Verified
              </span>

            </div>

          </div>


          <div className="verification-skill-tab">

            <BadgeCheck size={14} />

            <div>

              <strong>
                Node.js
              </strong>

              <span>
                Verified
              </span>

            </div>

          </div>


          <div className="verification-skill-tab">

            <BadgeCheck size={14} />

            <div>

              <strong>
                MongoDB
              </strong>

              <span>
                Verified
              </span>

            </div>

          </div>


          <div className="verification-skill-tab partial">

            <Target size={14} />

            <div>

              <strong>
                TypeScript
              </strong>

              <span>
                Needs evidence
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            VERIFICATION LAYOUT
            =================================================== */}

        <div className="verification-layout">


          {/* =================================================
              LEFT — EVIDENCE
              ================================================= */}

          <section className="verification-evidence-panel">


            <div className="verification-panel-heading">

              <div>

                <span className="panel-label">
                  REACT
                </span>

                <h2>
                  Evidence submitted by candidate.
                </h2>

                <p>
                  Review the evidence below before confirming this skill as verified.
                </p>

              </div>


              <div className="verification-confidence">

                <span>
                  CONFIDENCE
                </span>

                <strong>
                  96%
                </strong>

              </div>

            </div>


            {/* =================================================
                EVIDENCE 1
                ================================================= */}

            <article className="evidence-card">

              <div className="evidence-card-header">

                <div className="evidence-source-icon github">
                  <Code2 size={17} />
                </div>


                <div>

                  <span className="evidence-type">
                    GITHUB REPOSITORY
                  </span>

                  <h3>
                    TaskFlow
                  </h3>

                </div>


                <span className="evidence-strength strong">
                  Strong evidence
                </span>

              </div>


              <p className="evidence-description">
                React-based team productivity application demonstrating
                component architecture, state management, routing and reusable
                UI patterns.
              </p>


              <div className="evidence-metrics">

                <div>

                  <span>
                    COMMITS
                  </span>

                  <strong>
                    84
                  </strong>

                </div>


                <div>

                  <span>
                    FILES
                  </span>

                  <strong>
                    126
                  </strong>

                </div>


                <div>

                  <span>
                    REACT USAGE
                  </span>

                  <strong>
                    High
                  </strong>

                </div>


                <div>

                  <span>
                    ACTIVITY
                  </span>

                  <strong>
                    Recent
                  </strong>

                </div>

              </div>


              <div className="evidence-technologies">

                <span>
                  React
                </span>

                <span>
                  React Router
                </span>

                <span>
                  Context API
                </span>

                <span>
                  JavaScript
                </span>

              </div>


              <button
                type="button"
                className="evidence-external-link"
              >

                View repository

                <ExternalLink size={11} />

              </button>

            </article>


            {/* =================================================
                EVIDENCE 2
                ================================================= */}

            <article className="evidence-card">

              <div className="evidence-card-header">

                <div className="evidence-source-icon project">
                  <FileCheck2 size={17} />
                </div>


                <div>

                  <span className="evidence-type">
                    PROJECT DEMONSTRATION
                  </span>

                  <h3>
                    ShopSphere
                  </h3>

                </div>


                <span className="evidence-strength strong">
                  Strong evidence
                </span>

              </div>


              <p className="evidence-description">
                Production-style e-commerce interface with reusable React
                components, product state, authentication flows and API
                integration.
              </p>


              <div className="evidence-metrics">

                <div>

                  <span>
                    COMPONENTS
                  </span>

                  <strong>
                    37
                  </strong>

                </div>


                <div>

                  <span>
                    ROUTES
                  </span>

                  <strong>
                    12
                  </strong>

                </div>


                <div>

                  <span>
                    API CALLS
                  </span>

                  <strong>
                    18
                  </strong>

                </div>


                <div>

                  <span>
                    STATUS
                  </span>

                  <strong>
                    Complete
                  </strong>

                </div>

              </div>


              <div className="evidence-technologies">

                <span>
                  React
                </span>

                <span>
                  Axios
                </span>

                <span>
                  REST API
                </span>

              </div>


              <button
                type="button"
                className="evidence-external-link"
              >

                View project

                <ExternalLink size={11} />

              </button>

            </article>


            {/* =================================================
                EVIDENCE 3
                ================================================= */}

            <article className="evidence-card">

              <div className="evidence-card-header">

                <div className="evidence-source-icon challenge">
                  <Target size={17} />
                </div>


                <div>

                  <span className="evidence-type">
                    SKILL ASSESSMENT
                  </span>

                  <h3>
                    React Architecture Challenge
                  </h3>

                </div>


                <span className="evidence-strength medium">
                  Supporting evidence
                </span>

              </div>


              <p className="evidence-description">
                Candidate completed a timed architecture challenge covering
                component design, state management and application structure.
              </p>


              <div className="evidence-assessment">

                <div>

                  <span>
                    SCORE
                  </span>

                  <strong>
                    92 / 100
                  </strong>

                </div>


                <div>

                  <span>
                    COMPLETED
                  </span>

                  <strong>
                    18 Aug 2026
                  </strong>

                </div>


                <div>

                  <span>
                    DIFFICULTY
                  </span>

                  <strong>
                    Advanced
                  </strong>

                </div>

              </div>

            </article>

          </section>


          {/* =================================================
              RIGHT — DECISION
              ================================================= */}

          <aside className="verification-sidebar">


            {/* =================================================
                SKILL RESULT
                ================================================= */}

            <section className="verification-result-card">

              <span className="panel-label">
                CURRENT RESULT
              </span>


              <div className="verification-result-icon">
                <BadgeCheck size={22} />
              </div>


              <h2>
                React
              </h2>


              <strong>
                Verified
              </strong>


              <p>
                Evidence strongly supports the candidate's proficiency in this skill.
              </p>


              <div className="verification-result-score">

                <span>
                  EVIDENCE STRENGTH
                </span>

                <strong>
                  96%
                </strong>

              </div>

            </section>


            {/* =================================================
                CRITERIA
                ================================================= */}

            <section className="verification-criteria">

              <span className="panel-label">
                VERIFICATION CRITERIA
              </span>


              <h2>
                Evidence checklist
              </h2>


              <div className="criteria-row">

                <CheckCircle2 size={14} />

                <span>
                  Real project usage
                </span>

              </div>


              <div className="criteria-row">

                <CheckCircle2 size={14} />

                <span>
                  Recent activity
                </span>

              </div>


              <div className="criteria-row">

                <CheckCircle2 size={14} />

                <span>
                  Multiple evidence sources
                </span>

              </div>


              <div className="criteria-row">

                <CheckCircle2 size={14} />

                <span>
                  Assessment performance
                </span>

              </div>

            </section>


            {/* =================================================
                DECISION
                ================================================= */}

            <section className="verification-decision">

              <span className="panel-label">
                RECRUITER DECISION
              </span>


              <h2>
                Confirm skill verification?
              </h2>


              <p>
                Your decision will affect the candidate's verified skill profile
                and future matching.
              </p>


              <button
                className="approve-verification-button"
                type="button"
              >

                <CheckCircle2 size={14} />

                Confirm Verification

              </button>


              <button
                className="request-evidence-button"
                type="button"
              >

                <MessageSquare size={13} />

                Request More Evidence

              </button>


              <button
                className="reject-verification-button"
                type="button"
              >

                <XCircle size={13} />

                Reject Evidence

              </button>

            </section>


            {/* =================================================
                NEXT SKILL
                ================================================= */}

            <button
              type="button"
              className="next-skill-card"
            >

              <div>

                <span>
                  NEXT TO REVIEW
                </span>

                <strong>
                  TypeScript
                </strong>

                <small>
                  Evidence needs review
                </small>

              </div>


              <ChevronRight size={16} />

            </button>

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
              TRUSTED SKILLS
            </span>

            <h2>
              Verification should be backed by evidence.
            </h2>

            <p>
              Recruiter validation adds another layer of trust to candidate
              skills. Once confirmed, verified skills can strengthen future
              candidate-role matching.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};


export default SkillVerification;