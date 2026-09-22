import { useEffect, useState } from "react";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getRecruiterJobs,
  updateRecruiterJobStatus,
} from "../../services/recruiterJobs";

/* =========================================================
   STATUS CONFIG
   ========================================================= */

const statusLabels = {
  active: "Active",

  draft: "Draft",

  paused: "Paused",

  closed: "Closed",
};

const statusOrder = ["all", "active", "draft", "paused", "closed"];

/* =========================================================
   HELPERS
   ========================================================= */

const formatStatus = (status) => {
  return statusLabels[String(status || "").toLowerCase()] || "Unknown";
};

const formatJobType = (value) => {
  if (!value) {
    return "Not specified";
  }

  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatSalary = (min, max) => {
  if (min == null && max == null) {
    return "Salary not specified";
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  if (min != null && max != null) {
    return `₹${formatter.format(Number(min))} – ₹${formatter.format(
      Number(max),
    )}`;
  }

  if (min != null) {
    return `From ₹${formatter.format(Number(min))}`;
  }

  return `Up to ₹${formatter.format(Number(max))}`;
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",

    month: "short",

    year: "numeric",
  });
};

const getCompanyInitials = (companyName, jobTitle) => {
  const source = companyName || jobTitle || "PulseHire";

  const parts = String(source).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "PH";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getStatusActions = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "closed") {
    return [];
  }

  if (normalized === "paused") {
    return ["active", "closed"];
  }

  if (normalized === "active") {
    return ["paused", "closed"];
  }

  /*
   * Draft jobs can be activated or closed.
   * The backend create flow only accepts draft/active
   * during creation, while status updates accept
   * active/paused/closed.
   *
   * For a draft, activate is the useful action.
   */
  if (normalized === "draft") {
    return ["active", "closed"];
  }

  return [];
};

/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,

    active: 0,

    drafts: 0,

    paused: 0,

    closed: 0,

    applicants: 0,

    applied: 0,

    reviewing: 0,

    shortlisted: 0,

    interview: 0,

    rejected: 0,

    hired: 0,

    verifiedApplicants: 0,

    strongMatches: 0,

    averageMatchRate: 0,
  });

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  const [updatingJobId, setUpdatingJobId] = useState(null);

  const [openMenuJobId, setOpenMenuJobId] = useState(null);

  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getRecruiterJobs();

        if (cancelled) {
          return;
        }

        if (!response?.success) {
          throw new Error(response?.message || "Unable to load your jobs.");
        }

        setJobs(Array.isArray(response.jobs) ? response.jobs : []);

        setSummary(
          response.summary || {
            total: response.jobs?.length || 0,
          },
        );

        setError("");
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Recruiter jobs load error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load your jobs.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     REFRESH
     ======================================================= */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      setError("");

      setSuccess("");

      const response = await getRecruiterJobs();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to refresh jobs.");
      }

      setJobs(Array.isArray(response.jobs) ? response.jobs : []);

      setSummary(response.summary || {});
    } catch (requestError) {
      console.error("Recruiter jobs refresh error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to refresh jobs.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
     SEARCH / FILTER
     ======================================================= */

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const companyName = job?.company?.name || "";

    const searchableText = [
      job?.title,
      job?.description,
      job?.location,
      companyName,
      ...(Array.isArray(job?.skills) ? job.skills : []),
      ...(Array.isArray(job?.requirements) ? job.requirements : []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);

    const status = String(job?.status || "active").toLowerCase();

    const matchesStatus = activeFilter === "all" || status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  /* =======================================================
     STATUS UPDATE
     ======================================================= */

  const handleStatusChange = async (job, nextStatus) => {
    if (!job?._id) {
      return;
    }

    const currentStatus = String(job?.status || "").toLowerCase();

    if (currentStatus === "closed" && nextStatus !== "closed") {
      setError("Closed jobs cannot be reopened.");

      setOpenMenuJobId(null);

      return;
    }

    try {
      setUpdatingJobId(job._id);

      setOpenMenuJobId(null);

      setError("");

      setSuccess("");

      const response = await updateRecruiterJobStatus(job._id, nextStatus);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update job status.");
      }

      setSuccess(
        response.message ||
          `Job status changed to ${formatStatus(nextStatus)}.`,
      );

      await handleRefresh();
    } catch (requestError) {
      console.error("Recruiter job status update error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to update job status.",
      );
    } finally {
      setUpdatingJobId(null);
    }
  };

  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  const clearFilters = () => {
    setSearchTerm("");

    setActiveFilter("all");
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="recruiter-jobs-page">
        <div
          className="recruiter-jobs-loading"
          role="status"
          aria-live="polite"
        >
          <RefreshCw size={30} className="recruiter-jobs-spin" />

          <h1>Loading your jobs</h1>

          <p>We're preparing your hiring workspace.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recruiter-jobs-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="recruiter-jobs-header-actions">
        <Link to="/recruiter/jobs/new" className="recruiter-jobs-post-button">
          <Plus size={14} />
          Post a job
        </Link>

        <button
          type="button"
          className="recruiter-jobs-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={14}
            className={refreshing ? "recruiter-jobs-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ===================================================
          ALERTS
          =================================================== */}

      {error && (
        <div className="recruiter-jobs-alert error" role="alert">
          <XCircle size={16} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="recruiter-jobs-alert success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} />

          <span>{success}</span>
        </div>
      )}

      {/* ===================================================
          SUMMARY
          =================================================== */}

      <section className="recruiter-jobs-summary">
        <div className="recruiter-jobs-summary-card primary">
          <div>
            <span>TOTAL JOBS</span>

            <strong>{summary.total ?? jobs.length}</strong>

            <small>Across your workspace</small>
          </div>

          <BriefcaseBusiness size={19} />
        </div>

        <div className="recruiter-jobs-summary-card">
          <div>
            <span>ACTIVE</span>

            <strong>{summary.active ?? 0}</strong>

            <small>Visible to candidates</small>
          </div>

          <Activity size={19} />
        </div>

        <div className="recruiter-jobs-summary-card">
          <div>
            <span>APPLICANTS</span>

            <strong>{summary.applicants ?? 0}</strong>

            <small>Across all jobs</small>
          </div>

          <Users size={19} />
        </div>

        <div className="recruiter-jobs-summary-card">
          <div>
            <span>VERIFIED</span>

            <strong>{summary.verifiedApplicants ?? 0}</strong>

            <small>Applicants with approved evidence</small>
          </div>

          <BadgeCheck size={19} />
        </div>

        <div className="recruiter-jobs-summary-card">
          <div>
            <span>MATCH RATE</span>

            <strong>{summary.averageMatchRate ?? 0}%</strong>

            <small>Average candidate alignment</small>
          </div>

          <CheckCircle2 size={19} />
        </div>
      </section>

      {/* ===================================================
          SEARCH + FILTERS
          =================================================== */}

      <section className="recruiter-jobs-toolbar">
        <div className="recruiter-jobs-search">
          <Search size={16} />

          <input
            type="search"
            aria-label="Search your jobs"
            placeholder="Search role, skill, location or company"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div
          className="recruiter-jobs-filters"
          aria-label="Filter jobs by status"
        >
          {statusOrder.map((status) => {
            const active = activeFilter === status;

            return (
              <button
                type="button"
                key={status}
                className={
                  active
                    ? "recruiter-job-filter active"
                    : "recruiter-job-filter"
                }
                onClick={() => setActiveFilter(status)}
              >
                {status === "all" ? "All jobs" : formatStatus(status)}

                {status !== "all" && (
                  <span>
                    {summary[status === "draft" ? "drafts" : status] ?? 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===================================================
          RESULT HEADER
          =================================================== */}

      <div className="recruiter-jobs-results-header">
        <div>
          <span className="recruiter-jobs-eyebrow">YOUR ROLES</span>

          <h2>Job listings</h2>

          <p>
            {filteredJobs.length} {filteredJobs.length === 1 ? "role" : "roles"}{" "}
            shown
            {searchTerm || activeFilter !== "all" ? " after filtering." : "."}
          </p>
        </div>

        {(searchTerm || activeFilter !== "all") && (
          <button
            type="button"
            className="recruiter-jobs-clear-button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ===================================================
          EMPTY
          =================================================== */}

      {filteredJobs.length === 0 ? (
        <div className="recruiter-jobs-empty">
          <div className="recruiter-jobs-empty-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <span className="recruiter-jobs-eyebrow">NO MATCHES</span>

          <h3>No jobs match your current view.</h3>

          <p>
            {jobs.length === 0
              ? "Your recruiter workspace does not contain any jobs yet."
              : "Try another search term or clear your current status filter."}
          </p>

          {(searchTerm || activeFilter !== "all") && (
            <button
              type="button"
              className="recruiter-jobs-primary-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        /* =================================================
           JOB LIST
           ================================================= */

        <section className="recruiter-jobs-list">
          {filteredJobs.map((job) => {
            const status = String(job?.status || "active").toLowerCase();

            const companyName = job?.company?.name || "Company";

            const actions = getStatusActions(status);

            const isUpdating = updatingJobId === job?._id;

            const applicantCount = job?.applicantCount ?? 0;

            const verifiedCount = job?.verifiedApplicantCount ?? 0;

            const strongMatchCount = job?.strongMatchCount ?? 0;

            return (
              <article className="recruiter-job-card" key={job?._id}>
                {/* =========================================
                      CARD HEADER
                  ========================================== */}

                <div className="recruiter-job-card-header">
                  <div className="recruiter-job-identity">
                    <div className="recruiter-job-company-icon">
                      {job?.company?.logo ? (
                        <img
                          src={job.company.logo}
                          alt={`${companyName} logo`}
                        />
                      ) : (
                        getCompanyInitials(companyName, job?.title)
                      )}
                    </div>

                    <div>
                      <div className="recruiter-job-title-row">
                        <h3>{job?.title || "Untitled role"}</h3>

                        <span className={`recruiter-job-status ${status}`}>
                          {status === "active" && <Activity size={11} />}

                          {status === "paused" && <Clock3 size={11} />}

                          {status === "closed" && <XCircle size={11} />}

                          {status === "draft" && <Clock3 size={11} />}

                          {formatStatus(status)}
                        </span>
                      </div>

                      <p>{companyName}</p>
                    </div>
                  </div>

                  <div className="recruiter-job-menu-wrapper">
                    <button
                      type="button"
                      className="recruiter-job-menu-button"
                      aria-label={`Manage ${job?.title || "job"}`}
                      aria-expanded={openMenuJobId === job?._id}
                      onClick={() =>
                        setOpenMenuJobId(
                          openMenuJobId === job?._id ? null : job?._id,
                        )
                      }
                    >
                      <ChevronDown size={16} />
                    </button>

                    {openMenuJobId === job?._id && (
                      <div className="recruiter-job-action-menu">
                        {actions.map((nextStatus) => (
                          <button
                            key={nextStatus}
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(job, nextStatus)}
                          >
                            {nextStatus === "active" && (
                              <CheckCircle2 size={13} />
                            )}

                            {nextStatus === "paused" && <Clock3 size={13} />}

                            {nextStatus === "closed" && <XCircle size={13} />}

                            {`Set ${formatStatus(nextStatus)}`}
                          </button>
                        ))}

                        {actions.length === 0 && (
                          <span>This job is closed.</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* =========================================
                      META
                  ========================================== */}

                <div className="recruiter-job-meta">
                  <span>
                    <MapPin size={13} />

                    {job?.location || "Location not specified"}
                  </span>

                  <span>
                    <BriefcaseBusiness size={13} />

                    {formatJobType(job?.jobType)}
                  </span>

                  <span>{formatSalary(job?.salaryMin, job?.salaryMax)}</span>

                  <span>Posted {formatDate(job?.createdAt)}</span>
                </div>

                {/* =========================================
                      DESCRIPTION
                  ========================================== */}

                {job?.description && (
                  <p className="recruiter-job-description">{job.description}</p>
                )}

                {/* =========================================
                      SKILLS
                  ========================================== */}

                <div className="recruiter-job-skill-row">
                  <div>
                    <span>SKILLS</span>

                    <div className="recruiter-job-skills">
                      {(Array.isArray(job?.skills)
                        ? job.skills
                        : Array.isArray(job?.requirements)
                          ? job.requirements
                          : []
                      )
                        .slice(0, 6)
                        .map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}

                      {(Array.isArray(job?.skills)
                        ? job.skills
                        : Array.isArray(job?.requirements)
                          ? job.requirements
                          : []
                      ).length > 6 && (
                        <span className="more">
                          +
                          {(Array.isArray(job?.skills)
                            ? job.skills
                            : Array.isArray(job?.requirements)
                              ? job.requirements
                              : []
                          ).length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* =========================================
                      PIPELINE STATS
                  ========================================== */}

                <div className="recruiter-job-stat-grid">
                  <div>
                    <span>APPLICANTS</span>

                    <strong>{applicantCount}</strong>

                    <small>total candidates</small>
                  </div>

                  <div>
                    <span>REVIEWING</span>

                    <strong>{job?.reviewingApplications ?? 0}</strong>

                    <small>under review</small>
                  </div>

                  <div>
                    <span>SHORTLISTED</span>

                    <strong>{job?.shortlistedApplications ?? 0}</strong>

                    <small>moved forward</small>
                  </div>

                  <div>
                    <span>INTERVIEWS</span>

                    <strong>{job?.interviewApplications ?? 0}</strong>

                    <small>interview stage</small>
                  </div>

                  <div>
                    <span>VERIFIED</span>

                    <strong>{verifiedCount}</strong>

                    <small>approved evidence</small>
                  </div>

                  <div>
                    <span>STRONG MATCH</span>

                    <strong>{strongMatchCount}</strong>

                    <small>80%+ alignment</small>
                  </div>
                </div>

                {/* =========================================
                      FOOTER
                  ========================================== */}

                <div className="recruiter-job-card-footer">
                  <div className="recruiter-job-match">
                    <div>
                      <span>AVERAGE MATCH</span>

                      <strong>{job?.matchRate ?? 0}%</strong>
                    </div>

                    <div className="recruiter-job-match-bar">
                      <span
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(job?.matchRate || 0)),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="recruiter-job-card-actions">
                    <Link
                      to={`/recruiter/applications/${job?._id}`}
                      className="recruiter-job-applications-link"
                    >
                      Review applicants
                      <ArrowRight size={13} />
                    </Link>

                    <span className="recruiter-job-updated">
                      {isUpdating
                        ? "Updating..."
                        : `Last activity ${formatDate(
                            job?.lastRecruiterActivity,
                          )}`}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ===================================================
          WORKSPACE INSIGHT
          =================================================== */}

      <section className="recruiter-jobs-insight">
        <div className="recruiter-jobs-insight-icon">
          <BadgeCheck size={20} />
        </div>

        <div>
          <span className="recruiter-jobs-eyebrow">
            PULSEHIRE MATCH INTELLIGENCE
          </span>

          <h2>Candidate quality is more than application volume.</h2>

          <p>
            Your job workspace surfaces applicant volume, approved skill
            evidence and candidate-job match signals together so hiring
            decisions are based on stronger evidence.
          </p>
        </div>
      </section>
    </section>
  );
};

export default RecruiterJobs;
