import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Upload,
  User,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { getCurrentUser } from "../../services/auth.api";

import { getSkillGap } from "../../services/skills.api";
import { getOwnResumeUrl } from "../../services/resume.api";

import {
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
} from "../../services/profile.api";

const CandidateProfile = () => {
  const { user, refreshUser } = useAuth();

  const [profileUser, setProfileUser] = useState(user);

  const [skillGapData, setSkillGapData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",

    email: user?.email || "",

    phoneNumber: user?.phoneNumber || "",

    bio: user?.profile?.bio || "",

    skills: Array.isArray(user?.profile?.skills)
      ? user.profile.skills.join(", ")
      : "",
  });

  /* =========================================================
     LOAD PROFILE
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, skillGapResponse] = await Promise.all([
          getCurrentUser(),
          getSkillGap(),
        ]);

        if (cancelled) {
          return;
        }

        if (profileResponse?.success && profileResponse?.user) {
          const currentUser = profileResponse.user;

          setProfileUser(currentUser);

          setFormData({
            fullname: currentUser.fullname || "",

            email: currentUser.email || "",

            phoneNumber: currentUser.phoneNumber || "",

            bio: currentUser.profile?.bio || "",

            skills: Array.isArray(currentUser.profile?.skills)
              ? currentUser.profile.skills.join(", ")
              : "",
          });
        }

        if (skillGapResponse?.success) {
          setSkillGapData(skillGapResponse);
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Candidate profile loading error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load your profile.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     DISPLAY DATA
     ========================================================= */

  const displayName = profileUser?.fullname || "Candidate";

  const displayEmail = profileUser?.email || "No email available";

  const displayPhone = profileUser?.phoneNumber || "No phone number added";

  const displayBio =
    profileUser?.profile?.bio ||
    "Add a short professional introduction so recruiters can quickly understand your background.";

  const displaySkills = Array.isArray(profileUser?.profile?.skills)
    ? profileUser.profile.skills
    : [];

  const verifiedSkills = Array.isArray(skillGapData?.verifiedSkills)
    ? skillGapData.verifiedSkills
    : [];

  const claimedSkills = Array.isArray(skillGapData?.claimedSkills)
    ? skillGapData.claimedSkills
    : displaySkills;

  const verifiedCoverage = Math.max(
    0,
    Math.min(100, Number(skillGapData?.verifiedCoverage ?? 0)),
  );

  /* =========================================================
     PROFILE COMPLETENESS
     ========================================================= */

  const profileCompleteness = useMemo(() => {
    const checks = [
      Boolean(profileUser?.fullname?.trim()),

      Boolean(profileUser?.email?.trim()),

      Boolean(profileUser?.phoneNumber?.trim()),

      Boolean(profileUser?.profile?.bio?.trim()),

      Array.isArray(profileUser?.profile?.skills) &&
        profileUser.profile.skills.length > 0,

      Boolean(profileUser?.profile?.resume),

      Boolean(profileUser?.profile?.profilePhoto),
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [profileUser]);

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================================================
     CANCEL EDIT
     ========================================================= */

  const handleCancelEdit = () => {
    setFormData({
      fullname: profileUser?.fullname || "",

      email: profileUser?.email || "",

      phoneNumber: profileUser?.phoneNumber || "",

      bio: profileUser?.profile?.bio || "",

      skills: Array.isArray(profileUser?.profile?.skills)
        ? profileUser.profile.skills.join(", ")
        : "",
    });

    setIsEditing(false);
    setError("");
  };

  /* =========================================================
     SAVE PROFILE
     ========================================================= */

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");

    const fullname = formData.fullname.trim();

    const email = formData.email.trim().toLowerCase();

    const phoneNumber = formData.phoneNumber.trim();

    const bio = formData.bio.trim();

    const skills = [
      ...new Set(
        formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      ),
    ];

    if (fullname.length < 2) {
      setError("Full name must contain at least 2 characters.");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");

      return;
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      setError("Phone number must contain exactly 10 digits.");

      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile({
        fullname,
        email,
        phoneNumber,
        bio,
        skills,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Unable to update your profile.");
      }

      setProfileUser(data.user);

      setFormData({
        fullname: data.user?.fullname || "",

        email: data.user?.email || "",

        phoneNumber: data.user?.phoneNumber || "",

        bio: data.user?.profile?.bio || "",

        skills: Array.isArray(data.user?.profile?.skills)
          ? data.user.profile.skills.join(", ")
          : "",
      });

      /*
       * Refresh AuthContext rather than
       * misusing login() as a state setter.
       */
      await refreshUser();

      setSuccess("Your profile has been updated successfully.");

      setIsEditing(false);
    } catch (requestError) {
      console.error("Profile update error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     PROFILE PHOTO UPLOAD
     ========================================================= */

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");

      event.target.value = "";

      return;
    }

    const formData = new FormData();

    formData.append("profilePhoto", file);

    try {
      setUploadingPhoto(true);

      const data = await uploadProfilePhoto(formData);

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to update your profile photo.",
        );
      }

      setProfileUser(data.user);

      await refreshUser();

      setSuccess("Profile photo updated successfully.");
    } catch (requestError) {
      console.error("Profile photo upload error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to upload your profile photo.",
      );
    } finally {
      setUploadingPhoto(false);

      event.target.value = "";
    }
  };

  /* =========================================================
     RESUME UPLOAD
     ========================================================= */

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please select a PDF resume.");

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");

      event.target.value = "";

      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {
      setUploadingResume(true);

      const data = await uploadResume(formData);

      if (!data?.success) {
        throw new Error(data?.message || "Unable to upload your resume.");
      }

      setProfileUser(data.user);

      await refreshUser();

      setSuccess("Resume uploaded successfully.");
    } catch (requestError) {
      console.error("Resume upload error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to upload your resume.",
      );
    } finally {
      setUploadingResume(false);

      event.target.value = "";
    }
  };

  /* =========================================================
     INITIALS
     ========================================================= */

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PH";

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <section className="candidate-profile-page">
        <div className="profile-page-loading" role="status" aria-live="polite">
          <LoaderCircle size={32} />

          <h1>Loading your profile</h1>

          <p>
            We're gathering your profile, verification and professional
            documents.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="candidate-profile-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="profile-page-header">
        <div>
          <span className="candidate-section-eyebrow">
            PROFESSIONAL PROFILE
          </span>

          <h1>Build a profile recruiters can trust.</h1>

          <p>
            Keep your professional identity, skills, evidence and resume
            current.
          </p>
        </div>

        <div className="profile-header-actions">
          {isEditing ? (
            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancelEdit}
            >
              <X size={15} />
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="profile-edit-button"
              onClick={() => {
                setError("");
                setSuccess("");
                setIsEditing(true);
              }}
            >
              <Pencil size={15} />
              Edit profile
            </button>
          )}
        </div>
      </header>

      {/* =====================================================
          FEEDBACK
          ===================================================== */}

      {error && (
        <div className="profile-feedback error" role="alert">
          <X size={16} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="profile-feedback success" role="status">
          <CheckCircle2 size={16} />

          <span>{success}</span>
        </div>
      )}

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="profile-hero-card">
        <div className="profile-hero-identity">
          <div className="profile-photo-wrapper">
            <div className="profile-photo">
              {profileUser?.profile?.profilePhoto ? (
                <img
                  src={profileUser.profile.profilePhoto}
                  alt={`${displayName} profile`}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <label
              className={`profile-photo-button ${
                uploadingPhoto ? "uploading" : ""
              }`}
              title="Change profile photo"
            >
              {uploadingPhoto ? (
                <LoaderCircle size={13} />
              ) : (
                <Upload size={13} />
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePhotoUpload}
                disabled={uploadingPhoto}
                hidden
              />
            </label>
          </div>

          <div className="profile-hero-copy">
            <span className="candidate-card-eyebrow">
              YOUR PULSEHIRE PROFILE
            </span>

            <h2>{displayName}</h2>

            <p>{displayBio}</p>

            <div className="profile-trust-badge">
              <ShieldCheck size={14} />
              Evidence-backed candidate profile
            </div>
          </div>
        </div>

        <div className="profile-completeness">
          <div>
            <span>PROFILE COMPLETENESS</span>

            <strong>{profileCompleteness}%</strong>
          </div>

          <div className="profile-completeness-track">
            <div
              className="profile-completeness-fill"
              style={{
                width: `${profileCompleteness}%`,
              }}
            />
          </div>

          <small>
            {profileCompleteness >= 90
              ? "Your profile is well prepared."
              : profileCompleteness >= 70
                ? "A few details can still strengthen your profile."
                : "Complete more of your profile to create a stronger professional signal."}
          </small>
        </div>
      </section>

      {/* =====================================================
          METRICS
          ===================================================== */}

      <section className="profile-metrics">
        <div className="profile-metric">
          <div className="profile-metric-icon">
            <User size={18} />
          </div>

          <div>
            <span>CLAIMED SKILLS</span>

            <strong>{claimedSkills.length}</strong>

            <small>skills on your profile</small>
          </div>
        </div>

        <Link to="/candidate/skill-proof" className="profile-metric">
          <div className="profile-metric-icon">
            <BadgeCheck size={18} />
          </div>

          <div>
            <span>VERIFIED SKILLS</span>

            <strong>{verifiedSkills.length}</strong>

            <small>{verifiedCoverage}% evidence coverage</small>
          </div>
        </Link>

        <Link to="/candidate/skill-gap" className="profile-metric">
          <div className="profile-metric-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>READINESS</span>

            <strong>{Number(skillGapData?.readiness ?? 0)}%</strong>

            <small>across analysed roles</small>
          </div>
        </Link>
      </section>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="profile-content-grid">
        {/* ===================================================
            MAIN COLUMN
            =================================================== */}

        <div className="profile-content-main">
          {/* =================================================
              PERSONAL INFORMATION
              ================================================= */}

          <section className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span className="candidate-card-eyebrow">
                  PERSONAL INFORMATION
                </span>

                <h2>Your professional identity.</h2>
              </div>

              <User size={20} className="profile-panel-icon" />
            </div>

            {isEditing ? (
              <form className="profile-form" onSubmit={handleSaveProfile}>
                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label htmlFor="fullname">Full name</label>

                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      minLength={2}
                      disabled={saving}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="email">Email address</label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="phoneNumber">Phone number</label>

                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      maxLength={10}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="profile-field">
                    <label>Account type</label>

                    <div
                      className="profile-readonly-field"
                      aria-label="Account type"
                    >
                      Candidate
                    </div>
                  </div>

                  <div className="profile-field full-width">
                    <label htmlFor="bio">Professional bio</label>

                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={6}
                      maxLength={1000}
                      placeholder="Describe your background, interests and what you bring to a role."
                      disabled={saving}
                    />
                  </div>

                  <div className="profile-field full-width">
                    <label htmlFor="skills">Skills</label>

                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB"
                      disabled={saving}
                    />

                    <small>Separate skills with commas.</small>
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save changes"}

                    {!saving && <ArrowRight size={15} />}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <Mail size={16} />

                  <div>
                    <span>EMAIL</span>

                    <strong>{displayEmail}</strong>
                  </div>
                </div>

                <div className="profile-info-item">
                  <Phone size={16} />

                  <div>
                    <span>PHONE</span>

                    <strong>{displayPhone}</strong>
                  </div>
                </div>

                <div className="profile-info-item full-width">
                  <MapPin size={16} />

                  <div>
                    <span>PROFESSIONAL BIO</span>

                    <strong>{displayBio}</strong>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* =================================================
              SKILLS
              ================================================= */}

          <section className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span className="candidate-card-eyebrow">
                  PROFESSIONAL SKILLS
                </span>

                <h2>Skills on your profile.</h2>
              </div>

              <Link to="/candidate/skill-proof" className="profile-panel-link">
                Verify skills
                <ArrowRight size={13} />
              </Link>
            </div>

            {displaySkills.length > 0 ? (
              <div className="profile-skills-grid">
                {displaySkills.map((skill) => {
                  const verified = verifiedSkills.some(
                    (verifiedSkill) =>
                      String(verifiedSkill).trim().toLowerCase() ===
                      String(skill).trim().toLowerCase(),
                  );

                  return (
                    <div
                      className={`profile-skill-pill ${
                        verified ? "verified" : ""
                      }`}
                      key={skill}
                    >
                      {verified && <BadgeCheck size={13} />}

                      <span>{skill}</span>

                      {verified && <small>Verified</small>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="profile-empty-state">
                <User size={20} />

                <div>
                  <strong>No skills added yet.</strong>

                  <span>
                    Add your strongest technical and professional skills to
                    improve your discoverability.
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <aside className="profile-content-sidebar">
          {/* =================================================
              RESUME
              ================================================= */}

          <section className="profile-document-card">
            <div className="profile-document-icon">
              <FileText size={21} />
            </div>

            <span className="candidate-card-eyebrow">
              PROFESSIONAL DOCUMENT
            </span>

            <h2>Your resume.</h2>

            {profileUser?.profile?.resume ? (
              <div className="profile-document-present">
                <div>
                  <FileCheck2 size={18} />

                  <div>
                    <strong>
                      {profileUser?.profile?.resumeOriginalName ||
                        "Resume uploaded"}
                    </strong>

                    <span>Available to recruiters</span>
                  </div>
                </div>

                <a
                  href={getOwnResumeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-document-link"
                >
                  View
                  <ArrowRight size={12} />
                </a>
              </div>
            ) : (
              <div className="profile-document-empty">
                <strong>No resume uploaded.</strong>

                <span>
                  Add a current PDF resume to complete your professional
                  profile.
                </span>
              </div>
            )}

            <label
              className={`profile-upload-button ${
                uploadingResume ? "uploading" : ""
              }`}
            >
              {uploadingResume ? (
                <>
                  <LoaderCircle size={15} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={15} />

                  {profileUser?.profile?.resume
                    ? "Replace resume"
                    : "Upload resume"}
                </>
              )}

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                hidden
              />
            </label>

            <small className="profile-upload-note">
              PDF only · Maximum 5 MB
            </small>
          </section>

          {/* =================================================
              VERIFICATION
              ================================================= */}

          <section className="profile-verification-card">
            <div className="profile-verification-icon">
              <ShieldCheck size={19} />
            </div>

            <span className="candidate-card-eyebrow">TRUST SIGNAL</span>

            <h2>Evidence makes your profile stronger.</h2>

            <p>
              Recruiter-approved skills are used throughout PulseHire's matching
              and skill-gap intelligence.
            </p>

            <Link to="/candidate/skill-proof" className="profile-primary-link">
              Manage skill proof
              <ArrowRight size={13} />
            </Link>
          </section>

          {/* =================================================
              CHECKLIST
              ================================================= */}

          <section className="profile-checklist-card">
            <span className="candidate-card-eyebrow">PROFILE CHECKLIST</span>

            <h2>Keep your profile ready.</h2>

            <div className="profile-checklist">
              <div>
                {profileUser?.fullname ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Full name</span>
              </div>

              <div>
                {profileUser?.email ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Email</span>
              </div>

              <div>
                {profileUser?.phoneNumber ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Phone number</span>
              </div>

              <div>
                {displaySkills.length > 0 ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Skills</span>
              </div>

              <div>
                {profileUser?.profile?.bio ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Professional bio</span>
              </div>

              <div>
                {profileUser?.profile?.resume ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Resume</span>
              </div>

              <div>
                {profileUser?.profile?.profilePhoto ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Upload size={15} />
                )}

                <span>Profile photo</span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* =====================================================
          INSIGHT
          ===================================================== */}

      <section className="profile-insight">
        <div className="profile-insight-icon">
          <BadgeCheck size={21} />
        </div>

        <div>
          <span className="candidate-card-eyebrow">PULSEHIRE DIFFERENCE</span>

          <h2>Your profile is more than a resume.</h2>

          <p>
            Your profile connects your identity, claimed skills,
            recruiter-approved evidence, learning progress and job opportunities
            into one professional signal.
          </p>
        </div>

        <Link to="/candidate/jobs" className="profile-primary-button">
          Explore opportunities
          <ArrowRight size={14} />
        </Link>
      </section>
    </section>
  );
};

export default CandidateProfile;
