import { useEffect, useState } from "react";

import {
  Activity,
  ArrowRight,
  BarChart3,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getRecruiterAnalytics } from "../../services/recruiterDashboard";

/* =========================================================
   HELPERS
   ========================================================= */

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
};

const formatPercent = (value) => {
  return `${Math.round(Number(value || 0))}%`;
};

const formatHours = (value) => {
  const hours = Number(value || 0);

  if (hours <= 0) {
    return "—";
  }

  if (hours < 1) {
    return "<1h";
  }

  if (hours < 24) {
    return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)}h`;
  }

  const days = hours / 24;

  return `${days.toFixed(days % 1 === 0 ? 0 : 1)}d`;
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

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",

    month: "short",

    hour: "2-digit",

    minute: "2-digit",
  });
};

const formatStatus = (status) => {
  const labels = {
    applied: "Applied",

    reviewing: "Reviewing",

    shortlisted: "Shortlisted",

    interview: "Interview",

    rejected: "Rejected",

    hired: "Hired",
  };

  return labels[String(status || "").toLowerCase()] || status || "Unknown";
};

const getActivityIcon = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "hired":
      return CheckCircle2;

    case "rejected":
      return XCircle;

    case "shortlisted":
      return Target;

    case "interview":
      return UserCheck;

    default:
      return Activity;
  }
};

const getMatchTone = (value) => {
  const score = Number(value || 0);

  if (score >= 80) {
    return "strong";
  }

  if (score >= 60) {
    return "good";
  }

  return "low";
};

/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getRecruiterAnalytics();

        if (cancelled) {
          return;
        }

        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to load recruiter analytics.",
          );
        }

        setData(response);

        setError("");
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Recruiter dashboard load error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load recruiter analytics.",
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

      const response = await getRecruiterAnalytics();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to refresh recruiter analytics.",
        );
      }

      setData(response);
    } catch (requestError) {
      console.error("Recruiter dashboard refresh error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to refresh recruiter analytics.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="recruiter-dashboard-page">
        <div
          className="recruiter-dashboard-loading"
          role="status"
          aria-live="polite"
        >
          <RefreshCw size={32} className="recruiter-dashboard-spin" />

          <h1>Preparing your recruiter dashboard</h1>

          <p>We're calculating your current hiring signals.</p>
        </div>
      </section>
    );
  }

  const summary = data?.summary || {};

  const funnel = data?.funnel || {};

  const jobPerformance = Array.isArray(data?.jobPerformance)
    ? data.jobPerformance
    : [];

  const topRequiredSkills = Array.isArray(data?.topRequiredSkills)
    ? data.topRequiredSkills
    : [];

  const recentApplications = Array.isArray(data?.recentApplications)
    ? data.recentApplications
    : [];

  const recentHiringActivity = Array.isArray(data?.recentHiringActivity)
    ? data.recentHiringActivity
    : [];

  const funnelMaximum = Math.max(Number(funnel.applied || 0), 1);

  const bestJobs = jobPerformance.slice(0, 5);

  return (
    <section className="recruiter-dashboard-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="recruiter-dashboard-header">
        <div>
          <span className="recruiter-dashboard-eyebrow">
            RECRUITER OVERVIEW
          </span>

          <h1>Your hiring command center.</h1>

          <p>
            See job performance, candidate quality and hiring activity from one
            workspace.
          </p>
        </div>

        <div className="recruiter-dashboard-header-actions">
          <Link
            to="/recruiter/jobs/new"
            className="recruiter-dashboard-primary-action"
          >
            <BriefcaseBusiness size={14} />
            Post a job
          </Link>

          <button
            type="button"
            className="recruiter-dashboard-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={14}
              className={refreshing ? "recruiter-dashboard-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div className="recruiter-dashboard-alert" role="alert">
          <XCircle size={16} />

          <span>{error}</span>
        </div>
      )}

      {/* ===================================================
          CORE METRICS
          =================================================== */}

      <section className="recruiter-dashboard-metrics">
        <div className="recruiter-dashboard-metric primary">
          <div>
            <span>TOTAL JOBS</span>

            <strong>{formatNumber(summary.totalJobs)}</strong>

            <small>{formatNumber(summary.activeJobs)} active roles</small>
          </div>

          <BriefcaseBusiness size={20} />
        </div>

        <div className="recruiter-dashboard-metric">
          <div>
            <span>APPLICATIONS</span>

            <strong>{formatNumber(summary.totalApplications)}</strong>

            <small>
              {formatNumber(summary.applicationsLast7Days)} in the last 7 days
            </small>
          </div>

          <Users size={20} />
        </div>

        <div className="recruiter-dashboard-metric">
          <div>
            <span>VERIFIED APPLICANTS</span>

            <strong>{formatNumber(summary.verifiedApplicants)}</strong>

            <small>approved skill evidence</small>
          </div>

          <BadgeCheck size={20} />
        </div>

        <div className="recruiter-dashboard-metric">
          <div>
            <span>STRONG MATCHES</span>

            <strong>{formatNumber(summary.strongMatches)}</strong>

            <small>candidate alignment at 80%+</small>
          </div>

          <Sparkles size={20} />
        </div>

        <div className="recruiter-dashboard-metric">
          <div>
            <span>AVG MATCH</span>

            <strong>{formatPercent(summary.averageMatchRate)}</strong>

            <small>across scored applications</small>
          </div>

          <Target size={20} />
        </div>

        <div className="recruiter-dashboard-metric">
          <div>
            <span>RESPONSE TIME</span>

            <strong>{formatHours(summary.averageResponseHours)}</strong>

            <small>average first response</small>
          </div>

          <Clock3 size={20} />
        </div>
      </section>

      {/* ===================================================
          SECONDARY METRICS
          =================================================== */}

      <section className="recruiter-dashboard-secondary-metrics">
        <div>
          <span>SHORTLIST RATE</span>

          <strong>{formatPercent(summary.shortlistRate)}</strong>

          <small>applications reaching shortlist</small>
        </div>

        <div>
          <span>INTERVIEW RATE</span>

          <strong>{formatPercent(summary.interviewRate)}</strong>

          <small>applications reaching interview</small>
        </div>

        <div>
          <span>HIRING CONVERSION</span>

          <strong>{formatPercent(summary.hiringConversionRate)}</strong>

          <small>applications resulting in hires</small>
        </div>

        <div>
          <span>PAUSED JOBS</span>

          <strong>{formatNumber(summary.pausedJobs)}</strong>

          <small>temporarily not accepting</small>
        </div>
      </section>

      {/* ===================================================
          MAIN GRID
          =================================================== */}

      <div className="recruiter-dashboard-main-grid">
        {/* ================================================
            FUNNEL
            ================================================ */}

        <section className="recruiter-dashboard-panel">
          <div className="recruiter-dashboard-panel-heading">
            <div>
              <span className="recruiter-dashboard-eyebrow">
                APPLICATION FLOW
              </span>

              <h2>Hiring funnel</h2>

              <p>
                See where candidates are moving through your recruitment
                process.
              </p>
            </div>

            <BarChart3 size={18} />
          </div>

          <div className="recruiter-dashboard-funnel">
            {[
              {
                key: "applied",

                label: "Applied",

                value: funnel.applied,

                tone: "applied",
              },

              {
                key: "reviewing",

                label: "Reviewing",

                value: funnel.reviewing,

                tone: "reviewing",
              },

              {
                key: "shortlisted",

                label: "Shortlisted",

                value: funnel.shortlisted,

                tone: "shortlisted",
              },

              {
                key: "interview",

                label: "Interview",

                value: funnel.interview,

                tone: "interview",
              },

              {
                key: "hired",

                label: "Hired",

                value: funnel.hired,

                tone: "hired",
              },
            ].map((stage) => {
              const value = Number(stage.value || 0);

              const width = Math.min(
                100,
                Math.max(4, (value / funnelMaximum) * 100),
              );

              return (
                <div className="recruiter-dashboard-funnel-row" key={stage.key}>
                  <div className="recruiter-dashboard-funnel-label">
                    <span>{stage.label}</span>

                    <strong>{formatNumber(value)}</strong>
                  </div>

                  <div className="recruiter-dashboard-funnel-track">
                    <span
                      className={`recruiter-dashboard-funnel-fill ${stage.tone}`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="recruiter-dashboard-funnel-footer">
            <span>Rejected</span>

            <strong>{formatNumber(funnel.rejected)}</strong>
          </div>
        </section>

        {/* ================================================
            HIRING HEALTH
            ================================================ */}

        <section className="recruiter-dashboard-panel">
          <div className="recruiter-dashboard-panel-heading">
            <div>
              <span className="recruiter-dashboard-eyebrow">HIRING HEALTH</span>

              <h2>Pipeline signals</h2>

              <p>
                The operational indicators behind your current hiring activity.
              </p>
            </div>

            <TrendingUp size={18} />
          </div>

          <div className="recruiter-dashboard-health-list">
            <div>
              <div className="recruiter-dashboard-health-icon">
                <Activity size={15} />
              </div>

              <div>
                <span>Active roles</span>

                <strong>{formatNumber(summary.activeJobs)}</strong>
              </div>
            </div>

            <div>
              <div className="recruiter-dashboard-health-icon">
                <FileCheck2 size={15} />
              </div>

              <div>
                <span>Verified applicants</span>

                <strong>{formatNumber(summary.verifiedApplicants)}</strong>
              </div>
            </div>

            <div>
              <div className="recruiter-dashboard-health-icon">
                <Sparkles size={15} />
              </div>

              <div>
                <span>Strong matches</span>

                <strong>{formatNumber(summary.strongMatches)}</strong>
              </div>
            </div>

            <div>
              <div className="recruiter-dashboard-health-icon">
                <Clock3 size={15} />
              </div>

              <div>
                <span>Average response</span>

                <strong>{formatHours(summary.averageResponseHours)}</strong>
              </div>
            </div>
          </div>

          <div className="recruiter-dashboard-conversion">
            <div>
              <span>HIRING CONVERSION</span>

              <strong>{formatPercent(summary.hiringConversionRate)}</strong>
            </div>

            <div className="recruiter-dashboard-conversion-bar">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Number(summary.hiringConversionRate || 0)),
                  )}%`,
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* ===================================================
          JOB PERFORMANCE
          =================================================== */}

      <section className="recruiter-dashboard-panel recruiter-dashboard-job-performance">
        <div className="recruiter-dashboard-panel-heading">
          <div>
            <span className="recruiter-dashboard-eyebrow">
              ROLE PERFORMANCE
            </span>

            <h2>How your jobs are performing</h2>

            <p>
              Roles are ranked by applicant volume while match and evidence
              quality remain visible.
            </p>
          </div>

          <Link to="/recruiter/jobs" className="recruiter-dashboard-panel-link">
            Manage jobs
            <ArrowRight size={13} />
          </Link>
        </div>

        {bestJobs.length === 0 ? (
          <div className="recruiter-dashboard-empty-inline">
            <BriefcaseBusiness size={20} />

            <span>
              Create your first job to start seeing role performance here.
            </span>
          </div>
        ) : (
          <div className="recruiter-dashboard-job-table">
            <div className="recruiter-dashboard-job-table-header">
              <span>ROLE</span>

              <span>STATUS</span>

              <span>APPLICANTS</span>

              <span>VERIFIED</span>

              <span>STRONG</span>

              <span>MATCH</span>

              <span>HIRED</span>
            </div>

            {bestJobs.map((job) => {
              const matchTone = getMatchTone(job?.averageMatchRate);

              return (
                <div
                  className="recruiter-dashboard-job-row"
                  key={String(job?.jobId)}
                >
                  <div className="recruiter-dashboard-job-name">
                    <div className="recruiter-dashboard-job-icon">
                      <BriefcaseBusiness size={14} />
                    </div>

                    <div>
                      <strong>{job?.title || "Untitled role"}</strong>

                      <span>{job?.company || "Company"}</span>
                    </div>
                  </div>

                  <span
                    className={`recruiter-dashboard-job-status ${
                      job?.status || "unknown"
                    }`}
                  >
                    {formatStatus(job?.status)}
                  </span>

                  <strong>{formatNumber(job?.applicants)}</strong>

                  <strong>{formatNumber(job?.verifiedApplicants)}</strong>

                  <strong>{formatNumber(job?.strongMatches)}</strong>

                  <span className={`recruiter-dashboard-match ${matchTone}`}>
                    {formatPercent(job?.averageMatchRate)}
                  </span>

                  <strong>{formatNumber(job?.hired)}</strong>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================================================
          BOTTOM GRID
          =================================================== */}

      <div className="recruiter-dashboard-bottom-grid">
        {/* ================================================
            TOP SKILLS
            ================================================ */}

        <section className="recruiter-dashboard-panel">
          <div className="recruiter-dashboard-panel-heading">
            <div>
              <span className="recruiter-dashboard-eyebrow">DEMAND SIGNAL</span>

              <h2>Top required skills</h2>

              <p>
                Skills appearing most frequently across your active hiring
                requirements.
              </p>
            </div>

            <Target size={18} />
          </div>

          {topRequiredSkills.length === 0 ? (
            <div className="recruiter-dashboard-empty-inline">
              <Target size={20} />

              <span>Add skills to your jobs to build a demand profile.</span>
            </div>
          ) : (
            <div className="recruiter-dashboard-skills-list">
              {topRequiredSkills.map((skill, index) => {
                const maximum = Math.max(
                  1,
                  Number(topRequiredSkills[0]?.count || 1),
                );

                const width = Math.max(
                  8,
                  (Number(skill?.count || 0) / maximum) * 100,
                );

                return (
                  <div
                    className="recruiter-dashboard-skill-row"
                    key={`${skill?.skill || "skill"}-${index}`}
                  >
                    <div>
                      <strong>{skill?.skill || "Unknown skill"}</strong>

                      <span>{formatNumber(skill?.count)} roles</span>
                    </div>

                    <div className="recruiter-dashboard-skill-bar">
                      <span
                        style={{
                          width: `${Math.min(100, width)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================
            RECENT APPLICATIONS
            ================================================ */}

        <section className="recruiter-dashboard-panel">
          <div className="recruiter-dashboard-panel-heading">
            <div>
              <span className="recruiter-dashboard-eyebrow">
                RECENT ACTIVITY
              </span>

              <h2>Latest applications</h2>

              <p>
                The newest candidate submissions across your recruiter
                workspace.
              </p>
            </div>

            <Link
              to="/recruiter/candidates"
              className="recruiter-dashboard-panel-link"
            >
              Candidates
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="recruiter-dashboard-empty-inline">
              <Users size={20} />

              <span>No applications have arrived yet.</span>
            </div>
          ) : (
            <div className="recruiter-dashboard-activity-list">
              {recentApplications.slice(0, 6).map((application) => (
                <Link
                  to={
                    application?.job?.id
                      ? `/recruiter/applications/${application.job.id}`
                      : "/recruiter/candidates"
                  }
                  className="recruiter-dashboard-activity-row"
                  key={String(application?.applicationId)}
                >
                  <div className="recruiter-dashboard-activity-avatar">
                    {String(application?.candidate?.fullname || "CA")
                      .trim()
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="recruiter-dashboard-activity-copy">
                    <strong>
                      {application?.candidate?.fullname || "Candidate"}
                    </strong>

                    <span>{application?.job?.title || "Untitled role"}</span>
                  </div>

                  <div className="recruiter-dashboard-activity-meta">
                    <span
                      className={`recruiter-dashboard-activity-status ${
                        application?.status || "unknown"
                      }`}
                    >
                      {formatStatus(application?.status)}
                    </span>

                    <small>{formatDate(application?.appliedAt)}</small>
                  </div>

                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ===================================================
          HIRING ACTIVITY
          =================================================== */}

      <section className="recruiter-dashboard-panel recruiter-dashboard-hiring-activity">
        <div className="recruiter-dashboard-panel-heading">
          <div>
            <span className="recruiter-dashboard-eyebrow">STATE CHANGES</span>

            <h2>Recent hiring activity</h2>

            <p>
              Candidate decisions and progress across your recruiter-owned jobs.
            </p>
          </div>

          <Activity size={18} />
        </div>

        {recentHiringActivity.length === 0 ? (
          <div className="recruiter-dashboard-empty-inline">
            <Activity size={20} />

            <span>
              Status changes will appear here as your hiring team progresses
              candidates.
            </span>
          </div>
        ) : (
          <div className="recruiter-dashboard-hiring-grid">
            {recentHiringActivity.slice(0, 8).map((activity) => {
              const ActivityIcon = getActivityIcon(activity?.status);

              return (
                <div
                  className="recruiter-dashboard-hiring-item"
                  key={String(activity?.applicationId)}
                >
                  <div className="recruiter-dashboard-hiring-icon">
                    <ActivityIcon size={14} />
                  </div>

                  <div className="recruiter-dashboard-hiring-copy">
                    <strong>{activity?.candidate || "Candidate"}</strong>

                    <span>
                      {formatStatus(activity?.status)} ·{" "}
                      {activity?.job || "Job"}
                    </span>
                  </div>

                  <small>{formatDateTime(activity?.updatedAt)}</small>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================================================
          QUICK ACTIONS
          =================================================== */}

      <section className="recruiter-dashboard-quick-actions">
        <div>
          <span className="recruiter-dashboard-eyebrow">
            RECRUITER WORKSPACE
          </span>

          <h2>Keep the hiring loop moving.</h2>

          <p>
            Create roles, inspect candidate evidence and manage applications
            without leaving your recruiter workspace.
          </p>
        </div>

        <div className="recruiter-dashboard-quick-links">
          <Link to="/recruiter/jobs/new">
            <BriefcaseBusiness size={14} />
            Post job
          </Link>

          <Link to="/recruiter/candidates">
            <Users size={14} />
            Browse candidates
          </Link>

          <Link to="/recruiter/jobs">
            <BarChart3 size={14} />
            Manage jobs
          </Link>

          <Link to="/recruiter/company">
            <BriefcaseBusiness size={14} />
            Company workspace
          </Link>
        </div>
      </section>
    </section>
  );
};

export default RecruiterDashboard;
