import { StyleSheet, View, Pressable } from "react-native";
import { Text } from "@/components/Themed";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";

interface FooterProps {
  text: string;
  subtext: string;
  link: string;
}

const AuthFooter = (props: FooterProps) => {
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    // @ts-ignore
    router.push(props.link);
  }, [router, props.link, props.text, props.subtext]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
      <Pressable onPress={handleRedirect} style={styles.pressable}>
        <Text style={styles.subtext}>{props.subtext}</Text>
      </Pressable>
    </View>
  );
};

export default AuthFooter;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "medium",
  },
  subtext: {
    fontSize: 16,
    fontWeight: "medium",
    opacity: 0.5,
  },
  pressable: {
    padding: 4,
  },
});
