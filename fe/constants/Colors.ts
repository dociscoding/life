export type ColorScheme = {
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  background: {
    primary: string;
    secondary: string;
  };
  tint: string;
  orange: string;
};

type ColorsType = {
  light: ColorScheme;
  dark: ColorScheme;
};

const tintColorLight = "#000";
const tintColorDark = "#fff";

export default {
  light: {
    text: {
      primary: "#000",
      secondary: "#898989",
      tertiary: "#00000050",
    },
    background: {
      primary: "#fff",
      secondary: "#EAEAEA",
      tertiary: "#E5E5E5",
      modal: "#f6f6f6",
    },
    stroke: {
      default: "#E5E5E5",
      correct: "#58CE2E50",
      wrong: "#F3464650",
    },
    tint: tintColorLight,
    orange: "#FF4F00",
    red: "#F34646",
  },
  dark: {
    text: {
      primary: "#fff",
      secondary: "#898989",
      tertiary: "#FFFFFF50",
    },
    background: {
      primary: "#000",
      secondary: "#242424",
      tertiary: "#181818",
      modal: "#090909",
    },
    stroke: {
      default: "#1A1A1A",
      correct: "#58CE2E50",
      wrong: "#F3464650",
    },
    tint: tintColorDark,
    orange: "#FF4F00",
    red: "#F34646",
  },
};
