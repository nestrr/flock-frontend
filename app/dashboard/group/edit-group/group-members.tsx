"use client";
import { Heading, VStack } from "@chakra-ui/react";
import ActiveMembers from "./active-members";
import AllInvited from "./all-invited";

export default function Members() {
  return (
    <>
      <VStack w="full" alignItems="start">
        <Heading fontSize="lg">invited members</Heading>
        <AllInvited />
      </VStack>
      <VStack w="full" alignItems="start">
        <Heading fontSize="lg">active members</Heading>
        <ActiveMembers />
      </VStack>
    </>
  );
}
