import { type Simplify } from "type-fest";

export interface DuplicateChoiceError {
  DUPLICATE_CAMPUS_CHOICE: string[];
}
export type EditError = Simplify<DuplicateChoiceError>;
export type EditErrorCode = keyof EditError;
