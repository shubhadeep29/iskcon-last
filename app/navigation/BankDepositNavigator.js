import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity, Image } from "react-native";
import colors from "../config/colors";
import BankDepositScreen from "../screens/BankDepositScreen";
import { useNavigationState } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";

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

const BankDepositNavigator = ({ navigation }) => {
  const state = useNavigationState((state) => state);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // navigation.dispatch(
        //   CommonActions.reset({
        //     routes: state.routes[state.routes.length],
        //   })
        // );
        navigation.dispatch(StackActions.popToTop());
      };
    }, [])
  );
  // const state = useNavigationState((state) => state);
  // const currentRoute = state.routes.find(
  //   (route) => route.name === state.routeNames[state.index]
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused

  //     return () => {
  //       // navigation.dispatch(
  //       //   CommonActions.reset({
  //       //     routes: state.routes[state.routes.length],
  //       //   })
  //       // );
  //       // navigation.dispatch(StackActions.popToTop());
  //       if (currentRoute?.state)
  //         if (currentRoute.state.index !== 0)
  //           navigation.dispatch(StackActions.popToTop());
  //     };
  //   }, [])
  // );
  return (
    <Stack.Navigator initialRouteName="BankDeposit">
      <Stack.Screen
        name="BankDeposit"
        component={BankDepositScreen}
        options={{
          title: "BANK DEPOSIT", //Set Header Title
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
    </Stack.Navigator>
  );
};

export default BankDepositNavigator;
