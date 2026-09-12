import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getRecruiterCandidates,
  getRecruiterCandidateById,
} from "../../services/recruiterCandidates";

import {
  getRecruiterJobs,
} from "../../services/recruiterJobs";


/* =========================================================
   STATUS LABELS
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

const formatStatus = (
  status
) => {

  return (
    statusLabels[
      String(
        status || ""
      ).toLowerCase()
    ] ||
    status ||
    "Unknown"
  );

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


const getMatchTone = (
  score
) => {

  const numericScore =
    Number(
      score || 0
    );


  if (
    numericScore >=
    80
  ) {
    return "strong";
  }


  if (
    numericScore >=
    60
  ) {
    return "good";
  }


  return "low";

};


const getLatestApplication = (
  applications
) => {

  if (
    !Array.isArray(
      applications
    ) ||
    applications.length ===
      0
  ) {

    return null;

  }


  return (
    applications[0] ||
    null
  );

};


/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterCandidates = () => {

  const [candidates, setCandidates] =
    useState([]);


  const [summary, setSummary] =
    useState({
      total:
        0,

      verifiedCandidates:
        0,

      strongMatches:
        0,

      averageMatchRate:
        0,
    });


  const [jobs, setJobs] =
    useState([]);


  const [selectedJobId, setSelectedJobId] =
    useState("");


  const [searchTerm, setSearchTerm] =
    useState("");


  const [matchFilter, setMatchFilter] =
    useState("all");


  const [verificationFilter, setVerificationFilter] =
    useState("all");


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [loadingCandidateId, setLoadingCandidateId] =
    useState(null);


  const [selectedCandidate, setSelectedCandidate] =
    useState(null);


  const [error, setError] =
    useState("");


  const [detailError, setDetailError] =
    useState("");


  /* =======================================================
     LOAD JOBS
     ======================================================= */

  useEffect(() => {

    let cancelled =
      false;


    const loadJobs =
      async () => {

        try {

          const response =
            await getRecruiterJobs();


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
                "Unable to load recruiter jobs."
            );

          }


          setJobs(
            Array.isArray(
              response.jobs
            )
              ? response.jobs
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
            "Recruiter candidate job filter error:",
            requestError
          );

        }

      };


    loadJobs();


    return () => {
      cancelled = true;
    };

  }, []);


  /* =======================================================
     LOAD CANDIDATES
     ======================================================= */

  useEffect(() => {

    let cancelled =
      false;


    const loadCandidates =
      async () => {

        try {

          setLoading(
            true
          );


          setError("");


          const response =
            await getRecruiterCandidates(
              selectedJobId
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
                "Unable to load recruiter candidates."
            );

          }


          setCandidates(
            Array.isArray(
              response.candidates
            )
              ? response.candidates
              : []
          );


          setSummary(
            response.summary ||
            {
              total:
                0,

              verifiedCandidates:
                0,

              strongMatches:
                0,

              averageMatchRate:
                0,
            }
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
            "Recruiter candidates load error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to load recruiter candidates."
          );


          setCandidates([]);

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


    loadCandidates();


    return () => {
      cancelled = true;
    };

  }, [
    selectedJobId,
  ]);


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
          await getRecruiterCandidates(
            selectedJobId
          );


        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
              "Unable to refresh candidates."
          );

        }


        setCandidates(
          Array.isArray(
            response.candidates
          )
            ? response.candidates
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
          "Recruiter candidates refresh error:",
          requestError
        );


        setError(
          requestError?.response
            ?.data?.message ||
          requestError?.message ||
          "Unable to refresh candidates."
        );

      } finally {

        setRefreshing(
          false
        );

      }

    };


  /* =======================================================
     OPEN CANDIDATE
     ======================================================= */

  const handleOpenCandidate =
    async (
      candidateId
    ) => {

      if (
        !candidateId
      ) {
        return;
      }


      try {

        setLoadingCandidateId(
          candidateId
        );


        setDetailError("");


        const response =
          await getRecruiterCandidateById(
            candidateId
          );


        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
              "Unable to load candidate intelligence."
          );

        }


        setSelectedCandidate(
          response.candidate
        );

      } catch (
        requestError
      ) {

        console.error(
          "Recruiter candidate details error:",
          requestError
        );


        setDetailError(
          requestError?.response
            ?.data?.message ||
          requestError?.message ||
          "Unable to load candidate details."
        );

      } finally {

        setLoadingCandidateId(
          null
        );

      }

    };


  /* =======================================================
     FILTERED CANDIDATES
     ======================================================= */

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();


  const filteredCandidates =
    candidates.filter(
      (
        candidate
      ) => {

        const searchableText =
          [
            candidate?.fullname,
            candidate?.email,
            candidate?.phoneNumber,
            ...(Array.isArray(
              candidate?.claimedSkills
            )
              ? candidate.claimedSkills
              : []),
            ...(Array.isArray(
              candidate?.verifiedSkills
            )
              ? candidate.verifiedSkills
              : []),
            ...(Array.isArray(
              candidate?.unverifiedClaimedSkills
            )
              ? candidate.unverifiedClaimedSkills
              : []),
            ...(Array.isArray(
              candidate?.applications
            )
              ? candidate.applications.flatMap(
                  (
                    application
                  ) => [
                    application?.job?.title,
                    application?.job?.location,
                    application?.status,
                  ]
                )
              : []),
          ]
            .filter(
              Boolean
            )
            .join(" ")
            .toLowerCase();


        const matchesSearch =
          !normalizedSearch ||
          searchableText.includes(
            normalizedSearch
          );


        const strongestMatch =
          Number(
            candidate?.strongestMatch ||
            0
          );


        const matchesMatchFilter =
          matchFilter ===
            "all" ||
          (
            matchFilter ===
              "strong" &&
            strongestMatch >=
              80
          ) ||
          (
            matchFilter ===
              "good" &&
            strongestMatch >=
              60 &&
            strongestMatch <
              80
          ) ||
          (
            matchFilter ===
              "low" &&
            strongestMatch <
              60
          );


        const verifiedCount =
          Array.isArray(
            candidate?.verifiedSkills
          )
            ? candidate.verifiedSkills.length
            : 0;


        const matchesVerification =
          verificationFilter ===
            "all" ||
          (
            verificationFilter ===
              "verified" &&
            verifiedCount >
              0
          ) ||
          (
            verificationFilter ===
              "unverified" &&
            verifiedCount ===
              0
          );


        return (
          matchesSearch &&
          matchesMatchFilter &&
          matchesVerification
        );

      }
    );


  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  const clearFilters =
    () => {

      setSearchTerm("");

      setMatchFilter(
        "all"
      );

      setVerificationFilter(
        "all"
      );

    };


  /* =======================================================
     LOADING
     ======================================================= */

  if (
    loading
  ) {

    return (
      <section
        className="recruiter-candidates-page"
      >

        <div
          className="recruiter-candidates-loading"
          role="status"
          aria-live="polite"
        >

          <RefreshCw
            size={30}
            className="recruiter-candidates-spin"
          />


          <h1>
            Loading candidate intelligence
          </h1>


          <p>
            We're preparing the recruiter candidate workspace.
          </p>

        </div>

      </section>
    );

  }


  return (
    <section
      className="recruiter-candidates-page"
    >

      {/* ===================================================
          HEADER
          =================================================== */}

      <header
        className="recruiter-candidates-header"
      >

        <div>

          <span className="recruiter-candidates-eyebrow">
            CANDIDATE INTELLIGENCE
          </span>


          <h1>
            Find the people behind the applications.
          </h1>


          <p>
            Search candidates, compare verified skills,
            inspect match signals and review their application
            history from one recruiter workspace.
          </p>

        </div>


        <button
          type="button"
          className="recruiter-candidates-refresh"
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
                ? "recruiter-candidates-spin"
                : ""
            }
          />


          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </header>


      {/* ===================================================
          ALERT
          =================================================== */}

      {error && (

        <div
          className="recruiter-candidates-alert"
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
          SUMMARY
          =================================================== */}

      <section
        className="recruiter-candidates-summary"
      >

        <div
          className="recruiter-candidates-summary-card primary"
        >

          <div>

            <span>
              CANDIDATES
            </span>


            <strong>
              {summary.total ??
                candidates.length}
            </strong>


            <small>
              in your applicant pool
            </small>

          </div>


          <User
            size={19}
          />

        </div>


        <div
          className="recruiter-candidates-summary-card"
        >

          <div>

            <span>
              VERIFIED
            </span>


            <strong>
              {summary.verifiedCandidates ??
                0}
            </strong>


            <small>
              candidates with approved evidence
            </small>

          </div>


          <ShieldCheck
            size={19}
          />

        </div>


        <div
          className="recruiter-candidates-summary-card"
        >

          <div>

            <span>
              STRONG MATCHES
            </span>


            <strong>
              {summary.strongMatches ??
                0}
            </strong>


            <small>
              strongest match at 80%+
            </small>

          </div>


          <Sparkles
            size={19}
          />

        </div>


        <div
          className="recruiter-candidates-summary-card"
        >

          <div>

            <span>
              AVG MATCH
            </span>


            <strong>
              {summary.averageMatchRate ??
                0}
              %
            </strong>


            <small>
              across recruiter applications
            </small>

          </div>


          <CheckCircle2
            size={19}
          />

        </div>

      </section>


      {/* ===================================================
          TOOLBAR
          =================================================== */}

      <section
        className="recruiter-candidates-toolbar"
      >

        <div
          className="recruiter-candidates-search"
        >

          <Search
            size={16}
          />


          <input
            type="search"
            placeholder="Search candidate, skill, role or email"
            aria-label="Search candidates"
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
          />

        </div>


        <div
          className="recruiter-candidates-filter-row"
        >

          <select
            value={
              selectedJobId
            }
            onChange={(
              event
            ) =>
              setSelectedJobId(
                event.target.value
              )
            }
            aria-label="Filter candidates by job"
          >

            <option
              value=""
            >
              All recruiter jobs
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
              matchFilter
            }
            onChange={(
              event
            ) =>
              setMatchFilter(
                event.target.value
              )
            }
            aria-label="Filter candidates by match strength"
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


          <select
            value={
              verificationFilter
            }
            onChange={(
              event
            ) =>
              setVerificationFilter(
                event.target.value
              )
            }
            aria-label="Filter candidates by skill verification"
          >

            <option
              value="all"
            >
              All verification levels
            </option>


            <option
              value="verified"
            >
              Verified skills
            </option>


            <option
              value="unverified"
            >
              No verified skills
            </option>

          </select>


          {(
            searchTerm ||
            matchFilter !==
              "all" ||
            verificationFilter !==
              "all"
          ) && (

            <button
              type="button"
              className="recruiter-candidates-clear"
              onClick={
                clearFilters
              }
            >
              Clear
            </button>

          )}

        </div>

      </section>


      {/* ===================================================
          RESULT HEADER
          =================================================== */}

      <div
        className="recruiter-candidates-results-header"
      >

        <div>

          <span className="recruiter-candidates-eyebrow">
            APPLICANT POOL
          </span>


          <h2>
            Candidates
          </h2>


          <p>
            Showing{" "}
            {filteredCandidates.length}{" "}
            of{" "}
            {candidates.length}{" "}
            candidates.
          </p>

        </div>

      </div>


      {/* ===================================================
          EMPTY
          =================================================== */}

      {filteredCandidates.length ===
      0 ? (

        <div
          className="recruiter-candidates-empty"
        >

          <div
            className="recruiter-candidates-empty-icon"
          >

            <User
              size={25}
            />

          </div>


          <span className="recruiter-candidates-eyebrow">
            NO CANDIDATE MATCHES
          </span>


          <h3>
            There are no candidates in this view.
          </h3>


          <p>
            {candidates.length ===
            0
              ? "Candidates will appear here once they apply to jobs owned by your recruiter account."
              : "Try changing your search or clearing the current filters."}
          </p>


          {candidates.length >
            0 && (

            <button
              type="button"
              className="recruiter-candidates-primary-button"
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>

          )}

        </div>

      ) : (

        /* =================================================
           CANDIDATE GRID
           ================================================= */

        <section
          className="recruiter-candidates-grid"
        >

          {filteredCandidates.map(
            (
              candidate
            ) => {

              const verifiedSkills =
                Array.isArray(
                  candidate?.verifiedSkills
                )
                  ? candidate.verifiedSkills
                  : [];


              const claimedSkills =
                Array.isArray(
                  candidate?.claimedSkills
                )
                  ? candidate.claimedSkills
                  : [];


              const applications =
                Array.isArray(
                  candidate?.applications
                )
                  ? candidate.applications
                  : [];


              const strongestMatch =
                Number(
                  candidate?.strongestMatch ||
                  0
                );


              const matchTone =
                getMatchTone(
                  strongestMatch
                );


              const latestApplication =
                getLatestApplication(
                  applications
                );


              const isOpening =
                loadingCandidateId ===
                candidate?.candidateId;


              return (
                <article
                  className="recruiter-candidate-card"
                  key={
                    candidate?.candidateId
                  }
                >

                  {/* =========================================
                      CARD HEADER
                  ========================================== */}

                  <div
                    className="recruiter-candidate-card-header"
                  >

                    <div
                      className="recruiter-candidate-identity"
                    >

                      {candidate?.profile?.profilePhoto ? (

                        <img
                          src={
                            candidate.profile.profilePhoto
                          }
                          alt={
                            candidate?.fullname ||
                            "Candidate"
                          }
                          className="recruiter-candidate-avatar"
                        />

                      ) : (

                        <div
                          className="recruiter-candidate-avatar-fallback"
                        >

                          {getInitials(
                            candidate?.fullname
                          )}

                        </div>

                      )}


                      <div>

                        <h3>
                          {candidate?.fullname ||
                            "Candidate"}
                        </h3>


                        <span>
                          Joined{" "}
                          {formatDate(
                            candidate?.createdAt
                          )}
                        </span>

                      </div>

                    </div>


                    {candidate?.isStrongMatch ? (

                      <span
                        className="recruiter-candidate-strong-badge"
                      >

                        <Sparkles
                          size={12}
                        />

                        Strong match

                      </span>

                    ) : (

                      <span
                        className="recruiter-candidate-match-badge"
                      >

                        {strongestMatch}%

                      </span>

                    )}

                  </div>


                  {/* =========================================
                      MATCH BLOCK
                  ========================================== */}

                  <div
                    className={`recruiter-candidate-match recruiter-candidate-match-${matchTone}`}
                  >

                    <div
                      className="recruiter-candidate-match-copy"
                    >

                      <span>
                        STRONGEST JOB MATCH
                      </span>


                      <strong>
                        {strongestMatch}%
                      </strong>

                    </div>


                    <div
                      className="recruiter-candidate-match-bar"
                    >

                      <span
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              strongestMatch
                            )
                          )}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* =========================================
                      CONTACT
                  ========================================== */}

                  <div
                    className="recruiter-candidate-contact"
                  >

                    <div>

                      <Mail
                        size={13}
                      />


                      <span>
                        {candidate?.email ||
                          "Email unavailable"}
                      </span>

                    </div>


                    <div>

                      <Phone
                        size={13}
                      />


                      <span>
                        {candidate?.phoneNumber ||
                          "Phone unavailable"}
                      </span>

                    </div>

                  </div>


                  {/* =========================================
                      SKILLS
                  ========================================== */}

                  <div
                    className="recruiter-candidate-skills"
                  >

                    <div
                      className="recruiter-candidate-skill-heading"
                    >

                      <span>
                        SKILLS
                      </span>


                      <span>
                        {verifiedSkills.length} verified
                      </span>

                    </div>


                    <div
                      className="recruiter-candidate-skill-tags"
                    >

                      {verifiedSkills
                        .slice(
                          0,
                          4
                        )
                        .map(
                          (
                            skill
                          ) => (

                            <span
                              key={`verified-${skill}`}
                              className="verified"
                            >

                              <BadgeCheck
                                size={10}
                              />

                              {skill}

                            </span>

                          )
                        )}


                      {claimedSkills
                        .filter(
                          (
                            skill
                          ) =>
                            !verifiedSkills
                              .map(
                                (
                                  item
                                ) =>
                                  String(
                                    item
                                  ).toLowerCase()
                              )
                              .includes(
                                String(
                                  skill
                                ).toLowerCase()
                              )
                        )
                        .slice(
                          0,
                          Math.max(
                            0,
                            4 -
                              verifiedSkills.length
                          )
                        )
                        .map(
                          (
                            skill
                          ) => (

                            <span
                              key={`claimed-${skill}`}
                            >
                              {skill}
                            </span>

                          )
                        )}


                      {claimedSkills.length ===
                        0 && (
                        <span className="empty-skill">
                          No skills listed
                        </span>
                      )}

                    </div>

                  </div>


                  {/* =========================================
                      APPLICATION
                  ========================================== */}

                  <div
                    className="recruiter-candidate-application"
                  >

                    <div>

                      <span>
                        LATEST APPLICATION
                      </span>


                      <strong>
                        {latestApplication?.job?.title ||
                          "No application title"}
                      </strong>

                    </div>


                    {latestApplication?.status && (

                      <span
                        className={`recruiter-candidate-status ${latestApplication.status}`}
                      >

                        <Clock3
                          size={10}
                        />

                        {formatStatus(
                          latestApplication.status
                        )}

                      </span>

                    )}

                  </div>


                  {/* =========================================
                      FOOTER
                  ========================================== */}

                  <div
                    className="recruiter-candidate-card-footer"
                  >

                    <div
                      className="recruiter-candidate-evidence-summary"
                    >

                      <span>

                        <FileCheck2
                          size={11}
                        />

                        {candidate?.proofSummary?.approved ??
                          0}{" "}
                        approved proofs

                      </span>

                    </div>


                    <button
                      type="button"
                      className="recruiter-candidate-view-button"
                      onClick={() =>
                        handleOpenCandidate(
                          candidate?.candidateId
                        )
                      }
                      disabled={
                        isOpening
                      }
                    >

                      {isOpening ? (

                        <>
                          <RefreshCw
                            size={12}
                            className="recruiter-candidates-spin"
                          />

                          Loading

                        </>

                      ) : (

                        <>
                          View profile

                          <ArrowRight
                            size={12}
                          />
                        </>

                      )}

                    </button>

                  </div>

                </article>
              );

            }
          )}

        </section>

      )}


      {/* ===================================================
          CANDIDATE DETAIL DRAWER
          =================================================== */}

      {selectedCandidate && (

        <div
          className="recruiter-candidate-detail-overlay"
          role="presentation"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              setSelectedCandidate(
                null
              );

            }

          }}
        >

          <aside
            className="recruiter-candidate-detail-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Candidate profile"
          >

            <div
              className="recruiter-candidate-detail-header"
            >

              <div>

                <span className="recruiter-candidates-eyebrow">
                  CANDIDATE PROFILE
                </span>


                <h2>
                  {selectedCandidate?.fullname ||
                    "Candidate"}
                </h2>

              </div>


              <button
                type="button"
                className="recruiter-candidate-detail-close"
                onClick={() =>
                  setSelectedCandidate(
                    null
                  )
                }
                aria-label="Close candidate profile"
              >

                <X
                  size={16}
                />

              </button>

            </div>


            {detailError && (

              <div
                className="recruiter-candidates-alert"
                role="alert"
              >

                <XCircle
                  size={15}
                />


                <span>
                  {detailError}
                </span>

              </div>

            )}


            {/* =========================================
                PROFILE HERO
            ========================================== */}

            <section
              className="recruiter-candidate-detail-profile"
            >

              {selectedCandidate?.profile?.profilePhoto ? (

                <img
                  src={
                    selectedCandidate.profile.profilePhoto
                  }
                  alt={
                    selectedCandidate.fullname
                  }
                  className="recruiter-candidate-detail-avatar"
                />

              ) : (

                <div
                  className="recruiter-candidate-detail-avatar-fallback"
                >

                  {getInitials(
                    selectedCandidate?.fullname
                  )}

                </div>

              )}


              <div>

                <h3>
                  {selectedCandidate?.fullname ||
                    "Candidate"}
                </h3>


                <p>
                  {selectedCandidate?.email ||
                    "Email unavailable"}
                </p>


                {selectedCandidate?.profile?.bio && (

                  <span>
                    {selectedCandidate.profile.bio}
                  </span>

                )}

              </div>

            </section>


            {/* =========================================
                MATCH
            ========================================== */}

            <section
              className="recruiter-candidate-detail-card highlight"
            >

              <div
                className="recruiter-candidate-detail-card-heading"
              >

                <Sparkles
                  size={16}
                />


                <div>

                  <span>
                    MATCH INTELLIGENCE
                  </span>


                  <h3>
                    Candidate alignment
                  </h3>

                </div>

              </div>


              <div
                className="recruiter-candidate-detail-match-grid"
              >

                <div>

                  <strong>
                    {selectedCandidate?.averageMatchRate ??
                      0}%
                  </strong>


                  <span>
                    Average match
                  </span>

                </div>


                <div>

                  <strong>
                    {selectedCandidate?.strongestMatch ??
                      0}%
                  </strong>


                  <span>
                    Strongest match
                  </span>

                </div>


                <div>

                  <strong>
                    {selectedCandidate?.applications?.length ??
                      0}
                  </strong>


                  <span>
                    Applications
                  </span>

                </div>

              </div>

            </section>


            {/* =========================================
                CONTACT
            ========================================== */}

            <section
              className="recruiter-candidate-detail-card"
            >

              <div
                className="recruiter-candidate-detail-card-heading"
              >

                <User
                  size={15}
                />


                <div>

                  <span>
                    CONTACT
                  </span>


                  <h3>
                    Candidate details
                  </h3>

                </div>

              </div>


              <div
                className="recruiter-candidate-detail-contact"
              >

                <div>

                  <Mail
                    size={13}
                  />


                  <span>
                    {selectedCandidate?.email ||
                      "Not available"}
                  </span>

                </div>


                <div>

                  <Phone
                    size={13}
                  />


                  <span>
                    {selectedCandidate?.phoneNumber ||
                      "Not available"}
                  </span>

                </div>


                <div>

                  <FileText
                    size={13}
                  />


                  {selectedCandidate?.profile?.resume ? (

                    <a
                      href={
                        selectedCandidate.profile.resume
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedCandidate.profile.resumeOriginalName ||
                        "View resume"}
                    </a>

                  ) : (

                    <span>
                      Resume not uploaded
                    </span>

                  )}

                </div>

              </div>

            </section>


            {/* =========================================
                SKILLS
            ========================================== */}

            <section
              className="recruiter-candidate-detail-card"
            >

              <div
                className="recruiter-candidate-detail-card-heading"
              >

                <Award
                  size={15}
                />


                <div>

                  <span>
                    SKILLS
                  </span>


                  <h3>
                    Verified versus claimed
                  </h3>

                </div>

              </div>


              <div
                className="recruiter-candidate-detail-skill-section"
              >

                <span>
                  VERIFIED SKILLS
                </span>


                <div
                  className="recruiter-candidate-detail-tags"
                >

                  {(
                    selectedCandidate?.verifiedSkills ||
                    []
                  ).length >
                  0 ? (

                    selectedCandidate.verifiedSkills.map(
                      (
                        skill
                      ) => (

                        <span
                          key={`verified-detail-${skill}`}
                          className="verified"
                        >

                          <BadgeCheck
                            size={11}
                          />

                          {skill}

                        </span>

                      )
                    )

                  ) : (

                    <small>
                      No approved skill evidence yet.
                    </small>

                  )}

                </div>

              </div>


              <div
                className="recruiter-candidate-detail-skill-section"
              >

                <span>
                  UNVERIFIED CLAIMS
                </span>


                <div
                  className="recruiter-candidate-detail-tags"
                >

                  {(
                    selectedCandidate?.unverifiedClaimedSkills ||
                    []
                  ).length >
                  0 ? (

                    selectedCandidate.unverifiedClaimedSkills.map(
                      (
                        skill
                      ) => (

                        <span
                          key={`unverified-detail-${skill}`}
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <small>
                      No unverified claimed skills.
                    </small>

                  )}

                </div>

              </div>

            </section>


            {/* =========================================
                PROOF SUMMARY
            ========================================== */}

            <section
              className="recruiter-candidate-detail-card"
            >

              <div
                className="recruiter-candidate-detail-card-heading"
              >

                <FileCheck2
                  size={15}
                />


                <div>

                  <span>
                    EVIDENCE
                  </span>


                  <h3>
                    Skill proof activity
                  </h3>

                </div>

              </div>


              <div
                className="recruiter-candidate-proof-grid"
              >

                <div>

                  <strong>
                    {selectedCandidate?.proofSummary?.total ??
                      0}
                  </strong>


                  <span>
                    Total
                  </span>

                </div>


                <div>

                  <strong>
                    {selectedCandidate?.proofSummary?.approved ??
                      0}
                  </strong>


                  <span>
                    Approved
                  </span>

                </div>


                <div>

                  <strong>
                    {selectedCandidate?.proofSummary?.pending ??
                      0}
                  </strong>


                  <span>
                    Pending
                  </span>

                </div>


                <div>

                  <strong>
                    {selectedCandidate?.proofSummary?.rejected ??
                      0}
                  </strong>


                  <span>
                    Rejected
                  </span>

                </div>

              </div>

            </section>


            {/* =========================================
                APPLICATIONS
            ========================================== */}

            <section
              className="recruiter-candidate-detail-card"
            >

              <div
                className="recruiter-candidate-detail-card-heading"
              >

                <BriefcaseBusiness
                  size={15}
                />


                <div>

                  <span>
                    APPLICATION HISTORY
                  </span>


                  <h3>
                    Recruiter applications
                  </h3>

                </div>

              </div>


              <div
                className="recruiter-candidate-detail-applications"
              >

                {(
                  selectedCandidate?.applications ||
                  []
                ).length ===
                0 ? (

                  <p>
                    No applications found.
                  </p>

                ) : (

                  selectedCandidate.applications.map(
                    (
                      application
                    ) => (

                      <div
                        className="recruiter-candidate-detail-application"
                        key={
                          application?.applicationId
                        }
                      >

                        <div>

                          <strong>
                            {application?.job?.title ||
                              "Untitled role"}
                          </strong>


                          <span>
                            {application?.job?.company?.name ||
                              "Company"}

                            {" · "}

                            {formatDate(
                              application?.appliedAt
                            )}

                          </span>

                        </div>


                        <div
                          className="recruiter-candidate-detail-application-right"
                        >

                          <span
                            className={`recruiter-candidate-status ${
                              application?.status ||
                              "unknown"
                            }`}
                          >
                            {formatStatus(
                              application?.status
                            )}
                          </span>


                          <strong>
                            {application?.match?.score ??
                              0}%
                          </strong>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </section>


            {/* =========================================
                INTENT + JOB ACTION
            ========================================== */}

            {selectedCandidate?.applications?.[0]
              ?.intentResponse && (

              <section
                className="recruiter-candidate-detail-card"
              >

                <div
                  className="recruiter-candidate-detail-card-heading"
                >

                  <FileText
                    size={15}
                  />


                  <div>

                    <span>
                      CANDIDATE INTENT
                    </span>


                    <h3>
                      Latest application response
                    </h3>

                  </div>

                </div>


                <p
                  className="recruiter-candidate-intent"
                >
                  {selectedCandidate.applications[0]
                    .intentResponse}
                </p>

              </section>

            )}


           <div
  className="recruiter-candidate-detail-footer"
>
  <Link
    to="/recruiter/jobs"
    className="recruiter-candidate-detail-jobs-link"
  >
    <BriefcaseBusiness
      size={13}
    />

    Back to jobs

    <ArrowRight
      size={12}
    />
  </Link>
</div>

          </aside>

        </div>

      )}

    </section>
  );
};


export default RecruiterCandidates;