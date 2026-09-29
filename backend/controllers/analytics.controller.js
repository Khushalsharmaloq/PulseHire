import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { SkillProof } from "../models/skillProof.model.js";

import { calculateJobMatch, uniqueSkills } from "../utils/match.util.js";

/*
|--------------------------------------------------------------------------
| GET RECRUITER ANALYTICS
|--------------------------------------------------------------------------
|
| All values are calculated from actual MongoDB records owned by
| the authenticated recruiter.
|
|--------------------------------------------------------------------------
*/

export const getRecruiterAnalytics = async (req, res) => {
  try {
    /* =================================================
           1. GET RECRUITER JOBS
        ================================================= */

    const jobs = await Job.find({
      recruiter: req.userId,
    })
      .select(
        "title description skills requirements location jobType status company createdAt lastRecruiterActivity",
      )
      .populate("company", "name logo location")
      .sort({
        createdAt: -1,
      })
      .lean();

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,

        summary: {
          totalJobs: 0,
          activeJobs: 0,
          draftJobs: 0,
          pausedJobs: 0,
          closedJobs: 0,

          totalApplications: 0,
          applicationsLast7Days: 0,

          applied: 0,
          reviewing: 0,
          shortlisted: 0,
          interview: 0,
          rejected: 0,
          hired: 0,

          verifiedApplicants: 0,
          strongMatches: 0,
          averageMatchRate: 0,
          averageResponseHours: 0,

          hiringConversionRate: 0,
          shortlistRate: 0,
          interviewRate: 0,
        },

        funnel: {
          applied: 0,
          reviewing: 0,
          shortlisted: 0,
          interview: 0,
          hired: 0,
          rejected: 0,
        },

        jobPerformance: [],

        topRequiredSkills: [],

        recentApplications: [],

        recentHiringActivity: [],
      });
    }

    const jobIds = jobs.map((job) => job._id);

    /* =================================================
           2. GET APPLICATIONS
        ================================================= */

    const applications = await Application.find({
      recruiter: req.userId,

      job: {
        $in: jobIds,
      },
    })
      .select(
        "job candidate status intentResponse appliedAt recruiterRespondedAt lastStatusChangedAt createdAt",
      )
      .populate("candidate", "fullname email profile")
      .sort({
        appliedAt: -1,
      })
      .lean();

    /* =================================================
           3. GET APPROVED PROOFS
        ================================================= */

    const candidateIds = [
      ...new Set(
        applications
          .map((application) => application.candidate?._id)
          .filter(Boolean)
          .map(String),
      ),
    ];

    let approvedProofs = [];

    if (candidateIds.length > 0) {
      approvedProofs = await SkillProof.find({
        candidate: {
          $in: candidateIds,
        },

        status: "approved",
      })
        .select("candidate skill")
        .lean();
    }

    /* =================================================
           4. GROUP VERIFIED SKILLS BY CANDIDATE
        ================================================= */

    const verifiedSkillsByCandidate = new Map();

    for (const proof of approvedProofs) {
      const candidateId = String(proof.candidate);

      if (!verifiedSkillsByCandidate.has(candidateId)) {
        verifiedSkillsByCandidate.set(candidateId, []);
      }

      verifiedSkillsByCandidate.get(candidateId).push(proof.skill);
    }

    /* =================================================
           5. JOB MAP
        ================================================= */

    const jobMap = new Map(jobs.map((job) => [String(job._id), job]));

    /* =================================================
           6. APPLICATION STATUS COUNTS
        ================================================= */

    const statusCounts = {
      applied: 0,
      reviewing: 0,
      shortlisted: 0,
      interview: 0,
      rejected: 0,
      hired: 0,
    };

    for (const application of applications) {
      if (
        Object.prototype.hasOwnProperty.call(statusCounts, application.status)
      ) {
        statusCounts[application.status] += 1;
      }
    }

    /* =================================================
           7. LAST 7 DAYS
        ================================================= */

    const now = Date.now();

    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const applicationsLast7Days = applications.filter((application) => {
      const appliedAt = application.appliedAt
        ? new Date(application.appliedAt).getTime()
        : 0;

      return appliedAt >= sevenDaysAgo;
    }).length;

    /* =================================================
           8. RESPONSE TIME
        ================================================= */

    const responseTimes = [];

    for (const application of applications) {
      if (!application.appliedAt || !application.recruiterRespondedAt) {
        continue;
      }

      const appliedAt = new Date(application.appliedAt).getTime();

      const respondedAt = new Date(application.recruiterRespondedAt).getTime();

      if (
        Number.isFinite(appliedAt) &&
        Number.isFinite(respondedAt) &&
        respondedAt >= appliedAt
      ) {
        const hours = (respondedAt - appliedAt) / (1000 * 60 * 60);

        responseTimes.push(hours);
      }
    }

    const averageResponseHours =
      responseTimes.length === 0
        ? 0
        : Math.round(
            (responseTimes.reduce((total, hours) => total + hours, 0) /
              responseTimes.length) *
              10,
          ) / 10;

    /* =================================================
           9. JOB PERFORMANCE
        ================================================= */

    const jobPerformance = jobs.map((job) => {
      const jobApplications = applications.filter(
        (application) => String(application.job) === String(job._id),
      );

      let strongMatches = 0;

      let totalMatchScore = 0;

      let scoredApplications = 0;

      let verifiedApplicants = 0;

      const requiredSkills = uniqueSkills(job.skills || []);

      for (const application of jobApplications) {
        const candidateId = String(application.candidate?._id);

        const verifiedSkills = verifiedSkillsByCandidate.get(candidateId) || [];

        if (verifiedSkills.length > 0) {
          verifiedApplicants += 1;
        }

        if (requiredSkills.length > 0) {
          const match = calculateJobMatch(requiredSkills, verifiedSkills);

          totalMatchScore += match.score;

          scoredApplications += 1;

          if (match.score >= 80) {
            strongMatches += 1;
          }
        }
      }

      const averageMatchRate =
        scoredApplications === 0
          ? 0
          : Math.round(totalMatchScore / scoredApplications);

      const hired = jobApplications.filter(
        (application) => application.status === "hired",
      ).length;

      const shortlisted = jobApplications.filter(
        (application) => application.status === "shortlisted",
      ).length;

      return {
        jobId: job._id,

        title: job.title,

        company: job.company ? job.company.name : "",

        status: job.status,

        applicants: jobApplications.length,

        verifiedApplicants,

        strongMatches,

        averageMatchRate,

        shortlisted,

        hired,

        requiredSkills,
      };
    });

    /* =================================================
           10. SORT JOB PERFORMANCE
        ================================================= */

    jobPerformance.sort((a, b) => b.applicants - a.applicants);

    /* =================================================
           11. REQUIRED SKILL FREQUENCY
        ================================================= */

    const skillFrequency = new Map();

    for (const job of jobs) {
      const requiredSkills = uniqueSkills(job.skills || []);

      for (const skill of requiredSkills) {
        const normalized = String(skill).trim().toLowerCase();

        if (!skillFrequency.has(normalized)) {
          skillFrequency.set(normalized, {
            skill,
            count: 0,
          });
        }

        skillFrequency.get(normalized).count += 1;
      }
    }

    const topRequiredSkills = [...skillFrequency.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    /* =================================================
           12. MATCH TOTALS
        ================================================= */

    const totalStrongMatches = jobPerformance.reduce(
      (total, job) => total + job.strongMatches,
      0,
    );

    const totalVerifiedApplicants = jobPerformance.reduce(
      (total, job) => total + job.verifiedApplicants,
      0,
    );

    const totalMatchScore = jobPerformance.reduce(
      (total, job) => total + job.averageMatchRate * job.applicants,
      0,
    );

    const jobsWithApplicants = jobPerformance.filter(
      (job) => job.applicants > 0,
    ).length;

    const averageMatchRate =
      jobsWithApplicants === 0
        ? 0
        : Math.round(totalMatchScore / applications.length);

    /* =================================================
           13. CONVERSION RATES
        ================================================= */

    const totalApplications = applications.length;

    const hiringConversionRate =
      totalApplications === 0
        ? 0
        : Math.round((statusCounts.hired / totalApplications) * 100);

    const shortlistRate =
      totalApplications === 0
        ? 0
        : Math.round((statusCounts.shortlisted / totalApplications) * 100);

    const interviewRate =
      totalApplications === 0
        ? 0
        : Math.round((statusCounts.interview / totalApplications) * 100);

    /* =================================================
           14. RECENT APPLICATIONS
        ================================================= */

    const recentApplications = applications.slice(0, 10).map((application) => {
      const job = jobMap.get(String(application.job));

      return {
        applicationId: application._id,

        candidate: application.candidate
          ? {
              id: application.candidate._id,

              fullname: application.candidate.fullname,

              email: application.candidate.email,
            }
          : null,

        job: job
          ? {
              id: job._id,

              title: job.title,
            }
          : null,

        status: application.status,

        appliedAt: application.appliedAt,
      };
    });

    /* =================================================
           15. RECENT HIRING ACTIVITY
        ================================================= */

    const recentHiringActivity = applications
      .filter((application) =>
        ["shortlisted", "interview", "hired", "rejected"].includes(
          application.status,
        ),
      )
      .slice(0, 10)
      .map((application) => {
        const job = jobMap.get(String(application.job));

        return {
          applicationId: application._id,

          candidate: application.candidate
            ? application.candidate.fullname
            : "Candidate",

          job: job ? job.title : "Job",

          status: application.status,

          updatedAt: application.lastStatusChangedAt,
        };
      });

    /* =================================================
           16. RESPONSE
        ================================================= */

    return res.status(200).json({
      success: true,

      summary: {
        totalJobs: jobs.length,

        activeJobs: jobs.filter((job) => job.status === "active").length,

        draftJobs: jobs.filter((job) => job.status === "draft").length,

        pausedJobs: jobs.filter((job) => job.status === "paused").length,

        closedJobs: jobs.filter((job) => job.status === "closed").length,

        totalApplications,

        applicationsLast7Days,

        applied: statusCounts.applied,

        reviewing: statusCounts.reviewing,

        shortlisted: statusCounts.shortlisted,

        interview: statusCounts.interview,

        rejected: statusCounts.rejected,

        hired: statusCounts.hired,

        verifiedApplicants: totalVerifiedApplicants,

        strongMatches: totalStrongMatches,

        averageMatchRate,

        averageResponseHours,

        hiringConversionRate,

        shortlistRate,

        interviewRate,
      },

      funnel: {
        applied:
          statusCounts.applied +
          statusCounts.reviewing +
          statusCounts.shortlisted +
          statusCounts.interview +
          statusCounts.hired,

        reviewing:
          statusCounts.reviewing +
          statusCounts.shortlisted +
          statusCounts.interview +
          statusCounts.hired,

        shortlisted:
          statusCounts.shortlisted +
          statusCounts.interview +
          statusCounts.hired,

        interview: statusCounts.interview + statusCounts.hired,

        hired: statusCounts.hired,

        rejected: statusCounts.rejected,
      },

      jobPerformance,

      topRequiredSkills,

      recentApplications,

      recentHiringActivity,
    });
  } catch (error) {
    console.error("Get recruiter analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to calculate recruiter analytics.",
    });
  }
};
