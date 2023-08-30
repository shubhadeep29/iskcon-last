import React, { useState, useEffect, useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import moment from 'moment';

import colors from '../config/colors';
import routes from '../navigation/routes';
import Screen from '../components/Screen';
import { Button, Dialog, RadioButton, TextInput } from 'react-native-paper';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';

import allApi from '../api/allApi';
import useApi from '../hooks/useApi';
import AuthContext from '../auth/context';
import { StackActions, useFocusEffect } from '@react-navigation/native';

function CollectionModeScreen({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const navStateIndex = navigation?.getState()?.index;

  const donorData = route.params;

  const [cashLimitReach, setCashLimitReach] = useState(false);
  const [chequeLimitReach, setChequeLimitReach] = useState(false);

  const [collectorDashboardApiSuccess, setCollectorDashboardApiSuccess] =
    useState(false);

  const [cashCollection, setCashCollection] = useState({});
  const [chequeCollection, setChequeCollection] = useState({});
  const [collectionLimit, setCollectionLimit] = useState({});
  const [qrCodeLink, setQrCodeLink] = useState('');

  const collectorDashboardApi = useApi(allApi.collectorDashboard);

  const checkCashLimit = () => {
    let cashCollectedAmount =
      cashCollection && Object.keys(cashCollection).length > 0
        ? cashCollection.collectionamount
        : 0;
    let cashCollectionLimit =
      collectionLimit && Object.keys(collectionLimit).length > 0
        ? collectionLimit.cashlimt
        : 0;
    if (
      parseFloat(cashCollectionLimit) >=
      parseFloat(cashCollectedAmount) + parseFloat(donorData.donation_amount)
    ) {
      setCashLimitReach(false);
      return false;
    }
    setCashLimitReach(true);
    return true;
  };

  const checkChequeLimit = () => {
    let chequeCollectedAmount =
      chequeCollection && Object.keys(chequeCollection).length > 0
        ? chequeCollection.collectionamount
        : 0;
    let chequeCollectionLimit =
      collectionLimit && Object.keys(collectionLimit).length > 0
        ? collectionLimit.chequelimit
        : 0;
    if (
      parseFloat(chequeCollectionLimit) >=
      parseFloat(chequeCollectedAmount) + parseFloat(donorData.donation_amount)
    ) {
      setChequeLimitReach(false);
      return false;
    }
    setChequeLimitReach(true);
    return true;
  };

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
              (item) => item.payment_mode === 'CASH'
            );
          let chequeCollectionData =
            collectorDashboardApi.data.result.data.collectiondetails.find(
              (item) => item.payment_mode === 'CHEQUE'
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
        // checkCashLimit();
        // checkChequeLimit();
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

  const dateFormat = 'DD-MM-YYYY';
  const dateFormatForSubmit = 'YYYY-MM-DD';
  const panReg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

  const [collectionMode, setCollectionMode] = useState('cash');

  const { data, error, loading, request } = useApi(allApi.donarPayment);

  const [cheque_no, setcheque_no] = useState('');
  const [cheque_noError, setcheque_noError] = useState(false);

  const [cheque_date, setcheque_date] = useState(new Date());
  const [cheque_dateError, setcheque_dateError] = useState(false);

  const [bank_name, setbank_name] = useState('');
  const [bank_nameError, setbank_nameError] = useState(false);

  const [bank_branch, setbank_branch] = useState('');
  const [bank_branchError, setbank_branchError] = useState(false);

  const [payment_reference_no, setpayment_reference_no] = useState('');
  const [payment_reference_noError, setpayment_reference_noError] =
    useState(false);

  const [certificate_require, setcertificate_require] = useState('no');
  const [certificate_requireError, setcertificate_requireError] =
    useState(false);

  const [donor_panno, setdonor_panno] = useState('');
  const [donor_pannoError, setdonor_pannoError] = useState(false);
  const [donor_pannoFormatError, setdonor_pannoFormatError] = useState(false);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      if (data.status === 1) {
        setApiSuccess(true);
        console.log(Object.keys(data.result.data).length);
        if (Object.keys(data.result.data).length > 0) {
          setReceiptNo(data.result.data.receipt_no);
        } else {
          setReceiptNo('');
        }
      } else {
        setApiErrorMsg(data.message);
      }
    }
  }, [data]);

  const MyAlert = () => {
    console.log('receiptNo', receiptNo);
    return (
      <Dialog style={{ borderRadius: 10 }} visible={apiSuccess}>
        <Dialog.Content
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/check.png')}
            style={{
              width: 80,
              height: 80,
              resizeMode: 'contain',
            }}
          ></Image>
          <Text style={{ marginTop: 10 }}>That's awesome </Text>
          <Text>Donation successful</Text>
          <Text>Receipt # {receiptNo}</Text>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Button
            mode='contained'
            onPress={() => {
              navStateIndex === 5
                ? navigation.dispatch(StackActions.popToTop())
                : navigation.navigate(routes.DASHBOARD);
            }}
            labelStyle={{ color: colors.white }}
          >
            Go to dashboard
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  const cashSubmit = () => {
    if (checkCashLimit()) return false;

    let dataToSubmit = { ...donorData };

    delete dataToSubmit.selectedDonationType;

    let apiPayload = {
      user_id: user.user_id,
      payment_mode: collectionMode,
      ...dataToSubmit,
    };
    request({ apiPayload, token: user.token });
  };

  const chequeSubmit = () => {
    if (checkChequeLimit()) return false;

    if (cheque_no.trim() === '' || cheque_no.length !== 6) {
      setcheque_noError(true);
      return false;
    }

    const toDateFormat = moment(new Date(cheque_date)).format(dateFormat);
    if (!moment(toDateFormat, dateFormat, true).isValid()) {
      setcheque_dateError(true);
      return false;
    }

    if (bank_name.trim() === '') {
      setbank_nameError(true);
      return false;
    }

    if (bank_branch.trim() === '') {
      setbank_branchError(true);
      return false;
    }

    if (certificate_require === 'yes' && donor_panno.trim() === '') {
      setdonor_pannoError(true);
      return false;
    }

    if (donor_panno.length > 0 && panReg.test(donor_panno) === false) {
      setdonor_pannoFormatError(true);
      return false;
    }

    let dataToSubmit = { ...donorData };

    delete dataToSubmit.selectedDonationType;

    dataToSubmit.certificate_require = certificate_require;
    dataToSubmit.donor_panno = donor_panno;
    if (donor_panno.trim() === '') {
      dataToSubmit.donor_panno = 'NA';
    }

    let apiPayload = {
      user_id: user.user_id,
      payment_mode: collectionMode,
      cheque_no: cheque_no,
      cheque_date: moment(new Date(cheque_date)).format(dateFormatForSubmit),
      bank_name: bank_name,
      bank_branch: bank_branch,
      ...dataToSubmit,
    };
    request({ apiPayload, token: user.token });
  };

  const upiSubmit = () => {
    if (payment_reference_no.trim() === '') {
      setpayment_reference_noError(true);
      return false;
    }

    if (certificate_require === 'yes' && donor_panno.trim() === '') {
      setdonor_pannoError(true);
      return false;
    }

    if (donor_panno.length > 0 && panReg.test(donor_panno) === false) {
      setdonor_pannoFormatError(true);
      return false;
    }

    let dataToSubmit = { ...donorData };

    delete dataToSubmit.selectedDonationType;

    dataToSubmit.certificate_require = certificate_require;
    dataToSubmit.donor_panno = donor_panno;
    if (donor_panno.trim() === '') {
      dataToSubmit.donor_panno = 'NA';
    }

    let apiPayload = {
      user_id: user.user_id,
      payment_mode: collectionMode,
      payment_reference_no: payment_reference_no,
      ...dataToSubmit,
    };
    request({ apiPayload, token: user.token });
  };

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Collect4Mayapur',
      `Details once submitted here can not be modified. Do you want to verify before submit?`,
      [
        {
          text: 'Verify Again',
          onPress: () => console.log('Verify Pressed'),
          style: 'cancel',
        },
        { text: 'Submit', onPress: () => handleSubmit() },
      ]
    );

  const handleSubmit = () => {
    setApiErrorMsg('');

    if (collectionMode === 'cash') {
      cashSubmit();
    }

    if (collectionMode === 'cheque') {
      chequeSubmit();
    }

    if (collectionMode === 'upi') {
      upiSubmit();
    }
    // navigation.navigate(routes.SELECT_DONATION, donorData);
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={{ padding: 10 }}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        contentInsetAdjustmentBehavior='always'
      >
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 4,
                alignItems: 'center',
                padding: 8,
                borderWidth: 1,
                borderColor: colors.primary,
                backgroundColor:
                  collectionMode === 'cash' ? colors.primary : colors.white,
              }}
              onPress={() => setCollectionMode('cash')}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color:
                    collectionMode === 'cash' ? colors.white : colors.black,
                }}
              >
                CASH
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 4,
                alignItems: 'center',
                padding: 8,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: colors.primary,
                backgroundColor:
                  collectionMode === 'cheque' ? colors.primary : colors.white,
              }}
              onPress={() => setCollectionMode('cheque')}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color:
                    collectionMode === 'cheque' ? colors.white : colors.black,
                }}
              >
                CHEQUE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 4,
                alignItems: 'center',
                padding: 8,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: colors.primary,
                backgroundColor:
                  collectionMode === 'upi' ? colors.primary : colors.white,
              }}
              onPress={() => setCollectionMode('upi')}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: collectionMode === 'upi' ? colors.white : colors.black,
                }}
              >
                UPI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: colors.secondary }}>
            {donorData.selectedDonationType.donation_name}
          </Text>
          <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>
            INR {Number(donorData.donation_amount).toFixed(2)}
          </Text>
        </View>

        {/* FOR cash SECTION */}
        {collectionMode === 'cash' && (
          <>
            <View
              style={{
                marginTop: 10,
                padding: 10,
                height: 40,
                alignItems: 'center',
                backgroundColor: colors.greyShade,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: colors.black }}>Cash Holding Amount</Text>
              {collectorDashboardApi.loading ? (
                <ActivityIndicator
                  color={colors.primary}
                  style={{ marginRight: 20 }}
                />
              ) : (
                <Text style={{ color: colors.black, fontWeight: 'bold' }}>
                  INR{' '}
                  {cashCollection && Object.keys(cashCollection).length > 0
                    ? cashCollection.collectionamount
                    : '00.00'}
                </Text>
              )}
            </View>
            {cashLimitReach && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                You can not add this donation by cash. because your cash
                collection limit is{' '}
                {collectionLimit && Object.keys(collectionLimit).length > 0
                  ? collectionLimit.cashlimt
                  : 0}
              </Text>
            )}
          </>
        )}

        {/* FOR cheque SECTION */}
        {collectionMode === 'cheque' && (
          <>
            <View
              style={{
                marginTop: 10,
                padding: 10,
                height: 40,
                alignItems: 'center',
                backgroundColor: colors.greyShade,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: colors.black }}>Cheque Holding Amount</Text>
              <Text style={{ color: colors.black, fontWeight: 'bold' }}>
                {collectorDashboardApi.loading ? (
                  <ActivityIndicator
                    color={colors.primary}
                    style={{ marginRight: 20 }}
                  />
                ) : (
                  <Text style={{ color: colors.black, fontWeight: 'bold' }}>
                    INR{' '}
                    {chequeCollection &&
                    Object.keys(chequeCollection).length > 0
                      ? chequeCollection.collectionamount
                      : '00.00'}
                  </Text>
                )}
              </Text>
            </View>
            {chequeLimitReach && (
              <Text style={{ marginLeft: 10, color: colors.danger }}>
                You can not add this donation by cheque. because your cheque
                collection limit is{' '}
                {collectionLimit && Object.keys(collectionLimit).length > 0
                  ? collectionLimit.chequelimit
                  : 0}
              </Text>
            )}
            <View>
              <TextInput
                mode='flat'
                label='Cheque No. *'
                placeholder='Enter Cheque number'
                // left={
                //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                // }
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={cheque_no}
                onChangeText={(number) => {
                  setcheque_no(number);
                  setcheque_noError(false);
                }}
                maxLength={6}
                keyboardType='numeric'
                style={{ backgroundColor: colors.white }}
              />
              {cheque_noError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter 6 digit number
                </Text>
              )}

              <DatePickerInput
                mode='flat'
                locale='en-GB'
                label='Cheque Date *'
                value={cheque_date}
                onChange={(d) => setcheque_date(d)}
                inputMode='start'
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                style={{ backgroundColor: colors.white }}
                // onBlur={(e) => {
                //   console.log(e);
                // }}
                validRange={{
                  // startDate: new Date(2021, 1, 2),  // optional
                  endDate: new Date(), // optional
                  // disabledDates: [new Date()], // optional
                }}
                // mode="outlined" (see react-native-paper docs)
                // other react native TextInput props
              />
              {cheque_dateError ? (
                <Text
                  style={{
                    marginLeft: 10,
                    color: colors.danger,
                    marginTop: -20,
                  }}
                >
                  Please enter date in DD/MM/YYYY format
                </Text>
              ) : (
                <View style={{ marginTop: -20 }}></View>
              )}

              <TextInput
                mode='flat'
                label='Bank Name *'
                placeholder='Enter Bank Name'
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={bank_name}
                onChangeText={(text) => {
                  setbank_name(text);
                  setbank_nameError(false);
                }}
                // keyboardType="numeric"
                style={{ backgroundColor: colors.white }}
              />
              {bank_nameError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter Bank Name
                </Text>
              )}
              <TextInput
                mode='flat'
                label='Branch Name *'
                placeholder='Enter Branch number'
                activeUnderlineColor={colors.primary}
                underlineColor={colors.grey}
                value={bank_branch}
                onChangeText={(text) => {
                  setbank_branch(text);
                  setbank_branchError(false);
                }}
                // keyboardType="numeric"
                style={{ backgroundColor: colors.white }}
              />
              {bank_branchError && (
                <Text style={{ marginLeft: 10, color: colors.danger }}>
                  Please enter Branch Name
                </Text>
              )}

              {donorData.selectedDonationType.eighty_g ? (
                <>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      marginTop: 15,
                      paddingBottom: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderColor: colors.grey,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>80G Required </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setcertificate_require('yes');
                          setdonor_pannoError(false);
                          setdonor_pannoFormatError(false);
                        }}
                      >
                        <Text style={{ color: colors.secondary }}>Yes</Text>
                      </TouchableOpacity>
                      <RadioButton
                        color={colors.primary}
                        value='yes'
                        status={
                          certificate_require === 'yes'
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => {
                          setcertificate_require('yes');
                          setdonor_pannoError(false);
                          setdonor_pannoFormatError(false);
                        }}
                        style={{}}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setcertificate_require('no');
                          setdonor_pannoError(false);
                          setdonor_pannoFormatError(false);
                        }}
                      >
                        <Text style={{ color: colors.secondary }}>No</Text>
                      </TouchableOpacity>
                      <RadioButton
                        color={colors.primary}
                        value='no'
                        status={
                          certificate_require === 'no' ? 'checked' : 'unchecked'
                        }
                        onPress={() => {
                          setcertificate_require('no');
                          setdonor_pannoError(false);
                          setdonor_pannoFormatError(false);
                        }}
                      />
                    </View>
                  </View>
                  <TextInput
                    donor_type='flat'
                    label='PAN'
                    placeholder='Enter PAN'
                    // left={
                    //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                    // }
                    activeUnderlineColor={colors.primary}
                    underlineColor={colors.grey}
                    maxLength={10}
                    value={donor_panno}
                    onChangeText={(text) => {
                      setdonor_panno(text);
                      setdonor_pannoError(false);
                      setdonor_pannoFormatError(false);
                    }}
                    autoCapitalize='characters'
                    // keyboardType="numeric"
                    style={{ backgroundColor: colors.white, marginBottom: 15 }}
                  />
                  {donor_pannoError && (
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: -15,
                        marginBottom: 15,
                        color: colors.danger,
                      }}
                    >
                      Pan is mandatory if 80G is required
                    </Text>
                  )}
                  {donor_pannoFormatError && (
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: -15,
                        marginBottom: 15,
                        color: colors.danger,
                      }}
                    >
                      Please enter valid PAN number
                    </Text>
                  )}
                </>
              ) : null}
            </View>
          </>
        )}

        {/* FOR upi SECTION */}
        {collectionMode === 'upi' && (
          <View>
            <TextInput
              mode='flat'
              label='Reference No. *'
              placeholder='Enter Reference number'
              // left={
              //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
              // }
              activeUnderlineColor={colors.primary}
              underlineColor={colors.grey}
              value={payment_reference_no}
              onChangeText={(number) => {
                setpayment_reference_no(number);
                setpayment_reference_noError(false);
              }}
              // keyboardType="numeric"
              style={{ backgroundColor: colors.white }}
            />
            {payment_reference_noError && (
              <Text
                style={{
                  marginLeft: 10,
                  color: colors.danger,
                }}
              >
                Please enter reference number
              </Text>
            )}

            {donorData.selectedDonationType.eighty_g ? (
              <>
                <View
                  style={{
                    paddingHorizontal: 10,
                    marginTop: 15,
                    paddingBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: colors.grey,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>80G Required </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setcertificate_require('yes');
                        setdonor_pannoError(false);
                        setdonor_pannoFormatError(false);
                      }}
                    >
                      <Text style={{ color: colors.secondary }}>Yes</Text>
                    </TouchableOpacity>
                    <RadioButton
                      color={colors.primary}
                      value='yes'
                      status={
                        certificate_require === 'yes' ? 'checked' : 'unchecked'
                      }
                      onPress={() => {
                        setcertificate_require('yes');
                        setdonor_pannoError(false);
                        setdonor_pannoFormatError(false);
                      }}
                      style={{}}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setcertificate_require('no');
                        setdonor_pannoError(false);
                        setdonor_pannoFormatError(false);
                      }}
                    >
                      <Text style={{ color: colors.secondary }}>No</Text>
                    </TouchableOpacity>
                    <RadioButton
                      color={colors.primary}
                      value='no'
                      status={
                        certificate_require === 'no' ? 'checked' : 'unchecked'
                      }
                      onPress={() => {
                        setcertificate_require('no');
                        setdonor_pannoError(false);
                        setdonor_pannoFormatError(false);
                      }}
                    />
                  </View>
                </View>
                <TextInput
                  donor_type='flat'
                  label='PAN'
                  placeholder='Enter PAN'
                  // left={
                  //   <TextInput.Affix text="+91  " style={{ marginRight: 10 }} />
                  // }
                  activeUnderlineColor={colors.primary}
                  underlineColor={colors.grey}
                  maxLength={10}
                  value={donor_panno}
                  onChangeText={(text) => {
                    setdonor_panno(text);
                    setdonor_pannoError(false);
                    setdonor_pannoFormatError(false);
                  }}
                  autoCapitalize='characters'
                  // keyboardType="numeric"
                  style={{ backgroundColor: colors.white, marginBottom: 15 }}
                />
                {donor_pannoError && (
                  <Text
                    style={{
                      marginLeft: 10,
                      marginTop: -15,
                      color: colors.danger,
                    }}
                  >
                    Pan is mandatory if 80G is required
                  </Text>
                )}
                {donor_pannoFormatError && (
                  <Text
                    style={{
                      marginLeft: 10,
                      marginTop: -15,
                      marginBottom: 15,
                      color: colors.danger,
                    }}
                  >
                    Please enter valid PAN number
                  </Text>
                )}
              </>
            ) : null}

            <View style={{ alignItems: 'center' }}>
              {collectorDashboardApi.loading ? (
                <ActivityIndicator
                  size={'large'}
                  color={colors.primary}
                  style={{ marginTop: 20 }}
                />
              ) : qrCodeLink ? (
                <Image
                  source={{
                    uri: qrCodeLink,
                  }}
                  style={{
                    width: 300,
                    height: 300,
                    resizeMode: 'contain',
                    backgroundColor: colors.white,
                    borderColor: colors.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                    marginTop: 20,
                  }}
                ></Image>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>
      <MyAlert />
      {apiErrorMsg ? (
        <Text
          style={{ textAlign: 'center', color: colors.danger, marginTop: 10 }}
        >
          {apiErrorMsg}
        </Text>
      ) : null}
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
          disabled={apiSuccess}
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
          onPress={() => createTwoButtonAlert()}
          loading={loading}
          disabled={apiSuccess}
        >
          Submit
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
});

export default CollectionModeScreen;
