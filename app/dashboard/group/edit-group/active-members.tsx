"use client";
import { useGroupMembers, type Group } from "@/app/swr/group";
import { Text, Spinner, VStack, Heading, IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import FailedLoad from "@/app/shared/failed-load";
import { useGroup, useGroupDispatch } from "../shared/group-context";
import { LuCrown, LuX } from "react-icons/lu";
import { removeMember as removeMemberAction } from "@/app/actions/group";
import Member from "../shared/member";
import { Tooltip } from "@/app/shared/snippets/tooltip";
function MemberActions({ id }: { id: string }) {
  const { id: groupId } = useGroup() as Group;
  const dispatch = useGroupDispatch();
  async function removeMember() {
    await removeMemberAction(groupId, id);
  }
  return (
    <>
      <Tooltip
        content="Remove this member"
        showArrow
        openDelay={300}
        closeDelay={300}
      >
        <IconButton size="2xs" variant={"surface"} onClick={removeMember}>
          <LuX />
        </IconButton>
      </Tooltip>
      <Tooltip
        content="Transfer admin rights"
        showArrow
        openDelay={300}
        closeDelay={300}
      >
        <IconButton
          size="2xs"
          variant={"surface"}
          onClick={() => dispatch({ type: "assignAdmin", payload: id })}
        >
          <LuCrown />
        </IconButton>
      </Tooltip>
    </>
  );
}
export default function ActiveMembers() {
  const group = useGroup() as Group;
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
      bg="secondary.panel/30"
      h="full"
    >
      {members.length > 1 ? (
        members
          .filter(({ id }) => id !== session!.user.id) // Do not display own profile
          .map((member) => (
            <Member
              group={group}
              key={member.id}
              profile={member}
              actions={<MemberActions id={member.id} />}
            />
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
