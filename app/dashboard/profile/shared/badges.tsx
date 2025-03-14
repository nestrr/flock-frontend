import { HStack, Badge } from "@chakra-ui/react";
export default function Badges({
  primaryCampus,
  standing,
}: {
  primaryCampus?: string;
  standing?: string;
}) {
  return (
    <HStack
      flexWrap={"wrap"}
      gap="2"
      mt={2}
      borderTop="solid 1px"
      borderColor="primary.fg/30"
      pt={3}
      w="full"
    >
      <Badge
        textTransform={"lowercase"}
        shadow={"xs"}
        colorPalette={primaryCampus ? "yellow" : "gray"}
        letterSpacing={"wide"}
        fontWeight="medium"
        variant={"solid"}
      >
        {primaryCampus ?? "main campus unknown"}
      </Badge>
      <Badge
        textTransform={"lowercase"}
        shadow={"xs"}
        colorPalette={standing ? "yellow" : "gray"}
        letterSpacing={"wide"}
        fontWeight="medium"
        variant={"solid"}
      >
        {standing ?? "year unknown"}
      </Badge>
    </HStack>
  );
}
