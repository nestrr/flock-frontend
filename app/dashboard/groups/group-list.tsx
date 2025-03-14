"use client";
import FailedLoad from "@/app/shared/failed-load";
import { ToggleTip } from "@/app/shared/snippets/toggle-tip";
import { useSelfGroups } from "@/app/swr/group";
import {
  AccordionRoot,
  Card,
  Heading,
  HStack,
  IconButton,
  SegmentGroup,
  Spinner,
  useSegmentGroupContext,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { GROUP_STATUSES } from "./constants";
import Group from "./group";

function GroupStatuses() {
  const groupOptions = useMemo(
    () =>
      Object.values(GROUP_STATUSES).map((v) => ({
        label: v,
        value: v,
      })),
    []
  );
  return useMemo(
    () => (
      <HStack alignSelf={"flex-end"}>
        <SegmentGroup.Indicator />
        {groupOptions.map((o) => (
          <SegmentGroup.Item
            key={o.value}
            value={o.value}
            bg="accent.muted/50"
            p={2}
            _checked={{
              bg: "accent.emphasized",
              color: { _dark: "black", _light: "white" },
            }}
            _hover={{
              bg: "accent.emphasized/80",
              color: { _dark: "black", _light: "white" },
              cursor: "pointer",
            }}
            _groupHover={{}}
          >
            <SegmentGroup.ItemText>{o.label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        ))}
        <ToggleTip
          size="lg"
          content="Until at least one member accepts their invite, a group stays in pending status."
        >
          <IconButton
            size="xs"
            variant="subtle"
            rounded="full"
            colorPalette={"accent"}
          >
            <LuMessageCircleQuestion />
          </IconButton>
        </ToggleTip>
      </HStack>
    ),
    [groupOptions]
  );
}
export default function GroupsList() {
  const { data: session, status: sessionStatus } = useSession();
  const { value } = useSegmentGroupContext();
  const {
    data: groups,
    isLoading,
    error,
  } = useSelfGroups(session?.accessToken, value ?? GROUP_STATUSES.ACTIVE);
  if (sessionStatus === "loading" || isLoading)
    return (
      <VStack
        justifyContent={"center"}
        alignItems="center"
        w="full"
        height="full"
      >
        <Spinner
          size="xl"
          width="5em"
          height="5em"
          color="accent.emphasized"
          css={{ "--spinner-track-color": "colors.secondary" }}
          borderWidth="10px"
        />
      </VStack>
    );
  if (error || !session || !groups) return <FailedLoad />;
  return (
    <VStack
      alignItems="start"
      rounded="md"
      px={5}
      py={0}
      w="full"
      h="full"
      mdDown={{ scrollbarWidth: "auto" }}
      overflowY="auto"
      scrollbarWidth={"thin"}
    >
      <GroupStatuses />
      {groups.length ? (
        <AccordionRoot
          collapsible
          rounded="md"
          spaceY={3}
          py={3}
          lazyMount={true}
        >
          {groups.map((group) => (
            <Group key={group.id} group={group} />
          ))}
        </AccordionRoot>
      ) : (
        <Card.Root
          w="full"
          h="full"
          textAlign={"center"}
          border={0}
          bg="accent.muted/50"
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
        >
          <Card.Header>
            <Heading size="2xl">nothing here! 👻</Heading>
          </Card.Header>
          <Card.Body flex={0}>No matching groups.</Card.Body>
        </Card.Root>
      )}
    </VStack>
  );
}
