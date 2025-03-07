"use server";
import { auth } from "@/auth";
import { Heading } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return (
    <>
      <Heading as="h1" size="6xl" letterSpacing={"wide"} textAlign={"center"}>
        Welcome. 👋🐦
      </Heading>
      <Heading as="h2" size="3xl" fontWeight="light" textAlign={"center"}>
        Something awesome&apos;s cooking. Check back in soon.
      </Heading>
    </>
  );
}
