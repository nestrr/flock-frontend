"use client";
import debounce from "debounce";
import {
  VStack,
  HStack,
  Badge,
  DialogHeader,
  Heading,
  Button,
  Stack,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { DialogBody } from "../shared/snippets/dialog";
import React from "react";
import { LuImage, LuLockKeyhole } from "react-icons/lu";
import { toaster } from "../shared/snippets/toaster";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "../shared/snippets/file-upload";
import { ringCss } from "@/theme";
import { Avatar } from "../shared/snippets/avatar";
import { FaDiscord } from "react-icons/fa";
import InputIcon from "./shared/input-icon";
import InputItem from "./shared/input-item";
import {
  useProfileEdit,
  useProfileEditDispatch,
} from "./shared/profile-edit-context";

export default function Basics() {
  const { initial: profile } = useProfileEdit();
  const dispatch = useProfileEditDispatch();
  const debouncedUpdate = debounce((dispatch, profile, newBio) => {
    dispatch({
      type: "update",
      edit: { bio: newBio },
    });
  }, 500);
  const { name, email, roles, bio, image } = profile;
  return (
    <>
      <DialogHeader>
        <Heading textAlign={"center"} size="3xl" textTransform={"lowercase"}>
          The Basics
        </Heading>
      </DialogHeader>
      <DialogBody>
        <VStack
          height="100%"
          alignItems={"stretch"}
          justifyContent={"center"}
          px={10}
          gap={3}
        >
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
              name={name}
              src={image}
              bg="primary.contrast"
              css={ringCss}
              aspectRatio={"square"}
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
                  <LuImage /> Upload a new profile picture
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>
          </Stack>
          <InputItem
            value={name}
            label="name"
            locked={true}
            endAddon={
              <InputIcon
                tooltip={
                  "Your name is associated with your OIT account and cannot be changed."
                }
                icon={<LuLockKeyhole />}
              />
            }
          ></InputItem>

          <InputItem
            value={email}
            label="email"
            locked={true}
            endAddon={
              <InputIcon
                tooltip={
                  "Your name is associated with your OIT account and cannot be changed."
                }
                icon={<LuLockKeyhole />}
              />
            }
          ></InputItem>

          <InputItem
            value={""}
            startElement={
              <HStack gap={2}>
                {roles.map((role, id) => (
                  <Badge key={id} size={"sm"} shadow={"sm"}>
                    {role}
                  </Badge>
                ))}
              </HStack>
            }
            label="roles"
            locked={true}
            endAddon={
              <InputIcon
                tooltip={"Your roles can only be updated by an administrator."}
                icon={<LuLockKeyhole />}
              />
            }
          ></InputItem>

          <InputItem label="about me">
            <Textarea
              placeholder="Tell us about yourself!"
              aria-label="Tell us about yourself"
              rounded="md"
              borderWidth={0}
              minH="2em"
              defaultValue={bio}
              onChange={(e) => {
                debouncedUpdate(dispatch, profile, e.target.value);
              }}
            />
          </InputItem>
          <InputItem label="socials">
            <IconButton rounded="full">
              <FaDiscord />
            </IconButton>
          </InputItem>
        </VStack>
      </DialogBody>
    </>
  );
}
