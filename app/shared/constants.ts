export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAYS_INDICES = DAYS.reduce(
  (acc, curr, index) => {
    return { ...acc, [curr]: index };
  },
  {} as Record<(typeof DAYS)[number], number>
);

export const ORDINALS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
] as const;
