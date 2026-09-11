import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Target,
  Users,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const Verification = () => {
  const { user, logout } = useAuth();

  const [skillProofs, setSkillProofs] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSkillProofs = async () => {
      try {
        const response = await api.get("/skill-proof/recruiter");

        if (cancelled) return;

        if (response.data?.success) {
          const proofs = response.data.skillProofs || [];

          setSkillProofs(proofs);

          const firstPendingProof = proofs.find(
            (proof) => proof.status === "pending",
          );

          setSelectedProof(firstPendingProof || proofs[0] || null);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Fetch recruiter skill proofs error:", error);

        setError(
          error.response?.data?.message || "Unable to load skill proofs.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSkillProofs();

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingProofs = useMemo(
    () => skillProofs.filter((proof) => proof.status === "pending"),
    [skillProofs],
  );

  const approvedProofs = useMemo(
    () => skillProofs.filter((proof) => proof.status === "approved"),
    [skillProofs],
  );

  const rejectedProofs = useMemo(
    () => skillProofs.filter((proof) => proof.status === "rejected"),
    [skillProofs],
  );

  const handleSelectProof = (proof) => {
    setSelectedProof(proof);
    setError("");
    setSuccess("");
  };

  const handleReview = async (status) => {
    if (!selectedProof) {
      return;
    }

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
        },
      );

      if (response.data?.success) {
        setSuccess(response.data.message);

        const updatedProof = response.data.skillProof;

        setSkillProofs((previousProofs) =>
          previousProofs.map((proof) =>
            proof._id === updatedProof._id ? updatedProof : proof,
          ),
        );

        const nextPendingProof = skillProofs.find(
          (proof) =>
            proof._id !== updatedProof._id && proof.status === "pending",
        );

        setSelectedProof(nextPendingProof || updatedProof);
      }
    } catch (error) {
      console.error("Review skill proof error:", error);

      setError(
        error.response?.data?.message || "Unable to review this skill proof.",
      );
    } finally {
      setReviewing(false);
    }
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return "PH";
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const getProofTypeLabel = (type = "") => {
    const labels = {
      project: "PROJECT",
      certificate: "CERTIFICATE",
      github: "GITHUB",
      portfolio: "PORTFOLIO",
      other: "OTHER",
    };

    return labels[type] || "EVIDENCE";
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="recruiter-dashboard">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="recruiter-sidebar">
        <Link to="/recruiter/dashboard" className="recruiter-brand">
          <div className="recruiter-brand-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <span>PulseHire</span>
        </Link>

        <div className="sidebar-section">
          <span className="sidebar-label">RECRUITER WORKSPACE</span>

          <nav className="sidebar-nav">
            <Link to="/recruiter/dashboard" className="sidebar-link">
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link to="/recruiter/jobs" className="sidebar-link">
              <BriefcaseBusiness size={17} />
              Jobs
            </Link>

            <Link to="/recruiter/candidates" className="sidebar-link">
              <Users size={17} />
              Candidates
            </Link>

            <Link to="/recruiter/verification" className="sidebar-link active">
              <BadgeCheck size={17} />
              Verification
            </Link>

            <Link to="/recruiter/analytics" className="sidebar-link">
              <BarChart3 size={17} />
              Analytics
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar recruiter-avatar">
              {getInitials(user?.fullname)}
            </div>

            <div>
              <strong>{user?.fullname || "Recruiter"}</strong>

              <span>Recruiter</span>
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

      <main className="recruiter-main">
        <Link to="/recruiter/candidates" className="skill-verification-back">
          <ArrowLeft size={13} />
          Back to candidates
        </Link>

        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="skill-verification-header">
          <div className="verification-candidate">
            <div className="verification-avatar">
              {getInitials(selectedProof?.candidate?.fullname)}
            </div>

            <div>
              <span className="dashboard-eyebrow">SKILL VERIFICATION</span>

              <h1>
                {selectedProof?.candidate?.fullname || "Candidate Evidence"}
              </h1>

              <p>
                {selectedProof?.candidate?.email
                  ? `Reviewing submitted skill evidence from ${selectedProof.candidate.email}.`
                  : "Review submitted candidate skill evidence."}
              </p>
            </div>
          </div>

          <div className="verification-progress">
            <span>EVIDENCE REVIEW</span>

            <strong>
              {approvedProofs.length} verified · {pendingProofs.length} pending
            </strong>
          </div>
        </header>

        {/* ===================================================
            MESSAGES
            =================================================== */}

        {error && (
          <div className="verification-message error">
            <XCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="verification-message success">
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        {/* ===================================================
            PENDING PROOF SELECTOR
            =================================================== */}

        <section className="verification-skill-selector">
          {loading ? (
            <div className="verification-skill-tab">
              Loading skill proofs...
            </div>
          ) : pendingProofs.length === 0 ? (
            <div className="verification-skill-tab">
              <BadgeCheck size={15} />

              <div>
                <strong>No pending proofs</strong>

                <span>All submitted evidence has been reviewed.</span>
              </div>
            </div>
          ) : (
            pendingProofs.map((proof) => (
              <button
                key={proof._id}
                type="button"
                className={`verification-skill-tab ${
                  selectedProof?._id === proof._id ? "active" : ""
                }`}
                onClick={() => handleSelectProof(proof)}
              >
                <Target size={14} />

                <div>
                  <strong>{proof.skill}</strong>

                  <span>
                    {proof.candidate?.fullname || "Candidate"} · Pending
                  </span>
                </div>
              </button>
            ))
          )}
        </section>

        {/* ===================================================
            MAIN VERIFICATION LAYOUT
            =================================================== */}

        <div className="verification-layout">
          {/* =================================================
              EVIDENCE
              ================================================= */}

          <section className="verification-evidence-panel">
            <div className="verification-panel-heading">
              <div>
                <span className="panel-label">
                  {selectedProof?.skill?.toUpperCase() || "EVIDENCE"}
                </span>

                <h2>Evidence submitted by candidate.</h2>

                <p>
                  Review the submitted evidence before making your decision.
                </p>
              </div>
            </div>

            {selectedProof ? (
              <article className="evidence-card">
                <div className="evidence-card-header">
                  <div className="evidence-source-icon github">
                    {selectedProof.proofType === "github" ? (
                      <Code2 size={17} />
                    ) : (
                      <FileCheck2 size={17} />
                    )}
                  </div>

                  <div>
                    <span className="evidence-type">
                      {getProofTypeLabel(selectedProof.proofType)}
                    </span>

                    <h3>{selectedProof.title}</h3>
                  </div>

                  <span
                    className={`evidence-strength ${
                      selectedProof.status === "approved"
                        ? "strong"
                        : selectedProof.status === "rejected"
                          ? "weak"
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
                  <span>{selectedProof.skill}</span>

                  <span>{getProofTypeLabel(selectedProof.proofType)}</span>
                </div>

                {selectedProof.proofUrl && (
                  <a
                    href={selectedProof.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="evidence-external-link"
                  >
                    View submitted evidence
                    <ExternalLink size={12} />
                  </a>
                )}

                <div className="evidence-review-details">
                  <div>
                    <span>Candidate</span>

                    <strong>
                      {selectedProof.candidate?.fullname || "Unknown candidate"}
                    </strong>
                  </div>

                  <div>
                    <span>Submitted</span>

                    <strong>
                      {selectedProof.createdAt
                        ? new Date(selectedProof.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </strong>
                  </div>
                </div>
              </article>
            ) : (
              <div className="verification-empty-state">
                <BadgeCheck size={30} />

                <h3>No skill proof selected</h3>

                <p>
                  There are currently no submitted skill proofs available for
                  review.
                </p>
              </div>
            )}
          </section>

          {/* =================================================
              DECISION SIDEBAR
              ================================================= */}

          <aside className="verification-sidebar">
            <section className="verification-result-card">
              <span className="panel-label">CURRENT RESULT</span>

              <div className="verification-result-icon">
                {selectedProof?.status === "approved" ? (
                  <BadgeCheck size={22} />
                ) : selectedProof?.status === "rejected" ? (
                  <XCircle size={22} />
                ) : (
                  <Target size={22} />
                )}
              </div>

              <h2>{selectedProof?.skill || "No skill selected"}</h2>

              <strong>
                {selectedProof?.status === "approved"
                  ? "Verified"
                  : selectedProof?.status === "rejected"
                    ? "Rejected"
                    : selectedProof
                      ? "Pending Review"
                      : "Waiting for evidence"}
              </strong>

              <p>
                {selectedProof?.status === "approved"
                  ? "Evidence has been validated by a recruiter."
                  : selectedProof?.status === "rejected"
                    ? selectedProof.recruiterComment ||
                      "The submitted evidence was not sufficient."
                    : selectedProof
                      ? "Review the evidence and decide whether it sufficiently supports the claimed skill."
                      : "Select a submitted proof to begin review."}
              </p>
            </section>

            <section className="verification-criteria">
              <span className="panel-label">REVIEW CRITERIA</span>

              <h2>Evidence checklist</h2>

              <div className="criteria-row">
                <CheckCircle2 size={14} />
                <span>Evidence is relevant to the claimed skill</span>
              </div>

              <div className="criteria-row">
                <CheckCircle2 size={14} />
                <span>Candidate's contribution is clear</span>
              </div>

              <div className="criteria-row">
                <CheckCircle2 size={14} />
                <span>Evidence can be independently reviewed</span>
              </div>

              <div className="criteria-row">
                <CheckCircle2 size={14} />
                <span>Evidence supports the skill claim</span>
              </div>
            </section>

            <section className="verification-decision">
              <span className="panel-label">RECRUITER DECISION</span>

              <h2>Review this skill proof?</h2>

              <p>
                Your decision will affect the candidate's verified skill profile
                and future matching.
              </p>

              <button
                className="approve-verification-button"
                type="button"
                disabled={
                  !selectedProof ||
                  selectedProof.status !== "pending" ||
                  reviewing
                }
                onClick={() => handleReview("approved")}
              >
                <CheckCircle2 size={14} />

                {reviewing ? "Processing..." : "Approve Evidence"}
              </button>

              <button
                className="reject-verification-button"
                type="button"
                disabled={
                  !selectedProof ||
                  selectedProof.status !== "pending" ||
                  reviewing
                }
                onClick={() => handleReview("rejected")}
              >
                <XCircle size={14} />

                {reviewing ? "Processing..." : "Reject Evidence"}
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
            <span className="panel-label">TRUSTED SKILLS</span>

            <h2>Verification should be backed by evidence.</h2>

            <p>
              Recruiter validation adds another layer of trust to candidate
              skills. Once confirmed, verified skills can strengthen future
              candidate-role matching.
            </p>
          </div>
        </section>

        {/* ===================================================
            REVIEW SUMMARY
            =================================================== */}

        <div className="verification-review-summary">
          <span>{approvedProofs.length} approved</span>

          <span>{pendingProofs.length} pending</span>

          <span>{rejectedProofs.length} rejected</span>

          <Link to="/recruiter/candidates">
            Review candidates
            <ArrowRight size={13} />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Verification;
