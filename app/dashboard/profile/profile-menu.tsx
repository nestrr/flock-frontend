import { MenuContent, MenuItem } from "@/app/shared/snippets/menu";
import { HStack, Portal, Text, useMenuContext } from "@chakra-ui/react";
import { useGroupDispatch } from "../new-group/group-context";
import { type Profile } from "@/app/swr/profile";

export default function ProfileMenu({ profile }: { profile: Profile }) {
  const dispatch = useGroupDispatch();
  const { open } = useMenuContext();
  return open ? (
    <Portal>
      <MenuContent>
        <MenuItem
          fontWeight="semibold"
          letterSpacing="wider"
          value="add"
          _hover={{ bg: "accent" }}
          onClick={() => {
            dispatch({ type: "addMember", payload: profile });
          }}
        >
          <HStack w="100%" gap={5} justifyContent={"space-between"}>
            <Text>Add to new group</Text>
            <Text>👥</Text>
          </HStack>
        </MenuItem>
        <MenuItem
          fontWeight="semibold"
          letterSpacing="wider"
          value="block"
          _hover={{ bg: "bg.danger" }}
        >
          <HStack w="100%" justifyContent={"space-between"}>
            <Text>Block</Text>
            <Text> 🚫</Text>
          </HStack>
        </MenuItem>
        <MenuItem
          fontWeight="semibold"
          letterSpacing="wider"
          value="report"
          _hover={{ bg: "bg.danger" }}
        >
          <HStack w="100%" justifyContent={"space-between"}>
            <Text>Report</Text>
            <Text>🚩</Text>
          </HStack>
        </MenuItem>
      </MenuContent>
    </Portal>
  ) : (
    <></>
  );
}
