import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSemanticTokens,
  defineTokens,
  mergeConfigs,
} from "@chakra-ui/react";
const colorTokens = defineTokens({
  colors: {
    textDark: {
      main: { value: "#f6dfeb" },
    },
    backgroundDark: {
      main: { value: "#1e0913" },
      50: { value: "#f9ebf2" },
      100: { value: "#f3d8e5" },
      200: { value: "#e8b0ca" },
      300: { value: "#dc89b1" },
      400: { value: "#d06297" },
      500: { value: "#c43b7d" },
      600: { value: "#9d2f64" },
      700: { value: "#9d2f64" },
      800: { value: "#4f1731" },
      900: { value: "#270c19" },
    },
    primaryDark: {
      main: { value: "#e292b9" },
      50: { value: "#faebf2" },
      100: { value: "#f4d7e5" },
      200: { value: "#eaaecb" },
      300: { value: "#df86b1" },
      400: { value: "#d45e97" },
      500: { value: "#c9367d" },
      600: { value: "#a12b64" },
      700: { value: "#79204b" },
      800: { value: "#511532" },
      900: { value: "#280b19" },
    },
    secondaryDark: {
      main: { value: "#8ccd42" },
      50: { value: "#f3faeb" },
      100: { value: "#e6f4d7" },
      200: { value: "#ceeaae" },
      300: { value: "#b5df86" },
      400: { value: "#9dd45e" },
      500: { value: "#84c936" },
      600: { value: "#6aa12b" },
      700: { value: "#4f7920" },
      800: { value: "#355115" },
      900: { value: "#1a280b" },
    },
    accentLight: {
      main: { value: "#ade6b5" },
      50: { value: "#ebf9ed" },
      100: { value: "#d8f3dc" },
      200: { value: "#b1e7b8" },
      300: { value: "#8adb95" },
      400: { value: "#63cf71" },
      500: { value: "#3cc34e" },
      600: { value: "#309c3e" },
      700: { value: "#24752f" },
      800: { value: "#184e1f" },
      900: { value: "#0c2710" },
    },
    textLight: {
      main: { value: "#200915" },
    },
    backgroundLight: {
      main: { value: "#f8e7ef" },
      50: { value: "#f9ebf2" },
      100: { value: "#f4d7e5" },
      200: { value: "#e8b0ca" },
      300: { value: "#dd88b0" },
      400: { value: "#d16195" },
      500: { value: "#c6397b" },
      600: { value: "#9e2e62" },
      700: { value: "#77224a" },
      800: { value: "#4f1731" },
      900: { value: "#280b19" },
    },
    primaryLight: {
      main: { value: "#6d1d44" },
      50: { value: "#faebf2" },
      100: { value: "#f4d7e5" },
      200: { value: "#eaaecb" },
      300: { value: "#df86b1" },
      400: { value: "#d45e97" },
      500: { value: "#c9367d" },
      600: { value: "#a12b64" },
      700: { value: "#79204b" },
      800: { value: "#511532" },
      900: { value: "#280b19" },
    },
    secondaryLight: {
      main: { value: "#d5f4ae" },
      50: { value: "#f3fce9" },
      100: { value: "#e7f9d2" },
      200: { value: "#d0f3a5" },
      300: { value: "#b8ed78" },
      400: { value: "#a1e74b" },
      500: { value: "#89e01f" },
      600: { value: "#6eb418" },
      700: { value: "#528712" },
      800: { value: "#375a0c" },
      900: { value: "#1b2d06" },
    },
    accentDark: {
      main: { value: "#195221" },
      50: { value: "#ebf9ed" },
      100: { value: "#d8f3dc" },
      200: { value: "#b1e7b8" },
      300: { value: "#8adb95" },
      400: { value: "#63cf71" },
      500: { value: "#3cc34e" },
      600: { value: "#309c3e" },
      700: { value: "#24752f" },
      800: { value: "#184e1f" },
      900: { value: "#0c2710" },
    },
  },
});
const colorSemanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      DEFAULT: {
        value: {
          _light: "{colors.backgroundLight.main}",
          _dark: "{colors.backgroundDark.main}",
        },
      },
      contrast: {
        value: {
          _light: "{colors.backgroundDark.main}",
          _dark: "{colors.backgroundLight.main}",
        },
      },
      bg: {
        value: {
          _light: "{colors.backgroundLight.main}",
          _dark: "{colors.backgroundDark.main}",
        },
      },
      subtle: {
        value: {
          _light: "{colors.backgroundLight.50}",
          _dark: "{colors.backgroundDark.900}",
        },
      },

      muted: {
        value: {
          _light: "{colors.backgroundLight.100}",
          _dark: "{colors.backgroundDark.800}",
        },
      },
      emphasized: {
        value: {
          _light: "{colors.primaryLight.200}",
          _dark: "{colors.primaryDark.700}",
        },
      },
      panel: {
        value: {
          _light: "{colors.secondaryLight.200}",
          _dark: "{colors.secondaryDark.700}",
        },
      },
      solid: {
        value: {
          _light: "{colors.primaryLight.200}",
          _dark: "{colors.primaryDark.700}",
        },
      },
    },
    fg: {
      DEFAULT: {
        value: {
          _light: "{colors.textLight.main}",
          _dark: "{colors.textDark.main}",
        },
      },
    },
    accent: {
      DEFAULT: {
        value: {
          _light: "{colors.accentLight.main}",
          _dark: "{colors.accentDark.main}",
        },
      },
      fg: {
        value: {
          _light: "{colors.textDark.main}",
          _dark: "{colors.textLight.main}",
        },
      },
      contrast: {
        value: {
          _light: "{colors.accentDark.main}",
          _dark: "{colors.accentLight.main}",
        },
      },
      subtle: {
        value: {
          _light: "{colors.accentLight.800}",
          _dark: "{colors.accentDark.300}",
        },
      },
      muted: {
        value: {
          _light: "{colors.accentLight.300}",
          _dark: "{colors.accentDark.700}",
        },
      },
      emphasized: {
        value: {
          _light: "{colors.accentLight.500}",
          _dark: "{colors.accentDark.500}",
        },
      },
      solid: {
        value: {
          _light: "{colors.accentLight.300}",
          _dark: "{colors.accentDark.300}",
        },
      },
    },
    primary: {
      DEFAULT: {
        value: {
          _light: "{colors.primaryLight.main}",
          _dark: "{colors.primaryDark.200}",
        },
      },
      fg: {
        value: {
          _light: "{colors.textDark.main}",
          _dark: "{colors.textLight.main}",
        },
      },
      contrast: {
        value: {
          _light: "{colors.primaryDark.main}",
          _dark: "{colors.primaryLight.main}",
        },
      },
      subtle: {
        value: {
          _light: "{colors.primaryLight.600}",
          _dark: "{colors.primaryDark.300}",
        },
      },
      muted: {
        value: {
          _light: "{colors.primaryLight.300}",
          _dark: "{colors.primaryLight.700}",
        },
      },
      emphasized: {
        value: {
          _light: "{colors.primaryLight.500}",
          _dark: "{colors.primaryDark.400}",
        },
      },
      panel: {
        value: {
          _light: "{colors.primaryLight.300}",
          _dark: "{colors.primaryDark.700}",
        },
      },
      solid: {
        value: {
          _light: "{colors.primaryLight.500}",
          _dark: "{colors.primaryDark.500}",
        },
      },
    },
    secondary: {
      DEFAULT: {
        value: {
          _light: "{colors.secondaryLight.main}",
          _dark: "{colors.secondaryDark.main}",
        },
      },
      fg: {
        value: {
          _light: "{colors.textLight.main}",
          _dark: "{colors.textLight.main}",
        },
      },
      contrast: {
        value: {
          _light: "{colors.secondaryDark.main}",
          _dark: "{colors.secondaryLight.main}",
        },
      },
      subtle: {
        value: {
          _light: "{colors.secondaryLight.200}",
          _dark: "{colors.secondaryDark.400}",
        },
      },
      muted: {
        value: {
          _light: "{colors.secondaryLight.300}",
          _dark: "{colors.secondaryLight.700}",
        },
      },
      emphasized: {
        value: {
          _light: "{colors.secondaryLight.500}",
          _dark: "{colors.secondaryDark.500}",
        },
      },
      panel: {
        value: {
          _light: "{colors.secondaryLight.300}",
          _dark: "{colors.secondaryDark.700}",
        },
      },
      solid: {
        value: {
          _light: "{colors.secondaryLight.500}",
          _dark: "{colors.secondaryDark.500}",
        },
      },
    },
  },
});
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
      ...colorTokens,
    },
    recipes: {
      heading: { ...defaultConfig.theme?.recipes?.heading, ...headingRecipe },
    },
    semanticTokens: { ...colorSemanticTokens },
  },
});

const config = mergeConfigs(defaultConfig, theme);
export const system = createSystem(config);
