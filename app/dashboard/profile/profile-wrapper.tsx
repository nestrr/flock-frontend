"use client";
import { useDialog, useMenu, MenuRootProvider } from "@chakra-ui/react";
import { type Profile as ProfileType } from "../../swr/profile";
import ProfileMenu from "./profile-menu";
import CondensedProfile from "./condensed-profile";
import FullProfile from "./full-profile";

export default function ProfileWrapper({ profile }: { profile: ProfileType }) {
  const dialog = useDialog();
  const menu = useMenu({
    positioning: {
      placement: "bottom-end",
    },
  });

  return (
    <MenuRootProvider value={menu}>
      <CondensedProfile profile={profile} dialog={dialog} />
      <ProfileMenu profile={profile} />
      <FullProfile profile={profile} dialog={dialog} />
    </MenuRootProvider>
  );
}
