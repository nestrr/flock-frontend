"use client";
import { Avatar } from "@/app/shared/snippets/avatar";
import { MenuTrigger } from "@/app/shared/snippets/menu";
import { type Profile } from "@/app/swr/profile";
import {
  Stack,
  HStack,
  Text,
  type UseDialogReturn,
  Group,
  IconButton,
} from "@chakra-ui/react";
import { LuEllipsis, LuMaximize2 } from "react-icons/lu";

type ProfileHeaderProps = { profile: Profile } & (
  | {
      condensed: true;
      setDialogOpen: UseDialogReturn["setOpen"];
    }
  | { condensed: false; setDialogOpen?: never }
);
export default function ProfileHeader({
  profile,
  condensed: withActions,
  setDialogOpen,
}: ProfileHeaderProps) {
  const { image, name, degree } = profile;
  return (
    <HStack gap="3" p={0} justifyContent="space-between">
      <Group>
        <Avatar
          bgGradient="to-tr"
          gradientFrom={{ _dark: "green.600", _light: "green.400" }}
          gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
          gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
          src={image}
          name={name}
          variant={"outline"}
        />
        <Stack gap="0">
          <Text fontWeight="semibold" textStyle="sm">
            {name}
          </Text>
          {degree?.degreeTypeCode && degree?.programName ? (
            <Text
              textStyle="sm"
              lineClamp={1}
            >{`${degree.degreeTypeCode} | ${degree.programName}`}</Text>
          ) : (
            <Text fontStyle={"italic"} fontSize={"sm"} lineHeight={1}>
              degree unknown
            </Text>
          )}
        </Stack>
      </Group>
      {withActions && (
        <Group>
          <IconButton
            variant="subtle"
            size="2xs"
            rounded="full"
            onClick={() => setDialogOpen(true)}
          >
            <LuMaximize2 />
          </IconButton>
          <MenuTrigger asChild>
            <IconButton variant="subtle" size="2xs" rounded="full">
              <LuEllipsis />
            </IconButton>
          </MenuTrigger>
        </Group>
      )}
    </HStack>
  );
}
