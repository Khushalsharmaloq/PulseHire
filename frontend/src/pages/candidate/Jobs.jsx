import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  Filter,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  Target,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";
const calculateJobMatch = (
  job,
  normalizedVerifiedSkills,
) => {
  const requiredSkills = [
    ...new Set(
      (
        Array.isArray(job.skills)
          ? job.skills
          : []
      )
        .map(
          (skill) =>
            String(skill)
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    ),
  ];

  if (requiredSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills =
    requiredSkills.filter(
      (skill) =>
        normalizedVerifiedSkills.includes(
          skill
        )
    );

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !normalizedVerifiedSkills.includes(
          skill
        )
    );

  const score = Math.round(
    (matchedSkills.length /
      requiredSkills.length) *
      100
  );

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

const Jobs = () => {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");


  /*
  |--------------------------------------------------------------------------
  | LOAD JOBS + VERIFIED SKILLS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          jobsResponse,
          proofsResponse,
        ] = await Promise.all([
          api.get("/job/all"),
          api.get("/skill-proof/my"),
        ]);

        if (cancelled) {
          return;
        }

        if (jobsResponse.data?.success) {
          setJobs(
            jobsResponse.data.jobs || []
          );
        }

        if (proofsResponse.data?.success) {
          const approvedProofs = (
            proofsResponse.data.skillProofs || []
          ).filter(
            (proof) =>
              proof.status === "approved"
          );

          const uniqueSkills = [
            ...new Set(
              approvedProofs
                .map(
                  (proof) =>
                    String(
                      proof.skill || ""
                    ).trim()
                )
                .filter(Boolean)
            ),
          ];

          setVerifiedSkills(uniqueSkills);
        }
      } catch (requestError) {
        console.error(
          "Candidate jobs loading error:",
          requestError
        );

        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load available jobs."
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

  const displayName =
    user?.fullname ||
    "Candidate";


  const getInitials = (name = "") => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return "PH";
    }

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`
      .toUpperCase();
  };


  const normalizedVerifiedSkills = useMemo(
    () =>
      verifiedSkills.map(
        (skill) =>
          String(skill)
            .trim()
            .toLowerCase()
      ),
    [verifiedSkills]
  );


  /*
  |--------------------------------------------------------------------------
  | JOB MATCH CALCULATION
  |--------------------------------------------------------------------------
  */


  /*
  |--------------------------------------------------------------------------
  | PROFILE READINESS
  |--------------------------------------------------------------------------
  */

  const claimedSkills = user?.profile?.skills ?? [];

const profileReadiness =
  claimedSkills.length === 0
    ? 0
    : Math.round(
        (verifiedSkills.length /
          claimedSkills.length) *
          100
      );


  /*
  |--------------------------------------------------------------------------
  | FILTERED + MATCHED JOBS
  |--------------------------------------------------------------------------
  */

  const processedJobs = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const normalizedLocation =
      locationTerm.trim().toLowerCase();


    const processed = jobs
  .map((job) => ({
    ...job,
    match: calculateJobMatch(
      job,
      normalizedVerifiedSkills
    ),
  }))
      .filter((job) => {

        const searchableText = [
          job.title,
          job.description,
          job.company?.name,
          ...(Array.isArray(job.skills)
            ? job.skills
            : []),
          ...(Array.isArray(
            job.requirements
          )
            ? job.requirements
            : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !normalizedSearch ||
          searchableText.includes(
            normalizedSearch
          );


        const matchesLocation =
          !normalizedLocation ||
          String(
            job.location || ""
          )
            .toLowerCase()
            .includes(
              normalizedLocation
            );


        let matchesFilter = true;


        if (activeFilter === "strong") {
          matchesFilter =
            job.match.score >= 80;
        }


        if (activeFilter === "good") {
          matchesFilter =
            job.match.score >= 60 &&
            job.match.score < 80;
        }


        if (activeFilter === "gap") {
          matchesFilter =
            job.match.missingSkills.length > 0;
        }


        return (
          matchesSearch &&
          matchesLocation &&
          matchesFilter
        );
      })
      .sort(
        (a, b) =>
          b.match.score -
          a.match.score
      );


    return processed;
  }, [
    jobs,
    searchTerm,
    locationTerm,
    activeFilter,
    normalizedVerifiedSkills,
  ]);


  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    await logout();
  };


  /*
  |--------------------------------------------------------------------------
  | MATCH LABEL
  |--------------------------------------------------------------------------
  */

  const getMatchLabel = (score) => {
    if (score >= 80) {
      return "Excellent fit";
    }

    if (score >= 60) {
      return "Good fit";
    }

    if (score >= 40) {
      return "Potential fit";
    }

    return "Skill gap";
  };


  /*
  |--------------------------------------------------------------------------
  | MATCH STRENGTH
  |--------------------------------------------------------------------------
  */

  const getMatchClass = (score) => {
    if (score >= 80) {
      return "featured";
    }

    return "";
  };


  /*
  |--------------------------------------------------------------------------
  | JOB LOGO
  |--------------------------------------------------------------------------
  */

  const getCompanyInitials = (
    companyName,
    jobTitle
  ) => {
    if (companyName) {
      return getInitials(
        companyName
      );
    }

    return getInitials(
      jobTitle || "Job"
    );
  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="candidate-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="candidate-sidebar">

        <Link
          to="/candidate/profile"
          className="dashboard-brand"
        >
          <div className="dashboard-brand-icon">
            <BriefcaseBusiness
              size={19}
            />
          </div>

          <span>
            PulseHire
          </span>
        </Link>


        <div className="sidebar-section">

          <span className="sidebar-label">
            CANDIDATE WORKSPACE
          </span>


          <nav className="sidebar-nav">

            <Link
              to="/candidate/profile"
              className="sidebar-link"
            >
              <LayoutDashboard
                size={17}
              />
              Dashboard
            </Link>


            <Link
              to="/candidate/jobs"
              className="sidebar-link active"
            >
              <BriefcaseBusiness
                size={17}
              />
              Find Jobs
            </Link>


            <Link
              to="/candidate/applications"
              className="sidebar-link"
            >
              <FileCheck2 size={17} />
              Applications
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
              className="sidebar-link"
            >
              <BookOpen size={17} />
              Learning
            </Link>

          </nav>

        </div>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              {getInitials(
                displayName
              )}
            </div>


            <div>

              <strong>
                {displayName}
              </strong>

              <span>
                Candidate
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
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
              OPPORTUNITY DISCOVERY
            </span>

            <h1>
              Find roles where your skills matter.
            </h1>

          </div>

        </header>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="skill-proof-message error">
            <XCircle size={16} />
            {error}
          </div>

        )}


        {/* ===================================================
            SEARCH
        =================================================== */}

        <section className="jobs-search-panel">

          <div className="jobs-search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search by role, skill or technology"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>


          <div className="jobs-location-box">

            <MapPin size={16} />

            <input
              type="text"
              placeholder="Location"
              value={locationTerm}
              onChange={(event) =>
                setLocationTerm(
                  event.target.value
                )
              }
            />

          </div>


          <button
            type="button"
            className="jobs-search-button"
          >
            Search
            <ArrowRight size={14} />
          </button>


          <button
            type="button"
            className="jobs-filter-button"
            onClick={() =>
              setActiveFilter("all")
            }
          >
            <Filter size={15} />
            Reset
          </button>

        </section>


        {/* ===================================================
            SMART MATCH MESSAGE
        =================================================== */}

        <section className="jobs-match-banner">

          <div className="jobs-match-icon">
            <Target size={19} />
          </div>


          <div>

            <span className="panel-label">
              PULSEHIRE MATCHING
            </span>

            <h2>
              Jobs are ranked around your verified skills.
            </h2>

            <p>
              Your match score is calculated from the
              skills that recruiters have actually verified,
              not simply from claims in your profile.
            </p>

          </div>


          <div className="jobs-match-score">

            <span>
              PROFILE READINESS
            </span>

            <strong>
              {profileReadiness}%
            </strong>

          </div>

        </section>


        {/* ===================================================
            FILTERS
        =================================================== */}

        <section className="jobs-filter-bar">

          <button
            type="button"
            className={
              activeFilter === "all"
                ? "job-filter active"
                : "job-filter"
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            All Jobs
          </button>


          <button
            type="button"
            className={
              activeFilter === "strong"
                ? "job-filter active"
                : "job-filter"
            }
            onClick={() =>
              setActiveFilter("strong")
            }
          >
            Strong Match
          </button>


          <button
            type="button"
            className={
              activeFilter === "good"
                ? "job-filter active"
                : "job-filter"
            }
            onClick={() =>
              setActiveFilter("good")
            }
          >
            Good Match
          </button>


          <button
            type="button"
            className={
              activeFilter === "gap"
                ? "job-filter active"
                : "job-filter"
            }
            onClick={() =>
              setActiveFilter("gap")
            }
          >
            Has Skill Gap
          </button>

        </section>


        {/* ===================================================
            RESULTS HEADER
        =================================================== */}

        <section className="jobs-results-heading">

          <div>

            <span className="panel-label">
              RECOMMENDED FOR YOU
            </span>

            <h2>
              Opportunities matching your profile.
            </h2>

          </div>


          <span className="jobs-results-count">
            {processedJobs.length}{" "}
            {processedJobs.length === 1
              ? "role"
              : "roles"}{" "}
            found
          </span>

        </section>


        {/* ===================================================
            JOB LIST
        =================================================== */}

        <section className="jobs-list">

          {loading ? (

            <div className="verification-empty-state">

              <BriefcaseBusiness
                size={28}
              />

              <h3>
                Loading opportunities...
              </h3>

              <p>
                Finding active roles that match your
                verified profile.
              </p>

            </div>

          ) : processedJobs.length === 0 ? (

            <div className="verification-empty-state">

              <Search size={28} />

              <h3>
                No matching jobs found.
              </h3>

              <p>
                Try another role, technology or location.
              </p>

            </div>

          ) : (

            processedJobs.map(
              (job) => {

                const score =
                  job.match.score;


                return (

                  <article
                    key={job._id}
                    className={`job-discovery-card ${
                      getMatchClass(score)
                    }`}
                  >

                    {/* =========================================
                        MAIN JOB INFO
                    ========================================= */}

                    <div className="job-main-info">

                      <div className="job-company-logo">

                        {getCompanyInitials(
                          job.company?.name,
                          job.title
                        )}

                      </div>


                      <div>

                        <div className="job-title-row">

                          <h3>
                            {job.title}
                          </h3>


                          {score >= 80 && (

                            <span className="job-featured">
                              TOP MATCH
                            </span>

                          )}

                        </div>


                        <p>
                          {job.company?.name ||
                            "Company"}
                        </p>


                        <div className="job-meta">

                          <span>
                            <MapPin size={11} />
                            {job.location ||
                              "Location not specified"}
                          </span>


                          <span>
                            {job.jobType ||
                              "Job type not specified"}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* =========================================
                        MATCH
                    ========================================= */}

                    <div className="job-match-column">

                      <span>
                        PULSEHIRE MATCH
                      </span>

                      <strong>
                        {score}%
                      </strong>

                      <small>
                        {getMatchLabel(score)}
                      </small>

                    </div>


                    {/* =========================================
                        VERIFIED MATCH
                    ========================================= */}

                    <div className="job-skill-column">

                      <span>
                        VERIFIED MATCH
                      </span>


                      <div>

                        {job.match
                          .matchedSkills
                          .slice(0, 5)
                          .map(
                            (skill) => (

                              <span
                                key={skill}
                                className="job-skill verified"
                              >
                                {skill}

                                <BadgeCheck
                                  size={10}
                                />
                              </span>

                            )
                          )}


                        {job.match
                          .matchedSkills
                          .length ===
                          0 && (

                          <span className="job-skill">
                            No verified match
                          </span>

                        )}

                      </div>

                    </div>


                    {/* =========================================
                        SKILL GAP
                    ========================================= */}

                    <div className="job-gap-column">

                      <span>
                        SKILL GAP
                      </span>


                      {job.match
                        .missingSkills
                        .length === 0 ? (

                        <>

                          <strong>
                            No gap
                          </strong>

                          <small>
                            All required skills verified
                          </small>

                        </>

                      ) : (

                        <>

                          <strong>
                            {
                              job.match
                                .missingSkills
                                .length
                            }{" "}
                            {job.match
                              .missingSkills
                              .length ===
                            1
                              ? "skill"
                              : "skills"}
                          </strong>

                          <small>
                            {job.match
                              .missingSkills
                              .slice(
                                0,
                                3
                              )
                              .join(
                                " · "
                              )}
                          </small>

                        </>

                      )}

                    </div>


                    {/* =========================================
                        VIEW
                    ========================================= */}

                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="job-view-button"
                    >
                      View Role

                      <ArrowRight
                        size={13}
                      />
                    </Link>

                  </article>

                );

              }
            )

          )}

        </section>


        {/* ===================================================
            MATCH EXPLANATION
        =================================================== */}

        <section className="job-match-explanation">

          <div className="job-match-explanation-icon">

            <CheckCircle2 size={20} />

          </div>


          <div>

            <span className="panel-label">
              HOW PULSEHIRE MATCHES YOU
            </span>

            <h2>
              Evidence changes the way your fit is measured.
            </h2>

            <p>
              Your PulseHire match is based on recruiter-approved
              skill evidence. Missing requirements are surfaced
              as skill gaps so you can improve through the
              Learning pathway rather than simply being told
              that you're not qualified.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};


export default Jobs;