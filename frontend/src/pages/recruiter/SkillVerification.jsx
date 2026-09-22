import { useEffect, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FileCheck2,
  FileText,
  LoaderCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeStatus = (status) =>
  String(status || "pending")
    .trim()
    .toLowerCase();

const formatStatus = (status) => {
  const labels = {
    pending: "Pending review",

    approved: "Verified",

    rejected: "Rejected",
  };

  return labels[normalizeStatus(status)] || "Pending review";
};

const formatProofType = (proofType) => {
  if (!proofType) {
    return "Evidence";
  }

  return String(proofType)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCandidateInitials = (name) => {
  const parts = String(name || "Candidate")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CA";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/* =========================================================
   PROOF TYPE ICON
   ========================================================= */

const ProofTypeIcon = ({ proofType, size = 20 }) => {
  const normalized = String(proofType || "").toLowerCase();

  if (normalized === "project") {
    return <Code2 size={size} />;
  }

  if (normalized === "certificate") {
    return <FileText size={size} />;
  }

  if (normalized === "github") {
    return <Code2 size={size} />;
  }

  if (normalized === "portfolio") {
    return <ExternalLink size={size} />;
  }

  return <FileCheck2 size={size} />;
};

/* =========================================================
   COMPONENT
   ========================================================= */

const SkillVerification = () => {
  const [proofs, setProofs] = useState([]);

  const [selectedProofId, setSelectedProofId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [reviewing, setReviewing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [reviewComment, setReviewComment] = useState("");

  /* =======================================================
     LOAD
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await api.get("/skill-proof/recruiter");

        if (cancelled) {
          return;
        }

        if (!response?.data?.success) {
          throw new Error(
            response?.data?.message || "Unable to load skill proofs.",
          );
        }

        const nextProofs = Array.isArray(response.data.skillProofs)
          ? response.data.skillProofs
          : [];

        setProofs(nextProofs);

        const pending = nextProofs.find(
          (proof) => normalizeStatus(proof?.status) === "pending",
        );

        setSelectedProofId(pending?._id || nextProofs[0]?._id || null);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Recruiter skill proof load error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load skill proofs.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     SELECTED PROOF
     ======================================================= */

  const selectedProof =
    proofs.find((proof) => String(proof?._id) === String(selectedProofId)) ||
    null;

  const pendingProofs = proofs.filter(
    (proof) => normalizeStatus(proof?.status) === "pending",
  );

  const approvedProofs = proofs.filter(
    (proof) => normalizeStatus(proof?.status) === "approved",
  );

  const rejectedProofs = proofs.filter(
    (proof) => normalizeStatus(proof?.status) === "rejected",
  );

  const candidateName = selectedProof?.candidate?.fullname || "Candidate";

  const candidateEmail = selectedProof?.candidate?.email || "";

  const selectedStatus = normalizeStatus(selectedProof?.status);

  /* =======================================================
     SELECT
     ======================================================= */

  const handleSelectProof = (proof) => {
    setSelectedProofId(proof?._id);

    setReviewComment("");

    setError("");

    setSuccess("");
  };

  /* =======================================================
     REFRESH PROOFS
     ======================================================= */

  const refreshProofs = async () => {
    const response = await api.get("/skill-proof/recruiter");

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Unable to refresh skill proofs.",
      );
    }

    const nextProofs = Array.isArray(response.data.skillProofs)
      ? response.data.skillProofs
      : [];

    setProofs(nextProofs);

    setSelectedProofId((currentSelectedId) => {
      const stillExists = nextProofs.some(
        (proof) => String(proof?._id) === String(currentSelectedId),
      );

      if (stillExists) {
        return currentSelectedId;
      }

      const pending = nextProofs.find(
        (proof) => normalizeStatus(proof?.status) === "pending",
      );

      return pending?._id || nextProofs[0]?._id || null;
    });
  };

  /* =======================================================
     REVIEW
     ======================================================= */

  const handleReview = async (nextStatus) => {
    if (!selectedProof) {
      return;
    }

    if (selectedStatus !== "pending") {
      setError("Only pending evidence can be reviewed.");

      return;
    }

    const trimmedComment = reviewComment.trim();

    if (trimmedComment.length > 1000) {
      setError("Recruiter feedback cannot exceed 1000 characters.");

      return;
    }

    try {
      setReviewing(true);

      setError("");

      setSuccess("");

      const fallbackComment =
        nextStatus === "approved"
          ? "The submitted evidence provides sufficient support for this skill."
          : "Please provide stronger evidence demonstrating your use of this skill.";

      const response = await api.patch(
        `/skill-proof/${selectedProof._id}/review`,
        {
          status: nextStatus,

          recruiterComment: trimmedComment || fallbackComment,
        },
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Unable to review this evidence.",
        );
      }

      setSuccess(
        response.data.message ||
          `Evidence ${formatStatus(nextStatus).toLowerCase()}.`,
      );

      setReviewComment("");

      await refreshProofs();
    } catch (requestError) {
      console.error("Skill proof review error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to review this evidence.",
      );
    } finally {
      setReviewing(false);
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="skill-verification-page">
        <div
          className="skill-verification-loading"
          role="status"
          aria-live="polite"
        >
          <LoaderCircle size={31} />

          <h1>Loading evidence queue</h1>

          <p>
            We're gathering submitted skill evidence waiting for recruiter
            review.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section className="skill-verification-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="skill-verification-header">
        <div>
          <span className="candidate-section-eyebrow">
            RECRUITER VERIFICATION
          </span>

          <h1>Review evidence. Strengthen the signal.</h1>

          <p>
            Validate candidate-submitted evidence before it becomes part of
            their verified capability profile.
          </p>
        </div>

        <Link
          to="/recruiter/candidates"
          className="skill-verification-secondary-button"
        >
          Candidate workspace
          <ArrowRight size={13} />
        </Link>
      </header>

      {/* ===================================================
          MESSAGES
          =================================================== */}

      {error && (
        <div className="skill-verification-message error" role="alert">
          <XCircle size={15} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="skill-verification-message success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={15} />

          <span>{success}</span>
        </div>
      )}

      {/* ===================================================
          SUMMARY
          =================================================== */}

      <section className="skill-verification-summary">
        <div className="skill-verification-stat">
          <div className="skill-verification-stat-icon pending">
            <Clock3 size={18} />
          </div>

          <div>
            <span>PENDING REVIEW</span>

            <strong>{pendingProofs.length}</strong>

            <small>evidence submissions waiting</small>
          </div>
        </div>

        <div className="skill-verification-stat">
          <div className="skill-verification-stat-icon approved">
            <BadgeCheck size={18} />
          </div>

          <div>
            <span>VERIFIED</span>

            <strong>{approvedProofs.length}</strong>

            <small>recruiter-approved evidence</small>
          </div>
        </div>

        <div className="skill-verification-stat">
          <div className="skill-verification-stat-icon rejected">
            <XCircle size={18} />
          </div>

          <div>
            <span>REJECTED</span>

            <strong>{rejectedProofs.length}</strong>

            <small>evidence needing improvement</small>
          </div>
        </div>

        <div className="skill-verification-stat">
          <div className="skill-verification-stat-icon total">
            <FileCheck2 size={18} />
          </div>

          <div>
            <span>TOTAL EVIDENCE</span>

            <strong>{proofs.length}</strong>

            <small>submissions in your queue</small>
          </div>
        </div>
      </section>

      {/* ===================================================
          WORKSPACE
          =================================================== */}

      <section className="skill-verification-workspace">
        {/* =================================================
            QUEUE
            ================================================= */}

        <aside className="skill-verification-queue">
          <div className="skill-verification-queue-header">
            <div>
              <span className="candidate-card-eyebrow">EVIDENCE QUEUE</span>

              <h2>Submissions</h2>
            </div>

            <span className="skill-verification-queue-count">
              {proofs.length}
            </span>
          </div>

          {proofs.length > 0 ? (
            <div className="skill-verification-queue-list">
              {proofs.map((proof) => {
                const status = normalizeStatus(proof?.status);

                const selected = String(proof?._id) === String(selectedProofId);

                return (
                  <button
                    type="button"
                    className={`skill-verification-queue-item ${
                      selected ? "selected" : ""
                    }`}
                    key={proof?._id}
                    onClick={() => handleSelectProof(proof)}
                  >
                    <div
                      className={`skill-verification-queue-avatar ${status}`}
                    >
                      {getCandidateInitials(proof?.candidate?.fullname)}
                    </div>

                    <div className="skill-verification-queue-copy">
                      <strong>
                        {proof?.candidate?.fullname || "Candidate"}
                      </strong>

                      <span>{proof?.skill || "Skill"}</span>

                      <small>{formatProofType(proof?.proofType)}</small>
                    </div>

                    <span
                      className={`skill-verification-queue-status ${status}`}
                    >
                      {status === "approved" ? (
                        <BadgeCheck size={10} />
                      ) : status === "rejected" ? (
                        <XCircle size={10} />
                      ) : (
                        <Clock3 size={10} />
                      )}

                      {formatStatus(status)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="skill-verification-empty-queue">
              <CheckCircle2 size={22} />

              <strong>Your review queue is clear.</strong>

              <span>
                New candidate evidence will appear here when it is submitted.
              </span>
            </div>
          )}
        </aside>

        {/* =================================================
            REVIEW
            ================================================= */}

        <main className="skill-verification-review">
          {!selectedProof ? (
            <div className="skill-verification-review-empty">
              <ShieldCheck size={28} />

              <h2>Select an evidence submission.</h2>

              <p>
                Choose a candidate submission from the evidence queue to begin
                review.
              </p>
            </div>
          ) : (
            <>
              {/* =============================================
                  CANDIDATE
                  ============================================= */}

              <section className="skill-verification-candidate-card">
                <div className="skill-verification-candidate-avatar">
                  {getCandidateInitials(candidateName)}
                </div>

                <div className="skill-verification-candidate-copy">
                  <span className="candidate-card-eyebrow">CANDIDATE</span>

                  <h2>{candidateName}</h2>

                  {candidateEmail && <p>{candidateEmail}</p>}
                </div>

                <span className={`skill-verification-status ${selectedStatus}`}>
                  {selectedStatus === "approved" ? (
                    <BadgeCheck size={12} />
                  ) : selectedStatus === "rejected" ? (
                    <XCircle size={12} />
                  ) : (
                    <Clock3 size={12} />
                  )}

                  {formatStatus(selectedStatus)}
                </span>
              </section>

              {/* =============================================
                  SKILL
                  ============================================= */}

              <section className="skill-verification-skill-hero">
                <div
                  className={`skill-verification-skill-icon ${selectedStatus}`}
                >
                  <BadgeCheck size={23} />
                </div>

                <div>
                  <span className="candidate-card-eyebrow">
                    SKILL UNDER REVIEW
                  </span>

                  <h2>{selectedProof.skill || "Unnamed skill"}</h2>

                  <p>
                    Review whether the submitted evidence sufficiently
                    demonstrates this capability.
                  </p>
                </div>
              </section>

              {/* =============================================
                  EVIDENCE
                  ============================================= */}

              <section className="skill-verification-panel">
                <div className="skill-verification-panel-heading">
                  <div>
                    <span className="candidate-card-eyebrow">
                      SUBMITTED EVIDENCE
                    </span>

                    <h2>{selectedProof.title || "Untitled evidence"}</h2>
                  </div>

                  <span className="skill-verification-type">
                    {formatProofType(selectedProof.proofType)}
                  </span>
                </div>

                <div className="skill-verification-evidence-header">
                  <div className="skill-verification-evidence-icon">
                    <ProofTypeIcon
                      proofType={selectedProof.proofType}
                      size={20}
                    />
                  </div>

                  <div>
                    <span>{formatProofType(selectedProof.proofType)}</span>

                    <strong>
                      {selectedProof.title || "Evidence submission"}
                    </strong>

                    <small>
                      Submitted{" "}
                      {formatDate(
                        selectedProof.createdAt || selectedProof.submittedAt,
                      )}
                    </small>
                  </div>
                </div>

                {selectedProof.description && (
                  <div className="skill-verification-description">
                    <span>CANDIDATE EXPLANATION</span>

                    <p>{selectedProof.description}</p>
                  </div>
                )}

                {selectedProof.proofUrl && (
                  <a
                    href={selectedProof.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skill-verification-evidence-link"
                  >
                    Open submitted evidence
                    <ExternalLink size={13} />
                  </a>
                )}
              </section>

              {/* =============================================
                  REVIEW COMMENT
                  ============================================= */}

              <section className="skill-verification-panel">
                <div className="skill-verification-panel-heading">
                  <div>
                    <span className="candidate-card-eyebrow">REVIEW NOTE</span>

                    <h2>Add recruiter feedback.</h2>

                    <p>
                      Explain the decision clearly so the candidate knows what
                      to do next.
                    </p>
                  </div>
                </div>

                <textarea
                  className="skill-verification-comment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder={
                    "Explain why the submitted evidence supports your decision."
                  }
                  disabled={reviewing || selectedStatus !== "pending"}
                />

                <div className="skill-verification-comment-meta">
                  <span>Feedback is visible with the review result.</span>

                  <strong>
                    {reviewComment.length}
                    {" / 1000"}
                  </strong>
                </div>
              </section>

              {/* =============================================
                  DECISION
                  ============================================= */}

              <section className="skill-verification-decision">
                <div>
                  <span className="candidate-card-eyebrow">
                    RECRUITER DECISION
                  </span>

                  <h2>
                    {selectedStatus === "pending"
                      ? "Is this evidence strong enough?"
                      : "This evidence has already been reviewed."}
                  </h2>

                  <p>
                    Verification directly affects the candidate's trusted skill
                    signal and future role matching.
                  </p>
                </div>

                <div className="skill-verification-decision-actions">
                  <button
                    type="button"
                    className="skill-verification-reject"
                    disabled={selectedStatus !== "pending" || reviewing}
                    onClick={() => handleReview("rejected")}
                  >
                    {reviewing ? (
                      <LoaderCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Reject evidence
                  </button>

                  <button
                    type="button"
                    className="skill-verification-approve"
                    disabled={selectedStatus !== "pending" || reviewing}
                    onClick={() => handleReview("approved")}
                  >
                    {reviewing ? (
                      <LoaderCircle size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    Approve evidence
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </section>

      {/* ===================================================
          PRINCIPLE
          =================================================== */}

      <section className="skill-verification-principle">
        <div className="skill-verification-principle-icon">
          <ShieldCheck size={21} />
        </div>

        <div>
          <span className="candidate-section-eyebrow">TRUSTED SKILLS</span>

          <h2>Verification should be backed by evidence.</h2>

          <p>
            A recruiter decision doesn't just change a label. Approved evidence
            becomes part of the candidate's trusted skill signal and can
            influence future skill-gap analysis and role matching.
          </p>
        </div>
      </section>
    </section>
  );
};

export default SkillVerification;
