"use client";
import { Heading, Table, Card, useTabsContext } from "@chakra-ui/react";
import React from "react";
import { type Day, type Timeslot } from "../../swr/profile";
import TimeslotRow from "./timeslot-row";
function NoTimeslots() {
  return (
    <Card.Root size="sm" textAlign={"center"} border={0} bg="accent.muted/50">
      <Card.Header>
        <Heading size="md">nothing here! 👻</Heading>
      </Card.Header>
      <Card.Body>No study timeslots on this day.</Card.Body>
    </Card.Root>
  );
}
export default function TimeslotTable({
  timeslotsMap,
}: {
  timeslotsMap: Record<Day, Timeslot[]>;
}) {
  const { value: day } = useTabsContext();
  const timeslots = React.useMemo(
    () => timeslotsMap[day as Day],
    [timeslotsMap, day]
  );
  return timeslots?.length ? (
    <Table.Root
      size="sm"
      variant="outline"
      boxShadow={"0 0 0 0"}
      colorPalette={"accent"}
      shadow="xs"
      rounded="md"
      showColumnBorder
    >
      <Table.Header bg="accent.muted/50">
        <Table.Row>
          <Table.ColumnHeader
            borderX="0"
            borderColor="accent.muted"
            textAlign={"center"}
          >
            From
          </Table.ColumnHeader>
          <Table.ColumnHeader
            borderX="0"
            borderColor="accent.muted"
            textAlign={"center"}
          >
            To
          </Table.ColumnHeader>
          <Table.ColumnHeader
            borderX="0"
            borderColor="accent.muted"
            textAlign={"center"}
          >
            Preference
          </Table.ColumnHeader>
          <Table.ColumnHeader
            borderX="0"
            borderColor="accent.muted"
            textAlign={"center"}
          >
            Flexibility
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body bg="accent.muted/30">
        {timeslots.map((item, index) => (
          <TimeslotRow key={index} timeslot={item} />
        ))}
      </Table.Body>
    </Table.Root>
  ) : (
    <NoTimeslots />
  );
}
