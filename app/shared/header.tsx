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
  Badge,
} from "@chakra-ui/react";
import { ColorModeButton } from "./snippets/color-mode";
import { signIn } from "@/app/actions/signin";
import Animation from "./animation";
import { DialogContent, DialogRoot, DialogTrigger } from "./snippets/dialog";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { type User } from "next-auth";
import { Avatar } from "./snippets/avatar";
import { ringCss } from "@/theme";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "./snippets/popover";
import { Tag } from "./snippets/tag";
import Link from "next/link";
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
function Welcome({ user }: { user: User }) {
  const firstName = user.name!.split(" ")[0];

  return (
    <Box>
      <PopoverRoot>
        <PopoverTrigger
          _hover={{
            bg: "secondary.emphasized",
            shadow: "0 0 0px 1px secondary.300/80",
          }}
          _active={{
            bg: "secondary.emphasized",
            shadow: "0 0 0px 1px secondary.300/80",
          }}
          _expanded={{
            bg: "secondary.emphasized",
            shadow: "0 0 0px 1px secondary.300/80",
          }}
          p={2}
          height="100%"
          rounded="lg"
        >
          <HStack gap={4}>
            <Avatar
              name={user.name!}
              src={user.image!}
              bg="primary.contrast"
              css={ringCss}
            />
            <Text
              fontWeight="bold"
              fontSize="lg"
              fontFamily={"heading"}
              display={{ base: "none", md: "block" }}
            >
              {firstName}
            </Text>
          </HStack>{" "}
        </PopoverTrigger>
        <PopoverContent width="100%" bg="secondary" aria-label="User Info">
          <PopoverBody>
            <VStack
              alignItems={"center"}
              textAlign={"center"}
              width="100%"
              justifyContent={"center"}
            >
              <Tag
                colorPalette={"accent"}
                size={"sm"}
                fontWeight={"semibold"}
                fontFamily={"heading"}
                letterSpacing={"wide"}
                variant={"surface"}
              >
                {user.roles[0]}
              </Tag>
              <Heading size={"lg"}>{user.name}</Heading>

              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                w="90%"
                mt={3}
              >
                <Text>Campus: </Text>
                <Tag
                  colorPalette={"gray.700"}
                  size={"sm"}
                  variant={"surface"}
                  fontWeight={"bold"}
                  letterSpacing={"wide"}
                  textTransform={"lowercase"}
                >
                  {user.campusChoices?.length === 0
                    ? "Unlisted"
                    : user.campusChoices[0]?.name}
                </Tag>
              </HStack>

              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                w="90%"
              >
                <Text>Major: </Text>
                <Badge
                  colorPalette={"gray"}
                  size={"sm"}
                  variant={"surface"}
                  fontWeight={"bold"}
                  letterSpacing={"wide"}
                  textTransform={"lowercase"}
                >
                  {user.major ? user.major : "undeclared"}
                </Badge>
              </HStack>

              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                w="90%"
                mb={3}
              >
                <Text>Year: </Text>
                <Tag
                  colorPalette={"primary.700"}
                  size={"sm"}
                  variant={"surface"}
                  fontWeight={"bold"}
                  letterSpacing={"wide"}
                  textTransform={"lowercase"}
                >
                  {user.major ? user.major : "unknown"}
                </Tag>
              </HStack>
              <HStack gap={10}>
                <Button variant={"subtle"} colorPalette={"accent"} size="xs">
                  Edit Profile{" "}
                </Button>
                <Button
                  variant={"solid"}
                  bg={"red.700/80"}
                  _hover={{ bg: "red.700" }}
                  colorPalette={"red"}
                  size="xs"
                >
                  Log Out{" "}
                </Button>
              </HStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </Box>
  );
}
function Auth() {
  const { data: session, status } = useSession();
  console.log(session);
  if (status === "loading") {
    return (
      <Skeleton
        colorPalette={"secondary"}
        width={{ base: "3em", md: "10em" }}
        height="2em"
      />
    );
  }
  if (status === "authenticated") {
    return <Welcome user={session!.user} />;
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
      px={8}
    >
      <Link href="/">
        <Heading as="h1" size="4xl" letterSpacing={"wide"}>
          flock
        </Heading>
      </Link>
      <HStack display="flex" alignItems="center" py={3} gap={5} height="100%">
        <Auth />
        <ColorModeButton rounded="full" />
      </HStack>
    </Container>
  );
}
