import client from "./client";
import uuid from "react-native-uuid";
import authStorage from "../auth/storage";

// var newUuid = uuid.v4();

const collectorDashboard = async ({ apiPayload, token }) => {
  let newUuid = await authStorage.getUUID();
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
  if (!newUuid) newUuid = uuid.v4();
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
};
