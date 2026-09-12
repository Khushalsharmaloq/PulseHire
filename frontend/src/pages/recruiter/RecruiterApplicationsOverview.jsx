import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  RefreshCw,
  Search,
  Target,
  User,
  Users,
  XCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getRecruiterJobs,
} from "../../services/recruiterJobs";

import {
  getRecruiterApplicationsOverview,
} from "../../services/recruiterApplicationsOverview";


/* =========================================================
   STATUS CONFIG
   ========================================================= */

const statusLabels = {
  applied:
    "Applied",

  reviewing:
    "Reviewing",

  shortlisted:
    "Shortlisted",

  interview:
    "Interview",

  hired:
    "Hired",

  rejected:
    "Rejected",
};


/* =========================================================
   HELPERS
   ========================================================= */

const formatStatus =
  (
    status
  ) => {

    return (
      statusLabels[
        String(
          status ||
            ""
        ).toLowerCase()
      ] ||
      status ||
      "Unknown"
    );

  };


const formatDate =
  (
    value
  ) => {

    if (
      !value
    ) {

      return "—";

    }


    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "—";

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",
      }
    );

  };


const getInitials =
  (
    name
  ) => {

    const parts =
      String(
        name ||
          "Candidate"
      )
        .trim()
        .split(
          /\s+/
        )
        .filter(
          Boolean
        );


    if (
      parts.length ===
      0
    ) {

      return "CA";

    }


    if (
      parts.length ===
      1
    ) {

      return parts[0]
        .slice(
          0,
          2
        )
        .toUpperCase();

    }


    return (
      parts[0][0] +
      parts[
        parts.length -
          1
      ][0]
    ).toUpperCase();

  };


const getCandidateName =
  (
    application
  ) => {

    return (
      application?.candidate
        ?.fullname ||
      "Candidate"
    );

  };


const getCandidateSkills =
  (
    application
  ) => {

    const skills =
      application?.candidate
        ?.profile?.skills;


    return Array.isArray(
      skills
    )
      ? skills
      : [];

  };


const getMatchScore =
  (
    application
  ) => {

    return Number(
      application?.match
        ?.score ??
      application?.matchScore ??
      0
    );

  };


const getMatchClass =
  (
    score
  ) => {

    if (
      score >=
      80
    ) {

      return "strong";

    }


    if (
      score >=
      60
    ) {

      return "good";

    }


    return "low";

  };


/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterApplicationsOverview =
  () => {

    const [jobs, setJobs] =
      useState([]);


    const [applications, setApplications] =
      useState([]);


    const [summary, setSummary] =
      useState({
        total:
          0,

        applied:
          0,

        reviewing:
          0,

        shortlisted:
          0,

        interview:
          0,

        rejected:
          0,

        hired:
          0,
      });


    const [loading, setLoading] =
      useState(true);


    const [refreshing, setRefreshing] =
      useState(false);


    const [searchTerm, setSearchTerm] =
      useState("");


    const [statusFilter, setStatusFilter] =
      useState("all");


    const [jobFilter, setJobFilter] =
      useState("all");


    const [matchFilter, setMatchFilter] =
      useState("all");


    const [error, setError] =
      useState("");


    /* =======================================================
       LOAD DATA
       ======================================================= */

    useEffect(() => {

      let cancelled =
        false;


      const load =
        async () => {

          try {

            setLoading(
              true
            );


            setError("");


            const jobsResponse =
              await getRecruiterJobs();


            if (
              cancelled
            ) {

              return;

            }


            if (
              !jobsResponse?.success
            ) {

              throw new Error(
                jobsResponse?.message ||
                  "Unable to load recruiter jobs."
              );

            }


            const recruiterJobs =
              Array.isArray(
                jobsResponse.jobs
              )
                ? jobsResponse.jobs
                : [];


            setJobs(
              recruiterJobs
            );


            const applicationResponse =
              await getRecruiterApplicationsOverview(
                recruiterJobs
              );


            if (
              cancelled
            ) {

              return;

            }


            if (
              !applicationResponse?.success
            ) {

              throw new Error(
                applicationResponse?.message ||
                  "Unable to load recruiter applications."
              );

            }


            setApplications(
              Array.isArray(
                applicationResponse.applications
              )
                ? applicationResponse.applications
                : []
            );


            setSummary(
              applicationResponse.summary ||
              {}
            );

          } catch (
            requestError
          ) {

            if (
              cancelled
            ) {

              return;

            }


            console.error(
              "Recruiter applications overview load error:",
              requestError
            );


            setError(
              requestError?.response
                ?.data?.message ||
              requestError?.message ||
              "Unable to load recruiter applications."
            );

          } finally {

            if (
              !cancelled
            ) {

              setLoading(
                false
              );

            }

          }

        };


      load();


      return () => {

        cancelled =
          true;

      };

    }, []);


    /* =======================================================
       REFRESH
       ======================================================= */

    const handleRefresh =
      async () => {

        try {

          setRefreshing(
            true
          );


          setError("");


          const jobsResponse =
            await getRecruiterJobs();


          if (
            !jobsResponse?.success
          ) {

            throw new Error(
              jobsResponse?.message ||
                "Unable to refresh recruiter jobs."
            );

          }


          const recruiterJobs =
            Array.isArray(
              jobsResponse.jobs
            )
              ? jobsResponse.jobs
              : [];


          setJobs(
            recruiterJobs
          );


          const response =
            await getRecruiterApplicationsOverview(
              recruiterJobs
            );


          if (
            !response?.success
          ) {

            throw new Error(
              response?.message ||
                "Unable to refresh applications."
            );

          }


          setApplications(
            Array.isArray(
              response.applications
            )
              ? response.applications
              : []
          );


          setSummary(
            response.summary ||
            {}
          );

        } catch (
          requestError
        ) {

          console.error(
            "Recruiter applications overview refresh error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to refresh applications."
          );

        } finally {

          setRefreshing(
            false
          );

        }

      };


    /* =======================================================
       FILTERED APPLICATIONS
       ======================================================= */

    const filteredApplications =
      useMemo(
        () => {

          const search =
            searchTerm
              .trim()
              .toLowerCase();


          return applications.filter(
            (
              application
            ) => {

              const candidateName =
                getCandidateName(
                  application
                );


              const candidateEmail =
                application?.candidate
                  ?.email ||
                "";


              const jobTitle =
                application?.job
                  ?.title ||
                "";


              const companyName =
                application?.job
                  ?.company?.name ||
                "";


              const skills =
                getCandidateSkills(
                  application
                );


              const searchableText =
                [
                  candidateName,
                  candidateEmail,
                  jobTitle,
                  companyName,
                  ...skills,
                ]
                  .join(
                    " "
                  )
                  .toLowerCase();


              const matchesSearch =
                !search ||
                searchableText.includes(
                  search
                );


              const status =
                String(
                  application?.status ||
                    ""
                ).toLowerCase();


              const matchesStatus =
                statusFilter ===
                  "all" ||
                status ===
                  statusFilter;


              const currentJobId =
                String(
                  application
                    ?.recruiterJobId ||
                    application?.job?.id ||
                    application?.job?._id ||
                    ""
                );


              const matchesJob =
                jobFilter ===
                  "all" ||
                currentJobId ===
                  String(
                    jobFilter
                  );


              const score =
                getMatchScore(
                  application
                );


              const matchesMatch =
                matchFilter ===
                  "all" ||
                (
                  matchFilter ===
                    "strong" &&
                  score >=
                    80
                ) ||
                (
                  matchFilter ===
                    "good" &&
                  score >=
                    60 &&
                  score <
                    80
                ) ||
                (
                  matchFilter ===
                    "low" &&
                  score <
                    60
                );


              return (
                matchesSearch &&
                matchesStatus &&
                matchesJob &&
                matchesMatch
              );

            }
          );

        },
        [
          applications,
          searchTerm,
          statusFilter,
          jobFilter,
          matchFilter,
        ]
      );


    /* =======================================================
       CLEAR FILTERS
       ======================================================= */

    const clearFilters =
      () => {

        setSearchTerm("");

        setStatusFilter(
          "all"
        );

        setJobFilter(
          "all"
        );

        setMatchFilter(
          "all"
        );

      };


    const filtersActive =
      Boolean(
        searchTerm
      ) ||
      statusFilter !==
        "all" ||
      jobFilter !==
        "all" ||
      matchFilter !==
        "all";


    /* =======================================================
       LOADING
       ======================================================= */

    if (
      loading
    ) {

      return (
        <section
          className="recruiter-applications-overview-page"
        >

          <div
            className="recruiter-applications-overview-loading"
            role="status"
            aria-live="polite"
          >

            <RefreshCw
              size={30}
              className="recruiter-applications-overview-spin"
            />


            <h1>
              Loading applications
            </h1>


            <p>
              We're gathering your recruiter application pipeline.
            </p>

          </div>

        </section>
      );

    }


    return (
      <section
        className="recruiter-applications-overview-page"
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <header
          className="recruiter-applications-overview-header"
        >

          <div>

            <span className="recruiter-applications-overview-eyebrow">
              APPLICATION MANAGEMENT
            </span>


            <h1>
              All applications.
            </h1>


            <p>
              Review candidate submissions across every job
              owned by your recruiter account.
            </p>

          </div>


          <button
            type="button"
            className="recruiter-applications-overview-refresh"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
          >

            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "recruiter-applications-overview-spin"
                  : ""
              }
            />


            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </header>


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <div
            className="recruiter-applications-overview-alert"
            role="alert"
          >

            <XCircle
              size={16}
            />


            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            KPI
            ================================================= */}

        <section
          className="recruiter-applications-overview-metrics"
        >

          <div
            className="recruiter-applications-overview-metric primary"
          >

            <div>

              <span>
                TOTAL APPLICATIONS
              </span>


              <strong>
                {summary.total ??
                  applications.length}
              </strong>


              <small>
                across all recruiter jobs
              </small>

            </div>


            <Users
              size={20}
            />

          </div>


          <div
            className="recruiter-applications-overview-metric"
          >

            <div>

              <span>
                REVIEWING
              </span>


              <strong>
                {summary.reviewing ??
                  0}
              </strong>


              <small>
                currently under review
              </small>

            </div>


            <Clock3
              size={20}
            />

          </div>


          <div
            className="recruiter-applications-overview-metric"
          >

            <div>

              <span>
                SHORTLISTED
              </span>


              <strong>
                {summary.shortlisted ??
                  0}
              </strong>


              <small>
                candidates moved forward
              </small>

            </div>


            <Target
              size={20}
            />

          </div>


          <div
            className="recruiter-applications-overview-metric"
          >

            <div>

              <span>
                INTERVIEWS
              </span>


              <strong>
                {summary.interview ??
                  0}
              </strong>


              <small>
                candidates in interview
              </small>

            </div>


            <User
              size={20}
            />

          </div>


          <div
            className="recruiter-applications-overview-metric"
          >

            <div>

              <span>
                HIRED
              </span>


              <strong>
                {summary.hired ??
                  0}
              </strong>


              <small>
                successful outcomes
              </small>

            </div>


            <CheckCircle2
              size={20}
            />

          </div>

        </section>


        {/* =================================================
            TOOLBAR
            ================================================= */}

        <section
          className="recruiter-applications-overview-toolbar"
        >

          <div
            className="recruiter-applications-overview-search"
          >

            <Search
              size={16}
            />


            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event
              ) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search candidate, role, email or skill"
              aria-label="Search applications"
            />

          </div>


          <div
            className="recruiter-applications-overview-filters"
          >

            <select
              value={
                jobFilter
              }
              onChange={(
                event
              ) =>
                setJobFilter(
                  event.target.value
                )
              }
              aria-label="Filter by job"
            >

              <option
                value="all"
              >
                All jobs
              </option>


              {jobs.map(
                (
                  job
                ) => (

                  <option
                    key={
                      job?._id
                    }
                    value={
                      job?._id
                    }
                  >
                    {job?.title ||
                      "Untitled role"}
                  </option>

                )
              )}

            </select>


            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filter by application status"
            >

              <option
                value="all"
              >
                All statuses
              </option>


              <option
                value="applied"
              >
                Applied
              </option>


              <option
                value="reviewing"
              >
                Reviewing
              </option>


              <option
                value="shortlisted"
              >
                Shortlisted
              </option>


              <option
                value="interview"
              >
                Interview
              </option>


              <option
                value="hired"
              >
                Hired
              </option>


              <option
                value="rejected"
              >
                Rejected
              </option>

            </select>


            <select
              value={
                matchFilter
              }
              onChange={(
                event
              ) =>
                setMatchFilter(
                  event.target.value
                )
              }
              aria-label="Filter by candidate match"
            >

              <option
                value="all"
              >
                All match levels
              </option>


              <option
                value="strong"
              >
                Strong match
              </option>


              <option
                value="good"
              >
                Good match
              </option>


              <option
                value="low"
              >
                Lower match
              </option>

            </select>


            {filtersActive && (

              <button
                type="button"
                className="recruiter-applications-overview-clear"
                onClick={
                  clearFilters
                }
              >
                Clear
              </button>

            )}

          </div>

        </section>


        {/* =================================================
            RESULT HEADER
            ================================================= */}

        <div
          className="recruiter-applications-overview-results"
        >

          <div>

            <span className="recruiter-applications-overview-eyebrow">
              RECRUITER PIPELINE
            </span>


            <h2>
              Applications
            </h2>


            <p>
              Showing{" "}
              {filteredApplications.length}{" "}
              of{" "}
              {applications.length}.
            </p>

          </div>

        </div>


        {/* =================================================
            EMPTY
            ================================================= */}

        {filteredApplications.length ===
        0 ? (

          <div
            className="recruiter-applications-overview-empty"
          >

            <div
              className="recruiter-applications-overview-empty-icon"
            >

              <BriefcaseBusiness
                size={24}
              />

            </div>


            <span className="recruiter-applications-overview-eyebrow">
              NO APPLICATIONS
            </span>


            <h3>
              {applications.length ===
              0
                ? "Your recruiter pipeline is empty."
                : "No applications match your filters."}
            </h3>


            <p>
              {applications.length ===
              0
                ? "Candidate applications will appear here when candidates apply to your jobs."
                : "Try another search or clear the current filters."}
            </p>


            {filtersActive && (

              <button
                type="button"
                className="recruiter-applications-overview-primary"
                onClick={
                  clearFilters
                }
              >
                Clear filters
              </button>

            )}

          </div>

        ) : (

          /* ================================================
             APPLICATION LIST
             ================================================ */

          <section
            className="recruiter-applications-overview-list"
          >

            {filteredApplications.map(
              (
                application
              ) => {

                const candidate =
                  application?.candidate ||
                  {};


                const profile =
                  candidate?.profile ||
                  {};


                const candidateName =
                  getCandidateName(
                    application
                  );


                const score =
                  getMatchScore(
                    application
                  );


                const skills =
                  getCandidateSkills(
                    application
                  );


                const currentJobId =
                  application?.recruiterJobId ||
                  application?.job?.id ||
                  application?.job?._id;


                const companyName =
                  application?.job
                    ?.company?.name ||
                  (
                    typeof application
                      ?.job?.company ===
                    "string"
                      ? application.job.company
                      : "Company"
                  );


                return (
                  <article
                    key={
                      application?._id
                    }
                    className="recruiter-applications-overview-card"
                  >

                    {/* ===================================
                        HEADER
                        =================================== */}

                    <div
                      className="recruiter-applications-overview-card-header"
                    >

                      <div
                        className="recruiter-applications-overview-candidate"
                      >

                        {profile?.profilePhoto ? (

                          <img
                            src={
                              profile.profilePhoto
                            }
                            alt={
                              candidateName
                            }
                            className="recruiter-applications-overview-avatar"
                          />

                        ) : (

                          <div
                            className="recruiter-applications-overview-avatar-fallback"
                          >

                            {getInitials(
                              candidateName
                            )}

                          </div>

                        )}


                        <div>

                          <h3>
                            {candidateName}
                          </h3>


                          <span>
                            Applied{" "}
                            {formatDate(
                              application?.appliedAt
                            )}
                          </span>

                        </div>

                      </div>


                      <span
                        className={
                          `recruiter-applications-overview-status ${
                            application?.status ||
                            "unknown"
                          }`
                        }
                      >

                        {formatStatus(
                          application?.status
                        )}

                      </span>

                    </div>


                    {/* ===================================
                        JOB
                        =================================== */}

                    <div
                      className="recruiter-applications-overview-job"
                    >

                      <div
                        className="recruiter-applications-overview-job-icon"
                      >

                        <BriefcaseBusiness
                          size={15}
                        />

                      </div>


                      <div>

                        <span>
                          APPLIED FOR
                        </span>


                        <strong>
                          {application?.job
                            ?.title ||
                            "Untitled role"}
                        </strong>


                        <small>
                          {companyName}
                        </small>

                      </div>

                    </div>


                    {/* ===================================
                        DETAILS
                        =================================== */}

                    <div
                      className="recruiter-applications-overview-details"
                    >

                      <div>

                        <MailFallback />

                      </div>

                      <div>

                        <MapPin
                          size={13}
                        />


                        <span>
                          {application?.job
                            ?.location ||
                            profile?.location ||
                            "Location not specified"}
                        </span>

                      </div>

                    </div>


                    {/* ===================================
                        MATCH + SKILLS
                        =================================== */}

                    <div
                      className="recruiter-applications-overview-quality"
                    >

                      <div
                        className={
                          `recruiter-applications-overview-match ${getMatchClass(
                            score
                          )}`
                        }
                      >

                        <div>

                          <span>
                            MATCH SCORE
                          </span>


                          <strong>
                            {score}%
                          </strong>

                        </div>


                        <div
                          className="recruiter-applications-overview-match-bar"
                        >

                          <span
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    score
                                  )
                                )}%`,
                            }}
                          />

                        </div>

                      </div>


                      <div
                        className="recruiter-applications-overview-skills"
                      >

                        <div>

                          <span>
                            PROFILE SKILLS
                          </span>


                          <strong>
                            {skills.length}
                          </strong>

                        </div>


                        <div
                          className="recruiter-applications-overview-skill-tags"
                        >

                          {skills
                            .slice(
                              0,
                              4
                            )
                            .map(
                              (
                                skill
                              ) => (

                                <span
                                  key={
                                    skill
                                  }
                                >
                                  {skill}
                                </span>

                              )
                            )}


                          {skills.length >
                            4 && (

                            <span className="more">
                              +
                              {skills.length -
                                4}

                            </span>

                          )}


                          {skills.length ===
                            0 && (

                            <span className="empty">
                              No skills listed
                            </span>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* ===================================
                        EVIDENCE
                        =================================== */}

                    <div
                      className="recruiter-applications-overview-evidence"
                    >

                      <div>

                        <BadgeCheck
                          size={14}
                        />


                        <span>
                          Verified evidence
                        </span>

                      </div>


                      <strong>
                        {Array.isArray(
                          candidate?.profile
                            ?.verifiedSkills
                        )
                          ? candidate.profile
                              .verifiedSkills.length
                          : 0}
                      </strong>


                      <div>

                        <FileCheck2
                          size={14}
                        />


                        <span>
                          Proof-backed profile
                        </span>

                      </div>

                    </div>


                    {/* ===================================
                        FOOTER
                        =================================== */}

                    <div
                      className="recruiter-applications-overview-card-footer"
                    >

                      <div>

                        <span>
                          {candidate?.email ||
                            "Candidate email unavailable"}
                        </span>

                      </div>


                      <Link
                        to={
                          currentJobId
                            ? `/recruiter/applications/${currentJobId}`
                            : "/recruiter/jobs"
                        }
                        className="recruiter-applications-overview-review"
                      >

                        Review application

                        <ArrowRight
                          size={13}
                        />

                      </Link>

                    </div>

                  </article>
                );

              }
            )}

          </section>

        )}

      </section>
    );

  };


/* =========================================================
   SMALL EMAIL ICON HELPER
   ========================================================= */

const MailFallback =
  () => {

    return (
      <span
        className="recruiter-applications-overview-email-icon"
      >
        @
      </span>
    );

  };


export default RecruiterApplicationsOverview;