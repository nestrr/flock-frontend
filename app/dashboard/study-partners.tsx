"use client";
import { Tabs, Card, Heading } from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import { FaPeoplePulling } from "react-icons/fa6";
import AllProfiles from "./all-profiles";
import AllGroups from "./all-groups";

export default function StudyPartners() {
  return (
    <Card.Root
      width="100%"
      variant={"elevated"}
      bg={"secondary.muted"}
      minHeight="80%"
    >
      <Card.Header textAlign={"center"} pb={0}>
        <Heading size={"3xl"}>study partners</Heading>
      </Card.Header>
      <Card.Body gap="2">
        <Tabs.Root
          defaultValue="search"
          variant={"line"}
          height="100%"
          py={3}
          lazyMount={true}
        >
          <Tabs.List>
            <Tabs.Trigger value="search">
              <LuUser />
              Search
            </Tabs.Trigger>
            <Tabs.Trigger value="groups">
              <FaPeoplePulling />
              Groups
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="search"
            alignItems={"center"}
            justifyContent="center"
            height="100%"
          >
            <AllProfiles />
          </Tabs.Content>
          <Tabs.Content
            value="groups"
            alignItems={"center"}
            height="100%"
            display={"flex"}
            w="100%"
          >
            <AllGroups />
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>
      <Card.Footer justifyContent="flex-end"></Card.Footer>
    </Card.Root>
  );
}
