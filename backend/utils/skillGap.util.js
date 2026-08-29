export const normalizeSkillName = (skillName) => {
    return skillName
        .trim()
        .toLowerCase();
};


export const calculateSkillGap = (
    requiredSkills,
    skillProofs
) => {

    const normalizedRequiredSkills =
        requiredSkills.map((skill) =>
            normalizeSkillName(skill)
        );


    const verifiedSkills =
        skillProofs
            .filter(
                (proof) =>
                    proof.status === "verified" &&
                    proof.verifiedAt
            )
            .map(
                (proof) =>
                    normalizeSkillName(
                        proof.skillName
                    )
            );


    const matchedSkills =
        normalizedRequiredSkills.filter(
            (skill) =>
                verifiedSkills.includes(skill)
        );


    const missingSkills =
        normalizedRequiredSkills.filter(
            (skill) =>
                !verifiedSkills.includes(skill)
        );


    const totalRequiredSkills =
        normalizedRequiredSkills.length;


    const matchPercentage =
        totalRequiredSkills === 0
            ? 0
            : Math.round(
                (
                    matchedSkills.length /
                    totalRequiredSkills
                ) * 100
            );


    return {
        totalRequiredSkills,
        matchedSkills,
        missingSkills,
        matchPercentage
    };
};