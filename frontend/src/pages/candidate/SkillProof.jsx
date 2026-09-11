import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import {
  createSkillProof,
  getMySkillProofs,
} from "../../services/skillProof.api";


/* =========================================================
   PROOF TYPES
   ========================================================= */

const proofTypeOptions = [
  {
    value: "project",
    label: "Project",
    description:
      "Show a project where you used this skill.",
  },

  {
    value: "github",
    label: "GitHub",
    description:
      "Share a repository or meaningful codebase.",
  },

  {
    value: "portfolio",
    label: "Portfolio",
    description:
      "Share a live portfolio or deployed work.",
  },

  {
    value: "certificate",
    label: "Certificate",
    description:
      "Share a relevant certification.",
  },

  {
    value: "other",
    label: "Other",
    description:
      "Provide another form of evidence.",
  },
];


/* =========================================================
   HELPERS
   ========================================================= */

const normalizeSkill = (
  value
) =>
  String(
    value || ""
  )
    .trim()
    .toLowerCase();


const formatStatusLabel = (
  status
) => {

  const labels = {
    pending: "Pending review",
    approved: "Verified",
    rejected: "Needs stronger evidence",
  };


  return (
    labels[
      String(
        status || ""
      ).toLowerCase()
    ] ||
    "Needs proof"
  );

};


const formatDate = (
  value
) => {

  if (!value) {
    return "Recently submitted";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Recently submitted";
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

};


const getProofIcon = (
  proofType
) => {

  const normalized =
    String(
      proofType || ""
    ).toLowerCase();


  if (
  normalized === "github"
) {
  return Code2;
}


  if (
    normalized === "portfolio"
  ) {
    return Globe2;
  }


  if (
    normalized === "certificate"
  ) {
    return FileText;
  }


  if (
    normalized === "project"
  ) {
    return Code2;
  }


  return FileCheck2;

};


/* =========================================================
   COMPONENT
   ========================================================= */

const SkillProof = () => {

  const {
    user,
  } = useAuth();


  /* =======================================================
     STATE
     ======================================================= */

  const [skillProofs, setSkillProofs] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [showForm, setShowForm] =
    useState(false);


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const [formData, setFormData] =
    useState({
      skill: "",
      proofType: "github",
      title: "",
      description: "",
      proofUrl: "",
    });


  /* =======================================================
     CANDIDATE SKILLS
     ======================================================= */

  const candidateSkills =
    Array.isArray(
      user?.profile?.skills
    )
      ? user.profile.skills
      : [];


  /* =======================================================
     LOAD SKILL PROOFS
     ======================================================= */

  useEffect(() => {

    let cancelled =
      false;


    const fetchSkillProofs =
      async () => {

        try {

          const data =
            await getMySkillProofs();


          if (cancelled) {
            return;
          }


          if (!data?.success) {

            throw new Error(
              data?.message ||
                "Unable to load your skill proof."
            );

          }


          setSkillProofs(
            Array.isArray(
              data.skillProofs
            )
              ? data.skillProofs
              : []
          );


          setError("");

        } catch (
          requestError
        ) {

          if (cancelled) {
            return;
          }


          console.error(
            "Load skill proofs error:",
            requestError
          );


          setError(
            requestError?.response
              ?.data?.message ||
            requestError?.message ||
            "Unable to load your skill proof."
          );

        } finally {

          if (!cancelled) {
            setLoading(false);
          }

        }

      };


    fetchSkillProofs();


    return () => {
      cancelled = true;
    };

  }, []);


  /* =======================================================
     DERIVED DATA
     ======================================================= */

  const approvedProofs =
    skillProofs.filter(
      (proof) =>
        proof?.status ===
        "approved"
    );


  const pendingProofs =
    skillProofs.filter(
      (proof) =>
        proof?.status ===
        "pending"
    );


  const rejectedProofs =
    skillProofs.filter(
      (proof) =>
        proof?.status ===
        "rejected"
    );


  const provenSkills =
    new Set(
      approvedProofs.map(
        (proof) =>
          normalizeSkill(
            proof?.skill
          )
      )
    );


  const pendingSkills =
    new Set(
      pendingProofs.map(
        (proof) =>
          normalizeSkill(
            proof?.skill
          )
      )
    );


  const rejectedSkills =
    new Set(
      rejectedProofs.map(
        (proof) =>
          normalizeSkill(
            proof?.skill
          )
      )
    );


  const skillsWithoutProof =
    candidateSkills.filter(
      (skill) => {

        const normalized =
          normalizeSkill(
            skill
          );


        return (
          !provenSkills.has(
            normalized
          ) &&
          !pendingSkills.has(
            normalized
          )
        );

      }
    );


  const verifiedCoverage =
    candidateSkills.length === 0
      ? 0
      : Math.round(
          (
            approvedProofs.filter(
              (proof) =>
                candidateSkills.some(
                  (skill) =>
                    normalizeSkill(
                      skill
                    ) ===
                    normalizeSkill(
                      proof?.skill
                    )
                )
            ).length /
            candidateSkills.length
          ) *
          100
        );


  /* =======================================================
     FORM HELPERS
     ======================================================= */

  const resetForm = (
    selectedSkill = ""
  ) => {

    setFormData({
      skill:
        selectedSkill ||
        candidateSkills[0] ||
        "",

      proofType:
        "github",

      title:
        "",

      description:
        "",

      proofUrl:
        "",
    });

  };


  const handleOpenForm = (
    selectedSkill = ""
  ) => {

    setError("");
    setSuccess("");

    resetForm(
      selectedSkill
    );

    setShowForm(
      true
    );

  };


  const handleCloseForm = () => {

    if (submitting) {
      return;
    }


    setShowForm(
      false
    );

    setError("");

    resetForm();

  };


  const handleInputChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]:
          value,
      })
    );


    setError("");
    setSuccess("");

  };


  /* =======================================================
     SUBMIT PROOF
     ======================================================= */

  const handleSubmitProof =
    async (
      event
    ) => {

      event.preventDefault();


      if (submitting) {
        return;
      }


      setError("");
      setSuccess("");


      const skill =
        formData.skill.trim();


      const title =
        formData.title.trim();


      const description =
        formData.description.trim();


      const proofUrl =
        formData.proofUrl.trim();


      if (
        candidateSkills.length === 0
      ) {

        setError(
          "Add at least one skill to your profile before submitting skill proof."
        );

        return;
      }


      if (!skill) {

        setError(
          "Please select a skill to prove."
        );

        return;
      }


      const skillExists =
        candidateSkills.some(
          (candidateSkill) =>
            normalizeSkill(
              candidateSkill
            ) ===
            normalizeSkill(
              skill
            )
        );


      if (!skillExists) {

        setError(
          "You can only submit proof for a skill currently listed on your profile."
        );

        return;
      }


      if (!title) {

        setError(
          "Please enter a title for your evidence."
        );

        return;
      }


      if (
        title.length > 120
      ) {

        setError(
          "The proof title cannot exceed 120 characters."
        );

        return;
      }


      if (
        description.length > 1000
      ) {

        setError(
          "The description cannot exceed 1000 characters."
        );

        return;
      }


      if (!proofUrl) {

        setError(
          "Please provide a URL to your evidence."
        );

        return;
      }


      let parsedUrl;


      try {

        parsedUrl =
          new URL(
            proofUrl
          );

      } catch {

        setError(
          "Please enter a valid evidence URL, including https://."
        );

        return;
      }


      if (
        ![
          "http:",
          "https:",
        ].includes(
          parsedUrl.protocol
        )
      ) {

        setError(
          "Evidence URLs must use HTTP or HTTPS."
        );

        return;
      }


      try {

        setSubmitting(
          true
        );


        const data =
          await createSkillProof({
            skill,
            proofType:
              formData.proofType,
            title,
            description,
            proofUrl,
          });


        if (!data?.success) {

          throw new Error(
            data?.message ||
              "Unable to submit your skill proof."
          );

        }


        if (
          data?.skillProof
        ) {

          setSkillProofs(
            (previousProofs) => [
              data.skillProof,
              ...previousProofs,
            ]
          );

        } else {

          /*
           * Fallback in case the backend
           * doesn't return the created document.
           */

          setLoading(true);

          const refreshed =
            await getMySkillProofs();


          if (
            refreshed?.success &&
            Array.isArray(
              refreshed.skillProofs
            )
          ) {

            setSkillProofs(
              refreshed.skillProofs
            );

          }

          setLoading(false);

        }


        setSuccess(
          "Skill proof submitted successfully. It is now waiting for recruiter review."
        );


        resetForm();


        setShowForm(
          false
        );

      } catch (
        requestError
      ) {

        console.error(
          "Submit skill proof error:",
          requestError
        );


        setError(
          requestError?.response
            ?.data?.message ||
          requestError?.message ||
          "Unable to submit your skill proof."
        );

      } finally {

        setSubmitting(
          false
        );

      }

    };


  /* =======================================================
     SKILL STATUS
     ======================================================= */

  const getSkillStatus =
    (skill) => {

      const normalized =
        normalizeSkill(
          skill
        );


      if (
        provenSkills.has(
          normalized
        )
      ) {
        return "approved";
      }


      if (
        pendingSkills.has(
          normalized
        )
      ) {
        return "pending";
      }


      if (
        rejectedSkills.has(
          normalized
        )
      ) {
        return "rejected";
      }


      return "missing";

    };


  const getSkillProof =
    (skill) => {

      const normalized =
        normalizeSkill(
          skill
        );


      return (
        skillProofs.find(
          (proof) =>
            normalizeSkill(
              proof?.skill
            ) ===
            normalized &&
            proof?.status ===
            "approved"
        ) ||
        skillProofs.find(
          (proof) =>
            normalizeSkill(
              proof?.skill
            ) ===
            normalized &&
            proof?.status ===
            "pending"
        ) ||
        skillProofs.find(
          (proof) =>
            normalizeSkill(
              proof?.skill
            ) ===
            normalized
        ) ||
        null
      );

    };


  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {

    return (
      <section
        className="skill-proof-page"
      >

        <div
          className="skill-proof-loading"
          role="status"
          aria-live="polite"
        >

          <LoaderCircle
            size={32}
          />


          <h1>
            Loading your evidence
          </h1>


          <p>
            We're gathering your submitted
            proofs and verification status.
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
      className="skill-proof-page"
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className="skill-proof-header"
      >

        <div>

          <span className="candidate-section-eyebrow">
            SKILL PROOF
          </span>


          <h1>
            Turn your skills into evidence.
          </h1>


          <p>
            Show recruiters where you have actually
            used the skills on your profile.
          </p>

        </div>


        <button
          type="button"
          className="skill-proof-primary-button"
          onClick={() =>
            handleOpenForm()
          }
          disabled={
            candidateSkills.length ===
            0
          }
        >

          <Plus
            size={16}
          />

          Add skill proof

        </button>

      </header>


      {/* =====================================================
          FEEDBACK
          ===================================================== */}

      {error && (
        <div
          className="skill-proof-message error"
          role="alert"
        >

          <X
            size={16}
          />

          <span>
            {error}
          </span>

        </div>
      )}


      {success && (
        <div
          className="skill-proof-message success"
          role="status"
        >

          <CheckCircle2
            size={16}
          />

          <span>
            {success}
          </span>

        </div>
      )}


      {/* =====================================================
          OVERVIEW
          ===================================================== */}

      <section
        className="skill-proof-overview"
      >

        <div
          className="skill-proof-overview-card"
        >

          <div
            className="skill-proof-stat-icon verified"
          >

            <BadgeCheck
              size={19}
            />

          </div>


          <div>

            <span>
              VERIFIED
            </span>


            <strong>
              {approvedProofs.length}
            </strong>


            <small>
              accepted evidence
            </small>

          </div>

        </div>


        <div
          className="skill-proof-overview-card"
        >

          <div
            className="skill-proof-stat-icon pending"
          >

            <Clock3
              size={19}
            />

          </div>


          <div>

            <span>
              PENDING
            </span>


            <strong>
              {pendingProofs.length}
            </strong>


            <small>
              waiting for review
            </small>

          </div>

        </div>


        <div
          className="skill-proof-overview-card"
        >

          <div
            className="skill-proof-stat-icon missing"
          >

            <Target
              size={19}
            />

          </div>


          <div>

            <span>
              NEEDS PROOF
            </span>


            <strong>
              {skillsWithoutProof.length}
            </strong>


            <small>
              claimed skills without evidence
            </small>

          </div>

        </div>


        <div
          className="skill-proof-overview-card"
        >

          <div
            className="skill-proof-stat-icon coverage"
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
              profile skills verified
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          NO PROFILE SKILLS
          ===================================================== */}

      {candidateSkills.length ===
        0 && (

        <section
          className="skill-proof-empty-profile"
        >

          <div
            className="skill-proof-empty-icon"
          >

            <UserIcon />

          </div>


          <div>

            <span className="candidate-card-eyebrow">
              YOUR PROFILE NEEDS SKILLS
            </span>


            <h2>
              Add your skills before submitting evidence.
            </h2>


            <p>
              Skill proof can only be attached to skills
              that are currently listed on your candidate
              profile.
            </p>

          </div>


          <Link
            to="/candidate/profile"
            className="skill-proof-secondary-button"
          >

            Update profile

            <ArrowRight
              size={14}
            />

          </Link>

        </section>

      )}


      {/* =====================================================
          PROFESSIONAL SKILLS
          ===================================================== */}

      {candidateSkills.length >
        0 && (

        <section
          className="skill-proof-panel"
        >

          <div
            className="skill-proof-panel-heading"
          >

            <div>

              <span className="candidate-card-eyebrow">
                YOUR PROFESSIONAL SKILLS
              </span>


              <h2>
                Every skill needs a signal.
              </h2>


              <p>
                Track which skills are verified, under review,
                rejected, or still waiting for evidence.
              </p>

            </div>


            <Link
              to="/candidate/profile"
              className="skill-proof-heading-link"
            >

              Manage skills

              <ArrowRight
                size={13}
              />

            </Link>

          </div>


          <div
            className="skill-proof-skill-list"
          >

            {candidateSkills.map(
              (skill) => {

                const status =
                  getSkillStatus(
                    skill
                  );


                const proof =
                  getSkillProof(
                    skill
                  );


                return (
                  <article
                    className={`skill-proof-skill-row ${
                      status
                    }`}
                    key={skill}
                  >

                    <div
                      className={`skill-proof-skill-icon ${
                        status
                      }`}
                    >

                      {status ===
                      "approved" ? (
                        <BadgeCheck
                          size={18}
                        />
                      ) : status ===
                        "pending" ? (
                        <Clock3
                          size={18}
                        />
                      ) : status ===
                        "rejected" ? (
                        <X
                          size={18}
                        />
                      ) : (
                        <Target
                          size={18}
                        />
                      )}

                    </div>


                    <div
                      className="skill-proof-skill-content"
                    >

                      <div
                        className="skill-proof-skill-title"
                      >

                        <h3>
                          {skill}
                        </h3>


                        <span
                          className={`skill-proof-status ${
                            status
                          }`}
                        >

                          {formatStatusLabel(
                            status
                          )}

                        </span>

                      </div>


                      <p>

                        {status ===
                        "approved"
                          ? `Recruiter-approved evidence${
                              proof?.title
                                ? ` · ${proof.title}`
                                : ""
                            }`
                          : status ===
                            "pending"
                          ? `Submitted ${
                              proof?.submittedAt ||
                              proof?.createdAt
                                ? `on ${formatDate(
                                    proof?.submittedAt ||
                                      proof?.createdAt
                                  )}`
                                : "recently"
                            } and awaiting review.`
                          : status ===
                            "rejected"
                          ? proof?.recruiterComment ||
                            "The previous evidence was not sufficient. Submit stronger evidence."
                          : "Listed on your profile but not yet supported by submitted evidence."}

                      </p>

                    </div>


                    <div
                      className="skill-proof-skill-actions"
                    >

                      {proof?.proofUrl && (
                        <a
                          href={
                            proof.proofUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="skill-proof-view-link"
                        >

                          View evidence

                          <ExternalLink
                            size={11}
                          />

                        </a>
                      )}


                      {(
                        status ===
                          "missing" ||
                        status ===
                          "rejected"
                      ) && (

                        <button
                          type="button"
                          className="skill-proof-add-link"
                          onClick={() =>
                            handleOpenForm(
                              skill
                            )
                          }
                        >

                          {status ===
                          "rejected"
                            ? "Submit stronger proof"
                            : "Add evidence"}

                          <ArrowRight
                            size={12}
                          />

                        </button>

                      )}

                    </div>

                  </article>
                );

              }
            )}

          </div>

        </section>

      )}


      {/* =====================================================
          EVIDENCE LIBRARY
          ===================================================== */}

      <section
        className="skill-proof-panel"
      >

        <div
          className="skill-proof-panel-heading"
        >

          <div>

            <span className="candidate-card-eyebrow">
              EVIDENCE LIBRARY
            </span>


            <h2>
              Submitted evidence.
            </h2>


            <p>
              Review everything you've sent through
              PulseHire.
            </p>

          </div>


          <span
            className="skill-proof-count"
          >

            {skillProofs.length}

            {" "}

            {skillProofs.length ===
            1
              ? "submission"
              : "submissions"}

          </span>

        </div>


        {skillProofs.length >
        0 ? (

          <div
            className="skill-proof-evidence-grid"
          >

            {skillProofs.map(
              (proof) => {

                const Icon =
                  getProofIcon(
                    proof?.proofType
                  );


                const status =
                  String(
                    proof?.status ||
                      "pending"
                  ).toLowerCase();


                return (
                  <article
                    className={`skill-proof-evidence-card ${
                      status
                    }`}
                    key={
                      proof?._id
                    }
                  >

                    <div
                      className="skill-proof-evidence-card-top"
                    >

                      <div
                        className="skill-proof-evidence-icon"
                      >

                        <Icon
                          size={18}
                        />

                      </div>


                      <span
                        className={`skill-proof-status ${
                          status
                        }`}
                      >

                        {formatStatusLabel(
                          status
                        )}

                      </span>

                    </div>


                    <span
                      className="skill-proof-evidence-type"
                    >

                      {String(
                        proof?.proofType ||
                          "other"
                      ).toUpperCase()}

                    </span>


                    <h3>
                      {proof?.title ||
                        "Untitled evidence"}
                    </h3>


                    <p>
                      {proof?.description ||
                        "No description was provided for this evidence."}
                    </p>


                    <div
                      className="skill-proof-evidence-meta"
                    >

                      <span>

                        <Target
                          size={12}
                        />

                        {proof?.skill ||
                          "Skill"}

                      </span>


                      <span>

                        <Clock3
                          size={12}
                        />

                        {formatDate(
                          proof?.submittedAt ||
                            proof?.createdAt
                        )}

                      </span>

                    </div>


                    {proof?.recruiterComment && (
                      <div
                        className="skill-proof-review-note"
                      >

                        <strong>
                          Recruiter feedback
                        </strong>


                        <span>
                          {proof.recruiterComment}
                        </span>

                      </div>
                    )}


                    {proof?.proofUrl && (
                      <a
                        href={
                          proof.proofUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="skill-proof-evidence-link"
                      >

                        Open evidence

                        <ExternalLink
                          size={12}
                        />

                      </a>
                    )}

                  </article>
                );

              }
            )}

          </div>

        ) : (

          <div
            className="skill-proof-library-empty"
          >

            <FileCheck2
              size={24}
            />


            <div>

              <strong>
                Your evidence library is empty.
              </strong>


              <span>
                Submit your first proof and start
                building an evidence-backed skill profile.
              </span>

            </div>


            {candidateSkills.length >
              0 && (

              <button
                type="button"
                className="skill-proof-secondary-button"
                onClick={() =>
                  handleOpenForm()
                }
              >

                Add first proof

                <ArrowRight
                  size={13}
                />

              </button>

            )}

          </div>

        )}

      </section>


      {/* =====================================================
          PRINCIPLE
          ===================================================== */}

      <section
        className="skill-proof-principle"
      >

        <div
          className="skill-proof-principle-icon"
        >

          <ShieldCheck
            size={21}
          />

        </div>


        <div>

          <span className="candidate-card-eyebrow">
            WHY EVIDENCE MATTERS
          </span>


          <h2>
            A skill becomes a stronger hiring signal
            when there is evidence behind it.
          </h2>


          <p>
            You provide evidence, a recruiter validates
            it, and the verified capability becomes part
            of the signal PulseHire uses for matching and
            skill-gap intelligence.
          </p>

        </div>

      </section>


      {/* =====================================================
          ADD PROOF MODAL
          ===================================================== */}

      {showForm && (

        <div
          className="skill-proof-modal-backdrop"
          role="presentation"
        >

          <section
            className="skill-proof-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-proof-modal-title"
          >

            <div
              className="skill-proof-modal-header"
            >

              <div>

                <span className="candidate-card-eyebrow">
                  ADD NEW EVIDENCE
                </span>


                <h2
                  id="skill-proof-modal-title"
                >
                  What would you like to prove?
                </h2>


                <p>
                  Submit a clear piece of evidence that
                  demonstrates how you've used a claimed skill.
                </p>

              </div>


              <button
                type="button"
                className="skill-proof-modal-close"
                onClick={
                  handleCloseForm
                }
                disabled={
                  submitting
                }
                aria-label="Close evidence form"
              >

                <X
                  size={18}
                />

              </button>

            </div>


            <form
              className="skill-proof-form"
              onSubmit={
                handleSubmitProof
              }
            >

              {/* =============================================
                  SKILL + TYPE
                  ============================================= */}

              <div
                className="skill-proof-field-grid"
              >

                <div
                  className="skill-proof-field"
                >

                  <label htmlFor="proof-skill">
                    Skill
                  </label>


                  <select
                    id="proof-skill"
                    name="skill"
                    value={
                      formData.skill
                    }
                    onChange={
                      handleInputChange
                    }
                    disabled={
                      submitting
                    }
                    required
                  >

                    <option value="">
                      Select a claimed skill
                    </option>


                    {candidateSkills.map(
                      (skill) => (
                        <option
                          key={skill}
                          value={skill}
                        >
                          {skill}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div
                  className="skill-proof-field"
                >

                  <label htmlFor="proof-type">
                    Evidence type
                  </label>


                  <select
                    id="proof-type"
                    name="proofType"
                    value={
                      formData.proofType
                    }
                    onChange={
                      handleInputChange
                    }
                    disabled={
                      submitting
                    }
                    required
                  >

                    {proofTypeOptions.map(
                      ({
                        value,
                        label,
                      }) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {label}
                        </option>
                      )
                    )}

                  </select>


                  <small>
                    {
                      proofTypeOptions.find(
                        (
                          option
                        ) =>
                          option.value ===
                          formData.proofType
                      )?.description
                    }
                  </small>

                </div>

              </div>


              {/* =============================================
                  TITLE
                  ============================================= */}

              <div
                className="skill-proof-field"
              >

                <div
                  className="skill-proof-label-row"
                >

                  <label htmlFor="proof-title">
                    Evidence title
                  </label>


                  <span>
                    {formData.title.length}
                    {" / 120"}
                  </span>

                </div>


                <input
                  id="proof-title"
                  name="title"
                  type="text"
                  maxLength={120}
                  placeholder="e.g. PulseHire Recruitment Platform"
                  value={
                    formData.title
                  }
                  onChange={
                    handleInputChange
                  }
                  disabled={
                    submitting
                  }
                  required
                />

              </div>


              {/* =============================================
                  DESCRIPTION
                  ============================================= */}

              <div
                className="skill-proof-field"
              >

                <div
                  className="skill-proof-label-row"
                >

                  <label htmlFor="proof-description">
                    What does this evidence demonstrate?
                  </label>


                  <span>
                    {formData.description.length}
                    {" / 1000"}
                  </span>

                </div>


                <textarea
                  id="proof-description"
                  name="description"
                  maxLength={1000}
                  rows={6}
                  placeholder="Explain what you built, contributed, solved, or demonstrated."
                  value={
                    formData.description
                  }
                  onChange={
                    handleInputChange
                  }
                  disabled={
                    submitting
                  }
                />

              </div>


              {/* =============================================
                  URL
                  ============================================= */}

              <div
                className="skill-proof-field"
              >

                <label htmlFor="proof-url">
                  Evidence URL
                </label>


                <div
                  className="skill-proof-url-field"
                >

                  <Globe2
                    size={16}
                  />


                  <input
                    id="proof-url"
                    name="proofUrl"
                    type="url"
                    placeholder="https://github.com/yourusername/project"
                    value={
                      formData.proofUrl
                    }
                    onChange={
                      handleInputChange
                    }
                    disabled={
                      submitting
                    }
                    required
                  />

                </div>


                <small>
                  Use a public HTTPS link recruiters can open.
                </small>

              </div>


              {/* =============================================
                  FORM ERROR
                  ============================================= */}

              {error && (
                <div
                  className="skill-proof-form-error"
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


              {/* =============================================
                  ACTIONS
                  ============================================= */}

              <div
                className="skill-proof-form-actions"
              >

                <button
                  type="button"
                  className="skill-proof-cancel-button"
                  onClick={
                    handleCloseForm
                  }
                  disabled={
                    submitting
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="skill-proof-submit-button"
                  disabled={
                    submitting ||
                    candidateSkills.length ===
                      0
                  }
                >

                  {submitting ? (
                    <LoaderCircle
                      size={15}
                    />
                  ) : (
                    <ShieldCheck
                      size={15}
                    />
                  )}


                  {submitting
                    ? "Submitting..."
                    : "Submit for review"}

                </button>

              </div>

            </form>

          </section>

        </div>

      )}

    </section>
  );
};


/* =========================================================
   LOCAL USER ICON
   ========================================================= */

const UserIcon = () => {

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >

      <path
        d="M20 21a8 8 0 0 0-16 0"
      />

      <circle
        cx="12"
        cy="7"
        r="4"
      />

    </svg>
  );

};


export default SkillProof;