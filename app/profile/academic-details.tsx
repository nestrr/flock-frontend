"use client";
import {
  createListCollection,
  DialogHeader,
  Heading,
  Text,
  Skeleton,
  Alert,
} from "@chakra-ui/react";
import { DialogBody } from "../shared/snippets/dialog";
import React from "react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../shared/snippets/select";
import { useSession } from "next-auth/react";
import { useDegreeTypes, usePrograms, useStandings } from "../swr/profile";
import InputItem from "../shared/input-item";
import {
  useProfileEdit,
  useProfileEditDispatch,
} from "./shared/profile-edit-context";

function Standings({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLElement>;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useProfileEditDispatch();
  const { initial: profile } = useProfileEdit();
  const currentStandingId = profile.standing?.id;
  const {
    data: standings,
    error,
    isLoading,
  } = useStandings(session?.accessToken);

  if (error) {
    return (
      <Text fontWeight={"bold"} letterSpacing={"wide"} color="red/80">
        Failed to load 😔
      </Text>
    );
  }
  if (isLoading || sessionStatus === "loading")
    return (
      <Skeleton
        bg={"accent"}
        width={{ base: "3em", md: "10em" }}
        height="2em"
      />
    );
  const standingsCollection = createListCollection({
    items: standings?.map(({ id, name }) => ({ label: name, value: id })) ?? [],
  });

  return (
    <SelectRoot
      collection={standingsCollection}
      // @ts-expect-error The types are wrong in ChakraUI. "filled" is valid: https://www.chakra-ui.com/docs/components/select#root
      variant="filled"
      defaultValue={!!currentStandingId ? [currentStandingId] : []}
      rounded="md !important"
      onValueChange={(e) =>
        dispatch({
          type: "update",
          edit: {
            standingId: e.items[0].value,
          },
        })
      }
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select year" />
      </SelectTrigger>
      <SelectContent
        portalled={true}
        portalRef={contentRef as unknown as React.RefObject<HTMLElement>}
      >
        {standingsCollection.items.map((standing) => (
          <SelectItem item={standing} key={standing.value}>
            {standing.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

function DegreeTypes({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLElement>;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useProfileEditDispatch();
  const { initial: profile } = useProfileEdit();
  const currentDegreeType = profile.degree?.degreeTypeCode;
  const {
    data: degreeTypes,
    error,
    isLoading,
  } = useDegreeTypes(session?.accessToken);

  if (error) {
    return (
      <Text fontWeight={"bold"} letterSpacing={"wide"} color="red/80">
        Failed to load 😔
      </Text>
    );
  }
  if (isLoading || sessionStatus === "loading")
    return (
      <Skeleton
        bg={"accent"}
        width={{ base: "3em", md: "10em" }}
        height="2em"
      />
    );
  const degreeTypesCollection = createListCollection({
    items:
      degreeTypes?.map(({ code, name }) => ({ label: name, value: code })) ??
      [],
  });
  return (
    <SelectRoot
      collection={degreeTypesCollection}
      // @ts-expect-error The types are wrong in ChakraUI. "filled" is valid: https://www.chakra-ui.com/docs/components/select#root
      variant="filled"
      rounded="md !important"
      positioning={{ fitViewport: true }}
      defaultValue={!!currentDegreeType ? [currentDegreeType] : undefined}
      onValueChange={(e) =>
        dispatch({
          type: "update",
          edit: { degreeTypeCode: e.items[0].value },
        })
      }
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select degree level..." />
      </SelectTrigger>
      <SelectContent
        portalled={true}
        portalRef={contentRef as unknown as React.RefObject<HTMLElement>}
      >
        {degreeTypesCollection.items.map((level) => (
          <SelectItem item={level} key={level.value}>
            {level.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
function Programs({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLElement>;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useProfileEditDispatch();
  const { initial: profile, edits } = useProfileEdit();
  const {
    programCode: currentProgramCode = profile.degree?.programCode,
    degreeTypeCode: degreeType = profile.degree?.degreeTypeCode,
  } = edits;
  const {
    data: programs,
    error,
    isLoading,
  } = usePrograms(session?.accessToken, degreeType);
  if (error) {
    return (
      <Text fontWeight={"bold"} letterSpacing={"wide"} color="red/80">
        Failed to load 😔
      </Text>
    );
  }
  if (isLoading || sessionStatus === "loading")
    return (
      <Skeleton
        bg={"accent"}
        width={{ base: "3em", md: "10em" }}
        height="2em"
      />
    );
  const programsCollection = createListCollection({
    items:
      programs?.map(({ code, name }) => ({ label: name, value: code })) ?? [],
  });
  return (
    <SelectRoot
      collection={programsCollection}
      // @ts-expect-error The types are wrong in ChakraUI. "filled" is valid: https://www.chakra-ui.com/docs/components/select#root
      variant="filled"
      rounded="md !important"
      positioning={{ fitViewport: true }}
      defaultValue={!!currentProgramCode ? [currentProgramCode] : undefined}
      onValueChange={(e) =>
        dispatch({
          type: "update",
          edit: {
            programCode: e.items[0].value,
          },
        })
      }
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select degree program..." />
      </SelectTrigger>
      <SelectContent
        portalled={true}
        portalRef={contentRef as unknown as React.RefObject<HTMLElement>}
      >
        {programsCollection.items.map((program) => (
          <SelectItem item={program} key={program.value}>
            {program.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

export default function AcademicDetails({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLElement>;
}) {
  return (
    <>
      <DialogHeader spaceY={2}>
        <Heading textAlign={"center"} size="3xl" textTransform={"lowercase"}>
          what are you studying?
        </Heading>
        <Alert.Root
          size="sm"
          bg="accent.muted/50"
          color="primary.fg"
          fontSize="sm"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Alert.Title alignSelf="end">
            👀 Can&apos;t find your path in this list? Shoot us a message!
          </Alert.Title>
        </Alert.Root>
        <Alert.Root
          size="sm"
          bg="accent.muted/50"
          color="primary.fg"
          fontSize="sm"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Alert.Title alignSelf="end">
            <span>
              💡 You&apos;ll need to select a level {<strong>and</strong>} a
              program to update your degree information.
            </span>
          </Alert.Title>
        </Alert.Root>
      </DialogHeader>
      <DialogBody flex={0} spaceY={4}>
        <InputItem label="year">
          <Standings contentRef={contentRef} />
        </InputItem>
        <InputItem label="level">
          <DegreeTypes contentRef={contentRef} />
        </InputItem>

        <InputItem label="program">
          <Programs contentRef={contentRef} />
        </InputItem>
      </DialogBody>
    </>
  );
}
