import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
} from "react-native";
import React, { useCallback } from "react";
import Button from "../Styled/Button";
import Gallery from "@/assets/icons/gallery.svg";
import Share from "@/assets/icons/share.svg";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

const BottomBar = () => {
  const theme = useColorScheme();
  const router = useRouter();

  //#region Callbacks

  const callbackCreate = useCallback(() => {
    router.push("/create");
  }, [router]);

  const callbackNavigateToGallery = useCallback(() => {
    router.push("/gallery");
  }, [router]);

  const callbackShare = useCallback(() => {
    console.log("Share");
  }, [router]);

  //#endregion

  return (
    <View style={styles.container}>
      <Pressable onPress={callbackNavigateToGallery} style={styles.button}>
        <Gallery
          width={24}
          height={24}
          color={theme === "dark" ? Colors.dark.tint : Colors.light.tint}
        />
      </Pressable>
      <Button text="create" onPress={callbackCreate} />
      <Pressable onPress={callbackShare} style={styles.button}>
        <Share
          width={24}
          height={24}
          color={theme === "dark" ? Colors.dark.tint : Colors.light.tint}
        />
      </Pressable>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  button: {
    padding: 12,
  },
});
