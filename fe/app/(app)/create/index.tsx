import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  useCameraDevice,
  Camera,
  useCameraPermission,
  useLocationPermission,
  PhotoFile,
  useCameraFormat,
  CameraPosition,
} from "react-native-vision-camera";
import Permissions from "@/components/Create/Permissions";
import NoCamera from "@/components/Create/NoCamera";
import { useIsFocused } from "@react-navigation/native";
import { useAppState } from "@react-native-community/hooks";
import Controls from "@/components/Create/Controls";
import * as ImagePicker from "expo-image-picker";
import BottomBar from "@/components/Create/BottomBar";

import { useSelectedChapter } from "@/redux/chapters/chapters.hooks";
import { useCreatePost } from "@/redux/post/post.hooks";

import Colors from "@/constants/Colors";

const Create = () => {
  const router = useRouter();
  const camera = useRef<Camera>(null);
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const [cam, setCam] = useState<CameraPosition>("back");
  const device = useCameraDevice(cam);
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: hasLocationPermission,
    requestPermission: requestLocationPermission,
  } = useLocationPermission();
  const selectedChapter = useSelectedChapter();
  const { createPost } = useCreatePost();

  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active";

  useEffect(() => {
    if (isActive) {
      requestPermission();
      requestLocationPermission();
    }
  }, [isActive]);

  //#region Controls

  const navigateHome = useCallback(() => {
    router.replace("/(app)/home");
  }, []);

  const toggleFlash = useCallback(() => {
    switch (flash) {
      case "off":
        setFlash("on");
        break;
      case "on":
        setFlash("auto");
        break;
      case "auto":
        setFlash("off");
        break;
    }
  }, [flash, setFlash]);

  const toggleCamera = useCallback(() => {
    setCam(cam === "back" ? "front" : "back");
  }, [cam, setCam]);

  //#endregion

  //#region Camera

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [3, 4],
      quality: 0.5,
      exif: true,
    });

    if (!result.canceled) {
      sendPicture(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const pic = await camera.current?.takePhoto({ flash });
    if (!pic) {
      console.error("Failed to take photo");
      return;
    } else {
      sendPicture(pic.path);
    }
  };

  const sendPicture = async (uri: string) => {
    if (selectedChapter) {
      const result = await fetch(uri);
      const blob = await result.blob();
      if (blob.size === 0) {
        console.error("Blob is empty");
        return;
      }

      const formData = new FormData();
      //@ts-ignore
      formData.append("image", {
        uri: uri,
        type: blob.type,
        name: uri.split("/").pop(),
      });
      formData.append("chapterId", String(selectedChapter.chapter_id));

      try {
        navigateHome();
        await createPost(formData);
      } catch (error) {
        console.error("Failed to create post", error);
      }
    } else {
      alert("No chapter selected");
    }
  };

  const format = useCameraFormat(device, [
    { photoResolution: { width: 1536, height: 2048 } },
  ]);

  //#endregion

  if (!device) return <NoCamera />;
  if (!hasPermission) return <Permissions />;
  return (
    <View style={styles.container}>
      <Controls
        flash={flash}
        toggleFlash={toggleFlash}
        toggleCamera={toggleCamera}
        navigateHome={navigateHome}
      />
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
        video={false}
        audio={false}
        format={format}
        photoQualityBalance="balanced"
        enableLocation={hasLocationPermission}
      />
      <BottomBar takePicture={takePicture} openGallery={pickImage} />
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.primary,
  },
});
