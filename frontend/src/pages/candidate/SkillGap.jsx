import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  FileCheck2,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";


const SkillGap = () => {
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
              className="sidebar-link active"
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
              SKILL GAP INTELLIGENCE
            </span>

            <h1>
              Know what to improve next.
            </h1>

          </div>

        </header>


        {/* ===================================================
            OVERVIEW
            =================================================== */}

        <section className="gap-hero">

          <div className="gap-hero-content">

            <span className="panel-label">
              YOUR CURRENT READINESS
            </span>

            <h2>
              You're close. Now close the gaps.
            </h2>

            <p>
              PulseHire compares your verified capabilities
              with the skills commonly required by the roles
              you're targeting.
            </p>


            <div className="readiness-large">

              <div className="readiness-circle">

                <strong>
                  80%
                </strong>

                <span>
                  Ready
                </span>

              </div>


              <div className="readiness-info">

                <strong>
                  2 skills are holding you back.
                </strong>

                <span>
                  Improve these areas to increase your
                  match with relevant opportunities.
                </span>

                <div className="readiness-bar">

                  <div className="readiness-bar-fill"></div>

                </div>

              </div>

            </div>

          </div>


          <div className="gap-hero-side">

            <div className="gap-hero-stat">

              <Target size={18} />

              <div>

                <span>
                  CURRENT GAP
                </span>

                <strong>
                  20%
                </strong>

              </div>

            </div>


            <div className="gap-hero-stat">

              <TrendingUp size={18} />

              <div>

                <span>
                  POTENTIAL
                </span>

                <strong>
                  +14%
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            PRIORITY GAPS
            =================================================== */}

        <section className="gap-priority-section">

          <div className="gap-section-heading">

            <div>

              <span className="panel-label">
                PRIORITY GAPS
              </span>

              <h2>
                Skills worth improving first.
              </h2>

            </div>

          </div>


          <div className="gap-cards">


            {/* =================================================
                TYPESCRIPT
                ================================================= */}

            <article className="gap-card-large priority">

              <div className="gap-card-top">

                <div className="gap-card-icon">
                  <Code2 size={19} />
                </div>


                <span className="gap-priority">
                  HIGH PRIORITY
                </span>

              </div>


              <h3>
                TypeScript
              </h3>


              <p>
                Frequently requested in the Full Stack
                and React roles you're targeting.
              </p>


              <div className="gap-card-readiness">

                <div>

                  <span>
                    YOUR READINESS
                  </span>

                  <strong>
                    64%
                  </strong>

                </div>


                <div className="gap-card-bar">

                  <div
                    className="gap-card-bar-fill"
                    style={{ width: "64%" }}
                  ></div>

                </div>

              </div>


              <div className="gap-card-footer">

                <span>
                  <BarChart3 size={12} />
                  Appears in 72% of target roles
                </span>


                <Link to="/candidate/learning">

                  Learn

                  <ArrowRight size={12} />

                </Link>

              </div>

            </article>


            {/* =================================================
                DOCKER
                ================================================= */}

            <article className="gap-card-large">

              <div className="gap-card-top">

                <div className="gap-card-icon">
                  <Code2 size={19} />
                </div>


                <span className="gap-priority medium">
                  MEDIUM PRIORITY
                </span>

              </div>


              <h3>
                Docker
              </h3>


              <p>
                Appears frequently in backend and
                deployment-focused positions.
              </p>


              <div className="gap-card-readiness">

                <div>

                  <span>
                    YOUR READINESS
                  </span>

                  <strong>
                    72%
                  </strong>

                </div>


                <div className="gap-card-bar">

                  <div
                    className="gap-card-bar-fill"
                    style={{ width: "72%" }}
                  ></div>

                </div>

              </div>


              <div className="gap-card-footer">

                <span>
                  <BarChart3 size={12} />
                  Appears in 48% of target roles
                </span>


                <Link to="/candidate/learning">

                  Learn

                  <ArrowRight size={12} />

                </Link>

              </div>

            </article>

          </div>

        </section>


        {/* ===================================================
            ROLE ANALYSIS
            =================================================== */}

        <section className="gap-role-panel">

          <div className="gap-role-header">

            <div>

              <span className="panel-label">
                ROLE-BASED ANALYSIS
              </span>

              <h2>
                What your target roles are asking for.
              </h2>

            </div>


            <span className="role-count">
              12 roles analysed
            </span>

          </div>


          <div className="role-analysis-grid">


            <div className="role-analysis-item verified">

              <div className="role-analysis-icon">
                <CheckCircle2 size={16} />
              </div>

              <div>

                <strong>
                  React
                </strong>

                <span>
                  Strong verified capability
                </span>

              </div>

              <small>
                96%
              </small>

            </div>


            <div className="role-analysis-item verified">

              <div className="role-analysis-icon">
                <CheckCircle2 size={16} />
              </div>

              <div>

                <strong>
                  Node.js
                </strong>

                <span>
                  Strong verified capability
                </span>

              </div>

              <small>
                91%
              </small>

            </div>


            <div className="role-analysis-item verified">

              <div className="role-analysis-icon">
                <CheckCircle2 size={16} />
              </div>

              <div>

                <strong>
                  MongoDB
                </strong>

                <span>
                  Strong verified capability
                </span>

              </div>

              <small>
                88%
              </small>

            </div>


            <div className="role-analysis-item warning">

              <div className="role-analysis-icon">
                <Clock3 size={16} />
              </div>

              <div>

                <strong>
                  TypeScript
                </strong>

                <span>
                  Needs improvement
                </span>

              </div>

              <small>
                64%
              </small>

            </div>


            <div className="role-analysis-item warning">

              <div className="role-analysis-icon">
                <Clock3 size={16} />
              </div>

              <div>

                <strong>
                  Docker
                </strong>

                <span>
                  Needs improvement
                </span>

              </div>

              <small>
                72%
              </small>

            </div>


            <div className="role-analysis-item missing">

              <div className="role-analysis-icon">
                <Target size={16} />
              </div>

              <div>

                <strong>
                  AWS
                </strong>

                <span>
                  Not demonstrated yet
                </span>

              </div>

              <small>
                31%
              </small>

            </div>

          </div>

        </section>


        {/* ===================================================
            IMPROVEMENT PLAN
            =================================================== */}

        <section className="improvement-panel">

          <div className="improvement-header">

            <div className="improvement-icon">
              <Lightbulb size={20} />
            </div>


            <div>

              <span className="panel-label">
                RECOMMENDED PATH
              </span>

              <h2>
                A practical path to close your gaps.
              </h2>

              <p>
                You don't need to learn everything.
                Focus on the skills with the highest
                impact on your target roles.
              </p>

            </div>

          </div>


          <div className="improvement-steps">


            <div className="improvement-step">

              <div className="step-number">
                01
              </div>

              <div>

                <strong>
                  Strengthen TypeScript
                </strong>

                <span>
                  Complete the recommended TypeScript
                  learning path.
                </span>

              </div>

              <Link to="/candidate/learning">

                Start

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="improvement-step">

              <div className="step-number">
                02
              </div>

              <div>

                <strong>
                  Build one Docker project
                </strong>

                <span>
                  Demonstrate practical Docker usage
                  through a real project.
                </span>

              </div>

              <Link to="/candidate/learning">

                Explore

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="improvement-step">

              <div className="step-number">
                03
              </div>

              <div>

                <strong>
                  Submit new evidence
                </strong>

                <span>
                  Let recruiters validate the skills
                  you've improved.
                </span>

              </div>

              <Link to="/candidate/skill-proof">

                Prove

                <ArrowRight size={12} />

              </Link>

            </div>

          </div>

        </section>


        {/* ===================================================
            PRINCIPLE
            =================================================== */}

        <section className="gap-principle">

          <div className="gap-principle-icon">
            <Target size={21} />
          </div>


          <div>

            <span className="panel-label">
              THE PULSEHIRE APPROACH
            </span>

            <h2>
              Don't learn more. Learn what matters.
            </h2>

            <p>
              PulseHire identifies the difference between
              your current verified capabilities and the
              skills required by your target opportunities.
              The goal isn't to collect courses — it's to
              close meaningful skill gaps and turn improvement
              into stronger evidence.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default SkillGap;