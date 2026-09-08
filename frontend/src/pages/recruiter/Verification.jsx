import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Code2,
  LayoutDashboard,
  LogOut,
  Target,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../services/api";

const SkillVerification = () => {
  const [skillProofs, setSkillProofs] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * =========================================================
   * FETCH SKILL PROOFS
   * =========================================================
   */

  const fetchSkillProofs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/skill-proof/recruiter");

      if (response.data?.success) {
        const proofs = response.data.skillProofs || [];

        setSkillProofs(proofs);

        const firstPendingProof = proofs.find(
          (proof) => proof.status === "pending"
        );

        setSelectedProof(
          firstPendingProof || proofs[0] || null
        );
      }
    } catch (error) {
      console.error(
        "Fetch recruiter skill proofs error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load skill proofs."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * INITIAL PAGE LOAD
   * =========================================================
   *
   * We intentionally load the data inside the effect itself.
   * This avoids the React setState-in-effect lint problem.
   */

  useEffect(() => {
    let cancelled = false;

    const loadInitialProofs = async () => {
      try {
        const response = await api.get(
          "/skill-proof/recruiter"
        );

        if (cancelled) return;

        if (response.data?.success) {
          const proofs = response.data.skillProofs || [];

          setSkillProofs(proofs);

          const firstPendingProof = proofs.find(
            (proof) => proof.status === "pending"
          );

          setSelectedProof(
            firstPendingProof || proofs[0] || null
          );
        }
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Initial recruiter skill proofs error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load skill proofs."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialProofs();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * SELECT PROOF
   * =========================================================
   */

  const handleSelectProof = (proof) => {
    setSelectedProof(proof);
    setError("");
    setSuccess("");
  };

  /*
   * =========================================================
   * APPROVE / REJECT PROOF
   * =========================================================
   */

  const handleReview = async (status) => {
    if (!selectedProof) return;

    try {
      setReviewing(true);
      setError("");
      setSuccess("");

      const recruiterComment =
        status === "approved"
          ? "The submitted evidence provides sufficient support for this skill."
          : "Please provide stronger evidence demonstrating your use of this skill.";

      const response = await api.patch(
        `/skill-proof/${selectedProof._id}/review`,
        {
          status,
          recruiterComment,
        }
      );

      if (response.data?.success) {
        setSuccess(response.data.message);

        await fetchSkillProofs();
      }
    } catch (error) {
      console.error(
        "Review skill proof error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to review this skill proof."
      );
    } finally {
      setReviewing(false);
    }
  };

  /*
   * =========================================================
   * DERIVED DATA
   * =========================================================
   */

  const pendingProofs = skillProofs.filter(
    (proof) => proof.status === "pending"
  );

  const approvedProofs = skillProofs.filter(
    (proof) => proof.status === "approved"
  );

  const candidateName =
    selectedProof?.candidate?.fullname ||
    "Candidate";

  const candidateEmail =
    selectedProof?.candidate?.email || "";

  const proofTypeLabel = selectedProof?.proofType
    ? selectedProof.proofType.toUpperCase()
    : "";

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <div className="recruiter-dashboard">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="recruiter-sidebar">

        <Link
          to="/recruiter/dashboard"
          className="dashboard-brand"
        >
          <div className="dashboard-brand-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <span>PulseHire</span>
        </Link>

        <div className="sidebar-section">
          <span className="sidebar-label">
            RECRUITER WORKSPACE
          </span>

          <nav className="sidebar-nav">

            <Link
              to="/recruiter/dashboard"
              className="sidebar-link"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link
              to="/recruiter/jobs"
              className="sidebar-link"
            >
              <BriefcaseBusiness size={17} />
              My Jobs
            </Link>

            <Link
              to="/recruiter/applications"
              className="sidebar-link"
            >
              <FileCheck2 size={17} />
              Applications
            </Link>

            <Link
              to="/recruiter/candidates"
              className="sidebar-link"
            >
              <Users size={17} />
              Candidates
            </Link>

            <Link
              to="/recruiter/verification"
              className="sidebar-link active"
            >
              <BadgeCheck size={17} />
              Verification
            </Link>

            <Link
              to="/recruiter/analytics"
              className="sidebar-link"
            >
              <BarChart3 size={17} />
              Analytics
            </Link>

          </nav>
        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar recruiter-avatar">
              TN
            </div>

            <div>
              <strong>TechNova</strong>
              <span>Recruiter</span>
            </div>
          </div>

          <button
            className="logout-button"
            type="button"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="recruiter-main">

        {/* ===================================================
            BACK
            =================================================== */}

        <Link
          to="/recruiter/candidates"
          className="skill-verification-back"
        >
          <ArrowLeft size={13} />
          Back to candidates
        </Link>


        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="skill-verification-header">

          <div className="verification-candidate">

            <div className="verification-avatar">
              {candidateName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>

              <span className="dashboard-eyebrow">
                SKILL VERIFICATION
              </span>

              <h1>
                {candidateName}
              </h1>

              <p>
                {candidateEmail
                  ? `Reviewing submitted skill evidence from ${candidateEmail}.`
                  : "Reviewing submitted skill evidence."}
              </p>

            </div>

          </div>


          <div className="verification-progress">

            <span>
              EVIDENCE REVIEW
            </span>

            <strong>
              {approvedProofs.length} verified ·{" "}
              {pendingProofs.length} pending
            </strong>

          </div>

        </header>


        {/* ===================================================
            MESSAGES
            =================================================== */}

        {error && (
          <div className="verification-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="verification-message success">
            {success}
          </div>
        )}


        {/* ===================================================
            SKILL SELECTOR
            =================================================== */}

        <section className="verification-skill-selector">

          {loading ? (

            <div className="verification-skill-tab">
              Loading proofs...
            </div>

          ) : pendingProofs.length === 0 ? (

            <div className="verification-skill-tab">
              <BadgeCheck size={14} />

              <div>
                <strong>
                  No pending proofs
                </strong>

                <span>
                  All submitted proofs have been reviewed.
                </span>
              </div>
            </div>

          ) : (

            pendingProofs.map((proof) => (

              <button
                key={proof._id}
                type="button"
                className={`verification-skill-tab ${
                  selectedProof?._id === proof._id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleSelectProof(proof)
                }
              >

                <Target size={14} />

                <div>

                  <strong>
                    {proof.skill}
                  </strong>

                  <span>
                    {proof.candidate?.fullname ||
                      "Candidate"}{" "}
                    · Pending
                  </span>

                </div>

              </button>

            ))

          )}

        </section>


        {/* ===================================================
            VERIFICATION LAYOUT
            =================================================== */}

        <div className="verification-layout">


          {/* =================================================
              LEFT — EVIDENCE
              ================================================= */}

          <section className="verification-evidence-panel">

            <div className="verification-panel-heading">

              <div>

                <span className="panel-label">
                  {selectedProof?.skill?.toUpperCase() ||
                    "EVIDENCE"}
                </span>

                <h2>
                  Evidence submitted by candidate.
                </h2>

                <p>
                  Review the submitted evidence before
                  making your decision.
                </p>

              </div>

            </div>


            {selectedProof ? (

              <article className="evidence-card">

                <div className="evidence-card-header">

                  <div className="evidence-source-icon github">

                    {selectedProof.proofType ===
                    "github" ? (
                      <Code2 size={17} />
                    ) : (
                      <FileCheck2 size={17} />
                    )}

                  </div>


                  <div>

                    <span className="evidence-type">
                      {proofTypeLabel}
                    </span>

                    <h3>
                      {selectedProof.title}
                    </h3>

                  </div>


                  <span
                    className={`evidence-strength ${
                      selectedProof.status === "approved"
                        ? "strong"
                        : "medium"
                    }`}
                  >
                    {selectedProof.status}
                  </span>

                </div>


                <p className="evidence-description">

                  {selectedProof.description ||
                    "No description was provided by the candidate."}

                </p>


                <div className="evidence-technologies">

                  <span>
                    {selectedProof.skill}
                  </span>

                  <span>
                    {selectedProof.proofType}
                  </span>

                </div>


                {selectedProof.proofUrl && (
                  <a
                    href={selectedProof.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="evidence-external-link"
                  >
                    View submitted evidence
                    <ExternalLink size={11} />
                  </a>
                )}

              </article>

            ) : (

              <div className="verification-empty-state">

                <BadgeCheck size={30} />

                <h3>
                  No skill proof selected
                </h3>

                <p>
                  Select a pending proof above to review
                  the candidate's evidence.
                </p>

              </div>

            )}

          </section>


          {/* =================================================
              RIGHT — DECISION
              ================================================= */}

          <aside className="verification-sidebar">


            {/* =================================================
                SKILL RESULT
                ================================================= */}

            <section className="verification-result-card">

              <span className="panel-label">
                CURRENT RESULT
              </span>


              <div className="verification-result-icon">

                {selectedProof?.status ===
                "approved" ? (

                  <BadgeCheck size={22} />

                ) : selectedProof?.status ===
                  "rejected" ? (

                  <XCircle size={22} />

                ) : (

                  <Target size={22} />

                )}

              </div>


              <h2>
                {selectedProof?.skill ||
                  "No skill selected"}
              </h2>


              <strong>

                {selectedProof
                  ? selectedProof.status ===
                    "approved"
                    ? "Verified"
                    : selectedProof.status ===
                      "rejected"
                      ? "Rejected"
                      : "Pending Review"
                  : "Waiting for review"}

              </strong>


              <p>

                {selectedProof?.status ===
                "approved"

                  ? "Evidence has been validated by a recruiter."

                  : selectedProof?.status ===
                    "rejected"

                    ? selectedProof.recruiterComment ||
                      "The submitted evidence was not sufficient."

                    : "Review the submitted evidence before making a decision."}

              </p>

            </section>


            {/* =================================================
                CRITERIA
                ================================================= */}

            <section className="verification-criteria">

              <span className="panel-label">
                VERIFICATION CRITERIA
              </span>

              <h2>
                Evidence checklist
              </h2>


              <div className="criteria-row">
                <CheckCircle2 size={14} />

                <span>
                  Real project usage
                </span>
              </div>


              <div className="criteria-row">
                <CheckCircle2 size={14} />

                <span>
                  Evidence is relevant to the skill
                </span>
              </div>


              <div className="criteria-row">
                <CheckCircle2 size={14} />

                <span>
                  Evidence source is accessible
                </span>
              </div>


              <div className="criteria-row">
                <CheckCircle2 size={14} />

                <span>
                  Evidence supports the claim
                </span>
              </div>

            </section>


            {/* =================================================
                DECISION
                ================================================= */}

            <section className="verification-decision">

              <span className="panel-label">
                RECRUITER DECISION
              </span>


              <h2>
                Review this skill proof?
              </h2>


              <p>
                Your decision will affect the candidate's
                verified skill profile and future matching.
              </p>


              <button
                className="approve-verification-button"
                type="button"
                disabled={
                  !selectedProof ||
                  selectedProof.status !== "pending" ||
                  reviewing
                }
                onClick={() =>
                  handleReview("approved")
                }
              >

                <CheckCircle2 size={14} />

                {reviewing
                  ? "Processing..."
                  : "Approve Evidence"}

              </button>


              <button
                className="reject-verification-button"
                type="button"
                disabled={
                  !selectedProof ||
                  selectedProof.status !== "pending" ||
                  reviewing
                }
                onClick={() =>
                  handleReview("rejected")
                }
              >

                <XCircle size={14} />

                Reject Evidence

              </button>

            </section>

          </aside>

        </div>


        {/* ===================================================
            FOOTER INSIGHT
            =================================================== */}

        <section className="recruiter-insight">

          <div className="recruiter-insight-icon">
            <BadgeCheck size={21} />
          </div>

          <div>

            <span className="panel-label">
              TRUSTED SKILLS
            </span>

            <h2>
              Verification should be backed by evidence.
            </h2>

            <p>
              Recruiter validation adds another layer of
              trust to candidate skills. Once confirmed,
              verified skills can strengthen future
              candidate-role matching.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default SkillVerification;