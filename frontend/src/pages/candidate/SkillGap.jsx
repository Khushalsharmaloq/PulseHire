import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
  GraduationCap,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getSkillGap,
} from "../../services/skills.api";


/* =========================================================
   HELPERS
   ========================================================= */

const clampPercentage = (
  value
) => {

  const number =
    Number(value);


  if (
    Number.isNaN(number)
  ) {
    return 0;
  }


  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number)
    )
  );

};


const normalizeSkill = (
  value
) =>
  String(
    value || ""
  )
    .trim()
    .toLowerCase();


const uniqueStrings = (
  values
) => {

  if (
    !Array.isArray(values)
  ) {
    return [];
  }


  const seen =
    new Set();


  return values.filter(
    (value) => {

      const text =
        String(
          value || ""
        ).trim();


      if (!text) {
        return false;
      }


      const normalized =
        normalizeSkill(
          text
        );


      if (
        seen.has(
          normalized
        )
      ) {
        return false;
      }


      seen.add(
        normalized
      );


      return true;

    }
  );

};


const formatPriority = (
  priority
) => {

  const normalized =
    String(
      priority || "low"
    ).toLowerCase();


  return normalized
    .charAt(0)
    .toUpperCase() +
    normalized.slice(1);

};


const getPriorityClass = (
  priority
) => {

  const normalized =
    String(
      priority || "low"
    ).toLowerCase();


  if (
    normalized === "high"
  ) {
    return "high";
  }


  if (
    normalized === "medium"
  ) {
    return "medium";
  }


  return "low";

};


const formatJobType = (
  jobType
) => {

  if (!jobType) {
    return "Role";
  }


  return String(
    jobType
  )
    .split("-")
    .map(
      (part) =>
        part.charAt(0)
          .toUpperCase() +
        part.slice(1)
    )
    .join(" ");

};


const getRoleInitial = (
  companyName
) => {

  const text =
    String(
      companyName ||
        "Company"
    ).trim();


  return (
    text.charAt(0)
      .toUpperCase() ||
    "C"
  );

};


/* =========================================================
   COMPONENT
   ========================================================= */

const SkillGap = () => {

  const [data, setData] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [expandedRole, setExpandedRole] =
    useState(null);


  const loadSkillGap =
    async () => {

      try {

        setError("");


        const response =
          await getSkillGap();


        if (!response?.success) {

          throw new Error(
            response?.message ||
              "Unable to load skill gap intelligence."
          );

        }


        setData(
          response
        );

      } catch (
        requestError
      ) {

        console.error(
          "Skill gap loading error:",
          requestError
        );


        setError(
          requestError?.response
            ?.data?.message ||
          requestError?.message ||
          "Unable to load skill gap intelligence."
        );

      } finally {

        setLoading(false);

      }

    };


  /* =========================================================
     LOAD ON MOUNT
     ========================================================= */

  useEffect(() => {

    let cancelled =
      false;


    const run =
      async () => {

        try {

          setLoading(true);
          setError("");


          const response =
            await getSkillGap();


          if (cancelled) {
            return;
          }


          if (!response?.success) {

            throw new Error(
              response?.message ||
                "Unable to load skill gap intelligence."
            );

          }


          setData(
            response
          );

        } catch (
          requestError
        ) {

          if (cancelled) {
            return;
          }


          console.error(
            "Skill gap loading error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to load skill gap intelligence."
          );

        } finally {

          if (!cancelled) {
            setLoading(false);
          }

        }

      };


    run();


    return () => {
      cancelled = true;
    };

  }, []);


  /* =========================================================
     DATA SAFETY
     ========================================================= */

  const readiness =
    clampPercentage(
      data?.readiness
    );


  const currentGap =
    clampPercentage(
      data?.currentGap
    );


  const potential =
    clampPercentage(
      data?.potential
    );


  const verifiedCoverage =
    clampPercentage(
      data?.verifiedCoverage
    );


  const claimedSkills =
    uniqueStrings(
      data?.claimedSkills
    );


  const verifiedSkills =
    uniqueStrings(
      data?.verifiedSkills
    );


  const unverifiedClaimedSkills =
    uniqueStrings(
      data?.unverifiedClaimedSkills
    );


  const priorityGaps =
    Array.isArray(
      data?.priorityGaps
    )
      ? data.priorityGaps
      : [];


  const learningRecommendations =
    Array.isArray(
      data?.learningRecommendations
    )
      ? data.learningRecommendations
      : [];


  const roleAnalysis =
    Array.isArray(
      data?.roleAnalysis
    )
      ? data.roleAnalysis
      : [];


  const rolesAnalysed =
    Number(
      data?.rolesAnalysed ||
        roleAnalysis.length ||
        0
    );


  const topPriorityGaps =
    priorityGaps.slice(
      0,
      6
    );


  const topLearning =
    learningRecommendations.slice(
      0,
      4
    );


  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {

    return (
      <section
        className="skill-gap-page"
      >

        <div
          className="skill-gap-loading"
          role="status"
          aria-live="polite"
        >

          <LoaderCircle
            size={32}
          />


          <h1>
            Analysing your skill gap
          </h1>


          <p>
            We're comparing your verified capabilities
            against active PulseHire opportunities.
          </p>

        </div>

      </section>
    );

  }


  /* =========================================================
     ERROR
     ========================================================= */

  if (
    error &&
    !data
  ) {

    return (
      <section
        className="skill-gap-page"
      >

        <div
          className="skill-gap-error-state"
          role="alert"
        >

          <div
            className="skill-gap-error-icon"
          >

            <CircleAlert
              size={22}
            />

          </div>


          <span className="candidate-section-eyebrow">
            SKILL GAP INTELLIGENCE
          </span>


          <h1>
            We couldn't load your analysis.
          </h1>


          <p>
            {error}
          </p>


          <button
            type="button"
            className="skill-gap-primary-button"
            onClick={() => {

              setLoading(true);
              setError("");

              loadSkillGap();

            }}
          >

            Try again

            <ArrowRight
              size={14}
            />

          </button>

        </div>

      </section>
    );

  }


  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <section
      className="skill-gap-page"
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className="skill-gap-header"
      >

        <div>

          <span className="candidate-section-eyebrow">
            SKILL GAP INTELLIGENCE
          </span>


          <h1>
            Know what stands between you and your next role.
          </h1>


          <p>
            PulseHire compares your recruiter-verified
            capabilities against active opportunities and
            shows you exactly where to focus.
          </p>

        </div>


        <Link
          to="/candidate/learning"
          className="skill-gap-header-action"
        >

          <BookOpen
            size={16}
          />

          Explore learning

          <ArrowRight
            size={14}
          />

        </Link>

      </header>


      {/* =====================================================
          WARNING
          ===================================================== */}

      {error && (
        <div
          className="skill-gap-inline-error"
          role="alert"
        >

          <CircleAlert
            size={16}
          />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =====================================================
          NO ACTIVE ROLES
          ===================================================== */}

      {rolesAnalysed ===
        0 && (

        <section
          className="skill-gap-no-roles"
        >

          <div
            className="skill-gap-no-roles-icon"
          >

            <BriefcaseBusiness
              size={23}
            />

          </div>


          <div>

            <span className="candidate-card-eyebrow">
              ROLE ANALYSIS
            </span>


            <h2>
              There are no active roles to analyse yet.
            </h2>


            <p>
              Your claimed and verified skills are still
              available, but readiness analysis becomes
              meaningful when active opportunities are present.
            </p>

          </div>


          <Link
            to="/candidate/jobs"
            className="skill-gap-secondary-button"
          >

            Browse jobs

            <ArrowRight
              size={13}
            />

          </Link>

        </section>

      )}


      {/* =====================================================
          READINESS HERO
          ===================================================== */}

      <section
        className="skill-gap-readiness-card"
      >

        <div
          className="skill-gap-readiness-copy"
        >

          <div
            className="skill-gap-readiness-icon"
          >

            <TrendingUp
              size={24}
            />

          </div>


          <div>

            <span className="candidate-card-eyebrow">
              OVERALL READINESS
            </span>


            <h2>
              {readiness >= 80
                ? "You're strongly aligned with the roles being analysed."
                : readiness >= 60
                ? "You're making strong progress toward role readiness."
                : readiness >= 40
                ? "You have a foundation, but some gaps still matter."
                : "There are meaningful skill gaps to work through."}
            </h2>


            <p>
              Your readiness score is based on
              recruiter-approved evidence, not simply
              the skills listed on your profile.
            </p>


            <div
              className="skill-gap-readiness-bar-row"
            >

              <div
                className="skill-gap-readiness-bar"
                aria-label={
                  `Readiness ${readiness}%`
                }
              >

                <div
                  className="skill-gap-readiness-fill"
                  style={{
                    width:
                      `${readiness}%`,
                  }}
                />

              </div>


              <strong>
                {readiness}%
              </strong>

            </div>

          </div>

        </div>


        <div
          className="skill-gap-readiness-stats"
        >

          <div>

            <span>
              CURRENT GAP
            </span>


            <strong>
              {currentGap}%
            </strong>


            <small>
              capability still missing
            </small>

          </div>


          <div>

            <span>
              POTENTIAL
            </span>


            <strong>
              {potential}%
            </strong>


            <small>
              improvement opportunity
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          KEY METRICS
          ===================================================== */}

      <section
        className="skill-gap-metrics"
      >

        <div
          className="skill-gap-metric"
        >

          <div
            className="skill-gap-metric-icon"
          >

            <BadgeCheck
              size={19}
            />

          </div>


          <div>

            <span>
              VERIFIED SKILLS
            </span>


            <strong>
              {verifiedSkills.length}
            </strong>


            <small>
              recruiter-approved capabilities
            </small>

          </div>

        </div>


        <div
          className="skill-gap-metric"
        >

          <div
            className="skill-gap-metric-icon"
          >

            <Target
              size={19}
            />

          </div>


          <div>

            <span>
              PRIORITY GAPS
            </span>


            <strong>
              {priorityGaps.length}
            </strong>


            <small>
              skills affecting role readiness
            </small>

          </div>

        </div>


        <div
          className="skill-gap-metric"
        >

          <div
            className="skill-gap-metric-icon"
          >

            <BriefcaseBusiness
              size={19}
            />

          </div>


          <div>

            <span>
              ROLES ANALYSED
            </span>


            <strong>
              {rolesAnalysed}
            </strong>


            <small>
              active opportunities
            </small>

          </div>

        </div>


        <div
          className="skill-gap-metric"
        >

          <div
            className="skill-gap-metric-icon"
          >

            <ShieldCheck
              size={19}
            />

          </div>


          <div>

            <span>
              EVIDENCE COVERAGE
            </span>


            <strong>
              {verifiedCoverage}%
            </strong>


            <small>
              claimed skills verified
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN GRID
          ===================================================== */}

      <div
        className="skill-gap-main-grid"
      >


        {/* ===================================================
            PRIORITY GAPS
            =================================================== */}

        <section
          className="skill-gap-panel"
        >

          <div
            className="skill-gap-panel-heading"
          >

            <div>

              <span className="candidate-card-eyebrow">
                PRIORITY GAPS
              </span>


              <h2>
                Focus where it matters most.
              </h2>


              <p>
                These are the missing capabilities appearing
                most frequently across the roles PulseHire analysed.
              </p>

            </div>


            <Target
              size={20}
              className="skill-gap-panel-icon"
            />

          </div>


          {topPriorityGaps.length >
          0 ? (

            <div
              className="skill-gap-priority-list"
            >

              {topPriorityGaps.map(
                (gap) => {

                  const priorityClass =
                    getPriorityClass(
                      gap?.priority
                    );


                  return (
                    <div
                      className="skill-gap-priority-row"
                      key={
                        `${gap?.skill}-${gap?.roleCount}`
                      }
                    >

                      <div
                        className={`skill-gap-priority-icon ${
                          priorityClass
                        }`}
                      >

                        <Target
                          size={16}
                        />

                      </div>


                      <div
                        className="skill-gap-priority-content"
                      >

                        <div
                          className="skill-gap-priority-title"
                        >

                          <strong>
                            {gap?.skill ||
                              "Skill"}
                          </strong>


                          <span
                            className={`skill-gap-priority-badge ${
                              priorityClass
                            }`}
                          >
                            {formatPriority(
                              gap?.priority
                            )}
                          </span>

                        </div>


                        <p>
                          Missing across{" "}
                          <strong>
                            {gap?.roleCount ||
                              0}
                          </strong>{" "}
                          of{" "}
                          <strong>
                            {rolesAnalysed}
                          </strong>{" "}
                          analysed roles.
                        </p>

                      </div>


                      <div
                        className="skill-gap-priority-percentage"
                      >

                        <strong>
                          {clampPercentage(
                            gap?.rolePercentage
                          )}%
                        </strong>


                        <span>
                          role coverage
                        </span>

                      </div>

                    </div>
                  );

                }
              )}

            </div>

          ) : (

            <div
              className="skill-gap-empty"
            >

              <CheckCircle2
                size={22}
              />


              <div>

                <strong>
                  No priority gaps detected.
                </strong>


                <span>
                  Your verified skills currently cover
                  the gaps identified across analysed roles.
                </span>

              </div>

            </div>

          )}

        </section>


        {/* ===================================================
            CAPABILITY COVERAGE
            =================================================== */}

        <section
          className="skill-gap-panel"
        >

          <div
            className="skill-gap-panel-heading"
          >

            <div>

              <span className="candidate-card-eyebrow">
                CAPABILITY COVERAGE
              </span>


              <h2>
                What you claim versus what you can prove.
              </h2>


              <p>
                Recruiter-approved evidence is the stronger
                signal in PulseHire's intelligence layer.
              </p>

            </div>


            <ShieldCheck
              size={20}
              className="skill-gap-panel-icon"
            />

          </div>


          <div
            className="skill-gap-coverage-summary"
          >

            <div>

              <strong>
                {claimedSkills.length}
              </strong>

              <span>
                claimed skills
              </span>

            </div>


            <div>

              <strong>
                {verifiedSkills.length}
              </strong>

              <span>
                verified skills
              </span>

            </div>


            <div>

              <strong>
                {unverifiedClaimedSkills.length}
              </strong>

              <span>
                still need evidence
              </span>

            </div>

          </div>


          {claimedSkills.length >
          0 ? (

            <div
              className="skill-gap-capability-list"
            >

              {claimedSkills
                .slice(0, 10)
                .map(
                  (skill) => {

                    const verified =
                      verifiedSkills.some(
                        (verifiedSkill) =>
                          normalizeSkill(
                            verifiedSkill
                          ) ===
                          normalizeSkill(
                            skill
                          )
                      );


                    return (
                      <div
                        className={`skill-gap-capability-row ${
                          verified
                            ? "verified"
                            : "unverified"
                        }`}
                        key={skill}
                      >

                        <div>

                          {verified ? (
                            <BadgeCheck
                              size={15}
                            />
                          ) : (
                            <Clock3
                              size={15}
                            />
                          )}


                          <span>
                            {skill}
                          </span>

                        </div>


                        <span>

                          {verified
                            ? "Verified"
                            : "Needs evidence"}

                        </span>

                      </div>
                    );

                  }
                )}

            </div>

          ) : (

            <div
              className="skill-gap-empty"
            >

              <CircleAlert
                size={22}
              />


              <div>

                <strong>
                  No skills are listed yet.
                </strong>


                <span>
                  Add skills to your profile before
                  using skill-gap intelligence.
                </span>

              </div>

            </div>

          )}


          {claimedSkills.length >
            10 && (

            <Link
              to="/candidate/profile"
              className="skill-gap-panel-link"
            >

              View all profile skills

              <ArrowRight
                size={13}
              />

            </Link>

          )}

        </section>


        {/* ===================================================
            LEARNING
            =================================================== */}

        <section
          className="skill-gap-panel skill-gap-learning-panel"
        >

          <div
            className="skill-gap-panel-heading"
          >

            <div>

              <span className="candidate-card-eyebrow">
                RECOMMENDED NEXT STEPS
              </span>


              <h2>
                Close your highest-impact gaps.
              </h2>


              <p>
                Learning recommendations are generated
                from the priority gaps in your active role analysis.
              </p>

            </div>


            <GraduationCap
              size={20}
              className="skill-gap-panel-icon"
            />

          </div>


          {topLearning.length >
          0 ? (

            <div
              className="skill-gap-learning-list"
            >

              {topLearning.map(
                (recommendation) => {

                  const firstResource =
                    Array.isArray(
                      recommendation?.resources
                    )
                      ? recommendation.resources[0]
                      : null;


                  return (
                    <Link
                      to="/candidate/learning"
                      className="skill-gap-learning-row"
                      key={
                        recommendation?.skill
                      }
                    >

                      <div
                        className="skill-gap-learning-icon"
                      >

                        <BookOpen
                          size={17}
                        />

                      </div>


                      <div
                        className="skill-gap-learning-copy"
                      >

                        <div>

                          <strong>
                            {recommendation?.skill ||
                              "Skill"}
                          </strong>


                          <span
                            className={`skill-gap-priority-badge ${
                              getPriorityClass(
                                recommendation?.priority
                              )
                            }`}
                          >
                            {formatPriority(
                              recommendation?.priority
                            )}
                          </span>

                        </div>


                        <p>
                          {firstResource?.title ||
                            `Build stronger capability in ${recommendation?.skill}.`}
                        </p>


                        <small>
                          {recommendation?.roleCount ||
                            0}{" "}
                          roles ·{" "}
                          {clampPercentage(
                            recommendation?.rolePercentage
                          )}% coverage
                        </small>

                      </div>


                      <ArrowRight
                        size={15}
                        className="skill-gap-row-arrow"
                      />

                    </Link>
                  );

                }
              )}

            </div>

          ) : (

            <div
              className="skill-gap-empty"
            >

              <BookOpen
                size={22}
              />


              <div>

                <strong>
                  No learning recommendations yet.
                </strong>


                <span>
                  Recommendations appear when the
                  analysis identifies meaningful skill gaps.
                </span>

              </div>

            </div>

          )}


          <Link
            to="/candidate/learning"
            className="skill-gap-primary-link"
          >

            Open learning workspace

            <ArrowRight
              size={13}
            />

          </Link>

        </section>

      </div>


      {/* =====================================================
          ROLE ANALYSIS
          ===================================================== */}

      <section
        className="skill-gap-panel skill-gap-role-panel"
      >

        <div
          className="skill-gap-panel-heading"
        >

          <div>

            <span className="candidate-card-eyebrow">
              ROLE ANALYSIS
            </span>


            <h2>
              See exactly how you compare with active roles.
            </h2>


            <p>
              Each role below is analysed against your
              recruiter-verified skills.
            </p>

          </div>


          <span
            className="skill-gap-role-count"
          >

            {rolesAnalysed}

            {" "}

            {rolesAnalysed ===
            1
              ? "role"
              : "roles"}

          </span>

        </div>


        {roleAnalysis.length >
        0 ? (

          <div
            className="skill-gap-role-list"
          >

            {roleAnalysis.map(
              (role) => {

                const matchPercentage =
                  clampPercentage(
                    role?.matchPercentage
                  );


                const matchedSkills =
                  uniqueStrings(
                    role?.matchedSkills ||
                      role?.verifiedSkills
                  );


                const missingSkills =
                  uniqueStrings(
                    role?.skillGaps
                  );


                const companyName =
                  role?.company?.name ||
                  "Company";


                const roleKey =
                  role?.jobId ||
                  `${role?.title}-${companyName}`;


                const isExpanded =
                  expandedRole ===
                  roleKey;


                return (
                  <article
                    className={`skill-gap-role-card ${
                      isExpanded
                        ? "expanded"
                        : ""
                    }`}
                    key={
                      roleKey
                    }
                  >

                    <button
                      type="button"
                      className="skill-gap-role-summary"
                      onClick={() =>
                        setExpandedRole(
                          isExpanded
                            ? null
                            : roleKey
                        )
                      }
                      aria-expanded={
                        isExpanded
                      }
                    >

                      <div
                        className="skill-gap-company-avatar"
                      >

                        {role?.company?.logo ? (

                          <img
                            src={
                              role.company.logo
                            }
                            alt=""
                          />

                        ) : (

                          getRoleInitial(
                            companyName
                          )

                        )}

                      </div>


                      <div
                        className="skill-gap-role-main"
                      >

                        <div
                          className="skill-gap-role-title-line"
                        >

                          <h3>
                            {role?.title ||
                              "Untitled role"}
                          </h3>


                          <span>
                            {companyName}
                          </span>

                        </div>


                        <div
                          className="skill-gap-role-meta"
                        >

                          {role?.location && (
                            <span>

                              <MapPin
                                size={12}
                              />

                              {role.location}

                            </span>
                          )}


                          {role?.jobType && (
                            <span>

                              <BriefcaseBusiness
                                size={12}
                              />

                              {formatJobType(
                                role.jobType
                              )}

                            </span>
                          )}


                          <span>

                            <Target
                              size={12}
                            />

                            {role?.totalRequiredSkills ||
                              0}{" "}
                            required skills

                          </span>

                        </div>

                      </div>


                      <div
                        className="skill-gap-match"
                      >

                        <strong>
                          {matchPercentage}%
                        </strong>


                        <span>
                          match
                        </span>

                      </div>


                      <div
                        className="skill-gap-match-bar"
                      >

                        <div
                          style={{
                            width:
                              `${matchPercentage}%`,
                          }}
                        />

                      </div>


                      <div
                        className="skill-gap-expand-icon"
                      >

                        {isExpanded ? (
                          <ChevronUp
                            size={17}
                          />
                        ) : (
                          <ChevronDown
                            size={17}
                          />
                        )}

                      </div>

                    </button>


                    {isExpanded && (

                      <div
                        className="skill-gap-role-details"
                      >

                        <div
                          className="skill-gap-role-description"
                        >

                          <span>
                            ROLE SIGNAL
                          </span>


                          <p>
                            {role?.description ||
                              "This role is currently being analysed against your verified capabilities."}
                          </p>

                        </div>


                        <div
                          className="skill-gap-skill-columns"
                        >

                          <div>

                            <div
                              className="skill-gap-detail-heading"
                            >

                              <CheckCircle2
                                size={15}
                              />


                              <strong>
                                Verified matches
                              </strong>

                            </div>


                            {matchedSkills.length >
                            0 ? (

                              <div
                                className="skill-gap-detail-skills"
                              >

                                {matchedSkills.map(
                                  (skill) => (
                                    <span
                                      className="skill-gap-detail-skill matched"
                                      key={
                                        skill
                                      }
                                    >

                                      <BadgeCheck
                                        size={12}
                                      />

                                      {skill}

                                    </span>
                                  )
                                )}

                              </div>

                            ) : (

                              <p className="skill-gap-detail-empty">
                                No required skills are currently
                                supported by recruiter-approved evidence.
                              </p>

                            )}

                          </div>


                          <div>

                            <div
                              className="skill-gap-detail-heading gap"
                            >

                              <CircleAlert
                                size={15}
                              />


                              <strong>
                                Skill gaps
                              </strong>

                            </div>


                            {missingSkills.length >
                            0 ? (

                              <div
                                className="skill-gap-detail-skills"
                              >

                                {missingSkills.map(
                                  (skill) => (
                                    <span
                                      className="skill-gap-detail-skill missing"
                                      key={
                                        skill
                                      }
                                    >

                                      <Target
                                        size={12}
                                      />

                                      {skill}

                                    </span>
                                  )
                                )}

                              </div>

                            ) : (

                              <p className="skill-gap-detail-empty success">
                                No missing skills for this analysed role.
                              </p>

                            )}

                          </div>

                        </div>


                        <div
                          className="skill-gap-role-footer"
                        >

                          <span>

                            <ShieldCheck
                              size={12}
                            />

                            Based on verified evidence

                          </span>


                          <Link
                            to="/candidate/jobs"
                            className="skill-gap-role-link"
                          >

                            Explore opportunities

                            <ArrowRight
                              size={12}
                            />

                          </Link>

                        </div>

                      </div>

                    )}

                  </article>
                );

              }
            )}

          </div>

        ) : (

          <div
            className="skill-gap-role-empty"
          >

            <BriefcaseBusiness
              size={24}
            />


            <div>

              <strong>
                No role analysis available.
              </strong>


              <span>
                Active jobs with skill requirements
                will appear here when available.
              </span>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          PRINCIPLE
          ===================================================== */}

      <section
        className="skill-gap-principle"
      >

        <div
          className="skill-gap-principle-icon"
        >

          <ShieldCheck
            size={21}
          />

        </div>


        <div>

          <span className="candidate-card-eyebrow">
            HOW PULSEHIRE THINKS
          </span>


          <h2>
            Claims tell us what you say you can do.
            Evidence tells us what recruiters can trust.
          </h2>


          <p>
            Skill-gap intelligence therefore uses
            recruiter-approved evidence when measuring
            your role readiness. That's why improving
            your evidence coverage can be just as important
            as learning a new skill.
          </p>

        </div>

      </section>

    </section>
  );
};


export default SkillGap;