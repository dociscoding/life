import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import GalleryHeader from "@/components/Headers/Gallery";
import { useAuth } from "@/redux/auth/auth.hooks";
import { useChapters } from "@/redux/chapters/chapters.hooks";
import { Chapter } from "@/redux/chapters/chapters.types";
import ChapterCard from "@/components/Chapter/Card";
import { useRouter } from "expo-router";

const Gallery = () => {
  const { user } = useAuth();
  const { chapters } = useChapters();
  const router = useRouter();

  // #region callbacks

  const callbackOptions = (chapterId: number) => {
    return () => {
      router.push(`/(app)/chapter/${chapterId}`);
    };
  };

  // #endregion

  const renderItem = ({ item }: ListRenderItemInfo<Chapter>) => {
    return (
      <ChapterCard chapter={item} onPress={callbackOptions(item.chapter_id)} />
    );
  };

  return (
    <View style={styles.container}>
      <GalleryHeader
        title={user.name ? user.name.split(" ")[0] : user.username || "user"}
        subtitle={"gallery."}
      />
      <FlatList
        data={chapters}
        renderItem={renderItem}
        contentContainerStyle={styles.contentStyle}
        style={styles.flatList}
      ></FlatList>
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    height: "100%",
    padding: 12,
  },
  contentStyle: {
    gap: 12,
    paddingTop: 150,
    paddingHorizontal: 8,
  },
});
