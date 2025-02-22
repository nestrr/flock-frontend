import {
  Alert,
  Card,
  Heading,
  HStack,
  Text,
  Stack,
  Badge,
  Skeleton,
  Button,
  VStack,
  List,
} from "@chakra-ui/react";
import { DialogBody, DialogHeader } from "../shared/snippets/dialog";
import {
  type Edits,
  type Errors,
  useProfileEdit,
} from "./shared/profile-edit-context";
import { Avatar } from "../shared/snippets/avatar";
import { useCampus, useProgram, useStanding } from "../swr/profile";
import { useSession } from "next-auth/react";
import { type StringKeyOf } from "type-fest";
import { updateProfile } from "../actions/profile";
import { toaster } from "../shared/snippets/toaster";
import { LuHeartCrack } from "react-icons/lu";

export function Program({
  mergedDegreeType,
  mergedProgram,
}: {
  mergedDegreeType: string;
  mergedProgram: string;
}) {
  const { data: session, status: sessionStatus } = useSession();

  const {
    data: program,
    isLoading,
    error: error,
  } = useProgram(session?.accessToken, mergedProgram);
  if (isLoading || sessionStatus === "loading")
    return <Skeleton width="5em" height="2em" bg="accent.muted/50" />;
  if (error)
    return (
      <Text fontStyle={"italic"}>Failed to load degree information 😔</Text>
    );
  return program ? (
    <Text textStyle="sm">
      `${mergedDegreeType} @ ${program?.name}`
    </Text>
  ) : (
    <Text fontStyle={"italic"} lineHeight={1}>
      no degree information found
    </Text>
  );
}
export function Badges({
  primaryCampusId,
  mergedStanding,
}: {
  primaryCampusId: string;
  mergedStanding: string;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const {
    data: campus,
    isLoading: campusLoading,
    error: campusError,
  } = useCampus(session?.accessToken, primaryCampusId);
  const {
    data: standing,
    isLoading: standingLoading,
    error: standingError,
  } = useStanding(session?.accessToken, mergedStanding);
  function renderCampus() {
    if (campusLoading || sessionStatus === "loading")
      return <Skeleton width="5em" height="1.5em" bg="accent.emphasized" />;
    if (campusError && primaryCampusId)
      return (
        <Text fontStyle={"italic"}>Failed to load campus information 😔</Text>
      );
    return (
      <Badge
        textTransform={"lowercase"}
        shadow={"xs"}
        colorPalette={campus?.name ? "blue" : "gray"}
        letterSpacing={"wide"}
        fontWeight="bold"
        variant={"solid"}
      >
        {campus?.name ?? "main campus unknown"}
      </Badge>
    );
  }
  function renderStanding() {
    if (standingLoading || sessionStatus === "loading")
      return <Skeleton width="5em" height="1.5em" bg="accent.emphasized" />;
    if (standingError && mergedStanding)
      return (
        <Text fontStyle={"italic"}>Failed to load standing information 😔</Text>
      );
    return (
      <Badge
        textTransform={"lowercase"}
        colorPalette={standing?.name ? "blue" : "gray"}
        letterSpacing={"wide"}
        fontWeight="bold"
        variant={"solid"}
      >
        {standing?.name ?? "year unknown"}
      </Badge>
    );
  }
  return (
    <HStack
      flexWrap={"wrap"}
      gap="2"
      mt={2}
      borderTop="solid 1px"
      borderColor="primary.fg/30"
      pt={3}
    >
      {renderCampus()}
      {renderStanding()}
    </HStack>
  );
}
export function SaveButton() {
  const { edits, deleted, errors } = useProfileEdit();
  const { preferredTimes } = edits;
  function createUpdateRequest() {
    const updateRequest = (Object.keys(edits) as StringKeyOf<Edits>[]).reduce(
      (acc, key) => {
        if (typeof edits[key] === "string" && edits[key] !== null)
          return { ...acc, [key]: edits[key] };
        if (key === "preferredTimes") {
          return {
            ...acc,
            preferredTimes: {
              added: preferredTimes,
              deleted: deleted.preferredTimes ?? [],
            },
          };
        }
        if (key === "campusIds") {
          return {
            ...acc,
            campusIds: {
              added: edits.campusIds ?? [],
              deleted: Array.from(deleted.campusIds ?? []),
            },
          };
        }
        return acc;
      },
      {} as Record<string, unknown>
    );

    return updateRequest;
  }
  return (
    <Button
      variant={"surface"}
      w="min-fit"
      colorPalette={"secondary"}
      size="xs"
      disabled={Object.keys(errors).length > 0}
      onClick={async () => {
        const loadingToast = toaster.loading({
          title: "Updating profile...",
        });
        const response = await updateProfile(createUpdateRequest());
        console.log(response);
        toaster.dismiss(loadingToast);
        if (response.success) {
          toaster.success({ title: response.message });
        } else {
          toaster.error({ title: response.message });
        }
      }}
    >
      Save
    </Button>
  );
}
export function Prompt({ errors }: { errors: Errors }) {
  function toErrorMessages(error: Errors): string[] {
    return Object.keys(error).map((code) => {
      switch (code) {
        case "DUPLICATE_CAMPUS_CHOICE": {
          return "You've chosen the same campus twice.";
        }
        default: {
          return "";
        }
      }
    });
  }

  return Object.keys(errors).length ? (
    <Alert.Root
      size="sm"
      status="error"
      fontSize="sm"
      justifyContent={"center"}
    >
      <Alert.Indicator alignSelf={"center"}>
        <LuHeartCrack />
      </Alert.Indicator>
      <VStack px={5}>
        <Alert.Title lineHeight={"1.5em"}>
          We can&apos;t save your profile yet! Please fix these errors.
        </Alert.Title>
        <Alert.Description>
          <List.Root>
            {toErrorMessages(errors).map((message, index) => (
              <List.Item key={index}>{message}</List.Item>
            ))}
          </List.Root>
        </Alert.Description>
      </VStack>
    </Alert.Root>
  ) : (
    <Alert.Root
      size="sm"
      bg="accent.muted/50"
      color="primary.fg"
      fontSize="sm"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Alert.Title alignSelf="end" lineHeight={"1.5em"}>
        🎉 All done! Here&apos;s what your profile will look like to other
        students. Click &quot;Save&quot; to finish.
      </Alert.Title>
    </Alert.Root>
  );
}
export default function Summary() {
  const { initial, edits, errors } = useProfileEdit();
  const { degree, campusChoices, standing } = initial;
  const { degreeTypeCode, campusIds, standingId, programCode } = edits;
  const { name, bio, image } = { ...initial, ...edits };
  const primaryCampusId = campusIds?.[0] ?? campusChoices?.[0]?.id;
  const mergedDegreeType = degree?.degreeTypeCode ?? degreeTypeCode;
  const mergedStanding = standing?.id ?? standingId;
  const mergedProgram = programCode ?? degree?.programCode;

  return (
    <>
      <DialogHeader spaceY={2}>
        <Heading textAlign={"center"} size="3xl" textTransform={"lowercase"}>
          ready to go?
        </Heading>
        <Prompt errors={errors} />
      </DialogHeader>
      <DialogBody spaceY={5}>
        <VStack justifyContent={"center"} alignItems="center">
          <Card.Root
            width="320px"
            bg={"accent.muted"}
            shadow={"sm"}
            variant={"elevated"}
            alignSelf={""}
          >
            <Card.Body color="primary.fg" gap={1}>
              <HStack mb="6" gap="3">
                <Avatar
                  src={image}
                  name={name}
                  bg="primary.contrast"
                  variant={"outline"}
                />
                <Stack gap="0">
                  <Text fontWeight="semibold" textStyle="sm">
                    {name}
                  </Text>
                  <Program
                    mergedDegreeType={mergedDegreeType}
                    mergedProgram={mergedProgram}
                  />
                </Stack>
              </HStack>
              <Card.Description color="primary.fg" asChild>
                <HStack gap={1}>
                  {!bio && <Text>😶‍🌫️</Text>}
                  <Text fontStyle="italic">
                    {bio ?? " This user has not added a bio."}
                  </Text>
                </HStack>
              </Card.Description>
              <Badges
                primaryCampusId={primaryCampusId}
                mergedStanding={mergedStanding}
              />
            </Card.Body>
            <Card.Footer justifyContent={"center"}>
              <SaveButton />
            </Card.Footer>
          </Card.Root>
        </VStack>
      </DialogBody>
    </>
  );
}
