import {
  Drawer,
  Heading,
  IconButton,
  VStack,
  HStack,
  Stack,
  Button,
  Textarea,
  Alert,
} from "@chakra-ui/react";
import { useGroup, useGroupDispatch } from "./group-context";
import ProfileHeader from "../profile/shared/profile-header";
import { LuImage, LuSparkle, LuX } from "react-icons/lu";
import debounce from "debounce";
import { Avatar } from "@/app/shared/snippets/avatar";
import { ringCss } from "@/theme";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/app/shared/snippets/file-upload";
import { toaster } from "@/app/shared/snippets/toaster";
import InputItem from "@/app/shared/input-item";
import InputIcon from "@/app/profile/shared/input-icon";
import { saveGroup } from "@/app/actions/group";
import { useSession } from "next-auth/react";
import { useSelfGroups } from "@/app/swr/group";
import { Skeleton } from "@/app/shared/snippets/skeleton";
import {
  DESCRIPTION_TOO_SHORT,
  GROUP_ERRORS,
  MIN_DESCRIPTION_LENGTH,
  MIN_NAME_LENGTH,
  NAME_TOO_SHORT,
} from "./constants/errors";
import { GROUP_STATUSES } from "../all-groups/constants";

export function GroupMembers() {
  const { members } = useGroup();
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
export function GeneralDetails() {
  const { name, description, errors } = useGroup();
  const dispatch = useGroupDispatch();
  const debouncedNameUpdate = debounce((dispatch, newName) => {
    dispatch({
      type: "updateDetails",
      payload: { name: newName.trim() },
    });
  }, 300);
  const debouncedDescriptionUpdate = debounce((dispatch, newDescription) => {
    dispatch({
      type: "updateDetails",
      payload: { description: newDescription.trim() },
    });
  }, 300);
  return (
    <VStack h="full" alignItems="start" w="full" gapY={5}>
      <Heading fontSize="lg">general details</Heading>
      <Stack
        justifyContent={"center"}
        alignItems="center"
        w="full"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
        bg="accent.muted/50"
        p={3}
        rounded="md"
      >
        <Avatar
          name={name ?? "new group"}
          bgGradient="to-tr"
          gradientFrom={{ _dark: "green.600", _light: "green.400" }}
          gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
          gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
          css={ringCss}
          aspectRatio={"square"}
          boxShadow={"xs"}
          h="5em"
          w="5em"
        />
        <FileUploadRoot
          w="min-content"
          accept={["image/png", "image/jpeg"]}
          maxFileSize={20_000}
          onFileReject={() => {
            toaster.create({
              type: "error",
              title:
                "Please upload a PNG or JPEG file that is no bigger than 20MB.",
            });
          }}
        >
          <FileUploadTrigger asChild>
            <Button variant="surface" colorPalette="accent">
              <LuImage /> Upload a new group picture
            </Button>
          </FileUploadTrigger>
          <FileUploadList />
        </FileUploadRoot>
      </Stack>
      <InputItem
        label="name"
        placeholder="What's your group going to be called?"
        defaultValue={name}
        onChange={(e) => {
          debouncedNameUpdate(dispatch, e.target.value);
        }}
        endAddon={
          <InputIcon
            tooltip={"A group name is required before you send invites."}
            icon={<LuSparkle />}
          />
        }
        alert={errors.has(NAME_TOO_SHORT) ? GROUP_ERRORS[NAME_TOO_SHORT] : ""}
        min={100}
      />
      <InputItem
        label="description"
        alert={
          errors.has(DESCRIPTION_TOO_SHORT)
            ? GROUP_ERRORS[DESCRIPTION_TOO_SHORT]
            : ""
        }
      >
        <Textarea
          placeholder="What's the group about?"
          aria-label="What's the group about?"
          rounded="md"
          borderWidth={0}
          minH="3em"
          defaultValue={description}
          rows={5}
          onChange={(e) => {
            debouncedDescriptionUpdate(dispatch, e.target.value);
          }}
        />
      </InputItem>
    </VStack>
  );
}
function GroupActions() {
  const dispatch = useGroupDispatch();
  const group = useGroup();
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
