import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as Device from "expo-device";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";

import authenticationApi from "../api/authentication";

// import Button from "../components/Button";
import colors from "../config/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";
import { isNumber } from "../lib";

function OtpScreen({ navigation, route }) {
  const dimensions = useWindowDimensions();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(true);
  const [apiErrorMsg, setApiErrorMsg] = useState("");

  const [otpToShow, setOtpToShow] = useState("");

  const authContext = useContext(AuthContext);

  const loginDetails = route.params;
  useEffect(() => {
    start();
    setOtpToShow(loginDetails.otp);

    return () => clear();
  }, []);

  const verifyOtp = useApi(authenticationApi.verifyOtp);

  // for timer
  const [timer, setTimer] = useState(30);
  const id = useRef(null);
  const clear = () => {
    window.clearInterval(id.current);
  };
  const start = () => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  };
  // useEffect(() => {
  //   id.current = window.setInterval(() => {
  //     setTimer((time) => time - 1);
  //   }, 1000);
  //   return () => clear();
  // }, []);
  useEffect(() => {
    if (timer === 0) {
      clear();
    }
  }, [timer]);
  // timer end

  useEffect(() => {
    setApiErrorMsg("");
    setOtpError(false);
  }, [otp]);

  const storeUserDataPermanently = async (userData) => {
    authContext.setUser(userData);
    await authStorage.storeUserData(userData);
  };

  useEffect(() => {
    if (verifyOtp.data && Object.keys(verifyOtp.data).length > 0) {
      if (verifyOtp.data.status === 1) {
        storeUserDataPermanently(verifyOtp.data.result.data);
      } else {
        setApiErrorMsg(verifyOtp.data.message);
        setOtpError(true);
      }
    }
  }, [verifyOtp.data]);
  const _handleSubmit = () => {
    if (otp && otp.length == 6 && isNumber(otp)) {
      const apiPayload = {
        otp,
        phone: "+91" + loginDetails.phoneNumber,
        os: Platform.OS,
        model: Device.modelName,
        brand: Device.brand,
      };
      verifyOtp.request(apiPayload);
    } else {
      setOtpError(true);
    }
  };

  const { data, error, loading, request } = useApi(
    authenticationApi.phoneLogin
  );

  const resendOtp = () => {
    request("+91" + loginDetails.phoneNumber);
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      if (data.status === 1) {
        // setOtpToShow(data.result.data.otp);
        setTimer(30);
        start();
      } else {
        setApiErrorMsg(data.message);
        setPhoneNumberError(true);
      }
    }
  }, [data]);

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="always"
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <View>
          <View style={{ alignItems: "center", top: 20 }}>
            <Image
              style={{
                width: 250,
                height: 250,
                resizeMode: "contain",
              }}
              source={require("../assets/logo.png")}
            />
            <View style={{ marginTop: 30, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 24,
                  color: colors.primary,
                }}
              >
                Enter your OTP
              </Text>
              {/* <Text>{otpToShow}</Text> */}
            </View>
          </View>
          <View style={{ marginHorizontal: 50, marginTop: 80 }}>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.secondary,
                padding: 10,
                textAlign: "center",
              }}
              onChangeText={setOtp}
              value={otp}
              placeholder="Please enter the OTP"
              keyboardType="numeric"
            />
            {otpError && (
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 16,
                  color: colors.danger,
                }}
              >
                {apiErrorMsg ? apiErrorMsg : "Please enter a valid OTP"}
              </Text>
            )}
            <Button
              mode="contained"
              color={colors.secondary}
              onPress={_handleSubmit}
              labelStyle={{ color: colors.white }}
              loading={verifyOtp.loading}
            >
              Submit
            </Button>

            {/* <Button title="Submit" color="secondary" onPress={_handleSubmit} /> */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: colors.grey }}>{timer} sec</Text>
              <Button
                mode="text"
                uppercase={false}
                compact
                color={colors.black}
                labelStyle={{ fontSize: 10, lineHeight: 10 }}
                disabled={timer > 0}
                onPress={() => resendOtp()}
                loading={loading}
              >
                Resend otp
              </Button>
            </View>
          </View>
        </View>
        <View style={{}}>
          <Image
            source={require("../assets/splash.png")}
            resizeMode="cover"
            style={{
              width: dimensions.widths,
              height: dimensions.height / 2.5,
            }}
          ></Image>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});

export default OtpScreen;
