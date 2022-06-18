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

function DonorNationalityScreen({ navigation }) {
  const [donorNationality, setDonorNationality] = useState("Indian");

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  const MyAlert = () => {
    return (
      <Provider>
        <Portal>
          <Dialog
            style={{ borderRadius: 10 }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Content
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/sorry.png")}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "contain",
                }}
              ></Image>
              <Text style={{ marginTop: 10 }}>Sorry, Donation by a </Text>
              <Text> foreign national is not allowed</Text>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </Provider>
    );
  };

  const handleProceed = () => {
    if (donorNationality === "Foreigner") {
      setVisible(true);
      return;
    }
    navigation.navigate(routes.DONOR_PHONE, donorNationality);
  };

  return (
    <Screen style={styles.screen}>
      <View>
        {/* <Text style={{ fontWeight: "500" }}>Donor Nationality is</Text> */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 10,
              alignItems: "center",
              padding: 20,
              borderWidth: 3,
              borderColor:
                donorNationality === "Indian" ? colors.secondary : colors.grey,
            }}
            onPress={() => setDonorNationality("Indian")}
          >
            <Image
              source={require("../assets/india.png")}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
            ></Image>
            <Text
              style={{
                marginTop: 10,
                fontSize: 18,
                fontWeight: "bold",
                color:
                  donorNationality === "Indian"
                    ? colors.secondary
                    : colors.grey,
              }}
            >
              INDIAN
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 10,
              alignItems: "center",
              marginLeft: 10,
              padding: 20,
              borderWidth: 3,
              borderColor:
                donorNationality === "Foreigner"
                  ? colors.secondary
                  : colors.grey,
            }}
            onPress={() => setDonorNationality("Foreigner")}
          >
            <Image
              source={require("../assets/globe.png")}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
            ></Image>
            <Text
              style={{
                marginTop: 10,
                fontSize: 18,
                fontWeight: "bold",
                color:
                  donorNationality === "Foreigner"
                    ? colors.secondary
                    : colors.grey,
              }}
            >
              FOREIGNER
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <MyAlert />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button
          mode="contained"
          style={{ width: 150, backgroundColor: colors.grey }}
          labelStyle={{ color: colors.white }}
          onPress={() => navigation.navigate(routes.DASHBOARD)}
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
          onPress={() => handleProceed()}
        >
          Proceed
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

export default DonorNationalityScreen;
