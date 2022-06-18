import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { Button, TextInput } from "react-native-paper";
import AuthContext from "../auth/context";
import allApi from "../api/allApi";
import { isNumber } from "../lib";

function DonorPhoneScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [donorList, setDonorList] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState({});
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);

  const donorNationality = route.params;

  const { data, error, loading, request } = useApi(allApi.donarList);
  const selectedDonorDetails = useApi(allApi.donarDetails);

  useEffect(() => {
    setPhoneNumberError(false);
  }, [phoneNumber]);

  const getDonorList = () => {
    setApiSuccess(false);
    if (phoneNumber && phoneNumber.length === 10 && isNumber(phoneNumber)) {
      let apiPayload = {
        user_id: user.user_id,
        donor_phone: "+91" + phoneNumber,
      };
      request({ apiPayload, token: user.token });
    } else {
      setPhoneNumberError(true);
    }
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      if (data.status === 1) {
        setApiSuccess(true);
        setDonorList(data.result.data);
      } else {
        setApiErrorMsg(data.message);
      }
    }
  }, [data]);

  useEffect(() => {
    if (
      selectedDonorDetails.data &&
      Object.keys(selectedDonorDetails.data).length > 0
    ) {
      if (selectedDonorDetails.data.status === 1) {
        let donorData = {
          ...selectedDonorDetails.data.result.data,
        };
        navigation.navigate(routes.DONOR_DETAILS, donorData);
      } else {
        setApiErrorMsg(selectedDonorDetails.data.message);
      }
    }
  }, [selectedDonorDetails.data]);

  const getSelectedDonorDetails = () => {
    let apiPayload = {
      user_id: user.user_id,
      donor_phone: "+91" + phoneNumber,
      ...selectedDonor,
    };
    selectedDonorDetails.request({ apiPayload, token: user.token });
  };

  const handleProceed = () => {
    setApiErrorMsg("");
    if (phoneNumber && phoneNumber.length === 10 && isNumber(phoneNumber)) {
      if (selectedDonor && Object.keys(selectedDonor).length === 0) {
        let donorData = {
          donor_phone: phoneNumber,
        };
        navigation.navigate(routes.DONOR_DETAILS, donorData);
      } else {
        getSelectedDonorDetails();
      }
    } else {
      setPhoneNumberError(true);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        marginBottom: 5,
        borderRadius: 10,
        alignItems: "center",
        padding: 5,
        borderWidth: 3,
        borderColor:
          selectedDonor.donor_id === item.donor_id
            ? colors.primary
            : colors.grey,
      }}
      onPress={() => setSelectedDonor(item)}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color:
            selectedDonor.donor_id === item.donor_id
              ? colors.primary
              : colors.grey,
        }}
      >
        {item.donor_name}
      </Text>
    </TouchableOpacity>
  );

  const listFooterComponent = () => (
    <TouchableOpacity
      style={{
        flex: 1,
        marginTop: 5,
        borderRadius: 10,
        alignItems: "center",
        padding: 5,
        borderWidth: 3,
        borderColor:
          selectedDonor && Object.keys(selectedDonor).length === 0
            ? colors.primary
            : colors.grey,
      }}
      onPress={() => setSelectedDonor({})}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color:
            selectedDonor && Object.keys(selectedDonor).length === 0
              ? colors.primary
              : colors.grey,
        }}
      >
        Add new
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen
      style={{
        padding: 20,
        justifyContent: "space-between",
      }}
    >
      <View>
        <TextInput
          mode="flat"
          label="Donor's Mobile No."
          placeholder="Enter mobile number"
          left={<TextInput.Affix text="+91  " style={{ marginRight: 10 }} />}
          activeUnderlineColor={colors.primary}
          underlineColor={colors.grey}
          value={phoneNumber}
          onChangeText={(number) => setPhoneNumber(number)}
          keyboardType="numeric"
          style={{ backgroundColor: colors.white }}
        />
        {phoneNumberError && (
          <Text style={{ marginTop: 10, color: colors.danger }}>
            Please enter a valid phone number
          </Text>
        )}
        <Button
          mode="contained"
          loading={loading}
          style={{
            marginTop: 15,
            backgroundColor: colors.secondary,
          }}
          labelStyle={{ color: colors.white }}
          onPress={getDonorList}
        >
          Get details
        </Button>
        {donorList.length > 0 && apiSuccess ? (
          <FlatList
            style={{ marginTop: 10 }}
            data={donorList}
            renderItem={renderItem}
            ListFooterComponent={listFooterComponent}
            keyExtractor={(item) => item.donor_name}
          />
        ) : apiSuccess ? (
          <Text style={{ marginTop: 5 }}>
            No previous details found, Please press on "ADD NEW" to enter new
            details
          </Text>
        ) : null}
      </View>
      {apiErrorMsg ? (
        <Text style={{ textAlign: "center", color: colors.danger }}>
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
          labelStyle={{ color: colors.white }}
          onPress={() => navigation.goBack()}
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
          onPress={handleProceed}
          loading={selectedDonorDetails.loading}
          disabled={!apiSuccess}
        >
          {donorList.length === 0 && apiSuccess ? "Add new" : "Proceed"}
        </Button>
      </View>
    </Screen>
  );
}

export default DonorPhoneScreen;
