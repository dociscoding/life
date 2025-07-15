import { StyleSheet, View, Pressable, Keyboard } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/redux/auth/auth.hooks";
import HomeHeader from "@/components/Headers/Home";
import BottomBar from "@/components/BottomBar";
import Slider from "@/components/Post/Slider";
import { useDispatch } from "react-redux";
import { useFetchPosts } from "@/redux/post/post.hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFetchComments } from "@/redux/comments/comments.hooks";
import {
  useChapters,
  useSelectedChapter,
} from "@/redux/chapters/chapters.hooks";
import { setSelectedChapter } from "@/redux/chapters/chapters.actions";
import HomeChapter from "@/components/HomeChapter";
import PostComment from "@/components/Comment";
import CommentBlur from "@/components/Comment/Blur";
import CommentExpanded from "@/components/Comment/Expanded";
import Details from "@/components/PostDetails";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Post } from "@/redux/post/post.types";

const loadingPost: Post = {
  post_id: -1,
  chapter_id: -1,
  user_id: -1,
  image_name: "",
  image_url: "",
  location: "",
  created_at: "",
  updated_at: "",
};

const Home = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { chapters } = useChapters() || { chapters: [] }; // Ensure chapters is not undefined
  const selectedChapter = useSelectedChapter();
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [centeredIndex, setCenteredIndex] = useState(0);

  const {
    posts: fetchedPosts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useFetchPosts(selectedChapter?.chapter_id || 0);
  const { status: postsStatus } = useSelector((state: RootState) => state.post);

  const posts = useMemo(() => fetchedPosts, [fetchedPosts]);
  const memoizedChapters = useMemo(() => chapters, [chapters]);

  const {
    comments: fetchedComments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useFetchComments(
    posts.length > 0 && centeredIndex < posts.length
      ? posts[centeredIndex]?.post_id
      : 0
  );

  const comments = useMemo(() => fetchedComments, [fetchedComments]);

  // Set selected chapter if none is selected
  useEffect(() => {
    if (!selectedChapter && memoizedChapters.length > 0) {
      dispatch(setSelectedChapter(memoizedChapters[0]));
    }
  }, [selectedChapter, memoizedChapters, dispatch]);

  // Handle keyboard and comment dismiss
  const callbackDismissComment = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  //#region styles

  const detailsStyle = useAnimatedStyle(() => {
    return {
      opacity: commentExpanded
        ? withTiming(1, { duration: 200 })
        : withTiming(0, { duration: 200 }),
    };
  });

  //#endregion

  return (
    <SafeAreaView style={styles.container}>
      <HomeChapter
        chapters={memoizedChapters}
        selectedChapter={selectedChapter || undefined}
      />
      {commentExpanded && (
        <Pressable style={styles.dismisser} onPress={callbackDismissComment} />
      )}
      <HomeHeader
        title={user.name ? user.name.split(" ")[0] : user.username || "user"}
        subtitle={"chapters."}
      />
      {commentExpanded && posts && (
        <Animated.View style={[styles.detailsContainer, detailsStyle]}>
          <Details post={posts[0]} size="small" />
        </Animated.View>
      )}
      <CommentBlur
        expanded={commentExpanded}
        setExpanded={setCommentExpanded}
      />
      <View style={styles.sliderContainer}>
        {!commentExpanded ? (
          <Slider
            isLoading={postsLoading}
            posts={[
              ...(postsStatus === "loading" ? [loadingPost] : []),
              ...posts,
            ]}
            centeredIndex={centeredIndex}
            setCenteredIndex={setCenteredIndex}
          />
        ) : (
          <Pressable
            style={styles.detailsPadding}
            onPress={callbackDismissComment}
          >
            {posts && posts.length > 0 && (
              <CommentExpanded
                expanded={commentExpanded}
                setExpanded={setCommentExpanded}
                selectedPost={posts[centeredIndex]}
                detailed={false}
              />
            )}
          </Pressable>
        )}
      </View>
      {posts && posts.length > 0 ? (
        <PostComment
          comms={comments || null}
          expanded={commentExpanded}
          setExpanded={setCommentExpanded}
          detailed={false}
        />
      ) : (
        <View style={styles.commentPlaceholder} />
      )}
      <View style={styles.padding}></View>
      <BottomBar />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  padding: {
    flex: 1,
  },
  detailsContainer: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  detailsPadding: {
    flex: 1,
    justifyContent: "center",
  },
  dismisser: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  sliderContainer: {
    flex: 2,
    marginTop: "10%",
    justifyContent: "center",
  },
  commentPlaceholder: {
    padding: 4,
    marginTop: "25%",
  },
});
