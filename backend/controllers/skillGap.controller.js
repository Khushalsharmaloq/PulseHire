import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { SkillProof } from "../models/skillProof.model.js";


// =====================================================
// HELPER — NORMALIZE SKILL
// =====================================================

const normalizeSkill = (skill) => {
  return String(skill || "")
    .trim()
    .toLowerCase();
};


// =====================================================
// HELPER — UNIQUE SKILLS
// =====================================================

const uniqueSkills = (skills = []) => {
  const map = new Map();

  skills.forEach((skill) => {
    const original = String(skill || "").trim();

    if (!original) {
      return;
    }

    const normalized = normalizeSkill(original);

    if (!map.has(normalized)) {
      map.set(normalized, original);
    }
  });

  return [...map.values()];
};


// =====================================================
// GET CANDIDATE SKILL GAP INTELLIGENCE
// =====================================================

export const getSkillGapIntelligence = async (req, res) => {
  try {
    // -------------------------------------------------
    // 1. GET CURRENT CANDIDATE
    // -------------------------------------------------

    const candidate = await User.findById(req.userId).select(
      "fullname role profile.skills"
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }


    // -------------------------------------------------
    // 2. GET CLAIMED SKILLS
    // -------------------------------------------------

    const claimedSkills = uniqueSkills(
      candidate.profile?.skills || []
    );


    // -------------------------------------------------
    // 3. GET VERIFIED SKILLS
    // -------------------------------------------------

    const verifiedProofs = await SkillProof.find({
      candidate: req.userId,
      status: "approved",
    }).select("skill");


    const verifiedSkills = uniqueSkills(
      verifiedProofs.map((proof) => proof.skill)
    );


    // -------------------------------------------------
    // 4. GET ACTIVE JOBS
    // -------------------------------------------------

    const jobs = await Job.find({
      status: "active",
    })
      .select(
        "title description skills location jobType company recruiter"
      )
      .populate("company", "name logo");


    // -------------------------------------------------
    // 5. NO ACTIVE JOBS
    // -------------------------------------------------

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,

        readiness: 0,
        currentGap: 0,
        potential: 0,

        claimedSkills,
        verifiedSkills,

        priorityGaps: [],
        roleAnalysis: [],
        rolesAnalysed: 0,

        message:
          "No active roles are available for skill gap analysis yet.",
      });
    }


    // -------------------------------------------------
    // 6. PREPARE VERIFIED SKILL LOOKUP
    // -------------------------------------------------

    const verifiedSkillSet = new Set(
      verifiedSkills.map(normalizeSkill)
    );


    // -------------------------------------------------
    // 7. ROLE ANALYSIS
    // -------------------------------------------------

    const roleAnalysis = jobs
      .map((job) => {
        const requiredSkills = uniqueSkills(
          job.skills || []
        );

        const matchedSkills = requiredSkills.filter(
          (skill) =>
            verifiedSkillSet.has(normalizeSkill(skill))
        );

        const skillGaps = requiredSkills.filter(
          (skill) =>
            !verifiedSkillSet.has(normalizeSkill(skill))
        );

        const matchPercentage =
          requiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length /
                  requiredSkills.length) *
                  100
              );

        return {
          jobId: job._id,
          title: job.title,

          company: job.company
            ? {
                id: job.company._id,
                name: job.company.name,
                logo: job.company.logo || "",
              }
            : null,

          requiredSkills,

          verifiedSkills: matchedSkills,

          matchedSkills,

          skillGaps,

          matchPercentage,
        };
      })
      .filter(
        (role) => role.requiredSkills.length > 0
      );


    // -------------------------------------------------
    // 8. CALCULATE OVERALL READINESS
    // -------------------------------------------------

    let totalRequiredSkills = 0;
    let totalMatchedSkills = 0;

    roleAnalysis.forEach((role) => {
      totalRequiredSkills += role.requiredSkills.length;
      totalMatchedSkills += role.matchedSkills.length;
    });


    const readiness =
      totalRequiredSkills === 0
        ? 0
        : Math.round(
            (totalMatchedSkills /
              totalRequiredSkills) *
              100
          );


    const currentGap = Math.max(
      0,
      100 - readiness
    );


    // -------------------------------------------------
    // 9. CALCULATE PRIORITY GAPS
    // -------------------------------------------------

    const gapMap = new Map();

    roleAnalysis.forEach((role) => {
      role.skillGaps.forEach((skill) => {
        const normalized = normalizeSkill(skill);

        if (!gapMap.has(normalized)) {
          gapMap.set(normalized, {
            skill,
            occurrences: 0,
            roleCount: 0,
          });
        }

        const gap = gapMap.get(normalized);

        gap.occurrences += 1;
        gap.roleCount += 1;
      });
    });


    // -------------------------------------------------
    // 10. BUILD PRIORITY GAP LIST
    // -------------------------------------------------

    const priorityGaps = [...gapMap.values()]
      .map((gap) => {
        const rolePercentage =
          jobs.length === 0
            ? 0
            : Math.round(
                (gap.roleCount / jobs.length) *
                  100
              );

        const readinessForSkill = verifiedSkillSet.has(
          normalizeSkill(gap.skill)
        )
          ? 100
          : 0;

        let priority = "medium";

        if (rolePercentage >= 60) {
          priority = "high";
        } else if (rolePercentage >= 30) {
          priority = "medium";
        } else {
          priority = "low";
        }

        return {
          skill: gap.skill,

          priority,

          readiness: readinessForSkill,

          roleCount: gap.roleCount,

          occurrences: gap.occurrences,

          rolePercentage,
        };
      })
      .sort((a, b) => {
        if (a.roleCount !== b.roleCount) {
          return b.roleCount - a.roleCount;
        }

        return b.occurrences - a.occurrences;
      })
      .slice(0, 6);


    // -------------------------------------------------
    // 11. POTENTIAL IMPROVEMENT
    // -------------------------------------------------

    const topGap = priorityGaps[0];

    const potential =
      topGap && topGap.rolePercentage > 0
        ? Math.min(
            currentGap,
            Math.round(
              (topGap.rolePercentage / 100) *
                currentGap
            )
          )
        : 0;


    // -------------------------------------------------
    // 12. RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      readiness,

      currentGap,

      potential,

      claimedSkills,

      verifiedSkills,

      priorityGaps,

      roleAnalysis,

      rolesAnalysed: roleAnalysis.length,
    });

  } catch (error) {
    console.error(
      "Get skill gap intelligence error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to calculate skill gap intelligence.",
    });
  }
};