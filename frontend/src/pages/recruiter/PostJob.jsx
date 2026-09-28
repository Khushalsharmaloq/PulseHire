import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  IndianRupee,
  MapPin,
  Plus,
  Save,
  Send,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { getRecruiterCompanies } from "../../services/recruiterCompanies";

import api from "../../services/api";

/* =========================================================
   CONSTANTS
   ========================================================= */

const JOB_TYPES = [
  {
    value: "full-time",
    label: "Full-time",
  },
  {
    value: "part-time",
    label: "Part-time",
  },
  {
    value: "internship",
    label: "Internship",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

const INITIAL_FORM = {
  companyId: "",
  title: "",
  description: "",
  location: "",
  jobType: "full-time",
  salaryMin: "",
  salaryMax: "",
  skills: [],
  requirements: [],
};

/* =========================================================
   HELPERS
   ========================================================= */

const formatSalaryPreview = (min, max) => {
  if (!min && !max) {
    return "Salary not specified";
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `₹${formatter.format(Number(min))} – ₹${formatter.format(
      Number(max),
    )}`;
  }

  if (min) {
    return `From ₹${formatter.format(Number(min))}`;
  }

  return `Up to ₹${formatter.format(Number(max))}`;
};

/* =========================================================
   COMPONENT
   ========================================================= */

const PostJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);

  const [companies, setCompanies] = useState([]);

  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [skillInput, setSkillInput] = useState("");

  const [requirementInput, setRequirementInput] = useState("");

  /* =======================================================
     LOAD COMPANIES
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadCompanies = async () => {
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

        /*
         * Automatically select the first company
         * when the recruiter has exactly / already
         * loaded their available companies.
         */
        if (loadedCompanies.length > 0) {
          setForm((current) => {
            if (current.companyId) {
              return current;
            }

            return {
              ...current,
              companyId: String(loadedCompanies[0]?._id || ""),
            };
          });
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Recruiter company loading error:", requestError);

        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load your companies.",
        );
      } finally {
        if (!cancelled) {
          setLoadingCompanies(false);
        }
      }
    };

    loadCompanies();

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
     ADD SKILL
     ======================================================= */

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) {
      return;
    }

    const existing = form.skills.map((skill) => String(skill).toLowerCase());

    if (existing.includes(value.toLowerCase())) {
      setSkillInput("");

      return;
    }

    setForm((current) => ({
      ...current,

      skills: [...current.skills, value],
    }));

    setSkillInput("");
  };

  /* =======================================================
     REMOVE SKILL
     ======================================================= */

  const removeSkill = (skill) => {
    setForm((current) => ({
      ...current,

      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  /* =======================================================
     SKILL KEY HANDLER
     ======================================================= */

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      addSkill();
    }
  };

  /* =======================================================
     ADD REQUIREMENT
     ======================================================= */

  const addRequirement = () => {
    const value = requirementInput.trim();

    if (!value) {
      return;
    }

    const duplicate = form.requirements.some(
      (requirement) =>
        String(requirement).toLowerCase() === value.toLowerCase(),
    );

    if (duplicate) {
      setRequirementInput("");

      return;
    }

    setForm((current) => ({
      ...current,

      requirements: [...current.requirements, value],
    }));

    setRequirementInput("");
  };

  /* =======================================================
     REMOVE REQUIREMENT
     ======================================================= */

  const removeRequirement = (requirement) => {
    setForm((current) => ({
      ...current,

      requirements: current.requirements.filter((item) => item !== requirement),
    }));
  };

  /* =======================================================
     REQUIREMENT KEY HANDLER
     ======================================================= */

  const handleRequirementKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      addRequirement();
    }
  };

  /* =======================================================
     VALIDATION
     ======================================================= */

  const validateForm = () => {
    if (!form.companyId) {
      return "Please select a company.";
    }

    if (!form.title.trim()) {
      return "Job title is required.";
    }

    if (!form.description.trim()) {
      return "Job description is required.";
    }

    if (!form.location.trim()) {
      return "Job location is required.";
    }

    if (!form.jobType) {
      return "Please select a job type.";
    }

    const minimum = form.salaryMin === "" ? null : Number(form.salaryMin);

    const maximum = form.salaryMax === "" ? null : Number(form.salaryMax);

    if (minimum !== null && (!Number.isFinite(minimum) || minimum < 0)) {
      return "Minimum salary must be a valid non-negative number.";
    }

    if (maximum !== null && (!Number.isFinite(maximum) || maximum < 0)) {
      return "Maximum salary must be a valid non-negative number.";
    }

    if (minimum !== null && maximum !== null && minimum > maximum) {
      return "Minimum salary cannot be greater than maximum salary.";
    }

    return "";
  };

  /* =======================================================
     SUBMIT
     ======================================================= */

  const submitJob = async (status) => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      setSuccess("");

      return;
    }

    try {
      setSubmitting(true);

      setError("");

      setSuccess("");

      const payload = {
        companyId: form.companyId,

        title: form.title.trim(),

        description: form.description.trim(),

        requirements: form.requirements,

        skills: form.skills,

        location: form.location.trim(),

        jobType: form.jobType,

        salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),

        salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),

        status,
      };

      const response = await api.post("/job/create", payload);

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Unable to create this job.",
        );
      }

      setSuccess(
        response.data.message ||
          (status === "draft"
            ? "Job saved as draft."
            : "Job posted successfully."),
      );

      /*
       * The POST operation returns the newly created
       * job. We deliberately navigate only after the
       * backend confirms success.
       */

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 700);
    } catch (requestError) {
      console.error("Create recruiter job error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to create this job.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     PREVIEW COMPANY
     ======================================================= */

  const selectedCompany =
    companies.find(
      (company) => String(company?._id) === String(form.companyId),
    ) || null;

  /* =======================================================
     NO COMPANIES
     ======================================================= */

  if (!loadingCompanies && companies.length === 0) {
    return (
      <section className="post-job-page">
        <Link to="/recruiter/jobs" className="post-job-back">
          <ArrowLeft size={14} />
          Back to jobs
        </Link>

        <div className="post-job-empty-company">
          <div className="post-job-empty-icon">
            <Building2 size={25} />
          </div>

          <span className="post-job-eyebrow">COMPANY REQUIRED</span>

          <h1>Create your company first.</h1>

          <p>
            Every PulseHire job must belong to a company owned by your recruiter
            account before it can be published.
          </p>

          <Link to="/recruiter/company" className="post-job-primary-button">
            <Plus size={14} />
            Set up company
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="post-job-page">
      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="post-job-header">
        <div>
          <Link to="/recruiter/jobs" className="post-job-back">
            <ArrowLeft size={14} />
            Back to jobs
          </Link>

          <span className="post-job-eyebrow">NEW OPPORTUNITY</span>

          <h1>Create a job.</h1>

          <p>
            Define the role clearly so candidates know what success looks like
            and your hiring pipeline can surface stronger matches.
          </p>
        </div>

        <div className="post-job-header-mark">
          <Sparkles size={18} />
        </div>
      </header>

      {/* ===================================================
          ALERTS
          =================================================== */}

      {error && (
        <div className="post-job-alert error" role="alert">
          <XCircle size={16} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="post-job-alert success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} />

          <span>{success}</span>
        </div>
      )}

      <div className="post-job-layout">
        {/* =================================================
            FORM
            ================================================= */}

        <form
          className="post-job-form"
          onSubmit={(event) => {
            event.preventDefault();

            submitJob("active");
          }}
        >
          {/* ===============================================
              COMPANY
              =============================================== */}

          <section className="post-job-card">
            <div className="post-job-card-heading">
              <div className="post-job-section-number">01</div>

              <div>
                <span>COMPANY</span>

                <h2>Where is this role based?</h2>

                <p>
                  Choose one of the companies owned by your recruiter account.
                </p>
              </div>
            </div>

            <label className="post-job-field">
              <span>Company</span>

              <div className="post-job-select-wrap">
                <Building2 size={15} />

                <select
                  value={form.companyId}
                  onChange={(event) =>
                    updateField("companyId", event.target.value)
                  }
                  disabled={loadingCompanies || submitting}
                >
                  <option value="">
                    {loadingCompanies
                      ? "Loading companies..."
                      : "Select your company"}
                  </option>

                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            {selectedCompany && (
              <div className="post-job-company-preview">
                <div className="post-job-company-avatar">
                  {selectedCompany.logo ? (
                    <img
                      src={selectedCompany.logo}
                      alt={`${selectedCompany.name} logo`}
                    />
                  ) : (
                    <Building2 size={18} />
                  )}
                </div>

                <div>
                  <strong>{selectedCompany.name}</strong>

                  <span>
                    {selectedCompany.location ||
                      "Company location not specified"}
                  </span>
                </div>

                <span>{selectedCompany.totalJobs ?? 0} jobs</span>
              </div>
            )}
          </section>

          {/* ===============================================
              BASIC DETAILS
              =============================================== */}

          <section className="post-job-card">
            <div className="post-job-card-heading">
              <div className="post-job-section-number">02</div>

              <div>
                <span>ROLE DETAILS</span>

                <h2>Define the opportunity.</h2>

                <p>
                  Give candidates enough context to understand the role before
                  they apply.
                </p>
              </div>
            </div>

            <label className="post-job-field">
              <span>Job title</span>

              <input
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Senior Full Stack Developer"
                disabled={submitting}
                maxLength={160}
              />
            </label>

            <label className="post-job-field">
              <span>Job description</span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe the role, responsibilities, team context and what the person will work on."
                rows={8}
                disabled={submitting}
              />

              <small>
                A clear description improves candidate understanding and search
                relevance.
              </small>
            </label>

            <div className="post-job-two-column">
              <label className="post-job-field">
                <span>Location</span>

                <div className="post-job-input-icon">
                  <MapPin size={15} />

                  <input
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="e.g. Bengaluru / Remote"
                    disabled={submitting}
                  />
                </div>
              </label>

              <label className="post-job-field">
                <span>Job type</span>

                <select
                  value={form.jobType}
                  onChange={(event) =>
                    updateField("jobType", event.target.value)
                  }
                  disabled={submitting}
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* ===============================================
              REQUIREMENTS
              =============================================== */}

          <section className="post-job-card">
            <div className="post-job-card-heading">
              <div className="post-job-section-number">03</div>

              <div>
                <span>CAPABILITIES</span>

                <h2>What should candidates bring?</h2>

                <p>
                  Skills and requirements become part of PulseHire's job
                  matching signals.
                </p>
              </div>
            </div>

            <div className="post-job-field">
              <span>Skills</span>

              <div className="post-job-token-input">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  disabled={submitting}
                />

                <button
                  type="button"
                  onClick={addSkill}
                  disabled={submitting || !skillInput.trim()}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="post-job-token-list">
                {form.skills.map((skill) => (
                  <span key={skill}>
                    {skill}

                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() => removeSkill(skill)}
                      disabled={submitting}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="post-job-field">
              <span>Requirements</span>

              <div className="post-job-token-input">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(event) => setRequirementInput(event.target.value)}
                  onKeyDown={handleRequirementKeyDown}
                  placeholder="Type a requirement and press Enter"
                  disabled={submitting}
                />

                <button
                  type="button"
                  onClick={addRequirement}
                  disabled={submitting || !requirementInput.trim()}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="post-job-token-list requirements">
                {form.requirements.map((requirement) => (
                  <span key={requirement}>
                    {requirement}

                    <button
                      type="button"
                      aria-label="Remove requirement"
                      onClick={() => removeRequirement(requirement)}
                      disabled={submitting}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ===============================================
              SALARY
              =============================================== */}

          <section className="post-job-card">
            <div className="post-job-card-heading">
              <div className="post-job-section-number">04</div>

              <div>
                <span>COMPENSATION</span>

                <h2>Set the salary range.</h2>

                <p>
                  Salary is optional, but providing a range gives candidates
                  useful context.
                </p>
              </div>
            </div>

            <div className="post-job-two-column">
              <label className="post-job-field">
                <span>Minimum salary</span>

                <div className="post-job-input-icon">
                  <IndianRupee size={15} />

                  <input
                    type="number"
                    min="0"
                    value={form.salaryMin}
                    onChange={(event) =>
                      updateField("salaryMin", event.target.value)
                    }
                    placeholder="e.g. 600000"
                    disabled={submitting}
                  />
                </div>
              </label>

              <label className="post-job-field">
                <span>Maximum salary</span>

                <div className="post-job-input-icon">
                  <IndianRupee size={15} />

                  <input
                    type="number"
                    min="0"
                    value={form.salaryMax}
                    onChange={(event) =>
                      updateField("salaryMax", event.target.value)
                    }
                    placeholder="e.g. 1200000"
                    disabled={submitting}
                  />
                </div>
              </label>
            </div>

            <div className="post-job-salary-preview">
              <span>Public salary preview</span>

              <strong>
                {formatSalaryPreview(form.salaryMin, form.salaryMax)}
              </strong>
            </div>
          </section>

          {/* ===============================================
              ACTIONS
              =============================================== */}

          <section className="post-job-submit-card">
            <div>
              <span className="post-job-eyebrow">READY TO PUBLISH?</span>

              <h2>Make this role visible to candidates.</h2>

              <p>
                You can publish it now or save it as a draft and return to it
                later.
              </p>
            </div>

            <div className="post-job-submit-actions">
              <button
                type="button"
                className="post-job-draft-button"
                onClick={() => submitJob("draft")}
                disabled={submitting}
              >
                <Save size={14} />

                {submitting ? "Saving..." : "Save draft"}
              </button>

              <button
                type="submit"
                className="post-job-publish-button"
                disabled={submitting}
              >
                <Send size={14} />

                {submitting ? "Publishing..." : "Publish job"}
              </button>
            </div>
          </section>
        </form>

        {/* =================================================
            LIVE PREVIEW
            ================================================= */}

        <aside className="post-job-preview">
          <div className="post-job-preview-header">
            <span className="post-job-eyebrow">LIVE PREVIEW</span>

            <span>Candidate view</span>
          </div>

          <div className="post-job-preview-card">
            <div className="post-job-preview-company">
              <div className="post-job-preview-company-icon">
                {selectedCompany?.logo ? (
                  <img src={selectedCompany.logo} alt="" />
                ) : (
                  <Building2 size={18} />
                )}
              </div>

              <div>
                <strong>{selectedCompany?.name || "Your company"}</strong>

                <span>{form.location || "Location"}</span>
              </div>
            </div>

            <h2>{form.title || "Your job title"}</h2>

            <div className="post-job-preview-meta">
              <span>
                <BriefcaseBusiness size={12} />

                {JOB_TYPES.find((item) => item.value === form.jobType)?.label ||
                  "Job type"}
              </span>

              <span>
                <MapPin size={12} />

                {form.location || "Location"}
              </span>

              <span>
                <IndianRupee size={12} />

                {formatSalaryPreview(form.salaryMin, form.salaryMax)}
              </span>
            </div>

            <div className="post-job-preview-divider" />

            <div className="post-job-preview-block">
              <span>DESCRIPTION</span>

              <p>
                {form.description ||
                  "Your job description will appear here as candidates review the opportunity."}
              </p>
            </div>

            <div className="post-job-preview-block">
              <span>SKILLS</span>

              <div className="post-job-preview-tags">
                {form.skills.length > 0 ? (
                  form.skills
                    .slice(0, 6)
                    .map((skill) => <span key={skill}>{skill}</span>)
                ) : (
                  <span>Skills will appear here</span>
                )}
              </div>
            </div>

            <div className="post-job-preview-match">
              <Sparkles size={14} />

              <div>
                <strong>PulseHire match intelligence</strong>

                <span>
                  Candidate matching uses the structured skills you
                  define.
                </span>
              </div>
            </div>

            <div className="post-job-preview-apply">Apply for this role</div>
          </div>

          <div className="post-job-preview-note">
            <FileText size={15} />

            <p>
              Only roles submitted through your recruiter account and attached
              to an owned company can be published.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default PostJob;
