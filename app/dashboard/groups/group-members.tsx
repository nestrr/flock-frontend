"use client";
import { useGroupMembers, useInvites, type Group } from "@/app/swr/group";
import {
  Text,
  Spinner,
  VStack,
  useSwitchContext,
  Heading,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Member from "../group/shared/member";
import FailedLoad from "@/app/shared/failed-load";
import Invitee from "../group/shared/invitee";
function ActiveMembers({ group }: { group: Group }) {
  const { data: session, status } = useSession();
  const {
    data: members,
    isLoading,
    error,
  } = useGroupMembers(session?.accessToken, group.id);
  if (status === "loading" || isLoading)
    return (
      <VStack
        bg="bg.panel"
        justifyContent={"center"}
        alignItems="center"
        height="100%"
        w="100%"
        py={5}
      >
        <Spinner
          size="md"
          width="3em"
          height="3em"
          color="accent.emphasized"
          css={{ "--spinner-track-color": "colors.secondary" }}
          borderWidth="10px"
        />
      </VStack>
    );
  if (error || !session || !members) return <FailedLoad />;
  return (
    <VStack
      alignItems="start"
      rounded="md"
      p={2}
      w="full"
      mdDown={{ scrollbarWidth: "auto" }}
      overflowY="auto"
      scrollbarWidth={"thin"}
      bg="bg.panel"
      h="full"
    >
      {members.length > 1 ? (
        members
          .filter(({ id }) => id !== session!.user.id) // Do not display own profile
          .map((member) => (
            <Member key={member.id} group={group} profile={member} />
          ))
      ) : (
        <VStack alignItems={"center"} gap={0} py={1} w="full">
          <Heading size="lg">nothing here! 👻</Heading>
          <Text fontStyle="italic"> none found </Text>
        </VStack>
      )}
    </VStack>
  );
}
function AllInvited({ group }: { group: Group }) {
  const { data: session, status } = useSession();
  const {
    data: invites,
    isLoading,
    error,
  } = useInvites(session?.accessToken, group.id);
  if (status === "loading" || isLoading)
    return (
      <VStack
        bg="bg.panel"
        justifyContent={"center"}
        alignItems="center"
        height="100%"
        w="100%"
        py={5}
      >
        <Spinner
          size="md"
          width="3em"
          height="3em"
          color="accent.emphasized"
          css={{ "--spinner-track-color": "colors.secondary" }}
          borderWidth="10px"
        />
      </VStack>
    );
  if (error || !session || !invites) return <FailedLoad />;
  return (
    <VStack
      alignItems="start"
      rounded="md"
      p={2}
      w="full"
      mdDown={{ scrollbarWidth: "auto" }}
      overflowY="auto"
      scrollbarWidth={"thin"}
      bg="bg.panel"
      h="full"
    >
      {invites.length ? (
        invites.map((invite) => (
          <Invitee key={invite.personId} invite={invite} />
        ))
      ) : (
        <VStack alignItems={"center"} gap={0} py={1} w="full">
          <Heading size="lg">nothing here! 👻</Heading>
          <Text fontStyle="italic"> none found </Text>
        </VStack>
      )}
    </VStack>
  );
}
export default function Members({ group }: { group: Group }) {
  const { checked } = useSwitchContext();
  return checked ? (
    <ActiveMembers group={group} />
  ) : (
    <AllInvited group={group} />
  );
}
