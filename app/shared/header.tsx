"use client";
import {
  HStack,
  Container,
  Heading,
  Button,
  Box,
  VStack,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import { ColorModeButton } from "./snippets/color-mode";
import { signIn } from "@/app/actions/signin";
import Animation from "./animation";
import { DialogContent, DialogRoot, DialogTrigger } from "./snippets/dialog";
import { useState } from "react";
import { useSession } from "next-auth/react";
function LoginButton() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  return (
    <DialogRoot
      placement="center"
      motionPreset="slide-in-bottom"
      open={isLoggingIn}
    >
      <DialogTrigger asChild>
        <Button
          colorPalette="accent"
          variant={"surface"}
          shadow={"0 0 0 0"}
          aria-label="Log In"
          disabled={isLoggingIn}
          onClick={() => {
            setIsLoggingIn(true);
            signIn();
          }}
        >
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VStack
          height="100%"
          alignItems="center"
          justifyContent={"center"}
          p={10}
        >
          <Box width={500} aspectRatio={"initial"} m={0} p={0}>
            {" "}
            <Animation name="birdloader" />
          </Box>

          <Text
            fontSize="lg"
            letterSpacing={"wide"}
            textAlign={"center"}
            lineHeight={1.2}
          >
            Hang tight! We&apos;re sending you to the OIT login page.
          </Text>
        </VStack>
      </DialogContent>
    </DialogRoot>
  );
}
function Welcome({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  return (
    <Text fontSize="lg">
      Welcome, <b>{firstName}</b>!
    </Text>
  );
}
function Auth() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <Skeleton width="10em" height="2em" />;
  }
  if (status === "authenticated") {
    return <Welcome name={session?.user?.name ?? ""} />;
  }
  return <LoginButton />;
}
export default function Header() {
  return (
    <Container
      as="header"
      bg="secondary.subtle"
      color="secondary.fg"
      colorPalette={"secondary"}
      w="100%"
      maxW="100%"
      display="flex"
      flexDir={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      py={5}
      px={8}
    >
      <Heading as="h1" size="4xl" letterSpacing={"wide"}>
        flock
      </Heading>
      <HStack display="flex" alignItems="center" gap={5}>
        <Auth />
        <ColorModeButton rounded="full" />
      </HStack>
    </Container>
  );
}
