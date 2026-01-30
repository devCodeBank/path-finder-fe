import { createTheme } from "@mui/material/styles";
import type { CSSProperties } from "react";

import { colorTokens, typographyTokens, radiusTokens, shadowTokens, zIndexTokens, componentTokens } from "./tokens";

declare module "styled-components" {
  export interface DefaultTheme extends ReturnType<typeof createTheme> {
    tokens: {
      color: typeof colorTokens;
      typography: typeof typographyTokens;
      radius: typeof radiusTokens;
      shadow: typeof shadowTokens;
      zIndex: typeof zIndexTokens;
      component: typeof componentTokens;
    };
  }
}

declare module "@mui/material/styles" {
  interface Theme {
    tokens: {
      color: typeof colorTokens;
      typography: typeof typographyTokens;
      radius: typeof radiusTokens;
      shadow: typeof shadowTokens;
      zIndex: typeof zIndexTokens;
      component: typeof componentTokens;
    };
  }

  interface ThemeOptions {
    tokens?: {
      color: typeof colorTokens;
      typography: typeof typographyTokens;
      radius: typeof radiusTokens;
      shadow: typeof shadowTokens;
      zIndex: typeof zIndexTokens;
      component: typeof componentTokens;
    };
  }

  interface TypographyVariants {
    xs: CSSProperties;
    sm: CSSProperties;
    md: CSSProperties;
    lg: CSSProperties;
  }

  interface TypographyVariantsOptions {
    // xs?: CSSProperties;
    sm?: CSSProperties;
    md?: CSSProperties;
    lg?: CSSProperties;
    xl?: CSSProperties;
  }

  interface Palette {
    purple: {
      main: string;
      dark: string;
      light: string;
    };
    border: {
      primary: string;
      hover: string;
      light: string;
      medium: string;
    };
  }

  interface PaletteOptions {
    purple?: {
      main: string;
      dark: string;
      light: string;
    };
    border?: {
      primary: string;
      hover: string;
      light: string;
      medium: string;
    };
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
  }
}

const theme = createTheme({
  cssVariables: true,
  tokens: {
    color: colorTokens,
    typography: typographyTokens,
    radius: radiusTokens,
    shadow: shadowTokens,
    zIndex: zIndexTokens,
    component: componentTokens,
  },
  palette: {
    primary: {
      main: colorTokens.brand.primary,
      dark: colorTokens.brand.primaryDark,
      light: colorTokens.brand.primaryLight,
    },
    secondary: {
      main: colorTokens.semantic.info,
    },
    purple: {
      main: colorTokens.brand.primary,
      dark: colorTokens.brand.primaryDark,
      light: colorTokens.brand.primaryLight,
    },
    border: {
      primary: colorTokens.border.primary,
      hover: colorTokens.border.primaryHover,
      light: colorTokens.border.light,
      medium: colorTokens.border.medium,
    },
    background: {
      default: colorTokens.background.primary,
      paper: colorTokens.background.primary,
    },
    text: {
      primary: colorTokens.text.primary,
      secondary: colorTokens.text.secondary,
    },
    grey: {
      50: colorTokens.neutral.gray50,
      100: colorTokens.neutral.gray100,
      200: colorTokens.neutral.gray200,
      300: colorTokens.neutral.gray300,
      400: colorTokens.neutral.gray400,
      500: colorTokens.neutral.gray500,
      600: colorTokens.neutral.gray600,
      700: colorTokens.neutral.gray700,
      800: colorTokens.neutral.gray800,
      900: colorTokens.neutral.gray900,
    },
    success: {
      main: colorTokens.semantic.success,
      light: colorTokens.semantic.successLight,
    },
    warning: {
      main: colorTokens.semantic.warning,
      light: colorTokens.semantic.warningLight,
    },
    error: {
      main: colorTokens.semantic.error,
      light: colorTokens.semantic.errorLight,
    },
    info: {
      main: colorTokens.semantic.info,
      light: colorTokens.semantic.infoLight,
    },
  },
  typography: {
    fontFamily: typographyTokens.fontFamily.primary,
    h1: {
      fontSize: typographyTokens.heading.h1, // 26px
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.default,
    },
    h2: {
      fontSize: typographyTokens.heading.h2, // 23px
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.default,
    },
    h3: {
      fontSize: typographyTokens.heading.h3, // 20px
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.default,
    },
    h4: {
      fontSize: typographyTokens.heading.h4, // 18px
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.default,
    },
    h5: {
      fontSize: typographyTokens.heading.h5, // 16px
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.default,
    },
    h6: {
      fontSize: typographyTokens.heading.h6, // 14px
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.default,
    },
    // xs: {
    //   fontSize: typographyTokens.fontSize.xs,
    //   lineHeight: typographyTokens.lineHeight.default,
    //   fontWeight: typographyTokens.fontWeight.normal,
    // },
    sm: {
      fontSize: typographyTokens.fontSize.sm,
      lineHeight: typographyTokens.lineHeight.default,
      fontWeight: typographyTokens.fontWeight.normal,
    },
    md: {
      fontSize: typographyTokens.fontSize.md,
      lineHeight: typographyTokens.lineHeight.default,
      fontWeight: typographyTokens.fontWeight.normal,
    },
    lg: {
      fontSize: typographyTokens.fontSize.lg,
      lineHeight: typographyTokens.lineHeight.default,
      fontWeight: typographyTokens.fontWeight.normal,
    },
    xl: {
      fontSize: typographyTokens.fontSize.xl,
      lineHeight: typographyTokens.lineHeight.default,
      fontWeight: typographyTokens.fontWeight.normal,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        },
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          fontFamily: typographyTokens.fontFamily.primary,
          lineHeight: typographyTokens.lineHeight.default,
        },
        "#root": {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        // Map custom variants to block-level elements so vertical margin/padding works
        variantMapping: {
          lg: "p",
          md: "p",
          sm: "p",
          // Keep xs as span since it's often inline
          xs: "span",
        },
      },
      styleOverrides: {
        root: {
          // Remove default margins - we'll handle spacing explicitly
          margin: 0,
        },
        // Remove gutterBottom margin
        gutterBottom: {
          marginBottom: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: radiusTokens.md,
            height: componentTokens.input.height,
            "& fieldset": {
              borderColor: colorTokens.border.primary,
              borderWidth: componentTokens.input.borderWidth,
            },
            "&:hover fieldset": {
              borderColor: colorTokens.border.primaryHover,
            },
            "&.Mui-focused fieldset": {
              borderColor: colorTokens.border.focus,
              borderWidth: componentTokens.input.focusBorderWidth,
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 400,
          },
          "& .MuiInputLabel-root": {
            color: colorTokens.text.secondary,
            "&.Mui-focused": {
              color: colorTokens.brand.primary,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          height: componentTokens.input.height,
        },
        select: {
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          fontSize: "13px",
          fontWeight: 400,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            height: componentTokens.input.height,
            "& .MuiSelect-select": {
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radiusTokens.md,
          textTransform: "none",
          fontWeight: typographyTokens.fontWeight.semibold,
          padding: "8px 12px",
          fontSize: "12px",
          lineHeight: "120%",
          height: componentTokens.button.height.md,
          boxShadow: shadowTokens.sm,
          transition: `all 200ms ease-in-out`,
          "&:hover": {
            boxShadow: shadowTokens.md,
          },
          "&:active": {
            boxShadow: shadowTokens.sm,
          },
        },
        startIcon: {
          marginRight: "18px",
          marginLeft: "0px",
        },
        endIcon: {
          marginLeft: "18px",
          marginRight: "0px",
        },
        sizeSmall: {
          height: componentTokens.button.height.sm,
          padding: "8px 12px",
          fontSize: "12px",
          lineHeight: "120%",
        },
        sizeLarge: {
          height: componentTokens.button.height.lg,
          padding: "8px 12px",
          fontSize: "12px",
          lineHeight: "120%",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radiusTokens.lg,
          boxShadow: shadowTokens.sm,
          border: `1px solid ${colorTokens.border.light}`,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          zIndex: zIndexTokens.popover,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          zIndex: zIndexTokens.popover,
        },
        paper: {
          borderRadius: radiusTokens.md,
          boxShadow: shadowTokens.lg,
          border: `1px solid ${colorTokens.border.light}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#6E41E2",
          color: "#FFFFFF",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "16px",
          padding: "8px 12px",
          boxShadow: "none",
        },
        arrow: {
          color: "#6E41E2",
        },
      },
    },
  },
});

export default theme;
