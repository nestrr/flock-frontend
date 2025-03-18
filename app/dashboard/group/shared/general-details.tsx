import {
  Heading,
  VStack,
  Stack,
  Button,
  Textarea,
  Icon,
} from "@chakra-ui/react";
import { LuImage, LuSparkle } from "react-icons/lu";
import debounce from "debounce";
import { Avatar } from "@/app/shared/snippets/avatar";
import { ringCss } from "@/theme";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/app/shared/snippets/file-upload";
import { toaster } from "@/app/shared/snippets/toaster";
import InputItem from "@/app/shared/input-item";
import InputIcon from "@/app/profile/shared/input-icon";
import {
  DESCRIPTION_TOO_SHORT,
  GROUP_ERRORS,
  NAME_TOO_SHORT,
} from "../shared/constants/errors";
import { useGroup, useGroupDispatch } from "../shared/group-context";
import { FaDiscord } from "react-icons/fa6";

export default function GeneralDetails() {
  const { name, description, errors } = useGroup();
  const dispatch = useGroupDispatch();
  const debouncedNameUpdate = debounce((dispatch, newName) => {
    dispatch({
      type: "updateDetails",
      payload: { name: newName.trim() },
    });
  }, 300);
  const debouncedDescriptionUpdate = debounce((dispatch, newDescription) => {
    dispatch({
      type: "updateDetails",
      payload: { description: newDescription.trim() },
    });
  }, 300);
  return (
    <VStack alignItems="start" w="full" gapY={5}>
      <Heading fontSize="lg">general details</Heading>
      <Stack
        justifyContent={"center"}
        alignItems="center"
        w="full"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
        bg="accent.muted/50"
        p={3}
        rounded="md"
      >
        <Avatar
          name={name ?? "new group"}
          bgGradient="to-tr"
          gradientFrom={{ _dark: "green.600", _light: "green.400" }}
          gradientTo={{ _dark: "yellow.600", _light: "yellow.400" }}
          gradientVia={{ _dark: "pink.600", _light: "pink.300" }}
          css={ringCss}
          aspectRatio={"square"}
          boxShadow={"xs"}
          h="5em"
          w="5em"
        />
        <FileUploadRoot
          w="min-content"
          accept={["image/png", "image/jpeg"]}
          maxFileSize={20_000}
          onFileReject={() => {
            toaster.create({
              type: "error",
              title:
                "Please upload a PNG or JPEG file that is no bigger than 20MB.",
            });
          }}
        >
          <FileUploadTrigger asChild>
            <Button variant="surface" colorPalette="accent">
              <LuImage /> Upload a new group picture
            </Button>
          </FileUploadTrigger>
          <FileUploadList />
        </FileUploadRoot>
      </Stack>
      <InputItem
        label="name"
        placeholder="What's your group going to be called?"
        defaultValue={name}
        onChange={(e) => {
          debouncedNameUpdate(dispatch, e.target.value);
        }}
        endAddon={
          <InputIcon
            tooltip={"A group name is required before you send invites."}
            icon={<LuSparkle />}
          />
        }
        alert={errors.has(NAME_TOO_SHORT) ? GROUP_ERRORS[NAME_TOO_SHORT] : ""}
        min={100}
      />
      <InputItem
        label="description"
        alert={
          errors.has(DESCRIPTION_TOO_SHORT)
            ? GROUP_ERRORS[DESCRIPTION_TOO_SHORT]
            : ""
        }
        endAddon={
          <InputIcon
            tooltip={"A group description is required before you send invites."}
            icon={<LuSparkle />}
          />
        }
      >
        <Textarea
          placeholder="What's the group about?"
          aria-label="What's the group about?"
          rounded="md"
          borderWidth={0}
          minH="3em"
          defaultValue={description}
          rows={5}
          onChange={(e) => {
            debouncedDescriptionUpdate(dispatch, e.target.value);
          }}
        />
      </InputItem>
      <InputItem
        label="social"
        startElement={
          <Icon>
            <FaDiscord size={"30px"} color="darkgray" />
          </Icon>
        }
        placeholder="     include a Discord channel URL (optional)"
        onChange={() => {
          console.log("TODO: Include Discord channel in group.");
        }}
      />
    </VStack>
  );
}
