"use client";
import {
  DotLottieReact,
  type DotLottieReactProps,
} from "@lottiefiles/dotlottie-react";
import { useColorMode } from "./snippets/color-mode";

export default function Animation({
  name,
  dotLottieSettings = {},
}: {
  name: string;
  dotLottieSettings?: DotLottieReactProps;
}) {
  const { colorMode } = useColorMode();
  return (
    <DotLottieReact
      src={`./animations/${name}/${colorMode === "light" ? "light" : "dark"}.lottie`}
      loop
      autoplay
      {...dotLottieSettings}
      suppressHydrationWarning
    />
  );
}
