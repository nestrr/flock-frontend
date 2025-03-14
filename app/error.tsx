"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
import NextLink from "next/link";
import { Link as ChakraLink, Icon } from "@chakra-ui/react";

import { Alert, Heading } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Heading as="h1" size="6xl" letterSpacing={"wide"} textAlign={"center"}>
        Woops! 🫢🐦
      </Heading>
      <Heading as="h2" size="3xl" fontWeight="light" textAlign={"center"}>
        Something went wrong! Try again, or contact us using the chat button
        below.
      </Heading>
      <ChakraLink
        asChild
        fontWeight="medium"
        letterSpacing={"wide"}
        color="primary.fg"
        textAlign={{ mdDown: "center" }}
        fontSize={"sm"}
      >
        <NextLink href={"/"}>
          <Icon fontSize={"1.5em"} display={{ mdDown: "none" }}>
            <LuHouse />
          </Icon>
          Take me home!
        </NextLink>
      </ChakraLink>
      <Alert.Root status={"error"}>
        {error.digest ?? "No further details found."}
      </Alert.Root>
    </>
  );
}
