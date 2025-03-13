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
  LinkOverlay,
  LinkBox,
  usePopover,
  PopoverRootProvider,
} from "@chakra-ui/react";
import { ColorModeButton } from "./snippets/color-mode";
import { useState } from "react";
import { Avatar } from "./snippets/avatar";
import { ringCss } from "@/theme";
import {
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "./snippets/popover";
import { Tag } from "./snippets/tag";
import Link from "next/link";
import AnimatedDialog from "./animated-dialog";
import { signIn } from "../actions/signin";
import { useSession } from "next-auth/react";
import { type Profile, useSelfProfile } from "../swr/profile";
import { toaster } from "./snippets/toaster";
function LoginButton() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const trigger = (
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
  );
  const content = (
    <Text
      fontSize="lg"
      letterSpacing={"wide"}
      textAlign={"center"}
      lineHeight={1.2}
    >
      Hang tight! We&apos;re sending you to the OIT login page.
    </Text>
  );
  return (
    <AnimatedDialog
      animationName="birdloader"
      open={isLoggingIn}
      content={content}
      trigger={trigger}
    />
  );
}
function Welcome({ user }: { user: Profile }) {
  const firstName = user.name!.split(" ")[0];
  const { degree, name, image, roles, standing, campusChoices } = user;
  const popover = usePopover();
  return (
    <Box>
      <PopoverRootProvider value={popover}>
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
              name={name!}
              src={image!}
              bgGradient="to-tr"
              gradientFrom={{ _dark: "green.600", _light: "green.400" }}
              gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
              gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
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
        <PopoverContent
          portalled={false}
          width="100%"
          bg="secondary"
          aria-label="User Info"
        >
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
                {roles[0]}
              </Tag>
              <Heading size={"lg"}>{name}</Heading>

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
                  {!!campusChoices ? campusChoices[0]?.name : "Unlisted"}
                </Tag>
              </HStack>

              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                w="90%"
              >
                <Text>Degree: </Text>
                <Badge
                  colorPalette={"gray"}
                  size={"sm"}
                  variant={"surface"}
                  fontWeight={"bold"}
                  letterSpacing={"wide"}
                  textTransform={"lowercase"}
                >
                  {degree
                    ? `${degree.degreeTypeCode} | ${degree.programName}`
                    : "undeclared"}
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
                  {standing ? standing.name : "unknown"}
                </Tag>
              </HStack>
              <HStack gap={10}>
                <Button
                  variant={"subtle"}
                  colorPalette={"accent"}
                  size="xs"
                  p={0}
                  onClick={() => popover.setOpen(false)}
                >
                  <Link
                    href="/profile"
                    style={{
                      height: "100%",
                      width: "100%",
                      padding: "8px 16px",
                      textAlign: "center",
                    }}
                    prefetch={true}
                  >
                    Edit Profile
                  </Link>
                </Button>
                <LinkBox>
                  <Button
                    variant={"solid"}
                    bg={"red.700/80"}
                    _hover={{ bg: "red.700" }}
                    colorPalette={"red"}
                    size="xs"
                  >
                    <LinkOverlay asChild>
                      <Link href="/signout">Log Out </Link>
                    </LinkOverlay>
                  </Button>
                </LinkBox>
              </HStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRootProvider>
    </Box>
  );
}
function Auth() {
  const { data: session, status } = useSession();
  const {
    data: profile,
    isLoading: isCompleteProfileLoading,
    error,
  } = useSelfProfile(session?.accessToken);
  if (status === "loading" || isCompleteProfileLoading) {
    return (
      <Skeleton
        bg={"accent.muted/50"}
        width={{ base: "3em", md: "10em" }}
        height="2em"
      />
    );
  }
  if (error)
    toaster.create({
      title: "Error",
      description: error.message,
      type: "error",
    });
  if (status === "authenticated" && !!profile) {
    return <Welcome user={{ ...session!.user, ...profile } as Profile} />;
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
