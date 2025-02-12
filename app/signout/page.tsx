"use client";
import { Container, Stack, Text } from "@chakra-ui/react";
import AnimatedDialog from "../shared/animated-dialog";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOut() {
  useEffect(() => {
    signOut({ redirect: true, redirectTo: "/" });
  }, []);
  return (
    <Container
      as="main"
      w="100%"
      maxW="100%"
      flex={1}
      flexDir={"column"}
      alignItems={"stretch"}
      justifyContent={"stretch"}
      py={5}
      px={5}
    >
      <Stack as="section" h="100%">
        <AnimatedDialog
          animationName="birdloader"
          open={true}
          content={
            <Text
              fontSize="lg"
              letterSpacing={"wide"}
              textAlign={"center"}
              lineHeight={1.2}
            >
              Thanks for stopping by!
            </Text>
          }
        ></AnimatedDialog>
      </Stack>
    </Container>
  );
}
