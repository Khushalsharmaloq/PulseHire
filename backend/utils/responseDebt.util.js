export const calculateResponseDebt = (appliedAt) => {
  const now = new Date();

  const applicationDate = new Date(appliedAt);

  const differenceInMilliseconds = now.getTime() - applicationDate.getTime();

  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  const daysWaiting = Math.floor(differenceInDays);

  let level = "low";

  if (daysWaiting > 7) {
    level = "high";
  } else if (daysWaiting > 3) {
    level = "medium";
  }

  return {
    daysWaiting,
    level,
  };
};
