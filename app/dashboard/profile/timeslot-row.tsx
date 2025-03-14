"use client";
import { Slider } from "@/app/shared/snippets/slider";
import { normalizeTimeslot } from "@/app/shared/util";
import { type Timeslot } from "@/app/swr/profile";
import { Table, Container } from "@chakra-ui/react";

export default function TimeslotRow({ timeslot }: { timeslot: Timeslot }) {
  const { from, to, reliability, flexibility } = normalizeTimeslot(timeslot);
  return (
    <Table.Row borderColor="accent.muted">
      <Table.Cell borderColor="accent.muted">{from}</Table.Cell>
      <Table.Cell borderColor="accent.muted">{to}</Table.Cell>
      <Table.Cell borderColor="accent.muted" px={0}>
        <Container display="flex" justifyContent={"center"}>
          <Slider
            size={"md"}
            readOnly
            step={50}
            orientation={"vertical"}
            height="100px"
            colorPalette="gray"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            value={[reliability * 50]}
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
            readOnly
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            value={[reliability * 50]}
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
            readOnly
            step={50}
            orientation="vertical"
            height="100px"
            colorPalette="gray"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            value={[flexibility * 50]}
            marks={[
              { value: 0, label: "none" },
              { value: 50, label: "" },
              { value: 100, label: "max" },
            ]}
            hideFrom="md"
          />
          <Slider
            size={"md"}
            readOnly
            step={50}
            width="150px"
            colorPalette="gray"
            thumbSize={{ width: 16, height: 16 }}
            thumbAlignment="contain"
            value={[flexibility * 50]}
            marks={[
              { value: 0, label: "none" },
              { value: 50, label: "a little" },
              { value: 100, label: "max" },
            ]}
            hideBelow="md"
          />{" "}
        </Container>
      </Table.Cell>
    </Table.Row>
  );
}
