import { useEffect, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  Search,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getAllJobs,
  getMyApplications,
  getMySkillProofs,
} from "../../services/jobs.api";

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeSkill = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const uniqueSkills = (skills = []) => {
  const map = new Map();

  for (const rawSkill of skills) {
    const readableSkill = String(rawSkill || "").trim();

    if (!readableSkill) {
      continue;
    }

    const normalized = normalizeSkill(readableSkill);

    if (!map.has(normalized)) {
      map.set(normalized, readableSkill);
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

const calculateJobMatch = (job, verifiedSkills) => {
  const requiredSkills = uniqueSkills([
    ...(Array.isArray(job?.skills) ? job.skills : []),

    ...(Array.isArray(job?.requirements) ? job.requirements : []),
  ]);

  const verifiedSkillSet = new Set(verifiedSkills.map(normalizeSkill));

  const matchedSkills = requiredSkills.filter((skill) =>
    verifiedSkillSet.has(normalizeSkill(skill)),
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !verifiedSkillSet.has(normalizeSkill(skill)),
  );

  const score =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
    requiredSkills,
  };
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

  return "Skill gap";
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

const getCompanyInitials = (name, fallback) => {
  const source = String(name || fallback || "Job")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (source.length === 0) {
    return "J";
  }

  if (source.length === 1) {
    return source[0].slice(0, 2).toUpperCase();
  }

  return (source[0][0] + source[1][0]).toUpperCase();
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

  return hasMin ? `From ${formatValue(min)}` : `Up to ${formatValue(max)}`;
};

const formatJobType = (jobType) => {
  if (!jobType) {
    return "Job type not specified";
  }

  return String(jobType)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getTimeAgo = (value) => {
  if (!value) {
    return "";
  }

  const created = new Date(value);

  if (Number.isNaN(created.getTime())) {
    return "";
  }

  const difference = Date.now() - created.getTime();

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days <= 0) {
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

/* =========================================================
   COMPONENT
   ========================================================= */

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  const [verifiedSkills, setVerifiedSkills] = useState([]);

  const [applicationJobIds, setApplicationJobIds] = useState(new Set());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [locationTerm, setLocationTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  const [sortBy, setSortBy] = useState("match");

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  /* =======================================================
     LOAD JOB DATA
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          getAllJobs(),
          getMySkillProofs(),
          getMyApplications(),
        ]);

        if (cancelled) {
          return;
        }

        const [jobsResult, proofsResult, applicationsResult] = results;

        /* ================================================
             JOBS
             ================================================ */

        if (jobsResult.status === "fulfilled" && jobsResult.value?.success) {
          setJobs(
            Array.isArray(jobsResult.value.jobs) ? jobsResult.value.jobs : [],
          );
        } else {
          setError("Unable to load available jobs right now.");
        }

        /* ================================================
             VERIFIED SKILLS
             ================================================ */

        if (
          proofsResult.status === "fulfilled" &&
          proofsResult.value?.success
        ) {
          const proofs = Array.isArray(proofsResult.value.skillProofs)
            ? proofsResult.value.skillProofs
            : [];

          const approvedProofs = proofs.filter(
            (proof) => proof?.status === "approved",
          );

          setVerifiedSkills(
            uniqueSkills(approvedProofs.map((proof) => proof?.skill)),
          );
        }

        /* ================================================
             APPLICATIONS
             ================================================ */

        if (
          applicationsResult.status === "fulfilled" &&
          applicationsResult.value?.success
        ) {
          const applications = Array.isArray(
            applicationsResult.value.applications,
          )
            ? applicationsResult.value.applications
            : [];

          const ids = applications
            .map((application) => application?.job?._id || application?.job)
            .filter(Boolean)
            .map(String);

          setApplicationJobIds(new Set(ids));
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Candidate jobs loading error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load available jobs.",
        );
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

  /* =======================================================
     PREPARE JOBS
     ======================================================= */

  const processedJobs = jobs
    .map((job) => ({
      ...job,

      match: calculateJobMatch(job, verifiedSkills),
    }))
    .filter((job) => {
      const searchableText = [
        job?.title,
        job?.description,
        job?.company?.name,
        job?.location,
        job?.jobType,
        ...job.match.requiredSkills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const normalizedSearch = searchTerm.trim().toLowerCase();

      const normalizedLocation = locationTerm.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      const matchesLocation =
        !normalizedLocation ||
        String(job?.location || "")
          .toLowerCase()
          .includes(normalizedLocation);

      const matchesMatchFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "excellent"
            ? job.match.score >= 80
            : activeFilter === "strong"
              ? job.match.score >= 60
              : job.match.missingSkills.length > 0;

      const matchesJobType =
        jobTypeFilter === "all"
          ? true
          : normalizeSkill(job?.jobType) === normalizeSkill(jobTypeFilter);

      return (
        matchesSearch && matchesLocation && matchesMatchFilter && matchesJobType
      );
    })
    .sort((firstJob, secondJob) => {
      if (sortBy === "recent") {
        return (
          new Date(secondJob?.createdAt || 0).getTime() -
          new Date(firstJob?.createdAt || 0).getTime()
        );
      }

      if (sortBy === "salary") {
        return (
          Number(secondJob?.salaryMax || secondJob?.salaryMin || 0) -
          Number(firstJob?.salaryMax || firstJob?.salaryMin || 0)
        );
      }

      return secondJob.match.score - firstJob.match.score;
    });

  /* =======================================================
     METRICS
     ======================================================= */

  const excellentMatchCount = jobs.filter(
    (job) => calculateJobMatch(job, verifiedSkills).score >= 80,
  ).length;

  const strongMatchCount = jobs.filter(
    (job) => calculateJobMatch(job, verifiedSkills).score >= 60,
  ).length;

  const jobsWithGaps = jobs.filter(
    (job) => calculateJobMatch(job, verifiedSkills).missingSkills.length > 0,
  ).length;

  const profileReadiness =
    verifiedSkills.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (verifiedSkills.length / Math.max(verifiedSkills.length, 5)) * 100,
          ),
        );

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    Boolean(locationTerm.trim()) ||
    activeFilter !== "all" ||
    jobTypeFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setActiveFilter("all");
    setJobTypeFilter("all");
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="jobs-page">
        <div className="jobs-loading" role="status" aria-live="polite">
          <div className="jobs-loading-icon">
            <Target size={22} />
          </div>

          <h1>Finding your opportunities</h1>

          <p>
            We're matching active roles against your recruiter-verified
            capabilities.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section className="jobs-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="jobs-page-header">
        <div>
          <span className="candidate-section-eyebrow">
            OPPORTUNITY DISCOVERY
          </span>

          <h1>Find roles where your skills matter.</h1>

          <p>
            Explore active opportunities and see exactly how your
            evidence-backed profile fits.
          </p>
        </div>

        <div className="jobs-header-stat">
          <span>EXCELLENT MATCHES</span>

          <strong>{excellentMatchCount}</strong>

          <small>of {jobs.length} active roles</small>
        </div>
      </header>

      {/* ===================================================
          SEARCH
          =================================================== */}

      <section className="jobs-search-card">
        <div className="jobs-search-input">
          <Search size={18} />

          <input
            type="search"
            aria-label="Search jobs by role, skill or company"
            placeholder="Search by role, skill or company"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="jobs-search-input location">
          <MapPin size={17} />

          <input
            type="search"
            aria-label="Search jobs by location"
            placeholder="Location"
            value={locationTerm}
            onChange={(event) => setLocationTerm(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="jobs-search-submit"
          onClick={() =>
            document.getElementById("jobs-results")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Search
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          className={`jobs-advanced-button ${
            showAdvancedFilters ? "active" : ""
          }`}
          onClick={() => setShowAdvancedFilters((previous) => !previous)}
        >
          {showAdvancedFilters ? <X size={15} /> : <Filter size={15} />}
          Filters
        </button>
      </section>

      {/* ===================================================
          ADVANCED FILTERS
          =================================================== */}

      {showAdvancedFilters && (
        <section className="jobs-advanced-panel">
          <div>
            <label htmlFor="jobs-match-filter">Match quality</label>

            <select
              id="jobs-match-filter"
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
            >
              <option value="all">All jobs</option>

              <option value="excellent">Excellent match · 80%+</option>

              <option value="strong">Strong match · 60%+</option>

              <option value="gap">Has skill gap</option>
            </select>
          </div>

          <div>
            <label htmlFor="jobs-type-filter">Job type</label>

            <select
              id="jobs-type-filter"
              value={jobTypeFilter}
              onChange={(event) => setJobTypeFilter(event.target.value)}
            >
              <option value="all">All job types</option>

              <option value="full-time">Full-time</option>

              <option value="part-time">Part-time</option>

              <option value="internship">Internship</option>

              <option value="contract">Contract</option>

              <option value="remote">Remote</option>
            </select>
          </div>

          <div>
            <label htmlFor="jobs-sort">Sort by</label>

            <select
              id="jobs-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="match">Best match</option>

              <option value="recent">Most recent</option>

              <option value="salary">Highest salary</option>
            </select>
          </div>

          <button
            type="button"
            className="jobs-clear-button"
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            Clear filters
          </button>
        </section>
      )}

      {/* ===================================================
          MATCHING BANNER
          =================================================== */}

      <section className="jobs-match-banner">
        <div className="jobs-match-banner-icon">
          <TrendingUp size={21} />
        </div>

        <div className="jobs-match-banner-copy">
          <span className="candidate-card-eyebrow">PULSEHIRE MATCHING</span>

          <h2>Your strongest opportunities rise to the top.</h2>

          <p>
            Matching uses recruiter-approved skill evidence. Skills you can
            prove carry more trust than skills that are only claimed on your
            profile.
          </p>
        </div>

        <div className="jobs-readiness">
          <span>PROFILE SIGNAL</span>

          <strong>{profileReadiness}%</strong>

          <small>evidence coverage</small>
        </div>
      </section>

      {/* ===================================================
          FILTER CHIPS
          =================================================== */}

      <section className="jobs-filter-chips" aria-label="Job match filters">
        <button
          type="button"
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
        >
          All Jobs
          <span>{jobs.length}</span>
        </button>

        <button
          type="button"
          className={activeFilter === "excellent" ? "active" : ""}
          onClick={() => setActiveFilter("excellent")}
        >
          Excellent Match
          <span>{excellentMatchCount}</span>
        </button>

        <button
          type="button"
          className={activeFilter === "strong" ? "active" : ""}
          onClick={() => setActiveFilter("strong")}
        >
          Strong Match
          <span>{strongMatchCount}</span>
        </button>

        <button
          type="button"
          className={activeFilter === "gap" ? "active" : ""}
          onClick={() => setActiveFilter("gap")}
        >
          Has Skill Gap
          <span>{jobsWithGaps}</span>
        </button>

        {hasFilters && (
          <button
            type="button"
            className="jobs-filter-reset"
            onClick={clearFilters}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </section>

      {/* ===================================================
          RESULTS HEADING
          =================================================== */}

      <section id="jobs-results" className="jobs-results-heading">
        <div>
          <span className="candidate-card-eyebrow">RECOMMENDED FOR YOU</span>

          <h2>Opportunities matching your profile.</h2>

          <p>Sorted by PulseHire match by default.</p>
        </div>

        <span className="jobs-results-count">
          {processedJobs.length} {processedJobs.length === 1 ? "role" : "roles"}{" "}
          found
        </span>
      </section>

      {/* ===================================================
          JOB RESULTS
          =================================================== */}

      {error && (
        <div className="jobs-message" role="alert">
          <X size={15} />

          <span>{error}</span>
        </div>
      )}

      <section className="jobs-results-list">
        {processedJobs.length === 0 ? (
          <div className="jobs-empty">
            <div className="jobs-empty-icon">
              <Search size={22} />
            </div>

            <div>
              <span className="candidate-card-eyebrow">NO RESULTS</span>

              <h2>No roles match your current search.</h2>

              <p>
                {hasFilters
                  ? "Try a broader role, skill, or location, or clear your filters."
                  : "There are currently no active roles available."}
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                className="jobs-empty-button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          processedJobs.map((job) => {
            const score = clampScore(job.match.score);

            const companyName = job?.company?.name || "Company";

            const applied = applicationJobIds.has(String(job?._id));

            const matchClass = getMatchClass(score);

            return (
              <article className={`job-card ${matchClass}`} key={job?._id}>
                {/* =========================================
                      JOB IDENTITY
                      ========================================= */}

                <div className="job-card-identity">
                  <div className="job-company-mark">
                    {job?.company?.logo ? (
                      <img src={job.company.logo} alt="" />
                    ) : (
                      getCompanyInitials(companyName, job?.title)
                    )}
                  </div>

                  <div className="job-card-title">
                    <div className="job-title-line">
                      <h3>{job?.title || "Untitled role"}</h3>

                      {score >= 80 && (
                        <span className="job-top-match">TOP MATCH</span>
                      )}
                    </div>

                    <strong>{companyName}</strong>

                    <div className="job-card-meta">
                      <span>
                        <MapPin size={11} />

                        {job?.location || "Location not specified"}
                      </span>

                      <span>
                        <Clock3 size={11} />

                        {formatJobType(job?.jobType)}
                      </span>

                      <span>
                        {formatSalary(job?.salaryMin, job?.salaryMax)}
                      </span>
                    </div>

                    {job?.createdAt && (
                      <small className="job-posted">
                        {getTimeAgo(job.createdAt)}
                      </small>
                    )}
                  </div>
                </div>

                {/* =========================================
                      MATCH
                      ========================================= */}

                <div className="job-card-match">
                  <span>PULSEHIRE MATCH</span>

                  <strong>{score}%</strong>

                  <small>{getMatchLabel(score)}</small>

                  <div className="job-match-track">
                    <div
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>
                </div>

                {/* =========================================
                      VERIFIED MATCH
                      ========================================= */}

                <div className="job-card-skills">
                  <div className="job-card-column-heading">
                    <span>VERIFIED MATCH</span>

                    <BadgeCheck size={13} />
                  </div>

                  <div className="job-skill-tags">
                    {job.match.matchedSkills.slice(0, 4).map((skill) => (
                      <span className="job-skill-tag verified" key={skill}>
                        {skill}

                        <BadgeCheck size={10} />
                      </span>
                    ))}

                    {job.match.matchedSkills.length === 0 && (
                      <span className="job-skill-empty">
                        No verified match yet
                      </span>
                    )}
                  </div>
                </div>

                {/* =========================================
                      GAPS
                      ========================================= */}

                <div className="job-card-skills gaps">
                  <div className="job-card-column-heading">
                    <span>SKILL GAP</span>

                    <Target size={13} />
                  </div>

                  {job.match.missingSkills.length === 0 ? (
                    <div className="job-no-gap">
                      <CheckCircle2 size={15} />

                      <span>Fully covered</span>
                    </div>
                  ) : (
                    <div className="job-gap-copy">
                      <strong>
                        {job.match.missingSkills.length}{" "}
                        {job.match.missingSkills.length === 1
                          ? "skill"
                          : "skills"}
                      </strong>

                      <span>
                        {job.match.missingSkills.slice(0, 3).join(" · ")}

                        {job.match.missingSkills.length > 3 ? " · +more" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* =========================================
                      ACTIONS
                      ========================================= */}

                <div className="job-card-actions">
                  {applied && (
                    <span className="job-applied-badge">
                      <CheckCircle2 size={13} />
                      Applied
                    </span>
                  )}

                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="job-view-button"
                  >
                    View role
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* ===================================================
          WHY MATCHING MATTERS
          =================================================== */}

      <section className="jobs-principle">
        <div className="jobs-principle-icon">
          <BadgeCheck size={21} />
        </div>

        <div>
          <span className="candidate-card-eyebrow">
            THE PULSEHIRE DIFFERENCE
          </span>

          <h2>Your match is based on what you can demonstrate.</h2>

          <p>
            PulseHire connects job discovery with recruiter-approved evidence.
            That means your profile doesn't simply tell recruiters what you
            claim to know — it gives them a clearer signal about what you have
            actually demonstrated.
          </p>
        </div>
      </section>
    </section>
  );
};

export default Jobs;
