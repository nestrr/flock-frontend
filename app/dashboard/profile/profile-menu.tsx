import { MenuContent, MenuItem } from "@/app/shared/snippets/menu";

export default function ProfileMenu() {
  return (
    <>
      <MenuContent>
        <MenuItem
          fontWeight="semibold"
          letterSpacing="wider"
          value="block"
          _hover={{ bg: "bg.danger" }}
        >
          Block 🚫
        </MenuItem>
        <MenuItem
          fontWeight="semibold"
          letterSpacing="wider"
          value="report"
          _hover={{ bg: "bg.danger" }}
        >
          Report 🚩
        </MenuItem>
      </MenuContent>
    </>
  );
}
