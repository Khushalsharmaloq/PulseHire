import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileCheck2,
  Filter,
  MapPin,
  Search,
  Target,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getMyApplications,
} from "../../services/applications.api";


/* =========================================================
   CONSTANTS
   ========================================================= */

const STATUS_ORDER = [
  "applied",
  "reviewing",
  "shortlisted",
  "interview",
  "hired",
];


const STATUS_LABELS = {
  applied: "Applied",
  reviewing: "Under review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};


const STATUS_DESCRIPTIONS = {
  applied:
    "Your application has been submitted and is waiting for recruiter review.",

  reviewing:
    "The recruiter is actively reviewing your application.",

  shortlisted:
    "You've moved forward in the hiring process.",

  interview:
    "The recruiter has moved your application into the interview stage.",

  hired:
    "Congratulations — this application has reached the hired stage.",

  rejected:
    "This application is no longer active in the hiring process.",
};


/* =========================================================
   HELPERS
   ========================================================= */

const normalizeStatus = (
  status
) => {

  const normalized =
    String(
      status || "applied"
    )
      .trim()
      .toLowerCase();


  return STATUS_LABELS[
    normalized
  ]
    ? normalized
    : "applied";

};


const formatStatus = (
  status
) => {

  return (
    STATUS_LABELS[
      normalizeStatus(
        status
      )
    ] ||
    "Application"
  );

};


const getStatusClass = (
  status
) => {

  const normalized =
    normalizeStatus(
      status
    );


  if (
    normalized ===
    "hired"
  ) {
    return "hired";
  }


  if (
    normalized ===
    "rejected"
  ) {
    return "rejected";
  }


  if (
    normalized ===
    "interview"
  ) {
    return "interview";
  }


  if (
    normalized ===
    "shortlisted"
  ) {
    return "shortlisted";
  }


  if (
    normalized ===
    "reviewing"
  ) {
    return "reviewing";
  }


  return "applied";

};

const formatDateTime = (
  value
) => {

  if (!value) {
    return "Not available";
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
    return "Not available";
  }


  return date.toLocaleString(
    "en-IN",
    {
      day:
        "numeric",
      month:
        "short",
      year:
        "numeric",
      hour:
        "numeric",
      minute:
        "2-digit",
    }
  );

};


const formatRelativeDate = (
  value
) => {

  if (!value) {
    return "";
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
    return "";
  }


  const difference =
    Date.now() -
    date.getTime();


  const days =
    Math.floor(
      difference /
        (
          1000 *
          60 *
          60 *
          24
        )
    );


  if (
    days <= 0
  ) {
    return "today";
  }


  if (
    days === 1
  ) {
    return "yesterday";
  }


  if (
    days < 30
  ) {
    return `${days} days ago`;
  }


  const months =
    Math.floor(
      days /
        30
    );


  return `${months} ${
    months === 1
      ? "month"
      : "months"
  } ago`;

};


const formatJobType = (
  value
) => {

  if (!value) {
    return "Employment";
  }


  return String(
    value
  )
    .replace(
      /[-_]/g,
      " "
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );

};


const getCompanyName = (
  application
) => {

  return (
    application?.job
      ?.company?.name ||
    application?.company?.name ||
    "Company"
  );

};


const getCompanyLogo = (
  application
) => {

  return (
    application?.job
      ?.company?.logo ||
    application?.company?.logo ||
    ""
  );

};


const getCompanyInitials = (
  name
) => {

  const parts =
    String(
      name ||
        "Company"
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
    return "CO";
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
    parts[1][0]
  ).toUpperCase();

};


const getJobId = (
  application
) => {

  return (
    application?.job?._id ||
    application?.job ||
    ""
  );

};


const getTimelineProgress = (
  status
) => {

  const normalized =
    normalizeStatus(
      status
    );


  if (
    normalized ===
    "rejected"
  ) {
    return 100;
  }


  const index =
    STATUS_ORDER.indexOf(
      normalized
    );


  if (
    index ===
    -1
  ) {
    return 0;
  }


  return Math.round(
    (
      (
        index + 1
      ) /
      STATUS_ORDER.length
    ) *
    100
  );

};


/*
 * Backend returns responseDebt, but its exact
 * shape may evolve. Keep the UI defensive.
 */
const getResponseDebtLabel = (
  responseDebt
) => {

  if (!responseDebt) {
    return null;
  }


  if (
    typeof responseDebt ===
    "string"
  ) {
    return responseDebt;
  }


  if (
    typeof responseDebt ===
    "object"
  ) {

    if (
      responseDebt.label
    ) {
      return responseDebt.label;
    }


    if (
      responseDebt.message
    ) {
      return responseDebt.message;
    }


    if (
      responseDebt.hours != null
    ) {
      return `${responseDebt.hours}h`;
    }


    if (
      responseDebt.days != null
    ) {
      return `${responseDebt.days}d`;
    }

  }


  return null;

};


const getFreshnessLabel = (
  freshness
) => {

  if (!freshness) {
    return null;
  }


  if (
    typeof freshness ===
    "string"
  ) {
    return freshness;
  }


  if (
    typeof freshness ===
    "object"
  ) {

    if (
      freshness.label
    ) {
      return freshness.label;
    }


    if (
      freshness.message
    ) {
      return freshness.message;
    }


    if (
      freshness.status
    ) {
      return String(
        freshness.status
      );

    }

  }


  return null;

};


/* =========================================================
   COMPONENT
   ========================================================= */

const Applications = () => {

  const [applications, setApplications] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [searchTerm, setSearchTerm] =
    useState("");


  const [activeFilter, setActiveFilter] =
    useState("all");


  const [expandedId, setExpandedId] =
    useState(null);


  const [showFilters, setShowFilters] =
    useState(false);


  /* =======================================================
     LOAD APPLICATIONS
     ======================================================= */

  useEffect(() => {

    let cancelled =
      false;


    const loadApplications =
      async () => {

        try {

          const response =
            await getMyApplications();


          if (
            cancelled
          ) {
            return;
          }


          if (
            !response?.success
          ) {

            throw new Error(
              response?.message ||
                "Unable to load your applications."
            );

          }


          setApplications(
            Array.isArray(
              response.applications
            )
              ? response.applications
              : []
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
            "Applications loading error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to load your applications."
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


    loadApplications();


    return () => {
      cancelled = true;
    };

  }, []);


  /* =======================================================
     METRICS
     ======================================================= */

  const totalCount =
    applications.length;


  const reviewingCount =
    applications.filter(
      (application) =>
        [
          "reviewing",
          "shortlisted",
          "interview",
        ].includes(
          normalizeStatus(
            application?.status
          )
        )
    ).length;


  const interviewCount =
    applications.filter(
      (application) =>
        normalizeStatus(
          application?.status
        ) ===
        "interview"
    ).length;


  const hiredCount =
    applications.filter(
      (application) =>
        normalizeStatus(
          application?.status
        ) ===
        "hired"
    ).length;

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredApplications =
    applications.filter(
      (application) => {

        const status =
          normalizeStatus(
            application?.status
          );


        const jobTitle =
          String(
            application?.job?.title ||
              ""
          );


        const companyName =
          getCompanyName(
            application
          );


        const recruiterName =
          String(
            application?.recruiter
              ?.fullname ||
              ""
          );


        const searchable =
          [
            jobTitle,
            companyName,
            recruiterName,
            application?.job
              ?.location,
          ]
            .filter(
              Boolean
            )
            .join(
              " "
            )
            .toLowerCase();


        const matchesSearch =
          !searchTerm.trim() ||
          searchable.includes(
            searchTerm
              .trim()
              .toLowerCase()
          );


        const matchesStatus =
          activeFilter ===
            "all"
            ? true
            : status ===
              activeFilter;


        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );


  /* =======================================================
     FILTER HELPERS
     ======================================================= */

  const clearFilters =
    () => {

      setSearchTerm("");

      setActiveFilter(
        "all"
      );

    };


  const hasFilters =
    Boolean(
      searchTerm.trim()
    ) ||
    activeFilter !==
      "all";


  /* =======================================================
     LOADING
     ======================================================= */

  if (
    loading
  ) {

    return (
      <section
        className="applications-page"
      >

        <div
          className="applications-loading"
          role="status"
          aria-live="polite"
        >

          <div
            className="applications-loading-icon"
          >

            <FileCheck2
              size={22}
            />

          </div>


          <h1>
            Loading your applications
          </h1>


          <p>
            We're gathering the latest status
            of every opportunity you've applied to.
          </p>

        </div>

      </section>
    );

  }


  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section
      className="applications-page"
    >

      {/* ===================================================
          HEADER
          =================================================== */}

      <header
        className="applications-header"
      >

        <div>

          <span className="candidate-section-eyebrow">
            APPLICATION TRACKER
          </span>


          <h1>
            Know where every application stands.
          </h1>


          <p>
            Keep your opportunities, recruiter progress,
            and next steps in one place.
          </p>

        </div>


        <Link
          to="/candidate/jobs"
          className="applications-header-button"
        >

          <BriefcaseBusiness
            size={15}
          />

          Find more roles

          <ArrowRight
            size={13}
          />

        </Link>

      </header>


      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div
          className="applications-message"
          role="alert"
        >

          <X
            size={15}
          />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* ===================================================
          OVERVIEW
          =================================================== */}

      <section
        className="applications-overview"
      >

        <div
          className="applications-stat"
        >

          <div
            className="applications-stat-icon"
          >

            <FileCheck2
              size={18}
            />

          </div>


          <div>

            <span>
              TOTAL APPLICATIONS
            </span>


            <strong>
              {totalCount}
            </strong>


            <small>
              all submitted opportunities
            </small>

          </div>

        </div>


        <div
          className="applications-stat"
        >

          <div
            className="applications-stat-icon"
          >

            <TrendingUp
              size={18}
            />

          </div>


          <div>

            <span>
              ACTIVE PROGRESS
            </span>


            <strong>
              {reviewingCount}
            </strong>


            <small>
              beyond the initial application
            </small>

          </div>

        </div>


        <div
          className="applications-stat"
        >

          <div
            className="applications-stat-icon"
          >

            <Users
              size={18}
            />

          </div>


          <div>

            <span>
              INTERVIEW
            </span>


            <strong>
              {interviewCount}
            </strong>


            <small>
              interview-stage opportunities
            </small>

          </div>

        </div>


        <div
          className="applications-stat"
        >

          <div
            className="applications-stat-icon"
          >

            <BadgeCheck
              size={18}
            />

          </div>


          <div>

            <span>
              HIRED
            </span>


            <strong>
              {hiredCount}
            </strong>


            <small>
              successful outcomes
            </small>

          </div>

        </div>

      </section>


      {/* ===================================================
          SEARCH + FILTER
          =================================================== */}

      <section
        className="applications-toolbar"
      >

        <div
          className="applications-search"
        >

          <Search
            size={16}
          />


          <input
            type="search"
            placeholder="Search by role, company or recruiter"
            value={
              searchTerm
            }
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            aria-label="Search applications"
          />

        </div>


        <button
          type="button"
          className={`applications-filter-button ${
            showFilters
              ? "active"
              : ""
          }`}
          onClick={() =>
            setShowFilters(
              (previous) =>
                !previous
            )
          }
        >

          {showFilters ? (
            <X
              size={15}
            />
          ) : (
            <Filter
              size={15}
            />
          )}


          Filter

        </button>


        {hasFilters && (

          <button
            type="button"
            className="applications-clear-button"
            onClick={
              clearFilters
            }
          >

            Clear

          </button>

        )}

      </section>


      {/* ===================================================
          FILTERS
          =================================================== */}

      {showFilters && (

        <section
          className="applications-filters"
        >

          <button
            type="button"
            className={
              activeFilter ===
              "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "all"
              )
            }
          >
            All
          </button>


          <button
            type="button"
            className={
              activeFilter ===
              "applied"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "applied"
              )
            }
          >
            Applied
          </button>


          <button
            type="button"
            className={
              activeFilter ===
              "reviewing"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "reviewing"
              )
            }
          >
            Under review
          </button>


          <button
            type="button"
            className={
              activeFilter ===
              "shortlisted"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "shortlisted"
              )
            }
          >
            Shortlisted
          </button>


          <button
            type="button"
            className={
              activeFilter ===
              "interview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "interview"
              )
            }
          >
            Interview
          </button>


          <button
            type="button"
            className={
              activeFilter ===
              "hired"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "hired"
              )
            }
          >
            Hired
          </button>


          <button
            type="button"
            className={
              activeFilter ===
              "rejected"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter(
                "rejected"
              )
            }
          >
            Rejected
          </button>

        </section>

      )}


      {/* ===================================================
          CURRENT ACTIVITY BANNER
          =================================================== */}

      {applications.length >
        0 && (

        <section
          className="applications-insight-banner"
        >

          <div
            className="applications-insight-icon"
          >

            <TrendingUp
              size={20}
            />

          </div>


          <div>

            <span className="candidate-card-eyebrow">
              APPLICATION INTELLIGENCE
            </span>


            <h2>
              Your applications are now trackable,
              not forgotten.
            </h2>


            <p>
              PulseHire keeps your submitted opportunities
              connected to recruiter progress so you can focus
              on the applications that are actually moving.
            </p>

          </div>


          <div
            className="applications-insight-count"
          >

            <span>
              ACTIVE
            </span>


            <strong>
              {reviewingCount}
            </strong>


            <small>
              progressing
            </small>

          </div>

        </section>

      )}


      {/* ===================================================
          RESULTS HEADING
          =================================================== */}

      <section
        className="applications-results-heading"
      >

        <div>

          <span className="candidate-card-eyebrow">
            YOUR OPPORTUNITIES
          </span>


          <h2>
            Application history.
          </h2>


          <p>
            Most recent applications appear first.
          </p>

        </div>


        <span
          className="applications-results-count"
        >

          {filteredApplications.length}

          {" "}

          {filteredApplications.length ===
          1
            ? "application"
            : "applications"}

        </span>

      </section>


      {/* ===================================================
          APPLICATION LIST
          =================================================== */}

      {filteredApplications.length >
      0 ? (

        <section
          className="applications-list"
        >

          {filteredApplications.map(
            (
              application,
              index
            ) => {

              const applicationId =
                application?._id ||
                `${getJobId(
                  application
                )}-${index}`;


              const status =
                normalizeStatus(
                  application?.status
                );


              const jobId =
                getJobId(
                  application
                );


              const jobTitle =
                application?.job
                  ?.title ||
                "Untitled opportunity";


              const companyName =
                getCompanyName(
                  application
                );


              const companyLogo =
                getCompanyLogo(
                  application
                );


              const isExpanded =
                expandedId ===
                applicationId;


              const timelineProgress =
                getTimelineProgress(
                  status
                );


              const responseDebtLabel =
                getResponseDebtLabel(
                  application?.responseDebt
                );


              const freshnessLabel =
                getFreshnessLabel(
                  application?.jobFreshness
                );


              const recruiterName =
                application
                  ?.recruiter
                  ?.fullname ||
                "";


              return (
                <article
                  className={`application-card ${
                    getStatusClass(
                      status
                    )
                  } ${
                    isExpanded
                      ? "expanded"
                      : ""
                  }`}
                  key={
                    applicationId
                  }
                >

                  {/* =========================================
                      SUMMARY
                      ========================================= */}

                  <div
                    className="application-card-main"
                  >

                    <div
                      className="application-company-mark"
                    >

                      {companyLogo ? (

                        <img
                          src={
                            companyLogo
                          }
                          alt=""
                        />

                      ) : (

                        getCompanyInitials(
                          companyName
                        )

                      )}

                    </div>


                    <div
                      className="application-card-info"
                    >

                      <div
                        className="application-title-row"
                      >

                        <h3>
                          {jobTitle}
                        </h3>


                        <span
                          className={`application-status ${
                            getStatusClass(
                              status
                            )
                          }`}
                        >

                          {status ===
                            "hired" && (
                            <BadgeCheck
                              size={11}
                            />
                          )}


                          {status ===
                            "rejected" && (
                            <XCircle
                              size={11}
                            />
                          )}


                          {status !==
                            "hired" &&
                            status !==
                              "rejected" && (
                              <Clock3
                                size={11}
                              />
                            )}


                          {formatStatus(
                            status
                          )}

                        </span>

                      </div>


                      <strong>
                        {companyName}
                      </strong>


                      <div
                        className="application-meta"
                      >

                        {application?.job
                          ?.location && (
                          <span>

                            <MapPin
                              size={11}
                            />

                            {
                              application
                                .job
                                .location
                            }

                          </span>
                        )}


                        {application?.job
                          ?.jobType && (
                          <span>

                            <BriefcaseBusiness
                              size={11}
                            />

                            {formatJobType(
                              application
                                .job
                                .jobType
                            )}

                          </span>
                        )}


                        {application?.appliedAt && (
                          <span>
                            Applied{" "}
                            {formatRelativeDate(
                              application.appliedAt
                            )}
                          </span>
                        )}

                      </div>

                    </div>


                    <div
                      className="application-status-summary"
                    >

                      <span>
                        CURRENT STAGE
                      </span>


                      <strong>
                        {formatStatus(
                          status
                        )}
                      </strong>


                      <small>
                        {
                          STATUS_DESCRIPTIONS[
                            status
                          ]
                        }
                      </small>

                    </div>


                    <div
                      className="application-card-actions"
                    >

                      {jobId && (
                        <Link
                          to={`/candidate/jobs/${jobId}`}
                          className="application-view-role"
                        >

                          View role

                          <ArrowRight
                            size={12}
                          />

                        </Link>
                      )}


                      <button
                        type="button"
                        className="application-expand-button"
                        onClick={() =>
                          setExpandedId(
                            isExpanded
                              ? null
                              : applicationId
                          )
                        }
                        aria-expanded={
                          isExpanded
                        }
                        aria-label={
                          isExpanded
                            ? "Hide application details"
                            : "Show application details"
                        }
                      >

                        {isExpanded ? (
                          <ChevronUp
                            size={16}
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                          />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* =========================================
                      PROGRESS
                      ========================================= */}

                  <div
                    className="application-progress"
                  >

                    <div
                      className="application-progress-label"
                    >

                      <span>
                        HIRING PROGRESS
                      </span>


                      <strong>
                        {status ===
                        "rejected"
                          ? "Closed"
                          : `${timelineProgress}%`}
                      </strong>

                    </div>


                    {status ===
                    "rejected" ? (

                      <div
                        className="application-rejected-track"
                      >

                        <div />

                      </div>

                    ) : (

                      <div
                        className="application-progress-track"
                      >

                        <div
                          style={{
                            width:
                              `${timelineProgress}%`,
                          }}
                        />

                      </div>

                    )}


                    <div
                      className="application-stage-dots"
                    >

                      {STATUS_ORDER.map(
                        (
                          stage
                        ) => {

                          const currentIndex =
                            STATUS_ORDER.indexOf(
                              status
                            );


                          const stageIndex =
                            STATUS_ORDER.indexOf(
                              stage
                            );


                          const reached =
                            status !==
                              "rejected" &&
                            stageIndex <=
                              currentIndex;


                          return (
                            <div
                              className={`application-stage ${
                                reached
                                  ? "reached"
                                  : ""
                              }`}
                              key={
                                stage
                              }
                            >

                              <span />

                              <small>
                                {
                                  STATUS_LABELS[
                                    stage
                                  ]
                                }
                              </small>

                            </div>
                          );

                        }
                      )}

                    </div>

                  </div>


                  {/* =========================================
                      EXPANDED
                      ========================================= */}

                  {isExpanded && (

                    <div
                      className="application-expanded"
                    >

                      <div
                        className="application-expanded-grid"
                      >

                        {/* ===================================
                            APPLICATION DETAILS
                            =================================== */}

                        <div
                          className="application-detail-box"
                        >

                          <span>
                            APPLICATION DETAILS
                          </span>


                          <div
                            className="application-detail-row"
                          >

                            <small>
                              Submitted
                            </small>


                            <strong>
                              {formatDateTime(
                                application?.appliedAt
                              )}
                            </strong>

                          </div>


                          <div
                            className="application-detail-row"
                          >

                            <small>
                              Last status change
                            </small>


                            <strong>
                              {formatDateTime(
                                application?.lastStatusChangedAt
                              )}
                            </strong>

                          </div>


                          <div
                            className="application-detail-row"
                          >

                            <small>
                              Recruiter
                            </small>


                            <strong>
                              {recruiterName ||
                                "Recruiter"}
                            </strong>

                          </div>

                        </div>


                        {/* ===================================
                            INTENT
                            =================================== */}

                        <div
                          className="application-detail-box"
                        >

                          <span>
                            YOUR APPLICATION RESPONSE
                          </span>


                          <p>
                            {application?.intentResponse ||
                              "No application response is available."}
                          </p>

                        </div>

                      </div>


                      {/* =====================================
                          SIGNALS
                          ===================================== */}

                      {(
                        responseDebtLabel ||
                        freshnessLabel
                      ) && (

                        <div
                          className="application-health-row"
                        >

                          {responseDebtLabel && (

                            <div
                              className="application-health-card"
                            >

                              <Clock3
                                size={14}
                              />


                              <div>

                                <span>
                                  RESPONSE SIGNAL
                                </span>


                                <strong>
                                  {responseDebtLabel}
                                </strong>

                              </div>

                            </div>

                          )}


                          {freshnessLabel && (

                            <div
                              className="application-health-card"
                            >

                              <TrendingUp
                                size={14}
                              />


                              <div>

                                <span>
                                  ROLE ACTIVITY
                                </span>


                                <strong>
                                  {freshnessLabel}
                                </strong>

                              </div>

                            </div>

                          )}

                        </div>

                      )}


                      {/* =====================================
                          NEXT STEP
                          ===================================== */}

                      <div
                        className="application-next-step"
                      >

                        <div
                          className="application-next-step-icon"
                        >

                          {status ===
                          "rejected" ? (
                            <XCircle
                              size={16}
                            />
                          ) : status ===
                            "hired" ? (
                            <BadgeCheck
                              size={16}
                            />
                          ) : (
                            <Target
                              size={16}
                            />
                          )}

                        </div>


                        <div>

                          <span>
                            WHAT'S NEXT
                          </span>


                          <strong>
                            {status ===
                            "rejected"
                              ? "Keep building your evidence-backed profile."
                              : status ===
                                "hired"
                              ? "Review the role details and keep your professional profile current."
                              : STATUS_DESCRIPTIONS[
                                  status
                                ]}
                          </strong>

                        </div>


                        {status !==
                          "rejected" &&
                          status !==
                            "hired" &&
                          jobId && (

                          <Link
                            to={`/candidate/jobs/${jobId}`}
                          >

                            View opportunity

                            <ArrowRight
                              size={12}
                            />

                          </Link>

                        )}

                      </div>

                    </div>

                  )}

                </article>
              );

            }
          )}

        </section>

      ) : (

        <section
          className="applications-empty"
        >

          <div
            className="applications-empty-icon"
          >

            {hasFilters ? (
              <Search
                size={22}
              />
            ) : (
              <FileCheck2
                size={22}
              />
            )}

          </div>


          <div>

            <span className="candidate-card-eyebrow">
              {hasFilters
                ? "NO MATCHES"
                : "NO APPLICATIONS YET"}
            </span>


            <h2>
              {hasFilters
                ? "Nothing matches your current filters."
                : "Your application journey starts here."}
            </h2>


            <p>
              {hasFilters
                ? "Try a broader search or clear the filters to see more applications."
                : "Explore active roles, find your strongest matches and submit your first application."}
            </p>

          </div>


          {hasFilters ? (

            <button
              type="button"
              className="applications-empty-button"
              onClick={
                clearFilters
              }
            >

              Clear filters

            </button>

          ) : (

            <Link
              to="/candidate/jobs"
              className="applications-empty-button"
            >

              Explore opportunities

              <ArrowRight
                size={13}
              />

            </Link>

          )}

        </section>

      )}


      {/* ===================================================
          PRINCIPLE
          =================================================== */}

      <section
        className="applications-principle"
      >

        <div
          className="applications-principle-icon"
        >

          <BadgeCheck
            size={21}
          />

        </div>


        <div>

          <span className="candidate-section-eyebrow">
            A BETTER HIRING LOOP
          </span>


          <h2>
            Every application should have a visible story.
          </h2>


          <p>
            You apply with evidence, the recruiter moves
            your application through stages, and PulseHire
            keeps that progress connected to the opportunity.
            The goal is simple: fewer forgotten applications
            and a clearer view of where your effort is going.
          </p>

        </div>

      </section>

    </section>
  );
};


export default Applications;