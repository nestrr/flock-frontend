"use client";
import { DAYS } from "@/app/shared/constants";
import {
  type Timeslot,
  type Day,
  type Profile,
  useSelfProfile,
} from "@/app/swr/profile";
import { createContext, type Dispatch, use, useMemo, useReducer } from "react";
import type { PartialDeep, Simplify, UnionToIntersection } from "type-fest";
import { type EditErrorCode, type EditError } from "./errors";

export type ProfileEditSummary = {
  /** The initial state of the profile before any changes are made. */
  initial: Profile;

  /** The information that must be updated on backend. */
  edits: Edit;

  /** The information that must be deleted on backend. */
  deleted: Deleted;

  /** Errors that must be resolved before the edit can be submitted to the backend. */
  errors: Errors;
};

export type Edit = PartialDeep<{
  bio: string;
  image: string;
  standingId: string;
  programCode: string;
  degreeTypeCode: string;
  campusIds: Array<string>;
  timeslots: TimeslotsMap;
}>;

export type Errors = Simplify<Partial<UnionToIntersection<EditError>>>;

export type DeletedTimeslot = Pick<Timeslot, "from" | "to">;

export type Deleted = {
  campusIds?: Set<string>;
  timeslots?: Record<Day, Array<DeletedTimeslot>>;
};

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
  edit: {
    campusIndices?: number[];
    timeslot?: [Day, Timeslot["from"], Timeslot["to"]];
  };
};

type ResetAction = {
  type: "reset";
  edit: Array<keyof Edit>;
};

/** A dispatchable action. */
type Action = ClearErrorsAction | DeleteAction | UpdateAction | ResetAction;

type CampusIdsMerge = {
  campusIds?: Edit["campusIds"];
  deleted?: { campusIds: ProfileEditSummary["deleted"]["campusIds"] };
};

type TimeslotsMap = Simplify<Record<Day, Timeslot[]>>;

const ProfileEditContext = createContext<ProfileEditSummary | null>(null);
const ProfileEditDispatchContext = createContext<Dispatch<Action> | null>(null);

/**
 * Creates wrapper component to supply the current user profile to the profile edits context provider.
 * @param _args The access token for the session and the children.
 * @returns A wrapper that supplies the currently logged-in user's profile to the context provider.
 */
export function ProfileEditsProviderWrapper({
  accessToken,
  children,
}: {
  accessToken: string;
  children: React.ReactNode;
}) {
  const {
    data: initialProfile,
    error,
    isLoading,
  } = useSelfProfile(accessToken);
  if (isLoading) {
    return <></>;
  }
  if (error || !initialProfile) {
    throw new Error("We failed to get the profile. See logs!");
  }

  return (
    <ProfileEditsProvider initialProfile={initialProfile}>
      {children}
    </ProfileEditsProvider>
  );
}

/**
 * Creates the profile edits context provider
 * @param _args The initial state of the current user profile before any edits are made, and the children.
 * @returns The provider of profile edits context.
 */
function ProfileEditsProvider({
  initialProfile,
  children,
}: {
  initialProfile: Profile;
  children: React.ReactNode;
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

/**
 * A hook to easily access the current state of profile edits - including initial state, edits, errors, and deletions.
 * @returns The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 */
export function useProfileEdit() {
  return use(ProfileEditContext) as ProfileEditSummary;
}

/**
 * A hook to get the dispatch function so callers can modify edits state.
 * @returns The dispatch function.
 */
export function useProfileEditDispatch() {
  const dispatch = use(ProfileEditDispatchContext);
  return useMemo(() => dispatch, [dispatch]) as Dispatch<Action>;
}

/**
 * Merges timeslots in edit (if any) with previously added timeslots in current editing context.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param currentEdit The contents of latest edit request
 * @returns The latest state of edits as far as timeslots are concerned, with new timeslots in the `timeslots` property and deleted timeslots in the `deleted` property.
 */
function mergeTimeslots(allChanges: ProfileEditSummary, currentEdit: Edit) {
  const { edits } = allChanges;
  const { deleted } = allChanges;
  const { timeslots: changes } = currentEdit;
  const cumulativePreceding = {
    ...edits.timeslots,
  } as TimeslotsMap;
  if (changes) {
    const affectedDays = Object.keys(changes) as Day[];
    const merged = affectedDays.reduce((acc: TimeslotsMap, day: Day) => {
      const newChangesToday = lookupTimeslotsInMap(day, changes);
      const existingChangesToday = lookupTimeslotsInMap(
        day,
        cumulativePreceding
      );
      // Merge the existing and new changes.
      return { ...acc, [day]: [...existingChangesToday, ...newChangesToday] };
    }, cumulativePreceding);

    return {
      timeslots: merged,
      deleted,
    };
  }
  // If there are no changes, return the existing timeslots (if any). These represent the timeslots that were created before any edits, plus the preceding edits before the one being currently evaluated.
  return Object.keys(cumulativePreceding).length
    ? { timeslots: cumulativePreceding }
    : {};
}

/**
 * Merges timeslots in edit (if any) with existing preferred times in profile.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param currentEdit The edit(s) to be applied to the profile
 * @returns The latest state of edits as far as campus IDs are concerned, with updated preference of campus IDs in the `campusIds` property and deleted campus preferences in the `deleted` property.
 */
function mergeCampusIds(
  allChanges: ProfileEditSummary,
  currentEdit: Edit
): CampusIdsMerge {
  const { campusIds: edit } = currentEdit;
  const { initial, edits, deleted } = allChanges;
  const defaultIds = initial.campusChoices?.map((c) => c.id) ?? [];
  const existingIds = edits?.campusIds ? edits.campusIds : defaultIds;
  if (edit) {
    const deletedCampusIds = updateDeletedCampusIds(allChanges, edit);
    return deletedCampusIds
      ? {
          campusIds: edit,
          deleted: { campusIds: deletedCampusIds },
        }
      : { campusIds: edit };
  }
  if (existingIds.length) {
    const { campusIds: deletedCampusIds } = deleted;
    if (deletedCampusIds) {
      return {
        campusIds: existingIds,
        deleted: { campusIds: deleted.campusIds },
      };
    } else {
      return { campusIds: existingIds };
    }
  }

  return {};
}

/**
 * Handles all edits (and deletions) to profile.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param currentEdit The contents of latest edit request
 * @returns The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 */
function handleEdits(allChanges: ProfileEditSummary, currentEdit: Edit) {
  const { edits: precedingEdits, deleted } = allChanges;
  const { timeslots: _t, campusIds: _, ...simpleChanges } = currentEdit;

  const timeslotsMerged = mergeTimeslots(allChanges, currentEdit);
  const campusIdsMerged = mergeCampusIds(allChanges, currentEdit);
  const deletedInMerge = {
    ...(timeslotsMerged.deleted ?? {}),
    ...(campusIdsMerged.deleted ?? {}),
  };
  const { timeslots } = timeslotsMerged;
  const { campusIds } = campusIdsMerged;

  function getDeleted() {
    return { ...deleted, ...deletedInMerge };
  }
  function getEdits() {
    if (timeslots && campusIds)
      return {
        ...precedingEdits,
        ...simpleChanges,
        timeslots,
        campusIds,
      };
    if (timeslots) return { ...precedingEdits, ...simpleChanges, timeslots };
    if (campusIds) return { ...precedingEdits, ...simpleChanges, campusIds };
    return { ...precedingEdits, ...simpleChanges };
  }

  return {
    edits: getEdits(),
    deleted: getDeleted(),
  } as Partial<ProfileEditSummary>;
}

/**
 * Clears timeslots that were listed as duplicates.
 * @param slotsToResolve - The timeslots that should no longer be included under the duplicated timeslots error.
 * @param existingSlots - The current list of duplicated timeslots.
 * @returns The remaining duplicated timeslots.
 */
function resolveDuplicateTimeslots(
  slotsToResolve: Timeslot[],
  existingSlots: Timeslot[]
) {
  return existingSlots.filter(
    (t) =>
      !slotsToResolve.some(
        (resolved) =>
          resolved.day === t.day &&
          resolved.from === t.from &&
          resolved.to === t.to
      )
  );
}

/**
 * Handles the error regarding duplicate timeslots, including adding new duplicate timeslots or removing ones that no longer should be on the list.
 * @param currentDuplicates The list of currently known duplicate timeslots
 * @param newDuplicates The list of newly duplicated timeslots to address
 * @param resolve Whether the newly duplicated timeslots should be considered in the context of resolution (i.e. if a matching timeslot exists in currentDuplicates, then we consider the duplication to have been 'undone'.)
 * @returns The updated state of the DUPLICATE_TIMESLOT error
 */
function handleDuplicateTimeslots(
  currentDuplicates: Timeslot[],
  newDuplicates: Timeslot[],
  resolve?: boolean
) {
  if (resolve) {
    const remaining = resolveDuplicateTimeslots(
      newDuplicates,
      currentDuplicates
    );
    if (remaining.length) {
      return { DUPLICATE_TIMESLOT: remaining };
    } else {
      return {};
    }
  } else {
    return {
      DUPLICATE_TIMESLOT: [...currentDuplicates, ...newDuplicates],
    };
  }
}

/**
 * Clears campus choices that were listed as duplicates.
 * @param slotsToResolve - The campus choices that should no longer be included under the duplicated campus choices error.
 * @param existingSlots - The current list of duplicated campus choices.
 * @returns The remaining duplicated campus choices.
 */
function resolveDuplicateCampusChoices(
  choicesToResolve: string[],
  existingChoices: string[]
) {
  return existingChoices.filter((i) => !choicesToResolve.includes(i));
}

/**
 * Handles the error regarding duplicate campus choices, including adding new duplicate campus choices or removing ones that no longer should be on the list.
 * @param currentDuplicates The list of currently known duplicate campus choices
 * @param newDuplicates The list of newly duplicated campus choices to address
 * @param resolve Whether the newly duplicated campus choices should be considered in the context of resolution (i.e. if a matching campus choice exists in currentDuplicates, then we consider the duplication to have been 'undone'.)
 * @returns The updated state of the DUPLICATE_CAMPUS_CHOICE error
 */
function handleDuplicateCampusChoices(
  currentDuplicates: string[],
  newDuplicates: string[],
  resolve?: boolean
) {
  if (resolve) {
    const remaining = resolveDuplicateCampusChoices(
      newDuplicates,
      currentDuplicates
    );
    if (remaining.length) {
      return {
        DUPLICATE_CAMPUS_CHOICE: remaining,
      };
    }
  } else {
    return {
      DUPLICATE_CAMPUS_CHOICE: [...currentDuplicates, ...newDuplicates],
    };
  }
}

/**
 * Handles all errors and error resolutions in profile edit process
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param currentErrors The errors in the latest dispatch request
 * @returns The current state of the profile errors
 */
function handleErrors(
  allChanges: ProfileEditSummary,
  currentErrors?: Errors,
  resolve?: boolean
) {
  const { errors: existingErrors } = allChanges;

  // Return existing errors if there were no errors in the latest dispatch request
  if (!currentErrors) return { errors: existingErrors };

  // Return errors of latest dispatch errors if there were none previously
  if (!Object.keys(existingErrors).length) return { errors: currentErrors };

  let merged = {} as Partial<Errors>;
  const currentErrorCodes = Object.keys(currentErrors) as EditErrorCode[];
  // For each error code in latest dispatch, merge pre-existing errors of same code and the ones in latest dispatch
  currentErrorCodes.map((code) => {
    const oldMatchingErrors = existingErrors?.[code];
    const newMatchingErrors = currentErrors[code]!;
    if (!oldMatchingErrors) {
      // If there are no old errors matching the code being currently evaluated, include the new ones only
      merged = { ...merged, [code]: newMatchingErrors! };
    } else {
      switch (code) {
        case "DUPLICATE_CAMPUS_CHOICE": {
          merged = {
            ...merged,
            ...handleDuplicateCampusChoices(
              oldMatchingErrors as NonNullable<
                Errors["DUPLICATE_CAMPUS_CHOICE"]
              >,
              newMatchingErrors as NonNullable<
                Errors["DUPLICATE_CAMPUS_CHOICE"]
              >,
              resolve
            ),
          };
          break;
        }
        case "DUPLICATE_TIMESLOT": {
          merged = {
            ...merged,
            ...handleDuplicateTimeslots(
              oldMatchingErrors as NonNullable<Errors["DUPLICATE_TIMESLOT"]>,
              newMatchingErrors as NonNullable<Errors["DUPLICATE_TIMESLOT"]>,
              resolve
            ),
          };
          break;
        }
        default: {
          return { errors: existingErrors };
        }
      }
    }
  });
  return { errors: merged };
}

/**
 * Handles campus deletions, which involves removing the campus IDs from the edits and deleted campus IDs.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param campusIndices The indices of the campuses to be deleted (from within the 'campusIds' array in the edits.campusIds array, or the initial.campusIds array if no edits to campus IDs have been made)
 *
 * @returns The new state of the profile edits, with the campuses deleted.
 */
function handleCampusDeletion(
  allChanges: ProfileEditSummary,
  campusIndices: NonNullable<DeleteAction["edit"]["campusIndices"]>
) {
  const { initial, edits, deleted } = allChanges;
  const { campusIds: staleCampuses = new Set<string>() } = deleted;
  const campusIdsInInitial = initial.campusChoices?.map((c) => c.id) ?? [];
  const existing = edits.campusIds ? edits.campusIds : campusIdsInInitial;
  campusIndices.forEach((index) => {
    // Only add campus ID to staleCampuses if it was there before any edits were made. Otherwise, nothing needs to be deleted from the backend.
    if (campusIdsInInitial.includes(existing[index])) {
      staleCampuses.add(existing[index]);
    }
    existing.splice(index, 1);
  });
  if (edits.campusIds) {
    return staleCampuses.size
      ? {
          ...allChanges,
          edits: {
            campusIds: existing,
          },
          deleted: {
            ...deleted,
            campusIds: staleCampuses,
          },
        }
      : {
          ...allChanges,
          edits: {
            campusIds: existing,
          },
        };
  } else if (staleCampuses.size) {
    return {
      ...allChanges,
      deleted: { ...deleted, campusIds: staleCampuses },
    };
  } else {
    return allChanges;
  }
}

/**
 * Handles necessary changes to deleted part of ProfileEditSummary when an existing campus choice is replaced with another one.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param currentEdit The contents of latest edit request
 * @returns The updated list of deleted campus IDs
 */
function updateDeletedCampusIds(
  allChanges: ProfileEditSummary,
  campusIdsInEdit: Simplify<Edit["campusIds"]>
) {
  const { initial, deleted } = allChanges;
  if (campusIdsInEdit) {
    const campusIdsInInitial = initial.campusChoices?.map((c) => c.id) ?? [];
    const { campusIds: campusIdsInDeleted } = deleted;
    campusIdsInEdit.forEach((id, index) => {
      if (campusIdsInInitial?.[index]) {
        campusIdsInDeleted?.add(campusIdsInInitial[index]);
      }
      if (campusIdsInDeleted?.has(id)) {
        campusIdsInDeleted.delete(id);
      }
    });
    return campusIdsInDeleted;
  }

  return deleted.campusIds;
}

/**
 * Handles timeslot deletion - if timeslot to delete exists on backend, then it updates 'deleted' state, else only updates 'edits' state.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items.
 * @param timeslotToDelete The preferred times inside the latest edit
 * @returns The updated value of allChanges.
 */
function handleTimeslotDeletion(
  allChanges: ProfileEditSummary,
  timeslotToDelete: NonNullable<DeleteAction["edit"]["timeslot"]>
) {
  const { initial, edits, deleted } = allChanges;
  const {
    timeslots: deletedSlots = {} as NonNullable<
      ProfileEditSummary["deleted"]["timeslots"]
    >,
  } = deleted;
  const { timeslots: editsSlots } = edits;
  const { timeslots: initialSlots } = initial;
  const [affectedDay, staleFrom, staleTo]: [
    Day,
    Timeslot["from"],
    Timeslot["to"],
  ] = timeslotToDelete;

  const existsInInitial = Object.values(initialSlots?.[affectedDay] ?? []).some(
    (t) => t.from === staleFrom && t.to === staleTo
  );

  if (existsInInitial) {
    // Since the timeslot to delete already exists on the backend, it must be added to 'deleted'.
    const finalDeletedSlotsForDay = [
      ...(deletedSlots?.[affectedDay as Day] ?? []),
      { from: staleFrom, to: staleTo },
    ];
    const finalDeletedState = {
      ...deleted,
      timeslots: {
        ...deletedSlots,
        [affectedDay]: finalDeletedSlotsForDay,
      },
    };

    // Check if timeslot also exists in edits (happens when existing timeslot was also edited)
    const existsInEdits = Object.values(editsSlots?.[affectedDay] ?? []).some(
      (t) => t.from === staleFrom && t.to === staleTo
    );
    if (existsInEdits) {
      // If timeslot also exists in edits, remove the timeslot from edits state too.
      const finalEditsSlotsForDay = editsSlots![affectedDay]!.filter(
        (t) => t.from !== staleFrom || t.to !== staleTo
      );
      return {
        ...allChanges,
        edits: {
          ...edits,
          timeslots: { ...editsSlots, [affectedDay]: finalEditsSlotsForDay },
        },
        deleted: finalDeletedState,
      };
    } else {
      // Otherwise, only update the deleted state.
      return {
        ...allChanges,
        deleted: finalDeletedState,
      };
    }
  } else if (editsSlots) {
    // Undo the change that was made. Since it was never sent to the backend, it does not need to be added to 'deleted'.
    const isOnlyTimeslot =
      Object.entries(editsSlots).length === 1 &&
      editsSlots[affectedDay]!.length === 1;

    if (isOnlyTimeslot) {
      // Remove 'timeslots' property from edits if this was the only timeslot present.
      const { timeslots: _, ...rest } = edits;
      return { ...allChanges, edits: { ...rest } };
    } else {
      return {
        ...allChanges,
        edits: {
          ...edits,
          timeslots: {
            ...editsSlots,
            [affectedDay]: editsSlots[affectedDay]!.filter(
              (t) => t.from !== staleFrom || t.to !== staleTo
            ),
          },
        },
      };
    }
  } else {
    return { ...allChanges };
  }
}

/**
 * Manages the state and any actions dispatched by components to modify it.
 * @param allChanges The current state of the profile edits, which includes the initial profile before any changes, edits that were made, and deleted items. * @param action
 * @param action The action dispatched by a component
 * @returns The updated state of the profile edits
 */
function profileEditReducer(allChanges: ProfileEditSummary, action: Action) {
  switch (action.type) {
    case "update": {
      const { edit, errors } = action;
      return {
        ...allChanges,
        ...handleEdits(allChanges, edit),
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
      const { campusIndices = [], timeslot = [] } = action.edit;
      if (campusIndices.length) {
        return handleCampusDeletion(allChanges, campusIndices);
      }
      if (timeslot.length) {
        return handleTimeslotDeletion(allChanges, timeslot);
      }
      console.log(
        "ERROR: Deletion is only supported for campus IDs and timeslot."
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

/**
 * Gets all timeslots for a given day from a map of timeslots, where each element is an array of timeslots for a given day.
 * @param day The day as a number or a string.
 * @param map The map of timeslots, where each element is an array of timeslots for a given day.
 * @returns The list of timeslots for the given day, or an empty array if the map is null.
 */
function lookupTimeslotsInMap(day: Day | number, map?: Partial<TimeslotsMap>) {
  if (!map) return [];
  if (typeof day === "number") return map[DAYS[day]] ?? [];
  return map[day] ?? [];
}
