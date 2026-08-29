import {
  ArrowRight,
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
  PlayCircle,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";


const Learning = () => {
  return (
    <div className="candidate-dashboard">

      {/* ================= SIDEBAR ================= */}

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
              className="sidebar-link active"
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


      {/* ================= MAIN ================= */}

      <main className="candidate-main">


        {/* ================= HEADER ================= */}

        <header className="candidate-topbar">

          <div>

            <span className="dashboard-eyebrow">
              TARGETED LEARNING
            </span>

            <h1>
              Learn what moves your profile forward.
            </h1>

          </div>

        </header>


        {/* ================= LEARNING HERO ================= */}

        <section className="learning-hero">

          <div className="learning-hero-content">

            <span className="panel-label">
              YOUR RECOMMENDED PATH
            </span>

            <h2>
              Don't learn everything.
              <br />
              Learn what matters.
            </h2>

            <p>
              These resources are selected around the skill
              gaps detected in your profile and the roles
              you're targeting.
            </p>


            <div className="learning-progress">

              <div className="learning-progress-heading">

                <span>
                  Improvement progress
                </span>

                <strong>
                  35%
                </strong>

              </div>


              <div className="learning-progress-bar">

                <div
                  className="learning-progress-fill"
                  style={{ width: "35%" }}
                ></div>

              </div>


              <span className="learning-progress-note">
                2 of 6 recommended learning milestones completed
              </span>

            </div>

          </div>


          <div className="learning-hero-stats">

            <Link
              to="/candidate/skill-gap"
              className="learning-hero-stat"
            >

              <Target size={17} />

              <span>
                Priority gaps
              </span>

              <strong>
                2
              </strong>

            </Link>


            <div>

              <BookOpen size={17} />

              <span>
                Resources
              </span>

              <strong>
                8
              </strong>

            </div>


            <Link
              to="/candidate/skill-gap"
              className="learning-hero-stat"
            >

              <TrendingUp size={17} />

              <span>
                Potential gain
              </span>

              <strong>
                +14%
              </strong>

            </Link>

          </div>

        </section>


        {/* ================= CURRENT PATH ================= */}

        <section className="learning-section">

          <div className="learning-section-heading">

            <div>

              <span className="panel-label">
                YOUR CURRENT PATH
              </span>

              <h2>
                Close your highest-impact gaps.
              </h2>

            </div>

          </div>


          <div className="learning-path">


            {/* ================= STEP 1 ================= */}

            <article className="learning-path-card completed">

              <div className="learning-step-number">
                01
              </div>


              <div className="learning-path-icon">
                <CheckCircle2 size={18} />
              </div>


              <div className="learning-path-content">

                <div className="learning-path-title">

                  <h3>
                    React fundamentals
                  </h3>

                  <span className="learning-complete">
                    Completed
                  </span>

                </div>


                <p>
                  Strengthen the foundation behind your
                  existing React projects.
                </p>


                <div className="learning-meta">

                  <span>
                    <PlayCircle size={11} />
                    2h 15m
                  </span>

                  <span>
                    Beginner → Intermediate
                  </span>

                </div>

              </div>

            </article>


            {/* ================= STEP 2 ================= */}

            <article className="learning-path-card active">

              <div className="learning-step-number">
                02
              </div>


              <div className="learning-path-icon">
                <Code2 size={18} />
              </div>


              <div className="learning-path-content">

                <div className="learning-path-title">

                  <h3>
                    TypeScript for React
                  </h3>

                  <span className="learning-current">
                    Recommended
                  </span>

                </div>


                <p>
                  Close your TypeScript gap with practical
                  React-focused learning.
                </p>


                <div className="learning-meta">

                  <span>
                    <PlayCircle size={11} />
                    3h 40m
                  </span>

                  <span>
                    Intermediate
                  </span>

                  <span>
                    High impact
                  </span>

                </div>


                <div className="learning-card-progress">

                  <div>

                    <span>
                      Progress
                    </span>

                    <strong>
                      40%
                    </strong>

                  </div>


                  <div className="small-progress">

                    <div
                      style={{ width: "40%" }}
                    ></div>

                  </div>

                </div>


                <Link
                  to="/candidate/learning"
                  className="learning-action"
                >
                  Continue Learning
                  <ArrowRight size={13} />
                </Link>

              </div>

            </article>


            {/* ================= STEP 3 ================= */}

            <article className="learning-path-card">

              <div className="learning-step-number">
                03
              </div>


              <div className="learning-path-icon">
                <Code2 size={18} />
              </div>


              <div className="learning-path-content">

                <div className="learning-path-title">

                  <h3>
                    Docker for Full Stack Apps
                  </h3>

                  <span className="learning-upcoming">
                    Next
                  </span>

                </div>


                <p>
                  Learn how to containerize and deploy
                  a real full-stack application.
                </p>


                <div className="learning-meta">

                  <span>
                    <PlayCircle size={11} />
                    4h 10m
                  </span>

                  <span>
                    Intermediate
                  </span>

                </div>

              </div>

            </article>


            {/* ================= STEP 4 ================= */}

            <article className="learning-path-card">

              <div className="learning-step-number">
                04
              </div>


              <div className="learning-path-icon">
                <BadgeCheck size={18} />
              </div>


              <div className="learning-path-content">

                <div className="learning-path-title">

                  <h3>
                    Submit new skill evidence
                  </h3>

                  <span className="learning-upcoming">
                    Final step
                  </span>

                </div>


                <p>
                  Demonstrate your improved capabilities
                  and submit evidence for validation.
                </p>


                <div className="learning-meta">

                  <span>
                    <FileCheck2 size={11} />
                    Skill Proof
                  </span>

                  <span>
                    Recruiter validation
                  </span>

                </div>


                <Link
                  to="/candidate/skill-proof"
                  className="learning-action secondary"
                >
                  View Skill Proof
                  <ArrowRight size={13} />
                </Link>

              </div>

            </article>

          </div>

        </section>


        {/* ================= RECOMMENDED RESOURCES ================= */}

        <section className="resources-section">

          <div className="learning-section-heading">

            <div>

              <span className="panel-label">
                RECOMMENDED RESOURCES
              </span>

              <h2>
                Resources matched to your gaps.
              </h2>

            </div>


            <span className="resource-count">
              8 resources found
            </span>

          </div>


          <div className="resource-grid">


            {/* RESOURCE 1 */}

            <article className="resource-card">

              <div className="resource-top">

                <div className="resource-icon">
                  <Code2 size={17} />
                </div>

                <span>
                  TYPESCRIPT
                </span>

              </div>


              <h3>
                TypeScript Essentials for React
              </h3>


              <p>
                Build confidence with types, interfaces,
                props and practical React patterns.
              </p>


              <div className="resource-bottom">

                <span>
                  <Clock3 size={11} />
                  3h 40m
                </span>


                <Link to="/candidate/learning">

                  Open

                  <ArrowRight size={11} />

                </Link>

              </div>

            </article>


            {/* RESOURCE 2 */}

            <article className="resource-card">

              <div className="resource-top">

                <div className="resource-icon">
                  <BriefcaseBusiness size={17} />
                </div>

                <span>
                  PRACTICAL
                </span>

              </div>


              <h3>
                Build a TypeScript Dashboard
              </h3>


              <p>
                Apply TypeScript concepts by building
                a realistic dashboard project.
              </p>


              <div className="resource-bottom">

                <span>
                  <Clock3 size={11} />
                  5h 20m
                </span>


                <Link to="/candidate/learning">

                  Open

                  <ArrowRight size={11} />

                </Link>

              </div>

            </article>


            {/* RESOURCE 3 */}

            <article className="resource-card">

              <div className="resource-top">

                <div className="resource-icon">
                  <Code2 size={17} />
                </div>

                <span>
                  DOCKER
                </span>

              </div>


              <h3>
                Docker Fundamentals
              </h3>


              <p>
                Learn images, containers, networking and
                the workflow behind modern deployments.
              </p>


              <div className="resource-bottom">

                <span>
                  <Clock3 size={11} />
                  2h 50m
                </span>


                <Link to="/candidate/learning">

                  Open

                  <ArrowRight size={11} />

                </Link>

              </div>

            </article>


            {/* RESOURCE 4 */}

            <article className="resource-card">

              <div className="resource-top">

                <div className="resource-icon">
                  <Target size={17} />
                </div>

                <span>
                  PROJECT
                </span>

              </div>


              <h3>
                Containerize a MERN Application
              </h3>


              <p>
                Put Docker knowledge into practice using
                a complete MERN application.
              </p>


              <div className="resource-bottom">

                <span>
                  <Clock3 size={11} />
                  6h 15m
                </span>


                <Link to="/candidate/learning">

                  Open

                  <ArrowRight size={11} />

                </Link>

              </div>

            </article>

          </div>

        </section>


        {/* ================= LEARNING PRINCIPLE ================= */}

        <section className="learning-principle">

          <div className="learning-principle-icon">
            <Lightbulb size={21} />
          </div>


          <div>

            <span className="panel-label">
              LEARNING WITH PURPOSE
            </span>

            <h2>
              Every recommendation should lead somewhere.
            </h2>

            <p>
              PulseHire connects learning to measurable
              improvement. Complete a resource, strengthen
              a skill, build evidence, get it validated,
              and improve your readiness for real opportunities.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default Learning;