import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';

// import Button from "../components/Button";
import colors from '../config/colors';
import routes from '../navigation/routes';
import authenticationApi from '../api/authentication';
import useApi from '../hooks/useApi';
import { Button } from 'react-native-paper';
import { isNumber } from '../lib';

function WelcomeScreen({ navigation }) {
  const dimensions = useWindowDimensions();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(true);
  const [apiErrorMsg, setApiErrorMsg] = useState('');

  const { data, error, loading, request } = useApi(
    authenticationApi.phoneLogin
  );

  useEffect(() => {
    setApiErrorMsg('');
    setPhoneNumberError(false);
  }, [phoneNumber]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      if (data.status === 1) {
        navigation.navigate(routes.OTP, { ...data.result.data, phoneNumber });
      } else {
        setApiErrorMsg(data.message);
        setPhoneNumberError(true);
      }
    }
  }, [data]);

  const handleLogin = async () => {
    if (phoneNumber && phoneNumber.length == 10 && isNumber(phoneNumber)) {
      request('+91' + phoneNumber);
    } else {
      setPhoneNumberError(true);
    }
  };

  return (
    <ScrollView
      keyboardDismissMode='on-drag'
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior='always'
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Image
              style={{
                width: 250,
                height: 250,
                resizeMode: 'contain',
              }}
              source={require('../assets/logo.png')}
            />
            <Text
              style={{
                fontSize: 24,
                color: colors.secondary,
                letterSpacing: -1,
                marginTop: 10,
              }}
            >
              ISKCON
            </Text>
            <Text
              style={{ fontSize: 24, color: colors.primary, letterSpacing: -1 }}
            >
              Collect4Mayapur App
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 60,
              marginTop: 60,
            }}
          >
            <TextInput
              style={{
                height: 40,
                marginBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.secondary,
                padding: 10,
                textAlign: 'center',
              }}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholder='Type mobile number'
              keyboardType='numeric'
            />
            {phoneNumberError && (
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 12,
                  color: colors.danger,
                }}
              >
                {apiErrorMsg
                  ? apiErrorMsg
                  : 'Please enter a valid phone number'}
              </Text>
            )}
            <Button
              mode='contained'
              loading={loading}
              color={colors.secondary}
              onPress={handleLogin}
              // style={{ width: 270 }}
              labelStyle={{ color: colors.white }}
            >
              Login
            </Button>
            {/* <Button
              mode="contained"
              color={colors.secondary}
              onPress={_handleLogout}
              labelStyle={{ color: colors.white }}
            >
              Logout
            </Button> */}
          </View>
        </View>
        <Image
          source={require('../assets/splash.png')}
          resizeMode='cover'
          style={{
            marginTop: 10,
            width: dimensions.width,
            height: dimensions.height / 2.5,
          }}
        ></Image>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

export default WelcomeScreen;
