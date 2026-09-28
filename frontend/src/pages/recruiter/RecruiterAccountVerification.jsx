import { BadgeCheck, Building2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import useAuth from "../../hooks/useAuth";

const RecruiterAccountVerification = () => {
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const status =
    user?.recruiterVerification?.status ||
    user?.recruiterVerificationStatus ||
    "pending";

  const note = user?.recruiterVerification?.note || "";

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  };

  const isVerified = status === "verified";
  const isRejected = status === "rejected";

  return (
    <section className="recruiter-verification-page">
      <div className="recruiter-verification-card">
        <div
          className={`recruiter-verification-icon ${
            isVerified ? "verified" : isRejected ? "rejected" : "pending"
          }`}
        >
          {isVerified ? (
            <BadgeCheck size={28} />
          ) : isRejected ? (
            <XCircle size={28} />
          ) : (
            <ShieldCheck size={28} />
          )}
        </div>

        <span className="recruiter-verification-eyebrow">
          RECRUITER TRUST & SAFETY
        </span>

        <h1>
          {isVerified
            ? "Your recruiter account is verified."
            : isRejected
              ? "Your verification needs attention."
              : "Your recruiter verification is pending."}
        </h1>

        <p>
          {isVerified
            ? "You can publish jobs, review applicants, access candidate data and verify evidence."
            : isRejected
              ? "Sensitive recruiter actions stay locked until your account is approved. Update your company information if needed and contact the PulseHire administrator for another review."
              : "You can complete your company and account setup while PulseHire reviews your recruiter identity. Publishing jobs and accessing candidate data unlock only after approval."}
        </p>

        {isRejected && note && (
          <div className="recruiter-verification-note">
            <strong>Review note</strong>
            <span>{note}</span>
          </div>
        )}

        <div className="recruiter-verification-actions">
          {isVerified ? (
            <Link to="/recruiter/dashboard" className="recruiter-verification-primary">
              Open recruiter dashboard
            </Link>
          ) : (
            <Link to="/recruiter/company" className="recruiter-verification-primary">
              <Building2 size={16} />
              Complete company profile
            </Link>
          )}

          <button
            type="button"
            className="recruiter-verification-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "spin" : ""} />
            {refreshing ? "Checking..." : "Check status"}
          </button>
        </div>
      </div>

      <div className="recruiter-verification-grid">
        <article>
          <strong>Why verification exists</strong>
          <p>
            Candidate contact details, resumes and skill evidence are sensitive.
            PulseHire only exposes them to recruiters that have been approved.
          </p>
        </article>

        <article>
          <strong>What you can do now</strong>
          <p>
            Add accurate company information and keep your recruiter profile up
            to date while your review is pending.
          </p>
        </article>
      </div>
    </section>
  );
};

export default RecruiterAccountVerification;
