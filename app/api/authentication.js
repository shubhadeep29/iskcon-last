import client from "./client";
import uuid from "react-native-uuid";
import authStorage from "../auth/storage";

const phoneLogin = async (phoneNumber) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = uuid.v4();
  return client.post(
    "/login",
    { phone: phoneNumber },
    { headers: { uuid: newUuid, token: "", appversion: "1.0" } }
  );
};

const verifyOtp = async (apiPayload) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = uuid.v4();
  return client.post(
    "/verifyotp",
    { ...apiPayload },
    { headers: { uuid: newUuid, token: "", appversion: "1.0" } }
  );
};

const logout = async ({ user_id, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = uuid.v4();
  return client.post(
    "/logout",
    { user_id },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

export default { phoneLogin, verifyOtp, logout };
