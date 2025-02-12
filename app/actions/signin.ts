"use server";
import { signIn as authSignIn } from "@/auth";
export const signIn = async () => {
  try {
    await authSignIn("microsoft-entra-id");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
