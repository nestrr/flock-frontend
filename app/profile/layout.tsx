"use server";
import { auth } from "@/auth";
import { ProfileEditsProvider } from "./shared/profile-edit-context";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return redirect("/unauthorized");
  const response = await fetch(`http://localhost:8080/profile/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok)
    throw Error(
      `Failed to fetch profile: ${response.status} response.statusText`
    );
  const profile = await response.json();
  return (
    <ProfileEditsProvider profile={profile}>{children}</ProfileEditsProvider>
  );
}
