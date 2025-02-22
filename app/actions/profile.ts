"use server";

import { auth } from "@/auth";
import { type ServerActionResponse } from "./types";
import { type Timeslot } from "../swr/profile";
import { type RequireAtLeastOne } from "type-fest";
import {
  type DeletedTimeslot,
  type Edit,
} from "../profile/shared/profile-edit-context";
export type ProfileUpdateRequest = Partial<
  Omit<Edit, "campusIds" | "timeslots"> & {
    campusChoices?: RequireAtLeastOne<{
      added: Array<string>;
      deleted: Array<string>;
    }>;
    timeslots?: RequireAtLeastOne<{
      added: Array<Array<Timeslot>>;
      deleted: Array<Array<DeletedTimeslot>>;
    }>;
  }
>;
export const updateProfile = async (
  updateRequest: Record<string, unknown>
): Promise<ServerActionResponse> => {
  const session = await auth();
  if (!session) throw Error("Not authenticated");
  try {
    const response = await fetch(`http://localhost:8080/profile/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRequest),
    });
    if (!response.ok)
      throw Error(
        `Failed to update profile: ${response.status} ${response.statusText}`
      );
    return { success: true, message: "Profile updated successfully." };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};
