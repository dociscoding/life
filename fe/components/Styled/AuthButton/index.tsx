import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

interface ButtonProps extends PressableProps {
  text: string;
}

const AuthButton = (props: ButtonProps) => {
  return (
    <Pressable {...props} style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  text: {
    color: Colors.light.orange,
    fontSize: 18,
    textAlign: "center",
  },
});
