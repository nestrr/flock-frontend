"use client";
import { Heading, Tabs, Text, useTabs, Alert } from "@chakra-ui/react";
import React from "react";
import { type Day } from "../../swr/profile";
import { DAYS } from "../../shared/constants";
import { DialogBody, DialogHeader } from "../../shared/snippets/dialog";
import { FaRegSadTear } from "react-icons/fa";
import TimeslotTable from "./timeslot-table";
import NewTimeslot from "./new-timeslot";

export default function TimePreferences() {
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
    <>
      <DialogHeader spaceY={2}>
        <Heading textAlign={"center"} size="3xl" textTransform={"lowercase"}>
          when do you like to study?
        </Heading>
        <Alert.Root
          size="sm"
          status={"error"}
          alignItems={"center"}
          fontSize={"xs"}
          justifyContent={"center"}
        >
          <Alert.Indicator>
            <FaRegSadTear />
          </Alert.Indicator>
          <Alert.Title alignSelf="end">
            We&apos;ve noticed timeslot updates don&apos;t work. Our team will
            fix this ASAP. Adding and deleting them works just fine, though!
          </Alert.Title>
        </Alert.Root>
      </DialogHeader>
      <DialogBody flex={0} spaceY={5}>
        <Tabs.RootProvider value={tabs} lazyMount>
          <Tabs.List justifyContent={"space-evenly"}>
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
              <TimeslotTable />
              <NewTimeslot />
            </Tabs.Content>
          ))}
        </Tabs.RootProvider>
      </DialogBody>
    </>
  );
}
