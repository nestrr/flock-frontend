import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  mergeConfigs,
} from "@chakra-ui/react";
const headingRecipe = defineRecipe({
  variants: {
    size: {
      xl: {
        fontFamily: "Arvo",
      },

      "2xl": {
        fontFamily: "Arvo",
      },

      "3xl": {
        fontFamily: "Arvo",
      },
    },
  },
});
const theme = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: "Montserrat Alternates, sans-serif",
        },
        body: {
          value: "Questrial, sans-serif",
        },
      },
    },
    recipes: {
      heading: { ...defaultConfig.theme?.recipes?.heading, ...headingRecipe },
    },
  },
});
const config = mergeConfigs(defaultConfig, theme);
export const system = createSystem(config);
