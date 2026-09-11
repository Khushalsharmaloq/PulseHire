import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import useAuth from "../../hooks/useAuth";


const AppTopbar = ({
  role,
  onMenuClick,
}) => {

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const [menuOpen, setMenuOpen] =
    useState(false);


  const roleLabel =
    role === "recruiter"
      ? "Recruiter"
      : "Candidate";


  const profilePath =
    role === "recruiter"
      ? "/recruiter/company"
      : "/candidate/profile";


  const jobsPath =
    role === "recruiter"
      ? "/recruiter/jobs"
      : "/candidate/jobs";


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


  const handleLogout =
    async () => {

      setMenuOpen(false);

      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  return (
    <header className="app-topbar">

      <div className="app-topbar-left">

        <button
          type="button"
          className="app-mobile-menu"
          onClick={
            onMenuClick
          }
          aria-label="Open navigation"
        >
          <Menu
            size={21}
          />
        </button>


        <div className="app-page-context">

          <span>
            PULSEHIRE
          </span>

          <strong>
            {roleLabel} workspace
          </strong>

        </div>

      </div>


      <div className="app-topbar-actions">

        {/* ===================================================
            SEARCH
            =================================================== */}

        <Link
          to={jobsPath}
          className="app-topbar-search"
          aria-label={
            role === "recruiter"
              ? "Open recruiter jobs"
              : "Find jobs"
          }
        >

          <Search
            size={17}
            aria-hidden="true"
          />

          <span>
            {role === "recruiter"
              ? "Manage jobs"
              : "Find opportunities"}
          </span>

        </Link>


        {/* ===================================================
            NOTIFICATION PLACEHOLDER
            =================================================== */}

        <button
          type="button"
          className="app-notification-button"
          aria-label="Notifications"
          disabled
          title="Notifications coming soon"
        >

          <Bell
            size={18}
            aria-hidden="true"
          />

        </button>


        {/* ===================================================
            USER MENU
            =================================================== */}

        <div className="app-user-menu">

          <button
            type="button"
            className="app-user-menu-trigger"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              menuOpen
            }
            aria-haspopup="menu"
          >

            <span className="app-user-menu-avatar">
              {getInitials(
                user?.fullname
              )}
            </span>


            <span className="app-user-menu-name">
              {user?.fullname ||
                roleLabel}
            </span>


            <ChevronDown
              size={15}
              aria-hidden="true"
            />

          </button>


          {menuOpen && (

            <div
              className="app-user-menu-dropdown"
              role="menu"
            >

              <div className="app-user-menu-heading">

                <strong>
                  {user?.fullname ||
                    roleLabel}
                </strong>


                <span>
                  {user?.email ||
                    ""}
                </span>

              </div>


              <div className="app-user-menu-divider" />


              <Link
                to={profilePath}
                className="app-user-menu-item"
                role="menuitem"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <User
                  size={16}
                />

                Profile

              </Link>


              <button
                type="button"
                className="app-user-menu-item danger"
                role="menuitem"
                onClick={
                  handleLogout
                }
              >

                <LogOut
                  size={16}
                />

                Sign out

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
};


export default AppTopbar;