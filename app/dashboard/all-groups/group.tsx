"use client";
import { HStack, Text } from "@chakra-ui/react";
import { type Group as GroupType } from "@/app/swr/group";
import { Avatar } from "@/app/shared/snippets/avatar";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from "@/app/shared/snippets/accordion";
import Members from "./group-members";

export default function Group({ group }: { group: GroupType }) {
  const { image, name } = group;
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
        <HStack gap="10">
          <Text fontWeight={"medium"} letterSpacing={"wide"}>
            description
          </Text>
          <Text
            textAlign={"start"}
            p={5}
            bg="bg.panel"
            w="full"
            rounded="md"
            wordBreak="break-word"
            whiteSpace={"wrap"}
            hyphens="auto"
          >
            {group.description}
          </Text>
        </HStack>
        <HStack gap="10">
          <Text fontWeight={"medium"} letterSpacing={"wide"}>
            members
          </Text>
          <Members group={group} />
        </HStack>
      </AccordionItemContent>
    </AccordionItem>
  );
}
