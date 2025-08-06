import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/auth/auth.side";
import { useDispatch } from "react-redux";
import ErrorBanner from "@/components/ErrorBanner";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import {
  useLazyRefreshTokenQuery,
  useLazyTokenAuthQuery,
} from "../redux/auth/api/auth.api";
import { useAuth, useToken } from "../redux/auth/auth.hooks";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/(app)/home",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Root() {
  const router = useRouter();
  useToken();
  const dispatch: AppDispatch = useDispatch();

  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.otf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const { user, accessToken, refreshToken } = useAuth();
  const [
    triggerAccessTokenQuery,
    { error: accessTokenQueryError, isLoading: isAccessTokenQueryLoading },
  ] = useLazyTokenAuthQuery();
  const [triggerRefreshTokenQuery] = useLazyRefreshTokenQuery();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (accessToken) {
        try {
          await triggerAccessTokenQuery(accessToken).unwrap();
          setIsDataLoaded(true);
        } catch (error) {
          if (refreshToken) {
            try {
              await triggerRefreshTokenQuery({ refreshToken }).unwrap();
              setIsDataLoaded(true);
            } catch (refreshError) {
              console.error("Failed to refresh token:", refreshError);
              dispatch(logout());
              router?.replace("/(auth)/login");
            }
          } else {
            router?.replace("/(auth)/login");
          }
        }
      } else {
        setIsDataLoaded(true);
      }
    };

    if (loaded) {
      loadUserData();
    }
  }, [accessToken, refreshToken, loaded]);

  useEffect(() => {
    if (isDataLoaded && loaded) {
      if (user?.username) {
        console.log("User is logged in");
        router?.replace("/(app)/home");
      } else {
        router?.replace("/(auth)/login");
      }
      setTimeout(() => {
        SplashScreen?.hideAsync();
      }, 600);
    }
  }, [isDataLoaded, loaded, user]);

  if (!loaded || !isDataLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <KeyboardProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Root />
            <ErrorBanner />
          </ThemeProvider>
        </KeyboardProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
