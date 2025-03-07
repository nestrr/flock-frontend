import { Heading } from "@chakra-ui/react";

export default function Home() {
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
// bird emoji is 🐦
