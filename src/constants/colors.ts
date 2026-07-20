/**
 * Design tokens — keep in sync with `tailwind.config.js` theme.extend.colors.
 */
export const colors = {
  primary: "#0466C8",
  BrandColor: "#004B55",
  darkPrimary: "#0252A1",
  lightPrimary: "#1379DF",
  disabledText: "#999999",
  brightGold: "#F8D41C",
  mohajerGold: "#C89D04",
  mohajerRed: "#C80404",
  mohajerGreen: "#25BD18",
  blackText: "#28262E",
  spetial: "#20C997",
  lightBlueBg: "#EFF7FF",
  bgColor: "#F9F9F9",
  darkerBgColor: "#F5F5F5",
  blueStrokeColor: "#B4CEE7",
  strokeColor: "#E9E9E9",
  lightStroke: "#F7F7F7",
  lightGold: "#FFF9E5",
  goldStroke: "#FFEEB2",
  lightRed: "#FFEFEF",
  hoverRedBg: "#FFE8E8",
  darkerRedBg: "#FAD5D5",
  lightGreen: "#DBFCDE",
  white: "#FFFFFF",
  // Home / catalog tokens (from Figma "Melu app ui")
  secondaryOrange: "#ED6E33",
  orange100: "#FBE2D6",
  slate500: "#64748B",
  gray50: "#F6F6F6",
  labelSecondary: "rgba(60, 60, 67, 0.6)",
} as const;

export type AppColor = keyof typeof colors;
