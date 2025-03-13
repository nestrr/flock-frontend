import { Accordion, HStack, Icon } from "@chakra-ui/react";
import * as React from "react";
import { LuChevronDown } from "react-icons/lu";

interface AccordionItemTriggerProps extends Accordion.ItemTriggerProps {
  indicatorPlacement?: "start" | "end";
}

export const AccordionItemTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionItemTriggerProps
>(function AccordionItemTrigger(props, ref) {
  const { children, indicatorPlacement = "end", ...rest } = props;
  return (
    <Accordion.ItemTrigger {...rest} ref={ref} gap={0}>
      {indicatorPlacement === "start" && (
        <Accordion.ItemIndicator rotate={{ base: "-90deg", _open: "0deg" }}>
          <LuChevronDown color="fg" />
        </Accordion.ItemIndicator>
      )}
      <HStack
        gap="4"
        textOverflow="ellipsis"
        textAlign="start"
        justifyContent={"stretch"}
        flex={1}
        overflowX="hidden"
      >
        {children}
      </HStack>
      {indicatorPlacement === "end" && (
        <Accordion.ItemIndicator asChild>
          <Icon color="colorPalette">
            <LuChevronDown />
          </Icon>
        </Accordion.ItemIndicator>
      )}
    </Accordion.ItemTrigger>
  );
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AccordionItemContentProps extends Accordion.ItemContentProps {}

export const AccordionItemContent = React.forwardRef<
  HTMLDivElement,
  AccordionItemContentProps
>(function AccordionItemContent(props, ref) {
  return (
    <Accordion.ItemContent>
      <Accordion.ItemBody {...props} ref={ref} />
    </Accordion.ItemContent>
  );
});

export const AccordionRoot = Accordion.Root;
export const AccordionItem = Accordion.Item;
