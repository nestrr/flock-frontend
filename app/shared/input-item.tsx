"use client";
import {
  Group,
  Input,
  InputAddon,
  type InputProps,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { InputGroup } from "@/app/shared/snippets/input-group";
import { type Simplify } from "type-fest";
export type InputPropsType = Simplify<
  {
    value?: string;
    startElement?: React.ReactNode;
    children?: React.ReactNode;
    locked?: boolean;
    lockDescription?: string;
    label: string;
    endAddon?: React.ReactNode;
    colorPalette?: string;
    placeholder?: string;
  } & InputProps
>;
export default function InputItem(inputProps: InputPropsType) {
  const {
    value,
    startElement,
    locked,
    children,
    label,
    endAddon,
    colorPalette = "accent.muted/50",
    ...rest
  } = inputProps;
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
            {...rest}
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
