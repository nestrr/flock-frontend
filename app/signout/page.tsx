"use client";
import AnimatedDialog from "../shared/animated-dialog";
import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOut() {
  useEffect(() => {
    signOut({ redirect: true, redirectTo: "/" });
  }, []);
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
