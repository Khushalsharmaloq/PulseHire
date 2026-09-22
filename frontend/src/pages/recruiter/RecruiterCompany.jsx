import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Globe,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  X,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  createRecruiterCompany,
  getRecruiterCompanies,
  getRecruiterCompanyJobs,
  updateRecruiterCompany,
} from "../../services/recruiterCompanies";

/* =========================================================
   INITIAL FORM
   ========================================================= */

const INITIAL_FORM = {
  name: "",
  description: "",
  website: "",
  location: "",
  logo: "",
};

/* =========================================================
   HELPERS
   ========================================================= */

const getCompanyInitials = (name) => {
  const parts = String(name || "Company")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CO";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatUrl = (value) => {
  if (!value) {
    return "";
  }

  const text = String(value).trim();

  if (/^https?:\/\//i.test(text)) {
    return text;
  }

  return `https://${text}`;
};

const validateCompany = (form) => {
  const name = form.name.trim();

  if (!name) {
    return "Company name is required.";
  }

  if (name.length < 2) {
    return "Company name must contain at least 2 characters.";
  }

  if (name.length > 120) {
    return "Company name cannot exceed 120 characters.";
  }

  return "";
};

/* =========================================================
   COMPONENT
   ========================================================= */

const RecruiterCompany = () => {
  const [companies, setCompanies] = useState([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const [companyJobs, setCompanyJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingJobs, setLoadingJobs] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingCompanyId, setEditingCompanyId] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  /* =======================================================
     LOAD COMPANIES
     ======================================================= */

  const loadCompanies = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getRecruiterCompanies();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load your companies.");
      }

      const loadedCompanies = Array.isArray(response.companies)
        ? response.companies
        : [];

      setCompanies(loadedCompanies);

      setSelectedCompanyId((currentId) => {
        if (
          loadedCompanies.some(
            (company) => String(company?._id) === String(currentId),
          )
        ) {
          return currentId;
        }

        return loadedCompanies[0]?._id || null;
      });
    } catch (requestError) {
      console.error("Recruiter companies load error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load your companies.",
      );
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getRecruiterCompanies();

        if (cancelled) {
          return;
        }

        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to load your companies.",
          );
        }

        const loadedCompanies = Array.isArray(response.companies)
          ? response.companies
          : [];

        setCompanies(loadedCompanies);

        setSelectedCompanyId(loadedCompanies[0]?._id || null);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Recruiter companies initial load error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load your companies.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     SELECTED COMPANY
     ======================================================= */

  const selectedCompany = useMemo(() => {
    return (
      companies.find(
        (company) => String(company?._id) === String(selectedCompanyId),
      ) || null
    );
  }, [companies, selectedCompanyId]);

  /* =======================================================
     LOAD COMPANY JOBS
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      if (!selectedCompanyId) {
        setCompanyJobs([]);

        return;
      }

      try {
        setLoadingJobs(true);

        const response = await getRecruiterCompanyJobs(selectedCompanyId);

        if (cancelled) {
          return;
        }

        if (!response?.success) {
          throw new Error(response?.message || "Unable to load company jobs.");
        }

        setCompanyJobs(Array.isArray(response.jobs) ? response.jobs : []);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Company jobs loading error:", requestError);

        setCompanyJobs([]);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load company jobs.",
        );
      } finally {
        if (!cancelled) {
          setLoadingJobs(false);
        }
      }
    };

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [selectedCompanyId]);

  /* =======================================================
     OPEN CREATE
     ======================================================= */

  const openCreate = () => {
    setEditingCompanyId(null);

    setForm(INITIAL_FORM);

    setError("");

    setSuccess("");

    setIsFormOpen(true);
  };

  /* =======================================================
     OPEN EDIT
     ======================================================= */

  const openEdit = (company) => {
    setEditingCompanyId(company?._id || null);

    setForm({
      name: company?.name || "",

      description: company?.description || "",

      website: company?.website || "",

      location: company?.location || "",

      logo: company?.logo || "",
    });

    setError("");

    setSuccess("");

    setIsFormOpen(true);
  };

  /* =======================================================
     CLOSE FORM
     ======================================================= */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setIsFormOpen(false);

    setEditingCompanyId(null);

    setForm(INITIAL_FORM);
  };

  /* =======================================================
     FIELD CHANGE
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
     SAVE COMPANY
     ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateCompany(form);

    if (validationError) {
      setError(validationError);

      setSuccess("");

      return;
    }

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const payload = {
        name: form.name.trim(),

        description: form.description.trim(),

        website: formatUrl(form.website),

        location: form.location.trim(),

        logo: form.logo.trim(),
      };

      let response;

      if (editingCompanyId) {
        response = await updateRecruiterCompany(editingCompanyId, payload);
      } else {
        response = await createRecruiterCompany(payload);
      }

      if (!response?.success) {
        throw new Error(response?.message || "Unable to save company.");
      }

      setSuccess(
        response.message ||
          (editingCompanyId
            ? "Company updated successfully."
            : "Company created successfully."),
      );

      setIsFormOpen(false);

      setEditingCompanyId(null);

      setForm(INITIAL_FORM);

      await loadCompanies();
    } catch (requestError) {
      console.error("Save recruiter company error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to save company.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS COUNTS
     ======================================================= */

  const activeJobs = companyJobs.filter(
    (job) => job?.status === "active",
  ).length;

  const draftJobs = companyJobs.filter((job) => job?.status === "draft").length;

  const closedJobs = companyJobs.filter(
    (job) => job?.status === "closed",
  ).length;

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="recruiter-company-page">
        <div
          className="recruiter-company-loading"
          role="status"
          aria-live="polite"
        >
          <RefreshCw size={28} className="recruiter-company-spin" />

          <h1>Loading your companies</h1>

          <p>We're preparing your recruiter company workspace.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recruiter-company-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="recruiter-company-header">
        <div>
          <span className="recruiter-company-eyebrow">COMPANY WORKSPACE</span>

          <h1>Build the company behind your roles.</h1>

          <p>
            Manage your recruiter companies and keep every published opportunity
            connected to the right organization.
          </p>
        </div>

        <div className="recruiter-company-header-actions">
          <button
            type="button"
            className="recruiter-company-refresh"
            onClick={() => loadCompanies(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={14}
              className={refreshing ? "recruiter-company-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="recruiter-company-create"
            onClick={openCreate}
          >
            <Plus size={14} />
            Add company
          </button>
        </div>
      </header>

      {/* ===================================================
          ALERTS
          =================================================== */}

      {error && (
        <div className="recruiter-company-alert error" role="alert">
          <XCircle size={16} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="recruiter-company-alert success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} />

          <span>{success}</span>
        </div>
      )}

      {/* ===================================================
          SUMMARY
          =================================================== */}

      <section className="recruiter-company-summary">
        <div className="recruiter-company-summary-card">
          <span>COMPANIES</span>

          <strong>{companies.length}</strong>

          <small>organizations in your workspace</small>
        </div>

        <div className="recruiter-company-summary-card">
          <span>ACTIVE ROLES</span>

          <strong>{activeJobs}</strong>

          <small>currently accepting candidates</small>
        </div>

        <div className="recruiter-company-summary-card">
          <span>DRAFT ROLES</span>

          <strong>{draftJobs}</strong>

          <small>still being prepared</small>
        </div>

        <div className="recruiter-company-summary-card">
          <span>CLOSED ROLES</span>

          <strong>{closedJobs}</strong>

          <small>completed opportunities</small>
        </div>
      </section>

      {/* ===================================================
          COMPANY LIST
          =================================================== */}

      <section className="recruiter-company-workspace">
        <div className="recruiter-company-list-panel">
          <div className="recruiter-company-section-heading">
            <div>
              <span className="recruiter-company-eyebrow">
                YOUR ORGANIZATIONS
              </span>

              <h2>Companies</h2>

              <p>Select a company to inspect its hiring activity.</p>
            </div>

            <span className="recruiter-company-count">{companies.length}</span>
          </div>

          {companies.length === 0 ? (
            <div className="recruiter-company-empty">
              <div className="recruiter-company-empty-icon">
                <Building2 size={24} />
              </div>

              <span className="recruiter-company-eyebrow">GET STARTED</span>

              <h3>No company has been created yet.</h3>

              <p>Create your first company before publishing your first job.</p>

              <button
                type="button"
                className="recruiter-company-primary-button"
                onClick={openCreate}
              >
                <Plus size={14} />
                Create company
              </button>
            </div>
          ) : (
            <div className="recruiter-company-list">
              {companies.map((company) => {
                const selected =
                  String(selectedCompanyId) === String(company?._id);

                return (
                  <button
                    type="button"
                    key={company?._id}
                    className={
                      selected
                        ? "recruiter-company-list-item selected"
                        : "recruiter-company-list-item"
                    }
                    onClick={() => setSelectedCompanyId(company?._id)}
                  >
                    <div className="recruiter-company-list-avatar">
                      {company?.logo ? (
                        <img src={company.logo} alt="" />
                      ) : (
                        getCompanyInitials(company?.name)
                      )}
                    </div>

                    <div className="recruiter-company-list-copy">
                      <strong>{company?.name || "Unnamed company"}</strong>

                      <span>
                        {company?.location || "Location not specified"}
                      </span>

                      <small>
                        {company?.totalJobs ?? 0} total jobs ·{" "}
                        {company?.activeJobs ?? 0} active
                      </small>
                    </div>

                    <ArrowRight size={14} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* =================================================
            COMPANY DETAIL
            ================================================= */}

        <div className="recruiter-company-detail-panel">
          {!selectedCompany ? (
            <div className="recruiter-company-no-selection">
              <Building2 size={27} />

              <h2>Select a company</h2>

              <p>
                Choose an organization from the left to see its profile and
                hiring activity.
              </p>
            </div>
          ) : (
            <>
              {/* =========================================
                  COMPANY PROFILE
                  ========================================= */}

              <div className="recruiter-company-detail-header">
                <div className="recruiter-company-detail-identity">
                  <div className="recruiter-company-detail-logo">
                    {selectedCompany?.logo ? (
                      <img
                        src={selectedCompany.logo}
                        alt={`${selectedCompany.name} logo`}
                      />
                    ) : (
                      getCompanyInitials(selectedCompany.name)
                    )}
                  </div>

                  <div>
                    <span className="recruiter-company-eyebrow">
                      COMPANY PROFILE
                    </span>

                    <h2>{selectedCompany.name}</h2>

                    <p>
                      {selectedCompany.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="recruiter-company-edit-button"
                  onClick={() => openEdit(selectedCompany)}
                >
                  <Pencil size={13} />
                  Edit
                </button>
              </div>

              <div className="recruiter-company-profile-grid">
                <div className="recruiter-company-profile-item">
                  <MapPin size={14} />

                  <div>
                    <span>LOCATION</span>

                    <strong>
                      {selectedCompany.location || "Not specified"}
                    </strong>
                  </div>
                </div>

                <div className="recruiter-company-profile-item">
                  <Globe size={14} />

                  <div>
                    <span>WEBSITE</span>

                    {selectedCompany.website ? (
                      <a
                        href={formatUrl(selectedCompany.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedCompany.website}
                      </a>
                    ) : (
                      <strong>Not provided</strong>
                    )}
                  </div>
                </div>

                <div className="recruiter-company-profile-item">
                  <BriefcaseBusiness size={14} />

                  <div>
                    <span>TOTAL JOBS</span>

                    <strong>{selectedCompany.totalJobs ?? 0}</strong>
                  </div>
                </div>

                <div className="recruiter-company-profile-item">
                  <CheckCircle2 size={14} />

                  <div>
                    <span>ACTIVE JOBS</span>

                    <strong>{selectedCompany.activeJobs ?? 0}</strong>
                  </div>
                </div>
              </div>

              <div className="recruiter-company-description">
                <span>ABOUT THE COMPANY</span>

                <p>
                  {selectedCompany.description ||
                    "No company description has been added yet."}
                </p>
              </div>

              {/* =========================================
                  COMPANY JOBS
                  ========================================= */}

              <div className="recruiter-company-jobs">
                <div className="recruiter-company-jobs-heading">
                  <div>
                    <span className="recruiter-company-eyebrow">
                      HIRING ACTIVITY
                    </span>

                    <h3>Jobs from this company</h3>
                  </div>

                  <Link
                    to="/recruiter/jobs/new"
                    className="recruiter-company-post-job"
                  >
                    <Plus size={13} />
                    Post job
                  </Link>
                </div>

                {loadingJobs ? (
                  <div className="recruiter-company-jobs-loading">
                    <RefreshCw size={20} className="recruiter-company-spin" />

                    <span>Loading jobs...</span>
                  </div>
                ) : companyJobs.length === 0 ? (
                  <div className="recruiter-company-jobs-empty">
                    <BriefcaseBusiness size={22} />

                    <strong>No jobs for this company yet.</strong>

                    <span>Create a role and it will appear here.</span>
                  </div>
                ) : (
                  <div className="recruiter-company-jobs-list">
                    {companyJobs.map((job) => (
                      <div className="recruiter-company-job-row" key={job?._id}>
                        <div className="recruiter-company-job-icon">
                          <BriefcaseBusiness size={15} />
                        </div>

                        <div className="recruiter-company-job-copy">
                          <strong>{job?.title || "Untitled role"}</strong>

                          <span>
                            {job?.location || "Location not specified"}
                            {" · "}
                            {job?.jobType || "Job type not specified"}
                          </span>
                        </div>

                        <span
                          className={`recruiter-company-job-status ${
                            job?.status || "unknown"
                          }`}
                        >
                          {job?.status || "Unknown"}
                        </span>

                        <Link
                          to={`/recruiter/applications/${job?._id}`}
                          className="recruiter-company-job-link"
                        >
                          Applicants
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===================================================
          CREATE / EDIT MODAL
          =================================================== */}

      {isFormOpen && (
        <div className="recruiter-company-modal-backdrop" role="presentation">
          <div
            className="recruiter-company-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recruiter-company-modal-title"
          >
            <div className="recruiter-company-modal-header">
              <div>
                <span className="recruiter-company-eyebrow">
                  {editingCompanyId ? "UPDATE COMPANY" : "NEW COMPANY"}
                </span>

                <h2 id="recruiter-company-modal-title">
                  {editingCompanyId
                    ? "Edit your company."
                    : "Create a company."}
                </h2>
              </div>

              <button
                type="button"
                className="recruiter-company-modal-close"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close company form"
              >
                <X size={16} />
              </button>
            </div>

            <form className="recruiter-company-form" onSubmit={handleSubmit}>
              <label className="recruiter-company-field">
                <span>Company name</span>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. TechNova Systems"
                  maxLength={120}
                  disabled={saving}
                  autoFocus
                />
              </label>

              <label className="recruiter-company-field">
                <span>Description</span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the company, product, culture or team."
                  rows={6}
                  disabled={saving}
                />
              </label>

              <div className="recruiter-company-two-column">
                <label className="recruiter-company-field">
                  <span>Location</span>

                  <input
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="e.g. Bengaluru"
                    disabled={saving}
                  />
                </label>

                <label className="recruiter-company-field">
                  <span>Website</span>

                  <input
                    type="text"
                    value={form.website}
                    onChange={(event) =>
                      updateField("website", event.target.value)
                    }
                    placeholder="https://example.com"
                    disabled={saving}
                  />
                </label>
              </div>

              <label className="recruiter-company-field">
                <span>Logo URL</span>

                <input
                  type="url"
                  value={form.logo}
                  onChange={(event) => updateField("logo", event.target.value)}
                  placeholder="https://..."
                  disabled={saving}
                />

                <small>
                  Add a public image URL if your company has a logo. File
                  uploading is not part of the current Company API.
                </small>
              </label>

              {error && (
                <div className="recruiter-company-form-error" role="alert">
                  <XCircle size={14} />

                  <span>{error}</span>
                </div>
              )}

              <div className="recruiter-company-form-actions">
                <button
                  type="button"
                  className="recruiter-company-cancel"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="recruiter-company-save"
                  disabled={saving}
                >
                  <Save size={14} />

                  {saving
                    ? "Saving..."
                    : editingCompanyId
                      ? "Save changes"
                      : "Create company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecruiterCompany;
