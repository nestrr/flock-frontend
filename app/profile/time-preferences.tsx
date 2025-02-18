"use client";
import {
  VStack,
  Heading,
  Tabs,
  Text,
  useTabs,
  Input,
  HStack,
  IconButton,
  Table,
  Stack,
  Editable,
  Container,
  Card,
  useEditable,
  Box,
  Alert,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { LuPlus, LuPencilLine, LuTrash } from "react-icons/lu";
import { Field } from "../shared/snippets/field";
import { Slider } from "../shared/snippets/slider";
import { type Timeslot, type Day } from "../swr/profile";
import { DAYS, DAYS_INDICES } from "../shared/constants";
import { DialogBody, DialogHeader } from "../shared/snippets/dialog";
import {
  toPreferredTimesMap,
  useProfileEdit,
  useProfileEditDispatch,
} from "./shared/profile-edit-context";
import { FaRegSadTear } from "react-icons/fa";

function TimeslotRow({
  timeslot,
  deleteFn,
}: {
  timeslot: Timeslot;
  deleteFn: (_arg0: Timeslot) => void;
}) {
  const { from, to, reliability, flexibility } = timeslot;
  const fromEditable = useEditable({ defaultValue: from });
  const toEditable = useEditable({ defaultValue: to });
  useEffect(() => {
    fromEditable.setValue(from);
  }, [from, fromEditable]);
  useEffect(() => {
    toEditable.setValue(to);
  }, [to, toEditable]);
  return (
    <Table.Row borderColor="accent.muted">
      <Table.Cell borderColor="accent.muted">
        <Editable.RootProvider
          value={fromEditable}
          w="full"
          justifyContent={"space-between"}
        >
          <Editable.Preview />
          <Editable.Input />
          <IconButton
            variant="ghost"
            size="xs"
            color="secondary.fg"
            _hover={{ color: "accent.fg" }}
            onClick={() => fromEditable.edit()}
          >
            <LuPencilLine />
          </IconButton>
        </Editable.RootProvider>
      </Table.Cell>
      <Table.Cell borderColor="accent.muted">
        <Editable.RootProvider
          value={toEditable}
          w="full"
          justifyContent={"space-between"}
        >
          <Editable.Preview />
          <Editable.Input type="time" />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton
                variant="ghost"
                size="xs"
                color="secondary.fg"
                _hover={{ color: "accent.fg" }}
              >
                <LuPencilLine />
              </IconButton>
            </Editable.EditTrigger>
          </Editable.Control>
        </Editable.RootProvider>
      </Table.Cell>
      <Table.Cell borderColor="accent.muted" px={0}>
        <Container display="flex" justifyContent={"center"}>
          <Slider
            size={"md"}
            step={50}
            orientation={"vertical"}
            height="100px"
            colorPalette="pink"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            defaultValue={[reliability * 50]}
            marks={[
              { value: 0, label: "none" },
              { value: 50, label: "" },
              { value: 100, label: "max" },
            ]}
            hideFrom="md"
          />
          <Slider
            size={"md"}
            step={50}
            width="150px"
            colorPalette="pink"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            defaultValue={[reliability * 50]}
            marks={[
              { value: 0, label: "none" },
              { value: 50, label: "a little" },
              { value: 100, label: "max" },
            ]}
            hideBelow="md"
          />
        </Container>
      </Table.Cell>
      <Table.Cell borderColor="accent.muted" px={0}>
        <Container display="flex" justifyContent={"center"}>
          <Slider
            size={"md"}
            step={50}
            orientation="vertical"
            height="100px"
            colorPalette="pink"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            defaultValue={[flexibility * 50]}
            marks={[
              { value: 0, label: "none" },
              { value: 50, label: "" },
              { value: 100, label: "max" },
            ]}
            hideFrom="md"
          />
          <Slider
            size={"md"}
            step={50}
            width="150px"
            colorPalette="pink"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            defaultValue={[flexibility * 50]}
            marks={[
              { value: 0, label: "none" },
              { value: 50, label: "a little" },
              { value: 100, label: "max" },
            ]}
            hideBelow="md"
          />{" "}
        </Container>
      </Table.Cell>
      <Table.Cell borderColor="accent.muted">
        <Box display={"flex"} justifyContent={"center"}>
          <IconButton
            size="2xs"
            variant={"surface"}
            colorPalette={"red"}
            onClick={() => deleteFn(timeslot)}
          >
            <LuTrash />
          </IconButton>
        </Box>
      </Table.Cell>
    </Table.Row>
  );
}
function TimeslotTable({ day }: { day: Day }) {
  const { initial: profile, edits, deleted } = useProfileEdit();

  const dispatch = useProfileEditDispatch();
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const getSlotsForDay = useCallback(() => {
    const preferredTimes = {
      ...toPreferredTimesMap(edits.preferredTimes ?? []),
      ...profile.preferredTimes, // could include since-deleted timeslots
    };
    const deletedTimesForDay =
      deleted?.preferredTimes?.[DAYS_INDICES[day]] ?? [];
    const slotsForDay = preferredTimes[day] ?? ([] as Timeslot[]);
    return slotsForDay.filter(
      (t) =>
        !deletedTimesForDay.find((dt) => dt.from === t.from && dt.to === t.to)
    );
  }, [
    day,
    deleted?.preferredTimes,
    edits.preferredTimes,
    profile.preferredTimes,
  ]);
  useEffect(() => {
    setTimeslots(getSlotsForDay());
  }, [profile, edits, day, getSlotsForDay]);
  function deleteTimeslot(timeslot: Timeslot) {
    const remainingTimeslots = timeslots.filter(
      (t) => !(t.from === timeslot.from && t.to === timeslot.to)
    );
    dispatch({
      type: "update",
      edit: {
        preferredTimes: {
          ...profile.preferredTimes,
          [day]: remainingTimeslots,
        },
      },
      overrideCurrent: true,
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
function NewTimeslot({ day }: { day: Day }) {
  const [fromTime, setFromTime] = React.useState<string | null>(null);
  const [toTime, setToTime] = React.useState<string | null>(null);
  const [reliability, setReliability] = React.useState<number>(2);
  const [flexibility, setFlexibility] = React.useState<number>(0);
  const dispatch = useProfileEditDispatch();
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
        onClick={() => {
          const toAdd: Timeslot = {
            id: "",
            from: fromTime!,
            to: toTime!,
            reliability,
            flexibility,
          };
          dispatch({
            type: "update",
            edit: {
              preferredTimes: {
                [day]: [toAdd],
              } as Record<Day, Timeslot[]>,
            },
          });
        }}
      >
        <LuPlus />
      </IconButton>
    </Stack>
  );
}
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
      <DialogBody spaceY={5}>
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
              <TimeslotTable day={tabs.value as Day} />
              <NewTimeslot day={tabs.value as Day} />
            </Tabs.Content>
          ))}
        </Tabs.RootProvider>
      </DialogBody>
    </>
  );
}
