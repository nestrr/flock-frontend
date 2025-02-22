"use client";
import {
  Stack,
  Alert,
  HStack,
  Link as ChakraLink,
  Tabs,
  Card,
  Text,
  Badge,
  Button,
  IconButton,
  Strong,
  SimpleGrid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import {
  LuFolder,
  LuPlus,
  LuSmile,
  LuSquareCheck,
  LuUser,
  LuX,
} from "react-icons/lu";
import { type Session } from "next-auth";
import { useEffect, useState } from "react";
import { Avatar } from "../shared/snippets/avatar";
import { useRouter } from "next/navigation";
function Friend() {
  return (
    <Card.Root
      width="320px"
      bg={"accent.muted"}
      shadow={"sm"}
      variant={"elevated"}
    >
      <Card.Body color="primary.fg" gap={1}>
        <HStack mb="6" gap="3">
          <Avatar
            src="https://images.unsplash.com/photo-1511806754518-53bada35f930"
            name="Nate Foss"
          />
          <Stack gap="0">
            <Text fontWeight="semibold" textStyle="sm">
              Nate Foss
            </Text>
            <Text textStyle="sm">Machine Learning</Text>
          </Stack>
        </HStack>
        <Card.Description color="primary.fg">
          <Strong color="fg">Nate Foss </Strong>
          has requested to join your team. You can approve or decline their
          request.
        </Card.Description>
        <HStack
          flexWrap={"wrap"}
          gap="2"
          mt={2}
          borderTop="solid 1px"
          borderColor="primary.fg/30"
          pt={3}
        >
          <Badge textTransform={"lowercase"} shadow={"xs"}>
            Klamath Falls
          </Badge>
          <Badge textTransform={"lowercase"} shadow={"xs"}>
            Sophomore
          </Badge>
          <Badge
            colorPalette={"yellow"}
            variant={"solid"}
            textTransform={"lowercase"}
            fontWeight="bold"
            shadow={"xs"}
            letterSpacing={"wide"}
          >
            perfect availability!
          </Badge>
          <Badge
            colorPalette={"blue"}
            variant={"solid"}
            textTransform={"lowercase"}
            fontWeight="bold"
            shadow={"xs"}
            letterSpacing={"wide"}
          >
            close by
          </Badge>
        </HStack>
      </Card.Body>
      <Card.Footer gap="2" flexDirection="column">
        <Button
          variant="subtle"
          p={2}
          colorPalette="accent"
          _hover={{ bg: "accent.emphasized" }}
          flex="1"
          w="100%"
          fontFamily={"heading"}
          fontWeight={"semibold"}
        >
          <LuPlus />
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
function Friends() {
  return (
    <Card.Root width="100%" variant={"elevated"} bg={"secondary.muted"}>
      <Card.Header textAlign={"center"} pb={0}>
        <Heading size={"3xl"}>study partners</Heading>
      </Card.Header>
      <Card.Body gap="2">
        <Tabs.Root defaultValue="search" variant={"line"}>
          <Tabs.List>
            <Tabs.Trigger value="search">
              <LuUser />
              Search
            </Tabs.Trigger>
            <Tabs.Trigger value="projects">
              <LuFolder />
              Projects
            </Tabs.Trigger>
            <Tabs.Trigger value="tasks">
              <LuSquareCheck />
              Settings
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="search" alignItems={"center"}>
            <SimpleGrid
              columns={[4]}
              gap="1em"
              width="min-fit"
              alignItems={"center"}
              justifyItems={"center"}
            >
              <GridItem colSpan={{ base: 4, lg: 2, xl: 1 }}>
                {" "}
                <Friend />
              </GridItem>
              <GridItem colSpan={{ base: 4, lg: 2, xl: 1 }}>
                {" "}
                <Friend />
              </GridItem>
              <GridItem colSpan={{ base: 4, lg: 2, xl: 1 }}>
                {" "}
                <Friend />
              </GridItem>
              <GridItem colSpan={{ base: 4, lg: 2, xl: 1 }}>
                {" "}
                <Friend />
              </GridItem>
              <GridItem colSpan={{ base: 4, lg: 2, xl: 1 }}>
                {" "}
                <Friend />
              </GridItem>
              <GridItem colSpan={{ base: 4, lg: 2, xl: 1 }}>
                {" "}
                <Friend />
              </GridItem>
            </SimpleGrid>
          </Tabs.Content>
          <Tabs.Content value="projects">Manage your projects</Tabs.Content>
          <Tabs.Content value="tasks">
            Manage your tasks for freelancers
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>
      <Card.Footer justifyContent="flex-end"></Card.Footer>
    </Card.Root>
  );
}
function WelcomeAlert({ status }: { status: string; session: Session | null }) {
  const [open, setOpen] = useState(true);
  return open ? (
    <Alert.Root status="success" alignItems={"center"}>
      <Alert.Indicator>
        <LuSmile fontWeight={"bold"} fontSize={"lg"} />
      </Alert.Indicator>
      <Alert.Content justifyContent={"center"}>
        <Alert.Title fontSize={"sm"}>Welcome back! 👋🐦</Alert.Title>
        {status === "authenticated" && true && (
          <Alert.Description>
            <ChakraLink
              asChild
              fontWeight="bold"
              letterSpacing={"wide"}
              color="primary.fg"
              textAlign={{ mdDown: "center" }}
              variant={"underline"}
            >
              <NextLink href="/profile">
                Let&apos;s finish up setting your profile.
              </NextLink>
            </ChakraLink>
          </Alert.Description>
        )}
      </Alert.Content>
      <IconButton
        rounded="full"
        p={2}
        variant={"subtle"}
        onClick={() => setOpen(!open)}
      >
        {" "}
        <LuX />
      </IconButton>
    </Alert.Root>
  ) : (
    <></>
  );
}
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    // if (true) router.push("/profile");
  }, [router]);
  return (
    <>
      <WelcomeAlert status={status} session={session} />
      <Friends />
    </>
  );
}
