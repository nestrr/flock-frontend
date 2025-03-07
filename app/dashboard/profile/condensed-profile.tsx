import { type Profile } from "@/app/swr/profile";
import { Card, type UseDialogReturn } from "@chakra-ui/react";
import ProfileHeader from "./shared/profile-header";
import Bio from "./shared/bio";
import Badges from "./shared/badges";

export default function CondensedProfile({
  profile,
  dialog,
}: {
  profile: Profile;
  dialog: UseDialogReturn;
}) {
  const { standing, campusChoices, bio } = profile;
  const { setOpen: setDialogOpen } = dialog;
  return (
    <Card.Root
      width="350px"
      height="325px"
      bg={"accent.muted"}
      shadow={"sm"}
      variant={"elevated"}
      alignSelf={""}
    >
      <Card.Header>
        <ProfileHeader
          condensed={true}
          setDialogOpen={setDialogOpen}
          profile={profile}
        />
      </Card.Header>
      <Card.Body
        pb={0}
        pt={5}
        color="primary.fg"
        justifyContent={"space-between"}
      >
        <Card.Description color="primary.fg" asChild>
          <Bio bio={bio} />
        </Card.Description>
      </Card.Body>
      <Card.Footer>
        <Badges
          primaryCampus={campusChoices?.[0]?.name}
          standing={standing?.name}
        />
      </Card.Footer>
    </Card.Root>
  );
}
