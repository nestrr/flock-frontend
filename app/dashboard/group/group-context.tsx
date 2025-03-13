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

export type Group = {
  members: Record<Profile["id"], Omit<Profile, "id">>;
  creatorId: string;
  name: string;
  description: string;
  image?: string;
  errors: Set<GroupError>;
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

type Action =
  | ClearGroupAction
  | AddMemberAction
  | RemoveMemberAction
  | UpdateGeneralDetailsAction
  | SetErrorAction
  | ClearErrorAction;

const GroupContext = createContext<Group | null>(null);
const GroupDispatchContext = createContext<Dispatch<Action> | null>(null);
function createDefaultGroup(userId: string): Group {
  return {
    members: {},
    creatorId: userId,
    name: "",
    description: "",
    image: "",
    errors: new Set([]),
  };
}

export function GroupProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const initialGroup = createDefaultGroup(userId);
  const [group, dispatch] = useReducer(groupReducer, initialGroup);
  console.log("reloaded %o", group);
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
  return use(GroupContext) as Group;
}

export function useGroupDispatch() {
  const dispatch = use(GroupDispatchContext);
  return useMemo(() => dispatch, [dispatch]) as Dispatch<Action>;
}

function groupReducer(group: Group, action: Action) {
  switch (action.type) {
    case "clear": {
      const { creatorId } = group;
      return createDefaultGroup(creatorId);
    }
    case "addMember": {
      let { members } = group;
      const { id, ...rest } = action.payload;
      const newMember = {
        [id]: rest,
      };
      members = { ...members, ...newMember };
      return { ...group, members };
    }
    case "removeMember": {
      let { members } = group;
      const id = action.payload;
      const { [id]: _, ...rest } = members;
      members = { ...rest };
      return { ...group, members };
    }
    case "updateDetails": {
      let finalGroup = { ...group, ...action.payload };
      const { errors } = group;
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
      return finalGroup;
    }
    case "setError": {
      group.errors.add(action.payload);
      return { ...group, errors: group.errors };
    }
    case "clearError": {
      group.errors.delete(action.payload);
      return {
        ...group,
        errors: group.errors,
      };
    }
    default: {
      console.log("Action not supported by groupReducer: %o", action);
      return group;
    }
  }
}
