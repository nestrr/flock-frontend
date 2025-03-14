"use client";
import { SegmentGroupRootProvider, useSegmentGroup } from "@chakra-ui/react";
import { GROUP_STATUSES } from "./groups/constants";
import GroupsList from "./groups/group-list";

export default function AllGroups() {
  const segmentGroup = useSegmentGroup({ defaultValue: GROUP_STATUSES.ACTIVE });

  return (
    <SegmentGroupRootProvider
      value={segmentGroup}
      h="100%"
      w="90%"
      boxShadow={"none"}
      flex={1}
      justifyContent={"start"}
      paddingInline={0}
      paddingBlock={0}
      px={2}
      py={0}
      m={0}
      alignItems="start"
    >
      <GroupsList />
    </SegmentGroupRootProvider>
  );
}
