/*
|--------------------------------------------------------------------------
| PULSEHIRE MATCH ENGINE
|--------------------------------------------------------------------------
|
| This utility is the single source of truth for calculating
| evidence-backed candidate/job matching.
|
| Match is based ONLY on recruiter-approved SkillProof records.
|
| Job required skills
|        +
| Candidate approved skills
|        ↓
| Match score
|        ↓
| Matched skills
| Missing skills
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| NORMALIZE SKILL
|--------------------------------------------------------------------------
*/

export const normalizeSkill = (skill) => {
  return String(skill || "")
    .trim()
    .toLowerCase();
};

/*
|--------------------------------------------------------------------------
| UNIQUE SKILLS
|--------------------------------------------------------------------------
|
| Keeps the first readable version of a skill while preventing
| duplicates such as:
|
| React
| react
| REACT
|
|--------------------------------------------------------------------------
*/

export const uniqueSkills = (skills = []) => {
  const skillMap = new Map();

  for (const skill of skills) {
    const readableSkill = String(skill || "").trim();

    if (!readableSkill) {
      continue;
    }

    const normalized = normalizeSkill(readableSkill);

    if (!skillMap.has(normalized)) {
      skillMap.set(normalized, readableSkill);
    }
  }

  return [...skillMap.values()];
};

/*
|--------------------------------------------------------------------------
| GET APPROVED SKILLS FROM PROOFS
|--------------------------------------------------------------------------
*/

export const getApprovedSkills = (skillProofs = []) => {
  return uniqueSkills(
    skillProofs
      .filter((proof) => proof?.status === "approved")
      .map((proof) => proof?.skill),
  );
};

/*
|--------------------------------------------------------------------------
| CALCULATE JOB / CANDIDATE MATCH
|--------------------------------------------------------------------------
*/

export const calculateJobMatch = (requiredSkills = [], approvedSkills = []) => {
  const jobSkills = uniqueSkills(requiredSkills);

  const candidateSkills = uniqueSkills(approvedSkills);

  const candidateSkillSet = new Set(candidateSkills.map(normalizeSkill));

  const matchedSkills = jobSkills.filter((skill) =>
    candidateSkillSet.has(normalizeSkill(skill)),
  );

  const missingSkills = jobSkills.filter(
    (skill) => !candidateSkillSet.has(normalizeSkill(skill)),
  );

  const totalRequired = jobSkills.length;

  const matchedCount = matchedSkills.length;

  const matchPercentage =
    totalRequired === 0 ? 0 : Math.round((matchedCount / totalRequired) * 100);

  const verificationCoverage =
    totalRequired === 0 ? 0 : Math.round((matchedCount / totalRequired) * 100);

  let strength = "low";

  if (matchPercentage >= 80) {
    strength = "excellent";
  } else if (matchPercentage >= 60) {
    strength = "strong";
  } else if (matchPercentage >= 40) {
    strength = "potential";
  }

  return {
    score: matchPercentage,

    matchPercentage,

    matchedSkills,

    missingSkills,

    totalRequiredSkills: totalRequired,

    matchedSkillCount: matchedCount,

    missingSkillCount: missingSkills.length,

    verificationCoverage,

    strength,
  };
};

/*
|--------------------------------------------------------------------------
| CALCULATE JOB MATCH FROM SKILL PROOFS
|--------------------------------------------------------------------------
*/

export const calculateMatchFromProofs = (
  requiredSkills = [],
  skillProofs = [],
) => {
  const approvedSkills = getApprovedSkills(skillProofs);

  return calculateJobMatch(requiredSkills, approvedSkills);
};

/*
|--------------------------------------------------------------------------
| MATCH LABEL
|--------------------------------------------------------------------------
*/

export const getMatchLabel = (score) => {
  if (score >= 80) {
    return "Excellent fit";
  }

  if (score >= 60) {
    return "Strong fit";
  }

  if (score >= 40) {
    return "Potential fit";
  }

  if (score > 0) {
    return "Skill gap";
  }

  return "No verified match";
};

/*
|--------------------------------------------------------------------------
| CHECK STRONG MATCH
|--------------------------------------------------------------------------
*/

export const isStrongMatch = (score) => {
  return score >= 80;
};

/*
|--------------------------------------------------------------------------
| CHECK ANY VERIFIED MATCH
|--------------------------------------------------------------------------
*/

export const hasVerifiedMatch = (score) => {
  return score > 0;
};
