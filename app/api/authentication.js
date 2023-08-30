import client from './client';
import uuid from 'react-native-uuid';
import authStorage from '../auth/storage';

import * as Application from 'expo-application';

const getUUIDWhenNotFoundFromStorage = async () => {
  try {
    let uuid = '';
    if (Platform.OS === 'android') {
      uuid = Application.androidId;
    }

    if (Platform.OS === 'ios') {
      uuid = await Application.getIosIdForVendorAsync();
    }

    console.log('getUUIDWhenNotFoundFromStorage', uuid);

    return uuid;
  } catch (error) {
    console.log('Error UUID not found', error);
  }
};

const phoneLogin = async (phoneNumber) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  // console.log('movies ----123');
  // const response = await fetch('https://iskconmayapur.in/api/v1/login');
  // const movies = await response.json();
  // console.log('movies ----', movies);
  return client.post(
    '/login',
    { phone: phoneNumber },
    { headers: { uuid: newUuid, token: '', appversion: '1.0' } }
  );
};

const verifyOtp = async (apiPayload) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    '/verifyotp',
    { ...apiPayload },
    { headers: { uuid: newUuid, token: '', appversion: '1.0' } }
  );
};

const logout = async ({ user_id, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    '/logout',
    { user_id },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: '1.0',
      },
    }
  );
};

export default { phoneLogin, verifyOtp, logout };
