import { HStack, Stack, Heading, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import { LuGithub, LuMessageCircle } from "react-icons/lu";
function FooterLink({
  href,
  linkText,
  icon,
}: {
  href: string;
  linkText: string;
  icon: React.ReactNode;
}) {
  return (
    <HStack
      gap={2}
      bg="primary.subtle"
      _hover={{ bg: "primary.emphasized" }}
      p={2}
      rounded="md"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <ChakraLink
        asChild
        fontWeight="medium"
        letterSpacing={"wide"}
        color="primary.fg"
        textAlign={{ mdDown: "center" }}
        fontSize={"sm"}
      >
        <NextLink href={href}>
          <Icon fontSize={"1.5em"} display={{ mdDown: "none" }}>
            {icon}
          </Icon>
          {linkText}
        </NextLink>
      </ChakraLink>
    </HStack>
  );
}
export default function Footer() {
  return (
    <HStack
      as="footer"
      w="100%"
      maxW="100%"
      bg="primary"
      color="primary.fg"
      py={3}
      px={8}
      justifyContent={"space-between"}
    >
      <Heading size="md" maxWidth={"60%"}>
        Made with ❤️ by Oregon Tech, for Oregon Tech.
      </Heading>
      <Stack gap={3} alignItems="end" flexDir={{ base: "column", md: "row" }}>
        <FooterLink
          icon={<LuGithub />}
          href="https://github.com/nestrr"
          linkText="See us on GitHub"
        />
        <FooterLink
          icon={<LuMessageCircle />}
          href="https://nestrr.zulipchat.org"
          linkText="Chat with the team"
        />
      </Stack>
    </HStack>
  );
}
