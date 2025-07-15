import {
  StyleSheet,
  Text,
  View,
  TextInputProps,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { TextInput } from "../Themed";

interface InputProps extends TextInputProps {}

const StyledInput = (props: InputProps) => {
  const [focused, setFocused] = useState(false);
  const theme = useColorScheme();

  return (
    <View>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={
          focused
            ? theme === "dark"
              ? Colors.dark.text.primary
              : Colors.light.text.primary
            : theme === "dark"
            ? Colors.dark.text.secondary
            : Colors.light.text.secondary
        }
      />
    </View>
  );
};

export default StyledInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
  },
});
