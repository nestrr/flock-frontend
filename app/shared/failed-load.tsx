import { VStack } from "@chakra-ui/react";
import { LuFrown } from "react-icons/lu";

export default function FailedLoad({ description }: { description?: string }) {
  return (
    <VStack
      alignItems={"center"}
      justifyContent={"center"}
      width="100%"
      height="100%"
    >
      <LuFrown size={"100px"} stroke="darkorange" />
      <h1>{description ? description : "failed to load"}</h1>
    </VStack>
  );
}
