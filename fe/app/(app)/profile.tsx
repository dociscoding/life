import { StyleSheet, View, SafeAreaView } from "react-native";
import { Text } from "@/components/Themed";
import React, { useMemo } from "react";
import ProfileHeader from "@/components/Headers/Profile";
import { useAuth } from "@/redux/auth/auth.hooks";
import UserShit from "@/components/Profile/UserShit";
import ProfileBanner from "@/components/Profile/Banner";
import ProfileFooter from "@/components/Profile/Footer";
import FloatingPosts from "@/components/FloatingPosts";

const Profile = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ProfileHeader
        title={user.name ? user.name.split(" ")[0] : user.username || "user"}
        subtitle="profile."
      />
      <ProfileBanner />
      <UserShit
        pfp={user.avatar}
        name={user.name ? user.name.split(" ")[0] : user.username || "user"}
        bio={user.bio}
      />
      <FloatingPosts />
      <ProfileFooter date={user.created_at} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
