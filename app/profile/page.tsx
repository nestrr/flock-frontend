"use client";
import LocationPreferences from "./location-preferences";
import { HStack, DialogFooter, IconButton, Container } from "@chakra-ui/react";
import { DialogContent, DialogRoot } from "../shared/snippets/dialog";
import React, { useState, useRef, useEffect } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import Basics from "./basics";
import TimePreferences from "./time-preferences/time-preferences";
import AcademicDetails from "./academic-details";
import Summary from "./summary";
import { useRouter } from "next/navigation";

export default function Page() {
  const contentRef = useRef<HTMLElement | HTMLDivElement>(null);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [screenIndex, setScreenIndex] = useState(0);

  useEffect(() => {
    if (!open) router.back();
  }, [open, router]);

  const screens = [
    <Basics key="basics" />,
    <AcademicDetails
      key="academicDetails"
      contentRef={contentRef as unknown as React.RefObject<HTMLElement>}
    />,
    <LocationPreferences
      key="locationPrefs"
      contentRef={contentRef as unknown as React.RefObject<HTMLElement>}
    />,
    <TimePreferences key="timePrefs" />,
    <Summary key="summary" />,
  ];

  return (
    <>
      <DialogRoot
        placement="center"
        size="xl"
        motionPreset="slide-in-bottom"
        open={open}
        onOpenChange={(isOpen) => setOpen(!isOpen)}
      >
        <DialogContent
          bg="secondary"
          color="secondary.fg"
          height="90%"
          mdDown={{ height: "100%", scrollbarWidth: "auto" }}
          overflowY="auto"
          scrollbarWidth={"thin"}
          ref={contentRef as React.RefObject<HTMLDivElement>}
          py={2}
        >
          <Container
            display="flex"
            flexDir="column"
            justifyContent={"center"}
            gapY={3}
            flex="1"
          >
            {screens[screenIndex]}
          </Container>
          <DialogFooter justifyContent={"center"}>
            <HStack w="90%" justifyContent="space-between">
              <IconButton
                aria-label="back"
                rounded={"full"}
                colorPalette={"accent"}
                variant="surface"
                onClick={() => setScreenIndex((screenIndex) => screenIndex - 1)}
                visibility={screenIndex > 0 ? "visible" : "hidden"}
              >
                <LuArrowLeft />
              </IconButton>
              <IconButton
                rounded={"full"}
                aria-label="next"
                colorPalette={"accent"}
                variant="surface"
                onClick={() => setScreenIndex((screenIndex) => screenIndex + 1)}
                disabled={screenIndex === screens.length - 1}
                visibility={
                  screenIndex < screens.length - 1 ? "visible" : "hidden"
                }
              >
                <LuArrowRight />
              </IconButton>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
