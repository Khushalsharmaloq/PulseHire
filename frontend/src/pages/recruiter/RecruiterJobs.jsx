import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  BriefcaseBusiness,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Users,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const RecruiterJobs = () => {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    drafts: 0,
    paused: 0,
    closed: 0,
    applicants: 0,
    verifiedApplicants: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | LOAD JOBS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/job/my");

        if (cancelled) {
          return;
        }

        if (response.data?.success) {
          setJobs(response.data.jobs || []);

          setSummary(
            response.data.summary || {
              total: 0,
              active: 0,
              drafts: 0,
              paused: 0,
              closed: 0,
              applicants: 0,
              verifiedApplicants: 0,
            },
          );
        }
      } catch (requestError) {
        console.error("Recruiter jobs loading error:", requestError);

        if (!cancelled) {
          setError(
            requestError.response?.data?.message || "Unable to load your jobs.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return "PH";
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const getFormattedDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const createdAt = new Date(date);

    if (Number.isNaN(createdAt.getTime())) {
      return "Date unavailable";
    }

    return createdAt.toLocaleDateString();
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: "Active",
      draft: "Draft",
      paused: "Paused",
      closed: "Closed",
    };

    return labels[status] || "Unknown";
  };

  /*
  |--------------------------------------------------------------------------
  | FILTERED JOBS
  |--------------------------------------------------------------------------
  */

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        String(job.title || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(job.description || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(job.location || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (job.skills || []).some((skill) =>
          String(skill).toLowerCase().includes(normalizedSearch),
        );

      const matchesFilter =
        activeFilter === "all" || job.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchTerm, activeFilter]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="recruiter-dashboard">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="recruiter-sidebar">
        <Link to="/recruiter/dashboard" className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <span>PulseHire</span>
        </Link>

        <div className="sidebar-section">
          <span className="sidebar-label">RECRUITER WORKSPACE</span>

          <nav className="sidebar-nav">
            <Link to="/recruiter/dashboard" className="sidebar-link">
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link to="/recruiter/jobs" className="sidebar-link active">
              <BriefcaseBusiness size={17} />
              My Jobs
            </Link>

            <Link to="/recruiter/applications" className="sidebar-link">
              <FileCheck2 size={17} />
              Applications
            </Link>

            <Link to="/recruiter/candidates" className="sidebar-link">
              <Users size={17} />
              Candidates
            </Link>

            <Link to="/recruiter/verification" className="sidebar-link">
              <BadgeCheck size={17} />
              Verification
            </Link>

            <Link to="/recruiter/analytics" className="sidebar-link">
              <BarChart3 size={17} />
              Analytics
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar recruiter-avatar">
              {getInitials(user?.fullname)}
            </div>

            <div>
              <strong>{user?.fullname || "Recruiter"}</strong>

              <span>Recruiter</span>
            </div>
          </div>

          <button className="logout-button" type="button" onClick={logout}>
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
            <span className="dashboard-eyebrow">JOB MANAGEMENT</span>

            <h1>Your hiring pipeline starts here.</h1>
          </div>

          <Link to="/recruiter/jobs/create" className="recruiter-create-button">
            <Plus size={14} />
            Post a Job
          </Link>
        </header>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && <div className="verification-message error">{error}</div>}

        {/* ===================================================
            SUMMARY
        =================================================== */}

        <section className="recruiter-summary">
          <div className="recruiter-stat">
            <div className="recruiter-stat-icon">
              <BriefcaseBusiness size={16} />
            </div>

            <span>ACTIVE</span>

            <strong>{summary.active}</strong>

            <small>jobs currently hiring</small>
          </div>

          <div className="recruiter-stat">
            <div className="recruiter-stat-icon">
              <BriefcaseBusiness size={16} />
            </div>

            <span>DRAFTS</span>

            <strong>{summary.drafts}</strong>

            <small>waiting to publish</small>
          </div>

          <div className="recruiter-stat">
            <div className="recruiter-stat-icon">
              <Users size={16} />
            </div>

            <span>APPLICANTS</span>

            <strong>{summary.applicants}</strong>

            <small>across your jobs</small>
          </div>

          <div className="recruiter-stat">
            <div className="recruiter-stat-icon">
              <Target size={16} />
            </div>

            <span>VERIFIED</span>

            <strong>{summary.verifiedApplicants}</strong>

            <small>applicants with verified evidence</small>
          </div>
        </section>

        {/* ===================================================
            SEARCH + FILTER
        =================================================== */}

        <section className="recruiter-job-toolbar">
          <div className="recruiter-job-search">
            <Search size={14} />

            <input
              type="text"
              placeholder="Search your jobs..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="recruiter-job-tabs">
            {[
              ["all", "All"],
              ["active", "Active"],
              ["draft", "Drafts"],
              ["paused", "Paused"],
              ["closed", "Closed"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`job-tab ${activeFilter === value ? "active" : ""}`}
                onClick={() => setActiveFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ===================================================
            JOBS
        =================================================== */}

        <section className="recruiter-jobs-section">
          <div className="recruiter-panel-heading">
            <div>
              <span className="panel-label">YOUR JOBS</span>

              <h2>Open positions.</h2>
            </div>

            <span className="recruiter-jobs-count">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>

          {loading ? (
            <div className="verification-empty-state">
              <BriefcaseBusiness size={26} />

              <h3>Loading your jobs...</h3>

              <p>Fetching positions from your PulseHire account.</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="verification-empty-state">
              <BriefcaseBusiness size={26} />

              <h3>
                {jobs.length === 0
                  ? "You haven't posted any jobs yet."
                  : "No jobs match your current filter."}
              </h3>

              <p>
                {jobs.length === 0
                  ? "Create your first position to start building your hiring pipeline."
                  : "Try another search term or status filter."}
              </p>

              {jobs.length === 0 && (
                <Link
                  to="/recruiter/jobs/create"
                  className="recruiter-create-button"
                >
                  <Plus size={14} />
                  Post Your First Job
                </Link>
              )}
            </div>
          ) : (
            <div className="recruiter-full-job-list">
              {filteredJobs.map((job) => {
                const skills = Array.isArray(job.skills) ? job.skills : [];

                return (
                  <article className="recruiter-full-job-card" key={job._id}>
                    {/* =========================================
                          HEADER
                      ========================================= */}

                    <div className="recruiter-full-job-header">
                      <div className="recruiter-full-job-identity">
                        <div className="recruiter-job-icon large">
                          {getInitials(job.title)}
                        </div>

                        <div>
                          <div className="recruiter-full-job-title">
                            <h3>{job.title}</h3>

                            <span className={`full-job-status ${job.status}`}>
                              {getStatusLabel(job.status)}
                            </span>
                          </div>

                          <p>
                            {job.location || "Location not specified"}
                            {" · "}
                            {job.jobType || "Job type not specified"}
                          </p>

                          <small>
                            Posted {getFormattedDate(job.createdAt)}
                          </small>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="job-more-button"
                        title="Job actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {/* =========================================
                          STATS
                      ========================================= */}

                    <div className="recruiter-full-job-stats">
                      <div>
                        <span>APPLICANTS</span>

                        <strong>{job.applicantCount || 0}</strong>
                      </div>

                      <div>
                        <span>PENDING</span>

                        <strong>{job.pendingApplications || 0}</strong>
                      </div>

                      <div>
                        <span>ACCEPTED</span>

                        <strong>{job.acceptedApplications || 0}</strong>
                      </div>

                      <div>
                        <span>MATCH RATE</span>

                        <strong>{job.matchRate || 0}%</strong>
                      </div>
                    </div>

                    {/* =========================================
                          SKILLS
                      ========================================= */}

                    <div className="recruiter-full-job-skills">
                      <span>REQUIRED SKILLS</span>

                      <div>
                        {skills.length > 0 ? (
                          skills.map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))
                        ) : (
                          <span>No skills specified</span>
                        )}
                      </div>
                    </div>

                    {/* =========================================
                          FOOTER
                      ========================================= */}

                    <div className="recruiter-full-job-footer">
                      <div className="verification-coverage">
                        <BadgeCheck size={13} />

                        <span>
                          {job.verifiedApplicantCount || 0} applicants with
                          verified evidence
                        </span>
                      </div>

                      <Link to={`/recruiter/applications?jobId=${job._id}`}>
                        Review applicants
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ===================================================
            INSIGHT
        =================================================== */}

        <section className="recruiter-insight">
          <div className="recruiter-insight-icon">
            <Target size={21} />
          </div>

          <div>
            <span className="panel-label">HIRING INSIGHT</span>

            <h2>Start with clear skill requirements.</h2>

            <p>
              Your jobs now come directly from MongoDB. PulseHire will use their
              skills and requirements to power evidence-backed candidate
              matching as the matching layer is completed.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RecruiterJobs;
