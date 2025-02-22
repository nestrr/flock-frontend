import _NextAuth, { type _DefaultSession } from "next-auth";
import { type User as _User } from "next-auth";
import { type Profile } from "@/app/swr/profile";
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: Profile;
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
