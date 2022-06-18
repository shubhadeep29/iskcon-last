import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
// import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import * as Application from "expo-application";

const storeUUID = async () => {
  try {
    let uuid = "";
    if (Platform.OS === "android") {
      console.log(1);
      uuid = Application.androidId;
    }

    if (Platform.OS === "ios") {
      console.log(2);
      uuid = await Application.getIosIdForVendorAsync();
    }

    if (uuid === "") {
      console.log(3);
      uuid = uuidv4();
    }

    console.log(uuid);

    await SecureStore.setItemAsync("secure_deviceId", uuid);
  } catch (error) {
    console.log("Error storing the UUID", error);
  }
};

const getUUID = async () => {
  try {
    return await SecureStore.getItemAsync("secure_deviceId");
  } catch (error) {
    console.log("Error getting the UUID", error);
  }
};

const key = "userData";

const storeUserData = async (userData) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(userData));
  } catch (error) {
    console.log("Error storing the auth UserData", error);
  }
};

const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync(key);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.log("Error getting the auth UserData", error);
  }
};

// const getUser = async () => {
//   const userData = await getToken();
//   return userData ? jwtDecode(userData) : null;
// };

const removeUserData = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing the auth UserData", error);
  }
};

export default {
  storeUUID,
  getUUID,
  getUserData,
  removeUserData,
  storeUserData,
};
