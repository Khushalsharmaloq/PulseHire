import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { SkillProof } from "../models/skillProof.model.js";
import { LearningResource } from "../models/learningResource.model.js";

import {
  normalizeSkillName,
  uniqueSkills,
  calculateSkillGap,
} from "../utils/skillGap.util.js";

/*
|--------------------------------------------------------------------------
| GET CANDIDATE SKILL GAP INTELLIGENCE
|--------------------------------------------------------------------------
*/

export const getSkillGapIntelligence = async (req, res) => {
  try {
    /* =================================================
           1. FIND CANDIDATE
        ================================================= */

    const candidate = await User.findById(req.userId)
      .select("fullname role profile.skills")
      .lean();

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can access skill gap intelligence.",
      });
    }

    /* =================================================
           2. CLAIMED SKILLS
        ================================================= */

    const claimedSkills = uniqueSkills(candidate.profile?.skills || []);

    const claimedSkillSet = new Set(claimedSkills.map(normalizeSkillName));

    /* =================================================
           3. APPROVED SKILL PROOFS
        ================================================= */

    const approvedProofs = await SkillProof.find({
      candidate: req.userId,
      status: "approved",
    })
      .select("skill title proofType proofUrl reviewedAt status")
      .sort({ reviewedAt: -1 })
      .lean();

    const verifiedSkills = uniqueSkills(
      approvedProofs.map((proof) => proof.skill),
    );

    /*
     * Only skills that are both:
     *
     * 1. claimed by candidate
     * 2. approved by recruiter
     *
     * count as verified capabilities.
     */

    const verifiedSkillsFromClaims = uniqueSkills(
      verifiedSkills.filter((skill) =>
        claimedSkillSet.has(normalizeSkillName(skill)),
      ),
    );

    const verifiedSkillSet = new Set(
      verifiedSkillsFromClaims.map(normalizeSkillName),
    );

    /* =================================================
           4. UNVERIFIED CLAIMS
        ================================================= */

    const unverifiedClaimedSkills = claimedSkills.filter(
      (skill) => !verifiedSkillSet.has(normalizeSkillName(skill)),
    );

    /* =================================================
           5. VERIFIED COVERAGE
        ================================================= */

    const verifiedCoverage =
      claimedSkills.length === 0
        ? 0
        : Math.round(
            (verifiedSkillsFromClaims.length / claimedSkills.length) * 100,
          );

    /* =================================================
           6. ACTIVE JOBS
        ================================================= */

    const jobs = await Job.find({
      status: "active",
    })
      .select(
        "title description skills requirements location jobType company recruiter",
      )
      .populate("company", "name logo location")
      .sort({
        createdAt: -1,
      })
      .lean();

    /* =================================================
           7. NO ACTIVE JOBS
        ================================================= */

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,

        readiness: verifiedSkillsFromClaims.length > 0 ? 100 : 0,

        currentGap: verifiedSkillsFromClaims.length > 0 ? 0 : 100,

        potential: 0,

        claimedSkills,

        verifiedSkills: verifiedSkillsFromClaims,

        unverifiedClaimedSkills,

        verifiedCoverage,

        priorityGaps: [],

        roleAnalysis: [],

        learningRecommendations: [],

        rolesAnalysed: 0,

        message: "No active roles are available for skill gap analysis yet.",
      });
    }

    /* =================================================
           8. ROLE ANALYSIS
        ================================================= */

    const roleAnalysis = jobs
      .map((job) => {
        const combinedRequirements = [
          ...(Array.isArray(job.requirements) ? job.requirements : []),

          ...(Array.isArray(job.skills) ? job.skills : []),
        ];

        const requiredSkills = uniqueSkills(combinedRequirements);

        /*
         * IMPORTANT:
         *
         * calculateSkillGap works from approved
         * SkillProof records and therefore remains
         * our single matching source of truth.
         */

        const skillGap = calculateSkillGap(requiredSkills, approvedProofs);

        return {
          jobId: job._id,

          title: job.title,

          description: job.description,

          location: job.location,

          jobType: job.jobType,

          company: job.company
            ? {
                id: job.company._id,
                name: job.company.name,
                logo: job.company.logo || "",
                location: job.company.location || "",
              }
            : null,

          requiredSkills,

          /*
           * These are the skills actually matched
           * against recruiter-approved proofs.
           */
          verifiedSkills: skillGap.matchedSkills,

          matchedSkills: skillGap.matchedSkills,

          skillGaps: skillGap.missingSkills,

          totalRequiredSkills: skillGap.totalRequiredSkills,

          matchPercentage: skillGap.matchPercentage,
        };
      })
      .filter((role) => role.requiredSkills.length > 0);

    /* =================================================
           9. OVERALL READINESS
        ================================================= */

    let totalRequiredSkills = 0;

    let totalMatchedSkills = 0;

    for (const role of roleAnalysis) {
      totalRequiredSkills += role.totalRequiredSkills;

      totalMatchedSkills += role.matchedSkills.length;
    }

    const readiness =
      totalRequiredSkills === 0
        ? 0
        : Math.round((totalMatchedSkills / totalRequiredSkills) * 100);

    const currentGap = Math.max(0, 100 - readiness);

    /* =================================================
           10. GAP FREQUENCY
        ================================================= */

    const gapMap = new Map();

    for (const role of roleAnalysis) {
      for (const skill of role.skillGaps) {
        const normalized = normalizeSkillName(skill);

        /*
         * Safety check:
         *
         * A verified skill can never be a gap.
         */

        if (verifiedSkillSet.has(normalized)) {
          continue;
        }

        if (!gapMap.has(normalized)) {
          gapMap.set(normalized, {
            skill,
            roleCount: 0,
            occurrences: 0,
          });
        }

        const gap = gapMap.get(normalized);

        gap.roleCount += 1;

        gap.occurrences += 1;
      }
    }

    /* =================================================
           11. PRIORITY GAPS
        ================================================= */

    const priorityGaps = [...gapMap.values()]
      .map((gap) => {
        const rolePercentage = Math.round(
          (gap.roleCount / roleAnalysis.length) * 100,
        );

        let priority = "low";

        if (rolePercentage >= 60) {
          priority = "high";
        } else if (rolePercentage >= 30) {
          priority = "medium";
        }

        return {
          skill: gap.skill,

          priority,

          /*
           * Since this list only contains
           * actual gaps, readiness is 0.
           */
          readiness: 0,

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
      .slice(0, 10);

    /* =================================================
           12. LEARNING RECOMMENDATIONS
        ================================================= */

    const learningRecommendations = [];

    const prioritySkills = priorityGaps.map((gap) => gap.skill);

    if (prioritySkills.length > 0) {
      /*
       * MongoDB matching is case-sensitive.
       *
       * Therefore we fetch active resources first
       * and perform normalized skill matching in JS.
       *
       * This allows:
       *
       * React
       * react
       * REACT
       *
       * to match the same skill.
       */

      const allLearningResources = await LearningResource.find({
        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

      const prioritySkillSet = new Set(prioritySkills.map(normalizeSkillName));

      const resourceMap = new Map();

      for (const resource of allLearningResources) {
        const normalized = normalizeSkillName(resource.skill);

        if (!prioritySkillSet.has(normalized)) {
          continue;
        }

        if (!resourceMap.has(normalized)) {
          resourceMap.set(normalized, []);
        }

        const resources = resourceMap.get(normalized);

        if (resources.length < 3) {
          resources.push(resource);
        }
      }

      for (const gap of priorityGaps) {
        const normalized = normalizeSkillName(gap.skill);

        const resources = resourceMap.get(normalized) || [];

        learningRecommendations.push({
          skill: gap.skill,

          priority: gap.priority,

          roleCount: gap.roleCount,

          rolePercentage: gap.rolePercentage,

          resources,
        });
      }
    }

    /* =================================================
           13. POTENTIAL IMPROVEMENT
        ================================================= */

    const topGap = priorityGaps[0];

    const potential = topGap
      ? Math.min(
          currentGap,
          Math.round((topGap.rolePercentage / 100) * currentGap),
        )
      : 0;

    /* =================================================
           14. RESPONSE
        ================================================= */

    return res.status(200).json({
      success: true,

      readiness,

      currentGap,

      potential,

      claimedSkills,

      verifiedSkills: verifiedSkillsFromClaims,

      unverifiedClaimedSkills,

      verifiedCoverage,

      priorityGaps,

      learningRecommendations,

      roleAnalysis,

      rolesAnalysed: roleAnalysis.length,
    });
  } catch (error) {
    console.error("Get skill gap intelligence error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to calculate skill gap intelligence.",
    });
  }
};
