import AnimatedDialog from "./shared/animated-dialog";

export default function Loading() {
  return (
    <AnimatedDialog
      animationName="birdloader"
      open={true}
      content={"getting things ready for ya..."}
    />
  );
}
