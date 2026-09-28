import { useEffect, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getCurrentUser,
  getDashboardApplications,
  getDashboardJobs,
  getDashboardLearning,
  getDashboardSkillProofs,
  getSkillGapDashboard,
} from "../../services/dashboard.api";

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeSkill = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const uniqueSkills = (values = []) => {
  const seen = new Set();

  const result = [];

  for (const value of values) {
    const readable = String(value || "").trim();

    if (!readable) {
      continue;
    }

    const normalized = normalizeSkill(readable);

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);

    result.push(readable);
  }

  return result;
};

const clampPercentage = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
};

const getApplicationStatus = (application) =>
  String(application?.status || "applied")
    .trim()
    .toLowerCase();

const getApplicationStatusLabel = (status) => {
  const labels = {
    applied: "Applied",

    reviewing: "Under review",

    shortlisted: "Shortlisted",

    interview: "Interview",

    hired: "Hired",

    rejected: "Rejected",
  };

  return labels[String(status || "").toLowerCase()] || "Applied";
};

const getCompanyName = (job) => job?.company?.name || "Company";

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

const getMatchScore = (job, verifiedSkills) => {
  const required = uniqueSkills(Array.isArray(job?.skills) ? job.skills : []);

  if (required.length === 0) {
    return 0;
  }

  const verifiedSet = new Set(verifiedSkills.map(normalizeSkill));

  const matched = required.filter((skill) =>
    verifiedSet.has(normalizeSkill(skill)),
  );

  return clampPercentage((matched.length / required.length) * 100);
};

const getMatchLabel = (score) => {
  if (score >= 80) {
    return "Excellent match";
  }

  if (score >= 60) {
    return "Strong match";
  }

  if (score >= 40) {
    return "Potential match";
  }

  return "Needs improvement";
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
};

const getProfileCompleteness = (user) => {
  const checks = [
    Boolean(user?.fullname?.trim()),

    Boolean(user?.email?.trim()),

    Boolean(user?.phoneNumber?.trim()),

    Boolean(user?.profile?.bio?.trim()),

    Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0,

    Boolean(user?.profile?.resume),

    Boolean(user?.profile?.profilePhoto),
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
};

/* =========================================================
   COMPONENT
   ========================================================= */

const CandidateDashboard = () => {
  const [profileUser, setProfileUser] = useState(null);

  const [skillGapData, setSkillGapData] = useState(null);

  const [applications, setApplications] = useState([]);

  const [skillProofs, setSkillProofs] = useState([]);

  const [jobs, setJobs] = useState([]);

  const [learningResources, setLearningResources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD DASHBOARD
     ======================================================= */

  const loadDashboard = async (showRefreshState = false) => {
    if (showRefreshState) {
      setRefreshing(true);
    }

    try {
      setError("");

      const results = await Promise.allSettled([
        getCurrentUser(),
        getSkillGapDashboard(),
        getDashboardApplications(),
        getDashboardSkillProofs(),
        getDashboardJobs(),
        getDashboardLearning(),
      ]);

      const [
        userResult,
        skillGapResult,
        applicationsResult,
        proofsResult,
        jobsResult,
        learningResult,
      ] = results;

      /* ================================================
         USER
         ================================================ */

      if (userResult.status === "fulfilled" && userResult.value?.success) {
        setProfileUser(userResult.value.user);
      }

      /* ================================================
         SKILL GAP
         ================================================ */

      if (
        skillGapResult.status === "fulfilled" &&
        skillGapResult.value?.success
      ) {
        setSkillGapData(skillGapResult.value);
      }

      /* ================================================
         APPLICATIONS
         ================================================ */

      if (
        applicationsResult.status === "fulfilled" &&
        applicationsResult.value?.success
      ) {
        setApplications(
          Array.isArray(applicationsResult.value.applications)
            ? applicationsResult.value.applications
            : [],
        );
      }

      /* ================================================
         PROOFS
         ================================================ */

      if (proofsResult.status === "fulfilled" && proofsResult.value?.success) {
        setSkillProofs(
          Array.isArray(proofsResult.value.skillProofs)
            ? proofsResult.value.skillProofs
            : [],
        );
      }

      /* ================================================
         JOBS
         ================================================ */

      if (jobsResult.status === "fulfilled" && jobsResult.value?.success) {
        setJobs(
          Array.isArray(jobsResult.value.jobs) ? jobsResult.value.jobs : [],
        );
      }

      /* ================================================
         LEARNING
         ================================================ */

      if (
        learningResult.status === "fulfilled" &&
        learningResult.value?.success
      ) {
        setLearningResources(
          Array.isArray(learningResult.value.resources)
            ? learningResult.value.resources
            : [],
        );
      }

      const coreRequestFailed =
        skillGapResult.status === "rejected" &&
        applicationsResult.status === "rejected" &&
        proofsResult.status === "rejected";

      if (coreRequestFailed) {
        setError(
          "Some dashboard data could not be loaded. Please refresh and try again.",
        );
      }
    } catch (requestError) {
      console.error("Dashboard loading error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load your dashboard.",
      );
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (cancelled) {
        return;
      }

      await loadDashboard();
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     DERIVED DATA
     ======================================================= */

  const displayName = profileUser?.fullname || "Candidate";

  const profileCompleteness = getProfileCompleteness(profileUser);

  const readiness = clampPercentage(skillGapData?.readiness);

  const currentGap = clampPercentage(skillGapData?.currentGap);

  const verifiedCoverage = clampPercentage(skillGapData?.verifiedCoverage);

  const claimedSkills = uniqueSkills(
    skillGapData?.claimedSkills || profileUser?.profile?.skills || [],
  );

  const approvedProofs = skillProofs.filter(
    (proof) => String(proof?.status || "").toLowerCase() === "approved",
  );

  const pendingProofs = skillProofs.filter(
    (proof) => String(proof?.status || "").toLowerCase() === "pending",
  );

  const verifiedSkills = uniqueSkills(
    skillGapData?.verifiedSkills || approvedProofs.map((proof) => proof?.skill),
  );

  const unverifiedSkills = uniqueSkills(
    skillGapData?.unverifiedClaimedSkills ||
      claimedSkills.filter(
        (skill) =>
          !verifiedSkills.some(
            (verifiedSkill) =>
              normalizeSkill(verifiedSkill) === normalizeSkill(skill),
          ),
      ),
  );

  const priorityGaps = Array.isArray(skillGapData?.priorityGaps)
    ? skillGapData.priorityGaps
    : [];

  const recommendations = Array.isArray(skillGapData?.learningRecommendations)
    ? skillGapData.learningRecommendations
    : [];

  const interviewCount = applications.filter(
    (application) => getApplicationStatus(application) === "interview",
  ).length;

  const activeApplications = applications.filter(
    (application) =>
      !["rejected", "hired"].includes(getApplicationStatus(application)),
  ).length;

  const topJobs = jobs
    .map((job) => ({
      job,

      score: getMatchScore(job, verifiedSkills),
    }))
    .sort((first, second) => second.score - first.score)
    .slice(0, 3);

  const recentApplications = applications.slice(0, 4);

  const topRecommendations =
    recommendations.length > 0
      ? recommendations.slice(0, 3)
      : priorityGaps.slice(0, 3);

  const learningByPriority = learningResources
    .filter((resource) =>
      priorityGaps.some(
        (gap) =>
          normalizeSkill(gap?.skill || gap) === normalizeSkill(resource?.skill),
      ),
    )
    .slice(0, 3);

  const profileStrengthLabel =
    profileCompleteness >= 90
      ? "Excellent profile"
      : profileCompleteness >= 70
        ? "Strong progress"
        : profileCompleteness >= 50
          ? "Good foundation"
          : "Needs attention";

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="candidate-dashboard-page">
        <div
          className="candidate-dashboard-loading"
          role="status"
          aria-live="polite"
        >
          <div className="candidate-dashboard-loading-icon">
            <ShieldCheck size={24} />
          </div>

          <h1>Building your PulseHire workspace</h1>

          <p>
            We're connecting your profile, verified evidence, applications,
            opportunities and learning path.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="candidate-dashboard-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="candidate-dashboard-header">
        <div>
          <span className="candidate-section-eyebrow">CANDIDATE WORKSPACE</span>

          <h1>
            {getGreeting()}, {displayName.split(" ")[0]}.
          </h1>

          <p>
            Here's where your profile, proof, opportunities and hiring progress
            come together.
          </p>
        </div>

        <div className="candidate-dashboard-header-actions">
          <button
            type="button"
            className="candidate-dashboard-refresh"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={15} className={refreshing ? "spinning" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            to="/candidate/jobs"
            className="candidate-dashboard-primary-button"
          >
            <BriefcaseBusiness size={15} />
            Find opportunities
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div className="candidate-dashboard-error" role="alert">
          <XCircle size={16} />

          <span>{error}</span>

          <button type="button" onClick={() => loadDashboard(true)}>
            Retry
          </button>
        </div>
      )}

      {/* ===================================================
          READINESS HERO
          =================================================== */}

      <section className="candidate-dashboard-readiness">
        <div className="candidate-dashboard-readiness-copy">
          <div className="candidate-dashboard-readiness-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <span className="candidate-card-eyebrow">HIRING READINESS</span>

            <h2>
              {readiness >= 80
                ? "You're in a strong position."
                : readiness >= 60
                  ? "You're close. Keep strengthening the signal."
                  : "Let's build a stronger hiring signal."}
            </h2>

            <p>
              PulseHire currently rates your role readiness at{" "}
              <strong>{readiness}%</strong>. Your verified evidence is what
              strengthens this signal.
            </p>

            <div className="candidate-dashboard-readiness-track">
              <div
                style={{
                  width: `${readiness}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="candidate-dashboard-readiness-score">
          <strong>{readiness}%</strong>

          <span>CURRENT READINESS</span>

          <small>{currentGap}% current skill gap</small>
        </div>

        <Link
          to="/candidate/skill-gap"
          className="candidate-dashboard-readiness-link"
        >
          Understand your gaps
          <ArrowRight size={13} />
        </Link>
      </section>

      {/* ===================================================
          OVERVIEW
          =================================================== */}

      <section className="candidate-dashboard-overview">
        <Link
          to="/candidate/profile"
          className="candidate-dashboard-overview-card"
        >
          <div className="candidate-dashboard-overview-icon">
            <User size={18} />
          </div>

          <div>
            <span>PROFILE STRENGTH</span>

            <strong>{profileCompleteness}%</strong>

            <small>{profileStrengthLabel}</small>
          </div>

          <ArrowRight size={13} />
        </Link>

        <Link
          to="/candidate/skill-proof"
          className="candidate-dashboard-overview-card"
        >
          <div className="candidate-dashboard-overview-icon">
            <BadgeCheck size={18} />
          </div>

          <div>
            <span>VERIFIED SKILLS</span>

            <strong>{verifiedSkills.length}</strong>

            <small>{verifiedCoverage}% evidence coverage</small>
          </div>

          <ArrowRight size={13} />
        </Link>

        <Link
          to="/candidate/applications"
          className="candidate-dashboard-overview-card"
        >
          <div className="candidate-dashboard-overview-icon">
            <FileCheck2 size={18} />
          </div>

          <div>
            <span>APPLICATIONS</span>

            <strong>{applications.length}</strong>

            <small>
              {activeApplications} active · {interviewCount} interview
            </small>
          </div>

          <ArrowRight size={13} />
        </Link>

        <Link
          to="/candidate/skill-proof"
          className="candidate-dashboard-overview-card"
        >
          <div className="candidate-dashboard-overview-icon">
            <Clock3 size={18} />
          </div>

          <div>
            <span>PROOF IN REVIEW</span>

            <strong>{pendingProofs.length}</strong>

            <small>awaiting recruiter verification</small>
          </div>

          <ArrowRight size={13} />
        </Link>
      </section>

      {/* ===================================================
          MAIN GRID
          =================================================== */}

      <section className="candidate-dashboard-main-grid">
        {/* =================================================
            VERIFIED SKILLS
            ================================================= */}

        <article className="candidate-dashboard-panel">
          <div className="candidate-dashboard-panel-heading">
            <div>
              <span className="candidate-card-eyebrow">
                VERIFIED CAPABILITY
              </span>

              <h2>Skills recruiters can trust.</h2>
            </div>

            <Link to="/candidate/skill-proof">
              Manage
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="candidate-dashboard-skills">
            {verifiedSkills.length > 0 ? (
              verifiedSkills.slice(0, 6).map((skill) => (
                <div className="candidate-dashboard-skill-row" key={skill}>
                  <div className="candidate-dashboard-skill-icon">
                    <BadgeCheck size={14} />
                  </div>

                  <div>
                    <strong>{skill}</strong>

                    <span>Recruiter-approved evidence</span>
                  </div>

                  <span className="candidate-dashboard-verified-pill">
                    Verified
                  </span>
                </div>
              ))
            ) : (
              <div className="candidate-dashboard-empty">
                <BadgeCheck size={20} />

                <div>
                  <strong>No verified skills yet.</strong>

                  <span>
                    Submit evidence for the skills listed on your profile.
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* =================================================
            PRIORITY ACTION
            ================================================= */}

        <article className="candidate-dashboard-panel">
          <div className="candidate-dashboard-panel-heading">
            <div>
              <span className="candidate-card-eyebrow">
                RECOMMENDED NEXT STEP
              </span>

              <h2>Make your next move count.</h2>
            </div>

            <Target size={19} className="candidate-dashboard-panel-icon" />
          </div>

          {topRecommendations.length > 0 ? (
            <div className="candidate-dashboard-recommendations">
              {topRecommendations.map((recommendation) => {
                const skill = recommendation?.skill || recommendation;

                const priority = String(
                  recommendation?.priority || "medium",
                ).toLowerCase();

                return (
                  <Link
                    to="/candidate/learning"
                    className="candidate-dashboard-recommendation"
                    key={skill}
                  >
                    <div
                      className={`candidate-dashboard-recommendation-icon ${
                        priority
                      }`}
                    >
                      <Target size={15} />
                    </div>

                    <div>
                      <strong>Improve {skill}</strong>

                      <span>
                        {recommendation?.roleCount
                          ? `Affects ${recommendation.roleCount} active ${
                              recommendation.roleCount === 1 ? "role" : "roles"
                            }.`
                          : "A current priority in your skill analysis."}
                      </span>
                    </div>

                    <ArrowRight size={13} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="candidate-dashboard-empty">
              <CheckCircle2 size={20} />

              <div>
                <strong>No major action is flagged.</strong>

                <span>
                  Keep your profile and evidence current while exploring
                  opportunities.
                </span>
              </div>
            </div>
          )}

          <Link
            to="/candidate/skill-gap"
            className="candidate-dashboard-panel-button"
          >
            Open skill-gap intelligence
            <ArrowRight size={13} />
          </Link>
        </article>
      </section>

      {/* ===================================================
          JOB MATCHES
          =================================================== */}

      <section className="candidate-dashboard-section">
        <div className="candidate-dashboard-section-heading">
          <div>
            <span className="candidate-card-eyebrow">OPPORTUNITIES</span>

            <h2>Your strongest current matches.</h2>

            <p>Roles are ranked using your recruiter-verified skills.</p>
          </div>

          <Link to="/candidate/jobs">
            View all jobs
            <ArrowRight size={13} />
          </Link>
        </div>

        {topJobs.length > 0 ? (
          <div className="candidate-dashboard-job-grid">
            {topJobs.map(({ job, score }) => (
              <Link
                to={`/candidate/jobs/${job?._id}`}
                className="candidate-dashboard-job-card"
                key={job?._id}
              >
                <div className="candidate-dashboard-job-top">
                  <div className="candidate-dashboard-company">
                    {job?.company?.logo ? (
                      <img src={job.company.logo} alt="" />
                    ) : (
                      getCompanyInitials(getCompanyName(job))
                    )}
                  </div>

                  <span
                    className={`candidate-dashboard-match ${
                      score >= 80
                        ? "excellent"
                        : score >= 60
                          ? "strong"
                          : "potential"
                    }`}
                  >
                    {score}%
                  </span>
                </div>

                <span className="candidate-dashboard-job-company">
                  {getCompanyName(job)}
                </span>

                <h3>{job?.title || "Untitled role"}</h3>

                <div className="candidate-dashboard-job-meta">
                  {job?.location && <span>{job.location}</span>}

                  {job?.jobType && <span>{job.jobType}</span>}
                </div>

                <div className="candidate-dashboard-job-footer">
                  <span>{getMatchLabel(score)}</span>

                  <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="candidate-dashboard-empty wide">
            <BriefcaseBusiness size={22} />

            <div>
              <strong>No active opportunities are ready to show.</strong>

              <span>
                Check the jobs workspace again when recruiters publish or
                activate new roles.
              </span>
            </div>

            <Link
              to="/candidate/jobs"
              className="candidate-dashboard-inline-link"
            >
              Explore jobs
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </section>

      {/* ===================================================
          APPLICATIONS + LEARNING
          =================================================== */}

      <section className="candidate-dashboard-lower-grid">
        {/* =================================================
            APPLICATIONS
            ================================================= */}

        <article className="candidate-dashboard-panel">
          <div className="candidate-dashboard-panel-heading">
            <div>
              <span className="candidate-card-eyebrow">
                APPLICATION ACTIVITY
              </span>

              <h2>Recent applications.</h2>
            </div>

            <Link to="/candidate/applications">
              View all
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="candidate-dashboard-application-list">
              {recentApplications.map((application, index) => {
                const jobId = application?.job?._id || application?.job;

                const status = getApplicationStatus(application);

                const company = getCompanyName(application?.job);

                return (
                  <Link
                    to={
                      jobId
                        ? `/candidate/jobs/${jobId}`
                        : "/candidate/applications"
                    }
                    className="candidate-dashboard-application-row"
                    key={application?._id || `${jobId}-${index}`}
                  >
                    <div className="candidate-dashboard-application-company">
                      {getCompanyInitials(company)}
                    </div>

                    <div>
                      <strong>
                        {application?.job?.title || "Opportunity"}
                      </strong>

                      <span>{company}</span>
                    </div>

                    <span
                      className={`candidate-dashboard-application-status ${
                        status
                      }`}
                    >
                      {getApplicationStatusLabel(status)}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="candidate-dashboard-empty">
              <FileCheck2 size={20} />

              <div>
                <strong>No applications yet.</strong>

                <span>
                  Your first application will appear here once you apply to an
                  opportunity.
                </span>
              </div>
            </div>
          )}
        </article>

        {/* =================================================
            LEARNING
            ================================================= */}

        <article className="candidate-dashboard-panel">
          <div className="candidate-dashboard-panel-heading">
            <div>
              <span className="candidate-card-eyebrow">LEARNING PATH</span>

              <h2>Close the right gaps.</h2>
            </div>

            <Link to="/candidate/learning">
              Open
              <ArrowRight size={12} />
            </Link>
          </div>

          {learningByPriority.length > 0 ? (
            <div className="candidate-dashboard-learning-list">
              {learningByPriority.map((resource) => (
                <Link
                  to="/candidate/learning"
                  className="candidate-dashboard-learning-row"
                  key={resource?._id}
                >
                  <div className="candidate-dashboard-learning-icon">
                    <BookOpen size={15} />
                  </div>

                  <div>
                    <span>{resource?.skill || "LEARNING"}</span>

                    <strong>{resource?.title || "Learning resource"}</strong>

                    <small>
                      {resource?.durationMinutes
                        ? `${resource.durationMinutes} min`
                        : "Learning resource"}
                    </small>
                  </div>

                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          ) : learningResources.length > 0 ? (
            <div className="candidate-dashboard-learning-list">
              {learningResources.slice(0, 3).map((resource) => (
                <Link
                  to="/candidate/learning"
                  className="candidate-dashboard-learning-row"
                  key={resource?._id}
                >
                  <div className="candidate-dashboard-learning-icon">
                    <BookOpen size={15} />
                  </div>

                  <div>
                    <span>{resource?.skill || "LEARNING"}</span>

                    <strong>{resource?.title || "Learning resource"}</strong>

                    <small>{resource?.resourceType || "Resource"}</small>
                  </div>

                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="candidate-dashboard-empty">
              <BookOpen size={20} />

              <div>
                <strong>Your learning path is quiet.</strong>

                <span>
                  Recommendations appear when active role analysis identifies
                  gaps.
                </span>
              </div>
            </div>
          )}

          <Link
            to="/candidate/learning"
            className="candidate-dashboard-panel-button"
          >
            Explore all learning
            <ArrowRight size={13} />
          </Link>
        </article>
      </section>

      {/* ===================================================
          PROFILE HEALTH
          =================================================== */}

      <section className="candidate-dashboard-health">
        <div>
          <div className="candidate-dashboard-health-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span className="candidate-card-eyebrow">PROFILE HEALTH</span>

            <h2>
              Your professional signal is{" "}
              {profileCompleteness >= 80
                ? "in good shape."
                : "still being built."}
            </h2>

            <p>
              {unverifiedSkills.length > 0
                ? `${unverifiedSkills.length} claimed ${
                    unverifiedSkills.length === 1
                      ? "skill still needs"
                      : "skills still need"
                  } stronger evidence.`
                : "Your claimed capabilities currently have strong evidence coverage."}
            </p>
          </div>
        </div>

        <Link
          to="/candidate/profile"
          className="candidate-dashboard-health-action"
        >
          Improve profile
          <ArrowRight size={13} />
        </Link>
      </section>

      {/* ===================================================
          PRINCIPLE
          =================================================== */}

      <section className="candidate-dashboard-principle">
        <div className="candidate-dashboard-principle-icon">
          <ShieldCheck size={21} />
        </div>

        <div>
          <span className="candidate-card-eyebrow">
            THE PULSEHIRE DIFFERENCE
          </span>

          <h2>Build a profile that explains more than a resume can.</h2>

          <p>
            Your profile, recruiter-approved evidence, skill-gap intelligence,
            targeted learning, opportunities and applications are designed to
            work together as one hiring journey.
          </p>
        </div>
      </section>
    </section>
  );
};

export default CandidateDashboard;
