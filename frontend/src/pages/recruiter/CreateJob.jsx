import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Target,
  Trash2,
  Users,
  X,
} from "lucide-react";


const CreateJob = () => {
  return (
    <div className="recruiter-dashboard">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="recruiter-sidebar">

        <div className="dashboard-brand">

          <div className="dashboard-brand-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <span>
            PulseHire
          </span>

        </div>


        <div className="sidebar-section">

          <span className="sidebar-label">
            RECRUITER WORKSPACE
          </span>


          <nav className="sidebar-nav">

            <a
              href="/recruiter/dashboard"
              className="sidebar-link"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </a>


            <a
              href="/recruiter/jobs"
              className="sidebar-link active"
            >
              <BriefcaseBusiness size={17} />
              My Jobs
            </a>


            <a
              href="/recruiter/applications"
              className="sidebar-link"
            >
              <FileCheck2 size={17} />
              Applications
            </a>


            <a
              href="/recruiter/candidates"
              className="sidebar-link"
            >
              <Users size={17} />
              Candidates
            </a>


            <a
              href="/recruiter/analytics"
              className="sidebar-link"
            >
              <Target size={17} />
              Analytics
            </a>

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


          <button className="logout-button">

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

        <a
          href="/recruiter/jobs"
          className="create-job-back"
        >

          <ArrowLeft size={13} />

          Back to jobs

        </a>


        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="create-job-header">

          <div>

            <span className="dashboard-eyebrow">
              CREATE OPPORTUNITY
            </span>

            <h1>
              Define the role clearly.
            </h1>

            <p>
              Tell candidates what matters and give PulseHire
              the requirements needed to evaluate skill fit.
            </p>

          </div>


          <div className="create-job-progress">

            <span>
              STEP 1 OF 2
            </span>

            <strong>
              Job details
            </strong>

          </div>

        </header>


        {/* ===================================================
            FORM LAYOUT
            =================================================== */}

        <div className="create-job-layout">


          {/* =================================================
              FORM
              ================================================= */}

          <section className="create-job-form-panel">

            {/* BASIC INFORMATION */}

            <div className="create-job-section">

              <div className="create-job-section-heading">

                <div>

                  <span className="panel-label">
                    BASIC INFORMATION
                  </span>

                  <h2>
                    About the role
                  </h2>

                </div>

              </div>


              <div className="create-job-form-grid">

                <label className="create-job-field full">

                  <span>
                    Job title
                  </span>

                  <input
                    type="text"
                    defaultValue="Senior Full Stack Developer"
                    placeholder="e.g. Senior Full Stack Developer"
                  />

                </label>


                <label className="create-job-field">

                  <span>
                    Department
                  </span>

                  <select defaultValue="Engineering">

                    <option>
                      Engineering
                    </option>

                    <option>
                      Product
                    </option>

                    <option>
                      Design
                    </option>

                    <option>
                      Marketing
                    </option>

                  </select>

                </label>


                <label className="create-job-field">

                  <span>
                    Employment type
                  </span>

                  <select defaultValue="Full-time">

                    <option>
                      Full-time
                    </option>

                    <option>
                      Part-time
                    </option>

                    <option>
                      Contract
                    </option>

                    <option>
                      Internship
                    </option>

                  </select>

                </label>


                <label className="create-job-field">

                  <span>
                    Location
                  </span>

                  <input
                    type="text"
                    defaultValue="Bengaluru"
                    placeholder="e.g. Bengaluru"
                  />

                </label>


                <label className="create-job-field">

                  <span>
                    Experience
                  </span>

                  <select defaultValue="3–5 years">

                    <option>
                      0–1 years
                    </option>

                    <option>
                      1–3 years
                    </option>

                    <option>
                      3–5 years
                    </option>

                    <option>
                      5+ years
                    </option>

                  </select>

                </label>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="create-job-section">

              <div className="create-job-section-heading">

                <div>

                  <span className="panel-label">
                    ROLE DESCRIPTION
                  </span>

                  <h2>
                    What will this person do?
                  </h2>

                </div>

              </div>


              <label className="create-job-field">

                <span>
                  Description
                </span>

                <textarea
                  rows="7"
                  defaultValue={`We're looking for a Senior Full Stack Developer to build scalable web applications and work closely with product and engineering teams.

You'll design modern interfaces, build APIs, work with application data and contribute to production-ready software.`}
                  placeholder="Describe the role, responsibilities and expectations..."
                />

              </label>

            </div>


            {/* SKILLS */}

            <div className="create-job-section">

              <div className="create-job-section-heading">

                <div>

                  <span className="panel-label">
                    REQUIRED SKILLS
                  </span>

                  <h2>
                    What skills actually matter?
                  </h2>

                  <p>
                    These requirements will be used to evaluate
                    candidate fit and identify skill gaps.
                  </p>

                </div>

              </div>


              <div className="skill-requirement-list">


                {/* REACT */}

                <div className="skill-requirement-row">

                  <div className="skill-requirement-main">

                    <div className="skill-check required">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>

                      <strong>
                        React
                      </strong>

                      <span>
                        Required skill
                      </span>

                    </div>

                  </div>


                  <select defaultValue="Required">

                    <option>
                      Required
                    </option>

                    <option>
                      Preferred
                    </option>

                  </select>


                  <button
                    className="remove-skill-button"
                    aria-label="Remove React"
                  >
                    <Trash2 size={13} />
                  </button>

                </div>


                {/* NODE */}

                <div className="skill-requirement-row">

                  <div className="skill-requirement-main">

                    <div className="skill-check required">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>

                      <strong>
                        Node.js
                      </strong>

                      <span>
                        Required skill
                      </span>

                    </div>

                  </div>


                  <select defaultValue="Required">

                    <option>
                      Required
                    </option>

                    <option>
                      Preferred
                    </option>

                  </select>


                  <button
                    className="remove-skill-button"
                    aria-label="Remove Node.js"
                  >
                    <Trash2 size={13} />
                  </button>

                </div>


                {/* MONGODB */}

                <div className="skill-requirement-row">

                  <div className="skill-requirement-main">

                    <div className="skill-check required">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>

                      <strong>
                        MongoDB
                      </strong>

                      <span>
                        Required skill
                      </span>

                    </div>

                  </div>


                  <select defaultValue="Required">

                    <option>
                      Required
                    </option>

                    <option>
                      Preferred
                    </option>

                  </select>


                  <button
                    className="remove-skill-button"
                    aria-label="Remove MongoDB"
                  >
                    <Trash2 size={13} />
                  </button>

                </div>


                {/* TYPESCRIPT */}

                <div className="skill-requirement-row">

                  <div className="skill-requirement-main">

                    <div className="skill-check preferred">
                      <Target size={14} />
                    </div>

                    <div>

                      <strong>
                        TypeScript
                      </strong>

                      <span>
                        Preferred skill
                      </span>

                    </div>

                  </div>


                  <select defaultValue="Preferred">

                    <option>
                      Required
                    </option>

                    <option>
                      Preferred
                    </option>

                  </select>


                  <button
                    className="remove-skill-button"
                    aria-label="Remove TypeScript"
                  >
                    <Trash2 size={13} />
                  </button>

                </div>


              </div>


              <button className="add-skill-button">

                <Plus size={13} />

                Add another skill

              </button>

            </div>


            {/* RESPONSIBILITIES */}

            <div className="create-job-section">

              <div className="create-job-section-heading">

                <div>

                  <span className="panel-label">
                    RESPONSIBILITIES
                  </span>

                  <h2>
                    Key responsibilities
                  </h2>

                </div>

              </div>


              <div className="responsibility-input-row">

                <input
                  type="text"
                  defaultValue="Build and maintain React applications"
                />

                <button>
                  <X size={13} />
                </button>

              </div>


              <div className="responsibility-input-row">

                <input
                  type="text"
                  defaultValue="Design and implement REST APIs"
                />

                <button>
                  <X size={13} />
                </button>

              </div>


              <div className="responsibility-input-row">

                <input
                  type="text"
                  defaultValue="Work with MongoDB and application data"
                />

                <button>
                  <X size={13} />
                </button>

              </div>


              <button className="add-responsibility-button">

                <Plus size={12} />

                Add responsibility

              </button>

            </div>


            {/* FORM ACTIONS */}

            <div className="create-job-actions">

              <a
                href="/recruiter/jobs"
                className="create-job-cancel"
              >
                Cancel
              </a>


              <button className="save-draft-button">

                <Save size={13} />

                Save Draft

              </button>


              <button className="publish-job-button">

                Continue

                <ArrowRight size={13} />

              </button>

            </div>

          </section>


          {/* =================================================
              PREVIEW
              ================================================= */}

          <aside className="create-job-preview">

            <div className="preview-header">

              <span className="panel-label">
                LIVE PREVIEW
              </span>

              <BadgeCheck size={14} />

            </div>


            <div className="preview-company">

              <div className="preview-company-logo">
                TN
              </div>

              <div>

                <strong>
                  TechNova Systems
                </strong>

                <span>
                  Bengaluru
                </span>

              </div>

            </div>


            <h2>
              Senior Full Stack Developer
            </h2>


            <div className="preview-meta">

              <span>
                Full-time
              </span>

              <span>
                3–5 years
              </span>

              <span>
                Engineering
              </span>

            </div>


            <div className="preview-divider"></div>


            <span className="panel-label">
              REQUIRED SKILLS
            </span>


            <div className="preview-skills">

              <span>
                React
              </span>

              <span>
                Node.js
              </span>

              <span>
                MongoDB
              </span>

              <span className="preferred">
                TypeScript
              </span>

            </div>


            <div className="preview-signal">

              <Target size={16} />

              <div>

                <strong>
                  Matching enabled
                </strong>

                <span>
                  Candidate profiles will be evaluated
                  against these requirements.
                </span>

              </div>

            </div>


            <div className="preview-verification">

              <BadgeCheck size={15} />

              <div>

                <strong>
                  Evidence-aware hiring
                </strong>

                <span>
                  Verified candidate skills will be
                  highlighted to recruiters.
                </span>

              </div>

            </div>


            <div className="preview-footer">

              <Users size={13} />

              <span>
                Candidates will see this role in Find Jobs.
              </span>

            </div>

          </aside>

        </div>


        {/* ===================================================
            INFORMATION BAR
            =================================================== */}

        <section className="create-job-info">

          <div className="create-job-info-icon">
            <Target size={19} />
          </div>


          <div>

            <span className="panel-label">
              WHY SKILLS MATTER
            </span>

            <h2>
              The requirements you define become the foundation
              of PulseHire matching.
            </h2>

            <p>
              When candidates apply, their verified skills are
              compared with the requirements you define here.
              This allows PulseHire to surface strong matches
              and identify meaningful skill gaps.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default CreateJob;