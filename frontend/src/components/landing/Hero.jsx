import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={15} />
            Recruitment built around real skills
          </div>

          <h1>
            Don't just show your
            <span> resume.</span>
            <br />
            <strong>Prove your skills.</strong>
          </h1>

          <p className="hero-description">
            PulseHire connects candidates and recruiters through verified
            skills, intelligent skill-gap analysis, and targeted learning
            resources — creating a smarter path from learning to hiring.
          </p>

          <div className="hero-actions">
            <a href="/candidate/register" className="primary-button">
              Build Your Skill Profile
              <ArrowRight size={18} />
            </a>

            <a href="/recruiter/register" className="secondary-button">
              I'm a Recruiter
            </a>
          </div>

          <div className="hero-trust">
            <div>
              <ShieldCheck size={18} />
              Verified Skills
            </div>

            <div>
              <BrainCircuit size={18} />
              Skill Gap Intelligence
            </div>

            <div>
              <BadgeCheck size={18} />
              Recruiter Validation
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="dashboard-header">
              <div>
                <span className="small-label">HIRING READINESS</span>
                <h3>Candidate Profile</h3>
              </div>

              <div className="readiness-score">
                <span>82%</span>
                <small>Ready</small>
              </div>
            </div>

            <div className="skill-section">
              <div className="skill-title">
                <span>Verified Skills</span>
                <span>3 / 5</span>
              </div>

              <div className="skill-list">
                <div className="skill verified">
                  <span>React</span>
                  <BadgeCheck size={17} />
                </div>

                <div className="skill verified">
                  <span>Node.js</span>
                  <BadgeCheck size={17} />
                </div>

                <div className="skill verified">
                  <span>MongoDB</span>
                  <BadgeCheck size={17} />
                </div>
              </div>
            </div>

            <div className="gap-card">
              <div className="gap-icon">
                <BrainCircuit size={20} />
              </div>

              <div>
                <span>Skill Gap Detected</span>
                <strong>2 skills to improve</strong>
              </div>

              <ArrowRight size={18} />
            </div>

            <div className="dashboard-footer">
              <span>Profile strength</span>

              <div className="progress">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>

          <div className="floating-card floating-card-one">
            <BadgeCheck size={18} />
            <div>
              <strong>React Verified</strong>
              <span>Recruiter validated</span>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <BrainCircuit size={18} />
            <div>
              <strong>Skill Gap: 20%</strong>
              <span>4 resources available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;