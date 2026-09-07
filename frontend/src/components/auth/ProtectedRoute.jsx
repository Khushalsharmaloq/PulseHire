import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until /user/me finishes checking the session
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <p>Checking your session...</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/candidate/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User is authenticated but has the wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;