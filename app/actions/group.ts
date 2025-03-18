"use server";

import { auth } from "@/auth";
import { type ServerActionResponse } from "./types";
import {
  type GroupSummary,
  type Group,
  type GroupInEdit,
  type NewGroup,
} from "../dashboard/group/shared/group-context";
import type { Group as SWRGroup } from "../swr/group";
export const saveGroup = async (
  group: NewGroup
): Promise<ServerActionResponse> => {
  const session = await auth();
  if (!session) throw Error("Not authenticated");
  try {
    const { errors: _, members, ...rest } = group;
    const response = await fetch(`http://localhost:8080/group`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...rest, members: Object.keys(members) }),
    });
    if (!response.ok)
      throw Error(
        `Failed to save group: ${response.status} ${response.statusText}`
      );
    return { success: true, message: "Group saved successfully." };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};

export const cancelInvite = async (groupId: string, personId: string) => {
  const session = await auth();
  if (!session) throw Error("Not authenticated");
  try {
    const response = await fetch(
      `http://localhost:8080/group-invite/${groupId}/member/${personId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok)
      throw Error(
        `Failed to delete group: ${response.status} ${response.statusText}`
      );
    return { success: true, message: "Invite cancelled successfully." };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};

export const respondToInvite = async () => {
  // TODO: implement
};

export const removeMember = async (groupId: string, personId: string) => {
  const session = await auth();
  if (!session) throw Error("Not authenticated");
  try {
    const response = await fetch(
      `http://localhost:8080/group-member/${groupId}/member/${personId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok)
      throw Error(
        `Failed to delete group: ${response.status} ${response.statusText}`
      );
    return { success: true, message: "Invite cancelled successfully." };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};

export const updateGroup = async (summary: GroupSummary | null) => {
  const session = await auth();
  if (!session) throw Error("Not authenticated");
  if (!summary) throw Error("No group summary.");
  try {
    const { active, original } = summary as {
      active: GroupInEdit;
      original: GroupInEdit;
    };
    const patchBody = Object.keys(active).reduce((acc, curr) => {
      if (active[curr as keyof Group] != original[curr as keyof Group]) {
        return { ...acc, [curr]: active[curr as keyof Group] };
      }
      return acc;
    }, {} as Partial<SWRGroup>);
    const { errors: _errors, ...rest } = patchBody;
    const response = await fetch(`http://localhost:8080/group/${active.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...rest, id: active.id }),
    });
    if (!response.ok)
      throw Error(
        `Failed to save group: ${response.status} ${response.statusText}`
      );
    return { success: true, message: "Group saved successfully." };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};

export const deleteGroup = async (id: string) => {
  const session = await auth();
  if (!session) throw Error("Not authenticated");
  try {
    const response = await fetch(`http://localhost:8080/group/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok)
      throw Error(
        `Failed to delete group: ${response.status} ${response.statusText}`
      );
    return { success: true, message: "Group deleted successfully." };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};

export const leaveGroup = async () => {
  // TODO: implement
};
