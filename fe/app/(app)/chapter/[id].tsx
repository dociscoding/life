import { StyleSheet, Text, View } from "react-native";
import React, { useState, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/redux/auth/auth.hooks";
import { useChapter } from "@/redux/chapters/chapters.hooks";
import ChapterHeader from "@/components/Headers/Chapter";
import Subtitle from "@/components/HomeChapter/Subtitle";
import DetailsFooter from "@/components/ChapterDetails/Footer";
import Gallery from "@/components/ChapterDetails/Gallery";
import { useFetchPosts } from "@/redux/post/post.hooks";

const ChapterDetails = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { chapter, error, isLoading } = useChapter(Number(id));
  const {
    posts: fetchedPosts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useFetchPosts(Number(id));
  const [deletionConfirmationExpanded, setDeletionConfirmationExpanded] =
    useState(false);

  const posts = useMemo(() => fetchedPosts.toReversed(), [fetchedPosts]);

  return (
    <View style={styles.container}>
      <ChapterHeader
        title={chapter?.title ? chapter.title : user.username || "user"}
        subtitle={"gallery."}
      />
      <Gallery posts={posts} />
      <DetailsFooter
        deletionConfirmationExpanded={deletionConfirmationExpanded}
        setDeletionConfirmationExpanded={setDeletionConfirmationExpanded}
      />
    </View>
  );
};

export default ChapterDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    textAlign: "center",
  },
});
