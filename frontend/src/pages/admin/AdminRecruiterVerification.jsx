import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  LogOut,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import {
  getRecruiterVerificationQueue,
  reviewRecruiterVerification,
} from "../../services/adminRecruiters.api";

const tabs = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getErrorMessage = (requestError) =>
  requestError?.response?.data?.message ||
  requestError?.message ||
  "Unable to load recruiter verification queue.";

const AdminRecruiterVerification = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [status, setStatus] = useState("pending");
  const [recruiters, setRecruiters] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [notes, setNotes] = useState({});

  const applyQueueData = useCallback((data) => {
    setRecruiters(
      Array.isArray(data?.recruiters) ? data.recruiters : [],
    );

    setPagination(data?.pagination || null);
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      const data = await getRecruiterVerificationQueue({
        status,
      });

      applyQueueData(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [status, applyQueueData]);

  useEffect(() => {
    let cancelled = false;

    getRecruiterVerificationQueue({ status })
      .then((data) => {
        if (cancelled) return;

        setRecruiters(
          Array.isArray(data?.recruiters)
            ? data.recruiters
            : [],
        );

        setPagination(data?.pagination || null);
      })
      .catch((requestError) => {
        if (cancelled) return;

        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    loadQueue();
  };

  const handleTabChange = (nextStatus) => {
    if (nextStatus === status) return;

    setLoading(true);
    setError("");
    setStatus(nextStatus);
  };

  const handleReview = async (recruiter, nextStatus) => {
    const recruiterId = recruiter?._id;

    if (!recruiterId) return;

    const note = String(notes[recruiterId] || "").trim();

    if (nextStatus === "rejected" && !note) {
      setError(
        "Add a clear review note before rejecting a recruiter.",
      );
      return;
    }

    try {
      setReviewingId(recruiterId);
      setError("");

      await reviewRecruiterVerification({
        recruiterId,
        status: nextStatus,
        note,
      });

      setNotes((current) => ({
        ...current,
        [recruiterId]: "",
      }));

      await loadQueue();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to update recruiter verification.",
      );
    } finally {
      setReviewingId("");
    }
  };

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <main className="admin-recruiter-page">
      <header className="admin-recruiter-header">
        <div>
          <span className="admin-recruiter-eyebrow">
            PULSEHIRE TRUST & SAFETY
          </span>

          <h1>Recruiter verification</h1>

          <p>
            Review recruiter identities and company
            information before they can publish jobs or
            access candidate data.
          </p>
        </div>

        <div className="admin-recruiter-header-actions">
          <span>{user?.email}</span>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "spin" : ""}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={15} />

            Sign out
          </button>
        </div>
      </header>

      <section className="admin-recruiter-panel">
        <div
          className="admin-recruiter-tabs"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.value}
              className={
                status === tab.value ? "active" : ""
              }
              onClick={() =>
                handleTabChange(tab.value)
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            className="admin-recruiter-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-recruiter-state">
            Loading recruiter accounts…
          </div>
        ) : recruiters.length === 0 ? (
          <div className="admin-recruiter-state">
            <ShieldCheck size={28} />

            <strong>
              No {status} recruiter accounts.
            </strong>
          </div>
        ) : (
          <div className="admin-recruiter-list">
            {recruiters.map((recruiter) => {
              const recruiterId = recruiter?._id;

              const companies = Array.isArray(
                recruiter?.companies,
              )
                ? recruiter.companies
                : [];

              const isReviewing =
                reviewingId === recruiterId;

              return (
                <article
                  className="admin-recruiter-card"
                  key={recruiterId}
                >
                  <div className="admin-recruiter-card-head">
                    <div className="admin-recruiter-avatar">
                      {String(
                        recruiter?.fullname || "R",
                      )
                        .trim()
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h2>
                        {recruiter?.fullname ||
                          "Recruiter"}
                      </h2>

                      <span>
                        {recruiter?.email}
                      </span>

                      <small>
                        Joined{" "}
                        {formatDate(
                          recruiter?.createdAt,
                        )}
                      </small>
                    </div>

                    <span
                      className={`admin-status-chip ${status}`}
                    >
                      {status === "verified" ? (
                        <BadgeCheck size={13} />
                      ) : status === "rejected" ? (
                        <XCircle size={13} />
                      ) : (
                        <ShieldCheck size={13} />
                      )}

                      {status}
                    </span>
                  </div>

                  <div className="admin-recruiter-meta">
                    <div>
                      <span>Phone</span>

                      <strong>
                        {recruiter?.phoneNumber ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div>
                      <span>Account</span>

                      <strong>
                        {recruiter?.accountStatus ||
                          "active"}
                      </strong>
                    </div>

                    <div>
                      <span>Reviewed</span>

                      <strong>
                        {formatDate(
                          recruiter
                            ?.recruiterVerification
                            ?.reviewedAt,
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-company-section">
                    <div className="admin-section-heading">
                      <Building2 size={16} />

                      <strong>
                        Company information
                      </strong>
                    </div>

                    {companies.length === 0 ? (
                      <p className="admin-company-empty">
                        No company profile has been
                        created yet.
                      </p>
                    ) : (
                      <div className="admin-company-list">
                        {companies.map((company) => (
                          <div
                            className="admin-company-item"
                            key={company?._id}
                          >
                            <div>
                              <strong>
                                {company?.name ||
                                  "Company"}
                              </strong>

                              <span>
                                {company?.location ||
                                  "Location not set"}
                              </span>
                            </div>

                            {company?.website && (
                              <a
                                href={
                                  company.website
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Website{" "}
                                <ExternalLink
                                  size={12}
                                />
                              </a>
                            )}

                            {company?.description && (
                              <p>
                                {
                                  company.description
                                }
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <label className="admin-review-note">
                    <span>Review note</span>

                    <textarea
                      rows="3"
                      maxLength="500"
                      placeholder="Required for rejection; optional for approval."
                      value={
                        notes[recruiterId] || ""
                      }
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [recruiterId]:
                            event.target.value,
                        }))
                      }
                      disabled={isReviewing}
                    />
                  </label>

                  <div className="admin-review-actions">
                    {status !== "verified" && (
                      <button
                        type="button"
                        className="approve"
                        onClick={() =>
                          handleReview(
                            recruiter,
                            "verified",
                          )
                        }
                        disabled={isReviewing}
                      >
                        <CheckCircle2 size={15} />

                        Approve recruiter
                      </button>
                    )}

                    {status !== "rejected" && (
                      <button
                        type="button"
                        className="reject"
                        onClick={() =>
                          handleReview(
                            recruiter,
                            "rejected",
                          )
                        }
                        disabled={isReviewing}
                      >
                        <XCircle size={15} />

                        Reject / revoke
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {pagination && (
          <div className="admin-recruiter-pagination">
            Showing {recruiters.length} of{" "}
            {pagination.total} accounts
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminRecruiterVerification;