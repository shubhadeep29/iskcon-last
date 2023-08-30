import client from "./client";
import uuid from "react-native-uuid";
import authStorage from "../auth/storage";

import * as Application from "expo-application";

// var newUuid = uuid.v4();

const getUUIDWhenNotFoundFromStorage = async () => {
  try {
    let uuid = "";
    if (Platform.OS === "android") {
      uuid = Application.androidId;
    }

    if (Platform.OS === "ios") {
      uuid = await Application.getIosIdForVendorAsync();
    }

    console.log("getUUIDWhenNotFoundFromStorage", uuid);

    return uuid;
  } catch (error) {
    console.log("Error UUID not found", error);
  }
};

const collectorDashboard = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/collectordashboard",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const donarList = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/donarlist",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const donarDetails = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/donardetails",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const donationTypeList = async ({ user_id, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/donationtypelist",
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

const donarPayment = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/donarpayment",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const bankDepositDetails = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/bankdepositdetails",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const collectionDeposit = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/collectiondeposit",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const collectedDonationReport = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/collecteddonationlistreport",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const bankDepositReport = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/bankdepositlistreport",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const bankDepositDetailsReport = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/bankdepositlistdetailsreport",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

const sendFacsimileSms = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = getUUIDWhenNotFoundFromStorage();
  return client.post(
    "/sendfacsimilesms",
    { ...apiPayload },
    {
      headers: {
        uuid: newUuid,
        token: token,
        appversion: "1.0",
      },
    }
  );
};

export default {
  collectorDashboard,
  donarList,
  donarDetails,
  donationTypeList,
  donarPayment,
  bankDepositDetails,
  collectionDeposit,
  collectedDonationReport,
  bankDepositReport,
  bankDepositDetailsReport,
  sendFacsimileSms,
};
