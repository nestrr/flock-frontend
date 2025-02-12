import _NextAuth, { type _DefaultSession } from "next-auth";
import { type User as _User } from "next-auth";
type Campus = {
  id: string;
  name: string;
  description: string;
};
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: User;
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
  interface User extends _User {
    campusChoices: Campus[];
    roles: string[];
    firstLogin: boolean;
    major: string;
    standing: string;
  }
}
