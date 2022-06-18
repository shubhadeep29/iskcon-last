import React, { useState, useEffect, useContext, useCallback } from "react";
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

import allApi from "../api/allApi";
import useApi from "../hooks/useApi";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { Button, TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AuthContext from "../auth/context";
import { DatePickerModal } from "react-native-paper-dates";

function CollectionReportScreen({ navigation, route }) {
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
  const collectedDonationReportApi = useApi(allApi.collectedDonationReport);
  const [
    collectedDonationReportApiSuccess,
    setCollectedDonationReportApiSuccess,
  ] = useState(false);
  const [donationList, setDonationList] = useState([]);

  useEffect(() => {
    if (
      collectedDonationReportApi.data &&
      Object.keys(collectedDonationReportApi.data).length > 0
    ) {
      if (collectedDonationReportApi.data.status === 1) {
        setCollectedDonationReportApiSuccess(true);
        if (collectedDonationReportApi.data.result.data.length > 0) {
          setDonationList(collectedDonationReportApi.data.result.data);
        } else {
          setDonationList([]);
        }
      } else {
        setDonationList([]);
        setApiErrorMsg(collectedDonationReportApi.data.message);
      }
    }
  }, [collectedDonationReportApi.data]);

  const getCollectedDonations = (dateRange = range) => {
    console.log("dates are", dateRange);
    let apiPayload = {
      user_id: user.user_id,
      payment_mode: collectionMode,
      searchdata: searchText,
      start_date: moment(dateRange.startDate).format(dateFormatForSubmit),
      end_date: moment(dateRange.endDate).format(dateFormatForSubmit),
    };
    collectedDonationReportApi.request({ apiPayload, token: user.token });
  };

  useFocusEffect(
    React.useCallback(() => {
      setDonationList([]);
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
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
            }}
          >
            Collection Date
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {moment(item.created_at).format(dateFormat)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
            }}
          >
            Donor Name
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donor_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: colors.black,

              fontSize: 12,
            }}
          >
            Mobile No.
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donor_phone}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
            }}
          >
            Amount
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            INR {parseFloat(item.donation_amount).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
            }}
          >
            Donation Name
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donation_name}
          </Text>
        </View>
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
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.greyShade,
            }}
          >
            Collection Date
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {moment(item.created_at).format(dateFormat)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Donor Name</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donor_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Mobile No.</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donor_phone}
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
            INR {parseFloat(item.donation_amount).toFixed(2)}
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
            Donation Name
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donation_name}
          </Text>
        </View>
      </View>
    );
  };

  const upiList = (item, key) => {
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
            Reference Number
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.payment_reference_no}
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
            Collection Date
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {moment(item.created_at).format(dateFormat)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Donor Name</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donor_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.black, fontSize: 12 }}>Mobile No.</Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donor_phone}
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
            INR {item.donation_amount}
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
            Donation Name
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.donation_name}
          </Text>
        </View>
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
                CASH
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
                CHEQUE
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
                  collectionMode === "upi" ? colors.primary : colors.white,
              }}
              onPress={() => {
                setCollectionMode("upi");
                setSearchText("");
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: collectionMode === "upi" ? colors.white : colors.black,
                }}
              >
                UPI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOR cash SECTION */}
        {collectionMode === "cash" && (
          <View
            style={{
              marginHorizontal: 0,
            }}
          >
            <View>
              <TextInput
                mode="flat"
                // label="Bank Branch Name"
                placeholder="Search by Donor Name & Mobile"
                right={
                  <TextInput.Icon
                    name="magnify"
                    onPress={() => {
                      getCollectedDonations();
                    }}
                  />
                }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
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
            {collectedDonationReportApi.loading ? (
              <ActivityIndicator
                size={"large"}
                color={colors.primary}
                style={{ marginTop: 15 }}
              />
            ) : (
              // donationList && donationList.length > 0 ? (
              //   <FlatList
              //     data={donationList}
              //     renderItem={cashList}
              //     keyExtractor={(item, key) => key}
              //   />
              // ) : (
              //   <Text style={{ marginLeft: 10 }}> No data found </Text>
              // )

              <ScrollView
                style={{
                  marginVertical: 15,
                  height: screenDimensions.height / 1.7,
                }}
              >
                {donationList && donationList.length > 0 ? (
                  donationList.map((item, key) => {
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
                placeholder="Search by Donor Name & Mobile"
                right={
                  <TextInput.Icon
                    name="magnify"
                    onPress={() => {
                      getCollectedDonations();
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
            {collectedDonationReportApi.loading ? (
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
                {donationList && donationList.length > 0 ? (
                  donationList.map((item, key) => {
                    return chequeList(item, key);
                  })
                ) : (
                  <Text style={{}}> No data found </Text>
                )}
              </ScrollView>
            )}
          </View>
        )}

        {/* FOR upi SECTION */}
        {collectionMode === "upi" && (
          <View style={{ marginHorizontal: 0 }}>
            <View>
              <TextInput
                mode="flat"
                // label="Bank Branch Name"
                placeholder="Search by Donor name, phone, Reference Number"
                right={
                  <TextInput.Icon
                    name="magnify"
                    onPress={() => {
                      getCollectedDonations();
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
            {collectedDonationReportApi.loading ? (
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
                {donationList && donationList.length > 0 ? (
                  donationList.map((item, key) => {
                    return upiList(item, key);
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

export default CollectionReportScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    // borderWidth: 1,
    // borderColor: colors.black,
    justifyContent: "space-between",
  },
});
