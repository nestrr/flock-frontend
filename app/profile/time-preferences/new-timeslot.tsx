"use client";
import {
  VStack,
  Input,
  HStack,
  IconButton,
  Stack,
  useTabsContext,
} from "@chakra-ui/react";
import React from "react";
import { LuPlus } from "react-icons/lu";
import { Field } from "../../shared/snippets/field";
import { Slider } from "../../shared/snippets/slider";
import { type Timeslot, type Day } from "../../swr/profile";
import { DAYS, DAYS_INDICES } from "../../shared/constants";
import {
  type ProfileEditSummary,
  useProfileEdit,
  useProfileEditDispatch,
} from "../shared/profile-edit-context";
import { type UnknownRecord } from "type-fest";
import { normalizeTimeslot } from "../shared/util";

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

function lookupTimeslot(
  timeslot: Timeslot,
  day: Day,
  slots: Record<Day, Timeslot[]>
) {
  timeslot = normalizeTimeslot(timeslot);
  return slots[day].find((t) => {
    t = normalizeTimeslot(t);
    return timeslot.from === t.from && timeslot.to === t.to;
  });
}
export default function NewTimeslot() {
  const { value: day } = useTabsContext();
  const [fromTime, setFromTime] = React.useState<string | null>(null);
  const [toTime, setToTime] = React.useState<string | null>(null);
  const [reliability, setReliability] = React.useState<number>(2);
  const [flexibility, setFlexibility] = React.useState<number>(0);
  const dispatch = useProfileEditDispatch();
  const allChanges = useProfileEdit();

  const slots = React.useMemo(() => getSlots(allChanges), [allChanges]);
  function addTimeslot() {
    const toAdd: Timeslot = {
      day: DAYS_INDICES[day as Day],
      from: fromTime!,
      to: toTime!,
      reliability,
      flexibility,
    };

    if (lookupTimeslot(toAdd, day as Day, slots)) {
      dispatch({
        type: "update",
        edit: {
          timeslots: {
            [day as Day]: [toAdd],
          } as Record<Day, Timeslot[]>,
        },
        errors: {
          DUPLICATE_TIMESLOT: [toAdd],
        },
      });
    } else {
      dispatch({
        type: "update",
        edit: {
          timeslots: {
            [day as Day]: [toAdd],
          } as Record<Day, Timeslot[]>,
        },
      });
    }
  }
  return (
    <Stack
      gap="3"
      width="full"
      justifyContent={"space-between"}
      shadow="xs"
      rounded="md"
      bg="accent.muted/50"
      alignItems={{ base: "stretch", md: "center" }}
      p={3}
      flexDir={{ base: "column", md: "row" }}
    >
      <VStack w={{ base: "100%", md: "85%" }} gap={5}>
        <HStack gap="5" width="full" justifyContent={"space-between"}>
          <Field label="From" required>
            <Input
              type="time"
              placeholder={"00:00"}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </Field>
          <Field
            label="To"
            required
            invalid={!!toTime && !!fromTime && toTime <= fromTime}
          >
            <Input
              type="time"
              placeholder={"23:59"}
              onChange={(e) => setToTime(e.target.value)}
            />
          </Field>
        </HStack>
        <Stack
          gap={5}
          justifyContent="space-between"
          alignItems={"center"}
          w="full"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Field label="Preference" w="fit-content">
            <Slider
              size={"md"}
              step={50}
              onValueChange={({ value }) =>
                setReliability(Math.floor(value[0] / 50))
              }
              width="200px"
              colorPalette="pink"
              thumbSize={{ width: 16, height: 16 }}
              thumbAlignment="contain"
              defaultValue={[100]}
              marks={[
                { value: 0, label: "none" },
                { value: 50, label: "a little" },
                { value: 100, label: "max" },
              ]}
            />
          </Field>
          <Field label="Flexibility" w="fit-content">
            <Slider
              size={"md"}
              step={50}
              onValueChange={({ value }) =>
                setFlexibility(Math.floor(value[0] / 50))
              }
              width="200px"
              colorPalette="pink"
              thumbSize={{ width: 16, height: 16 }}
              thumbAlignment="contain"
              defaultValue={[0]}
              marks={[
                { value: 0, label: "none" },
                { value: 50, label: "a little" },
                { value: 100, label: "max" },
              ]}
            />
          </Field>
        </Stack>
      </VStack>

      <IconButton
        aria-label="Add time"
        colorPalette="accent"
        size="xs"
        variant="surface"
        rounded="full"
        disabled={!toTime || !fromTime || toTime <= fromTime}
        mt={{ base: 5, md: 0 }}
        onClick={addTimeslot}
      >
        <LuPlus />
      </IconButton>
    </Stack>
  );
}
