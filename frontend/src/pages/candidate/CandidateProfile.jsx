import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  FileCheck2,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Search,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import AuthContext from "../../context/AuthContext";


const CandidateProfile = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await fetch(
          "http://localhost:8000/api/v1/user/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load profile.");
        }

        setProfileUser(data.user);
        login(data.user);

        setFormData({
          fullname: data.user?.fullname || "",
          email: data.user?.email || "",
          phoneNumber: data.user?.phoneNumber || "",
          bio: data.user?.profile?.bio || "",
          skills: data.user?.profile?.skills?.join(", ") || "",
        });
      } catch (err) {
        setError(err.message || "Unable to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [login]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await fetch(
        "http://localhost:8000/api/v1/user/profile",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: formData.fullname,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            bio: formData.bio,
            skills,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profile update failed.");
      }

      setProfileUser(data.user);
      login(data.user);

      setFormData({
        fullname: data.user?.fullname || "",
        email: data.user?.email || "",
        phoneNumber: data.user?.phoneNumber || "",
        bio: data.user?.profile?.bio || "",
        skills: data.user?.profile?.skills?.join(", ") || "",
      });

      setSuccess("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(
        "http://localhost:8000/api/v1/user/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      navigate("/");
    }
  };

  const displayName = profileUser?.fullname || "Arjun Kumar";
  const displayBio = profileUser?.profile?.bio || "Build an evidence-backed professional profile on PulseHire.";
  const displaySkills = profileUser?.profile?.skills || [];
  const skillCount = displaySkills.length;

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

            <span>
              PulseHire
            </span>
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
              className="sidebar-link active"
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
              {displayName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>


            <div>

              <strong>
                {displayName}
              </strong>

              <span>
                Candidate
              </span>

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
            TOPBAR
        =================================================== */}

        <header className="candidate-topbar">

          <div>

            <span className="dashboard-eyebrow">
              CANDIDATE WORKSPACE
            </span>

            <h1>
              Your skills are your strongest signal.
            </h1>

          </div>


          <div className="topbar-actions">

            <Link
              to="/candidate/jobs"
              className="topbar-search"
            >
              <Search size={17} />
              Search
            </Link>


            <button
              className="notification-button"
              type="button"
            >
              <Bell size={17} />
              <span className="notification-dot"></span>
            </button>


            <Link
              to="/candidate/profile"
              className="topbar-avatar"
            >
              {displayName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </Link>

          </div>

        </header>


        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section className="candidate-profile-hero">

          <div className="candidate-profile-identity">

            <div className="candidate-profile-avatar">
              {displayName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>


            <div>

              <span className="panel-label">
                YOUR PULSEHIRE PROFILE
              </span>

              <h2>
                {displayName}
              </h2>

              <p>
                {displayBio}
              </p>


              <div className="profile-verification-status">

                <BadgeCheck size={13} />

                Evidence-backed profile

              </div>

            </div>

          </div>


          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {
              setError("");
              setSuccess("");
              setIsEditing(true);
            }}
          >

            <User size={13} />

            Edit Profile

          </button>

        </section>


        {/* ===================================================
            PROFILE METRICS
        =================================================== */}

        <section className="candidate-overview">


          <Link
            to="/candidate/profile"
            className="candidate-overview-card"
          >

            <div className="candidate-overview-top">

              <span>
                PROFILE STRENGTH
              </span>

              <TrendingUp size={16} />

            </div>


            <strong>
              82%
            </strong>


            <div className="candidate-progress">

              <div
                className="candidate-progress-fill"
                style={{ width: "82%" }}
              ></div>

            </div>


            <small>
              Strong profile · 18% to improve
            </small>

          </Link>


          <Link
            to="/candidate/skill-proof"
            className="candidate-overview-card"
          >

            <div className="candidate-overview-top">

              <span>
                VERIFIED SKILLS
              </span>

              <BadgeCheck size={16} />

            </div>


            <strong>
              {skillCount} / 5
            </strong>


            <small>
              {skillCount} skills in your profile
            </small>

          </Link>


          <Link
            to="/candidate/skill-gap"
            className="candidate-overview-card"
          >

            <div className="candidate-overview-top">

              <span>
                SKILL GAP
              </span>

              <Target size={16} />

            </div>


            <strong>
              20%
            </strong>


            <small>
              2 skills need improvement
            </small>

          </Link>


          <Link
            to="/candidate/applications"
            className="candidate-overview-card"
          >

            <div className="candidate-overview-top">

              <span>
                APPLICATIONS
              </span>

              <FileCheck2 size={16} />

            </div>


            <strong>
              7
            </strong>


            <small>
              2 currently shortlisted
            </small>

          </Link>

        </section>


        {success && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              border: "1px solid #174b38",
              borderRadius: "8px",
              background: "#0a2119",
              color: "#66e3a5",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {success}
          </div>
        )}

        {error && !isEditing && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              border: "1px solid #5b2730",
              borderRadius: "8px",
              background: "#241116",
              color: "#ff8f9b",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        {isEditing && (
          <div
            style={{
              marginBottom: "20px",
              padding: "20px",
              border: "1px solid #164a63",
              borderRadius: "12px",
              background: "#091723",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <div>
                <span className="panel-label">EDIT PROFILE</span>
                <h2 style={{ margin: "6px 0 0" }}>Update your profile</h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                }}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #17384a",
                  borderRadius: "7px",
                  background: "#0b1720",
                  color: "#8faabd",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: "14px",
                  padding: "10px 12px",
                  border: "1px solid #5b2730",
                  borderRadius: "7px",
                  background: "#241116",
                  color: "#ff8f9b",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            {loadingProfile ? (
              <p style={{ color: "#8faabd" }}>Loading profile...</p>
            ) : (
              <form onSubmit={handleSaveProfile}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "14px",
                  }}
                >
                  <label style={{ display: "grid", gap: "7px" }}>
                    <span style={{ color: "#8faabd", fontSize: "12px", fontWeight: 700 }}>Full name</span>
                    <input
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      style={{ padding: "11px 12px", border: "1px solid #17384a", borderRadius: "7px", background: "#07131d", color: "#fff" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "7px" }}>
                    <span style={{ color: "#8faabd", fontSize: "12px", fontWeight: 700 }}>Email</span>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ padding: "11px 12px", border: "1px solid #17384a", borderRadius: "7px", background: "#07131d", color: "#fff" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "7px" }}>
                    <span style={{ color: "#8faabd", fontSize: "12px", fontWeight: 700 }}>Phone number</span>
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      style={{ padding: "11px 12px", border: "1px solid #17384a", borderRadius: "7px", background: "#07131d", color: "#fff" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "7px" }}>
                    <span style={{ color: "#8faabd", fontSize: "12px", fontWeight: 700 }}>Skills</span>
                    <input
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB"
                      style={{ padding: "11px 12px", border: "1px solid #17384a", borderRadius: "7px", background: "#07131d", color: "#fff" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "7px", gridColumn: "1 / -1" }}>
                    <span style={{ color: "#8faabd", fontSize: "12px", fontWeight: 700 }}>Bio</span>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell recruiters about yourself"
                      style={{ padding: "11px 12px", border: "1px solid #17384a", borderRadius: "7px", background: "#07131d", color: "#fff", resize: "vertical" }}
                    />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    className="profile-edit-button"
                    style={{ cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ===================================================
            MAIN DASHBOARD GRID
        =================================================== */}

        <section className="candidate-dashboard-grid">


          {/* =================================================
              VERIFIED SKILLS
          ================================================= */}

          <div className="candidate-panel skills-panel">

            <div className="candidate-panel-header">

              <div>

                <span className="panel-label">
                  VERIFIED CAPABILITY
                </span>

                <h2>
                  Skills recruiters can trust.
                </h2>

              </div>


              <Link to="/candidate/skill-proof">

                Manage

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="candidate-skills-list">

              {displaySkills.length > 0 ? (
                displaySkills.slice(0, 5).map((skill) => (
                  <div
                    className="candidate-skill-row"
                    key={skill}
                  >

                    <div className="candidate-skill-icon">
                      <BadgeCheck size={15} />
                    </div>

                    <div>

                      <strong>
                        {skill}
                      </strong>

                      <span>
                        Added to your PulseHire profile
                      </span>

                    </div>

                    <span className="skill-verified">
                      Added
                    </span>

                  </div>
                ))
              ) : (
                <div className="candidate-skill-row">
                  <div className="candidate-skill-icon">
                    <BadgeCheck size={15} />
                  </div>
                  <div>
                    <strong>No skills added yet</strong>
                    <span>Use Edit Profile to add your skills.</span>
                  </div>
                </div>
              )}

            </div>

          </div>


          {/* =================================================
              NEXT ACTION
          ================================================= */}

          <div className="candidate-panel action-panel">

            <div className="candidate-panel-header">

              <div>

                <span className="panel-label">
                  RECOMMENDED NEXT STEP
                </span>

                <h2>
                  Strengthen your profile.
                </h2>

              </div>

            </div>


            <div className="candidate-action-card">

              <div className="candidate-action-icon">
                <Target size={20} />
              </div>


              <div>

                <strong>
                  Improve TypeScript
                </strong>

                <p>
                  TypeScript is currently your biggest
                  skill gap for your target roles.
                </p>


                <Link to="/candidate/learning">

                  View learning resources

                  <ArrowRight size={12} />

                </Link>

              </div>

            </div>


            <div className="candidate-action-card secondary">

              <div className="candidate-action-icon">
                <FileCheck2 size={20} />
              </div>


              <div>

                <strong>
                  Complete your proof
                </strong>

                <p>
                  One submitted skill is still waiting
                  for recruiter verification.
                </p>


                <Link to="/candidate/skill-proof">

                  View proof status

                  <ArrowRight size={12} />

                </Link>

              </div>

            </div>

          </div>


          {/* =================================================
              SKILL GAP
          ================================================= */}

          <div className="candidate-panel gap-panel">

            <div className="candidate-panel-header">

              <div>

                <span className="panel-label">
                  SKILL GAP INTELLIGENCE
                </span>

                <h2>
                  What could make you more hireable?
                </h2>

              </div>


              <Link to="/candidate/skill-gap">

                Explore

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="gap-main">

              <div className="gap-score">

                <strong>
                  20%
                </strong>

                <span>
                  current gap
                </span>

              </div>


              <div className="gap-description">

                <strong>
                  TypeScript
                </strong>

                <p>
                  Frequently requested in the roles
                  you're targeting.
                </p>


                <div className="gap-progress">

                  <div
                    className="gap-progress-fill"
                    style={{ width: "64%" }}
                  ></div>

                </div>


                <small>
                  64% skill readiness
                </small>

              </div>

            </div>


            <div className="gap-secondary-list">

              <div>

                <span>
                  Docker
                </span>

                <strong>
                  72%
                </strong>

              </div>


              <div>

                <span>
                  AWS
                </span>

                <strong>
                  61%
                </strong>

              </div>


              <div>

                <span>
                  Testing
                </span>

                <strong>
                  78%
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              JOB MATCHES
          ================================================= */}

          <div className="candidate-panel jobs-panel">

            <div className="candidate-panel-header">

              <div>

                <span className="panel-label">
                  JOB MATCHES
                </span>

                <h2>
                  Roles matching your verified skills.
                </h2>

              </div>


              <Link to="/candidate/jobs">

                Find more

                <ArrowRight size={12} />

              </Link>

            </div>


            <div className="candidate-job-list">


              <div className="candidate-job-row">

                <div className="job-company-icon">
                  TN
                </div>


                <div>

                  <strong>
                    Senior Full Stack Developer
                  </strong>

                  <span>
                    TechNova Systems · Bengaluru
                  </span>

                </div>


                <div className="job-match-score">
                  94%
                </div>


                <Link to="/candidate/jobs">

                  <ArrowRight size={13} />

                </Link>

              </div>


              <div className="candidate-job-row">

                <div className="job-company-icon">
                  PS
                </div>


                <div>

                  <strong>
                    Full Stack Engineer
                  </strong>

                  <span>
                    PixelStack · Remote
                  </span>

                </div>


                <div className="job-match-score">
                  89%
                </div>


                <Link to="/candidate/jobs">

                  <ArrowRight size={13} />

                </Link>

              </div>


              <div className="candidate-job-row">

                <div className="job-company-icon">
                  AC
                </div>


                <div>

                  <strong>
                    MERN Developer
                  </strong>

                  <span>
                    AppCore · Hyderabad
                  </span>

                </div>


                <div className="job-match-score">
                  84%
                </div>


                <Link to="/candidate/jobs">

                  <ArrowRight size={13} />

                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            INSIGHT
        =================================================== */}

        <section className="candidate-insight">

          <div className="candidate-insight-icon">
            <Lightbulb size={20} />
          </div>


          <div>

            <span className="panel-label">
              PULSEHIRE INSIGHT
            </span>

            <h2>
              Your profile is more than a resume.
            </h2>

            <p>
              Verified skills increase trust, skill-gap
              intelligence shows where to improve, and
              targeted learning helps you close those gaps.
              Every improvement makes your profile more useful
              to the right recruiter.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
};


export default CandidateProfile;