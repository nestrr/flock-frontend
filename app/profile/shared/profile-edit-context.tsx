"use client";
import { DAYS, DAYS_INDICES } from "@/app/shared/constants";
import { type Timeslot, type Day, type Profile } from "@/app/swr/profile";
import { createContext, type Dispatch, use, useMemo, useReducer } from "react";
import type { PartialDeep, Simplify } from "type-fest";
import { type EditErrorCode, type EditError } from "./errors";

export type Edits = PartialDeep<{
  bio: string;
  standingId: string;
  programCode: string;
  degreeTypeCode: string;
  campusIds: Array<string>;
  preferredTimes: Array<Array<Timeslot>>;
}>;
export type Errors = Partial<EditError>;
interface Edit extends Omit<Edits, "preferredTimes"> {
  // incoming dispatch from frontend component will use a record (e.g. {"Sunday": [...]}) to represent change in preferred times.
  preferredTimes?: Record<Day, Timeslot[]>;
}

type UpdateAction = {
  type: "update";
  edit: Edit;
  overrideCurrent?: boolean;
  errors?: Errors;
};
type ClearErrorsAction = {
  type: "clearErrors";
  errors?: Errors;
};
type DeleteAction = {
  type: "delete";
  edit: Pick<Edit, "preferredTimes" | "campusIds">;
};
type ResetAction = {
  type: "reset";
  edit: Array<keyof Edits>;
};
type Action = ClearErrorsAction | DeleteAction | UpdateAction | ResetAction;

type ProfileEditSummary = {
  initial: Profile;
  edits: Edits;
  deleted: Simplify<
    Pick<Edits, "preferredTimes"> & { campusIds?: Set<string> }
  >;
  errors: Errors;
};
const ProfileEditContext = createContext<ProfileEditSummary | null>(null);
const ProfileEditDispatchContext = createContext<Dispatch<Action> | null>(null);
export function ProfileEditsProvider({
  children,
  profile: initialProfile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {
  const [profile, dispatch] = useReducer(profileEditReducer, {
    initial: initialProfile,
    edits: {},
    deleted: {},
    errors: {},
  });
  const memoizedProfile = useMemo(() => profile, [profile]);
  return (
    <ProfileEditContext.Provider value={memoizedProfile}>
      <ProfileEditDispatchContext.Provider value={dispatch}>
        {children}
      </ProfileEditDispatchContext.Provider>
    </ProfileEditContext.Provider>
  );
}

export function useProfileEdit() {
  return use(ProfileEditContext) as ProfileEditSummary;
}
export function useProfileEditDispatch() {
  const dispatch = use(ProfileEditDispatchContext);
  return useMemo(() => dispatch, [dispatch]) as Dispatch<Action>;
}
/**
 * Merges preferred times in edit (if any) with existing preferred times in profile.
 * @param initial The initial profile, before any edits are made
 * @param storedEdit The change(s) to the profile that must be merged with existing profile details
 * @param editRequest The edit(s) to be applied to the profile
 * @param editsOverriding Whether to override the current profile's preferred times with the edit's preferred times
 */
function mergePreferredTimes(
  allChanges: ProfileEditSummary,
  currentEdit: Edit,
  editsOverriding?: boolean
) {
  const { initial: original, edits } = allChanges;
  let { deleted } = allChanges;
  const { preferredTimes: changes } = currentEdit;
  const cumulativePreceding = {
    ...original.preferredTimes,
    ...toPreferredTimesMap(edits.preferredTimes ?? []),
  };
  if (changes) {
    const changedDays = Object.keys(changes) as Day[];
    const merged = changedDays.reduce(
      (timeslotsMap: Record<Day, Timeslot[]>, day: Day) => {
        const newChangesToday = mapTimeslotsByDay(day, changes);
        const existingChangesToday = mapTimeslotsByDay(
          day,
          cumulativePreceding
        );

        // If the current edit is overriding the current profile, and there are existing timeslots for the day, then we need to delete them
        if (editsOverriding && existingChangesToday) {
          const previouslyDeleted = deleted?.preferredTimes ?? [];
          const previouslyDeletedToday = arrayTimeslotsByDay(
            day,
            previouslyDeleted
          );

          // Find timeslots that are in the existing changes but not in the new changes. The resulting array represents the newly deleted timeslots in the new changes.
          const diff = existingChangesToday
            .filter(
              (p) =>
                !newChangesToday.find((t) => t.from === p.from && t.to === p.to)
            )
            .map((t) => t.id);

          // Update the information on deleted timeslots.
          deleted = {
            preferredTimes: mergePreferredTimesInfo(previouslyDeleted, {
              [day]: [...previouslyDeletedToday, ...diff],
            }),
          };

          // Include only the new changes in the results of the merge.
          return {
            ...timeslotsMap,
            [day]: newChangesToday,
          };
        }

        // Merge the existing and new changes.
        return {
          ...timeslotsMap,
          [day]: [...existingChangesToday, ...newChangesToday],
        };
      },
      cumulativePreceding
    );

    return {
      preferredTimes: toPreferredTimesList(merged), // Convert the merged timeslots to a list of timeslots to match Edits interface.
      deleted,
    };
  }
  // If there are no changes, return the existing timeslots (if any). These represent the timeslots that were created before any edits, plus the preceding edits before the one being currently evaluated.
  return Object.keys(cumulativePreceding).length
    ? { preferredTimes: cumulativePreceding }
    : {};
}
/**
 * Merges preferred times in edit (if any) with existing preferred times in profile.
 * @param allChanges The current state of the profile edits.
 * @param currentEdit The edit(s) to be applied to the profile
 * Returns the final state of the profile's campus preferences after edits are applied.
 */
function mergeCampusIds(allChanges: ProfileEditSummary, currentEdit: Edit) {
  const { initial, deleted } = allChanges;
  const { campusIds } = currentEdit;
  const existing = initial.campusChoices?.map((choice) => choice.id) ?? [];
  if (campusIds) {
    // Combine existing campus IDs and new changes, replacing the existing campus IDs in any given ranking with the new ones if possible.
    let merged = existing.reduce(
      (acc: string[], oldCampusId: string, index: number) => {
        const nextCampusId = campusIds?.[index] ?? existing[index];
        if (campusIds?.[index] && existing?.[index])
          deleted.campusIds?.add(oldCampusId); // if existing campus is being replaced, then it must be deleted
        if (deleted.campusIds?.has(nextCampusId))
          deleted.campusIds?.delete(nextCampusId); // if the campus is being added, then remove it from the deleted campuses
        return [...acc, nextCampusId];
      },
      []
    );

    // If there are more new campus IDs than existing campus IDs, then add the new campus IDs to the merge result.
    if (existing.length < campusIds.length) {
      for (let i = existing.length; i < campusIds.length; i++) {
        if (deleted.campusIds?.has(campusIds[i]))
          deleted.campusIds?.delete(campusIds[i]); // if the campus is being added, then remove it from the deleted campuses
        merged = [...merged, campusIds[i]];
      }
    }

    if (merged.length && deleted.campusIds?.size)
      return {
        campusIds: merged,
        deleted: { ...deleted, campusIds: deleted.campusIds },
      };

    if (merged.length) return { campusIds: merged };

    return {
      deleted: { ...deleted, campusIds: deleted.campusIds },
    };
  }
  return existing.length ? { campusIds: existing } : {};
}

function handleEdits(
  allChanges: ProfileEditSummary,
  currentEdit: Edit,
  overrideCurrent?: boolean
) {
  const { edits: precedingEdits, deleted } = allChanges;
  const {
    preferredTimes: _currentPreferredTimes,
    campusIds: _campusIds,
    ...rest
  } = { ...precedingEdits, ...currentEdit };
  const preferredTimes = mergePreferredTimes(
    allChanges,
    currentEdit,
    overrideCurrent
  );
  return {
    edits: {
      ...rest,
      ...preferredTimes,
      ...mergeCampusIds(allChanges, currentEdit),
    },
    deleted: preferredTimes.deleted
      ? {
          ...deleted,
          preferredTimes: { ...preferredTimes.deleted },
        }
      : { ...deleted },
  } as Partial<ProfileEditSummary>;
}

function handleErrors(
  allChanges: ProfileEditSummary,
  newErrors?: Errors,
  remove?: boolean
) {
  const { errors: existingErrors } = allChanges;
  if (!newErrors) return { errors: existingErrors };
  const merged = (Object.keys(newErrors) as EditErrorCode[]).reduce(
    (acc: Errors, errorCode) => {
      let currentInstancesOfError = acc[errorCode] ?? [];
      const newInstancesOfError = newErrors[errorCode] ?? [];
      if (!remove) {
        return {
          ...acc,
          [errorCode]: [...currentInstancesOfError, ...newInstancesOfError],
        };
      }
      currentInstancesOfError = currentInstancesOfError.filter(
        (i) => !newInstancesOfError.includes(i)
      );
      if (currentInstancesOfError.length > 0)
        return {
          ...acc,
          [errorCode]: currentInstancesOfError.filter(
            (i) => !newInstancesOfError.includes(i)
          ),
        };
      const { [errorCode]: _removed, ...rest } = acc;
      return rest;
    },
    existingErrors
  );
  return { errors: merged };
}

function profileEditReducer(allChanges: ProfileEditSummary, action: Action) {
  switch (action.type) {
    case "update": {
      const { edit, overrideCurrent, errors } = action;
      return {
        ...allChanges,
        ...handleEdits(allChanges, edit, overrideCurrent),
        ...handleErrors(allChanges, errors),
      };
    }
    case "reset": {
      let { edits } = allChanges;
      const toClear = action.edit;
      toClear.map((key) => {
        const { [key]: _clearedKey, ...rest } = edits;
        edits = rest;
      });
      return { ...allChanges, edits };
    }
    case "delete": {
      const { deleted, edits } = allChanges;
      // newly deleted timeslots are passed in as a record, because they are easier to work with on the frontend-side
      const { campusIds: campusesToDelete } = action.edit;
      if (campusesToDelete) {
        const { campusIds: staleCampuses = new Set<string>() } = deleted;
        const { campusIds: previouslyAdded } = edits;
        for (const campus of campusesToDelete ?? []) {
          staleCampuses.add(campus);
        }
        if (previouslyAdded) {
          return {
            ...allChanges,
            edits: {
              campusIds: previouslyAdded.filter(
                (campus) => !staleCampuses.has(campus)
              ),
            },
            deleted: {
              ...deleted,
              campusIds: staleCampuses,
            },
          };
        }
        return {
          ...allChanges,
          deleted: { ...deleted, campusIds: staleCampuses },
        };
      }
      console.log(
        "ERROR: only campus IDs' deletion is supported at this time."
      );
      return { ...allChanges };
    }
    case "clearErrors": {
      const { errors } = action;
      return {
        ...allChanges,
        ...handleErrors(allChanges, errors, true),
      };
    }
    default: {
      throw Error("Unknown action.");
    }
  }
}
export function toPreferredTimesList(preferredTimes: Record<Day, Timeslot[]>) {
  return DAYS.map((day) => preferredTimes[day] ?? []);
}
export function toPreferredTimesMap(preferredTimes: Timeslot[][]) {
  return preferredTimes.reduce((acc, curr, index) => {
    const key = DAYS[index];
    return { ...acc, [key]: curr };
  }, {});
}
function mergePreferredTimesInfo(
  list: Timeslot[][],
  map: Partial<Record<Day, Timeslot[]>>
) {
  return DAYS.map((day, index) => {
    const listInfoForDay = list?.[index] ?? [];
    const mapInfoForDay = map?.[day] ?? [];

    return [...listInfoForDay, ...mapInfoForDay];
  });
}
/**
 * Gets all timeslots for a given day from a map of timeslots, where each element is an array of timeslots for a given day.
 * @param day The day as a number or a string.
 * @param map The map of timeslots, where each element is an array of timeslots for a given day.
 * @returns The list of timeslots for the given day, or an empty array if the map is null.
 */
function mapTimeslotsByDay(day: Day | number, map?: Record<Day, Timeslot[]>) {
  if (!map) return [];
  if (typeof day === "number") return map[DAYS[day]] ?? [];
  return map[day] ?? [];
}
/**
 *Gets all timeslots for a given day from a list of timeslots, where each element is an array of timeslots for a given day.
 * @param array The list of timeslots, where each element is an array of timeslots for a given day.
 * @param day The day as a number or a string.
 * @returns The list of timeslots for the given day, or an empty array if the list is null.
 */
function arrayTimeslotsByDay(day: Day | number, array?: Timeslot[][]) {
  if (!array) return [];
  if (typeof day === "number") return array.length > day ? array[day] : [];
  return array.length > DAYS_INDICES[day] ? array[DAYS_INDICES[day]] : [];
}
