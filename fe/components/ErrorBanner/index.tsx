import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ErrorIcon from "@/assets/icons/error-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/Themed";
import Colors from "../../constants/Colors";
import { useCallback, useEffect } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GeneralReducerType } from "@/redux/general/general.types";
import { State } from "@/redux/state";
import { setError } from "@/redux/general/general.slice";
import useLanguage from "@/utils/useLanguage";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BannerError = () => {
  const { error } = useSelector((state: RootState) => state.general);
  const dispatch = useDispatch<ThunkDispatch<GeneralReducerType, State, any>>();
  const text: any = useLanguage(["error_banner_header"]);
  const { top } = useSafeAreaInsets();
  const translationY = useSharedValue(-168);
  const scheme = useColorScheme();

  //#region Effects

  useEffect(() => {
    if (error.message) {
      translationY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    }

    const timeout = setTimeout(() => {
      callbackClose();
    }, error.duration);

    if (!error.message) {
      clearInterval(timeout);
    }

    return () => {
      clearInterval(timeout);
    };
  }, [error?.message]);

  //#endregion

  //#region Styles

  const errorContainerStyle = useAnimatedStyle(() => {
    return {
      top: top + 8,
      backgroundColor:
        scheme === "dark"
          ? Colors.dark.background.modal
          : Colors.light.background.modal,
      borderColor:
        scheme === "dark"
          ? Colors.dark.stroke.default
          : Colors.light.stroke.default,
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  }, [error?.message]);

  //#endregion

  //#region Callbacks

  const callbackClose = useCallback(() => {
    dispatch(
      setError({
        message: "",
        duration: 0,
      })
    );
    translationY.value = withTiming(-128, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  //#endregion

  //#region Gestures

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < -50) {
        runOnJS(callbackClose)();
        return;
      } else if (event.translationY > 10) {
        runOnJS(callbackClose)();
        return;
      }
      translationY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -10) {
        runOnJS(callbackClose)();
        return;
      }
    });

  //#endregion

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedPressable
        onPress={callbackClose}
        style={[errorContainerStyle, styles.container]}
      >
        <ErrorIcon color={"red"} />
        <View style={styles.textContainer}>
          <Text style={styles.textHeaderStyle}>{text.error_banner_header}</Text>
          <Text style={styles.textBodyStyle}>{error.message}</Text>
        </View>
      </AnimatedPressable>
    </GestureDetector>
  );
};

export default BannerError;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 0.5,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  textContainer: {
    marginLeft: 16,
  },
  textHeaderStyle: {
    color: "red",
    fontSize: 16,
  },
  textBodyStyle: {
    fontSize: 14,
    marginTop: 2,
  },
});
