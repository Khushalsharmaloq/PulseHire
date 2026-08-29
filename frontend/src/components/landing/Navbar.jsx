import { ArrowRight, BriefcaseBusiness, Moon, Sun } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={20} />
          </div>

          <span>PulseHire</span>
        </a>

        <div className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
          <a href="#why-pulsehire">Why PulseHire</a>
        </div>

        <div className="nav-actions">
          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="/candidate/login" className="login-link">
            Login
          </a>

          <a href="/candidate/register" className="nav-cta">
            Get Started
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;