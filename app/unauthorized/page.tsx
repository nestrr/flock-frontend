import { Container } from "@chakra-ui/react";

export default function Unauthorized() {
  return (
    <Container p={0} display="flex" justifyContent={"center"}>
      Oops! Looks like you tried to access a page that&apos;s only for logged-in
      users. Click the Log In button to log back in!
    </Container>
  );
}
