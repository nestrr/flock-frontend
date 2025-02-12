import React from "react";
import { DialogContent, DialogRoot, DialogTrigger } from "./snippets/dialog";
import { Box, VStack } from "@chakra-ui/react";
import Animation from "./animation";

export default function AnimatedDialog({
  animationName,
  open,
  content,
  trigger,
}: {
  animationName: string;
  open: boolean;
  content: React.ReactNode;
  trigger?: React.ReactNode;
}) {
  return (
    <DialogRoot placement="center" motionPreset="slide-in-bottom" open={open}>
      {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <VStack
          height="100%"
          alignItems="center"
          justifyContent={"center"}
          p={10}
        >
          <Box width={500} aspectRatio={"initial"} m={0} p={0}>
            {" "}
            <Animation name={animationName} />
          </Box>

          {content}
        </VStack>
      </DialogContent>
    </DialogRoot>
  );
}
