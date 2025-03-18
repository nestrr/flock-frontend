import { type Profile } from "@/app/swr/profile";
import React, {
  createContext,
  use,
  useMemo,
  useReducer,
  type Dispatch,
} from "react";
import {
  DESCRIPTION_TOO_SHORT,
  MIN_DESCRIPTION_LENGTH,
  MIN_NAME_LENGTH,
  NAME_TOO_SHORT,
  type GROUP_ERRORS,
} from "./constants/errors";
import { type StringKeyOf, type Simplify } from "type-fest";
export type NewGroup = {
  members: Record<Profile["id"], Omit<Profile, "id">>;
  adminId: string;
  name: string;
  description: string;
  image?: string | null;
  errors: Set<GroupError>;
};
export type GroupInEdit = Omit<NewGroup, "members"> & {
  id: string;
};
export type Group = NewGroup | GroupInEdit;
export type GroupSummary = {
  active: Group;
  original: Group;
};
type GeneralDetails = Simplify<Pick<Group, "name" | "description" | "image">>;
type GroupError = StringKeyOf<typeof GROUP_ERRORS>;
type ClearGroupAction = {
  type: "clear";
};
type SetErrorAction = {
  type: "setError";
  payload: GroupError;
};
type ClearErrorAction = {
  type: "clearError";
  payload: GroupError;
};
type AddMemberAction = {
  type: "addMember";
  payload: Profile;
};
type RemoveMemberAction = {
  type: "removeMember";
  payload: string;
};
type UpdateGeneralDetailsAction = {
  type: "updateDetails";
  payload: Simplify<Partial<GeneralDetails>>;
};
type AssignAdminAction = {
  type: "assignAdmin";
  payload: string;
};

type Action =
  | ClearGroupAction
  | AddMemberAction
  | RemoveMemberAction
  | UpdateGeneralDetailsAction
  | SetErrorAction
  | ClearErrorAction
  | AssignAdminAction;

const GroupContext = createContext<GroupSummary | null>(null);
const GroupDispatchContext = createContext<Dispatch<Action> | null>(null);
function createDefaultGroup(userId?: string, groupInEdit?: Group): Group {
  if (!groupInEdit && !userId)
    throw new Error(
      "Failed to init group context: must have either group in edit or user ID"
    );
  return groupInEdit
    ? { ...groupInEdit, errors: new Set([]) }
    : {
        members: {},
        adminId: userId!,
        name: "",
        description: "",
        image: null,
        errors: new Set([]),
      };
}
type GroupProviderProps =
  | {
      userId: string;
      children: React.ReactNode;
      group?: never;
    }
  | {
      userId?: never;
      children: React.ReactNode;
      group: Group;
    };
export function GroupProvider({
  userId,
  children,
  group: groupInEdit,
}: GroupProviderProps) {
  const [group, dispatch] = useReducer(groupReducer, {
    active: createDefaultGroup(userId, groupInEdit),
    original: createDefaultGroup(userId, groupInEdit),
  });
  const memoizedGroup = useMemo(() => group, [group]);
  return (
    <GroupContext.Provider value={memoizedGroup}>
      <GroupDispatchContext.Provider value={dispatch}>
        {children}
      </GroupDispatchContext.Provider>
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return use(GroupContext)?.active as Group;
}
export function useGroupSummary() {
  return use(GroupContext);
}

export function useGroupDispatch() {
  const dispatch = use(GroupDispatchContext);
  return useMemo(() => dispatch, [dispatch]) as Dispatch<Action>;
}

function groupReducer(groupSummary: GroupSummary, action: Action) {
  const { active, original } = groupSummary;
  console.log(groupSummary);
  switch (action.type) {
    case "clear": {
      return { active: original, original };
    }
    case "addMember": {
      let { members } = active as NewGroup;
      const { id, ...rest } = action.payload;
      const newMember = {
        [id]: rest,
      };
      members = { ...members, ...newMember };
      return { active: { ...active, members }, original };
    }
    case "removeMember": {
      let { members } = active as NewGroup;
      const id = action.payload;
      const { [id]: _, ...rest } = members;
      members = { ...rest };
      return { active: { ...active, members }, original };
    }
    case "updateDetails": {
      let finalGroup = { ...active, ...action.payload };
      const { errors } = active;
      if (
        errors.has(DESCRIPTION_TOO_SHORT) &&
        (action.payload.description?.length ?? 0) >= MIN_DESCRIPTION_LENGTH
      ) {
        errors.delete(DESCRIPTION_TOO_SHORT);
        finalGroup = {
          ...finalGroup,
          errors,
        };
      }
      if (
        errors.has(NAME_TOO_SHORT) &&
        (action.payload.name?.length ?? 0) >= MIN_NAME_LENGTH
      ) {
        errors.delete(NAME_TOO_SHORT);
        finalGroup = {
          ...finalGroup,
          errors,
        };
      }
      return { active: finalGroup, original };
    }
    case "setError": {
      active.errors.add(action.payload);
      console.log("GROUP SUMMARY AT setError", groupSummary);
      return {
        ...groupSummary,
        active: { ...active, errors: active.errors },
      };
    }
    case "clearError": {
      active.errors.delete(action.payload);
      return {
        active: {
          ...active,
          errors: active.errors,
        },
        original,
      };
    }
    case "assignAdmin": {
      return { active: { ...active, adminId: action.payload }, original };
    }
    default: {
      console.log("Action not supported by groupReducer: %o", action);
      return groupSummary;
    }
  }
}
