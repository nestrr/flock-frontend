import { ActionBar, Button, useDrawerContext } from "@chakra-ui/react";
import { useGroup } from "./group-context";

export default function GroupBar() {
  const { members } = useGroup();
  const { setOpen } = useDrawerContext();
  return Object.keys(members).length > 0 ? (
    <ActionBar.Root open={true} closeOnInteractOutside={false}>
      <ActionBar.Positioner position={"fixed"} zIndex={"overlay"}>
        <ActionBar.Content
          bg="secondary.contrast"
          color="accent.fg"
          borderWidth={0}
          boxShadow={"md"}
          borderRadius="lg"
        >
          <ActionBar.SelectionTrigger borderColor={"accent"}>
            {Object.keys(members).length} future group members
          </ActionBar.SelectionTrigger>
          <ActionBar.Separator />
          <Button size="sm" onClick={() => setOpen(true)}>
            Manage
          </Button>
        </ActionBar.Content>
      </ActionBar.Positioner>
    </ActionBar.Root>
  ) : (
    <></>
  );
}
