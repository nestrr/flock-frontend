"use client";
import {
  IconButton,
  Table,
  Editable,
  Container,
  useEditable,
  Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { LuPencilLine, LuTrash } from "react-icons/lu";
import { Slider } from "../../shared/snippets/slider";
import { type Timeslot } from "../../swr/profile";
import { normalizeTimeslot } from "@/app/shared/util";

export default function TimeslotRow({
  timeslot,
  deleteFn,
}: {
  timeslot: Timeslot;
  deleteFn: (_timeslot: Timeslot) => void;
}) {
  const { from, to, reliability, flexibility } = normalizeTimeslot(timeslot);
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
            colorPalette="gray"
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
            colorPalette="gray"
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
            colorPalette="gray"
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
            colorPalette="gray"
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
