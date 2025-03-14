"use client";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { type Invite } from "@/app/swr/group";
import { Avatar } from "@/app/shared/snippets/avatar";
import {
  GROUP_INVITE_STATUSES_DISPLAY,
  type GroupInviteStatus,
} from "./constants";
import { Tooltip } from "@/app/shared/snippets/tooltip";
function StatusBadge({ status }: { status: string }) {
  const { label, color } =
    GROUP_INVITE_STATUSES_DISPLAY[status as GroupInviteStatus];

  return (
    <Tooltip
      openDelay={100}
      showArrow
      content={
        GROUP_INVITE_STATUSES_DISPLAY[status as GroupInviteStatus].tooltip
      }
    >
      <Badge
        textTransform={"lowercase"}
        shadow={"xs"}
        colorPalette={color}
        letterSpacing={"wide"}
        fontWeight="medium"
        variant={"solid"}
      >
        <Text>{label}</Text>
      </Badge>
    </Tooltip>
  );
}
export default function Invitee({ invite }: { invite: Invite }) {
  const { status, image, name } = invite;
  return (
    <HStack
      bg="accent.muted/50"
      py={5}
      px={{ base: 2, md: 5 }}
      rounded="md"
      w="full"
      justifyContent={"space-between"}
    >
      <HStack gap={{ base: 2, md: 3 }} p={0} justifyContent="space-between">
        <Avatar
          bgGradient="to-tr"
          gradientFrom={{ _dark: "green.600", _light: "green.400" }}
          gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
          gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
          src={image}
          name={name}
          size={{ base: "xs", md: "md" }}
          variant={"outline"}
        />
        <Text fontSize={{ base: "sm", md: "normal" }}>{name}</Text>
      </HStack>
      <StatusBadge status={status} />
    </HStack>
  );
}
