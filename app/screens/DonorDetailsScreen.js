import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import moment from 'moment';

import colors from '../config/colors';
import routes from '../navigation/routes';
import Screen from '../components/Screen';
import { Button, TextInput } from 'react-native-paper';
// import { Dropdown } from "react-native-element-dropdown";
import DropDown from 'react-native-paper-dropdown';
import { isNumber } from '../lib';
import { DatePickerInput } from 'react-native-paper-dates';

function DonorDetailsScreen({ navigation, route }) {
  const ref = React.useRef(null);

  const dateFormat = 'DD-MM-YYYY';
  const dateFormatForSubmit = 'YYYY-MM-DD';

  const donorData = route.params;

  const [showDropDown, setShowDropDown] = useState(false);

  const [donor_type, setdonor_type] = useState('new');
  const [allError, setAllError] = useState(false);

  const [donor_phone, setdonor_phone] = useState('');
  const [donor_phoneError, setdonor_phoneError] = useState(false);

  const [donor_name, setdonor_name] = useState('');
  const [donor_nameError, setdonor_nameError] = useState(false);

  const [donor_gender, setdonor_gender] = useState('');
  const [gender_error, setgender_Error] = useState(false);
  const genderList = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Others',
      value: 'Others',
    },
  ];

  const [donor_dob, setdonor_dob] = useState(new Date());
  const [donor_dobError, setdonor_dobError] = useState(false);

  const [donor_address_one, setdonor_address_one] = useState('');
  const [donor_address_oneError, setdonor_address_oneError] = useState(false);

  const [donor_country, setdonor_country] = useState('');
  const [donor_countryError, setdonor_countryError] = useState(false);

  const [donor_state, setdonor_state] = useState('');
  const [donor_stateError, setdonor_stateError] = useState(false);

  const [donor_district, setdonor_district] = useState('');
  const [donor_districtError, setdonor_districtError] = useState(false);

  const [donor_city, setdonor_city] = useState('');
  const [donor_cityError, setdonor_cityError] = useState(false);

  const [donor_pincode, setdonor_pincode] = useState('');
  const [donor_pincodeError, setdonor_pincodeError] = useState(false);

  const [donor_email, setdonor_email] = useState('');
  const [donor_emailError, setdonor_emailError] = useState(false);

  const [certificate_require, setcertificate_require] = useState('yes');
  const [certificate_requireError, setcertificate_requireError] =
    useState(false);

  const [donor_panno, setdonor_panno] = useState('');
  const [donor_pannoError, setdonor_pannoError] = useState(false);

  useEffect(() => {
    if (donorData && Object.keys(donorData).length > 1) {
      setdonor_type('old');
    }
    if (donorData && Object.keys(donorData).length === 1) {
      setdonor_type('new');
      setdonor_phone(donorData.donor_phone);
    }
  }, []);

  const validateEmail = (email) => {
    let reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  };

  const checkData = () => {
    if (donor_phone.trim() === '') return false;
    if (donor_name.trim() === '') return false;
    if (donor_gender.trim() === '') return false;
    if (donor_dob === '') return false;
    if (donor_address_one.trim() === '') return false;
    // if (donor_country.trim() === "") return false;
    if (donor_state.trim() === '') return false;
    if (donor_district.trim() === '') return false;
    if (donor_city.trim() === '') return false;
    if (donor_pincode.trim() === '') return false;
    // if (donor_email.trim() === "") return false;

    return true;
  };

  const handleProceed = () => {
    let donorDataAll = {};

    // if (certificate_require === "yes" && donor_panno.trim() === "") {
    //   setdonor_pannoError(true);
    //   ref.current.scrollToEnd();
    //   return false;
    // }

    if (donor_type === 'old') {
      donorDataAll = { ...donorData, donor_type };
    }
    if (donor_type === 'new') {
      if (!checkData()) {
        setAllError(true);
        ref.current.scrollTo({ x: 0, y: 0, animated: true });
        return false;
      }
      if (donor_phone.length !== 10 || !isNumber(donor_phone)) {
        setdonor_phoneError(true);
        ref.current.scrollTo({ x: 10, y: 10, animated: true });
        // ref.current.scrollToMiddle();
        return false;
      }

      const toDateFormat = moment(new Date(donor_dob)).format(dateFormat);
      if (!moment(toDateFormat, dateFormat, true).isValid()) {
        setdonor_dobError(true);
        ref.current.scrollTo({ x: 50, y: 50, animated: true });
        return false;
      }

      if (donor_email.length > 0 && !validateEmail(donor_email)) {
        setdonor_emailError(true);
        ref.current.scrollTo({ x: 40, y: 40, animated: true });
        return false;
      }

      donorDataAll = {
        donor_type,
        donor_phone: '+91' + donor_phone,
        donor_name,
        donor_gender,
        donor_dob: moment(new Date(donor_dob)).format(dateFormatForSubmit),
        donor_address_one,
        donor_country: 'India',
        donor_state,
        donor_district,
        donor_city,
        donor_pincode,
        donor_email: donor_email.length > 0 ? donor_email : 'NA',
        certificate_require: 'NA',
        donor_panno: 'NA',
      };
    }

    navigation.navigate(routes.SELECT_DONATION, donorDataAll);
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        ref={ref}
        style={{ padding: 10 }}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        contentInsetAdjustmentBehavior='always'
      >
        {donor_type === 'old' ? (
          <View>
            <View>
              <Text style={{ fontSize: 12 }}>Donor Mobile No.</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.donor_phone}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>Full Name</Text>
              <Text style={{ fontWeight: 'bold' }}>{donorData.donor_name}</Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>Gender</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.donor_gender}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>Date of Birth</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {moment(donorData.donor_dob).format(dateFormat)}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>Address</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.donor_address_one}
              </Text>
            </View>

            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>State</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {donorData.donor_state}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>District</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {donorData.donor_district}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>City/Village</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {donorData.donor_city}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>PIN</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {donorData.donor_pincode}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>Country</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.donor_country}
              </Text>
            </View>

            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>Email ID</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.donor_email}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>80G Required</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.certificate_require}
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12 }}>PAN CARD No.</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {donorData.donor_panno}
              </Text>
            </View>
          </View>
        ) : donor_type === 'new' ? (
          <View>
            {allError && (
              <Text style={{ textAlign: 'center', color: colors.danger }}>
                Please enter/select all the required fields
              </Text>
            )}
            <TextInput
              donor_type='flat'
              label='Donor Mobile No.  *'
              placeholder='Enter mobile number'
              left={
                <TextInput.Affix text='+91  ' style={{ marginRight: 10 }} />
              }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={donor_phone}
              onChangeText={(number) => {
                setdonor_phone(number);
                setAllError(false);
                setdonor_phoneError(false);
              }}
              keyboardType='numeric'
              style={{ backgroundColor: colors.white }}
            />
            {donor_phoneError && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                Please enter a valid phone number
              </Text>
            )}
            <TextInput
              donor_type='flat'
              label='Full Name *'
              placeholder='Enter full name'
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={donor_name}
              maxLength={40}
              onChangeText={(text) => {
                setdonor_name(text);
                setAllError(false);
              }}
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white }}
            />
            {donor_nameError && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                Please enter Full Name
              </Text>
            )}
            <TextInput
              donor_type='flat'
              label='Email'
              placeholder='Enter email'
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={donor_email}
              onChangeText={(text) => {
                setdonor_email(text);
                setAllError(false);
                setdonor_emailError(false);
              }}
              autoCapitalize='none'
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white }}
            />
            {donor_emailError && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                Please enter valid email
              </Text>
            )}
            {/* <TextInput
              donor_type="flat"
              label="Gender"
              placeholder="Enter gender"
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={donor_name}
              maxLength={40}
              onChangeText={(text) => setdonor_name(text)}
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white }}
            />
            {donor_phoneError && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                Please enter full name
              </Text>
            )} */}
            <View style={{}}>
              <DropDown
                label={'Gender *'}
                donor_type={'flat'}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={donor_gender}
                setValue={setdonor_gender}
                list={genderList}
                // theme={{ colors: { background: colors.white } }}
                activeColor={colors.primary}
                // inputProps={{ backgroundColor: colors.white }}
                inputProps={{
                  style: {
                    // borderColor: colors.white,
                    backgroundColor: colors.white,
                  },
                  activeColor: colors.primary,
                  underlineColor: colors.grey,
                  activeOutlineColor: colors.primary,
                }}
                // containerStyle={styles.shadow}
                dropDownStyle={styles.shadow}
                // accessibilityLabel={{ backgroundColor: colors.white }}
              />
              {gender_error && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please select gender
                </Text>
              )}
            </View>

            {/* <View style={{ marginTop: 18 }}>
              <Dropdown
                style={{
                  paddingHorizontal: 10,
                  paddingBottom: 10,
                  borderBottomColor: colors.grey,
                  borderBottomWidth: 1,
                }}
                containerStyle={styles.shadow}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={genderList}
                maxHeight={180}
                labelField="label"
                valueField="value"
                placeholder="Select gender *"
                placeholderStyle={{ fontSize: 16 }}
                value={donor_gender}
                onChange={(item) => {
                  setdonor_gender(item.value);
                }}
                activeColor={colors.primary}
                // renderLeftIcon={() => (
                //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                // )}
              />
              {gender_error && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please select gender
                </Text>
              )}
            </View> */}
            <DatePickerInput
              mode='flat'
              locale='en-GB'
              error
              label='Date of birth *'
              value={donor_dob}
              onChange={(d) => {
                setdonor_dob(d);
                setAllError(false);
                setdonor_dobError(false);
              }}
              // onChange={(d) => setInputDate(d)}
              inputMode='start'
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              style={{ backgroundColor: colors.white, marginTop: 2 }}
              validRange={{
                // startDate: new Date(2021, 1, 2),  // optional
                endDate: new Date(), // optional
                // disabledDates: [new Date()], // optional
              }}
              // mode="outlined" (see react-native-paper docs)
              // other react native TextInput props
            />
            {/* <TextInput
                donor_type="flat"
                label="Date of Birth *"
                placeholder="dd-mm-yyyy"
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={donor_dob}
                onChangeText={(number) => {
                  setdonor_dob(number);
                  setAllError(false);
                  setdonor_dobError(false);
                }}
                keyboardType="numeric"
                style={{ backgroundColor: colors.white }}
              /> */}
            {donor_dobError ? (
              <Text
                style={{ marginLeft: 10, color: colors.danger, marginTop: -20 }}
              >
                Please enter date in DD/MM/YYYY format
              </Text>
            ) : (
              <View style={{ marginTop: -20 }}></View>
            )}
            <TextInput
              donor_type='flat'
              label='Address *'
              placeholder='Enter Address'
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={donor_address_one}
              maxLength={40}
              onChangeText={(text) => {
                setdonor_address_one(text);
                setAllError(false);
              }}
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white }}
            />
            {donor_address_oneError && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                Please enter address
              </Text>
            )}

            {/* <TextInput
              donor_type="flat"
              label="Country *"
              placeholder="Enter Country"
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={donor_country}
              maxLength={40}
              onChangeText={(text) => {
                setdonor_country(text);
                setAllError(false);
              }}
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white }}
            />
            {donor_countryError && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                Please enter country
              </Text>
            )} */}

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <TextInput
                donor_type='flat'
                label='PIN *'
                placeholder='Enter pin code'
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={donor_pincode}
                onChangeText={(number) => {
                  setdonor_pincode(number);
                  setAllError(false);
                }}
                maxLength={6}
                keyboardType='numeric'
                style={{
                  backgroundColor: colors.white,
                  flex: 1,
                  marginRight: 5,
                }}
              />
              {donor_pincodeError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter pin
                </Text>
              )}
              <TextInput
                donor_type='flat'
                label='City/Village *'
                placeholder='Enter city/village'
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={donor_city}
                onChangeText={(number) => {
                  setdonor_city(number);
                  setAllError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  flex: 1,
                  marginLeft: 5,
                }}
              />
              {donor_cityError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter city/village name
                </Text>
              )}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TextInput
                donor_type='flat'
                label='District *'
                placeholder='Enter district'
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={donor_district}
                onChangeText={(number) => {
                  setdonor_district(number);
                  setAllError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  flex: 1,
                  marginRight: 5,
                }}
              />
              {donor_districtError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter district
                </Text>
              )}
              <TextInput
                donor_type='flat'
                label='State *'
                placeholder='Enter state'
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={donor_state}
                onChangeText={(number) => {
                  setdonor_state(number);
                  setAllError(false);
                }}
                // keyboardType="numeric"
                style={{
                  backgroundColor: colors.white,
                  flex: 1,
                  marginLeft: 5,
                }}
              />
              {donor_stateError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter state
                </Text>
              )}
            </View>

            {/* <View
              style={{
                paddingHorizontal: 10,
                marginTop: 15,
                paddingBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: colors.grey,
              }}
            >
              <Text style={{ fontSize: 16 }}>80G Required </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <TouchableOpacity onPress={() => setcertificate_require("yes")}>
                  <Text style={{ color: colors.secondary }}>Yes</Text>
                </TouchableOpacity>
                <RadioButton
                  color={colors.primary}
                  value="yes"
                  status={
                    certificate_require === "yes" ? "checked" : "unchecked"
                  }
                  onPress={() => setcertificate_require("yes")}
                  style={{}}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <TouchableOpacity onPress={() => setcertificate_require("no")}>
                  <Text style={{ color: colors.secondary }}>No</Text>
                </TouchableOpacity>
                <RadioButton
                  color={colors.primary}
                  value="no"
                  status={
                    certificate_require === "no" ? "checked" : "unchecked"
                  }
                  onPress={() => setcertificate_require("no")}
                />
              </View>
            </View>
            <TextInput
              donor_type="flat"
              label="PAN NO"
              placeholder="Enter PAN No."
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              maxLength={10}
              value={donor_panno}
              onChangeText={(text) => {
                setdonor_panno(text);
                setAllError(false);
                setdonor_pannoError(false);
              }}
              autoCapitalize="characters"
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white, marginBottom: 15 }}
            />
            {donor_pannoError && (
              <Text
                style={{
                  marginLeft: 10,
                  color: colors.danger,
                  marginBottom: 10,
                }}
              >
                Pan is mandatory if 80G is required
              </Text>
            )}*/}
          </View>
        ) : null}
      </ScrollView>
      <View
        style={{
          marginTop: 15,
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
          onPress={handleProceed}
        >
          Proceed
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },

  icon: {
    marginRight: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  shadow: {
    marginTop: Platform.OS === 'android' ? 40 : 70,
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

export default DonorDetailsScreen;
