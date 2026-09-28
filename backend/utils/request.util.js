export const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const parsePositiveInteger = (
  value,
  { defaultValue, min = 1, max = Number.MAX_SAFE_INTEGER } = {},
) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed)) {
    return defaultValue;
  }

  return Math.min(max, Math.max(min, parsed));
};
