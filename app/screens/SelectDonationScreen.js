import React, { useState, useEffect, useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import allApi from '../api/allApi';

import colors from '../config/colors';
import routes from '../navigation/routes';
import Screen from '../components/Screen';
import { Button } from 'react-native-paper';
import { MaskedTextInput } from 'react-native-mask-text';

import { Dropdown } from 'react-native-element-dropdown';
import AuthContext from '../auth/context';

function SelectDonationScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const [amount, setAmount] = React.useState('');
  const [amountError, setAmountError] = useState(false);
  const [rangeError, setRangeError] = useState(false);
  const [selectedDonationType, setSelectedDonationType] = useState({});
  const [donationTypeData, setDonationTypeData] = useState([]);
  const [apiErrorMsg, setApiErrorMsg] = useState('');

  let donorData = route.params;

  const { data, error, loading, request } = useApi(allApi.donationTypeList);

  useEffect(() => {
    request(user);
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      if (data.status === 1) {
        setDonationTypeData(data.result.data);
      } else {
        setApiErrorMsg(data.message);
      }
    }
  }, [data]);

  useEffect(() => {
    selectedDonationType.donation_type === 'F'
      ? setAmount(selectedDonationType.fixed_amount)
      : setAmount('');
  }, [selectedDonationType]);

  const checkRange = () => {
    if (
      selectedDonationType &&
      Object.keys(selectedDonationType).length > 0 &&
      selectedDonationType.donation_type === 'V' &&
      !(
        parseFloat(selectedDonationType.minimum_amount) <= parseFloat(amount) &&
        parseFloat(selectedDonationType.maximum_amount) >= parseFloat(amount)
      )
    ) {
      setRangeError(true);
      return true;
    }
    return false;
  };

  const handleProceed = () => {
    let donorDataAll = {};
    const checkRangeError = checkRange();
    if (
      !amount &&
      selectedDonationType &&
      Object.keys(selectedDonationType).length === 0
    ) {
      setAmountError(true);
      return;
    }

    if (checkRangeError) return;

    donorDataAll = {
      ...donorData,
      donation_amount: amount,
      donation_id: selectedDonationType.donation_id,
      selectedDonationType,
    };
    navigation.navigate(routes.COLLECTION_MODE, donorDataAll);
  };

  // const donationTypeData = [
  //   { label: "Item 1", value: "1", amount: "100" },
  //   { label: "Item 2", value: "2", amount: "3454" },
  //   { label: "Item 3", value: "3", amount: "344" },
  //   { label: "Item 4", value: "4", amount: "567" },
  //   { label: "Item 5", value: "5", amount: "231" },
  //   { label: "Item 6", value: "6", amount: "3455" },
  //   { label: "Item 7", value: "7", amount: "234" },
  //   { label: "Item 8", value: "8", amount: "4576" },
  // ];

  const _renderItem = (item) => {
    return (
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor:
            item.donation_id === selectedDonationType.donation_id
              ? colors.primary
              : colors.greyShade,
          borderBottomWidth: 2,
          borderBottomColor: colors.white,
        }}
      >
        <Text
          style={{
            fontSize: 14,
          }}
        >
          {item.donation_name}
        </Text>
        {item.fixed_amount > 0 ? (
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            INR {parseFloat(item.fixed_amount).toFixed(2)}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <Screen
      style={{
        padding: 10,
        paddingBottom: 20,
        justifyContent: 'space-between',
      }}
    >
      <ScrollView
        style={{ padding: 10 }}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        contentInsetAdjustmentBehavior='always'
      >
        {loading ? (
          <ActivityIndicator size='large' color={colors.primary} />
        ) : null}

        {!error && !loading && (
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.shadow}
            maxHeight={350}
            data={donationTypeData}
            // search
            // searchPlaceholder="Search"
            labelField='donation_name'
            valueField='donation_id'
            label='donation_name'
            labelStyle={{ fontSize: 30 }}
            placeholder='Select any donation type'
            value={selectedDonationType?.donation_id}
            onChange={(item) => {
              setSelectedDonationType(item);
              setAmount('');
              setAmountError(false);
              setRangeError(false);
            }}
            // renderLeftIcon={() => (
            //   <Image
            //     style={styles.icon}
            //     source={require("../assets/sorry.png")}
            //   />
            // )}
            renderItem={(item) => _renderItem(item)}
            textError='Error'
          />
        )}

        {selectedDonationType &&
        Object.keys(selectedDonationType).length > 0 ? (
          <>
            {selectedDonationType.donation_type === 'V' ? (
              <Text style={{ marginTop: 20, color: colors.secondary }}>
                Please enter any amount between
                {` ${selectedDonationType.minimum_amount} - ${selectedDonationType.maximum_amount}`}
              </Text>
            ) : null}
            <View
              style={{
                marginTop: 20,
                backgroundColor: colors.greyShade,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 5,
              }}
            >
              <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                {selectedDonationType.donation_name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: colors.primary,
                    padding: 5,
                    borderRadius: 4,
                    width: 130,
                    height: 30,
                  }}
                >
                  <Text style={{ color: colors.white, fontWeight: '800' }}>
                    INR
                  </Text>
                  {/* <MaskedTextInput
              type="currency"
              options={{
                // prefix: "$",
                decimalSeparator: ".",
                // groupSeparator: ",",
                precision: 2,
              }}
              onChangeText={(text, rawText) => {
                setAmount(text);
              }}
              // onChangeText={(newAmount) => setAmount(newAmount)}
              value={amount}
              style={{
                // width: 80,
                textAlign: "right",
                paddingRight: 10,
                color: colors.white,
                fontWeight: "bold",
              }}
              selectionColor={colors.white}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={colors.white}
            /> */}
                  <TextInput
                    type='currency'
                    style={{
                      width: 80,
                      textAlign: 'right',
                      paddingRight: 10,
                      color: colors.white,
                      fontWeight: 'bold',
                    }}
                    selectionColor={colors.white}
                    onChangeText={(newAmount) => {
                      setAmount(newAmount);
                      setAmountError(false);
                      setRangeError(false);
                      // setSelectedDonationType(null);
                    }}
                    value={amount.toString()}
                    placeholder='0.00'
                    keyboardType='numeric'
                    placeholderTextColor={colors.white}
                    editable={selectedDonationType.donation_type === 'V'}
                  />
                  {/* <TextInput
            mode="flat"
            placeholder="0.00"
            left={
              <TextInput.Affix
                text="INR  "
                theme={{ colors: { text: colors.white } }}
                style={{ marginRight: 10, fontWeight: "bold" }}
              />
            }
            activeUnderlineColor={colors.primary}
            underlineColor={colors.primary}
            selectionColor={colors.white}
            value={phoneNumber}
            onChangeText={(number) => setPhoneNumber(number)}
            keyboardType="numeric"
            theme={{ colors: { text: colors.white } }}
            style={{
              backgroundColor: colors.primary,
              width: 130,
              height: 30,
              borderRadius: 4,
              color: colors.white,
            }}
          /> */}
                </View>
              </View>
            </View>
          </>
        ) : null}

        {amountError && (
          <Text style={{ marginTop: 10, color: colors.danger }}>
            Please select a donation type
          </Text>
        )}
        {rangeError && (
          <Text style={{ marginTop: 10, color: colors.danger }}>
            Please enter amount between the specified range
          </Text>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <Button
          mode='contained'
          style={{ width: 150, backgroundColor: colors.grey }}
          labelStyle={{ color: colors.white }}
          onPress={() => navigation.goBack()}
        >
          Back
        </Button>
        <Button
          mode='contained'
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

export default SelectDonationScreen;

const styles = StyleSheet.create({
  dropdown: {
    borderColor: colors.primary,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 5,
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  shadow: {
    marginTop: Platform.OS === 'android' ? -25 : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
