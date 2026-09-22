import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  LoaderCircle,
  MapPin,
  Send,
  ShieldCheck,
  Target,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeSkill = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const uniqueSkills = (skills = []) => {
  const map = new Map();

  for (const skill of skills) {
    const readable = String(skill || "").trim();

    if (!readable) {
      continue;
    }

    const normalized = normalizeSkill(readable);

    if (!map.has(normalized)) {
      map.set(normalized, readable);
    }
  }

  return [...map.values()];
};

const clampScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const getMatchLabel = (score) => {
  if (score >= 80) {
    return "Excellent fit";
  }

  if (score >= 60) {
    return "Strong fit";
  }

  if (score >= 40) {
    return "Potential fit";
  }

  if (score > 0) {
    return "Skill gap";
  }

  return "No verified match";
};

const getMatchClass = (score) => {
  if (score >= 80) {
    return "excellent";
  }

  if (score >= 60) {
    return "strong";
  }

  if (score >= 40) {
    return "potential";
  }

  return "gap";
};

const formatJobType = (value) => {
  if (!value) {
    return "Employment";
  }

  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatSalary = (minimum, maximum) => {
  const min = Number(minimum);

  const max = Number(maximum);

  const hasMin = Number.isFinite(min) && min > 0;

  const hasMax = Number.isFinite(max) && max > 0;

  if (!hasMin && !hasMax) {
    return "Salary not disclosed";
  }

  const formatValue = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${Math.round(value / 1000)}k`;
    }

    return `₹${Math.round(value)}`;
  };

  if (hasMin && hasMax) {
    return `${formatValue(min)} – ${formatValue(max)}`;
  }

  if (hasMin) {
    return `From ${formatValue(min)}`;
  }

  return `Up to ${formatValue(max)}`;
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getPostedLabel = (value) => {
  if (!value) {
    return "Recently posted";
  }

  const created = new Date(value);

  if (Number.isNaN(created.getTime())) {
    return "Recently posted";
  }

  const difference = Date.now() - created.getTime();

  const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));

  if (days === 0) {
    return "Posted today";
  }

  if (days === 1) {
    return "Posted yesterday";
  }

  if (days < 30) {
    return `Posted ${days} days ago`;
  }

  const months = Math.floor(days / 30);

  return `Posted ${months} ${months === 1 ? "month" : "months"} ago`;
};

const getCompanyInitials = (value) => {
  const parts = String(value || "Company")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CO";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getApplicationStatusLabel = (status) => {
  if (!status) {
    return "Submitted";
  }

  return String(status)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

/* =========================================================
   COMPONENT
   ========================================================= */

const JobDetails = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);

  const [skillGapData, setSkillGapData] = useState(null);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [applyError, setApplyError] = useState("");

  const [success, setSuccess] = useState("");

  const [showApplyForm, setShowApplyForm] = useState(false);

  const [intentResponse, setIntentResponse] = useState("");

  const [applying, setApplying] = useState(false);

  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadJobDetails = async () => {
      try {
        const [jobsResult, skillGapResult, applicationsResult] =
          await Promise.allSettled([
            api.get("/job/all"),

            api.get("/skill-gap"),

            api.get("/application/my"),
          ]);

        if (cancelled) {
          return;
        }

        if (!jobId) {
          setError("This opportunity could not be identified.");

          setLoading(false);

          return;
        }

        /* ================================================
             JOB
             ================================================ */

        if (jobsResult.status === "fulfilled") {
          const payload = jobsResult.value?.data;

          const jobs = Array.isArray(payload?.jobs) ? payload.jobs : [];

          const selectedJob = jobs.find(
            (item) => String(item?._id) === String(jobId),
          );

          if (selectedJob) {
            setJob(selectedJob);
          } else {
            setError("This opportunity could not be found.");
          }
        } else {
          setError("Unable to load this opportunity.");
        }

        /* ================================================
             SKILL GAP
             ================================================ */

        if (skillGapResult.status === "fulfilled") {
          const payload = skillGapResult.value?.data;

          if (payload?.success) {
            setSkillGapData(payload);
          }
        }

        /* ================================================
             APPLICATIONS
             ================================================ */

        if (applicationsResult.status === "fulfilled") {
          const payload = applicationsResult.value?.data;

          if (payload?.success) {
            setApplications(
              Array.isArray(payload.applications) ? payload.applications : [],
            );
          }
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Load job details error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load this opportunity.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJobDetails();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  /* =======================================================
     DERIVED JOB DATA
     ======================================================= */

  const companyName = job?.company?.name || "Company";

  const companyInitials = getCompanyInitials(companyName);

  const requiredSkills = uniqueSkills([
    ...(Array.isArray(job?.requirements) ? job.requirements : []),

    ...(Array.isArray(job?.skills) ? job.skills : []),
  ]);

  const roleAnalysis = Array.isArray(skillGapData?.roleAnalysis)
    ? skillGapData.roleAnalysis.find(
        (role) => String(role?.jobId) === String(jobId),
      )
    : null;

  const matchedSkills = uniqueSkills(
    roleAnalysis?.matchedSkills || roleAnalysis?.verifiedSkills || [],
  );

  const missingSkills = uniqueSkills(roleAnalysis?.skillGaps || []);

  const matchPercentage = clampScore(roleAnalysis?.matchPercentage);

  const readiness = clampScore(skillGapData?.readiness);

  const evidenceCoverage = clampScore(skillGapData?.verifiedCoverage);

  const applicationForJob = applications.find(
    (application) =>
      String(application?.job?._id || application?.job) === String(jobId),
  );

  const hasApplied = Boolean(applicationForJob);

  const jobStatus = String(job?.status || "active").toLowerCase();

  const canApply = Boolean(
    job && jobStatus === "active" && !hasApplied && !applying,
  );

  /* =======================================================
     APPLY FORM
     ======================================================= */

  const handleOpenApply = () => {
    if (hasApplied) {
      return;
    }

    if (jobStatus !== "active") {
      setApplyError("This job is no longer accepting applications.");

      return;
    }

    setApplyError("");
    setSuccess("");

    setShowApplyForm(true);
  };

  const handleCancelApply = () => {
    if (applying) {
      return;
    }

    setShowApplyForm(false);

    setApplyError("");

    setIntentResponse("");
  };

  const handleApply = async (event) => {
    event.preventDefault();

    if (applying) {
      return;
    }

    const cleanedIntent = intentResponse.trim();

    setApplyError("");
    setSuccess("");

    if (cleanedIntent.length < 20) {
      setApplyError(
        "Please write at least 20 characters explaining why you're interested in this role.",
      );

      return;
    }

    if (cleanedIntent.length > 1000) {
      setApplyError("Your application response cannot exceed 1000 characters.");

      return;
    }

    try {
      setApplying(true);

      const response = await api.post("/application/apply", {
        jobId,
        intentResponse: cleanedIntent,
      });

      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(
          payload?.message || "Unable to submit your application.",
        );
      }

      if (payload?.application) {
        setApplications((previous) => [payload.application, ...previous]);
      }

      setShowApplyForm(false);

      setIntentResponse("");

      setSuccess("Application submitted successfully.");
    } catch (requestError) {
      console.error("Apply to job error:", requestError);

      setApplyError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to submit your application.",
      );
    } finally {
      setApplying(false);
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="job-details-page">
        <div className="job-details-loading" role="status" aria-live="polite">
          <LoaderCircle size={31} />

          <h1>Preparing the opportunity</h1>

          <p>
            We're loading the role, match intelligence and your application
            status.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR / NOT FOUND
     ======================================================= */

  if (!job) {
    return (
      <section className="job-details-page">
        <div className="job-details-error" role="alert">
          <div className="job-details-error-icon">
            <XCircle size={22} />
          </div>

          <span className="candidate-section-eyebrow">
            OPPORTUNITY UNAVAILABLE
          </span>

          <h1>We couldn't open this role.</h1>

          <p>{error || "This opportunity could not be found."}</p>

          <Link to="/candidate/jobs" className="job-details-back-button">
            <ArrowLeft size={14} />
            Back to opportunities
          </Link>
        </div>
      </section>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section className="job-details-page">
      {/* ===================================================
          BACK
          =================================================== */}

      <Link to="/candidate/jobs" className="job-details-back-link">
        <ArrowLeft size={13} />
        Back to opportunities
      </Link>

      {/* ===================================================
          FEEDBACK
          =================================================== */}

      {success && (
        <div className="job-details-success" role="status" aria-live="polite">
          <CheckCircle2 size={16} />

          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="job-details-inline-error" role="alert">
          <XCircle size={16} />

          <span>{error}</span>
        </div>
      )}

      {/* ===================================================
          JOB HERO
          =================================================== */}

      <section className="job-details-hero">
        <div className="job-details-identity">
          <div className="job-details-company-logo">
            {job?.company?.logo ? (
              <img src={job.company.logo} alt="" />
            ) : (
              companyInitials
            )}
          </div>

          <div className="job-details-identity-copy">
            <span className="candidate-card-eyebrow">
              {companyName.toUpperCase()}
            </span>

            <h1>{job.title}</h1>

            <div className="job-details-meta">
              {job.location && (
                <span>
                  <MapPin size={12} />

                  {job.location}
                </span>
              )}

              <span>
                <BriefcaseBusiness size={12} />

                {formatJobType(job.jobType)}
              </span>

              <span>
                <Clock3 size={12} />

                {getPostedLabel(job.createdAt)}
              </span>
            </div>

            <div className="job-details-chips">
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>

              <span className={jobStatus === "active" ? "active" : "closed"}>
                {jobStatus === "active"
                  ? "Accepting applications"
                  : "Applications closed"}
              </span>
            </div>
          </div>
        </div>

        <div className={`job-details-match ${getMatchClass(matchPercentage)}`}>
          <span>PULSEHIRE MATCH</span>

          <strong>{matchPercentage}%</strong>

          <small>{getMatchLabel(matchPercentage)}</small>

          <div className="job-details-match-track">
            <div
              style={{
                width: `${matchPercentage}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          LAYOUT
          =================================================== */}

      <div className="job-details-grid">
        {/* =================================================
            LEFT CONTENT
            ================================================= */}

        <div className="job-details-content">
          {/* =================================================
              ROLE
              ================================================= */}

          <section className="job-details-panel">
            <span className="candidate-card-eyebrow">ABOUT THE ROLE</span>

            <h2>{job.title}</h2>

            <p className="job-details-description">
              {job.description ||
                "The recruiter has not provided a detailed description for this opportunity yet."}
            </p>
          </section>

          {/* =================================================
              RESPONSIBILITIES
              ================================================= */}

          {Array.isArray(job.responsibilities) &&
            job.responsibilities.length > 0 && (
              <section className="job-details-panel">
                <span className="candidate-card-eyebrow">RESPONSIBILITIES</span>

                <div className="job-details-responsibilities">
                  {job.responsibilities.map((responsibility, index) => (
                    <div key={`${responsibility}-${index}`}>
                      <CheckCircle2 size={14} />

                      <span>{responsibility}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* =================================================
              REQUIREMENTS
              ================================================= */}

          <section className="job-details-panel">
            <div className="job-details-panel-title-row">
              <div>
                <span className="candidate-card-eyebrow">
                  ROLE REQUIREMENTS
                </span>

                <h2>The capabilities this role needs.</h2>
              </div>

              <Target size={19} className="job-details-panel-icon" />
            </div>

            {requiredSkills.length > 0 ? (
              <div className="job-details-requirements">
                {requiredSkills.map((skill) => {
                  const matched = matchedSkills.some(
                    (item) => normalizeSkill(item) === normalizeSkill(skill),
                  );

                  const missing = missingSkills.some(
                    (item) => normalizeSkill(item) === normalizeSkill(skill),
                  );

                  return (
                    <div
                      className={`job-details-requirement ${
                        matched ? "matched" : missing ? "missing" : "limited"
                      }`}
                      key={skill}
                    >
                      <div>
                        {matched ? (
                          <CheckCircle2 size={15} />
                        ) : missing ? (
                          <XCircle size={15} />
                        ) : (
                          <Clock3 size={15} />
                        )}

                        <div>
                          <strong>{skill}</strong>

                          <span>
                            {matched
                              ? "Required · Verified evidence available"
                              : missing
                                ? "Required · Not yet demonstrated"
                                : "Required · Limited evidence"}
                          </span>
                        </div>
                      </div>

                      {matched ? (
                        <BadgeCheck size={14} />
                      ) : (
                        <Target size={14} />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="job-details-empty">
                <BriefcaseBusiness size={19} />

                <div>
                  <strong>No structured requirements provided.</strong>

                  <span>
                    The recruiter has not supplied individual skill requirements
                    for this opportunity.
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* =================================================
              COMPANY
              ================================================= */}

          <section className="job-details-panel">
            <span className="candidate-card-eyebrow">ABOUT THE COMPANY</span>

            <div className="job-details-company-section">
              <div className="job-details-company-section-logo">
                {job?.company?.logo ? (
                  <img src={job.company.logo} alt="" />
                ) : (
                  companyInitials
                )}
              </div>

              <div>
                <h3>{companyName}</h3>

                {job?.company?.location && (
                  <span>
                    <MapPin size={12} />

                    {job.company.location}
                  </span>
                )}

                {job?.company?.description && <p>{job.company.description}</p>}

                {job?.company?.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit company website
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              ROLE SKILLS
              ================================================= */}

          {requiredSkills.length > 0 && (
            <section className="job-details-panel">
              <span className="candidate-card-eyebrow">
                SKILLS FOR THIS ROLE
              </span>

              <div className="job-details-skill-cloud">
                {requiredSkills.map((skill) => {
                  const matched = matchedSkills.some(
                    (item) => normalizeSkill(item) === normalizeSkill(skill),
                  );

                  return (
                    <span className={matched ? "matched" : ""} key={skill}>
                      {matched && <BadgeCheck size={11} />}

                      {skill}
                    </span>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* =================================================
            RIGHT SIDEBAR
            ================================================= */}

        <aside className="job-details-sidebar">
          {/* =================================================
              APPLY CARD
              ================================================= */}

          <section className="job-apply-card">
            <span className="candidate-card-eyebrow">YOUR FIT</span>

            <div
              className={`job-apply-score ${getMatchClass(matchPercentage)}`}
            >
              {matchPercentage}%
            </div>

            <h2>{getMatchLabel(matchPercentage)}</h2>

            <p>
              {matchPercentage >= 80
                ? "Your verified skills align strongly with this role."
                : matchPercentage >= 60
                  ? "You have a strong foundation for this role, with some areas worth strengthening."
                  : matchPercentage >= 40
                    ? "You have potential for this role, but several skill gaps remain."
                    : "Your currently verified skills do not yet strongly match this role."}
            </p>

            {/* ==============================================
                APPLIED
                ============================================== */}

            {hasApplied ? (
              <div className="job-details-applied">
                <div className="job-details-applied-icon">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <strong>Application submitted</strong>

                  <span>
                    {getApplicationStatusLabel(applicationForJob?.status)}
                  </span>

                  {applicationForJob?.appliedAt && (
                    <small>
                      Applied on {formatDate(applicationForJob.appliedAt)}
                    </small>
                  )}
                </div>
              </div>
            ) : !showApplyForm ? (
              <button
                type="button"
                className="job-apply-button"
                onClick={handleOpenApply}
                disabled={!canApply}
              >
                {jobStatus === "active"
                  ? "Apply for this role"
                  : "Applications closed"}

                <ArrowRight size={15} />
              </button>
            ) : (
              <form className="job-apply-form" onSubmit={handleApply}>
                <div className="job-apply-form-heading">
                  <span>ONE LAST STEP</span>

                  <strong>Tell the recruiter why this role fits you.</strong>
                </div>

                <label htmlFor="intentResponse">
                  Why are you interested in this role?
                </label>

                <p>
                  Keep it genuine and mention your relevant experience or
                  motivation.
                </p>

                <textarea
                  id="intentResponse"
                  name="intentResponse"
                  value={intentResponse}
                  onChange={(event) => setIntentResponse(event.target.value)}
                  minLength={20}
                  maxLength={1000}
                  rows={7}
                  placeholder="Example: I’m interested in this role because..."
                  disabled={applying}
                  required
                />

                <div className="job-apply-form-meta">
                  <span>
                    {intentResponse.trim().length}
                    {" / 1000"}
                  </span>

                  <span>Minimum 20 characters</span>
                </div>

                {applyError && (
                  <div className="job-apply-error" role="alert">
                    <X size={14} />

                    <span>{applyError}</span>
                  </div>
                )}

                <div className="job-apply-form-actions">
                  <button
                    type="button"
                    className="job-apply-cancel"
                    onClick={handleCancelApply}
                    disabled={applying}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="job-apply-button"
                    disabled={applying}
                  >
                    {applying ? <LoaderCircle size={15} /> : <Send size={15} />}

                    {applying ? "Submitting..." : "Submit application"}
                  </button>
                </div>
              </form>
            )}

            <span className="job-apply-note">
              Your application includes your evidence-backed PulseHire profile
              signal.
            </span>
          </section>

          {/* =================================================
              MATCH BREAKDOWN
              ================================================= */}

          <section className="job-details-breakdown">
            <div className="job-details-sidebar-heading">
              <div>
                <span className="candidate-card-eyebrow">MATCH BREAKDOWN</span>

                <h3>Why this score?</h3>
              </div>

              <ShieldCheck size={18} className="job-details-panel-icon" />
            </div>

            <div className="job-details-breakdown-row">
              <div>
                <span>Verified skills</span>

                <strong>
                  {matchedSkills.length}
                  {" / "}
                  {requiredSkills.length}
                </strong>
              </div>

              {matchedSkills.length > 0 ? (
                <CheckCircle2 size={14} />
              ) : (
                <Target size={14} />
              )}
            </div>

            <div className="job-details-breakdown-row">
              <div>
                <span>Skill gaps</span>

                <strong>{missingSkills.length}</strong>
              </div>

              {missingSkills.length === 0 ? (
                <CheckCircle2 size={14} />
              ) : (
                <Target size={14} />
              )}
            </div>

            <div className="job-details-breakdown-row">
              <div>
                <span>Evidence coverage</span>

                <strong>{evidenceCoverage}%</strong>
              </div>

              <BadgeCheck size={14} />
            </div>

            <div className="job-details-breakdown-row">
              <div>
                <span>Overall readiness</span>

                <strong>{readiness}%</strong>
              </div>

              {readiness >= 60 ? (
                <CheckCircle2 size={14} />
              ) : (
                <Target size={14} />
              )}
            </div>
          </section>

          {/* =================================================
              GAP ACTION
              ================================================= */}

          {missingSkills.length > 0 && (
            <section className="job-details-gap-card">
              <div className="job-details-gap-icon">
                <Target size={18} />
              </div>

              <span className="candidate-card-eyebrow">CLOSE THE GAP</span>

              <h3>Strengthen your fit first.</h3>

              <p>
                {missingSkills.length === 1
                  ? `${missingSkills[0]} is the main remaining gap for this role.`
                  : `${missingSkills.slice(0, 3).join(", ")}${
                      missingSkills.length > 3 ? " and other skills" : ""
                    } are still missing from your verified profile.`}
              </p>

              <Link to="/candidate/learning" className="job-details-gap-link">
                Improve your skills
                <ArrowRight size={12} />
              </Link>
            </section>
          )}

          {/* =================================================
              SIGNAL
              ================================================= */}

          <section className="job-details-signal-card">
            <div className="job-details-signal-icon">
              <Users size={18} />
            </div>

            <div>
              <span className="candidate-card-eyebrow">PULSEHIRE SIGNAL</span>

              <strong>Evidence-backed matching</strong>

              <p>
                Your match uses demonstrated capabilities, not just profile
                claims.
              </p>
            </div>
          </section>
        </aside>
      </div>

      {/* ===================================================
          PRINCIPLE
          =================================================== */}

      <section className="job-details-principle">
        <div className="job-details-principle-icon">
          <FileCheck2 size={21} />
        </div>

        <div>
          <span className="candidate-section-eyebrow">
            THE PULSEHIRE DIFFERENCE
          </span>

          <h2>Your application carries evidence, not just claims.</h2>

          <p>
            Recruiters can see the capabilities you have demonstrated, the
            evidence supporting them, and the skill gaps that still exist. That
            gives both sides a more useful hiring signal than a traditional
            profile alone.
          </p>
        </div>
      </section>
    </section>
  );
};

export default JobDetails;
