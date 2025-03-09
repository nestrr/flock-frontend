"use client";
import {
  Tabs,
  Card,
  SimpleGrid,
  GridItem,
  Heading,
  Spinner,
  VStack,
  useDrawer,
  DrawerRootProvider,
} from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { useProfiles } from "../swr/profile";
import { useSession } from "next-auth/react";
import ProfileWrapper from "./profile/profile-wrapper";
import FailedLoad from "../shared/failed-load";
import { GroupProvider } from "./group/group-context";
import GroupBar from "./group/group-bar";
import GroupCreation from "./group/group-creation";

function AllProfiles() {
  const { data: session, status: sessionStatus } = useSession();
  const drawer = useDrawer();
  const {
    data: profiles,
    isLoading,
    error,
  } = useProfiles(session?.accessToken, 1, 8);
  if (sessionStatus === "loading" || isLoading)
    return (
      <VStack justifyContent={"center"} alignItems="center" height="100%">
        <Spinner
          size="xl"
          width="10em"
          height="10em"
          color="accent.emphasized"
          css={{ "--spinner-track-color": "colors.secondary" }}
          borderWidth="4px"
        />
      </VStack>
    );
  if (error || !session) return <FailedLoad />;
  return (
    <GroupProvider userId={session.user.id}>
      <SimpleGrid
        columns={[4]}
        gap="1em"
        width="min-fit"
        alignItems={"center"}
        justifyItems={"center"}
      >
        {profiles?.map((profile, index) => (
          <GridItem key={index} colSpan={{ base: 4, lg: 2, xl: 1 }}>
            <ProfileWrapper profile={profile} />
          </GridItem>
        ))}
      </SimpleGrid>

      <DrawerRootProvider size={{ mdDown: "full", base: "md" }} value={drawer}>
        <GroupBar />
        <GroupCreation />
      </DrawerRootProvider>
    </GroupProvider>
  );
}
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
        <Tabs.Root defaultValue="search" variant={"line"} height="100%" py={3}>
          <Tabs.List>
            <Tabs.Trigger value="search">
              <LuUser />
              Search
            </Tabs.Trigger>
            <Tabs.Trigger value="projects">
              <LuFolder />
              Projects
            </Tabs.Trigger>
            <Tabs.Trigger value="tasks">
              <LuSquareCheck />
              Settings
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="search" alignItems={"center"} height="100%">
            <AllProfiles />
          </Tabs.Content>
          <Tabs.Content value="projects">Manage your projects</Tabs.Content>
          <Tabs.Content value="tasks">
            Manage your tasks for freelancers
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>
      <Card.Footer justifyContent="flex-end"></Card.Footer>
    </Card.Root>
  );
}
