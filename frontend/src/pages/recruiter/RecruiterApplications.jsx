import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getRecruiterJobApplications,
  updateRecruiterApplicationStatus,
} from "../../services/recruiterApplications";


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


/*
 * These mirror the backend's allowed workflow.
 */
const nextStatuses = {
  applied: [
    "reviewing",
    "rejected",
  ],

  reviewing: [
    "shortlisted",
    "rejected",
  ],

  shortlisted: [
    "interview",
    "rejected",
  ],

  interview: [
    "hired",
    "rejected",
  ],

  hired: [],

  rejected: [],
};


/* =========================================================
   HELPERS
   ========================================================= */

const formatStatus = (
  status
) => {

  return (
    statusLabels[
      status
    ] ||
    status ||
    "Unknown"
  );

};


const getInitials = (
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
      parts.length - 1
    ][0]
  ).toUpperCase();

};


const formatDate = (
  value
) => {

  if (!value) {
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


const getResponseDebtText = (
  responseDebt
) => {

  if (!responseDebt) {
    return "";
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
      responseDebt.days !==
      undefined
    ) {

      return `${responseDebt.days} days awaiting response`;

    }


    if (
      responseDebt.hours !==
      undefined
    ) {

      return `${responseDebt.hours} hours awaiting response`;

    }

  }


  return "Awaiting recruiter response";

};


const getCandidateProfile = (
  application
) => {

  return (
    application?.candidate
      ?.profile ||
    {}
  );

};


const getCandidate = (
  application
) => {

  return (
    application?.candidate ||
    {}
  );

};

/* =========================================================
   STATUS ICON
   ========================================================= */

const StatusIcon = ({
  status,
}) => {

  if (
    status ===
    "hired"
  ) {

    return (
      <BadgeCheck
        size={13}
      />
    );

  }


  if (
    status ===
    "rejected"
  ) {

    return (
      <XCircle
        size={13}
      />
    );

  }


  if (
    status ===
    "interview"
  ) {

    return (
      <CheckCircle2
        size={13}
      />
    );

  }


  return (
    <Clock3
      size={13}
    />
  );

};


/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterApplications = () => {

  const {
    jobId,
  } = useParams();


  const [data, setData] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const [updatingApplicationId, setUpdatingApplicationId] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | INITIAL REQUEST
  |--------------------------------------------------------------------------
  |
  | The async function is declared INSIDE the effect.
  |
  | There is no separate loadApplications function being
  | called by the effect, so we avoid the dependency issue
  | we had in the previous implementation.
  |
  | We also do not call setState synchronously before the
  | request. Initial loading is already true.
  |
  */

  useEffect(() => {

    let cancelled =
      false;


    const load =
      async () => {

        if (!jobId) {

          setError(
            "No job was selected."
          );

          setLoading(
            false
          );

          return;

        }


        try {

          const response =
            await getRecruiterJobApplications(
              jobId
            );


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
                "Unable to load applications for this job."
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
            "Recruiter applications load error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to load applications."
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

  }, [
    jobId,
  ]);


  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh =
    async () => {

      if (!jobId) {
        return;
      }


      try {

        setRefreshing(
          true
        );


        setError("");


        setSuccess("");


        const response =
          await getRecruiterJobApplications(
            jobId
          );


        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
              "Unable to refresh applications."
          );

        }


        setData(
          response
        );

      } catch (
        requestError
      ) {

        console.error(
          "Recruiter applications refresh error:",
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


  /*
  |--------------------------------------------------------------------------
  | DERIVED DATA
  |--------------------------------------------------------------------------
  */

  const job =
    data?.job ||
    null;


  const applications =
    Array.isArray(
      data?.applications
    )
      ? data.applications
      : [];


  const summary =
    data?.summary ||
    {
      total:
        applications.length,

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
    };


  const activeApplications =
    applications.filter(
      (
        application
      ) => {

        const status =
          application?.status;


        return (
          status !==
            "rejected" &&
          status !==
            "hired"
        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | UPDATE APPLICATION
  |--------------------------------------------------------------------------
  */

  const handleStatusUpdate =
    async (
      application,
      nextStatus
    ) => {

      const applicationId =
        application?._id;


      const currentStatus =
        application?.status;


      if (
        !applicationId
      ) {

        return;

      }


      const allowed =
        nextStatuses[
          currentStatus
        ] || [];


      if (
        !allowed.includes(
          nextStatus
        )
      ) {

        setError(
          `Invalid application transition from ${formatStatus(
            currentStatus
          )} to ${formatStatus(
            nextStatus
          )}.`
        );

        return;

      }


      try {

        setUpdatingApplicationId(
          applicationId
        );


        setError("");


        setSuccess("");


        const response =
          await updateRecruiterApplicationStatus(
            applicationId,
            nextStatus
          );


        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
              "Unable to update application status."
          );

        }


        setSuccess(
          `Application moved to ${formatStatus(
            nextStatus
          )}.`
        );


        const refreshed =
          await getRecruiterJobApplications(
            jobId
          );


        if (
          refreshed?.success
        ) {

          setData(
            refreshed
          );

        }

      } catch (
        requestError
      ) {

        console.error(
          "Application status update error:",
          requestError
        );


        setError(
          requestError?.response
            ?.data?.message ||
          requestError?.message ||
          "Unable to update application status."
        );

      } finally {

        setUpdatingApplicationId(
          null
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (
    loading
  ) {

    return (
      <section
        className="recruiter-applications-page"
      >

        <div
          className="recruiter-applications-loading"
          role="status"
          aria-live="polite"
        >

          <RefreshCw
            size={28}
            className="recruiter-applications-spin"
          />


          <h1>
            Loading applications
          </h1>


          <p>
            We're gathering the candidates for this position.
          </p>

        </div>

      </section>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | ERROR WITHOUT DATA
  |--------------------------------------------------------------------------
  */

  if (
    error &&
    !data
  ) {

    return (
      <section
        className="recruiter-applications-page"
      >

        <div
          className="recruiter-applications-error-state"
          role="alert"
        >

          <XCircle
            size={30}
          />


          <span className="recruiter-applications-eyebrow">
            APPLICATION PIPELINE
          </span>


          <h1>
            We couldn't load this pipeline.
          </h1>


          <p>
            {error}
          </p>


          <button
            type="button"
            className="recruiter-applications-primary-button"
            onClick={
              handleRefresh
            }
          >

            Try again

          </button>

        </div>

      </section>
    );

  }


  return (
    <section
      className="recruiter-applications-page"
    >

      {/* ===================================================
          PAGE HEADER
          =================================================== */}

      <header
        className="recruiter-applications-header"
      >

        <div>

          <Link
            to="/recruiter/jobs"
            className="recruiter-applications-back"
          >

            <ArrowLeft
              size={13}
            />

            Back to jobs

          </Link>


          <span className="recruiter-applications-eyebrow">
            APPLICATION PIPELINE
          </span>


          <h1>
            {job?.title ||
              "Job Applications"}
          </h1>


          <p>

            {job?.company?.name ||
              "Company"}

            {job?.location
              ? ` · ${job.location}`
              : ""}

          </p>

        </div>


        <button
          type="button"
          className="recruiter-applications-refresh"
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
                ? "recruiter-applications-spin"
                : ""
            }
          />


          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </header>


      {/* ===================================================
          ALERTS
          =================================================== */}

      {error && (

        <div
          className="recruiter-applications-alert error"
          role="alert"
        >

          <XCircle
            size={15}
          />


          <span>
            {error}
          </span>

        </div>

      )}


      {success && (

        <div
          className="recruiter-applications-alert success"
          role="status"
          aria-live="polite"
        >

          <CheckCircle2
            size={15}
          />


          <span>
            {success}
          </span>

        </div>

      )}


      {/* ===================================================
          JOB SUMMARY
          =================================================== */}

      <section
        className="recruiter-applications-job-summary"
      >

        <div
          className="recruiter-applications-job-summary-main"
        >

          <div
            className="recruiter-applications-job-icon"
          >

            <BriefcaseBusiness
              size={20}
            />

          </div>


          <div>

            <span className="recruiter-applications-eyebrow">
              HIRING FOR
            </span>


            <h2>
              {job?.title ||
                "Current position"}
            </h2>


            <div
              className="recruiter-applications-job-meta"
            >

              {job?.location && (
                <span>

                  <MapPin
                    size={11}
                  />

                  {job.location}

                </span>
              )}


              {job?.jobType && (
                <span>

                  <BriefcaseBusiness
                    size={11}
                  />

                  {job.jobType}

                </span>
              )}


              {job?.status && (
                <span>

                  <CheckCircle2
                    size={11}
                  />

                  {String(
                    job.status
                  )}

                </span>
              )}

            </div>

          </div>

        </div>


        <div
          className="recruiter-applications-job-stats"
        >

          <div>

            <span>
              APPLICATIONS
            </span>


            <strong>
              {summary.total}
            </strong>

          </div>


          <div>

            <span>
              ACTIVE
            </span>


            <strong>
              {activeApplications.length}
            </strong>

          </div>

        </div>

      </section>


      {/* ===================================================
          METRICS
          =================================================== */}

      <section
        className="recruiter-applications-metrics"
      >

        <div
          className="recruiter-applications-metric"
        >

          <span>
            APPLIED
          </span>


          <strong>
            {summary.applied}
          </strong>


          <small>
            newly submitted
          </small>

        </div>


        <div
          className="recruiter-applications-metric"
        >

          <span>
            REVIEWING
          </span>


          <strong>
            {summary.reviewing}
          </strong>


          <small>
            currently under review
          </small>

        </div>


        <div
          className="recruiter-applications-metric"
        >

          <span>
            SHORTLISTED
          </span>


          <strong>
            {summary.shortlisted}
          </strong>


          <small>
            moved forward
          </small>

        </div>


        <div
          className="recruiter-applications-metric"
        >

          <span>
            INTERVIEW
          </span>


          <strong>
            {summary.interview}
          </strong>


          <small>
            interview stage
          </small>

        </div>


        <div
          className="recruiter-applications-metric"
        >

          <span>
            HIRED
          </span>


          <strong>
            {summary.hired}
          </strong>


          <small>
            successful outcomes
          </small>

        </div>

      </section>


      {/* ===================================================
          CANDIDATE LIST
          =================================================== */}

      <section
        className="recruiter-applications-section"
      >

        <div
          className="recruiter-applications-section-header"
        >

          <div>

            <span className="recruiter-applications-eyebrow">
              CANDIDATES
            </span>


            <h2>
              Application pipeline
            </h2>


            <p>
              Review candidate information and advance
              applications through the hiring process.
            </p>

          </div>


          <span
            className="recruiter-applications-count"
          >

            {applications.length}{" "}

            {applications.length ===
            1
              ? "candidate"
              : "candidates"}

          </span>

        </div>


        {applications.length ===
        0 ? (

          <div
            className="recruiter-applications-empty"
          >

            <div
              className="recruiter-applications-empty-icon"
            >

              <User
                size={23}
              />

            </div>


            <span className="recruiter-applications-eyebrow">
              NO APPLICATIONS
            </span>


            <h3>
              No candidates have applied yet.
            </h3>


            <p>
              Applications for this position will appear
              here when candidates submit them.
            </p>

          </div>

        ) : (

          <div
            className="recruiter-applications-list"
          >

            {applications.map(
              (
                application
              ) => {

                const candidate =
                  getCandidate(
                    application
                  );


                const profile =
                  getCandidateProfile(
                    application
                  );


                const currentStatus =
                  application?.status ||
                  "applied";


                const availableStatuses =
                  nextStatuses[
                    currentStatus
                  ] || [];


                const isUpdating =
                  updatingApplicationId ===
                  application?._id;


                const responseDebt =
                  getResponseDebtText(
                    application?.responseDebt
                  );


                const skills =
                  Array.isArray(
                    profile?.skills
                  )
                    ? profile.skills
                    : [];


                const candidateName =
                  candidate?.fullname ||
                  "Candidate";


                return (
                  <article
                    className="recruiter-application-card"
                    key={
                      application?._id
                    }
                  >

                    {/* =======================================
                        CANDIDATE HEADER
                        ======================================= */}

                    <div
                      className="recruiter-application-header"
                    >

                      <div
                        className="recruiter-application-identity"
                      >

                        {profile?.profilePhoto ? (

                          <img
                            src={
                              profile.profilePhoto
                            }
                            alt={
                              candidateName
                            }
                            className="recruiter-application-avatar"
                          />

                        ) : (

                          <div
                            className="recruiter-application-avatar-fallback"
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
                        className={`recruiter-application-status ${currentStatus}`}
                      >

                        <StatusIcon
                          status={
                            currentStatus
                          }
                        />


                        {formatStatus(
                          currentStatus
                        )}

                      </span>

                    </div>


                    {/* =======================================
                        CONTACT
                        ======================================= */}

                    <div
                      className="recruiter-application-contact-grid"
                    >

                      <div
                        className="recruiter-application-contact"
                      >

                        <Mail
                          size={14}
                        />


                        <div>

                          <span>
                            EMAIL
                          </span>


                          <strong>
                            {candidate?.email ||
                              "Not available"}
                          </strong>

                        </div>

                      </div>


                      <div
                        className="recruiter-application-contact"
                      >

                        <Phone
                          size={14}
                        />


                        <div>

                          <span>
                            PHONE
                          </span>


                          <strong>
                            {candidate?.phoneNumber ||
                              "Not available"}
                          </strong>

                        </div>

                      </div>


                      <div
                        className="recruiter-application-contact"
                      >

                        <MapPin
                          size={14}
                        />


                        <div>

                          <span>
                            LOCATION
                          </span>


                          <strong>
                            {profile?.location ||
                              job?.location ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>


                      <div
                        className="recruiter-application-contact"
                      >

                        <FileText
                          size={14}
                        />


                        <div>

                          <span>
                            RESUME
                          </span>


                          {profile?.resume ? (

                            <a
                              href={
                                profile.resume
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View resume
                            </a>

                          ) : (

                            <strong>
                              Not uploaded
                            </strong>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* =======================================
                        BIO
                        ======================================= */}

                    {profile?.bio && (

                      <div
                        className="recruiter-application-content-block"
                      >

                        <span>
                          CANDIDATE SUMMARY
                        </span>


                        <p>
                          {profile.bio}
                        </p>

                      </div>

                    )}


                    {/* =======================================
                        SKILLS
                        ======================================= */}

                    <div
                      className="recruiter-application-content-block"
                    >

                      <span>
                        PROFILE SKILLS
                      </span>


                      {skills.length >
                      0 ? (

                        <div
                          className="recruiter-application-skill-list"
                        >

                          {skills.map(
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

                        </div>

                      ) : (

                        <p>
                          No profile skills have been listed.
                        </p>

                      )}

                    </div>


                    {/* =======================================
                        INTENT
                        ======================================= */}

                    {application?.intentResponse && (

                      <div
                        className="recruiter-application-intent"
                      >

                        <div>

                          <FileText
                            size={15}
                          />


                          <span>
                            CANDIDATE INTENT
                          </span>

                        </div>


                        <p>
                          {application.intentResponse}
                        </p>

                      </div>

                    )}


                    {/* =======================================
                        RESPONSE SIGNAL
                        ======================================= */}

                    {responseDebt && (

                      <div
                        className="recruiter-application-response"
                      >

                        <Clock3
                          size={14}
                        />


                        <span>
                          {responseDebt}
                        </span>

                      </div>

                    )}


                    {/* =======================================
                        FOOTER
                        ======================================= */}

                    <div
                      className="recruiter-application-footer"
                    >

                      <div
                        className="recruiter-application-current"
                      >

                        <span>
                          CURRENT STAGE
                        </span>


                        <strong>
                          {formatStatus(
                            currentStatus
                          )}
                        </strong>

                      </div>


                      <div
                        className="recruiter-application-actions"
                      >

                        {availableStatuses.length ===
                        0 ? (

                          <span
                            className="recruiter-application-terminal"
                          >

                            {currentStatus ===
                            "hired"
                              ? "Hiring complete"
                              : "Application closed"}

                          </span>

                        ) : (

                          availableStatuses.map(
                            (
                              nextStatus
                            ) => {

                              const rejected =
                                nextStatus ===
                                "rejected";


                              return (
                                <button
                                  key={
                                    nextStatus
                                  }
                                  type="button"
                                  disabled={
                                    isUpdating
                                  }
                                  className={`recruiter-application-action ${
                                    rejected
                                      ? "reject"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application,
                                      nextStatus
                                    )
                                  }
                                >

                                  {isUpdating && (

                                    <RefreshCw
                                      size={12}
                                      className="recruiter-applications-spin"
                                    />

                                  )}


                                  {formatStatus(
                                    nextStatus
                                  )}

                                </button>
                              );

                            }
                          )

                        )}

                      </div>

                    </div>

                  </article>
                );

              }
            )}

          </div>

        )}

      </section>


      {/* ===================================================
          WORKFLOW NOTE
          =================================================== */}

      <section
        className="recruiter-applications-workflow-note"
      >

        <div
          className="recruiter-applications-workflow-icon"
        >

          <BadgeCheck
            size={19}
          />

        </div>


        <div>

          <span className="recruiter-applications-eyebrow">
            CONTROLLED HIRING WORKFLOW
          </span>


          <h2>
            Progress candidates with a clear hiring signal.
          </h2>


          <p>
            PulseHire follows the recruiter-approved
            application state machine. Candidates move
            from Applied to Reviewing, Shortlisted,
            Interview and finally Hired, while rejected
            and hired applications remain terminal states.
          </p>

        </div>

      </section>

    </section>
  );
};


export default RecruiterApplications;