"use client";
import { Alert, Link as ChakraLink, IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { LuSmile, LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useSelfProfile } from "../swr/profile";
import StudyPartners from "./study-partners";

function WelcomeAlert({ token }: { token: string | undefined }) {
  const { data: profile, isLoading } = useSelfProfile(token);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isLoading && !!profile) setOpen(true);
  }, [isLoading, profile]);

  return open ? (
    <Alert.Root status="success" alignItems={"center"}>
      <Alert.Indicator>
        <LuSmile fontWeight={"medium"} fontSize={"lg"} />
      </Alert.Indicator>
      <Alert.Content justifyContent={"center"}>
        <Alert.Title fontSize={"sm"}>Welcome back! 👋🐦</Alert.Title>
        {profile?.newAccount && (
          <Alert.Description>
            <ChakraLink
              asChild
              fontWeight="medium"
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
  const { data: session } = useSession();
  return (
    <>
      <WelcomeAlert token={session?.accessToken} />
      <StudyPartners />
    </>
  );
}
