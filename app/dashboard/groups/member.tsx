"use client";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { LuCrown } from "react-icons/lu";
import { type Profile } from "@/app/swr/profile";
import { type Group } from "@/app/swr/group";
import { Avatar } from "@/app/shared/snippets/avatar";
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
  profile: Partial<Profile>;
}) {
  const { image, name } = profile;
  return (
    <HStack
      bg="accent.muted/50"
      p={5}
      rounded="md"
      w="full"
      justifyContent={"space-between"}
    >
      <HStack gap="3" p={0} justifyContent="space-between">
        <Avatar
          bgGradient="to-tr"
          gradientFrom={{ _dark: "green.600", _light: "green.400" }}
          gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
          gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
          src={image}
          name={name}
          variant={"outline"}
        />
        <Text fontSize={{ base: "sm", md: "normal" }}>{name}</Text>
      </HStack>
      {group.adminId === profile.id && <AdminBadge />}
    </HStack>
  );
}
