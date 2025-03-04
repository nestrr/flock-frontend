"use server";
import { auth } from "@/auth";
import { ProfileEditsProviderWrapper } from "./shared/profile-edit-context";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return redirect("/unauthorized");

  return (
    <ProfileEditsProviderWrapper accessToken={session.accessToken!}>
      {children}
    </ProfileEditsProviderWrapper>
  );
}
