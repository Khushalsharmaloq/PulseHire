export const requireVerifiedRecruiter = (req, res, next) => {
  if (!req.userId || !req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated.",
    });
  }

  if (req.userRole !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "A recruiter account is required for this action.",
    });
  }

  const verificationStatus =
    req.user.recruiterVerification?.status || "pending";

  if (verificationStatus !== "verified") {
    return res.status(403).json({
      success: false,
      code: "RECRUITER_VERIFICATION_REQUIRED",
      message:
        verificationStatus === "rejected"
          ? "Your recruiter verification was not approved. Contact support before continuing."
          : "Your recruiter account must be verified before you can access candidate data or publish jobs.",
      recruiterVerificationStatus: verificationStatus,
    });
  }

  next();
};
