import { useEffect, useState } from "react";

import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Upload,
  User,
  XCircle,
} from "lucide-react";

import {
  getCurrentUser,
  updateRecruiterProfile,
  uploadRecruiterProfilePhoto,
  uploadRecruiterResume,
} from "../../services/recruiterSettings";

/* =========================================================
   INITIAL FORM
   ========================================================= */

const INITIAL_FORM = {
  fullname: "",
  email: "",
  phoneNumber: "",
  bio: "",
  skills: "",
};

/* =========================================================
   HELPERS
   ========================================================= */

const getInitials = (name) => {
  const parts = String(name || "Recruiter")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "RE";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getSkillsText = (skills) => {
  if (!Array.isArray(skills)) {
    return "";
  }

  return skills.join(", ");
};

const normalizeSkills = (value) => {
  return [
    ...new Set(
      String(value || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  ];
};

/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterSettings = () => {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =======================================================
     LOAD USER
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const response = await getCurrentUser();

        if (cancelled) {
          return;
        }

        if (!response?.success || !response?.user) {
          throw new Error(response?.message || "Unable to load your account.");
        }

        const currentUser = response.user;

        setUser(currentUser);

        setForm({
          fullname: currentUser?.fullname || "",

          email: currentUser?.email || "",

          phoneNumber: currentUser?.phoneNumber || "",

          bio: currentUser?.profile?.bio || "",

          skills: getSkillsText(currentUser?.profile?.skills),
        });
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Recruiter settings load error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load your account.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     FIELD UPDATE
     ======================================================= */

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,

      [field]: value,
    }));

    setError("");

    setSuccess("");
  };

  /* =======================================================
     SAVE PROFILE
     ======================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.fullname.trim()) {
      setError("Full name is required.");

      return;
    }

    if (form.fullname.trim().length < 2) {
      setError("Full name must contain at least 2 characters.");

      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");

      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please provide a valid email address.");

      return;
    }

    if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
      setError("Phone number must contain exactly 10 digits.");

      return;
    }

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const response = await updateRecruiterProfile({
        fullname: form.fullname.trim(),

        email: form.email.trim().toLowerCase(),

        phoneNumber: form.phoneNumber.trim(),

        bio: form.bio.trim(),

        skills: normalizeSkills(form.skills),
      });

      if (!response?.success || !response?.user) {
        throw new Error(response?.message || "Unable to update your profile.");
      }

      const updatedUser = response.user;

      setUser(updatedUser);

      setForm({
        fullname: updatedUser?.fullname || "",

        email: updatedUser?.email || "",

        phoneNumber: updatedUser?.phoneNumber || "",

        bio: updatedUser?.profile?.bio || "",

        skills: getSkillsText(updatedUser?.profile?.skills),
      });

      setSuccess(response.message || "Profile updated successfully.");
    } catch (requestError) {
      console.error("Recruiter profile update error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     PHOTO UPLOAD
     ======================================================= */

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      return;
    }

    try {
      setUploadingPhoto(true);

      setError("");

      setSuccess("");

      const response = await uploadRecruiterProfilePhoto(file);

      if (!response?.success || !response?.user) {
        throw new Error(response?.message || "Unable to upload profile photo.");
      }

      setUser(response.user);

      setSuccess(response.message || "Profile photo uploaded successfully.");
    } catch (requestError) {
      console.error("Recruiter profile photo upload error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to upload profile photo.",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* =======================================================
     RESUME UPLOAD
     ======================================================= */

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please select a PDF resume.");

      return;
    }

    try {
      setUploadingResume(true);

      setError("");

      setSuccess("");

      const response = await uploadRecruiterResume(file);

      if (!response?.success || !response?.user) {
        throw new Error(response?.message || "Unable to upload your resume.");
      }

      setUser(response.user);

      setSuccess(response.message || "Resume uploaded successfully.");
    } catch (requestError) {
      console.error("Recruiter resume upload error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to upload your resume.",
      );
    } finally {
      setUploadingResume(false);
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="recruiter-settings-page">
        <div
          className="recruiter-settings-loading"
          role="status"
          aria-live="polite"
        >
          <RefreshCw size={30} className="recruiter-settings-spin" />

          <h1>Loading your settings</h1>

          <p>We're preparing your recruiter account workspace.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recruiter-settings-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="recruiter-settings-header">
        <div>
          <span className="recruiter-settings-eyebrow">ACCOUNT SETTINGS</span>

          <h1>Keep your recruiter profile current.</h1>

          <p>
            Update the account information and profile signals used throughout
            your PulseHire recruiter workspace.
          </p>
        </div>

        <div className="recruiter-settings-role-badge">
          <BriefcaseBusiness size={14} />
          Recruiter account
        </div>
      </header>

      {/* ===================================================
          ALERTS
          =================================================== */}

      {error && (
        <div className="recruiter-settings-alert error" role="alert">
          <XCircle size={16} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="recruiter-settings-alert success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} />

          <span>{success}</span>
        </div>
      )}

      <div className="recruiter-settings-layout">
        {/* =================================================
            MAIN FORM
            ================================================= */}

        <form className="recruiter-settings-main" onSubmit={handleSave}>
          {/* ===============================================
              PROFILE
              =============================================== */}

          <section className="recruiter-settings-card">
            <div className="recruiter-settings-card-heading">
              <div className="recruiter-settings-card-icon">
                <User size={17} />
              </div>

              <div>
                <span>PROFILE</span>

                <h2>Personal information</h2>

                <p>
                  This is the account identity associated with your recruiter
                  workspace.
                </p>
              </div>
            </div>

            <div className="recruiter-settings-two-column">
              <label className="recruiter-settings-field">
                <span>Full name</span>

                <input
                  type="text"
                  value={form.fullname}
                  onChange={(event) =>
                    updateField("fullname", event.target.value)
                  }
                  placeholder="Your full name"
                  disabled={saving}
                  maxLength={120}
                />
              </label>

              <label className="recruiter-settings-field">
                <span>Email address</span>

                <div className="recruiter-settings-input-icon">
                  <Mail size={15} />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    disabled={saving}
                  />
                </div>
              </label>
            </div>

            <label className="recruiter-settings-field">
              <span>Phone number</span>

              <div className="recruiter-settings-input-icon">
                <Phone size={15} />

                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(event) =>
                    updateField(
                      "phoneNumber",
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  placeholder="10-digit phone number"
                  maxLength={10}
                  disabled={saving}
                />
              </div>
            </label>

            <label className="recruiter-settings-field">
              <span>Professional bio</span>

              <textarea
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Tell candidates and hiring stakeholders about your recruiting focus."
                rows={7}
                disabled={saving}
              />
            </label>

            <label className="recruiter-settings-field">
              <span>Skills / recruiting expertise</span>

              <input
                type="text"
                value={form.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder="Talent acquisition, technical recruiting, sourcing"
                disabled={saving}
              />

              <small>Separate multiple skills with commas.</small>
            </label>
          </section>

          {/* ===============================================
              SAVE
              =============================================== */}

          <section className="recruiter-settings-save-card">
            <div>
              <span className="recruiter-settings-eyebrow">
                PROFILE CHANGES
              </span>

              <h2>Save your recruiter profile.</h2>

              <p>Changes are saved directly to your PulseHire account.</p>
            </div>

            <button
              type="submit"
              className="recruiter-settings-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <RefreshCw size={14} className="recruiter-settings-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save changes
                </>
              )}
            </button>
          </section>
        </form>

        {/* =================================================
            SIDEBAR
            ================================================= */}

        <aside className="recruiter-settings-sidebar">
          {/* ===============================================
              PROFILE PHOTO
              =============================================== */}

          <section className="recruiter-settings-card">
            <div className="recruiter-settings-card-heading compact">
              <div className="recruiter-settings-card-icon">
                <User size={16} />
              </div>

              <div>
                <span>PROFILE PHOTO</span>

                <h2>Your identity</h2>
              </div>
            </div>

            <div className="recruiter-settings-photo">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user?.fullname || "Recruiter profile"}
                />
              ) : (
                <div className="recruiter-settings-photo-fallback">
                  {getInitials(user?.fullname)}
                </div>
              )}
            </div>

            <label className="recruiter-settings-upload-button">
              <Upload size={13} />

              {uploadingPhoto ? "Uploading..." : "Upload photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
              />
            </label>

            <small className="recruiter-settings-help">
              Upload an image to personalize your recruiter profile.
            </small>
          </section>

          {/* ===============================================
              RESUME
              =============================================== */}

          <section className="recruiter-settings-card">
            <div className="recruiter-settings-card-heading compact">
              <div className="recruiter-settings-card-icon">
                <FileText size={16} />
              </div>

              <div>
                <span>RESUME</span>

                <h2>Professional document</h2>
              </div>
            </div>

            <div className="recruiter-settings-resume">
              <FileText size={20} />

              <div>
                <strong>
                  {user?.profile?.resumeOriginalName || "No resume uploaded"}
                </strong>

                <span>
                  {user?.profile?.resume
                    ? "Your resume is stored in your profile."
                    : "Upload a PDF to add one."}
                </span>
              </div>
            </div>

            <label className="recruiter-settings-upload-button secondary">
              <Upload size={13} />

              {uploadingResume ? "Uploading..." : "Upload PDF"}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeChange}
                disabled={uploadingResume}
              />
            </label>

            {user?.profile?.resume && (
              <a
                href={user.profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="recruiter-settings-view-document"
              >
                Open current resume
              </a>
            )}
          </section>

          {/* ===============================================
              SECURITY
              =============================================== */}

          <section className="recruiter-settings-card">
            <div className="recruiter-settings-card-heading compact">
              <div className="recruiter-settings-card-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <span>ACCOUNT SECURITY</span>

                <h2>Authentication status</h2>
              </div>
            </div>

            <div className="recruiter-settings-security-item">
              <CheckCircle2 size={15} />

              <div>
                <strong>Authenticated recruiter</strong>

                <span>
                  Your account is protected by the existing PulseHire
                  authentication flow.
                </span>
              </div>
            </div>

            <div className="recruiter-settings-security-item">
              <BadgeCheck size={15} />

              <div>
                <strong>Role</strong>

                <span>{user?.role || "recruiter"}</span>
              </div>
            </div>

            <div className="recruiter-settings-security-note">
              <span>PASSWORD CHANGES</span>

              <p>
                Password management is not exposed by the current User API, so
                this workspace does not show a password-change form.
              </p>
            </div>
          </section>

          {/* ===============================================
              QUICK NAVIGATION
              =============================================== */}

          <section className="recruiter-settings-card recruiter-settings-links">
            <span className="recruiter-settings-eyebrow">WORKSPACE</span>

            <a href="/recruiter/dashboard">Dashboard</a>

            <a href="/recruiter/company">Company</a>

            <a href="/recruiter/jobs">Jobs</a>

            <a href="/recruiter/candidates">Candidates</a>
          </section>
        </aside>
      </div>
    </section>
  );
};

export default RecruiterSettings;
