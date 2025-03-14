"use client";
import {
  SimpleGrid,
  GridItem,
  Spinner,
  VStack,
  useDrawer,
  DrawerRootProvider,
  createListCollection,
  HStack,
  Text,
} from "@chakra-ui/react";
import {
  type Campus,
  type Standing,
  useCampuses,
  useProfiles,
  useStandings,
} from "../swr/profile";
import { useSession } from "next-auth/react";
import ProfileWrapper from "./profile/profile-wrapper";
import FailedLoad from "../shared/failed-load";
import { GroupProvider } from "./new-group/group-context";
import GroupBar from "./new-group/group-bar";
import GroupCreation from "./new-group/group-creation";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../shared/snippets/select";
import { Tooltip } from "../shared/snippets/tooltip";
import { DAYS } from "../shared/constants";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../shared/snippets/accordion";
function CampusSelect() {
  const { data: session, status } = useSession();
  const {
    data: campuses,
    error: fetchError,
    isLoading,
  } = useCampuses(session?.accessToken);

  const campusList = createListCollection({
    items: campuses
      ? Object.entries(campuses).map(([id, campus]) => ({
          label: (campus as Campus).name,
          value: id,
        }))
      : [],
  });
  if (isLoading || status === "loading") return <></>;
  if (fetchError || !campuses) return <>Failed to load</>;
  return (
    <SelectRoot
      variant="subtle"
      multiple
      w="10em"
      shadowColor={"white"}
      collection={campusList}
      rounded="md !important"
    >
      <SelectTrigger bg="accent" clearable>
        <SelectValueText placeholder="campus" color="accent.fg" />
      </SelectTrigger>
      <SelectContent>
        {campusList.items.map((campus) => (
          <Tooltip
            openDelay={50}
            closeDelay={50}
            showArrow
            content={
              campuses![campus.value]?.description ?? "No description found."
            }
            key={campus.value}
          >
            <SelectItem item={campus}>{campus.label}</SelectItem>
          </Tooltip>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
function YearSelect() {
  const { data: session, status } = useSession();
  const {
    data: standings,
    error: fetchError,
    isLoading,
  } = useStandings(session?.accessToken);

  const standingList = createListCollection({
    items: standings
      ? Object.entries(standings).map(([id, standing]) => ({
          label: (standing as Standing).name,
          value: id,
        }))
      : [],
  });
  if (isLoading || status === "loading") return <></>;
  if (fetchError || !standings) return <>Failed to load</>;
  return (
    <SelectRoot
      variant="subtle"
      w="10em"
      shadowColor={"white"}
      collection={standingList}
      rounded="md !important"
      multiple
    >
      <SelectTrigger bg="accent" clearable>
        <SelectValueText placeholder="year" color="accent.fg" />
      </SelectTrigger>
      <SelectContent>
        {standingList.items.map((standing, index) => (
          <SelectItem key={index} item={standing}>
            {standing.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
function DegreeTypeSelect() {
  const { data: session, status } = useSession();
  const {
    data: standings,
    error: fetchError,
    isLoading,
  } = useStandings(session?.accessToken);

  const standingList = createListCollection({
    items: standings
      ? Object.entries(standings).map(([id, standing]) => ({
          label: (standing as Standing).name,
          value: id,
        }))
      : [],
  });
  if (isLoading || status === "loading") return <></>;
  if (fetchError || !standings) return <>Failed to load</>;
  return (
    <SelectRoot
      variant="subtle"
      w="10em"
      shadowColor={"white"}
      collection={standingList}
      rounded="md !important"
      multiple
    >
      <SelectTrigger bg="accent" clearable>
        <SelectValueText placeholder="program" color="accent.fg" />
      </SelectTrigger>
      <SelectContent>
        {standingList.items.map((standing, index) => (
          <SelectItem key={index} item={standing}>
            {standing.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
function DaySelect() {
  const dayList = createListCollection({
    items: DAYS.map((day, id) => ({
      label: day,
      value: id,
    })),
  });
  return (
    <SelectRoot
      variant="subtle"
      w="10em"
      shadowColor={"white"}
      collection={dayList}
      rounded="md !important"
      multiple
    >
      <SelectTrigger bg="accent" clearable>
        <SelectValueText placeholder="day(s) available" color="accent.fg" />
      </SelectTrigger>
      <SelectContent>
        {dayList.items.map((standing, index) => (
          <SelectItem key={index} item={standing}>
            {standing.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
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
      <AccordionRoot collapsible px={10} mt={2} mb={5} display={{ md: "none" }}>
        <AccordionItem value="filters" border={0}>
          <AccordionItemTrigger
            px={2}
            borderWidth={1}
            bg="accent.muted"
            boxShadow="xs"
          >
            <Text>filters</Text>
          </AccordionItemTrigger>
          <AccordionItemContent
            boxShadow={"sm"}
            bg="accent.muted/10"
            shadowColor={"accent"}
          >
            <HStack
              flexDir={{ base: "column", md: "row" }}
              py={5}
              justifyContent={"center"}
              gap={5}
              my={2}
            >
              <CampusSelect />
              <YearSelect />
              <DegreeTypeSelect />
              <DaySelect />
            </HStack>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
      <HStack
        py={5}
        justifyContent={"center"}
        gap={10}
        my={2}
        display={{ base: "none", md: "flex" }}
      >
        <CampusSelect />
        <YearSelect />
        <DegreeTypeSelect />
        <DaySelect />
      </HStack>
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
