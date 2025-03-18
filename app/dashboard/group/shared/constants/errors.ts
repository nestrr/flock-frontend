export const DESCRIPTION_TOO_SHORT = "DESCRIPTION_TOO_SHORT";
export const NAME_TOO_SHORT = "NAME_TOO_SHORT";
export const GROUP_ERRORS = {
  [DESCRIPTION_TOO_SHORT]:
    "Your group's description is too short! It needs at least 100 characters.",
  [NAME_TOO_SHORT]:
    "Your group's name is too short! It needs at least 15 characters.",
} as const;
export const MIN_NAME_LENGTH = 15;
export const MIN_DESCRIPTION_LENGTH = 100;
