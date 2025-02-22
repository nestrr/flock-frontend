import { Tooltip } from "@/app/shared/snippets/tooltip";
import { Box, Icon } from "@chakra-ui/react";

export default function InputIcon({
  tooltip,
  icon,
}: {
  tooltip: string;
  icon: React.ReactNode;
}) {
  return (
    <Box>
      <Tooltip content={tooltip} showArrow openDelay={50} closeDelay={50}>
        <Icon
          color="accent.primary"
          fontSize={"lg"}
          _hover={{ color: "accent.contrast" }}
        >
          {icon}
        </Icon>
      </Tooltip>
    </Box>
  );
}
