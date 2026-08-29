import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileCheck2,
    title: "Build your skill profile",
    description:
      "Add the technologies you know and attach real proof such as projects, GitHub work, portfolios, certificates, or assessments.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Get your skills verified",
    description:
      "Recruiters can validate candidate skills instead of relying only on claims written on a resume.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Discover your skill gaps",
    description:
      "PulseHire compares verified skills against job requirements and identifies the technologies you still need.",
  },
  {
    number: "04",
    icon: BookOpen,
    title: "Close the gap",
    description:
      "Get targeted learning resources for missing skills and continuously improve your hiring readiness.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Skill Identity",
    description:
      "Turn claimed skills into evidence-backed skills that recruiters can trust.",
  },
  {
    icon: BrainCircuit,
    title: "Skill Gap Intelligence",
    description:
      "Understand exactly which skills are missing for the jobs you want.",
  },
  {
    icon: Target,
    title: "Job Match Intelligence",
    description:
      "See how closely your verified capabilities align with real job requirements.",
  },
  {
    icon: BookOpen,
    title: "Learning Pathways",
    description:
      "Convert skill gaps into actionable learning resources instead of vague advice.",
  },
  {
    icon: Users,
    title: "Recruiter Validation",
    description:
      "Give recruiters a structured way to evaluate and verify candidate capabilities.",
  },
  {
    icon: TrendingUp,
    title: "Hiring Readiness",
    description:
      "Track progress from unverified skills to a stronger, evidence-backed professional profile.",
  },
];

const LandingSections = () => {
  return (
    <>
      <section className="how-section" id="how-it-works">
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">
              <Sparkles size={14} />
              THE PULSEHIRE APPROACH
            </span>

            <h2>
              From claimed skills to
              <span> verified potential.</span>
            </h2>

            <p>
              PulseHire connects skill discovery, proof, verification,
              job matching, and learning into one continuous hiring journey.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article className="step-card" key={step.number}>
                  <div className="step-top">
                    <span>{step.number}</span>

                    <div className="step-icon">
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="difference-section" id="why-pulsehire">
        <div className="section-container">
          <div className="difference-grid">
            <div className="difference-content">
              <span className="section-eyebrow">
                <BriefcaseBusiness size={14} />
                WHY PULSEHIRE
              </span>

              <h2>
                Recruitment should measure
                <span> capability.</span>
              </h2>

              <p>
                A resume tells recruiters what a candidate says they can do.
                PulseHire goes further by creating an evidence-based view of
                what candidates can demonstrate, what they are missing, and
                how they can improve.
              </p>

              <div className="difference-points">
                <div>
                  <CheckCircle2 size={19} />
                  <span>Skills backed by real proof</span>
                </div>

                <div>
                  <CheckCircle2 size={19} />
                  <span>Recruiter-verified capabilities</span>
                </div>

                <div>
                  <CheckCircle2 size={19} />
                  <span>Job-specific skill gap analysis</span>
                </div>

                <div>
                  <CheckCircle2 size={19} />
                  <span>Actionable learning resources</span>
                </div>
              </div>
            </div>

            <div className="comparison-card">
              <div className="comparison-column traditional">
                <span className="comparison-label">
                  TRADITIONAL
                </span>

                <div className="comparison-item muted">
                  <Search size={18} />
                  <span>Resume claims</span>
                </div>

                <div className="comparison-item muted">
                  <FileCheck2 size={18} />
                  <span>Static application</span>
                </div>

                <div className="comparison-item muted">
                  <Target size={18} />
                  <span>Generic job matching</span>
                </div>

                <div className="comparison-item muted">
                  <BookOpen size={18} />
                  <span>Learning is separate</span>
                </div>
              </div>

              <div className="comparison-divider">
                <span>VS</span>
              </div>

              <div className="comparison-column pulsehire">
                <span className="comparison-label">
                  PULSEHIRE
                </span>

                <div className="comparison-item">
                  <ShieldCheck size={18} />
                  <span>Verified skills</span>
                </div>

                <div className="comparison-item">
                  <BadgeCheck size={18} />
                  <span>Evidence-backed profile</span>
                </div>

                <div className="comparison-item">
                  <BrainCircuit size={18} />
                  <span>Skill-gap intelligence</span>
                </div>

                <div className="comparison-item">
                  <BookOpen size={18} />
                  <span>Targeted learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-heading centered">
            <span className="section-eyebrow">
              <Sparkles size={14} />
              CORE PLATFORM
            </span>

            <h2>
              Everything around one idea:
              <span> skills should be visible.</span>
            </h2>

            <p>
              Every major PulseHire feature contributes to a more
              transparent and skill-focused hiring process.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={22} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <ArrowRight
                    className="feature-arrow"
                    size={18}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-glow"></div>

          <div className="cta-content">
            <span className="section-eyebrow">
              <Sparkles size={14} />
              READY TO START?
            </span>

            <h2>
              Don't just apply.
              <br />
              <span>Become provable.</span>
            </h2>

            <p>
              Build a profile that shows what you know, proves what you can
              do, and tells you what to learn next.
            </p>

            <div className="cta-actions">
              <a
                href="/candidate/register"
                className="primary-button"
              >
                Build Your Skill Profile
                <ArrowRight size={18} />
              </a>

              <a
                href="/recruiter/register"
                className="secondary-button"
              >
                Start Hiring
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-icon">
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <strong>PulseHire</strong>
              <span>Recruitment powered by real skills.</span>
            </div>
          </div>

          <div className="footer-copy">
            © 2026 PulseHire. Built around skills, proof and potential.
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingSections;