import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/DashboardScreen";
import { View, TouchableOpacity, Image } from "react-native";
import colors from "../config/colors";
import DonorNationalityScreen from "../screens/DonorNationalityScreen";
import DonorPhoneScreen from "../screens/DonorPhoneScreen";
import DonorDetailsScreen from "../screens/DonorDetailsScreen";
import SelectDonationScreen from "../screens/SelectDonationScreen";
import CollectionModeScreen from "../screens/CollectionModeScreen";
import {
  StackActions,
  useFocusEffect,
  useNavigationState,
} from "@react-navigation/native";

const Stack = createStackNavigator();

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={require("../assets/menu.png")}
          style={{
            width: 20,
            height: 20,
            marginLeft: 10,
            tintColor: colors.white,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const DashboardNavigator = ({ navigation }) => {
  const state = useNavigationState((state) => state);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.dispatch(StackActions.popToTop());
      };
    }, [])
  );
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "COLLECTOR DASHBOARD", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: colors.primary, //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="DonorNationality"
        component={DonorNationalityScreen}
        options={{
          title: "NATIONALITY OF DONOR", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          // headerLeft: null,
          headerStyle: {
            backgroundColor: colors.primary, //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="DonorPhone"
        component={DonorPhoneScreen}
        options={{
          title: "DONOR MOBILE", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          // headerLeft: null,
          headerStyle: {
            backgroundColor: colors.primary, //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="DonorDetails"
        component={DonorDetailsScreen}
        options={{
          title: "DONOR DETAILS", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          // headerLeft: null,
          headerStyle: {
            backgroundColor: colors.primary, //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="SelectDonation"
        component={SelectDonationScreen}
        options={{
          title: "CHOOSE DONATION TYPE", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          // headerLeft: null,
          headerStyle: {
            backgroundColor: colors.primary, //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="CollectionMode"
        component={CollectionModeScreen}
        options={{
          title: "MODE OF COLLECTION", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          // headerLeft: null,
          headerStyle: {
            backgroundColor: colors.primary, //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
