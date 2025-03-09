import { type Profile } from "@/app/swr/profile";
import React, {
  createContext,
  use,
  useMemo,
  useReducer,
  type Dispatch,
} from "react";
import { type Simplify } from "type-fest";

export type Group = {
  members: Record<Profile["id"], Omit<Profile, "id">>;
  creatorId: string;
  name: string;
  description: string;
  picture?: string;
};

type GeneralDetails = Simplify<Pick<Group, "name" | "description" | "picture">>;

type ClearGroupAction = {
  type: "clear";
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
  | UpdateGeneralDetailsAction;

const GroupContext = createContext<Group | null>(null);
const GroupDispatchContext = createContext<Dispatch<Action> | null>(null);
function createDefaultGroup(userId: string): Group {
  return {
    members: {},
    creatorId: userId,
    name: "",
    description: "",
    picture: "",
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

export function useGroupState() {
  const { name } = useGroup();
  return { valid: name.trim().length > 0 };
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
      return { ...group, ...action.payload };
    }
    default: {
      console.log("Action not supported by groupReducer: %o", action);
      return group;
    }
  }
}
