export const getSkillFreshness = (verifiedAt) => {
    if (!verifiedAt) {
        return {
            label: "Unverified",
            status: "unverified",
            daysSinceVerification: null
        };
    }

    const now = new Date();

    const verificationDate = new Date(verifiedAt);

    const differenceInMilliseconds =
        now.getTime() - verificationDate.getTime();

    const differenceInDays =
        differenceInMilliseconds / (1000 * 60 * 60 * 24);

    const daysSinceVerification =
        Math.floor(differenceInDays);


    if (daysSinceVerification <= 90) {
        return {
            label: "Fresh",
            status: "fresh",
            daysSinceVerification
        };
    }


    if (daysSinceVerification <= 180) {
        return {
            label: "Aging",
            status: "aging",
            daysSinceVerification
        };
    }


    return {
        label: "Stale",
        status: "stale",
        daysSinceVerification
    };
};