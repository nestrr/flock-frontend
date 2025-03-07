"use client";
import {
  Text,
  DialogRootProvider,
  type UseDialogReturn,
  VStack,
  Alert,
  Tabs,
  useTabs,
  AccordionItemContent,
  Heading,
} from "@chakra-ui/react";
import {
  type Timeslot,
  type Day,
  type Profile as ProfileType,
} from "../../swr/profile";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../shared/snippets/dialog";
import TimeslotTable from "./timeslot-table";
import { DAYS } from "../../shared/constants";
import {
  AccordionItem,
  AccordionItemTrigger,
  AccordionRoot,
} from "../../shared/snippets/accordion";
import ProfileHeader from "./shared/profile-header";
import Bio from "./shared/bio";
import Badges from "./shared/badges";
function Timeslots({ timeslots }: { timeslots: Record<Day, Timeslot[]> }) {
  const tabs = useTabs({ defaultValue: DAYS[0] });
  const dayAbbreviations: Record<Day, string> = {
    Sunday: "Su",
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "Th",
    Friday: "F",
    Saturday: "Sa",
  };
  return (
    <AccordionRoot collapsible rounded="md" defaultValue={["timeslots"]}>
      <AccordionItem value="timeslots" border={0}>
        <AccordionItemTrigger
          bg="accent.muted/30"
          _hover={{ bg: "accent.muted/50" }}
          p={2}
        >
          <Heading size="lg">availability</Heading>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <Tabs.RootProvider value={tabs} lazyMount py={4} px={2}>
            <Tabs.List justifyContent={"space-evenly"} borderColor="gray">
              {Object.keys(dayAbbreviations).map((day) => {
                return (
                  <Tabs.Trigger key={day} value={day}>
                    <Text hideBelow="md">{day}</Text>
                    <Text hideFrom="md">{dayAbbreviations[day as Day]}</Text>
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>
            {DAYS.map((day) => (
              <Tabs.Content key={day} value={day} spaceY={5}>
                <TimeslotTable timeslotsMap={timeslots} />
              </Tabs.Content>
            ))}
          </Tabs.RootProvider>
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
function TimeslotsFallback() {
  return (
    <Alert.Root
      status="neutral"
      alignItems={"center"}
      bg={"secondary.emphasized"}
      letterSpacing={"wider"}
      gap={0}
      flexDir={"column"}
    >
      <Alert.Title fontWeight={"semibold"}>study slots unknown</Alert.Title>
      <Alert.Description>
        Reach out to ask when they&apos;re available!
      </Alert.Description>
    </Alert.Root>
  );
}
export default function FullProfile({
  profile,
  dialog,
}: {
  profile: ProfileType;
  dialog: UseDialogReturn;
}) {
  const { standing, campusChoices, bio, timeslots } = profile;

  return (
    <DialogRootProvider
      value={dialog}
      placement="center"
      size={{ mdDown: "cover", base: "lg" }}
    >
      <DialogBackdrop />
      <DialogTrigger />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <ProfileHeader condensed={false} profile={profile} />
        </DialogHeader>
        <DialogBody
          pb={0}
          pt={5}
          color="primary.fg"
          justifyContent={"space-between"}
        >
          <Bio bio={bio} truncate={false} />
        </DialogBody>
        <DialogFooter>
          <VStack w="full" gap={5}>
            <Badges
              primaryCampus={campusChoices?.[0]?.name}
              standing={standing?.name}
            />
            {timeslots ? (
              <Timeslots timeslots={timeslots} />
            ) : (
              <TimeslotsFallback />
            )}
          </VStack>
        </DialogFooter>
      </DialogContent>
    </DialogRootProvider>
  );
}
