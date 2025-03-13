"use client";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { LuCrown } from "react-icons/lu";
import { type Profile } from "@/app/swr/profile";
import ProfileHeader from "../profile/shared/profile-header";
import { type Group } from "@/app/swr/group";
function AdminBadge() {
  return (
    <Badge
      textTransform={"lowercase"}
      shadow={"xs"}
      colorPalette="yellow"
      letterSpacing={"wide"}
      fontWeight="medium"
      variant={"solid"}
    >
      <LuCrown />
      <Text>admin</Text>
    </Badge>
  );
}
export default function Member({
  group,
  profile,
}: {
  group: Group;
  profile: Profile;
}) {
  return (
    <HStack
      bg="accent.muted/50"
      p={5}
      rounded="md"
      w="full"
      justifyContent={"space-between"}
    >
      <ProfileHeader condensed={false} profile={profile} />
      {group.adminId === profile.id && <AdminBadge />}
    </HStack>
  );
}
