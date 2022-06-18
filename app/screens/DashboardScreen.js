import React, { useEffect, useContext, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import colors from "../config/colors";
import routes from "../navigation/routes";

import allApi from "../api/allApi";
import AuthContext from "../auth/context";
import { useFocusEffect } from "@react-navigation/native";

function DashboardScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);

  const [cashCollection, setCashCollection] = useState({});
  const [chequeCollection, setChequeCollection] = useState({});
  const [collectionLimit, setCollectionLimit] = useState({});
  const [qrCodeLink, setQrCodeLink] = useState("");

  const collectorDashboardApi = useApi(allApi.collectorDashboard);

  useEffect(() => {
    if (
      collectorDashboardApi.data &&
      Object.keys(collectorDashboardApi.data).length > 0
    ) {
      if (collectorDashboardApi.data.status === 1) {
        setApiSuccess(true);
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

  useFocusEffect(
    React.useCallback(() => {
      getDashBoardData();
    }, [])
  );

  // useEffect(() => {
  //   getDashBoardData();
  // }, []);

  return (
    <View style={styles.screen}>
      <ScrollView>
        <TouchableOpacity
          style={{
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 50,
            padding: 15,
            borderWidth: 3,
            borderColor: colors.secondary,
            // ...iosShadow,
          }}
          onPress={() => navigation.navigate(routes.DONOR_NATIONALITY)}
        >
          <Image
            source={require("../assets/donate.png")}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              tintColor: colors.secondary,
            }}
          ></Image>
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "bold",
              color: colors.secondary,
            }}
          >
            COLLECT DONATIONS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderRadius: 10,
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: 50,
            padding: 15,
            borderWidth: 3,
            borderColor: colors.primary,
            // ...iosShadow,
          }}
          onPress={() => navigation.navigate(routes.BANK_DEPOSIT)}
        >
          <Image
            source={require("../assets/donation1.png")}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              tintColor: colors.primary,
            }}
          ></Image>
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            BANK DEPOSIT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderRadius: 10,
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: 50,
            padding: 15,
            borderWidth: 3,
            borderColor: colors.primary,
            // ...iosShadow,
          }}
          onPress={() => navigation.navigate(routes.REPORT)}
        >
          <Image
            source={require("../assets/report.png")}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              tintColor: colors.primary,
            }}
          ></Image>
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            REPORTS
          </Text>
        </TouchableOpacity>

        <View
          style={{
            borderRadius: 10,
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: 50,
            paddingTop: 10,
            paddingBottom: 5,
            borderWidth: 3,
            borderColor: colors.green,
            // ...iosShadow,
          }}
        >
          {collectorDashboardApi.loading ? (
            <ActivityIndicator
              size={"large"}
              color={colors.green}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <Image
              source={require("../assets/money.png")}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
                // tintColor: colors.primary,
              }}
            ></Image>
          )}

          <Text
            style={{
              marginTop: 5,
              fontSize: 10,
              fontWeight: "700",
              color: colors.green,
              letterSpacing: 0.1,
            }}
          >
            CASH HOLDING AMOUNT
          </Text>

          <Text
            style={{
              marginTop: 2,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            INR{" "}
            {apiSuccess &&
            cashCollection &&
            Object.keys(cashCollection).length > 0
              ? cashCollection.collectionamount
              : "00.00"}
          </Text>

          <Text style={{ fontSize: 10, marginTop: 5, color: colors.grey }}>
            Cash Holding Limit{" "}
            <Text style={{ fontWeight: "800" }}>
              INR{" "}
              {apiSuccess &&
              collectionLimit &&
              Object.keys(collectionLimit).length > 0
                ? collectionLimit.cashlimt
                : "00.00"}
            </Text>
          </Text>
        </View>

        <View
          style={{
            borderRadius: 10,
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: 50,
            paddingTop: 10,
            paddingBottom: 5,
            borderWidth: 3,
            borderColor: colors.blueShade,
            // ...iosShadow,
          }}
        >
          {collectorDashboardApi.loading ? (
            <ActivityIndicator
              size={"large"}
              color={colors.blueShade}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <Image
              source={require("../assets/cheque.png")}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
                // tintColor: colors.primary,
              }}
            ></Image>
          )}
          <Text
            style={{
              marginTop: 5,
              fontSize: 10,
              fontWeight: "700",
              color: colors.blueShade,
              letterSpacing: 0.1,
            }}
          >
            CHEQUE HOLDING AMOUNT
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            INR{" "}
            {apiSuccess &&
            chequeCollection &&
            Object.keys(chequeCollection).length > 0
              ? chequeCollection.collectionamount
              : "00.00"}
          </Text>
          <Text style={{ fontSize: 10, marginTop: 5, color: colors.grey }}>
            Cheque Holding Limit{" "}
            <Text style={{ fontWeight: "800" }}>
              INR{" "}
              {apiSuccess &&
              collectionLimit &&
              Object.keys(collectionLimit).length > 0
                ? collectionLimit.chequelimit
                : "00.00"}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    // padding: 20,
    marginVertical: 20,
  },
});

export default DashboardScreen;
