/**
 * Font family names — must match the keys registered in `useFonts`
 * (see `src/app/_layout.tsx`).
 */
export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
  light: "Poppins-Light",
} as const;

export type AppFont = (typeof fonts)[keyof typeof fonts];
