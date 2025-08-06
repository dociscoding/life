import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  TouchableWithoutFeedback as DefaultTouchableWithoutFeedback,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type TouchableWithoutFeedbackProps = ThemeProps &
  DefaultTouchableWithoutFeedback["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string,
  nestedKey?: string
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (nestedKey) {
    // @ts-ignore
    return Colors[theme][colorName][nestedKey];
  } else {
    // @ts-ignore
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
    "primary"
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
    "primary"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
    "primary"
  );

  const placeholderTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
    "secondary"
  );

  return (
    <DefaultTextInput
      style={[{ color }, style]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
}

export function TouchableWithoutFeedback(props: TouchableWithoutFeedbackProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
    "secondary"
  );

  return (
    <DefaultTouchableWithoutFeedback
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
