import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const getDashboardPath = (role) => {
  if (role === "candidate") {
    return "/candidate/dashboard";
  }

  if (role === "recruiter") {
    return "/recruiter/dashboard";
  }

  if (role === "admin") {
    return "/admin/recruiters";
  }

  return "/";
};

const PublicOnlyRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "32px",
        }}
      >
        <p>Preparing PulseHire...</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;