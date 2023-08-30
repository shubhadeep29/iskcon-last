import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import moment from "moment";

import colors from "../config/colors";
import Screen from "../components/Screen";
import { Button, Dialog, TextInput } from "react-native-paper";

import allApi from "../api/allApi";
import useApi from "../hooks/useApi";

import routes from "../navigation/routes";
import AuthContext from "../auth/context";
import { useFocusEffect } from "@react-navigation/native";
import {
  generateCashPdf,
  generateCashPdfFromDeposit,
  generateChequePdf,
  generateChequePdfFromDeposit,
} from "../lib";

function BankDepositScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const screenDimensions = useWindowDimensions();
  const dateFormat = "DD-MM-YYYY";

  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState("");

  const [depositMode, setDepositMode] = useState("CASH");

  const [chequeCollectionList, setChequeCollectionList] = useState([]);

  const [cashCollection, setCashCollection] = useState({});
  const [chequeCollection, setChequeCollection] = useState({});
  const [collectionLimit, setCollectionLimit] = useState({});
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [apiTextMsg, setApiTextMsg] = useState("");

  const [branchName, setBranchName] = useState("");
  const [branchNameError, setBranchNameError] = useState(false);
  const [ifscCode, setIfscCode] = useState("");
  const [ifscCodeError, setIfscCodeError] = useState(false);
  const [cashAmountError, setCashAmountError] = useState(false);
  const [chequeAmountError, setChequeAmountError] = useState(false);

  const collectorDashboardApi = useApi(allApi.collectorDashboard);
  const [collectorDashboardApiSuccess, setCollectorDashboardApiSuccess] =
    useState(false);

  useEffect(() => {
    if (
      collectorDashboardApi.data &&
      Object.keys(collectorDashboardApi.data).length > 0
    ) {
      if (collectorDashboardApi.data.status === 1) {
        setCollectorDashboardApiSuccess(true);
        if (
          collectorDashboardApi.data.result.data.collectiondetails.length > 0
        ) {
          let cashCollectionData =
            collectorDashboardApi.data.result.data.collectiondetails.find(
              (item) => item.payment_mode === "CASH"
            );
          let chequeCollectionData =
            collectorDashboardApi.data.result.data.collectiondetails.find(
              (item) => item.payment_mode === "CHEQUE"
            );
          cashCollectionData
            ? setCashCollection(cashCollectionData)
            : setCashCollection({});
          chequeCollectionData
            ? setChequeCollection(chequeCollectionData)
            : setChequeCollection({});
        } else {
          setCashCollection({});
          setChequeCollection({});
        }
        collectorDashboardApi.data.result.data.collectionlimit &&
        Object.keys(collectorDashboardApi.data.result.data.collectionlimit)
          .length > 0
          ? setCollectionLimit(
              collectorDashboardApi.data.result.data.collectionlimit
            )
          : setCollectionLimit({});
        setQrCodeLink(collectorDashboardApi.data.result.data.qrimage.qrimage);
        setApiTextMsg(collectorDashboardApi.data.result.data.text.text);
      } else {
        setApiErrorMsg(collectorDashboardApi.data.message);
      }
    }
  }, [collectorDashboardApi.data]);

  const getDashBoardData = () => {
    let apiPayload = {
      user_id: user.user_id,
    };
    collectorDashboardApi.request({ apiPayload, token: user.token });
  };

  const bankDepositDetailsApi = useApi(allApi.bankDepositDetails);
  const [bankDepositDetailsApiSuccess, setBankDepositDetailsApiSuccess] =
    useState(false);

  useEffect(() => {
    if (
      bankDepositDetailsApi.data &&
      Object.keys(bankDepositDetailsApi.data).length > 0
    ) {
      if (bankDepositDetailsApi.data.status === 1) {
        setBankDepositDetailsApiSuccess(true);
        bankDepositDetailsApi.data.result.data.chequecollectionlist &&
        bankDepositDetailsApi.data.result.data.chequecollectionlist.length > 0
          ? setChequeCollectionList(
              bankDepositDetailsApi.data.result.data.chequecollectionlist
            )
          : setChequeCollectionList({});
      } else {
        setApiErrorMsg(bankDepositDetailsApi.data.message);
      }
    }
  }, [bankDepositDetailsApi.data]);

  const getBankDepositDetails = () => {
    let apiPayload = {
      user_id: user.user_id,
    };
    bankDepositDetailsApi.request({ apiPayload, token: user.token });
  };

  useFocusEffect(
    React.useCallback(() => {
      getDashBoardData();
      getBankDepositDetails();
    }, [])
  );

  let collectionDepositApi = useApi(allApi.collectionDeposit);
  const [collectionDepositApiSuccess, setCollectionDepositApiSuccess] =
    useState(false);
  const [collectionDepositApiResponse, setCollectionDepositApiResponse] =
    useState({});

  useEffect(() => {
    if (
      collectionDepositApi.data &&
      Object.keys(collectionDepositApi.data).length > 0
    ) {
      if (collectionDepositApi.data.status === 1) {
        setCollectionDepositApiResponse(collectionDepositApi.data.result.data);
        setCollectionDepositApiSuccess(true);
      } else {
        setCollectionDepositApiResponse({});
        setApiErrorMsg(collectionDepositApi.data.message);
      }
    }
  }, [collectionDepositApi.data]);

  const cashSubmit = () => {
    if (cashCollection && Object.keys(cashCollection).length === 0) {
      setCashAmountError(true);
      return false;
    }

    if (branchName.trim() === "") {
      setBranchNameError(true);
      return false;
    }
    if (ifscCode.trim() === "") {
      setIfscCodeError(true);
      return false;
    }

    let apiPayload = {
      user_id: user.user_id,
      payment_mode: depositMode,
      amount: cashCollection.collectionamount,
      branch_name: branchName,
      ifsc_code: ifscCode,
    };
    collectionDepositApi.request({ apiPayload, token: user.token });
  };

  const chequeSubmit = () => {
    if (chequeCollection && Object.keys(chequeCollection).length === 0) {
      setChequeAmountError(true);
      return false;
    }

    if (branchName.trim() === "") {
      setBranchNameError(true);
      return false;
    }
    if (ifscCode.trim() === "") {
      setIfscCodeError(true);
      return false;
    }

    let apiPayload = {
      user_id: user.user_id,
      payment_mode: depositMode,
      amount: chequeCollection.collectionamount,
      branch_name: branchName,
      ifsc_code: ifscCode,
    };
    collectionDepositApi.request({ apiPayload, token: user.token });
  };

  const handleSubmit = () => {
    setApiErrorMsg("");
    setCashAmountError(false);
    setChequeAmountError(false);

    if (depositMode === "CASH") {
      cashSubmit();
    }

    if (depositMode === "CHEQUE") {
      chequeSubmit();
    }
  };

  const resetScreen = () => {
    setBranchName("");
    setIfscCode("");
    setCollectorDashboardApiSuccess(false);
    setBankDepositDetailsApiSuccess(false);
    getDashBoardData();
    getBankDepositDetails();
    setApiErrorMsg("");
    setCashAmountError(false);
    setChequeAmountError(false);
    setCollectionDepositApiSuccess(false);
  };

  const MyAlert = () => {
    return (
      <Dialog
        style={{ borderRadius: 10 }}
        visible={collectionDepositApiSuccess}
      >
        <Dialog.Content
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/check.png")}
            style={{
              width: 80,
              height: 80,
              resizeMode: "contain",
            }}
          ></Image>
          <Text style={{ marginTop: 10 }}>That's awesome </Text>
          <Text>Deposit successful</Text>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {collectionDepositApiResponse &&
            Object.keys(collectionDepositApiResponse).length > 0 ? (
              <Button
                mode="contained"
                labelStyle={{ fontSize: 12, color: colors.white }}
                style={{
                  backgroundColor: colors.primary,
                  marginRight: 5,
                }}
                // loading={
                //   bankDepositReportDetailsApi.loading &&
                //   depositData === item.deposit_id
                // }
                onPress={() => {
                  depositMode === "CASH"
                    ? generateCashPdfFromDeposit(collectionDepositApiResponse)
                    : generateChequePdfFromDeposit(
                        collectionDepositApiResponse
                      );

                  resetScreen();
                }}
              >
                Download
              </Button>
            ) : null}
            <Button
              mode="contained"
              onPress={() => resetScreen()}
              style={{ width: 80 }}
              labelStyle={{ color: colors.white }}
            >
              Ok
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    );
  };

  return (
    <Screen style={styles.screen}>
      <View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 4,
                alignItems: "center",
                padding: 8,
                borderWidth: 1,
                borderColor: colors.primary,
                backgroundColor:
                  depositMode === "CASH" ? colors.primary : colors.white,
              }}
              onPress={() => {
                setDepositMode("CASH");
                resetScreen();
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: depositMode === "CASH" ? colors.white : colors.black,
                }}
              >
                CASH DEPOSIT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 4,
                alignItems: "center",
                padding: 8,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: colors.primary,
                backgroundColor:
                  depositMode === "CHEQUE" ? colors.primary : colors.white,
              }}
              onPress={() => {
                setDepositMode("CHEQUE");
                resetScreen();
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: depositMode === "CHEQUE" ? colors.white : colors.black,
                }}
              >
                CHEQUE DEPOSIT
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 4,
                alignItems: "center",
                padding: 8,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: colors.primary,
                backgroundColor:
                  depositMode === "UPI" ? colors.primary : colors.white,
              }}
              onPress={() => setDepositMode("UPI")}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: depositMode === "UPI" ? colors.white : colors.black,
                }}
              >
                UPI
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* FOR CASH SECTION */}
        {depositMode === "CASH" && (
          <View style={{ marginHorizontal: 5, marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 20,
              }}
            >
              <Text style={{ color: colors.secondary }}>
                Cash Holding/Deposit Amount
              </Text>
              {collectorDashboardApi.loading ? (
                <ActivityIndicator
                  color={colors.secondary}
                  style={{ marginRight: 20 }}
                />
              ) : (
                <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
                  INR{" "}
                  {cashCollection && Object.keys(cashCollection).length > 0
                    ? cashCollection.collectionamount
                    : "00.00"}
                </Text>
              )}
            </View>
            {cashAmountError && (
              <Text style={{ marginTop: 10, color: colors.danger }}>
                You don't have any cash holding to deposit
              </Text>
            )}
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {apiTextMsg}
              </Text>
            </View>
            <View>
              <TextInput
                mode="flat"
                label="Bank Branch Name *"
                placeholder="Enter Bank Branch Name"
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={branchName}
                onChangeText={(text) => {
                  setBranchName(text);
                  setBranchNameError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  marginTop: 5,
                }}
              />
              {branchNameError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter branch name
                </Text>
              )}
              <TextInput
                mode="flat"
                label="IFSC Code *"
                placeholder="Enter IFSC Code"
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={ifscCode}
                onChangeText={(text) => {
                  setIfscCode(text);
                  setIfscCodeError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  marginTop: 5,
                }}
              />
              {ifscCodeError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter IFSC code
                </Text>
              )}
            </View>
          </View>
        )}

        {/* FOR CHEQUE SECTION */}
        {depositMode === "CHEQUE" && (
          <View style={{ marginHorizontal: 5, marginTop: 20 }}>
            {}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 20,
              }}
            >
              <Text style={{ color: colors.secondary }}>
                Cheque Holding/deposit amount
              </Text>
              {collectorDashboardApi.loading ? (
                <ActivityIndicator
                  color={colors.secondary}
                  style={{ marginRight: 20 }}
                />
              ) : (
                <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
                  INR{" "}
                  {chequeCollection && Object.keys(chequeCollection).length > 0
                    ? chequeCollection.collectionamount
                    : "00.00"}
                </Text>
              )}
            </View>
            {chequeAmountError && (
              <Text style={{ marginTop: 10, color: colors.danger }}>
                You don't have any cheque holding to deposit
              </Text>
            )}
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {apiTextMsg}
              </Text>
            </View>
            <View>
              <TextInput
                mode="flat"
                label="Bank Branch Name *"
                placeholder="Enter Bank Branch Name"
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={branchName}
                onChangeText={(text) => {
                  setBranchName(text);
                  setBranchNameError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  marginTop: 5,
                }}
              />
              {branchNameError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter branch name
                </Text>
              )}
              <TextInput
                mode="flat"
                label="IFSC Code *"
                placeholder="Enter IFSC Code"
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={ifscCode}
                onChangeText={(text) => {
                  setIfscCode(text);
                  setIfscCodeError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  marginTop: 5,
                }}
              />
              {ifscCodeError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter IFSC code
                </Text>
              )}
            </View>
            <ScrollView
              style={{
                marginTop: 30,
                height: screenDimensions.height / 2.5,
              }}
            >
              {chequeCollectionList && chequeCollectionList.length > 0
                ? chequeCollectionList.map((item) => {
                    return (
                      <View
                        key={item.transaction_id}
                        style={{
                          padding: 10,
                          backgroundColor: colors.greyShade,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <View>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: colors.black, fontSize: 12 }}>
                              Cheque No.
                            </Text>
                            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                              {" "}
                              {item.cheque_no}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: colors.black,
                              fontSize: 10,
                              marginTop: 2,
                            }}
                          >
                            {moment(new Date(item.cheque_date)).format(
                              dateFormat
                            )}{" "}
                            | {item.bank_name} | {item.bank_branch}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: colors.black,
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          INR {Number(item.donation_amount).toFixed(2)}
                        </Text>
                      </View>
                    );
                  })
                : null}
            </ScrollView>
          </View>
        )}
      </View>
      <MyAlert />
      {apiErrorMsg ? (
        <Text
          style={{ textAlign: "center", color: colors.danger, marginTop: 10 }}
        >
          {apiErrorMsg}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button
          mode="contained"
          style={{ width: 150, backgroundColor: colors.grey }}
          onPress={() => navigation.navigate(routes.DASHBOARD)}
          labelStyle={{ color: colors.white }}
          disabled={collectionDepositApiSuccess}
        >
          Back
        </Button>
        <Button
          mode="contained"
          style={{
            width: 150,
            backgroundColor: colors.secondary,
          }}
          labelStyle={{ color: colors.white }}
          onPress={() => handleSubmit()}
          disabled={collectionDepositApiSuccess}
        >
          Submit
        </Button>
      </View>
    </Screen>
  );
}

export default BankDepositScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    justifyContent: "space-between",
  },
});
