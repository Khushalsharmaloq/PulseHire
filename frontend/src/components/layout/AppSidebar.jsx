import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  FileCheck2,
  LayoutDashboard,
  Search,
  Settings,
  Target,
  User,
  Users,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";


const candidateNavigation = [
  {
    label: "Dashboard",
    path: "/candidate/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    path: "/candidate/profile",
    icon: User,
  },
  {
    label: "Skill Proof",
    path: "/candidate/skill-proof",
    icon: BadgeCheck,
  },
  {
    label: "Skill Gap",
    path: "/candidate/skill-gap",
    icon: Target,
  },
  {
    label: "Learning",
    path: "/candidate/learning",
    icon: BookOpen,
  },
  {
    label: "Find Jobs",
    path: "/candidate/jobs",
    icon: Search,
  },
  {
    label: "Applications",
    path: "/candidate/applications",
    icon: FileCheck2,
  },
];


const recruiterNavigation = [
  {
    label: "Dashboard",
    path: "/recruiter/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Company",
    path: "/recruiter/company",
    icon: BriefcaseBusiness,
  },
  {
    label: "Jobs",
    path: "/recruiter/jobs",
    icon: Search,
  },
  {
    label: "Candidates",
    path: "/recruiter/candidates",
    icon: Users,
  },
  {
    label: "Applications",
    path: "/recruiter/applications",
    icon: FileCheck2,
  },
  {
    label: "Analytics",
    path: "/recruiter/analytics",
    icon: BarChart3,
  },
];


const AppSidebar = ({
  role,
  onNavigate,
}) => {

  const {
    user,
  } = useAuth();


  const navigation =
    role === "recruiter"
      ? recruiterNavigation
      : candidateNavigation;


  const workspaceLabel =
    role === "recruiter"
      ? "RECRUITER WORKSPACE"
      : "CANDIDATE WORKSPACE";


  const roleLabel =
    role === "recruiter"
      ? "Recruiter"
      : "Candidate";


  const getInitials = (
    name = ""
  ) => {

    const parts =
      String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);


    if (
      parts.length === 0
    ) {
      return "PH";
    }


    return parts
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  };


  const handleNavigation =
    () => {

      if (onNavigate) {
        onNavigate();
      }

    };


  return (
    <aside
      className="app-sidebar"
      aria-label={
        `${roleLabel} navigation`
      }
    >

      {/* =====================================================
          BRAND
          ===================================================== */}

      <NavLink
        to={
          role === "recruiter"
            ? "/recruiter/dashboard"
            : "/candidate/dashboard"
        }
        className="app-brand"
        onClick={
          handleNavigation
        }
      >

        <span className="app-brand-mark">
          PH
        </span>


        <span className="app-brand-name">
          PulseHire
        </span>

      </NavLink>


      {/* =====================================================
          WORKSPACE
          ===================================================== */}

      <div className="app-sidebar-section">

        <span className="app-sidebar-label">
          {workspaceLabel}
        </span>


        <nav
          className="app-sidebar-nav"
          aria-label="Workspace navigation"
        >

          {navigation.map(
            ({
              label,
              path,
              icon: Icon,
            }) => (

              <NavLink
                key={path}
                to={path}
                end
                onClick={
                  handleNavigation
                }
                className={({ isActive }) =>
                  `app-sidebar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >

                <Icon
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />


                <span>
                  {label}
                </span>

              </NavLink>

            )
          )}

        </nav>

      </div>


      {/* =====================================================
          SETTINGS
          ===================================================== */}

      <div className="app-sidebar-section app-sidebar-secondary">

        <span className="app-sidebar-label">
          ACCOUNT
        </span>


        <nav
          className="app-sidebar-nav"
          aria-label="Account navigation"
        >

          <NavLink
            to={
              role === "recruiter"
                ? "/recruiter/settings"
                : "/candidate/settings"
            }
            onClick={
              handleNavigation
            }
            className={({ isActive }) =>
              `app-sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <Settings
              size={18}
              strokeWidth={1.9}
              aria-hidden="true"
            />


            <span>
              Settings
            </span>

          </NavLink>

        </nav>

      </div>


      {/* =====================================================
          USER
          ===================================================== */}

      <div className="app-sidebar-bottom">

        <div className="app-sidebar-user">

          <div
            className="app-user-avatar"
            aria-hidden="true"
          >
            {getInitials(
              user?.fullname
            )}
          </div>


          <div className="app-user-info">

            <strong>
              {user?.fullname ||
                roleLabel}
            </strong>


            <span>
              {roleLabel}
            </span>

          </div>

        </div>


        <div className="app-sidebar-brand-note">
          Evidence-backed hiring
        </div>

      </div>

    </aside>
  );
};


export default AppSidebar;