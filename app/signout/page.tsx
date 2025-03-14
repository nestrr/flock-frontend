"use client";
import AnimatedDialog from "../shared/animated-dialog";
import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useSelfProfile } from "../swr/profile";

export default function SignOut() {
  const { data: session } = useSession();
  const { mutate } = useSelfProfile(session?.accessToken);
  useEffect(() => {
    if (mutate) {
      mutate(undefined);
      signOut({ redirect: true, redirectTo: "/" });
    }
  }, [mutate]);
  return (
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
    />
  );
}
