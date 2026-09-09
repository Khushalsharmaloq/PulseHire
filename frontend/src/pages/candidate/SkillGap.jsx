import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  FileCheck2,
  LayoutDashboard,
  Lightbulb,
  LoaderCircle,
  LogOut,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const SkillGap = () => {
  const { user, logout } = useAuth();

  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD SKILL GAP DATA
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadSkillGap = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/skill-gap");

        if (!cancelled && response.data?.success) {
          setSkillGapData(response.data);
        }
      } catch (requestError) {
        console.error("Skill gap loading error:", requestError);

        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your skill gap intelligence."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSkillGap();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     SAFE DATA NORMALIZATION
     ========================================================= */

  const readiness = Math.max(
    0,
    Math.min(100, Number(skillGapData?.readiness ?? 0))
  );

  const currentGap = Math.max(
    0,
    Math.min(100, Number(skillGapData?.currentGap ?? 100 - readiness))
  );

  const claimedSkills = Array.isArray(skillGapData?.claimedSkills)
    ? skillGapData.claimedSkills
    : [];

  const verifiedSkills = Array.isArray(skillGapData?.verifiedSkills)
    ? skillGapData.verifiedSkills
    : [];

  const priorityGaps = Array.isArray(skillGapData?.priorityGaps)
    ? skillGapData.priorityGaps
    : [];

  const roleAnalysis = Array.isArray(skillGapData?.roleAnalysis)
    ? skillGapData.roleAnalysis
    : [];

  const rolesAnalysed = Number(skillGapData?.rolesAnalysed ?? 0);

  /* =========================================================
     SKILL SUMMARY
     ========================================================= */

  const skillSummary = useMemo(() => {
    const summary = new Map();

    roleAnalysis.forEach((role) => {
      const requiredSkills = Array.isArray(role?.requiredSkills)
        ? role.requiredSkills
        : [];

      const verified = Array.isArray(role?.verifiedSkills)
        ? role.verifiedSkills
        : [];

      const gaps = Array.isArray(role?.skillGaps)
        ? role.skillGaps
        : [];

      requiredSkills.forEach((rawSkill) => {
        const skill = String(rawSkill || "").trim();

        if (!skill) {
          return;
        }

        const key = skill.toLowerCase();

        if (!summary.has(key)) {
          summary.set(key, {
            skill,
            requiredCount: 0,
            verifiedCount: 0,
            gapCount: 0,
          });
        }

        const item = summary.get(key);

        item.requiredCount += 1;

        const isVerified = verified.some(
          (verifiedSkill) =>
            String(verifiedSkill || "").trim().toLowerCase() === key
        );

        const isGap = gaps.some(
          (gapSkill) =>
            String(gapSkill || "").trim().toLowerCase() === key
        );

        if (isVerified) {
          item.verifiedCount += 1;
        }

        if (isGap) {
          item.gapCount += 1;
        }
      });
    });

    return [...summary.values()]
      .map((item) => ({
        ...item,
        readiness:
          item.requiredCount === 0
            ? 0
            : Math.round(
                (item.verifiedCount / item.requiredCount) * 100
              ),
      }))
      .sort((a, b) => {
        if (a.gapCount > 0 && b.gapCount === 0) {
          return -1;
        }

        if (a.gapCount === 0 && b.gapCount > 0) {
          return 1;
        }

        return b.requiredCount - a.requiredCount;
      });
  }, [roleAnalysis]);

  /* =========================================================
     DISPLAY HELPERS
     ========================================================= */

  const getGapSkill = (gap) => {
    if (typeof gap === "string") {
      return gap;
    }

    return gap?.skill || gap?.name || "Unknown skill";
  };

  const getGapPriority = (gap) => {
    if (typeof gap === "string") {
      return "medium";
    }

    return String(gap?.priority || "medium").toLowerCase();
  };

  const getGapRoleCount = (gap) => {
    if (typeof gap === "string") {
      return 0;
    }

    return Number(gap?.roleCount ?? gap?.rolesCount ?? 0);
  };

  const getGapDemand = (gap) => {
    if (typeof gap === "string") {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        Number(
          gap?.appearsInPercentage ??
            gap?.demandPercentage ??
            gap?.percentage ??
            0
        )
      )
    );
  };

  const getGapReadiness = (gap) => {
    if (typeof gap === "string") {
      return 0;
    }

    return Math.max(
      0,
      Math.min(100, Number(gap?.readiness ?? 0))
    );
  };

  const getGapClaimed = (gap) => {
    if (typeof gap === "string") {
      return claimedSkills.some(
        (skill) =>
          String(skill).trim().toLowerCase() ===
          gap.trim().toLowerCase()
      );
    }

    return Boolean(gap?.claimed);
  };

  const getAvatarInitials = (name) => {
    if (!name) {
      return "CA";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  /* =========================================================
     LOADING STATE
     ========================================================= */

  if (loading) {
    return (
      <div className="candidate-dashboard">
        <main className="candidate-main">
          <div className="skill-gap-loading">
            <LoaderCircle size={30} />

            <h2>Analysing your skill profile...</h2>

            <p>
              PulseHire is comparing your verified capabilities
              with active opportunities.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
     ========================================================= */

  if (error) {
    return (
      <div className="candidate-dashboard">
        <main className="candidate-main">
          <div className="skill-gap-error">
            <Target size={30} />

            <h2>
              Unable to load skill gap intelligence
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="profile-edit-button"
              onClick={() => window.location.reload()}
            >
              Try Again
              <ArrowRight size={13} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
     ========================================================= */

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
              className="sidebar-link"
            >
              <BadgeCheck size={17} />
              Skill Proof
            </Link>

            <Link
              to="/candidate/skill-gap"
              className="sidebar-link active"
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
              {getAvatarInitials(user?.fullname)}
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
            onClick={logout}
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
              SKILL GAP INTELLIGENCE
            </span>

            <h1>
              Know what to improve next.
            </h1>
          </div>
        </header>

        {/* ===================================================
            OVERVIEW
            =================================================== */}

        <section className="gap-hero">
          <div className="gap-hero-content">
            <span className="panel-label">
              YOUR CURRENT READINESS
            </span>

            <h2>
              {readiness >= 80
                ? "You're in a strong position."
                : readiness >= 60
                ? "You're close. Now close the gaps."
                : "Let's strengthen your profile."}
            </h2>

            <p>
              PulseHire compares your verified capabilities
              with the skills commonly required by the roles
              you're targeting.
            </p>

            <div className="readiness-large">
              <div className="readiness-circle">
                <strong>{readiness}%</strong>

                <span>Ready</span>
              </div>

              <div className="readiness-info">
                <strong>
                  {priorityGaps.length === 0
                    ? "No major skill gaps detected."
                    : `${priorityGaps.length} ${
                        priorityGaps.length === 1
                          ? "skill is"
                          : "skills are"
                      } holding you back.`}
                </strong>

                <span>
                  {priorityGaps.length === 0
                    ? "Keep adding strong evidence to maintain your hiring readiness."
                    : "Improve these areas to increase your match with relevant opportunities."}
                </span>

                <div className="readiness-bar">
                  <div
                    className="readiness-bar-fill"
                    style={{
                      width: `${readiness}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="gap-hero-side">
            <div className="gap-hero-stat">
              <Target size={18} />

              <div>
                <span>CURRENT GAP</span>

                <strong>{currentGap}%</strong>
              </div>
            </div>

            <div className="gap-hero-stat">
              <TrendingUp size={18} />

              <div>
                <span>VERIFIED SKILLS</span>

                <strong>
                  {verifiedSkills.length}
                </strong>
              </div>
            </div>

            <div className="gap-hero-stat">
              <BadgeCheck size={18} />

              <div>
                <span>CLAIMED SKILLS</span>

                <strong>
                  {claimedSkills.length}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PRIORITY GAPS
            =================================================== */}

        <section className="gap-priority-section">
          <div className="gap-section-heading">
            <div>
              <span className="panel-label">
                PRIORITY GAPS
              </span>

              <h2>
                Skills worth improving first.
              </h2>
            </div>
          </div>

          <div className="gap-cards">
            {priorityGaps.length > 0 ? (
              priorityGaps.slice(0, 4).map((gap, index) => {
                const skill = getGapSkill(gap);
                const priority = getGapPriority(gap);
                const roleCount = getGapRoleCount(gap);
                const demand = getGapDemand(gap);
                const gapReadiness = getGapReadiness(gap);
                const claimed = getGapClaimed(gap);

                return (
                  <article
                    className={`gap-card-large ${
                      priority === "high"
                        ? "priority"
                        : ""
                    }`}
                    key={`${skill}-${index}`}
                  >
                    <div className="gap-card-top">
                      <div className="gap-card-icon">
                        <Code2 size={19} />
                      </div>

                      <span
                        className={`gap-priority ${
                          priority === "high"
                            ? ""
                            : "medium"
                        }`}
                      >
                        {priority === "high"
                          ? "HIGH PRIORITY"
                          : "MEDIUM PRIORITY"}
                      </span>
                    </div>

                    <h3>{skill}</h3>

                    <p>
                      {claimed
                        ? `You claim ${skill}, but stronger evidence can increase recruiter confidence.`
                        : `${skill} is required by roles relevant to your profile and is not yet demonstrated.`}
                    </p>

                    <div className="gap-card-readiness">
                      <div>
                        <span>
                          YOUR READINESS
                        </span>

                        <strong>
                          {gapReadiness}%
                        </strong>
                      </div>

                      <div className="gap-card-bar">
                        <div
                          className="gap-card-bar-fill"
                          style={{
                            width: `${gapReadiness}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="gap-card-footer">
                      <span>
                        <BarChart3 size={12} />

                        {roleCount > 0
                          ? `Appears in ${roleCount} ${
                              roleCount === 1
                                ? "active role"
                                : "active roles"
                            }`
                          : demand > 0
                          ? `${demand}% role demand`
                          : "Priority skill gap"}
                      </span>

                      <Link to="/candidate/learning">
                        Learn
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              <article className="gap-card-large">
                <div className="gap-card-top">
                  <div className="gap-card-icon">
                    <CheckCircle2 size={19} />
                  </div>
                </div>

                <h3>
                  No major gaps detected
                </h3>

                <p>
                  There are currently no high-impact
                  skill gaps across the roles PulseHire
                  analysed.
                </p>

                <div className="gap-card-footer">
                  <span>
                    <BadgeCheck size={12} />
                    Keep building verified evidence
                  </span>

                  <Link to="/candidate/skill-proof">
                    Prove skills
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            )}
          </div>
        </section>

        {/* ===================================================
            ROLE ANALYSIS
            =================================================== */}

        <section className="gap-role-panel">
          <div className="gap-role-header">
            <div>
              <span className="panel-label">
                ROLE-BASED ANALYSIS
              </span>

              <h2>
                What your target roles are asking for.
              </h2>
            </div>

            <span className="role-count">
              {rolesAnalysed}{" "}
              {rolesAnalysed === 1
                ? "role"
                : "roles"}{" "}
              analysed
            </span>
          </div>

          <div className="role-analysis-grid">
            {skillSummary.length > 0 ? (
              skillSummary.slice(0, 8).map((item) => {
                const isVerified =
                  item.verifiedCount > 0 &&
                  item.gapCount === 0;

                const isMissing =
                  item.verifiedCount === 0;

                return (
                  <div
                    className={`role-analysis-item ${
                      isVerified
                        ? "verified"
                        : isMissing
                        ? "missing"
                        : "warning"
                    }`}
                    key={item.skill}
                  >
                    <div className="role-analysis-icon">
                      {isVerified ? (
                        <CheckCircle2 size={16} />
                      ) : isMissing ? (
                        <Target size={16} />
                      ) : (
                        <Clock3 size={16} />
                      )}
                    </div>

                    <div>
                      <strong>
                        {item.skill}
                      </strong>

                      <span>
                        {isVerified
                          ? "Strong verified capability"
                          : isMissing
                          ? "Not demonstrated yet"
                          : "Needs improvement"}
                      </span>
                    </div>

                    <small>
                      {item.readiness}%
                    </small>
                  </div>
                );
              })
            ) : (
              <div className="role-analysis-item missing">
                <div className="role-analysis-icon">
                  <Target size={16} />
                </div>

                <div>
                  <strong>
                    No role data yet
                  </strong>

                  <span>
                    Active jobs are required for role
                    analysis.
                  </span>
                </div>

                <small>—</small>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            IMPROVEMENT PLAN
            =================================================== */}

        <section className="improvement-panel">
          <div className="improvement-header">
            <div className="improvement-icon">
              <Lightbulb size={20} />
            </div>

            <div>
              <span className="panel-label">
                RECOMMENDED PATH
              </span>

              <h2>
                A practical path to close your gaps.
              </h2>

              <p>
                You don't need to learn everything.
                Focus on the skills with the highest
                impact on your target roles.
              </p>
            </div>
          </div>

          <div className="improvement-steps">
            {priorityGaps.length > 0 ? (
              priorityGaps
                .slice(0, 3)
                .map((gap, index) => {
                  const skill = getGapSkill(gap);
                  const claimed = getGapClaimed(gap);

                  return (
                    <div
                      className="improvement-step"
                      key={`${skill}-step`}
                    >
                      <div className="step-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div>
                        <strong>
                          {claimed
                            ? `Strengthen ${skill} evidence`
                            : `Improve ${skill}`}
                        </strong>

                        <span>
                          {claimed
                            ? `Build stronger evidence for ${skill} and get it verified.`
                            : `Develop ${skill} through focused learning and practical work.`}
                        </span>
                      </div>

                      <Link
                        to={
                          claimed
                            ? "/candidate/skill-proof"
                            : "/candidate/learning"
                        }
                      >
                        {claimed
                          ? "Prove"
                          : "Learn"}

                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  );
                })
            ) : (
              <div className="improvement-step">
                <div className="step-number">
                  ✓
                </div>

                <div>
                  <strong>
                    Keep strengthening your evidence
                  </strong>

                  <span>
                    Your current profile has no major
                    skill gaps across the analysed roles.
                  </span>
                </div>

                <Link to="/candidate/skill-proof">
                  Prove
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            PRINCIPLE
            =================================================== */}

        <section className="gap-principle">
          <div className="gap-principle-icon">
            <Target size={21} />
          </div>

          <div>
            <span className="panel-label">
              THE PULSEHIRE APPROACH
            </span>

            <h2>
              Don't learn more. Learn what matters.
            </h2>

            <p>
              PulseHire identifies the difference between
              your current verified capabilities and the
              skills required by your target opportunities.
              The goal isn't to collect courses — it's to
              close meaningful skill gaps and turn improvement
              into stronger evidence.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SkillGap;