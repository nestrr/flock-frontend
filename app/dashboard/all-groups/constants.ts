import { type ValueOf } from "type-fest";

export const GROUP_STATUSES = { ACTIVE: "active", PENDING: "pending" } as const;
export const GROUP_INVITE_STATUSES = {
  ACTIVE: "active",
  PENDING: "response_pending",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;
export const GROUP_INVITE_STATUSES_DISPLAY = {
  [GROUP_INVITE_STATUSES.ACTIVE]: {
    name: "active",
    label: "active",
    color: "green",
    tooltip: "active member",
  },
  [GROUP_INVITE_STATUSES.PENDING]: {
    name: "response_pending",
    label: "pending",
    color: "teal",
    tooltip: "no invite response yet",
  },
  [GROUP_INVITE_STATUSES.REJECTED]: {
    name: "rejected",
    label: "rejected",
    color: "red",
    tooltip: "invite rejected",
  },
  [GROUP_INVITE_STATUSES.EXPIRED]: {
    name: "expired",
    label: "expired",
    color: "gray",
    tooltip: "invite expired",
  },
} as const;
export type GroupInviteStatus = ValueOf<typeof GROUP_INVITE_STATUSES>;
