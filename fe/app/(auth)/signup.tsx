import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "@/components/Themed";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StyledInput from "@/components/Styled/input";
import AuthHeader from "@/components/AuthLayout/Header";
import AuthFooter from "@/components/AuthLayout/Footer";
import AuthButton from "@/components/Styled/AuthButton";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useSignupMutation } from "@/redux/auth/api/auth.api";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GeneralReducerType } from "@/redux/general/general.types";
import { State } from "@/redux/state";
import { setError } from "@/redux/general/general.slice";
import useLanguage from "@/utils/useLanguage";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState("");

  // useful if we want to handle separate error messages for each field
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [trigger, { isLoading, error, data }] = useSignupMutation();
  const dispatch = useDispatch<ThunkDispatch<GeneralReducerType, State, any>>();

  const text: any = useLanguage([
    "missing_fields_login_error",
    "mail_not_correct",
    "dont_have_an_account",
    "create_one",
    "incorrect_credentials",
  ]);

  const router = useRouter();

  //Region Signup

  const isEmailValid = useCallback(
    (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailRegex.test(email);
    },
    [email]
  );

  const handleSignup = useCallback(async () => {
    if (!email || !password || !confirm || !username) {
      !email && setEmailError(true);
      !password && setPasswordError(true);
      !confirm && setConfirmPasswordError(true);
      !username && setUsernameError(true);

      dispatch(
        setError({
          message: text.missing_fields_login_error,
          duration: 4000,
        })
      );

      return;
    }
    if (!isEmailValid(email)) {
      !email && setEmailError(true);

      dispatch(
        setError({
          message: text.mail_not_correct,
          duration: 4000,
        })
      );

      return;
    }
    if (password !== confirm) {
      setConfirmPasswordError(true);

      dispatch(
        setError({
          message: text.passwords_dont_match,
          duration: 4000,
        })
      );

      return;
    }
    if (password.length < 8) {
      setPasswordError(true);
      setConfirmPasswordError(true);

      dispatch(
        setError({
          message: text.password_too_short,
          duration: 4000,
        })
      );

      return;
    }

    try {
      const response = await trigger({
        email,
        password,
        username,
      }).unwrap();
      if (response.ok) {
        setEmail("");
        setPassword("");
        setConfirm("");
        setUsername("");
        //layout handles redirect
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }, [email, password, confirm, username, isEmailValid, trigger, router]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <AuthHeader />
        <View style={styles.form}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={"never"}
            scrollEnabled={false}
            style={styles.innerContainer}
          >
            <StyledInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="email"
              textAlign="center"
              keyboardType="email-address"
              style={styles.input}
            />
            <StyledInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="password"
              textAlign="center"
              secureTextEntry={true}
              style={styles.input}
            />
            <StyledInput
              value={confirm}
              onChangeText={(text) => setConfirm(text)}
              placeholder="confirm"
              textAlign="center"
              secureTextEntry={true}
              style={styles.input}
            />
            <StyledInput
              value={username}
              onChangeText={(text) => setUsername(text)}
              placeholder="username"
              textAlign="center"
              style={styles.input}
            />
            <AuthButton text={"sign up"} onPress={handleSignup} />
          </KeyboardAwareScrollView>
        </View>
        <AuthFooter
          text={"already into chapters?"}
          subtext={"login"}
          link={"/(auth)/login"}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  form: {
    paddingHorizontal: 20,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    gap: 20,
  },
  input: {
    paddingVertical: 6,
  },
});
