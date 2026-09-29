import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const VerifiedRecruiterRoute = () => {
  const { user } = useAuth();

  const verificationStatus =
    user?.recruiterVerification?.status ||
    user?.recruiterVerificationStatus ||
    "pending";

  if (verificationStatus !== "verified") {
    return <Navigate to="/recruiter/account-verification" replace />;
  }

  return <Outlet />;
};

export default VerifiedRecruiterRoute;
