import {
  Drawer,
  Heading,
  IconButton,
  VStack,
  HStack,
  Button,
  Alert,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { toaster } from "@/app/shared/snippets/toaster";
import { saveGroup } from "@/app/actions/group";
import { useSession } from "next-auth/react";
import { useSelfGroups } from "@/app/swr/group";
import { Skeleton } from "@/app/shared/snippets/skeleton";
import {
  MIN_DESCRIPTION_LENGTH,
  MIN_NAME_LENGTH,
} from "../shared/constants/errors";
import {
  type NewGroup,
  useGroup,
  useGroupDispatch,
} from "../shared/group-context";
import ProfileHeader from "../../profile/shared/profile-header";
import { GROUP_STATUSES } from "../../groups/constants";
import GeneralDetails from "../shared/general-details";

function GroupMembers() {
  const { members } = useGroup() as NewGroup;
  const dispatch = useGroupDispatch();
  return (
    <VStack h="full" alignItems="start" w="full" gapY={3}>
      <Heading fontSize="lg">members</Heading>
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
        maxH="7/8"
      >
        {Object.entries(members).map(([id, rest]) => (
          <HStack
            bg="accent.muted/50"
            p={5}
            rounded="md"
            key={id}
            w="full"
            justifyContent={"space-between"}
          >
            <ProfileHeader condensed={false} profile={{ id, ...rest }} />
            <IconButton
              size="2xs"
              variant={"surface"}
              onClick={() => dispatch({ type: "removeMember", payload: id })}
            >
              <LuX />
            </IconButton>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

function GroupActions() {
  const dispatch = useGroupDispatch();
  const group = useGroup() as NewGroup;
  const { data: session, status } = useSession();
  const { mutate } = useSelfGroups(
    session?.accessToken,
    GROUP_STATUSES.PENDING
  );
  async function save() {
    if (group.description.length < MIN_DESCRIPTION_LENGTH) {
      dispatch({ type: "setError", payload: "DESCRIPTION_TOO_SHORT" });
    } else if (group.name.length < MIN_NAME_LENGTH)
      dispatch({ type: "setError", payload: "NAME_TOO_SHORT" });
    else {
      await finalize();
    }
  }
  async function finalize() {
    const loadingToast = toaster.loading({
      title: "Sending invites...",
      description: "This usually takes us a while.",
    });
    const response = await saveGroup(group);
    toaster.dismiss(loadingToast);
    if (response.success) {
      mutate();
      toaster.success({ title: `Invites sent! 🎉` });
      dispatch({ type: "clear" });
    } else {
      toaster.error({ title: `🙁 Something went wrong. ${response.message}` });
    }
  }
  if (status === "loading")
    return <Skeleton w="full" height="3em" bg="accent.muted/50" />;
  return (
    <HStack w="full" gap={10}>
      <Button variant="surface" flex={1} colorPalette={"accent"} onClick={save}>
        Send Invites
      </Button>
      <Button
        flex={1}
        variant={"solid"}
        bg={"red.700/80"}
        _hover={{ bg: "red.700" }}
        colorPalette={"red"}
        onClick={() => dispatch({ type: "clear" })}
      >
        Start Over
      </Button>
    </HStack>
  );
}
export default function GroupCreation() {
  return (
    <>
      <Drawer.Backdrop />
      <Drawer.Trigger />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header spaceY={5}>
            <HStack w="full" justifyContent="space-between">
              <Drawer.Title asChild>
                <Heading fontSize="2xl">new group</Heading>
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton size="xs">
                  <LuX />
                </IconButton>
              </Drawer.CloseTrigger>
            </HStack>
            <Alert.Root status="success" justifyContent={"center"}>
              <Alert.Title textAlign={"center"}>
                💡 Once you click &apos;Send Invites&apos;, all your
                group&apos;s members will get an invite through email. They can
                accept or reject the invite within 48 hours.
              </Alert.Title>
            </Alert.Root>
          </Drawer.Header>
          <Drawer.Body>
            <VStack
              display="flex"
              flexDir="column"
              gapY={5}
              h="100%"
              justifyContent={"space-between"}
            >
              <GeneralDetails />
              <GroupMembers />
            </VStack>
          </Drawer.Body>
          <Drawer.Footer>
            <GroupActions />
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </>
  );
}
