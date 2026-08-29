import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Search,
  Target,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";


const RecruiterCandidates = () => {
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
              className="sidebar-link active"
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
              TALENT POOL
            </span>

            <h1>
              Find people by what they can prove.
            </h1>

            <p>
              Explore candidates using verified skills,
              experience and evidence-backed profiles.
            </p>

          </div>


          <div className="candidate-pool-count">

            <strong>
              1,248
            </strong>

            <span>
              candidates in pool
            </span>

          </div>

        </header>


        {/* ===================================================
            SEARCH
            =================================================== */}

        <section className="candidate-search-panel">

          <div className="candidate-search-box">

            <Search size={15} />

            <input
              type="text"
              placeholder="Search by name, skill, role or technology..."
            />

          </div>


          <div className="candidate-filter-row">

            <select defaultValue="All Skills">

              <option>
                All Skills
              </option>

              <option>
                React
              </option>

              <option>
                Node.js
              </option>

              <option>
                MongoDB
              </option>

              <option>
                TypeScript
              </option>

            </select>


            <select defaultValue="Verification">

              <option>
                Verification
              </option>

              <option>
                Fully Verified
              </option>

              <option>
                Partially Verified
              </option>

              <option>
                Not Verified
              </option>

            </select>


            <select defaultValue="Experience">

              <option>
                Experience
              </option>

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


            <button
              className="candidate-filter-button"
              type="button"
            >

              <Target size={13} />

              More Filters

            </button>

          </div>

        </section>


        {/* ===================================================
            POOL SUMMARY
            =================================================== */}

        <section className="candidate-pool-summary">

          <div>

            <span>
              SEARCH RESULTS
            </span>

            <strong>
              84 candidates
            </strong>

          </div>


          <div>

            <span>
              VERIFIED
            </span>

            <strong>
              61
            </strong>

          </div>


          <div>

            <span>
              STRONG MATCHES
            </span>

            <strong>
              27
            </strong>

          </div>


          <div>

            <span>
              ACTIVE
            </span>

            <strong>
              49
            </strong>

          </div>


          <div className="candidate-sort">

            <span>
              SORT BY
            </span>

            <select defaultValue="Relevance">

              <option>
                Relevance
              </option>

              <option>
                Highest Match
              </option>

              <option>
                Most Verified
              </option>

              <option>
                Recently Active
              </option>

            </select>

          </div>

        </section>


        {/* ===================================================
            CANDIDATES
            =================================================== */}

        <section className="candidate-pool-panel">

          <div className="candidate-pool-heading">

            <div>

              <span className="panel-label">
                TALENT DISCOVERY
              </span>

              <h2>
                Candidates worth exploring.
              </h2>

            </div>

            <span>
              1–4 of 84
            </span>

          </div>


          <div className="candidate-pool-list">


            {/* =================================================
                CANDIDATE 1
                ================================================= */}

            <article className="talent-card">

              <div className="talent-identity">

                <div className="talent-avatar">
                  AK
                </div>


                <div>

                  <div className="talent-name">

                    <h3>
                      Arjun Kumar
                    </h3>

                    <BadgeCheck size={12} />

                  </div>


                  <p>
                    Full Stack Developer · 3 years
                  </p>


                  <span>
                    Bengaluru · Available
                  </span>

                </div>

              </div>


              <div className="talent-verification">

                <span>
                  VERIFICATION
                </span>

                <strong>
                  91%
                </strong>

                <small>
                  evidence strength
                </small>

              </div>


              <div className="talent-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span>
                    React
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    Node.js
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    MongoDB
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    Git
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="talent-match">

                <span>
                  POTENTIAL MATCH
                </span>

                <strong>
                  94%
                </strong>

                <small>
                  Full Stack roles
                </small>

              </div>


              <Link
                to="/recruiter/candidates/arjun"
                className="talent-view"
              >

                View Profile

                <ArrowRight size={12} />

              </Link>

            </article>


            {/* =================================================
                CANDIDATE 2
                ================================================= */}

            <article className="talent-card">

              <div className="talent-identity">

                <div className="talent-avatar">
                  RS
                </div>


                <div>

                  <div className="talent-name">

                    <h3>
                      Riya Sharma
                    </h3>

                    <BadgeCheck size={12} />

                  </div>


                  <p>
                    Frontend Engineer · 4 years
                  </p>


                  <span>
                    Hyderabad · Available
                  </span>

                </div>

              </div>


              <div className="talent-verification">

                <span>
                  VERIFICATION
                </span>

                <strong>
                  96%
                </strong>

                <small>
                  evidence strength
                </small>

              </div>


              <div className="talent-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span>
                    React
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    TypeScript
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    Testing
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="talent-match">

                <span>
                  POTENTIAL MATCH
                </span>

                <strong>
                  91%
                </strong>

                <small>
                  Frontend roles
                </small>

              </div>


              <Link
                to="/recruiter/candidates/riya"
                className="talent-view"
              >

                View Profile

                <ArrowRight size={12} />

              </Link>

            </article>


            {/* =================================================
                CANDIDATE 3
                ================================================= */}

            <article className="talent-card">

              <div className="talent-identity">

                <div className="talent-avatar">
                  VM
                </div>


                <div>

                  <div className="talent-name">

                    <h3>
                      Vikram Mehta
                    </h3>

                    <BadgeCheck size={12} />

                  </div>


                  <p>
                    Backend Developer · 3 years
                  </p>


                  <span>
                    Pune · Open to opportunities
                  </span>

                </div>

              </div>


              <div className="talent-verification">

                <span>
                  VERIFICATION
                </span>

                <strong>
                  88%
                </strong>

                <small>
                  evidence strength
                </small>

              </div>


              <div className="talent-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span>
                    Node.js
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    MongoDB
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    Docker
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="talent-match">

                <span>
                  POTENTIAL MATCH
                </span>

                <strong>
                  87%
                </strong>

                <small>
                  Backend roles
                </small>

              </div>


              <Link
                to="/recruiter/candidates/vikram"
                className="talent-view"
              >

                View Profile

                <ArrowRight size={12} />

              </Link>

            </article>


            {/* =================================================
                CANDIDATE 4
                ================================================= */}

            <article className="talent-card">

              <div className="talent-identity">

                <div className="talent-avatar">
                  NP
                </div>


                <div>

                  <div className="talent-name">

                    <h3>
                      Neha Patel
                    </h3>

                    <BadgeCheck size={12} />

                  </div>


                  <p>
                    Full Stack Developer · 5 years
                  </p>


                  <span>
                    Mumbai · Available
                  </span>

                </div>

              </div>


              <div className="talent-verification">

                <span>
                  VERIFICATION
                </span>

                <strong>
                  94%
                </strong>

                <small>
                  evidence strength
                </small>

              </div>


              <div className="talent-skills">

                <span>
                  VERIFIED SKILLS
                </span>

                <div>

                  <span>
                    React
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    Node.js
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    PostgreSQL
                    <BadgeCheck size={9} />
                  </span>

                  <span>
                    AWS
                    <BadgeCheck size={9} />
                  </span>

                </div>

              </div>


              <div className="talent-match">

                <span>
                  POTENTIAL MATCH
                </span>

                <strong>
                  89%
                </strong>

                <small>
                  Full Stack roles
                </small>

              </div>


              <Link
                to="/recruiter/candidates/neha"
                className="talent-view"
              >

                View Profile

                <ArrowRight size={12} />

              </Link>

            </article>

          </div>


          {/* =================================================
              PAGINATION
              ================================================= */}

          <div className="candidate-pagination">

            <span>
              Showing 4 of 84 candidates
            </span>


            <div>

              <button
                type="button"
                disabled
              >
                Previous
              </button>

              <button
                type="button"
                className="candidate-page-active"
              >
                1
              </button>

              <button type="button">
                2
              </button>

              <button type="button">
                3
              </button>

              <button type="button">
                4
              </button>

              <button type="button">
                Next
              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            INSIGHT
            =================================================== */}

        <section className="recruiter-insight">

          <div className="recruiter-insight-icon">
            <CheckCircle2 size={21} />
          </div>


          <div>

            <span className="panel-label">
              TALENT DISCOVERY
            </span>

            <h2>
              Search for demonstrated ability, not just keywords.
            </h2>

            <p>
              PulseHire lets recruiters discover candidates through
              verified skills and evidence strength, helping surface
              people whose capabilities align with real role requirements.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default RecruiterCandidates;