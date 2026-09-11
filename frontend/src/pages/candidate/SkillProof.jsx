import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Plus,
  ShieldCheck,
  Target,
  Upload,
  User,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const SkillProof = () => {
  const { user, logout } = useAuth();

  const [skillProofs, setSkillProofs] = useState([]);
  const [loadingProofs, setLoadingProofs] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    skill: "",
    proofType: "github",
    title: "",
    description: "",
    proofUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const candidateSkills = useMemo(
  () => user?.profile?.skills || [],
  [user?.profile?.skills],
);

  useEffect(() => {
    const fetchSkillProofs = async () => {
      try {
        setLoadingProofs(true);
        setError("");

        const response = await api.get("/skill-proof/my");

        if (response.data?.success) {
          setSkillProofs(response.data.skillProofs || []);
        }
      } catch (error) {
        console.error("Fetch skill proofs error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your skill proofs.",
        );
      } finally {
        setLoadingProofs(false);
      }
    };

    fetchSkillProofs();
  }, []);

  const approvedProofs = useMemo(
    () =>
      skillProofs.filter(
        (proof) => proof.status === "approved",
      ),
    [skillProofs],
  );

  const pendingProofs = useMemo(
    () =>
      skillProofs.filter(
        (proof) => proof.status === "pending",
      ),
    [skillProofs],
  );

  const provenSkills = useMemo(() => {
    return new Set(
      approvedProofs.map((proof) =>
        String(proof.skill || "").trim().toLowerCase(),
      ),
    );
  }, [approvedProofs]);

  const pendingSkills = useMemo(() => {
    return new Set(
      pendingProofs.map((proof) =>
        String(proof.skill || "").trim().toLowerCase(),
      ),
    );
  }, [pendingProofs]);

  const skillsNeedingProof = useMemo(() => {
    return candidateSkills.filter((skill) => {
      const normalizedSkill = String(skill)
        .trim()
        .toLowerCase();

      return (
        !provenSkills.has(normalizedSkill) &&
        !pendingSkills.has(normalizedSkill)
      );
    });
  }, [candidateSkills, provenSkills, pendingSkills]);

  const uniqueVerifiedSkillCount = provenSkills.size;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleOpenForm = (preferredSkill = "") => {
    setError("");
    setSuccess("");

    const defaultSkill =
      preferredSkill ||
      skillsNeedingProof[0] ||
      candidateSkills[0] ||
      "";

    setFormData({
      skill: defaultSkill,
      proofType: "github",
      title: "",
      description: "",
      proofUrl: "",
    });

    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (submitting) return;

    setShowForm(false);
    setError("");
  };

  const handleSubmitProof = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.skill) {
      setError("Please select a claimed skill to prove.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title for your proof.");
      return;
    }

    if (!formData.proofUrl.trim()) {
      setError("Please provide a proof URL.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/skill-proof", {
        skill: formData.skill,
        proofType: formData.proofType,
        title: formData.title.trim(),
        description: formData.description.trim(),
        proofUrl: formData.proofUrl.trim(),
      });

      if (response.data?.success) {
        const newProof = response.data.skillProof;

        setSkillProofs((previousProofs) => [
          newProof,
          ...previousProofs,
        ]);

        setSuccess(
          "Skill proof submitted successfully. It is now pending recruiter review.",
        );

        setFormData({
          skill: "",
          proofType: "github",
          title: "",
          description: "",
          proofUrl: "",
        });

        setShowForm(false);
      }
    } catch (error) {
      console.error("Submit skill proof error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit your skill proof.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getProofTypeLabel = (proofType) => {
    const labels = {
      project: "Project",
      certificate: "Certificate",
      github: "GitHub",
      portfolio: "Portfolio",
      other: "Other",
    };

    return labels[proofType] || "Other";
  };

  const getStatusLabel = (status) => {
    const labels = {
      approved: "Approved",
      pending: "Pending Review",
      rejected: "Rejected",
    };

    return labels[status] || "Pending Review";
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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="candidate-dashboard">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="candidate-sidebar">
        <div className="dashboard-brand">
          <Link
            to="/candidate/dashboard"
            className="dashboard-brand"
          >
            <div className="dashboard-brand-icon">
              <BriefcaseBusiness size={19} />
            </div>

            <span>PulseHire</span>
          </Link>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            CANDIDATE WORKSPACE
          </span>

          <nav className="sidebar-nav">
            <Link
              to="/candidate/dashboard"
              className="sidebar-link"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link
              to="/candidate/profile"
              className="sidebar-link"
            >
              <User size={17} />
              My Profile
            </Link>

            <Link
              to="/candidate/skill-proof"
              className="sidebar-link active"
            >
              <BadgeCheck size={17} />
              Skill Proof
            </Link>

            <Link
              to="/candidate/skill-gap"
              className="sidebar-link"
            >
              <Target size={17} />
              Skill Gap
            </Link>

            <Link
              to="/candidate/learning"
              className="sidebar-link"
            >
              <BookOpen size={17} />
              Learning
            </Link>

            <Link
              to="/candidate/jobs"
              className="sidebar-link"
            >
              <BriefcaseBusiness size={17} />
              Find Jobs
            </Link>

            <Link
              to="/candidate/applications"
              className="sidebar-link"
            >
              <FileCheck2 size={17} />
              Applications
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {getInitials(user?.fullname)}
            </div>

            <div>
              <strong>
                {user?.fullname || "Candidate"}
              </strong>

              <span>Candidate</span>
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

      <main className="candidate-main">
        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="candidate-topbar">
          <div>
            <span className="dashboard-eyebrow">
              SKILL PROOF
            </span>

            <h1>Prove what you can actually do.</h1>
          </div>
        </header>

        {/* ===================================================
            INTRO
            =================================================== */}

        <section className="proof-intro">
          <div>
            <span className="panel-label">
              EVIDENCE-BACKED SKILLS
            </span>

            <h2>
              Turn your skills into trusted signals.
            </h2>

            <p>
              Submit projects, certificates, portfolios,
              GitHub repositories and other evidence that
              helps recruiters understand what you can
              actually do.
            </p>
          </div>

          <div className="proof-trust">
            <ShieldCheck size={18} />

            <div>
              <strong>Your evidence matters.</strong>

              <span>
                Recruiters can review and validate submitted
                proof.
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            SUMMARY
            =================================================== */}

        <section className="proof-summary">
          <div className="proof-summary-card">
            <span>VERIFIED</span>

            <strong>{uniqueVerifiedSkillCount}</strong>

            <small>
              skills recruiters validated
            </small>
          </div>

          <div className="proof-summary-card">
            <span>PENDING</span>

            <strong>{pendingProofs.length}</strong>

            <small>
              proof items awaiting review
            </small>
          </div>

          <div className="proof-summary-card">
            <span>NEEDS PROOF</span>

            <strong>{skillsNeedingProof.length}</strong>

            <small>
              claimed skills without evidence
            </small>
          </div>

          <button
            className="add-proof-button"
            type="button"
            onClick={() => handleOpenForm()}
            disabled={candidateSkills.length === 0}
          >
            <Plus size={16} />
            Add Skill Proof
          </button>
        </section>

        {/* ===================================================
            CLAIMED SKILLS
            =================================================== */}

        <section className="proof-skill-overview">
          <div className="proof-section-heading">
            <div>
              <span className="panel-label">
                YOUR CLAIMED SKILLS
              </span>

              <h2>Build evidence around your capabilities.</h2>

              <p>
                Start with the skills you've claimed on your
                PulseHire profile.
              </p>
            </div>

            <BadgeCheck size={21} />
          </div>

          {candidateSkills.length === 0 ? (
            <div className="proof-empty-state">
              <Target size={20} />

              <div>
                <strong>No claimed skills yet.</strong>

                <p>
                  Add skills to your profile before submitting
                  evidence for them.
                </p>
              </div>

              <Link
                to="/candidate/profile"
                className="proof-inline-link"
              >
                Go to Profile
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="proof-skill-list">
              {candidateSkills.map((skill) => {
                const normalizedSkill = String(skill)
                  .trim()
                  .toLowerCase();

                const isVerified =
                  provenSkills.has(normalizedSkill);

                const isPending =
                  pendingSkills.has(normalizedSkill);

                return (
                  <div
                    className={`proof-skill-item ${
                      isVerified
                        ? "verified"
                        : isPending
                          ? "pending"
                          : "needs-proof"
                    }`}
                    key={skill}
                  >
                    <div className="proof-skill-item-icon">
                      {isVerified ? (
                        <CheckCircle2 size={17} />
                      ) : isPending ? (
                        <Clock3 size={17} />
                      ) : (
                        <Target size={17} />
                      )}
                    </div>

                    <div className="proof-skill-item-info">
                      <strong>{skill}</strong>

                      <span>
                        {isVerified
                          ? "Recruiter verified"
                          : isPending
                            ? "Proof pending review"
                            : "Evidence not submitted"}
                      </span>
                    </div>

                    {!isVerified && !isPending && (
                      <button
                        type="button"
                        className="proof-skill-prove-button"
                        onClick={() =>
                          handleOpenForm(skill)
                        }
                      >
                        Prove
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ===================================================
            ADD NEW EVIDENCE
            =================================================== */}

        <section className="add-proof-panel">
          <div className="add-proof-heading">
            <div className="add-proof-large-icon">
              <Upload size={20} />
            </div>

            <div>
              <span className="panel-label">
                ADD NEW EVIDENCE
              </span>

              <h2>What would you like to prove?</h2>

              <p>
                Submit evidence that demonstrates how you
                have used a claimed skill.
              </p>
            </div>
          </div>

          {!showForm ? (
            <button
              className="add-proof-button"
              type="button"
              onClick={() => handleOpenForm()}
              disabled={candidateSkills.length === 0}
            >
              <Plus size={16} />
              Add Skill Proof
            </button>
          ) : (
            <form
              className="skill-proof-form"
              onSubmit={handleSubmitProof}
            >
              <div className="skill-proof-form-grid">
                <div className="skill-proof-field">
                  <label htmlFor="skill">
                    Skill
                  </label>

                  <select
                    id="skill"
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">
                      Select a claimed skill
                    </option>

                    {candidateSkills.map((skill) => (
                      <option
                        key={skill}
                        value={skill}
                      >
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="skill-proof-field">
                  <label htmlFor="proofType">
                    Proof Type
                  </label>

                  <select
                    id="proofType"
                    name="proofType"
                    value={formData.proofType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="project">
                      Project
                    </option>

                    <option value="certificate">
                      Certificate
                    </option>

                    <option value="github">
                      GitHub
                    </option>

                    <option value="portfolio">
                      Portfolio
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="skill-proof-field full-width">
                  <label htmlFor="title">
                    Proof Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. PulseHire Recruitment Platform"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={120}
                    required
                  />
                </div>

                <div className="skill-proof-field full-width">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    placeholder="Explain what you built or what this evidence demonstrates."
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={1000}
                    rows={5}
                  />
                </div>

                <div className="skill-proof-field full-width">
                  <label htmlFor="proofUrl">
                    Proof URL
                  </label>

                  <input
                    id="proofUrl"
                    name="proofUrl"
                    type="url"
                    placeholder="https://github.com/yourusername/project"
                    value={formData.proofUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="skill-proof-message error">
                  <XCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="skill-proof-message success">
                  <CheckCircle2 size={16} />
                  {success}
                </div>
              )}

              <div className="skill-proof-form-actions">
                <button
                  type="button"
                  className="skill-proof-cancel"
                  onClick={handleCloseForm}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-proof-button"
                  disabled={
                    submitting ||
                    candidateSkills.length === 0
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Proof"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ===================================================
            PROOF HISTORY
            =================================================== */}

        <section className="proof-history">
          <div className="proof-section-heading">
            <div>
              <span className="panel-label">
                EVIDENCE HISTORY
              </span>

              <h2>Proof you've submitted.</h2>

              <p>
                Track recruiter review status for every piece
                of evidence.
              </p>
            </div>

            <FileCheck2 size={21} />
          </div>

          {loadingProofs ? (
            <div className="proof-empty-state">
              <Clock3 size={20} />

              <div>
                <strong>Loading your evidence...</strong>

                <p>
                  We're retrieving your submitted skill proofs.
                </p>
              </div>
            </div>
          ) : skillProofs.length === 0 ? (
            <div className="proof-empty-state">
              <Upload size={20} />

              <div>
                <strong>No skill proofs submitted yet.</strong>

                <p>
                  Submit your first piece of evidence to start
                  building verified skills.
                </p>
              </div>

              {candidateSkills.length > 0 && (
                <button
                  type="button"
                  className="proof-inline-button"
                  onClick={() => handleOpenForm()}
                >
                  Add Proof
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          ) : (
            <div className="proof-history-list">
              {skillProofs.map((proof) => (
                <article
                  className="proof-history-card"
                  key={proof._id}
                >
                  <div className="proof-history-main">
                    <div className="proof-history-icon">
                      {proof.status === "approved" ? (
                        <CheckCircle2 size={18} />
                      ) : proof.status === "rejected" ? (
                        <XCircle size={18} />
                      ) : (
                        <Clock3 size={18} />
                      )}
                    </div>

                    <div className="proof-history-content">
                      <div className="proof-history-top">
                        <span className="proof-history-skill">
                          {proof.skill}
                        </span>

                        <span
                          className={`proof-status ${proof.status}`}
                        >
                          {getStatusLabel(
                            proof.status,
                          )}
                        </span>
                      </div>

                      <h3>{proof.title}</h3>

                      <p>
                        {proof.description ||
                          "No description provided."}
                      </p>

                      <div className="proof-history-meta">
                        <span>
                          <LinkIcon size={13} />
                          {getProofTypeLabel(
                            proof.proofType,
                          )}
                        </span>

                        {proof.createdAt && (
                          <span>
                            Submitted{" "}
                            {new Date(
                              proof.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {proof.recruiterComment && (
                        <div className="proof-review-comment">
                          <strong>
                            Recruiter feedback
                          </strong>

                          <p>
                            {proof.recruiterComment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {proof.proofUrl && (
                    <a
                      href={proof.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="proof-view-link"
                    >
                      View Evidence
                      <ExternalLink size={13} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            PRINCIPLE
            =================================================== */}

        <section className="proof-principle">
          <div className="proof-principle-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span className="panel-label">
              WHY VERIFICATION MATTERS
            </span>

            <h2>
              A skill becomes a stronger signal when there's
              evidence behind it.
            </h2>

            <p>
              PulseHire doesn't ask recruiters to simply trust
              what candidates write on their resumes. Candidates
              provide evidence, recruiters validate it, and the
              resulting verified skill becomes part of the
              candidate's professional profile.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SkillProof;