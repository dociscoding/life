import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import Subtitle from "@/components/CreateChapter/Subtitle";
import Header from "@/components/CreateChapter/Header";
import Colors from "@/constants/Colors";
import { TextInput } from "@/components/Themed";
import Tick from "@/assets/icons/tick.svg";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Chapter } from "@/redux/chapters/chapters.types";
import { useCreateChapter } from "@/redux/chapters/chapters.hooks";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/post/post.slice";
import { setSelectedChapter } from "@/redux/chapters/chapters.actions";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GeneralReducerType } from "@/redux/general/general.types";
import { State } from "@/redux/state";
import { setError } from "@/redux/general/general.slice";
import useLanguage from "@/utils/useLanguage";
import BannerError from "@/components/ErrorBanner";

const CreateChapterScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const { createChapter } = useCreateChapter();
  const dispatch = useDispatch<ThunkDispatch<GeneralReducerType, State, any>>();

  const callbackNextPage = useCallback(async () => {
    if (title.length > 0) {
      try {
        dispatch(setPosts([]));
        router.replace("/(app)/home");
        const newChapter = await createChapter({
          title: title,
          description: subtitle,
        });
        dispatch(setSelectedChapter(newChapter as Chapter));
      } catch (error) {
        dispatch(
          setError({
            // @ts-ignore
            message: error.message,
            duration: 4000,
          })
        );
      }
    } else {
      dispatch(
        setError({
          message: "Title is required",
          duration: 4000,
        })
      );
    }
  }, [title, subtitle, createChapter, dispatch, router]);

  const containerStyle = useMemo(() => {
    return {
      backgroundColor:
        scheme === "dark"
          ? Colors.dark.background.modal
          : Colors.light.background.modal,
    };
  }, [scheme]);

  const iconContainer = useAnimatedStyle(() => {
    return {
      padding: 8,
      borderRadius: 100,
      backgroundColor:
        scheme === "dark"
          ? Colors.dark.background.secondary
          : Colors.light.background.secondary,
      borderWidth: 1,
      borderColor: Colors.light.orange,
      shadowColor: Colors.light.orange,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowBlur: 10,
      shadowOpacity: 2,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Header />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          <View style={styles.shit}>
            <Subtitle active={title.length > 0} />
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholder="title"
              cursorColor={
                scheme === "dark"
                  ? Colors.dark.text.primary
                  : Colors.light.text.primary
              }
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              textAlign="center"
            />
            <TextInput
              autoCapitalize="none"
              style={styles.subtitleInput}
              placeholder="subtitle"
              cursorColor={
                scheme === "dark"
                  ? Colors.dark.text.primary
                  : Colors.light.text.primary
              }
              value={subtitle}
              onChangeText={(text) => {
                setSubtitle(text);
              }}
              textAlign="center"
            />
          </View>
          <Pressable onPress={callbackNextPage}>
            <Animated.View style={[iconContainer]}>
              <Tick width={24} height={24} color={Colors.light.orange} />
            </Animated.View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
      <BannerError />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 100,
    marginTop: -100,
  },
  input: {
    fontSize: 28,
    fontWeight: "600",
    height: 40,
    width: "100%",
  },
  shit: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  subtitleInput: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CreateChapterScreen;
