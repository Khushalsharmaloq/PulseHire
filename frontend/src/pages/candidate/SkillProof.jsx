import { useEffect, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  Target,
  Upload,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const SkillProof = () => {
  const { user } = useAuth();

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

  const candidateSkills = user?.profile?.skills || [];
  const approvedSkills = new Set(
    skillProofs
      .filter((proof) => proof.status === "approved")
      .map((proof) => proof.skill.toLowerCase()),
  );

  const pendingProofCount = skillProofs.filter(
    (proof) => proof.status === "pending",
  ).length;

  const needsProofCount = candidateSkills.filter(
    (skill) =>
      !skillProofs.some(
        (proof) => proof.skill.toLowerCase() === skill.toLowerCase(),
      ),
  ).length;

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
          error.response?.data?.message || "Unable to load your skill proofs.",
        );
      } finally {
        setLoadingProofs(false);
      }
    };

    fetchSkillProofs();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleOpenForm = () => {
    setError("");
    setSuccess("");

    setFormData({
      skill: candidateSkills[0] || "",
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
      setError("Please select a skill to prove.");
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
        setSkillProofs((previousProofs) => [
          response.data.skillProof,
          ...previousProofs,
        ]);

        setSuccess(
          "Skill proof submitted successfully and is now pending review.",
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
        error.response?.data?.message || "Unable to submit your skill proof.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="candidate-dashboard">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="candidate-sidebar">
        <div className="dashboard-brand">
          <Link to="/candidate/dashboard" className="dashboard-brand">
            <div className="dashboard-brand-icon">
              <BriefcaseBusiness size={19} />
            </div>

            <span>PulseHire</span>
          </Link>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">CANDIDATE WORKSPACE</span>

          <nav className="sidebar-nav">
            <Link to="/candidate/dashboard" className="sidebar-link">
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link to="/candidate/profile" className="sidebar-link">
              <User size={17} />
              My Profile
            </Link>

            <Link to="/candidate/skill-proof" className="sidebar-link active">
              <BadgeCheck size={17} />
              Skill Proof
            </Link>

            <Link to="/candidate/skill-gap" className="sidebar-link">
              <Target size={17} />
              Skill Gap
            </Link>

            <Link to="/candidate/learning" className="sidebar-link">
              <BookOpen size={17} />
              Learning
            </Link>

            <Link to="/candidate/jobs" className="sidebar-link">
              <BriefcaseBusiness size={17} />
              Find Jobs
            </Link>

            <Link to="/candidate/applications" className="sidebar-link">
              <FileCheck2 size={17} />
              Applications
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">AK</div>

            <div>
              <strong>Arjun Kumar</strong>

              <span>Candidate</span>
            </div>
          </div>

          <button className="logout-button" type="button">
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
            <span className="dashboard-eyebrow">SKILL PROOF</span>

            <h1>Prove what you can actually do.</h1>
          </div>
        </header>

        {/* ===================================================
            INTRO
            =================================================== */}

        <section className="proof-intro">
          <div>
            <span className="panel-label">EVIDENCE-BACKED SKILLS</span>

            <h2>Turn your skills into trusted signals.</h2>

            <p>
              Submit projects, certificates, portfolios, assessments and other
              evidence that helps recruiters understand what you can actually
              do.
            </p>
          </div>

          <div className="proof-trust">
            <ShieldCheck size={18} />

            <div>
              <strong>Your evidence matters.</strong>

              <span>Recruiters can validate submitted proof.</span>
            </div>
          </div>
        </section>

        {/* ===================================================
            VERIFICATION SUMMARY
            =================================================== */}

        <section className="proof-summary">
          <div className="proof-summary-card">
            <span>VERIFIED</span>

            <strong>{approvedSkills.size}</strong>

            <small>skills recruiters validated</small>
          </div>

          <div className="proof-summary-card">
            <span>PENDING</span>

            <strong>{pendingProofCount}</strong>

            <small>proof awaiting review</small>
          </div>

          <div className="proof-summary-card">
            <span>NEEDS PROOF</span>

            <strong>{needsProofCount}</strong>

            <small>skill without evidence</small>
          </div>

          <button
            className="add-proof-button"
            type="button"
            onClick={handleOpenForm}
            disabled={candidateSkills.length === 0}
          >
            <Plus size={16} />
            Add Skill Proof
          </button>
        </section>
        {/* ===================================================
            SKILL PROOF LIST
            =================================================== */}

<section className="proof-section">
  <div className="proof-section-header">
    <div>
      <span className="panel-label">
        YOUR EVIDENCE
      </span>

      <h2>
        Skills and their proof.
      </h2>
    </div>
  </div>

  {loadingProofs ? (
    <div className="proof-empty-state">
      <p>Loading your skill proofs...</p>
    </div>
  ) : skillProofs.length === 0 ? (
    <div className="proof-empty-state">
      <BadgeCheck size={28} />

      <h3>
        No skill proof submitted yet.
      </h3>

      <p>
        Submit evidence for one of your claimed skills
        to start building verified signals.
      </p>

      <button
        className="add-proof-button"
        type="button"
        onClick={handleOpenForm}
        disabled={candidateSkills.length === 0}
      >
        <Plus size={16} />
        Add Skill Proof
      </button>
    </div>
  ) : (
    <div className="proof-list">
      {skillProofs.map((proof) => {
        const statusLabel =
          proof.status === "approved"
            ? "Verified"
            : proof.status === "rejected"
              ? "Rejected"
              : "Pending Review";

        const statusClass =
          proof.status === "approved"
            ? "verified"
            : proof.status === "rejected"
              ? "missing"
              : "pending";

        const formattedDate = proof.createdAt
          ? new Date(proof.createdAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )
          : "";

        return (
          <article
            className={`proof-card ${proof.status === "pending" ? "pending-proof" : ""}`}
            key={proof._id}
          >
            <div className="proof-card-header">
              <div className={`proof-skill-icon ${statusClass}`}>
                {proof.status === "approved" ? (
                  <BadgeCheck size={18} />
                ) : proof.status === "pending" ? (
                  <Clock3 size={18} />
                ) : (
                  <Target size={18} />
                )}
              </div>

              <div>
                <div className="proof-skill-name">
                  <h3>
                    {proof.skill}
                  </h3>

                  <span
                    className={`proof-status ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <p>
                  {proof.status === "approved"
                    ? "Recruiter validated"
                    : proof.status === "rejected"
                      ? "Recruiter requested changes"
                      : "Submitted · Waiting for recruiter validation"}
                </p>
              </div>
            </div>

            <div className="proof-evidence">
              <div className="evidence-icon">
                {proof.proofType === "github" ||
                proof.proofType === "project" ? (
                  <Code2 size={17} />
                ) : (
                  <FileCheck2 size={17} />
                )}
              </div>

              <div className="evidence-info">
                <strong>
                  {proof.title}
                </strong>

                <span>
                  {proof.proofType.charAt(0).toUpperCase() +
                    proof.proofType.slice(1)}
                  {formattedDate
                    ? ` · Submitted ${formattedDate}`
                    : ""}
                </span>
              </div>

              {proof.proofUrl && (
                <a
                  href={proof.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                  <ArrowRight size={12} />
                </a>
              )}
            </div>

            {proof.description && (
              <div className="proof-description">
                {proof.description}
              </div>
            )}

            <div
              className={`proof-footer ${
                proof.status === "pending" ? "pending" : ""
              }`}
            >
              <span>
                {proof.status === "approved" ? (
                  <>
                    <CheckCircle2 size={12} />
                    Evidence accepted
                  </>
                ) : proof.status === "pending" ? (
                  <>
                    <Clock3 size={12} />
                    Awaiting review
                  </>
                ) : (
                  <>
                    <Target size={12} />
                    Review required
                  </>
                )}
              </span>

              {proof.status === "approved" ? (
                <span>
                  Recruiter validation complete
                </span>
              ) : proof.status === "rejected" ? (
                <span>
                  {proof.recruiterComment ||
                    "Please review your submitted evidence."}
                </span>
              ) : (
                <span>
                  Your proof is being reviewed
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  )}
</section>

        <section className="add-proof-panel">
          <div className="add-proof-heading">
            <div className="add-proof-large-icon">
              <Upload size={20} />
            </div>

            <div>
              <span className="panel-label">ADD NEW EVIDENCE</span>

              <h2>What would you like to prove?</h2>

              <p>
                Submit evidence that demonstrates how you have used a claimed
                skill.
              </p>
            </div>
          </div>

          {!showForm ? (
            <>
              {candidateSkills.length === 0 && (
                <div className="skill-proof-message error">
                  Add at least one claimed skill to your profile before
                  submitting skill proof.
                </div>
              )}

              <button
                className="add-proof-button"
                type="button"
                onClick={handleOpenForm}
                disabled={candidateSkills.length === 0}
              >
                <Plus size={16} />
                Add Skill Proof
              </button>
            </>
          ) : (
            <form className="skill-proof-form" onSubmit={handleSubmitProof}>
              <div className="skill-proof-form-grid">
                <div className="skill-proof-field">
                  <label htmlFor="skill">Skill</label>

                  <select
                    id="skill"
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a claimed skill</option>

                    {candidateSkills.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="skill-proof-field">
                  <label htmlFor="proofType">Proof Type</label>

                  <select
                    id="proofType"
                    name="proofType"
                    value={formData.proofType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="project">Project</option>

                    <option value="certificate">Certificate</option>

                    <option value="github">GitHub</option>

                    <option value="portfolio">Portfolio</option>

                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="skill-proof-field full-width">
                  <label htmlFor="title">Proof Title</label>

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
                  <label htmlFor="description">Description</label>

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
                  <label htmlFor="proofUrl">Proof URL</label>

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
                <div className="skill-proof-message error">{error}</div>
              )}

              {success && (
                <div className="skill-proof-message success">{success}</div>
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
                  disabled={submitting || candidateSkills.length === 0}
                >
                  {submitting ? "Submitting..." : "Submit Proof"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ===================================================
            IMPORTANT MESSAGE
            =================================================== */}

        <section className="proof-principle">
          <div className="proof-principle-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span className="panel-label">WHY VERIFICATION MATTERS</span>

            <h2>
              A skill becomes a stronger signal when there's evidence behind it.
            </h2>

            <p>
              PulseHire doesn't ask recruiters to simply trust what candidates
              write on their resumes. Candidates provide evidence, recruiters
              validate it, and the resulting verified skill becomes part of the
              candidate's professional profile.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

/* Small local icon used for the Docker card */

export default SkillProof;
