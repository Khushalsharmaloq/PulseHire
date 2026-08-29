export const getJobFreshness = (lastRecruiterActivity) => {
    const now = new Date();

    const activityDate = new Date(lastRecruiterActivity);

    const differenceInMilliseconds =
        now.getTime() - activityDate.getTime();

    const differenceInDays =
        differenceInMilliseconds / (1000 * 60 * 60 * 24);


    if (differenceInDays <= 3) {
        return {
            label: "Fresh",
            status: "fresh",
            daysSinceActivity: Math.floor(differenceInDays)
        };
    }


    if (differenceInDays <= 7) {
        return {
            label: "Aging",
            status: "aging",
            daysSinceActivity: Math.floor(differenceInDays)
        };
    }


    return {
        label: "Stale",
        status: "stale",
        daysSinceActivity: Math.floor(differenceInDays)
    };
};