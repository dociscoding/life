import React from "react";
import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="post" options={{ headerShown: false }} />
      <Stack.Screen name="gallery" options={{ headerShown: false }} />
      <Stack.Screen name="chapter" options={{ headerShown: false }} />
      <Stack.Screen
        name="createchapter"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profilemodal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
