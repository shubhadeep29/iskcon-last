import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";

import moment from "moment";

import allApi from "../api/allApi";
import useApi from "../hooks/useApi";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { Button, TextInput } from "react-native-paper";

import AuthContext from "../auth/context";
import { useFocusEffect } from "@react-navigation/native";
import { DatePickerModal } from "react-native-paper-dates";

function BankDepositReportScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const screenDimensions = useWindowDimensions();
  const dateFormat = "DD-MM-YYYY HH:MM";
  const dateFormatToShow = "DD-MM-YYYY";
  const dateFormatForSubmit = "YYYY-MM-DD";

  const [collectionMode, setCollectionMode] = useState("cash");
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [searchText, setSearchText] = useState("");

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [range, setRange] = useState({
    startDate: yesterday,
    endDate: today,
  });

  const [open, setOpen] = useState(false);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
      getCollectedDonations({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  const bankDepositReportApi = useApi(allApi.bankDepositReport);
  const [bankDepositReportApiSuccess, setBankDepositReportApiSuccess] =
    useState(false);
  const [depositList, setDepositList] = useState([]);

  useEffect(() => {
    if (
      bankDepositReportApi.data &&
      Object.keys(bankDepositReportApi.data).length > 0
    ) {
      if (bankDepositReportApi.data.status === 1) {
        setBankDepositReportApiSuccess(true);
        if (bankDepositReportApi.data.result.data.length > 0) {
          setDepositList(bankDepositReportApi.data.result.data);
        } else {
          setDepositList([]);
        }
      } else {
        setDepositList([]);
        setApiErrorMsg(bankDepositReportApi.data.message);
      }
    }
  }, [bankDepositReportApi.data]);

  const getCollectedDonations = (dateRange = range) => {
    console.log("dates are", dateRange);
    let apiPayload = {
      user_id: user.user_id,
      payment_mode: collectionMode,
      searchdata: searchText,
      start_date: moment(dateRange.startDate).format(dateFormatForSubmit),
      end_date: moment(dateRange.endDate).format(dateFormatForSubmit),
    };
    bankDepositReportApi.request({ apiPayload, token: user.token });
  };

  useFocusEffect(
    React.useCallback(() => {
      setDepositList([]);
      setRange({
        startDate: yesterday,
        endDate: today,
      });
      getCollectedDonations({
        startDate: yesterday,
        endDate: today,
      });
    }, [collectionMode])
  );

  const cashList = (item, key) => {
    return (
      <View
        key={key}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: colors.grey,
          marginBottom: 10,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Deposited ID.
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.deposit_id}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Deposited Date
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {moment(item.date).format(dateFormat)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Total number of donations
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.count}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Amount</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            INR {parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Bank Name</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.bank_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Branch Name</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.branch_name}
          </Text>
        </View>
        <Button
          mode="contained"
          compact
          labelStyle={{ fontSize: 12, color: colors.white }}
          style={{
            backgroundColor: colors.secondary,
            alignSelf: "flex-end",
            marginTop: 4,
          }}
          onPress={() => navigation.navigate(routes.CASH_DEPOSIT_DETAILS, item)}
        >
          View Details
        </Button>
      </View>
    );
  };

  const chequeList = (item, key) => {
    return (
      <View
        key={key}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: colors.grey,
          marginBottom: 10,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Deposited ID.
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.deposit_id}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Deposited Date
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {moment(item.date).format(dateFormat)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Total number of cheques
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.count}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Amount</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            INR {parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Bank Name</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.bank_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Branch Name</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.branch_name}
          </Text>
        </View>
        <Button
          mode="contained"
          compact
          labelStyle={{ fontSize: 12, color: colors.white }}
          style={{
            backgroundColor: colors.secondary,
            alignSelf: "flex-end",
            marginTop: 4,
          }}
          onPress={() =>
            navigation.navigate(routes.CHEQUE_DEPOSIT_DETAILS, item)
          }
        >
          View Details
        </Button>
      </View>
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
                  collectionMode === "cash" ? colors.primary : colors.white,
              }}
              onPress={() => {
                setCollectionMode("cash");
                setSearchText("");
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color:
                    collectionMode === "cash" ? colors.white : colors.black,
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
                  collectionMode === "cheque" ? colors.primary : colors.white,
              }}
              onPress={() => {
                setCollectionMode("cheque");
                setSearchText("");
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color:
                    collectionMode === "cheque" ? colors.white : colors.black,
                }}
              >
                CHEQUE DEPOSIT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOR cash SECTION */}
        {collectionMode === "cash" && (
          <View style={{ marginHorizontal: 0 }}>
            <View>
              <TextInput
                mode="flat"
                // label="Bank Branch Name"
                placeholder="Search Bank name & Deposit id"
                right={
                  <TextInput.Icon
                    name="magnify"
                    onPress={() => {
                      getBankDeposits();
                    }}
                  />
                }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  marginTop: 5,
                  height: 40,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View>
                  <Text>You are seeing data between</Text>
                  <Text style={{ color: colors.secondary }}>
                    {moment(range.startDate).format(dateFormatToShow)}
                    {"  -  "}
                    {moment(range.endDate).format(dateFormatToShow)}
                  </Text>
                </View>
                <Button
                  onPress={() => setOpen(true)}
                  uppercase={false}
                  mode="contained"
                  compact
                  style={{ backgroundColor: colors.secondary }}
                  labelStyle={{ color: colors.white }}
                >
                  Date range
                </Button>
                <DatePickerModal
                  locale="en"
                  mode="range"
                  visible={open}
                  onDismiss={onDismiss}
                  startDate={range.startDate}
                  endDate={range.endDate}
                  onConfirm={onConfirm}
                  validRange={{
                    // startDate: new Date(2021, 1, 2),  // optional
                    endDate: new Date(), // optional
                    // disabledDates: [new Date()] // optional
                  }}
                  // onChange={} // same props as onConfirm but triggered without confirmed by user
                  // saveLabel="Save" // optional
                  // uppercase={false} // optional, default is true
                  label="Select period" // optional
                  // startLabel="From" // optional
                  // endLabel="To" // optional
                  // animationType="slide" // optional, default is slide on ios/android and none on web
                />
              </View>
              {/* {phoneNumberError && (
              <Text style={{ marginTop: 10, color: colors.danger }}>
                Please enter a valid phone number
              </Text>
            )} */}
            </View>
            {bankDepositReportApi.loading ? (
              <ActivityIndicator
                size={"large"}
                color={colors.primary}
                style={{ marginTop: 15 }}
              />
            ) : (
              <ScrollView
                style={{
                  marginVertical: 15,
                  height: screenDimensions.height / 1.7,
                }}
              >
                {depositList && depositList.length > 0 ? (
                  depositList.map((item, key) => {
                    return cashList(item, key);
                  })
                ) : (
                  <Text style={{}}> No data found </Text>
                )}
              </ScrollView>
            )}
          </View>
        )}

        {/* FOR cheque SECTION */}
        {collectionMode === "cheque" && (
          <View style={{ marginHorizontal: 0 }}>
            <View>
              <TextInput
                mode="flat"
                // label="Bank Branch Name"
                placeholder="Search Bank name & Deposit id"
                right={
                  <TextInput.Icon
                    name="magnify"
                    onPress={() => {
                      getBankDeposits();
                    }}
                  />
                }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  marginTop: 5,
                  height: 40,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View>
                  <Text>You are seeing data between</Text>
                  <Text style={{ color: colors.secondary }}>
                    {moment(range.startDate).format(dateFormatToShow)}
                    {"  -  "}
                    {moment(range.endDate).format(dateFormatToShow)}
                  </Text>
                </View>
                <Button
                  onPress={() => setOpen(true)}
                  uppercase={false}
                  mode="contained"
                  compact
                  style={{ backgroundColor: colors.secondary }}
                  labelStyle={{ color: colors.white }}
                >
                  Date range
                </Button>
                <DatePickerModal
                  locale="en"
                  mode="range"
                  visible={open}
                  onDismiss={onDismiss}
                  startDate={range.startDate}
                  endDate={range.endDate}
                  onConfirm={onConfirm}
                  validRange={{
                    // startDate: new Date(2021, 1, 2),  // optional
                    endDate: new Date(), // optional
                    // disabledDates: [new Date()] // optional
                  }}
                  // onChange={} // same props as onConfirm but triggered without confirmed by user
                  // saveLabel="Save" // optional
                  // uppercase={false} // optional, default is true
                  label="Select period" // optional
                  // startLabel="From" // optional
                  // endLabel="To" // optional
                  // animationType="slide" // optional, default is slide on ios/android and none on web
                />
              </View>
              {/* {phoneNumberError && (
            <Text style={{ marginTop: 10, color: colors.danger }}>
              Please enter a valid phone number
            </Text>
          )} */}
            </View>
            {bankDepositReportApi.loading ? (
              <ActivityIndicator
                size={"large"}
                color={colors.primary}
                style={{ marginTop: 15 }}
              />
            ) : (
              <ScrollView
                style={{
                  marginVertical: 15,
                  height: screenDimensions.height / 1.7,
                }}
              >
                {depositList && depositList.length > 0 ? (
                  depositList.map((item, key) => {
                    return chequeList(item, key);
                  })
                ) : (
                  <Text style={{}}> No data found </Text>
                )}
              </ScrollView>
            )}
          </View>
        )}
      </View>

      <View style={{}}>
        <Button
          mode="contained"
          style={{ backgroundColor: colors.secondary }}
          onPress={() => navigation.navigate(routes.REPORT)}
          labelStyle={{ color: colors.white }}
        >
          Back to Report
        </Button>
      </View>
    </Screen>
  );
}

export default BankDepositReportScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    justifyContent: "space-between",
  },
});
