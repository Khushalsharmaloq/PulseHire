import { useEffect, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Code2,
  FileText,
  GraduationCap,
  LoaderCircle,
  Target,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getSkillGap } from "../../services/skills.api";

import {
  getLearningProgress,
  getLearningResources,
  updateLearningProgress,
} from "../../services/learning.api";

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeSkill = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const clampProgress = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
};

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
  const type = String(resourceType || "").toLowerCase();

  switch (type) {
    case "project":
      return BriefcaseBusiness;

    case "practice":
      return Target;

    case "video":
      return BookOpen;

    case "tutorial":
      return Code2;

    case "certificate":
      return FileText;

    default:
      return BookOpen;
  }
};

const getProgressRecord = (progressRecords, resourceId) => {
  return (
    progressRecords.find(
      (record) =>
        record?.resource?._id === resourceId || record?.resource === resourceId,
    ) || null
  );
};

const getResourceProgress = (progressRecords, resourceId) => {
  const record = getProgressRecord(progressRecords, resourceId);

  return clampProgress(record?.progressPercent);
};

const getResourceStatus = (progressRecords, resourceId) => {
  const record = getProgressRecord(progressRecords, resourceId);

  return record?.status || "not_started";
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Learning = () => {
  const [resources, setResources] = useState([]);

  const [progressRecords, setProgressRecords] = useState([]);

  const [skillGapData, setSkillGapData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingResourceId, setUpdatingResourceId] = useState(null);

  const [selectedSkill, setSelectedSkill] = useState("all");

  /* =======================================================
     LOAD
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadLearningData = async () => {
      try {
        setLoading(true);
        setError("");

        const [resourcesResponse, progressResponse, skillGapResponse] =
          await Promise.all([
            getLearningResources(),
            getLearningProgress(),
            getSkillGap().catch(() => null),
          ]);

        if (cancelled) {
          return;
        }

        if (!resourcesResponse?.success) {
          throw new Error(
            resourcesResponse?.message || "Unable to load learning resources.",
          );
        }

        setResources(
          Array.isArray(resourcesResponse.resources)
            ? resourcesResponse.resources
            : [],
        );

        setProgressRecords(
          Array.isArray(progressResponse?.progress)
            ? progressResponse.progress
            : [],
        );

        if (skillGapResponse?.success) {
          setSkillGapData(skillGapResponse);
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Learning page load error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load your learning workspace.",
        );
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

  /* =======================================================
     SKILL GAP DATA
     ======================================================= */

  const priorityGaps = Array.isArray(skillGapData?.priorityGaps)
    ? skillGapData.priorityGaps
    : [];

  const prioritySkills = priorityGaps
    .map((gap) => (typeof gap === "string" ? gap : gap?.skill))
    .filter(Boolean);

  /* =======================================================
     SKILLS AVAILABLE FOR FILTER
     ======================================================= */

  const resourceSkills = [
    ...new Map(
      resources.map((resource) => {
        const skill = String(resource?.skill || "").trim();

        return [normalizeSkill(skill), skill];
      }),
    ).values(),
  ];

  /* =======================================================
     RECOMMENDED RESOURCES
     ======================================================= */

  const recommendedResources =
    prioritySkills.length === 0
      ? resources
      : resources.filter((resource) =>
          prioritySkills.some(
            (skill) =>
              normalizeSkill(skill) === normalizeSkill(resource?.skill),
          ),
        );

  /* =======================================================
     FILTERED RESOURCES
     ======================================================= */

  const filteredResources =
    selectedSkill === "all"
      ? resources
      : resources.filter(
          (resource) =>
            normalizeSkill(resource?.skill) === normalizeSkill(selectedSkill),
        );

  /* =======================================================
     PROGRESS METRICS
     ======================================================= */

  const completedCount = resources.filter(
    (resource) => getResourceProgress(progressRecords, resource?._id) === 100,
  ).length;

  const inProgressCount = resources.filter((resource) => {
    const progress = getResourceProgress(progressRecords, resource?._id);

    return progress > 0 && progress < 100;
  }).length;

  const overallProgress =
    resources.length === 0
      ? 0
      : Math.round(
          resources.reduce(
            (total, resource) =>
              total + getResourceProgress(progressRecords, resource?._id),
            0,
          ) / resources.length,
        );

  /* =======================================================
     CURRENT RESOURCE
     ======================================================= */

  const currentResource =
    resources.find((resource) => {
      const progress = getResourceProgress(progressRecords, resource?._id);

      return progress > 0 && progress < 100;
    }) ||
    recommendedResources.find(
      (resource) => getResourceProgress(progressRecords, resource?._id) < 100,
    ) ||
    null;

  /* =======================================================
     PROGRESS UPDATE
     ======================================================= */

  const updateResourceProgress = async (resource, newProgress) => {
    if (!resource?._id) {
      return false;
    }

    const resourceId = resource._id;

    const progress = clampProgress(newProgress);

    try {
      setUpdatingResourceId(resourceId);

      setError("");

      const response = await updateLearningProgress(resourceId, progress);

      const updatedProgress = response?.progress;

      if (updatedProgress) {
        setProgressRecords((previousRecords) => {
          const existingIndex = previousRecords.findIndex(
            (record) =>
              record?.resource?._id === resourceId ||
              record?.resource === resourceId,
          );

          if (existingIndex === -1) {
            return [updatedProgress, ...previousRecords];
          }

          const nextRecords = [...previousRecords];

          nextRecords[existingIndex] = updatedProgress;

          return nextRecords;
        });
      } else {
        setProgressRecords((previousRecords) => {
          const existingIndex = previousRecords.findIndex(
            (record) =>
              record?.resource?._id === resourceId ||
              record?.resource === resourceId,
          );

          if (existingIndex === -1) {
            return previousRecords;
          }

          const nextRecords = [...previousRecords];

          nextRecords[existingIndex] = {
            ...nextRecords[existingIndex],
            progressPercent: progress,
            status:
              progress === 100
                ? "completed"
                : progress > 0
                  ? "in_progress"
                  : "not_started",
          };

          return nextRecords;
        });
      }

      return true;
    } catch (requestError) {
      console.error("Learning progress update error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to update learning progress.",
      );

      return false;
    } finally {
      setUpdatingResourceId(null);
    }
  };

  /* =======================================================
     OPEN RESOURCE
     ======================================================= */

  const handleOpenResource = async (event, resource) => {
    event.preventDefault();

    if (!resource?.url) {
      setError("This learning resource does not currently have a URL.");

      return;
    }

    const currentProgress = getResourceProgress(progressRecords, resource._id);

    /*
     * Start tracking immediately,
     * but don't block the browser from
     * opening the resource.
     */

    if (currentProgress === 0) {
      void updateResourceProgress(resource, 1);
    }

    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  /* =======================================================
     COMPLETE
     ======================================================= */

  const handleComplete = async (resource) => {
    await updateResourceProgress(resource, 100);
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="learning-page">
        <div className="learning-loading" role="status" aria-live="polite">
          <LoaderCircle size={32} />

          <h1>Building your learning path</h1>

          <p>
            We're matching learning resources to your current skill gaps and
            progress.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <section className="learning-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="learning-page-header">
        <div>
          <span className="candidate-section-eyebrow">TARGETED LEARNING</span>

          <h1>Learn what moves your profile forward.</h1>

          <p>
            Build the capabilities that matter for the opportunities PulseHire
            is analysing.
          </p>
        </div>

        <Link to="/candidate/skill-gap" className="learning-header-button">
          <Target size={15} />
          View skill gaps
          <ArrowRight size={13} />
        </Link>
      </header>

      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div className="learning-message" role="alert">
          <CircleAlert size={16} />

          <span>{error}</span>
        </div>
      )}

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="learning-hero-card">
        <div className="learning-hero-content">
          <div className="learning-hero-icon">
            <GraduationCap size={24} />
          </div>

          <div>
            <span className="candidate-card-eyebrow">YOUR LEARNING PATH</span>

            <h2>
              Don't learn everything.
              <br />
              Learn what matters.
            </h2>

            <p>
              Your recommendations are connected to the skill gaps PulseHire
              identifies across active opportunities.
            </p>

            <div className="learning-overall-progress">
              <div className="learning-progress-heading">
                <span>Overall progress</span>

                <strong>{overallProgress}%</strong>
              </div>

              <div className="learning-progress-track">
                <div
                  className="learning-progress-fill"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>

              <small>
                {completedCount} of {resources.length} resources completed
              </small>
            </div>
          </div>
        </div>

        <div className="learning-hero-stats">
          <div>
            <Target size={17} />

            <span>Priority gaps</span>

            <strong>{prioritySkills.length}</strong>
          </div>

          <div>
            <BookOpen size={17} />

            <span>Resources</span>

            <strong>{resources.length}</strong>
          </div>

          <div>
            <TrendingUp size={17} />

            <span>In progress</span>

            <strong>{inProgressCount}</strong>
          </div>
        </div>
      </section>

      {/* ===================================================
          CURRENT PATH
          =================================================== */}

      {currentResource && (
        <section className="learning-section">
          <div className="learning-section-heading">
            <div>
              <span className="candidate-card-eyebrow">CURRENT PATH</span>

              <h2>Your next best learning step.</h2>

              <p>
                Continue an active resource or start the most relevant
                incomplete recommendation.
              </p>
            </div>
          </div>

          <article className="learning-current-card">
            <div className="learning-current-number">01</div>

            <div className="learning-current-icon">
              {(() => {
                const Icon = getResourceIcon(currentResource.resourceType);

                return <Icon size={19} />;
              })()}
            </div>

            <div className="learning-current-content">
              <div className="learning-current-top">
                <div>
                  <span>
                    {String(currentResource.skill || "LEARNING").toUpperCase()}
                  </span>

                  <h3>{currentResource.title || "Learning resource"}</h3>
                </div>

                <span
                  className={
                    getResourceProgress(progressRecords, currentResource._id) >
                    0
                      ? "learning-status in-progress"
                      : "learning-status recommended"
                  }
                >
                  {getResourceProgress(progressRecords, currentResource._id) > 0
                    ? "In progress"
                    : "Recommended"}
                </span>
              </div>

              <p>
                {currentResource.description ||
                  `Build practical ${currentResource.skill || ""} capability.`}
              </p>

              <div className="learning-resource-meta">
                <span>
                  <Clock3 size={12} />

                  {formatDuration(currentResource.durationMinutes)}
                </span>

                <span>{currentResource.difficulty || "Intermediate"}</span>

                <span>{currentResource.resourceType || "resource"}</span>
              </div>

              <div className="learning-resource-progress">
                <div>
                  <span>Progress</span>

                  <strong>
                    {getResourceProgress(progressRecords, currentResource._id)}%
                  </strong>
                </div>

                <div className="learning-progress-track small">
                  <div
                    className="learning-progress-fill"
                    style={{
                      width: `${getResourceProgress(
                        progressRecords,
                        currentResource._id,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="learning-current-actions">
                {currentResource.url && (
                  <a
                    href={currentResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="learning-primary-button"
                    onClick={(event) =>
                      handleOpenResource(event, currentResource)
                    }
                  >
                    {getResourceProgress(progressRecords, currentResource._id) >
                    0
                      ? "Continue learning"
                      : "Start learning"}

                    <ArrowRight size={13} />
                  </a>
                )}

                {getResourceProgress(progressRecords, currentResource._id) <
                  100 && (
                  <button
                    type="button"
                    className="learning-secondary-button"
                    disabled={updatingResourceId === currentResource._id}
                    onClick={() => handleComplete(currentResource)}
                  >
                    {updatingResourceId === currentResource._id ? (
                      <LoaderCircle size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    Mark complete
                  </button>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ===================================================
          RECOMMENDED RESOURCES
          =================================================== */}

      <section className="learning-section">
        <div className="learning-section-heading">
          <div>
            <span className="candidate-card-eyebrow">
              RECOMMENDED RESOURCES
            </span>

            <h2>Resources matched to your gaps.</h2>

            <p>
              Prioritised around the capabilities most relevant to your current
              role analysis.
            </p>
          </div>

          <span className="learning-resource-count">
            {recommendedResources.length}{" "}
            {recommendedResources.length === 1
              ? "recommendation"
              : "recommendations"}
          </span>
        </div>

        {recommendedResources.length > 0 ? (
          <div className="learning-resource-grid">
            {recommendedResources.map((resource) => {
              const progress = getResourceProgress(
                progressRecords,
                resource?._id,
              );

              const status = getResourceStatus(progressRecords, resource?._id);

              const Icon = getResourceIcon(resource?.resourceType);

              return (
                <article
                  className={`learning-resource-card ${status}`}
                  key={resource?._id}
                >
                  <div className="learning-resource-card-top">
                    <div className="learning-resource-icon">
                      <Icon size={18} />
                    </div>

                    <span className="learning-resource-skill">
                      {String(resource?.skill || "Learning").toUpperCase()}
                    </span>
                  </div>

                  <h3>{resource?.title || "Learning resource"}</h3>

                  <p>
                    {resource?.description ||
                      `Build practical ${resource?.skill || ""} knowledge.`}
                  </p>

                  <div className="learning-resource-details">
                    <span>
                      <Clock3 size={11} />

                      {formatDuration(resource?.durationMinutes)}
                    </span>

                    <span>{resource?.difficulty || "Intermediate"}</span>
                  </div>

                  <div className="learning-resource-progress">
                    <div>
                      <span>Progress</span>

                      <strong>{progress}%</strong>
                    </div>

                    <div className="learning-progress-track small">
                      <div
                        className="learning-progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="learning-resource-footer">
                    {status === "completed" ? (
                      <span className="learning-completed">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    ) : (
                      <>
                        {resource?.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="learning-open-link"
                            onClick={(event) =>
                              handleOpenResource(event, resource)
                            }
                          >
                            {progress > 0 ? "Continue" : "Open"}

                            <ArrowRight size={12} />
                          </a>
                        )}

                        {progress < 100 && (
                          <button
                            type="button"
                            className="learning-complete-link"
                            disabled={updatingResourceId === resource?._id}
                            onClick={() => handleComplete(resource)}
                          >
                            {updatingResourceId === resource?._id ? (
                              <LoaderCircle size={12} />
                            ) : (
                              <CheckCircle2 size={12} />
                            )}
                            Complete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="learning-empty-state">
            <BookOpen size={24} />

            <div>
              <strong>No recommended learning resources yet.</strong>

              <span>
                Add active resources from the backend or create role skill gaps
                to populate this workspace.
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================
          ALL RESOURCES
          =================================================== */}

      <section className="learning-section">
        <div className="learning-section-heading">
          <div>
            <span className="candidate-card-eyebrow">RESOURCE LIBRARY</span>

            <h2>Explore the full learning library.</h2>
          </div>

          <span className="learning-resource-count">
            {resources.length}{" "}
            {resources.length === 1 ? "resource" : "resources"}
          </span>
        </div>

        <div className="learning-filter-row">
          <button
            type="button"
            className={selectedSkill === "all" ? "active" : ""}
            onClick={() => setSelectedSkill("all")}
          >
            All skills
          </button>

          {resourceSkills.map((skill) => (
            <button
              type="button"
              key={skill}
              className={
                normalizeSkill(selectedSkill) === normalizeSkill(skill)
                  ? "active"
                  : ""
              }
              onClick={() => setSelectedSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>

        {filteredResources.length > 0 ? (
          <div className="learning-library-grid">
            {filteredResources.map((resource) => {
              const progress = getResourceProgress(
                progressRecords,
                resource?._id,
              );

              const status = getResourceStatus(progressRecords, resource?._id);

              const Icon = getResourceIcon(resource?.resourceType);

              return (
                <article className="learning-library-card" key={resource?._id}>
                  <div className="learning-library-icon">
                    <Icon size={17} />
                  </div>

                  <div className="learning-library-copy">
                    <span>
                      {String(resource?.skill || "Learning").toUpperCase()}
                    </span>

                    <h3>{resource?.title || "Learning resource"}</h3>

                    <p>
                      {resource?.description ||
                        "Continue developing a practical capability."}
                    </p>
                  </div>

                  <div className="learning-library-progress">
                    <span>{progress}%</span>

                    <div className="learning-progress-track small">
                      <div
                        className="learning-progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="learning-library-footer">
                    <span>
                      <Clock3 size={11} />

                      {formatDuration(resource?.durationMinutes)}
                    </span>

                    {status === "completed" ? (
                      <span className="learning-completed">
                        <CheckCircle2 size={12} />
                        Complete
                      </span>
                    ) : resource?.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => handleOpenResource(event, resource)}
                      >
                        Open
                        <ArrowRight size={12} />
                      </a>
                    ) : (
                      <span>No link</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="learning-empty-state">
            <Target size={23} />

            <div>
              <strong>No resources match this skill.</strong>

              <span>Choose another skill filter to continue exploring.</span>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================
          PRINCIPLE
          =================================================== */}

      <section className="learning-principle">
        <div className="learning-principle-icon">
          <BadgeCheck size={21} />
        </div>

        <div>
          <span className="candidate-card-eyebrow">LEARNING WITH PURPOSE</span>

          <h2>Learning should improve something measurable.</h2>

          <p>
            PulseHire connects learning to skill gaps, evidence and hiring
            readiness. The goal isn't to collect courses. The goal is to turn
            focused learning into stronger professional capability.
          </p>
        </div>
      </section>
    </section>
  );
};

export default Learning;
