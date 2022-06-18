import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import {
  Button,
  Portal,
  Dialog,
  Paragraph,
  Provider,
} from "react-native-paper";

// const listings = [
//   {
//     id: 1,
//     title: "Red jacket for sale",
//     price: 100,
//     image: require("../assets/jacket.jpg"),
//   },
//   {
//     id: 2,
//     title: "Couch in great condition",
//     price: 1000,
//     image: require("../assets/couch.jpg"),
//   },
// ];

function ReportScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 10,
              alignItems: "center",
              padding: 20,
              borderWidth: 3,
              borderColor: colors.primary,
            }}
            onPress={() => navigation.navigate(routes.COLLECTION_REPORT)}
          >
            {/* <Image
              source={require("../assets/india.png")}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
            ></Image> */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.primary,
              }}
            >
              COLLECTED DONATIONS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: 20,
              borderRadius: 10,
              alignItems: "center",
              padding: 20,
              borderWidth: 3,
              borderColor: colors.secondary,
            }}
            onPress={() => navigation.navigate(routes.BANK_DEPOSIT_REPORT)}
          >
            {/* <Image
              source={require("../assets/globe.png")}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
            ></Image> */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.secondary,
              }}
            >
              BANK DEPOSITS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{}}>
        <Button
          mode="contained"
          style={{ backgroundColor: colors.secondary }}
          labelStyle={{ color: colors.white }}
          onPress={() => navigation.navigate(routes.DASHBOARD)}
        >
          Back to Dashboard
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    justifyContent: "space-between",
  },
});

export default ReportScreen;
