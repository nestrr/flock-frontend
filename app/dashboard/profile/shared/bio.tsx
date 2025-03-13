import { HStack, Text } from "@chakra-ui/react";
export default function Bio({
  bio,
  truncate = true,
}: {
  bio: string;
  truncate?: boolean;
}) {
  function renderBio() {
    return truncate ? (
      <Text lineClamp={6} lineHeight={"tall"}>
        {bio}
      </Text>
    ) : (
      <Text fontSize="large" lineHeight={"tall"}>
        {bio}
      </Text>
    );
  }
  return bio ? (
    renderBio()
  ) : (
    <HStack gap={1}>
      {!bio && <Text>😶‍🌫️</Text>}
      <Text lineHeight={"tall"} fontStyle="italic">
        This user has not added a bio.
      </Text>
    </HStack>
  );
}
