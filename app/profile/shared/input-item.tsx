"use client";
import { Group, Input, InputAddon, Text } from "@chakra-ui/react";
import React from "react";
import { InputGroup } from "@/app/shared/snippets/input-group";

export default function InputItem({
  value,
  startElement,
  locked,
  children,
  label,
  endAddon,
  colorPalette = "accent.muted/50",
}: {
  value?: string;
  startElement?: React.ReactNode;
  children?: React.ReactNode;
  locked?: boolean;
  lockDescription?: string;
  label: string;
  endAddon?: React.ReactNode;
  colorPalette?: string;
}) {
  return (
    <Group
      attached
      borderColor={colorPalette}
      borderWidth={3}
      borderStyle={"solid"}
      rounded="lg"
      w={"100%"}
    >
      <InputAddon bg={colorPalette} border={0}>
        <Text
          fontSize={"md"}
          fontWeight={"bold"}
          letterSpacing={"wide"}
          lineHeight={"normal"}
        >
          {label}
        </Text>
      </InputAddon>
      {!!children ? (
        children
      ) : (
        <InputGroup flex="1" startElement={startElement}>
          <Input
            border={0}
            readOnly={locked}
            value={value}
            w={"100%"}
            rounded="none"
          ></Input>
        </InputGroup>
      )}

      {!!endAddon && (
        <InputAddon bg={colorPalette} border={0}>
          {endAddon}
        </InputAddon>
      )}
    </Group>
  );
}
