"use client";
import { useGroupMembers, type Group } from "@/app/swr/group";
import { Spinner, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Member from "./member";
import FailedLoad from "@/app/shared/failed-load";
export default function Members({ group }: { group: Group }) {
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
      borderColor={"accent.fg/50"}
      borderWidth={1}
      bg="bg.panel"
      maxH="7/8"
    >
      {members
        .filter(({ id }) => id !== session!.user.id) // Do not display own profile
        .map((member) => (
          <Member key={member.id} group={group} profile={member} />
        ))}
    </VStack>
  );
}
