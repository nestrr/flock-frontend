"use server";
import { signIn as authSignIn } from "@/auth";
export const signIn = async () => {
  try {
    await authSignIn("microsoft-entra-id", { redirectTo: "/dashboard" });
  } catch (error) {
    throw error;
  }
};
