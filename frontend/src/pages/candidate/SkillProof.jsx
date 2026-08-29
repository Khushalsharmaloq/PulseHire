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
  Link as LinkIcon,
  LogOut,
  Plus,
  ShieldCheck,
  Target,
  Upload,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";


const SkillProof = () => {
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
              className="sidebar-link active"
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
              SKILL PROOF
            </span>

            <h1>
              Prove what you can actually do.
            </h1>

          </div>

        </header>


        {/* ===================================================
            INTRO
            =================================================== */}

        <section className="proof-intro">

          <div>

            <span className="panel-label">
              EVIDENCE-BACKED SKILLS
            </span>

            <h2>
              Turn your skills into trusted signals.
            </h2>

            <p>
              Submit projects, certificates, portfolios,
              assessments and other evidence that helps
              recruiters understand what you can actually do.
            </p>

          </div>


          <div className="proof-trust">

            <ShieldCheck size={18} />

            <div>

              <strong>
                Your evidence matters.
              </strong>

              <span>
                Recruiters can validate submitted proof.
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            VERIFICATION SUMMARY
            =================================================== */}

        <section className="proof-summary">

          <div className="proof-summary-card">

            <span>
              VERIFIED
            </span>

            <strong>
              3
            </strong>

            <small>
              skills recruiters validated
            </small>

          </div>


          <div className="proof-summary-card">

            <span>
              PENDING
            </span>

            <strong>
              1
            </strong>

            <small>
              proof awaiting review
            </small>

          </div>


          <div className="proof-summary-card">

            <span>
              NEEDS PROOF
            </span>

            <strong>
              1
            </strong>

            <small>
              skill without evidence
            </small>

          </div>


          <button
            className="add-proof-button"
            type="button"
          >

            <Plus size={16} />

            Add Skill Proof

          </button>

        </section>


        {/* ===================================================
            SKILL PROOF LIST
            =================================================== */}

        <section className="proof-section">

          <div className="proof-section-header">

            <div>

              <span className="panel-label">
                YOUR EVIDENCE
              </span>

              <h2>
                Skills and their proof.
              </h2>

            </div>

          </div>


          <div className="proof-list">


            {/* =================================================
                VERIFIED REACT
                ================================================= */}

            <article className="proof-card">

              <div className="proof-card-header">

                <div className="proof-skill-icon verified">
                  <BadgeCheck size={18} />
                </div>


                <div>

                  <div className="proof-skill-name">

                    <h3>
                      React
                    </h3>

                    <span className="proof-status verified">
                      Verified
                    </span>

                  </div>

                  <p>
                    Recruiter validated · Verified 3 days ago
                  </p>

                </div>

              </div>


              <div className="proof-evidence">

                <div className="evidence-icon">
                  <Code2 size={17} />
                </div>


                <div className="evidence-info">

                  <strong>
                    E-Commerce Dashboard
                  </strong>

                  <span>
                    GitHub project · React · Redux
                  </span>

                </div>


                <Link to="/candidate/skill-proof">

                  View

                  <ArrowRight size={12} />

                </Link>

              </div>


              <div className="proof-footer">

                <span>
                  <CheckCircle2 size={12} />
                  Evidence accepted
                </span>

                <span>
                  Recruiter validation complete
                </span>

              </div>

            </article>


            {/* =================================================
                NODE
                ================================================= */}

            <article className="proof-card">

              <div className="proof-card-header">

                <div className="proof-skill-icon verified">
                  <BadgeCheck size={18} />
                </div>


                <div>

                  <div className="proof-skill-name">

                    <h3>
                      Node.js
                    </h3>

                    <span className="proof-status verified">
                      Verified
                    </span>

                  </div>

                  <p>
                    Recruiter validated · Verified 5 days ago
                  </p>

                </div>

              </div>


              <div className="proof-evidence">

                <div className="evidence-icon">
                  <Code2 size={17} />
                </div>


                <div className="evidence-info">

                  <strong>
                    PulseHire API
                  </strong>

                  <span>
                    GitHub repository · Express · REST API
                  </span>

                </div>


                <Link to="/candidate/skill-proof">

                  View

                  <ArrowRight size={12} />

                </Link>

              </div>


              <div className="proof-footer">

                <span>
                  <CheckCircle2 size={12} />
                  Evidence accepted
                </span>

                <span>
                  Recruiter validation complete
                </span>

              </div>

            </article>


            {/* =================================================
                MONGODB
                ================================================= */}

            <article className="proof-card">

              <div className="proof-card-header">

                <div className="proof-skill-icon verified">
                  <BadgeCheck size={18} />
                </div>


                <div>

                  <div className="proof-skill-name">

                    <h3>
                      MongoDB
                    </h3>

                    <span className="proof-status verified">
                      Verified
                    </span>

                  </div>

                  <p>
                    Recruiter validated · Verified 1 week ago
                  </p>

                </div>

              </div>


              <div className="proof-evidence">

                <div className="evidence-icon">
                  <FileCheck2 size={17} />
                </div>


                <div className="evidence-info">

                  <strong>
                    Database Design Project
                  </strong>

                  <span>
                    Project evidence · MongoDB · Mongoose
                  </span>

                </div>


                <Link to="/candidate/skill-proof">

                  View

                  <ArrowRight size={12} />

                </Link>

              </div>


              <div className="proof-footer">

                <span>
                  <CheckCircle2 size={12} />
                  Evidence accepted
                </span>

                <span>
                  Recruiter validation complete
                </span>

              </div>

            </article>


            {/* =================================================
                TYPESCRIPT PENDING
                ================================================= */}

            <article className="proof-card pending-proof">

              <div className="proof-card-header">

                <div className="proof-skill-icon pending">
                  <Clock3 size={18} />
                </div>


                <div>

                  <div className="proof-skill-name">

                    <h3>
                      TypeScript
                    </h3>

                    <span className="proof-status pending">
                      Pending Review
                    </span>

                  </div>

                  <p>
                    Submitted · Waiting for recruiter validation
                  </p>

                </div>

              </div>


              <div className="proof-evidence">

                <div className="evidence-icon">
                  <Code2 size={17} />
                </div>


                <div className="evidence-info">

                  <strong>
                    Task Management App
                  </strong>

                  <span>
                    GitHub project · TypeScript · React
                  </span>

                </div>


                <Link to="/candidate/skill-proof">

                  View

                  <ArrowRight size={12} />

                </Link>

              </div>


              <div className="proof-footer pending">

                <span>
                  <Clock3 size={12} />
                  Awaiting review
                </span>

                <span>
                  Submitted 2 days ago
                </span>

              </div>

            </article>


            {/* =================================================
                SKILL WITHOUT PROOF
                ================================================= */}

            <article className="proof-card missing-proof">

              <div className="proof-card-header">

                <div className="proof-skill-icon missing">
                  <TargetIcon />
                </div>


                <div>

                  <div className="proof-skill-name">

                    <h3>
                      Docker
                    </h3>

                    <span className="proof-status missing">
                      Needs Proof
                    </span>

                  </div>

                  <p>
                    Listed on your profile but no evidence submitted
                  </p>

                </div>

              </div>


              <div className="missing-proof-content">

                <div>

                  <strong>
                    Add evidence for Docker
                  </strong>

                  <span>
                    Show recruiters where and how you've
                    used this skill.
                  </span>

                </div>


                <button
                  className="submit-proof-button"
                  type="button"
                >

                  <Plus size={14} />

                  Submit Proof

                </button>

              </div>

            </article>

          </div>

        </section>


        {/* ===================================================
            ADD PROOF
            =================================================== */}

        <section className="add-proof-panel">

          <div className="add-proof-heading">

            <div className="add-proof-large-icon">
              <Upload size={20} />
            </div>


            <div>

              <span className="panel-label">
                ADD NEW EVIDENCE
              </span>

              <h2>
                What would you like to prove?
              </h2>

              <p>
                Choose the type of evidence that best
                demonstrates your capability.
              </p>

            </div>

          </div>


          <div className="evidence-options">


            <button
              className="evidence-option"
              type="button"
            >

              <Code2 size={18} />

              <div>

                <strong>
                  GitHub Project
                </strong>

                <span>
                  Prove your skills through real code.
                </span>

              </div>

              <ArrowRight size={14} />

            </button>


            <button
              className="evidence-option"
              type="button"
            >

              <FileCheck2 size={18} />

              <div>

                <strong>
                  Certificate
                </strong>

                <span>
                  Upload recognized certifications.
                </span>

              </div>

              <ArrowRight size={14} />

            </button>


            <button
              className="evidence-option"
              type="button"
            >

              <LinkIcon size={18} />

              <div>

                <strong>
                  Portfolio / Project
                </strong>

                <span>
                  Share a live project or portfolio.
                </span>

              </div>

              <ArrowRight size={14} />

            </button>


            <button
              className="evidence-option"
              type="button"
            >

              <CheckCircle2 size={18} />

              <div>

                <strong>
                  Assessment
                </strong>

                <span>
                  Demonstrate your knowledge through testing.
                </span>

              </div>

              <ArrowRight size={14} />

            </button>

          </div>

        </section>


        {/* ===================================================
            IMPORTANT MESSAGE
            =================================================== */}

        <section className="proof-principle">

          <div className="proof-principle-icon">
            <ShieldCheck size={21} />
          </div>


          <div>

            <span className="panel-label">
              WHY VERIFICATION MATTERS
            </span>

            <h2>
              A skill becomes a stronger signal when there's evidence behind it.
            </h2>

            <p>
              PulseHire doesn't ask recruiters to simply trust
              what candidates write on their resumes. Candidates
              provide evidence, recruiters validate it, and the
              resulting verified skill becomes part of the
              candidate's professional profile.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};


/* Small local icon used for the Docker card */

const TargetIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <circle
        cx="12"
        cy="12"
        r="5"
      />

      <circle
        cx="12"
        cy="12"
        r="1"
      />
    </svg>
  );
};


export default SkillProof;