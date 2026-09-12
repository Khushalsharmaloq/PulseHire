import {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";


const AppShell = ({
  role,
}) => {

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  const closeMobileMenu =
    () => {
      setMobileMenuOpen(false);
    };


 useEffect(() => {

  if (!mobileMenuOpen) {
    return undefined;
  }


  const handleKeyDown =
    (event) => {

      if (
        event.key ===
        "Escape"
      ) {
        closeMobileMenu();
      }

    };


  window.addEventListener(
    "keydown",
    handleKeyDown
  );


  return () => {

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

  };

}, [mobileMenuOpen]);

  useEffect(() => {

    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return undefined;
    }


    document.body.style.overflow =
      "hidden";


    return () => {
      document.body.style.overflow =
        "";
    };

  }, [mobileMenuOpen]);


  return (
    <div
      className={`app-shell ${
        mobileMenuOpen
          ? "mobile-menu-open"
          : ""
      }`}
    >

      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      <AppSidebar
        role={role}
        onNavigate={
          closeMobileMenu
        }
      />


      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      <button
        type="button"
        className="app-mobile-overlay"
        onClick={
          closeMobileMenu
        }
        aria-label="Close navigation"
      />


      {/* =====================================================
          MOBILE SIDEBAR
          ===================================================== */}

      <div className="app-mobile-sidebar">

        <AppSidebar
          role={role}
          onNavigate={
            closeMobileMenu
          }
        />

      </div>


      {/* =====================================================
          APPLICATION AREA
          ===================================================== */}

      <div className="app-main">

        <AppTopbar
          role={role}
          onMenuClick={() =>
            setMobileMenuOpen(
              true
            )
          }
        />


        <main className="app-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
};


export default AppShell;