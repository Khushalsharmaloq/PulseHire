import {
    normalizeSkill,
    uniqueSkills,
    calculateJobMatch
} from "./match.util.js";


/*
|--------------------------------------------------------------------------
| NORMALIZE SKILL NAME
|--------------------------------------------------------------------------
|
| Kept as normalizeSkillName because the Skill Gap controller
| already uses this name.
|
|--------------------------------------------------------------------------
*/

export const normalizeSkillName = (
    skillName
) => {
    return normalizeSkill(skillName);
};


/*
|--------------------------------------------------------------------------
| UNIQUE SKILLS
|--------------------------------------------------------------------------
*/

export {
    uniqueSkills
};


/*
|--------------------------------------------------------------------------
| CALCULATE SKILL GAP
|--------------------------------------------------------------------------
|
| A skill is considered verified only when its SkillProof
| has status === "approved".
|
|--------------------------------------------------------------------------
*/

export const calculateSkillGap = (
    requiredSkills = [],
    skillProofs = []
) => {

    const approvedSkills =
        uniqueSkills(
            skillProofs
                .filter(
                    (proof) =>
                        proof?.status ===
                        "approved"
                )
                .map(
                    (proof) =>
                        proof?.skill
                )
        );


    const match =
        calculateJobMatch(
            requiredSkills,
            approvedSkills
        );


    return {
        totalRequiredSkills:
            match.totalRequiredSkills,

        matchedSkills:
            match.matchedSkills,

        missingSkills:
            match.missingSkills,

        verifiedSkills:
            approvedSkills,

        matchPercentage:
            match.matchPercentage,

        score:
            match.score,

        strength:
            match.strength
    };
};