export const colorTokens = {
  brand: {
    primary: "#6E41E2",
    primaryDark: "#5B21B6",
    primaryLight: "#A78BFA",
    primaryHover: "#9A77F0",
    primaryPressed: "#5231B5",
    primaryFocus: "#7C3AED",
  },

  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray150: "#666666",
    gray200: "#E5E7EB",
    gray250: "#757575",
    gray300: "#D1D5DB",
    gray350: "#797979",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    gray850: "#444444",
    gray900: "#111827",
    gray950: "#222222",
  },

  semantic: {
    success: "#35C128",
    successLight: "#9AE093",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    info: "#3B82F6",
    infoLight: "#DBEAFE",
  },

  border: {
    primary: "#6E41E280", // Primary @ 50% opacity
    primaryHover: "#6E41E2E6", // Primary @ 90% opacity
    light: "#E5E7EB80",
    medium: "#D1D5DB80",
    mediumLight: "#CCCCCC80",
    dark: "#9CA3AF80",
    focus: "#7C3AED",
  },

  text: {
    primary: "#333333",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    muted: "#777777",
    inverse: "#FFFFFF",
    placeholder: "#33333366",
    disabled: "#D1D5DB",
    link: "#6E41E2",
    linkHover: "#5B21B6",
  },

  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F3F4F6",
    inverse: "#111827",
    overlay: "#00000080",
    disabled: "#F3F4F6",
    autofill: "#5231B50F", // 6% opacity of #5231B5
    disabledLight: "#CCCCCC26",
  },

  overlay: {
    whiteLight: "rgba(255, 255, 255, 0.15)",
    whiteMedium: "rgba(255, 255, 255, 0.2)",
    whiteSemi: "rgba(255, 255, 255, 0.3)",
    whiteStrong: "rgba(255, 255, 255, 0.4)",
    whiteHeavy: "rgba(255, 255, 255, 0.8)",
    blackLight: "rgba(0, 0, 0, 0.1)",
    brandLight: "#5231B508", // #5231B5 @ 3% opacity
    grayLight: "#CCCCCC4D", // #CCC @ 30% opacity
    transparent: "transparent",
  },
} as const;

// Typography Tokens
export const typographyTokens = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'JetBrains Mono', 'Monaco', 'Consolas', monospace",
  },
  fontSize: {
    // xs: "0.625rem", // 10px
    sm: "0.75rem", // 12px
    md: "0.875rem", // 14px
    lg: "1rem", // 16px
    xl: "1.125rem", // 18px
    // "2xl": "1.25rem", // 20px
    // "3xl": "1.5rem", // 24px
    // "4xl": "1.875rem", // 30px
    // "5xl": "2.25rem", // 36px
    // "6xl": "3rem", // 48px
  },
  heading: {
    h1: "1.625rem", // 26px
    h2: "1.4375rem", // 23px
    h3: "1.25rem", // 20px
    h4: "1.125rem", // 18px
    h5: "1rem", // 16px
    h6: "0.875rem", // 14px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    default: 1.2,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.6,
    loose: 2,
  },
} as const;

export const radiusTokens = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

export const shadowTokens = {
  none: "none",
  sm: "0 1px 1px 0 rgba(0,0,0,.3),0 1px 2px 0 rgba(0,0,0,.15)",
  md: "0 1px 2px 0 rgba(0,0,0,.3),0 1px 3px 1px rgba(0,0,0,.15)",
  lg: "0 2px 4px 0 rgba(0,0,0,.3),0 4px 8px 2px rgba(0,0,0,.15)",
  xl: "0 4px 8px 0 rgba(0,0,0,.3),0 8px 16px 4px rgba(0,0,0,.15)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  focus: "0 0 0 3px rgba(110, 65, 226, 0.1)",
} as const;

export const zIndexTokens = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  sidebar: 1040,
  navbar: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  toast: 1090,
} as const;

export const breakpointTokens = {
  xs: "0px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
} as const;

export const transitionTokens = {
  fast: "150ms ease",
  normal: "300ms ease",
  slow: "500ms ease",
  bouncy: "300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

export const componentTokens = {
  button: {
    height: {
      sm: "40px",
      md: "44px",
      lg: "48px",
    },
  },
  input: {
    height: "56px",
    borderWidth: "1px",
    focusBorderWidth: "2px",
  },
  sidebar: {
    width: {
      collapsed: "68px",
      expanded: "240px",
    },
  },
  topNav: {
    height: "64px",
  },
  tooltip: {
    backgroundColor: "#6E41E2",
  },
} as const;

export const tokens = {
  color: colorTokens,
  typography: typographyTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  zIndex: zIndexTokens,
  breakpoint: breakpointTokens,
  transition: transitionTokens,
  component: componentTokens,
} as const;

export type ColorTokens = typeof colorTokens;
export type TypographyTokens = typeof typographyTokens;
export type RadiusTokens = typeof radiusTokens;
export type ShadowTokens = typeof shadowTokens;
export type ZIndexTokens = typeof zIndexTokens;
export type BreakpointTokens = typeof breakpointTokens;
export type TransitionTokens = typeof transitionTokens;
export type ComponentTokens = typeof componentTokens;
export type DesignTokens = typeof tokens;
