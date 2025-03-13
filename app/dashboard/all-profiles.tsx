"use client";
import {
  SimpleGrid,
  GridItem,
  Spinner,
  VStack,
  useDrawer,
  DrawerRootProvider,
} from "@chakra-ui/react";
import { useProfiles } from "../swr/profile";
import { useSession } from "next-auth/react";
import ProfileWrapper from "./profile/profile-wrapper";
import FailedLoad from "../shared/failed-load";
import { GroupProvider } from "./new-group/group-context";
import GroupBar from "./new-group/group-bar";
import GroupCreation from "./new-group/group-creation";

export default function AllProfiles() {
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
