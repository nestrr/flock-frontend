"use client";
import {
  Button,
  DrawerRootProvider,
  HStack,
  Switch,
  SwitchRootProvider,
  Table,
  Text,
  useDrawer,
  useSwitch,
  VStack,
  useDialog,
  DialogRootProvider,
} from "@chakra-ui/react";
import { type Group as GroupType } from "@/app/swr/group";
import { Avatar } from "@/app/shared/snippets/avatar";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from "@/app/shared/snippets/accordion";
import Members from "./group-members";
import { useSession } from "next-auth/react";
import { Tooltip } from "@/app/shared/snippets/tooltip";
import EditGroup from "../group/edit-group/group-edit";
import { GroupProvider } from "../group/shared/group-context";
import DeleteGroup from "../group/delete-group/group-deletion";

export default function Group({ group }: { group: GroupType }) {
  const { image, name } = group;
  const { data: session } = useSession();
  const activeMemberSwitch = useSwitch();
  const editDrawer = useDrawer();
  const confirmDeleteDialog = useDialog();
  return (
    <AccordionItem value={group.id} border={0}>
      <AccordionItemTrigger
        bg="accent.muted"
        _hover={{ bg: "accent.emphasized/70" }}
        _open={{ bg: "accent.emphasized", color: "accent.fg" }}
        p={2}
        display="flex"
      >
        <Avatar
          bgGradient="to-tr"
          gradientFrom={{ _dark: "green.600", _light: "green.400" }}
          gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
          gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
          src={image}
          name={name}
          variant={"outline"}
        />
        <Text fontWeight="semibold" w="3/4" truncate m={0} marginBlockEnd={0}>
          {name}
        </Text>
      </AccordionItemTrigger>
      <AccordionItemContent bg="accent.subtle/20" p={5} spaceY={5}>
        <SwitchRootProvider display="flex" size="sm" value={activeMemberSwitch}>
          <Table.Root>
            <Table.Body spaceY={{ base: 5, md: 0 }}>
              <Table.Row
                display={{ base: "flex", md: "table-row" }}
                flexDir={"column"}
                w="full"
                bg="transparent"
              >
                <Table.Cell
                  fontWeight={"medium"}
                  letterSpacing={"wide"}
                  border={0}
                  fontSize={{ base: "md", md: "normal" }}
                  textAlign={"center"}
                >
                  description
                </Table.Cell>
                <Table.Cell py={{ base: 0, md: 3 }} border={0}>
                  <Text
                    textAlign={"center"}
                    p={5}
                    bg="bg.panel"
                    rounded="md"
                    wordBreak="break-word"
                    whiteSpace={"wrap"}
                    hyphens="auto"
                  >
                    {group.description}
                  </Text>
                </Table.Cell>
              </Table.Row>
              <Table.Row
                bg="transparent"
                display={{ base: "flex", md: "table-row" }}
                flexDir="column"
              >
                <Table.Cell border={0}>
                  <VStack gap={2} justifyContent={"center"}>
                    <Text
                      fontWeight={"medium"}
                      fontSize={{ base: "md", md: "normal" }}
                      letterSpacing={"wide"}
                    >
                      members
                    </Text>
                    {session?.user.id === group.adminId && (
                      <HStack>
                        <Switch.HiddenInput />
                        <Switch.Control
                          bg={"gray.900"}
                          _checked={{ bg: "accent.emphasized" }}
                        >
                          <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label fontStyle="italic" fontWeight={"light"}>
                          active only
                        </Switch.Label>
                      </HStack>
                    )}
                  </VStack>
                </Table.Cell>
                <Table.Cell py={{ base: 0, md: 3 }} border={0}>
                  <Members group={group} />
                </Table.Cell>
              </Table.Row>
              <Table.Row
                bg="transparent"
                display={{ base: "flex", md: "table-row" }}
                flexDir={"column"}
              >
                <Table.Cell border={0}></Table.Cell>
                <Table.Cell
                  border={0}
                  display="flex"
                  gap={5}
                  justifyContent={{ base: "center", md: "start" }}
                >
                  {session?.user.id === group.adminId && (
                    <HStack>
                      <GroupProvider group={group}>
                        <DrawerRootProvider value={editDrawer}>
                          <Button
                            colorPalette={"accent"}
                            variant="surface"
                            onClick={() => editDrawer.setOpen(true)}
                          >
                            Edit
                          </Button>
                          <EditGroup />
                        </DrawerRootProvider>
                        <DialogRootProvider
                          placement={"center"}
                          size={{ base: "xl", md: "lg" }}
                          value={confirmDeleteDialog}
                        >
                          <Button
                            colorPalette="red"
                            variant="surface"
                            onClick={() => confirmDeleteDialog.setOpen(true)}
                          >
                            Delete
                          </Button>
                          <DeleteGroup />
                        </DialogRootProvider>
                      </GroupProvider>
                    </HStack>
                  )}
                  {session?.user.id === group.adminId ? (
                    <Tooltip
                      showArrow
                      openDelay={300}
                      closeDelay={300}
                      content={
                        session?.user.id === group.adminId
                          ? "You cannot leave yet! Transfer your admin duties to someone else through the Edit button first."
                          : ""
                      }
                    >
                      <Button colorPalette="red" disabled variant="surface">
                        Leave
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button colorPalette="red" disabled variant="surface">
                      Leave
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </SwitchRootProvider>
      </AccordionItemContent>
    </AccordionItem>
  );
}
