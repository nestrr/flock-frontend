"use server";

import { auth } from "@/auth";
import { type ServerActionResponse } from "./types";
import { type Group } from "../dashboard/new-group/group-context";
export const saveGroup = async (
  group: Group
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
