"use client";
import { Heading, Table, Card, useTabsContext } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { type Timeslot, type Day } from "../../swr/profile";
import { DAYS, DAYS_INDICES } from "../../shared/constants";
import {
  type ProfileEditSummary,
  useProfileEdit,
  useProfileEditDispatch,
} from "../shared/profile-edit-context";
import TimeslotRow from "./timeslot-row";
import { type UnknownRecord } from "type-fest";
function getSlots(allChanges: Omit<ProfileEditSummary, "errors">) {
  const { initial, edits, deleted } = allChanges;
  const timeslotsInOriginal = initial.timeslots;
  const timeslotsInEdits = edits.timeslots;
  const timeslotsInDeleted = deleted.timeslots;
  const allSlots = {} as UnknownRecord;
  DAYS.forEach((day) => {
    const allSlotsForDay = [
      ...(timeslotsInOriginal?.[day] ?? []),
      ...(timeslotsInEdits?.[day] ?? []),
    ];
    const deletedTimesForDay = timeslotsInDeleted?.[day] ?? [];
    allSlots[day] = allSlotsForDay.filter(
      (t) =>
        !deletedTimesForDay.find(
          ({ from: deletedFrom, to: deletedTo }) =>
            deletedFrom === t.from && deletedTo === t.to
        )
    );
  });
  return allSlots as Record<Day, Timeslot[]>;
}
function NoTimeslots() {
  return (
    <Card.Root size="sm" textAlign={"center"} border={0} bg="accent.muted/50">
      <Card.Header>
        <Heading size="md">nothing here! 👻</Heading>
      </Card.Header>
      <Card.Body>
        You have no study timeslots on this day. Add a new one below!
      </Card.Body>
    </Card.Root>
  );
}
export default function TimeslotTable() {
  const { value: day } = useTabsContext();
  const allChanges = useProfileEdit();
  const { errors } = allChanges;
  const dispatch = useProfileEditDispatch();

  // rest always changes on every render

  const allTimeslots = useMemo(() => getSlots(allChanges), [allChanges]);
  const timeslots = useMemo(
    () => allTimeslots[day as Day],
    [allTimeslots, day]
  );

  function deleteTimeslot(timeslot: Timeslot) {
    const isDuplicateSlot = errors.DUPLICATE_TIMESLOT?.find(
      (t) =>
        t.day === DAYS_INDICES[day as Day] &&
        t.from === timeslot.from &&
        t.to === timeslot.to
    );
    if (isDuplicateSlot) {
      dispatch({
        type: "clearErrors",
        errors: {
          DUPLICATE_TIMESLOT: [timeslot],
        },
      });
    }
    dispatch({
      type: "delete",
      edit: {
        timeslot: [day as Day, timeslot.from, timeslot.to],
      },
    });
  }
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
          <Table.ColumnHeader
            borderX="0"
            borderColor="accent.muted"
            textAlign={"center"}
          ></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body bg="accent.muted/30">
        {timeslots.map((item, index) => (
          <TimeslotRow key={index} timeslot={item} deleteFn={deleteTimeslot} />
        ))}
      </Table.Body>
    </Table.Root>
  ) : (
    <NoTimeslots />
  );
}
