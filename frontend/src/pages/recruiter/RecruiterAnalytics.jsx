import {
  useEffect,
  useState,
} from "react";

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

import {
  Link,
} from "react-router-dom";

import {
  getRecruiterAnalytics,
} from "../../services/recruiterAnalytics";


/* =========================================================
   HELPERS
   ========================================================= */

const formatNumber = (
  value
) => {

  return new Intl.NumberFormat(
    "en-IN"
  ).format(
    Number(
      value || 0
    )
  );

};


const formatPercent = (
  value
) => {

  return `${Math.round(
    Number(
      value || 0
    )
  )}%`;

};


const formatHours = (
  value
) => {

  const hours =
    Number(
      value || 0
    );


  if (
    hours <= 0
  ) {

    return "—";

  }


  if (
    hours < 1
  ) {

    return "<1h";

  }


  if (
    hours < 24
  ) {

    return `${hours.toFixed(
      hours % 1 === 0
        ? 0
        : 1
    )}h`;

  }


  const days =
    hours / 24;


  return `${days.toFixed(
    days % 1 === 0
      ? 0
      : 1
  )}d`;

};


const formatDate = (
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


const formatDateTime = (
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


  return date.toLocaleString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );

};


const formatStatus = (
  status
) => {

  const labels = {
    applied:
      "Applied",

    reviewing:
      "Reviewing",

    shortlisted:
      "Shortlisted",

    interview:
      "Interview",

    rejected:
      "Rejected",

    hired:
      "Hired",
  };


  return (
    labels[
      String(
        status || ""
      ).toLowerCase()
    ] ||
    status ||
    "Unknown"
  );

};


const getStatusIcon = (
  status
) => {

  switch (
    String(
      status || ""
    ).toLowerCase()
  ) {

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


/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterAnalytics = () => {

  const [data, setData] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [error, setError] =
    useState("");


  /* =======================================================
     LOAD
     ======================================================= */

  useEffect(() => {

    let cancelled =
      false;


    const load =
      async () => {

        try {

          const response =
            await getRecruiterAnalytics();


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
                "Unable to load recruiter analytics."
            );

          }


          setData(
            response
          );


          setError("");

        } catch (
          requestError
        ) {

          if (
            cancelled
          ) {

            return;

          }


          console.error(
            "Recruiter analytics load error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to load recruiter analytics."
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

      cancelled = true;

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


        const response =
          await getRecruiterAnalytics();


        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
              "Unable to refresh analytics."
          );

        }


        setData(
          response
        );

      } catch (
        requestError
      ) {

        console.error(
          "Recruiter analytics refresh error:",
          requestError
        );


        setError(
          requestError?.response
            ?.data?.message ||
          requestError?.message ||
          "Unable to refresh analytics."
        );

      } finally {

        setRefreshing(
          false
        );

      }

    };


  /* =======================================================
     LOADING
     ======================================================= */

  if (
    loading
  ) {

    return (
      <section
        className="recruiter-analytics-page"
      >

        <div
          className="recruiter-analytics-loading"
          role="status"
          aria-live="polite"
        >

          <RefreshCw
            size={32}
            className="recruiter-analytics-spin"
          />


          <h1>
            Preparing your analytics
          </h1>


          <p>
            We're calculating the latest hiring performance
            signals from your recruiter workspace.
          </p>

        </div>

      </section>
    );

  }


  const summary =
    data?.summary ||
    {};


  const funnel =
    data?.funnel ||
    {};


  const jobPerformance =
    Array.isArray(
      data?.jobPerformance
    )
      ? data.jobPerformance
      : [];


  const topRequiredSkills =
    Array.isArray(
      data?.topRequiredSkills
    )
      ? data.topRequiredSkills
      : [];


  const recentApplications =
    Array.isArray(
      data?.recentApplications
    )
      ? data.recentApplications
      : [];


  const recentHiringActivity =
    Array.isArray(
      data?.recentHiringActivity
    )
      ? data.recentHiringActivity
      : [];


  const maxApplicants =
    Math.max(
      1,
      ...jobPerformance.map(
        (
          job
        ) =>
          Number(
            job?.applicants ||
            0
          )
      )
    );


  const maxRequiredSkillCount =
    Math.max(
      1,
      ...topRequiredSkills.map(
        (
          skill
        ) =>
          Number(
            skill?.count ||
            0
          )
      )
    );


  const funnelMaximum =
    Math.max(
      1,
      Number(
        funnel.applied ||
        0
      )
    );


  return (
    <section
      className="recruiter-analytics-page"
    >

      {/* ===================================================
          HEADER
          =================================================== */}

      <header
        className="recruiter-analytics-header"
      >

        <div>

          <span className="recruiter-analytics-eyebrow">
            PERFORMANCE INTELLIGENCE
          </span>


          <h1>
            Understand what's driving your hiring.
          </h1>


          <p>
            Go deeper than dashboard totals. Explore funnel
            movement, job performance, candidate quality and
            recruiter response signals.
          </p>

        </div>


        <div
          className="recruiter-analytics-header-actions"
        >

          <Link
            to="/recruiter/jobs"
            className="recruiter-analytics-secondary-action"
          >

            <BriefcaseBusiness
              size={14}
            />

            Manage jobs

          </Link>


          <button
            type="button"
            className="recruiter-analytics-refresh"
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
                  ? "recruiter-analytics-spin"
                  : ""
              }
            />


            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

      </header>


      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (

        <div
          className="recruiter-analytics-alert"
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


      {/* ===================================================
          PRIMARY KPI
          =================================================== */}

      <section
        className="recruiter-analytics-kpis"
      >

        <article
          className="recruiter-analytics-kpi primary"
        >

          <div>

            <span>
              APPLICATIONS
            </span>


            <strong>
              {formatNumber(
                summary.totalApplications
              )}
            </strong>


            <small>
              {formatNumber(
                summary.applicationsLast7Days
              )}{" "}
              received in the last 7 days
            </small>

          </div>


          <Users
            size={20}
          />

        </article>


        <article
          className="recruiter-analytics-kpi"
        >

          <div>

            <span>
              ACTIVE JOBS
            </span>


            <strong>
              {formatNumber(
                summary.activeJobs
              )}
            </strong>


            <small>
              of{" "}
              {formatNumber(
                summary.totalJobs
              )}{" "}
              total roles
            </small>

          </div>


          <BriefcaseBusiness
            size={20}
          />

        </article>


        <article
          className="recruiter-analytics-kpi"
        >

          <div>

            <span>
              VERIFIED APPLICANTS
            </span>


            <strong>
              {formatNumber(
                summary.verifiedApplicants
              )}
            </strong>


            <small>
              backed by approved skill evidence
            </small>

          </div>


          <BadgeCheck
            size={20}
          />

        </article>


        <article
          className="recruiter-analytics-kpi"
        >

          <div>

            <span>
              STRONG MATCHES
            </span>


            <strong>
              {formatNumber(
                summary.strongMatches
              )}
            </strong>


            <small>
              applications with 80%+ alignment
            </small>

          </div>


          <Sparkles
            size={20}
          />

        </article>


        <article
          className="recruiter-analytics-kpi"
        >

          <div>

            <span>
              AVERAGE MATCH
            </span>


            <strong>
              {formatPercent(
                summary.averageMatchRate
              )}
            </strong>


            <small>
              across scored applications
            </small>

          </div>


          <Target
            size={20}
          />

        </article>


        <article
          className="recruiter-analytics-kpi"
        >

          <div>

            <span>
              RESPONSE TIME
            </span>


            <strong>
              {formatHours(
                summary.averageResponseHours
              )}
            </strong>


            <small>
              average recruiter response
            </small>

          </div>


          <Clock3
            size={20}
          />

        </article>

      </section>


      {/* ===================================================
          CONVERSION CARDS
          =================================================== */}

      <section
        className="recruiter-analytics-conversions"
      >

        <div>

          <span>
            SHORTLIST RATE
          </span>


          <strong>
            {formatPercent(
              summary.shortlistRate
            )}
          </strong>


          <small>
            Applications reaching shortlist
          </small>


          <div
            className="recruiter-analytics-progress"
          >

            <span
              style={{
                width:
                  `${Math.min(
                    100,
                    Number(
                      summary.shortlistRate ||
                      0
                    )
                  )}%`,
              }}
            />

          </div>

        </div>


        <div>

          <span>
            INTERVIEW RATE
          </span>


          <strong>
            {formatPercent(
              summary.interviewRate
            )}
          </strong>


          <small>
            Applications reaching interview
          </small>


          <div
            className="recruiter-analytics-progress"
          >

            <span
              style={{
                width:
                  `${Math.min(
                    100,
                    Number(
                      summary.interviewRate ||
                      0
                    )
                  )}%`,
              }}
            />

          </div>

        </div>


        <div>

          <span>
            HIRING CONVERSION
          </span>


          <strong>
            {formatPercent(
              summary.hiringConversionRate
            )}
          </strong>


          <small>
            Applications resulting in hires
          </small>


          <div
            className="recruiter-analytics-progress"
          >

            <span
              style={{
                width:
                  `${Math.min(
                    100,
                    Number(
                      summary.hiringConversionRate ||
                      0
                    )
                  )}%`,
              }}
            />

          </div>

        </div>


        <div>

          <span>
            VERIFIED COVERAGE
          </span>


          <strong>
            {formatPercent(
              summary.totalApplications
                ? (
                    (
                      Number(
                        summary.verifiedApplicants ||
                        0
                      ) /
                      Number(
                        summary.totalApplications
                      )
                    ) *
                    100
                  )
                : 0
            )}
          </strong>


          <small>
            Applications with verified evidence
          </small>


          <div
            className="recruiter-analytics-progress"
          >

            <span
              style={{
                width:
                  `${Math.min(
                    100,
                    summary.totalApplications
                      ? (
                          Number(
                            summary.verifiedApplicants ||
                            0
                          ) /
                          Number(
                            summary.totalApplications
                          )
                        ) *
                        100
                      : 0
                  )}%`,
              }}
            />

          </div>

        </div>

      </section>


      {/* ===================================================
          FUNNEL + JOB OVERVIEW
          =================================================== */}

      <div
        className="recruiter-analytics-two-column"
      >

        <section
          className="recruiter-analytics-panel"
        >

          <div
            className="recruiter-analytics-panel-heading"
          >

            <div>

              <span className="recruiter-analytics-eyebrow">
                CONVERSION PATH
              </span>


              <h2>
                Hiring funnel
              </h2>


              <p>
                Understand how candidates progress through your
                recruiter workflow.
              </p>

            </div>


            <BarChart3
              size={18}
            />

          </div>


          <div
            className="recruiter-analytics-funnel"
          >

            {[
              {
                key:
                  "applied",

                label:
                  "Applied",

                value:
                  funnel.applied,
              },

              {
                key:
                  "reviewing",

                label:
                  "Reviewing",

                value:
                  funnel.reviewing,
              },

              {
                key:
                  "shortlisted",

                label:
                  "Shortlisted",

                value:
                  funnel.shortlisted,
              },

              {
                key:
                  "interview",

                label:
                  "Interview",

                value:
                  funnel.interview,
              },

              {
                key:
                  "hired",

                label:
                  "Hired",

                value:
                  funnel.hired,
              },
            ].map(
              (
                stage
              ) => {

                const value =
                  Number(
                    stage.value ||
                    0
                  );


                const width =
                  Math.max(
                    5,
                    Math.min(
                      100,
                      (
                        value /
                        funnelMaximum
                      ) *
                      100
                    )
                  );


                return (
                  <div
                    className="recruiter-analytics-funnel-row"
                    key={
                      stage.key
                    }
                  >

                    <div>

                      <span>
                        {stage.label}
                      </span>


                      <strong>
                        {formatNumber(
                          value
                        )}
                      </strong>

                    </div>


                    <div
                      className="recruiter-analytics-funnel-track"
                    >

                      <span
                        className={
                          `recruiter-analytics-funnel-fill ${stage.key}`
                        }
                        style={{
                          width:
                            `${width}%`,
                        }}
                      />

                    </div>

                  </div>
                );

              }
            )}

          </div>


          <div
            className="recruiter-analytics-rejection"
          >

            <span>
              Rejected applications
            </span>


            <strong>
              {formatNumber(
                funnel.rejected
              )}
            </strong>

          </div>

        </section>


        <section
          className="recruiter-analytics-panel"
        >

          <div
            className="recruiter-analytics-panel-heading"
          >

            <div>

              <span className="recruiter-analytics-eyebrow">
                WORKFORCE DEMAND
              </span>


              <h2>
                Hiring footprint
              </h2>


              <p>
                A quick view of the size and quality of your
                current recruiter pipeline.
              </p>

            </div>


            <TrendingUp
              size={18}
            />

          </div>


          <div
            className="recruiter-analytics-health-grid"
          >

            <div>

              <span>
                TOTAL ROLES
              </span>


              <strong>
                {formatNumber(
                  summary.totalJobs
                )}
              </strong>


              <small>
                all recruiter jobs
              </small>

            </div>


            <div>

              <span>
                OPEN ROLES
              </span>


              <strong>
                {formatNumber(
                  summary.activeJobs
                )}
              </strong>


              <small>
                currently active
              </small>

            </div>


            <div>

              <span>
                VERIFIED
              </span>


              <strong>
                {formatNumber(
                  summary.verifiedApplicants
                )}
              </strong>


              <small>
                verified applicants
              </small>

            </div>


            <div>

              <span>
                MATCH QUALITY
              </span>


              <strong>
                {formatPercent(
                  summary.averageMatchRate
                )}
              </strong>


              <small>
                average match
              </small>

            </div>

          </div>


          <div
            className="recruiter-analytics-signal-card"
          >

            <div
              className="recruiter-analytics-signal-icon"
            >

              <FileCheck2
                size={17}
              />

            </div>


            <div>

              <span>
                EVIDENCE SIGNAL
              </span>


              <strong>
                {formatNumber(
                  summary.verifiedApplicants
                )}{" "}
                verified applicants
              </strong>


              <p>
                Candidates with approved proof provide a
                stronger evidence signal than an unverified
                skill claim.
              </p>

            </div>

          </div>

        </section>

      </div>


      {/* ===================================================
          JOB PERFORMANCE
          =================================================== */}

      <section
        className="recruiter-analytics-panel recruiter-analytics-job-section"
      >

        <div
          className="recruiter-analytics-panel-heading"
        >

          <div>

            <span className="recruiter-analytics-eyebrow">
              ROLE ANALYSIS
            </span>


            <h2>
              Job performance
            </h2>


            <p>
              Compare applicant volume, verified candidates,
              strong matches, match quality and hires across
              recruiter-owned roles.
            </p>

          </div>


          <Link
            to="/recruiter/jobs"
            className="recruiter-analytics-panel-link"
          >

            View all jobs

            <ArrowRight
              size={13}
            />

          </Link>

        </div>


        {jobPerformance.length ===
        0 ? (

          <div
            className="recruiter-analytics-empty"
          >

            <BriefcaseBusiness
              size={22}
            />


            <span>
              Job performance will appear once you have
              recruiter-owned jobs.
            </span>

          </div>

        ) : (

          <div
            className="recruiter-analytics-job-list"
          >

            {jobPerformance.map(
              (
                job
              ) => {

                const applicants =
                  Number(
                    job?.applicants ||
                    0
                  );


                const match =
                  Number(
                    job?.averageMatchRate ||
                    0
                  );


                return (
                  <div
                    className="recruiter-analytics-job-card"
                    key={
                      String(
                        job?.jobId
                      )
                    }
                  >

                    <div
                      className="recruiter-analytics-job-card-header"
                    >

                      <div
                        className="recruiter-analytics-job-title"
                      >

                        <div
                          className="recruiter-analytics-job-icon"
                        >

                          <BriefcaseBusiness
                            size={15}
                          />

                        </div>


                        <div>

                          <strong>
                            {job?.title ||
                              "Untitled role"}
                          </strong>


                          <span>
                            {job?.company ||
                              "Company"}
                          </span>

                        </div>

                      </div>


                      <span
                        className={
                          `recruiter-analytics-job-status ${
                            job?.status ||
                            "unknown"
                          }`
                        }
                      >
                        {formatStatus(
                          job?.status
                        )}
                      </span>

                    </div>


                    <div
                      className="recruiter-analytics-job-metrics"
                    >

                      <div>

                        <span>
                          APPLICANTS
                        </span>


                        <strong>
                          {formatNumber(
                            applicants
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          VERIFIED
                        </span>


                        <strong>
                          {formatNumber(
                            job?.verifiedApplicants
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          STRONG
                        </span>


                        <strong>
                          {formatNumber(
                            job?.strongMatches
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          SHORTLISTED
                        </span>


                        <strong>
                          {formatNumber(
                            job?.shortlisted
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          HIRED
                        </span>


                        <strong>
                          {formatNumber(
                            job?.hired
                          )}
                        </strong>

                      </div>

                    </div>


                    <div
                      className="recruiter-analytics-job-quality"
                    >

                      <div>

                        <div>

                          <span>
                            APPLICANT VOLUME
                          </span>


                          <strong>
                            {formatNumber(
                              applicants
                            )}
                          </strong>

                        </div>


                        <div
                          className="recruiter-analytics-job-bar"
                        >

                          <span
                            style={{
                              width:
                                `${Math.max(
                                  4,
                                  (
                                    applicants /
                                    maxApplicants
                                  ) *
                                  100
                                )}%`,
                            }}
                          />

                        </div>

                      </div>


                      <div>

                        <div>

                          <span>
                            MATCH QUALITY
                          </span>


                          <strong>
                            {formatPercent(
                              match
                            )}
                          </strong>

                        </div>


                        <div
                          className="recruiter-analytics-job-bar"
                        >

                          <span
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  Math.max(
                                    4,
                                    match
                                  )
                                )}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>


                    <div
                      className="recruiter-analytics-job-footer"
                    >

                      <span>
                        {formatNumber(
                          job?.requiredSkills?.length
                        )}{" "}
                        required skill
                        {job?.requiredSkills?.length ===
                        1
                          ? ""
                          : "s"}
                      </span>


                      <Link
                        to={`/recruiter/applications/${job?.jobId}`}
                      >

                        Review applicants

                        <ArrowRight
                          size={12}
                        />

                      </Link>

                    </div>

                  </div>
                );

              }
            )}

          </div>

        )}

      </section>


      {/* ===================================================
          TOP SKILLS
          =================================================== */}

      <section
        className="recruiter-analytics-panel recruiter-analytics-skills-section"
      >

        <div
          className="recruiter-analytics-panel-heading"
        >

          <div>

            <span className="recruiter-analytics-eyebrow">
              TALENT DEMAND
            </span>


            <h2>
              Most requested skills
            </h2>


            <p>
              See which capabilities appear most often across
              your recruiter-owned roles.
            </p>

          </div>


          <Target
            size={18}
          />

        </div>


        {topRequiredSkills.length ===
        0 ? (

          <div
            className="recruiter-analytics-empty"
          >

            <Target
              size={22}
            />


            <span>
              Required skill demand will appear when jobs
              contain skills or requirements.
            </span>

          </div>

        ) : (

          <div
            className="recruiter-analytics-skill-list"
          >

            {topRequiredSkills.map(
              (
                skill,
                index
              ) => {

                const count =
                  Number(
                    skill?.count ||
                    0
                  );


                const width =
                  Math.max(
                    6,
                    (
                      count /
                      maxRequiredSkillCount
                    ) *
                    100
                  );


                return (
                  <div
                    className="recruiter-analytics-skill-row"
                    key={`${skill?.skill || "skill"}-${index}`}
                  >

                    <div>

                      <strong>
                        {skill?.skill ||
                          "Unknown skill"}
                      </strong>


                      <span>
                        {formatNumber(
                          count
                        )}{" "}
                        role
                        {count ===
                        1
                          ? ""
                          : "s"}
                      </span>

                    </div>


                    <div
                      className="recruiter-analytics-skill-track"
                    >

                      <span
                        style={{
                          width:
                            `${Math.min(
                              100,
                              width
                            )}%`,
                        }}
                      />

                    </div>

                  </div>
                );

              }
            )}

          </div>

        )}

      </section>


      {/* ===================================================
          RECENT ACTIVITY
          =================================================== */}

      <div
        className="recruiter-analytics-two-column"
      >

        <section
          className="recruiter-analytics-panel"
        >

          <div
            className="recruiter-analytics-panel-heading"
          >

            <div>

              <span className="recruiter-analytics-eyebrow">
                APPLICATIONS
              </span>


              <h2>
                Recent applications
              </h2>


              <p>
                Latest candidate submissions across your
                recruiter workspace.
              </p>

            </div>


            <Users
              size={18}
            />

          </div>


          {recentApplications.length ===
          0 ? (

            <div
              className="recruiter-analytics-empty"
            >

              <Users
                size={22}
              />


              <span>
                No applications have arrived yet.
              </span>

            </div>

          ) : (

            <div
              className="recruiter-analytics-activity-list"
            >

              {recentApplications
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    application
                  ) => (

                    <Link
                      key={
                        String(
                          application?.applicationId
                        )
                      }
                      to={
                        application?.job?.id
                          ? `/recruiter/applications/${application.job.id}`
                          : "/recruiter/candidates"
                      }
                      className="recruiter-analytics-activity-row"
                    >

                      <div
                        className="recruiter-analytics-activity-avatar"
                      >

                        {String(
                          application?.candidate
                            ?.fullname ||
                          "CA"
                        )
                          .trim()
                          .slice(
                            0,
                            2
                          )
                          .toUpperCase()}

                      </div>


                      <div
                        className="recruiter-analytics-activity-copy"
                      >

                        <strong>
                          {application?.candidate
                            ?.fullname ||
                            "Candidate"}
                        </strong>


                        <span>
                          {application?.job
                            ?.title ||
                            "Untitled role"}
                        </span>

                      </div>


                      <div
                        className="recruiter-analytics-activity-meta"
                      >

                        <span
                          className={
                            `recruiter-analytics-status ${
                              application?.status ||
                              "unknown"
                            }`
                          }
                        >
                          {formatStatus(
                            application?.status
                          )}
                        </span>


                        <small>
                          {formatDate(
                            application?.appliedAt
                          )}
                        </small>

                      </div>


                      <ArrowRight
                        size={13}
                      />

                    </Link>

                  )
                )}

            </div>

          )}

        </section>


        <section
          className="recruiter-analytics-panel"
        >

          <div
            className="recruiter-analytics-panel-heading"
          >

            <div>

              <span className="recruiter-analytics-eyebrow">
                DECISION ACTIVITY
              </span>


              <h2>
                Recent hiring activity
              </h2>


              <p>
                Status changes made across the recruiter
                application pipeline.
              </p>

            </div>


            <Activity
              size={18}
            />

          </div>


          {recentHiringActivity.length ===
          0 ? (

            <div
              className="recruiter-analytics-empty"
            >

              <Activity
                size={22}
              />


              <span>
                Hiring decisions will appear here as candidates
                move through the pipeline.
              </span>

            </div>

          ) : (

            <div
              className="recruiter-analytics-hiring-list"
            >

              {recentHiringActivity
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    activity
                  ) => {

                    const ActivityIcon =
                      getStatusIcon(
                        activity?.status
                      );


                    return (
                      <div
                        className="recruiter-analytics-hiring-row"
                        key={
                          String(
                            activity?.applicationId
                          )
                        }
                      >

                        <div
                          className="recruiter-analytics-hiring-icon"
                        >

                          <ActivityIcon
                            size={14}
                          />

                        </div>


                        <div
                          className="recruiter-analytics-hiring-copy"
                        >

                          <strong>
                            {activity?.candidate ||
                              "Candidate"}
                          </strong>


                          <span>
                            {formatStatus(
                              activity?.status
                            )}{" "}
                            ·{" "}
                            {activity?.job ||
                              "Job"}
                          </span>

                        </div>


                        <small>
                          {formatDateTime(
                            activity?.updatedAt
                          )}
                        </small>

                      </div>
                    );

                  }
                )}

            </div>

          )}

        </section>

      </div>


      {/* ===================================================
          FOOTER INSIGHT
          =================================================== */}

      <section
        className="recruiter-analytics-insight"
      >

        <div
          className="recruiter-analytics-insight-icon"
        >

          <Sparkles
            size={20}
          />

        </div>


        <div>

          <span className="recruiter-analytics-eyebrow">
            PULSEHIRE ANALYTICS
          </span>


          <h2>
            Better hiring decisions come from combining volume,
            evidence and conversion.
          </h2>


          <p>
            Applicant volume tells you where demand is.
            Verified-skill signals indicate evidence quality.
            Match rates indicate alignment, while funnel
            conversion shows how effectively candidates move
            toward a hire.
          </p>

        </div>

      </section>

    </section>
  );
};


export default RecruiterAnalytics;