import React, { useState, useEffect, useContext } from "react";
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

import allApi from "../api/allApi";
import useApi from "../hooks/useApi";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { Button } from "react-native-paper";

import AuthContext from "../auth/context";
import { useFocusEffect } from "@react-navigation/native";

function ChequeDepositDetailsScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const screenDimensions = useWindowDimensions();
  const depositData = route.params;

  const [collectionMode, setCollectionMode] = useState("cash");
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [searchText, setSearchText] = useState("");

  const bankDepositReportApi = useApi(allApi.bankDepositDetailsReport);
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

  const getCollectedDonations = () => {
    let apiPayload = {
      user_id: user.user_id,
      deposit_id: depositData.deposit_id,
    };
    bankDepositReportApi.request({ apiPayload, token: user.token });
  };

  useFocusEffect(
    React.useCallback(() => {
      getCollectedDonations();
    }, [collectionMode])
  );

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
            Collection date
          </Text>
          <Text
            style={{
              color: colors.black,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {item.created_at}
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
          <Text style={{ color: colors.black, fontSize: 12 }}>
            Donor Mobile No.
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

  // const chequeList = () => {
  //   return (
  //     <View
  //       style={{
  //         padding: 10,
  //         backgroundColor: colors.greyShade,
  //         marginBottom: 2,
  //       }}
  //     >
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Collection date
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           08-05-2022
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Cheque No
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           98765432123
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Donor Name
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           Shubhadeep Chowdhury
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Donor Mobile No.
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           9126667356
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Amount
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           INR 9989.00
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Donation Name
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           General Donation
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Bank Name
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           State Bank of India
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Text style={{ color: colors.black, fontSize: 12,  }}>
  //           Branch Name
  //         </Text>
  //         <Text
  //           style={{
  //             color: colors.black,
  //             fontWeight: "700",
  //             fontSize: 12,
  //
  //           }}
  //         >
  //           Haringhata
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <Screen style={styles.screen}>
      <View style={{ marginHorizontal: 0 }}>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: colors.primary,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12 }}>
            Cheque Deposited ID <Text style={{}}>{depositData.deposit_id}</Text>
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            INR {parseFloat(depositData.amount).toFixed(2)}
          </Text>
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
              height: screenDimensions.height / 1.4,
            }}
          >
            {depositList && depositList.length > 0 ? (
              depositList.map((item, key) => {
                return chequeList(item, key);
              })
            ) : (
              <Text style={{ marginLeft: 10 }}> No data found </Text>
            )}
          </ScrollView>
        )}
      </View>

      <View style={{}}>
        <Button
          mode="contained"
          style={{ backgroundColor: colors.secondary }}
          onPress={() => navigation.navigate(routes.BANK_DEPOSIT_REPORT)}
          labelStyle={{ color: colors.white }}
        >
          Back to Bank Deposit Report
        </Button>
      </View>
    </Screen>
  );
}

export default ChequeDepositDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    justifyContent: "space-between",
  },
});
