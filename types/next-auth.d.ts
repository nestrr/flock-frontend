import _NextAuth, { type _DefaultSession } from "next-auth";
import { type User } from "next-auth";
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: User & { id: string };
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    id?: string;
  }
}
