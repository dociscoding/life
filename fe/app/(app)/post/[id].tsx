import { StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
import React, { useState, useCallback, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetPostById } from "@/redux/post/post.hooks";
import { useFetchComments } from "@/redux/comments/comments.hooks";
import PostHeader from "@/components/Headers/Post";
import { useAuth } from "@/redux/auth/auth.hooks";
import DetailsFooter from "@/components/PostDetails/Footer";
import DeletionConfirmation from "@/components/PostDetails/DeletionConfirmation";
import { useRouter } from "expo-router";
import { useDeletePost } from "@/redux/post/post.hooks";
import Details from "@/components/PostDetails";
import PostComment from "@/components/Comment";
import CommentExpanded from "@/components/Comment/Expanded";
import DetailsBlur from "@/components/PostDetails/Blur";

const PostDetails = () => {
  const { id } = useLocalSearchParams();
  const { post, error, isLoading } = useGetPostById(Number(id));
  const { user } = useAuth();
  //state to check if deletion confirmation is expanded
  const [expanded, setExpanded] = useState(false);
  const { deletePost } = useDeletePost();
  const router = useRouter();
  const [commentExpanded, setCommentExpanded] = useState(false);
  const { comments } = useFetchComments(Number(id));

  //#region callbacks

  const callbackConfirmDelete = useCallback(() => {
    deletePost(Number(id));
    router.push(`/(app)/home`);
    setExpanded(false);
  }, []);

  const callbackCancelDelete = useCallback(() => {
    setExpanded(false);
  }, []);

  //#endregion

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DeletionConfirmation
        expanded={expanded}
        onConfirm={callbackConfirmDelete}
        onCancel={callbackCancelDelete}
      />
      <Details post={post.post} size={commentExpanded ? "small" : "large"} />
      <PostHeader
        title={user.name ? user.name.split(" ")[0] : user.username || "user"}
        subtitle={"posts."}
      />
      <DetailsBlur
        expanded={commentExpanded}
        setExpanded={setCommentExpanded}
      />
      <DetailsFooter
        deletionConfirmationExpanded={expanded}
        setDeletionConfirmationExpanded={setExpanded}
      />
      {post && comments && (
        <PostComment
          comms={comments || null}
          expanded={commentExpanded}
          setExpanded={setCommentExpanded}
          detailed={true}
        />
      )}
      {post && comments && commentExpanded && (
        <CommentExpanded
          expanded={commentExpanded}
          setExpanded={setCommentExpanded}
          selectedPost={post.post}
          detailed={true}
        />
      )}
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
