import React from "react";
import { Stack } from "expo-router";

const CreateChapterLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="friends" />
    </Stack>
  );
};

export default CreateChapterLayout;
