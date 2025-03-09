"use client";
import {
  Alert,
  Card,
  createListCollection,
  DialogHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { DialogBody } from "../shared/snippets/dialog";
import React, { useState } from "react";
import { LuCircleHelp } from "react-icons/lu";
import { Tooltip } from "../shared/snippets/tooltip";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../shared/snippets/select";
import InputIcon from "./shared/input-icon";
import InputItem from "../shared/input-item";
import {
  useProfileEdit,
  useProfileEditDispatch,
} from "./shared/profile-edit-context";
import { type Campus, useCampuses } from "../swr/profile";
import { useSession } from "next-auth/react";
import { Skeleton } from "../shared/snippets/skeleton";
import { ORDINALS } from "../shared/constants";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../shared/snippets/accordion";

export function CampusDescriptions({ campuses }: { campuses: Campus[] }) {
  return (
    <AccordionRoot
      defaultValue={["choices"]}
      collapsible
      bg="accent.muted/50"
      rounded="md"
      px={5}
    >
      <AccordionItem value={"choices"} borderWidth={0}>
        <AccordionItemTrigger>
          <Heading fontSize={"md"}>the choices</Heading>
        </AccordionItemTrigger>
        <AccordionItemContent display={"flex"} gap={5}>
          {campuses.map((campus) => (
            <Card.Root
              key={campus.id}
              variant="outline"
              borderWidth={0}
              shadow={"sm"}
              height="150px"
            >
              <Card.Header>
                <Heading size="md">{campus.name}</Heading>
              </Card.Header>
              <Card.Body>{campus.description}</Card.Body>
            </Card.Root>
          ))}
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export default function Preferences({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLElement>;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const [inputError, setInputError] = useState<string>("");
  const dispatch = useProfileEditDispatch();
  const { edits, errors, initial } = useProfileEdit();
  const defaultChoices = initial.campusChoices?.map((c) => c.id) ?? [];
  const choices: Array<string> = edits.campusIds
    ? edits.campusIds
    : defaultChoices;

  const {
    data: campuses,
    error: fetchError,
    isLoading,
  } = useCampuses(session?.accessToken);

  const campusList = createListCollection({
    items: campuses
      ? Object.entries(campuses).map(([id, campus]) => ({
          label: (campus as Campus).name,
          value: id,
        }))
      : [],
  });
  // TODO: fetch from API
  const rankingDescriptions = [
    "This is the campus I primarily attend. It would be my first choice for meeting up.",
    "This is a campus I sometimes attend. I'm okay with meeting up here too.",
  ];

  function updateChoices(choice: string, index: number) {
    const pad = Array.from({ length: index - choices.length }, () => "");
    // replace choice at index if present, else add it
    const newChoices = [...choices, ...pad].toSpliced(index, 1, choice);
    if (choices.includes(choice)) {
      setInputError(
        `Your ${ORDINALS[index]} choice cannot be recorded, because you've already assigned the same campus to another preference.`
      );
      dispatch({
        type: "update",
        edit: {
          campusIds: newChoices,
        },
        errors: { DUPLICATE_CAMPUS_CHOICE: [choice] },
      });
    } else {
      if (errors.DUPLICATE_CAMPUS_CHOICE?.includes(choices[index]!)) {
        dispatch({
          type: "clearErrors",
          errors: {
            DUPLICATE_CAMPUS_CHOICE: [choices[index]!],
          },
        });
        setInputError("");
      }
      dispatch({
        type: "update",
        edit: {
          campusIds: newChoices,
        },
      });
    }
  }

  function removeChoice(index: number) {
    if (errors.DUPLICATE_CAMPUS_CHOICE?.includes(choices[index]!)) {
      dispatch({
        type: "clearErrors",
        errors: {
          DUPLICATE_CAMPUS_CHOICE: [choices[index]!],
        },
      });
      setInputError("");
    }
    dispatch({
      type: "delete",
      edit: {
        campusIndices: [index],
      },
    });
  }

  /**
   * Checks if all choices after the current choice are null.
   * @param index - The index of current choice
   * @returns True if all choices after the current choice are null, else false.
   */
  function canRemove(index: number) {
    return choices.every((choice, i) => (i <= index ? true : choice === null));
  }

  function render() {
    if (fetchError) {
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
    const selections = rankingDescriptions.map((description, index) => (
      <InputItem
        colorPalette={index === 0 ? "accent.muted" : "accent.muted/50"}
        key={index}
        label={`choice #${index + 1}`}
        endAddon={<InputIcon tooltip={description} icon={<LuCircleHelp />} />}
      >
        {/* ts-ignore */}
        <SelectRoot
          collection={campusList}
          // @ts-expect-error The types are wrong in ChakraUI. "filled" is valid: https://www.chakra-ui.com/docs/components/select#root
          variant="filled"
          rounded="md !important"
          onValueChange={(e) => {
            if (!e.items.length) return removeChoice(index);
            const currentChoice = e.items[0].value;
            updateChoices(currentChoice, index);
          }}
          defaultValue={!!choices?.[index] ? [choices[index]] : undefined}
          disabled={index > choices.length}
        >
          <SelectTrigger clearable={canRemove(index)}>
            <SelectValueText placeholder="Select campus" />
          </SelectTrigger>
          <SelectContent
            portalled={true}
            portalRef={contentRef as unknown as React.RefObject<HTMLElement>}
          >
            {campusList.items.map((campus) => (
              <Tooltip
                openDelay={50}
                closeDelay={50}
                showArrow
                content={
                  campuses![campus.value]?.description ??
                  "No description found."
                }
                key={campus.value}
              >
                <SelectItem item={campus}>{campus.label}</SelectItem>
              </Tooltip>
            ))}
          </SelectContent>
        </SelectRoot>
      </InputItem>
    ));
    return (
      <>
        {selections}
        {inputError && <Alert.Root status="error">{inputError}</Alert.Root>}
        <CampusDescriptions campuses={Object.values(campuses)} />
      </>
    );
  }
  return (
    <>
      <DialogHeader spaceY={2}>
        <Heading textAlign={"center"} size="3xl" textTransform={"lowercase"}>
          where do you like to study?{" "}
        </Heading>
      </DialogHeader>
      <DialogBody flex={0} height="min-content" spaceY={5}>
        {render()}
      </DialogBody>
    </>
  );
}
