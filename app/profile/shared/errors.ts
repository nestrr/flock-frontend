import { type Timeslot } from "@/app/swr/profile";
import { type Simplify, type KeysOfUnion } from "type-fest";

type DuplicateTimeslot = {
  DUPLICATE_TIMESLOT: Timeslot[];
};
type DuplicateCampusChoice = {
  DUPLICATE_CAMPUS_CHOICE: string[];
};
export type EditError = Simplify<DuplicateTimeslot | DuplicateCampusChoice>;
export type EditErrorCode = KeysOfUnion<EditError>;
