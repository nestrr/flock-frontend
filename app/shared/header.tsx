import { HStack, Container, Heading } from "@chakra-ui/react";
import { ColorModeButton } from "./snippets/color-mode";

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
        <ColorModeButton rounded="full" />
      </HStack>
    </Container>
  );
}
