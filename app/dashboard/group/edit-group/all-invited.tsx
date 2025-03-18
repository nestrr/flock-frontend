"use client";
import { useInvites, type Group } from "@/app/swr/group";
import { Text, Spinner, VStack, Heading, IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import FailedLoad from "@/app/shared/failed-load";
import { useGroup } from "../shared/group-context";
import { GROUP_INVITE_STATUSES } from "../../groups/constants";
import Invitee from "../shared/invitee";
import { LuX } from "react-icons/lu";
import { cancelInvite as cancelInviteAction } from "@/app/actions/group";
import { Tooltip } from "@/app/shared/snippets/tooltip";
import { toaster } from "@/app/shared/snippets/toaster";

function InviteeActions({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) {
  const { id: groupId } = useGroup() as Group;
  const { mutate } = useInvites(accessToken, groupId);
  async function cancelInvite() {
    const loadingToast = toaster.loading({
      title: "Canceling invite...",
      description: "This usually takes us a while.",
    });
    const response = await cancelInviteAction(groupId, id);
    toaster.dismiss(loadingToast);
    if (response.success) {
      mutate();
      toaster.success({ title: `Invite cancelled!` });
    } else {
      toaster.error({ title: `🙁 Something went wrong. ${response.message}` });
    }
  }
  return (
    <Tooltip
      content="Cancel this member's invite"
      showArrow
      openDelay={300}
      closeDelay={300}
    >
      <IconButton size="2xs" variant={"surface"} onClick={cancelInvite}>
        <LuX />
      </IconButton>
    </Tooltip>
  );
}
export default function AllInvited() {
  const { data: session, status } = useSession();
  const group = useGroup() as Group;
  const {
    data: invites,
    isLoading,
    error,
  } = useInvites(session?.accessToken, group.id);
  if (status === "loading" || isLoading)
    return (
      <VStack
        bg="accent.muted"
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
      bg="secondary.panel/30"
      h="full"
    >
      {invites.length ? (
        invites
          .filter(({ status }) => status === GROUP_INVITE_STATUSES.PENDING) // Only include pending invites
          .map((invite) => (
            <Invitee
              key={invite.personId}
              invite={invite}
              actions={
                <InviteeActions
                  id={invite.personId}
                  accessToken={session.accessToken!}
                />
              }
              showInviteStatus={false}
            />
          ))
      ) : (
        <>
          <Heading size="2xl">nothing here! 👻</Heading>
          <Text fontStyle="italic"> none found </Text>
        </>
      )}
    </VStack>
  );
}
