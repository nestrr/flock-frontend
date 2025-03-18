"use client";
import {
  Drawer,
  Heading,
  IconButton,
  VStack,
  HStack,
  Button,
  Alert,
  useDrawerContext,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { toaster } from "@/app/shared/snippets/toaster";
import { updateGroup } from "@/app/actions/group";
import {
  type GroupInEdit,
  useGroup,
  useGroupDispatch,
  useGroupSummary,
} from "../shared/group-context";
import {
  MIN_DESCRIPTION_LENGTH,
  MIN_NAME_LENGTH,
} from "../shared/constants/errors";
import GroupMembers from "./group-members";
import GeneralDetails from "../shared/general-details";

function GroupActions() {
  const dispatch = useGroupDispatch();
  const group = useGroup() as GroupInEdit;
  const summary = useGroupSummary();
  const { setOpen } = useDrawerContext();
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
      title: "Saving your changes...",
      description: "This usually takes us a while.",
    });
    const response = await updateGroup(summary);
    toaster.dismiss(loadingToast);
    if (response.success) {
      toaster.success({
        title: `Group updated! 🎉 Refresh the page to see your changes.`,
      });
      dispatch({ type: "clear" });
    } else {
      toaster.error({ title: `🙁 Something went wrong. ${response.message}` });
    }
  }
  return (
    <HStack w="full" gap={10}>
      <Button variant="surface" flex={1} colorPalette={"accent"} onClick={save}>
        Save
      </Button>
      <Button
        flex={1}
        variant={"solid"}
        bg={"red.700/80"}
        _hover={{ bg: "red.700" }}
        colorPalette={"red"}
        onClick={() => {
          setOpen(false);
          dispatch({ type: "clear" });
        }}
      >
        Cancel
      </Button>
    </HStack>
  );
}
export default function EditGroup() {
  return (
    <>
      <Drawer.Backdrop />
      <Drawer.Trigger />
      <Drawer.Positioner>
        <Drawer.Content maxW={{ base: "100%", md: "lg" }} flex={1}>
          <Drawer.Header spaceY={5}>
            <HStack w="full" justifyContent="space-between">
              <Drawer.Title asChild>
                <Heading fontSize="2xl">edit group</Heading>
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton size="xs">
                  <LuX />
                </IconButton>
              </Drawer.CloseTrigger>
            </HStack>
            <Alert.Root status="success" justifyContent={"center"}>
              <Alert.Title textAlign={"center"}>
                💡 Once you transfer admin rights to someone else, you can leave
                the group if you wish. (You can only do this with an active
                member.)
              </Alert.Title>
            </Alert.Root>
          </Drawer.Header>
          <Drawer.Body>
            <VStack display="flex" gapY={8} flexDir="column" h="100%">
              <GeneralDetails />
              <GroupMembers />
            </VStack>
          </Drawer.Body>
          <Drawer.Footer mt={5}>
            <GroupActions />
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </>
  );
}
