import { Container, Heading, Stack } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Container
        as="main"
        w="100%"
        maxW="100%"
        flex={1}
        flexDir={"column"}
        alignItems={"stretch"}
        justifyContent={"stretch"}
        py={10}
        px={0}
      >
        <Stack
          as="section"
          h="100%"
          gap={10}
          p={9}
          alignItems="center"
          justifyContent={"center"}
        >
          <Heading
            as="h1"
            size="6xl"
            letterSpacing={"wide"}
            textAlign={"center"}
          >
            Welcome. 👋🐦
          </Heading>
          <Heading as="h2" size="3xl" fontWeight="light" textAlign={"center"}>
            Something awesome&apos;s cooking. Check back in soon.
          </Heading>
        </Stack>
      </Container>
    </>
  );
}
// bird emoji is 🐦
