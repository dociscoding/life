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

import { useLoginMutation } from "@/redux/auth/api/auth.api";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GeneralReducerType } from "@/redux/general/general.types";
import { State } from "@/redux/state";
import { setError } from "@/redux/general/general.slice";
import useLanguage from "../../utils/useLanguage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [trigger, { isLoading, error, data }] = useLoginMutation();
  const dispatch = useDispatch<ThunkDispatch<GeneralReducerType, State, any>>();

  const text: any = useLanguage([
    "missing_fields_login_error",
    "mail_not_correct",
    "dont_have_an_account",
    "create_one",
    "incorrect_credentials",
  ]);

  const router = useRouter();

  useEffect(() => {
    //@ts-ignore
    if (error?.data?.message === "auth.credentials_incorrect") {
      dispatch(
        setError({
          message: text.incorrect_credentials,
          duration: 4000,
        })
      );
    }

    if (data?.ok) {
      setEmail("");
      setPassword("");
    }
  }, [isLoading, data, error]);

  //Region Login

  const isEmailValid = useCallback(
    (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailRegex.test(email);
    },
    [email]
  );

  const handleLogin = useCallback(() => {
    if (!email || !password) {
      !email && setEmailError(true);
      !password && setPasswordError(true);

      dispatch(
        setError({
          message: text.missing_fields_login_error,
          duration: 4000,
        })
      );

      return;
    }
    if (!isEmailValid(email)) {
      setEmailError(true);
      dispatch(
        setError({
          message: text.mail_not_correct,
          duration: 4000,
        })
      );

      return;
    }

    trigger({
      email,
      password,
    });
  }, [email, password]);

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
            <AuthButton text={"login"} onPress={handleLogin} />
          </KeyboardAwareScrollView>
        </View>
        <AuthFooter
          text={"new to chapters?"}
          subtext={"sign up"}
          link={"/(auth)/signup"}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

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
