import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback } from "react";
import { TouchableWithoutFeedback } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "react-native";

interface ButtonProps extends PressableProps {
  text: string;
}

const Button = (props: ButtonProps) => {
  const theme = useColorScheme();
  const [pressing, setPressing] = React.useState(false);

  const callbackSetPressIn = useCallback(() => {
    setPressing(true);
  }, []);
  const callbackSetPressOut = useCallback(() => {
    setPressing(false);
  }, []);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        theme === "dark"
          ? pressing
            ? withTiming(Colors.dark.background.tertiary, { duration: 100 })
            : withTiming(Colors.dark.background.secondary, { duration: 100 })
          : pressing
          ? withTiming(Colors.light.background.tertiary, { duration: 100 })
          : withTiming(Colors.light.background.secondary, { duration: 100 }),
    };
  });

  return (
    <Pressable
      {...props}
      onPressIn={callbackSetPressIn}
      onPressOut={callbackSetPressOut}
    >
      <Animated.View style={[buttonStyle, styles.container]}>
        <Text style={styles.text}>{props.text}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  text: {
    fontWeight: "semibold",
    fontSize: 20,
    color: Colors.dark.orange,
  },
});
