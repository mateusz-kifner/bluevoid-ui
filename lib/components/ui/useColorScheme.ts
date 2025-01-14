"use client";

export const colorSchemes = [
  "default",
  "stone",
  "red",
  "pink",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet",
] as const;

type ColorSchemeType = (typeof colorSchemes)[number];

export default function useColorScheme(
  defaultValue: ColorSchemeType = "default",
) {
  if (typeof window !== "undefined") {
    const colorScheme = localStorage.getItem("color-scheme") ?? defaultValue;
    if (
      colorScheme !== null &&
      colorSchemes.includes(colorScheme as any) &&
      document.documentElement?.getAttribute("data-color-scheme") !==
        colorScheme
    ) {
      document.documentElement?.setAttribute("data-color-scheme", colorScheme);
    }
    const setColorScheme = (value: ColorSchemeType) => {
      document.documentElement?.setAttribute("data-color-scheme", value);
      localStorage.setItem("color-scheme", value);
    };
    return {
      colorScheme: colorScheme as ColorSchemeType,
      setColorScheme,
    };
  }

  return {
    colorScheme: undefined,
    setColorScheme: undefined,
  };
}
