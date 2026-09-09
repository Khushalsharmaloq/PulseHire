import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  Lightbulb,
  LogOut,
  PlayCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../context/useAuth";

const Learning = () => {
  const { user, logout } = useAuth();

  const [resources, setResources] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [skillGapData, setSkillGapData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingResourceId, setUpdatingResourceId] = useState(null);
  const [error, setError] = useState("");

  /*
   * =========================================================
   * LOAD LEARNING DATA
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadLearningData = async () => {
      setLoading(true);
      setError("");

      try {
        const [resourcesResponse, progressResponse, skillGapResponse] =
          await Promise.all([
            api.get("/learning/resources"),
            api.get("/learning/progress"),
            api.get("/skill-gap").catch(() => null),
          ]);

        if (cancelled) return;

        setResources(resourcesResponse.data?.resources || []);
        setProgressRecords(progressResponse.data?.progress || []);

        if (skillGapResponse?.data?.success) {
          setSkillGapData(skillGapResponse.data);
        }
      } catch (requestError) {
        console.error("Learning page load error:", requestError);

        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your learning data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLearningData();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const getResourceProgress = useCallback(
  (resourceId) => {
    const record = progressRecords.find(
      (item) =>
        item.resource?._id === resourceId ||
        item.resource === resourceId
    );

    return record?.progressPercent || 0;
  },
  [progressRecords]
);

const getResourceStatus = useCallback(
  (resourceId) => {
    const record = progressRecords.find(
      (item) =>
        item.resource?._id === resourceId ||
        item.resource === resourceId
    );

    if (!record) {
      return "not_started";
    }

    return record.status || "not_started";
  },
  [progressRecords]
);

  const formatDuration = (minutes) => {
    const totalMinutes = Number(minutes) || 0;

    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case "documentation":
        return BookOpen;

      case "project":
        return BriefcaseBusiness;

      case "practice":
        return Target;

      case "video":
        return PlayCircle;

      case "tutorial":
        return Code2;

      default:
        return BookOpen;
    }
  };

  const getResourceAction = (resourceId) => {
    const progress = getResourceProgress(resourceId);
    const status = getResourceStatus(resourceId);

    if (status === "completed" || progress === 100) {
      return "Completed";
    }

    if (progress > 0) {
      return "Continue Learning";
    }

    return "Start Learning";
  };

  /*
   * =========================================================
   * SKILL GAP INFORMATION
   * =========================================================
   */

  const priorityGaps = useMemo(() => {
    const gaps =
      skillGapData?.priorityGaps ||
      skillGapData?.prioritySkillGaps ||
      skillGapData?.gaps ||
      [];

    if (!Array.isArray(gaps)) {
      return [];
    }

    return gaps
      .map((gap) => {
        if (typeof gap === "string") {
          return gap;
        }

        return (
          gap?.skill ||
          gap?.skillName ||
          gap?.name ||
          gap?.title ||
          ""
        );
      })
      .filter(Boolean);
  }, [skillGapData]);

  /*
   * =========================================================
   * RECOMMENDED RESOURCES
   * =========================================================
   */

  const recommendedResources = useMemo(() => {
    if (!resources.length) {
      return [];
    }

    if (!priorityGaps.length) {
      return resources;
    }

    const normalizedGaps = priorityGaps.map((skill) =>
      skill.toLowerCase().trim()
    );

    const matching = resources.filter((resource) =>
      normalizedGaps.includes(String(resource.skill || "").toLowerCase().trim())
    );

    /*
     * If the skill-gap endpoint doesn't return matching
     * resources, don't show an empty learning page.
     *
     * Fall back to all active resources.
     */
    return matching.length ? matching : resources;
  }, [resources, priorityGaps]);

  /*
   * =========================================================
   * PROGRESS CALCULATIONS
   * =========================================================
   */

  const completedCount = useMemo(() => {
    return resources.filter((resource) => {
      return getResourceProgress(resource._id) === 100;
    }).length;
  }, [resources, progressRecords]);

  const overallProgress = useMemo(() => {
    if (!resources.length) {
      return 0;
    }

    const totalProgress = resources.reduce((total, resource) => {
      return total + getResourceProgress(resource._id);
    }, 0);

    return Math.round(totalProgress / resources.length);
  }, [resources, progressRecords]);

  const inProgressCount = useMemo(() => {
    return resources.filter((resource) => {
      const progress = getResourceProgress(resource._id);

      return progress > 0 && progress < 100;
    }).length;
  }, [resources, progressRecords]);

  /*
   * =========================================================
   * CURRENT LEARNING PATH
   * =========================================================
   */

  const currentResource = useMemo(() => {
    const inProgressResource = resources.find((resource) => {
      const progress = getResourceProgress(resource._id);

      return progress > 0 && progress < 100;
    });

    if (inProgressResource) {
      return inProgressResource;
    }

    return recommendedResources.find(
      (resource) => getResourceProgress(resource._id) < 100
    );
  }, [resources, recommendedResources, progressRecords]);

  /*
   * =========================================================
   * UPDATE PROGRESS
   * =========================================================
   */

  const updateProgress = async (resource, newProgress) => {
    if (!resource?._id) {
      return;
    }

    try {
      setUpdatingResourceId(resource._id);
      setError("");

      const response = await api.put("/learning/progress", {
        resourceId: resource._id,
        progressPercent: newProgress,
      });

      const updatedProgress = response.data?.progress;

      if (updatedProgress) {
        setProgressRecords((previousRecords) => {
          const existingIndex = previousRecords.findIndex(
            (item) =>
              item.resource?._id === resource._id ||
              item.resource === resource._id
          );

          if (existingIndex === -1) {
            return [updatedProgress, ...previousRecords];
          }

          const updatedRecords = [...previousRecords];
          updatedRecords[existingIndex] = updatedProgress;

          return updatedRecords;
        });
      }
    } catch (requestError) {
      console.error("Learning progress update error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Unable to update learning progress."
      );
    } finally {
      setUpdatingResourceId(null);
    }
  };

  const handleCompleteLearning = async (resource) => {
    await updateProgress(resource, 100);
  };

  const handleOpenResource = async (resource) => {
    const currentProgress = getResourceProgress(resource._id);

    /*
     * Opening a resource does not automatically mark it
     * completed. We only record that learning has started.
     */
    if (currentProgress === 0) {
      await updateProgress(resource, 1);
    }

    if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  /*
   * =========================================================
   * USER DISPLAY
   * =========================================================
   */

  const userName = user?.fullname || "Candidate";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  if (loading) {
    return (
      <div className="candidate-dashboard">
        <main className="candidate-main">
          <div className="auth-loading-screen">
            <p>Loading your learning path...</p>
          </div>
        </main>
      </div>
    );
  }

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div className="candidate-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="candidate-sidebar">

        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <span>PulseHire</span>
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

            <Link
              to="/candidate/skill-proof"
              className="sidebar-link"
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
              className="sidebar-link active"
            >
              <BookOpen size={17} />
              Learning
            </Link>

          </nav>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              {userInitials || "C"}
            </div>

            <div>
              <strong>{userName}</strong>

              <span>
                Candidate
              </span>
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
              TARGETED LEARNING
            </span>

            <h1>
              Learn what moves your profile forward.
            </h1>

          </div>

        </header>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* ===================================================
            LEARNING HERO
        =================================================== */}

        <section className="learning-hero">

          <div className="learning-hero-content">

            <span className="panel-label">
              YOUR RECOMMENDED PATH
            </span>

            <h2>
              Don't learn everything.
              <br />
              Learn what matters.
            </h2>

            <p>
              These resources are selected around the skill
              gaps detected in your profile and the roles
              you're targeting.
            </p>

            <div className="learning-progress">

              <div className="learning-progress-heading">

                <span>
                  Improvement progress
                </span>

                <strong>
                  {overallProgress}%
                </strong>

              </div>

              <div className="learning-progress-bar">

                <div
                  className="learning-progress-fill"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                ></div>

              </div>

              <span className="learning-progress-note">
                {completedCount} of {resources.length} learning
                resources completed
              </span>

            </div>

          </div>

          <div className="learning-hero-stats">

            <div>
              <Target size={17} />

              <span>
                Priority gaps
              </span>

              <strong>
                {priorityGaps.length}
              </strong>
            </div>

            <div>
              <BookOpen size={17} />

              <span>
                Resources
              </span>

              <strong>
                {resources.length}
              </strong>
            </div>

            <div>
              <TrendingUp size={17} />

              <span>
                In progress
              </span>

              <strong>
                {inProgressCount}
              </strong>
            </div>

          </div>

        </section>

        {/* ===================================================
            CURRENT PATH
        =================================================== */}

        <section className="learning-section">

          <div className="learning-section-heading">

            <div>

              <span className="panel-label">
                YOUR CURRENT PATH
              </span>

              <h2>
                Close your highest-impact gaps.
              </h2>

            </div>

          </div>

          {currentResource ? (

            <article className="learning-path-card active">

              <div className="learning-step-number">
                01
              </div>

              <div className="learning-path-icon">

                {(() => {
                  const Icon = getResourceIcon(
                    currentResource.resourceType
                  );

                  return <Icon size={18} />;
                })()}

              </div>

              <div className="learning-path-content">

                <div className="learning-path-title">

                  <h3>
                    {currentResource.title}
                  </h3>

                  <span className="learning-current">
                    {getResourceProgress(currentResource._id) > 0
                      ? "In Progress"
                      : "Recommended"}
                  </span>

                </div>

                <p>
                  {currentResource.description ||
                    `Improve your ${currentResource.skill} skills with this focused learning resource.`}
                </p>

                <div className="learning-meta">

                  <span>
                    <Clock3 size={11} />

                    {formatDuration(
                      currentResource.durationMinutes
                    )}
                  </span>

                  <span>
                    {currentResource.difficulty || "Intermediate"}
                  </span>

                  <span>
                    {currentResource.skill}
                  </span>

                </div>

                <div className="learning-card-progress">

                  <div>

                    <span>
                      Progress
                    </span>

                    <strong>
                      {getResourceProgress(currentResource._id)}%
                    </strong>

                  </div>

                  <div className="small-progress">

                    <div
                      style={{
                        width: `${getResourceProgress(
                          currentResource._id
                        )}%`,
                      }}
                    ></div>

                  </div>

                </div>

                <div className="learning-actions">

                  <button
                    type="button"
                    className="learning-action-button"
                    disabled={
                      updatingResourceId === currentResource._id
                    }
                    onClick={() =>
                      handleOpenResource(currentResource)
                    }
                  >
                    {getResourceAction(currentResource._id)}

                    <ArrowRight size={13} />
                  </button>

                  {getResourceProgress(
                    currentResource._id
                  ) < 100 && (

                    <button
                      type="button"
                      className="learning-action-button secondary"
                      disabled={
                        updatingResourceId ===
                        currentResource._id
                      }
                      onClick={() =>
                        handleCompleteLearning(
                          currentResource
                        )
                      }
                    >
                      <CheckCircle2 size={13} />

                      Mark Complete
                    </button>

                  )}

                </div>

              </div>

            </article>

          ) : (

            <div className="learning-empty-state">

              <BookOpen size={25} />

              <h3>
                Your learning path is ready to grow.
              </h3>

              <p>
                No learning resource is currently available.
                Add resources from the backend to begin.
              </p>

            </div>

          )}

        </section>

        {/* ===================================================
            RECOMMENDED RESOURCES
        =================================================== */}

        <section className="resources-section">

          <div className="learning-section-heading">

            <div>

              <span className="panel-label">
                RECOMMENDED RESOURCES
              </span>

              <h2>
                Resources matched to your gaps.
              </h2>

            </div>

            <span className="resource-count">
              {recommendedResources.length} resources found
            </span>

          </div>

          <div className="resource-grid">

            {recommendedResources.map((resource) => {

              const Icon = getResourceIcon(
                resource.resourceType
              );

              const progress = getResourceProgress(
                resource._id
              );

              const status = getResourceStatus(
                resource._id
              );

              return (

                <article
                  className="resource-card"
                  key={resource._id}
                >

                  <div className="resource-top">

                    <div className="resource-icon">
                      <Icon size={17} />
                    </div>

                    <span>
                      {String(
                        resource.skill || "LEARNING"
                      ).toUpperCase()}
                    </span>

                  </div>

                  <h3>
                    {resource.title}
                  </h3>

                  <p>
                    {resource.description ||
                      `Build practical ${resource.skill} knowledge.`}
                  </p>

                  <div className="learning-card-progress">

                    <div>

                      <span>
                        Progress
                      </span>

                      <strong>
                        {progress}%
                      </strong>

                    </div>

                    <div className="small-progress">

                      <div
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                  <div className="resource-bottom">

                    <span>
                      <Clock3 size={11} />

                      {formatDuration(
                        resource.durationMinutes
                      )}
                    </span>

                    {status === "completed" ? (

                      <span className="learning-resource-completed">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>

                    ) : (

                      <button
                        type="button"
                        className="resource-open-button"
                        disabled={
                          updatingResourceId === resource._id
                        }
                        onClick={() =>
                          handleOpenResource(resource)
                        }
                      >
                        {progress > 0
                          ? "Continue"
                          : "Open"}

                        <ArrowRight size={11} />
                      </button>

                    )}

                  </div>

                </article>

              );
            })}

          </div>

        </section>

        {/* ===================================================
            LEARNING PRINCIPLE
        =================================================== */}

        <section className="learning-principle">

          <div className="learning-principle-icon">
            <Lightbulb size={21} />
          </div>

          <div>

            <span className="panel-label">
              LEARNING WITH PURPOSE
            </span>

            <h2>
              Every recommendation should lead somewhere.
            </h2>

            <p>
              PulseHire connects learning to measurable
              improvement. Complete a resource, strengthen
              a skill, build evidence, get it validated,
              and improve your readiness for real opportunities.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Learning;