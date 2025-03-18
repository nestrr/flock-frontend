import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
} from "@/app/shared/snippets/dialog";
import {
  Button,
  Heading,
  Mark,
  Text,
  useDialogContext,
} from "@chakra-ui/react";
import { type GroupInEdit, useGroup } from "../shared/group-context";
import { useState } from "react";
import debounce from "debounce";
import InputItem from "@/app/shared/input-item";
import { deleteGroup } from "@/app/actions/group";
import { toaster } from "@/app/shared/snippets/toaster";

export default function DeleteGroup() {
  const { name, id } = useGroup() as GroupInEdit;
  const { setOpen } = useDialogContext();
  const [confirmationText, setConfirmationText] = useState("");
  const debouncedConfirmationUpdate = debounce(
    (setConfirmationText, newValue) => {
      setConfirmationText(newValue);
    },
    300
  );
  const TRIGGER = "delete";
  async function finalizeDelete() {
    setOpen(false);
    const loadingToast = toaster.loading({
      title: "Deleting group...",
      description: "This usually takes us a while.",
    });
    const response = await deleteGroup(id);
    toaster.dismiss(loadingToast);
    if (response.success) {
      toaster.success({ title: `Group deleted! 🪦 Refresh your browser.` });
    } else {
      toaster.error({ title: `🙁 Something went wrong. ${response.message}` });
    }
  }
  return (
    <>
      <DialogBackdrop />
      <DialogTrigger />
      <DialogContent justifyContent={"center"} alignItems={"center"} spaceY={5}>
        <DialogCloseTrigger />
        <DialogHeader>
          <Heading size="lg">
            Are you sure you want to delete{" "}
            <Mark
              wordWrap={"break-word"}
              wordBreak={"break-all"}
              variant="subtle"
            >
              {name}
            </Mark>
            ?
          </Heading>
        </DialogHeader>
        <DialogBody spaceY={5}>
          <Text>
            You will not be able to undo this! Type &apos;{TRIGGER}&apos; in the
            textbox below to delete this group.
          </Text>
          <InputItem
            label="confirm"
            placeholder={`Type the word '${TRIGGER}', then click Delete.`}
            onChange={(e) => {
              debouncedConfirmationUpdate(setConfirmationText, e.target.value);
            }}
          />
        </DialogBody>
        <DialogFooter spaceX={10}>
          <Button
            colorPalette={"red"}
            variant="surface"
            onClick={finalizeDelete}
            disabled={confirmationText !== TRIGGER}
          >
            Delete
          </Button>
          <Button
            colorPalette={"accent"}
            variant="surface"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
