import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardNavigator from "./DashboardNavigator";
import { View, Text, Image } from "react-native";
import CustomSidebarMenu from "./CustomSidebarMenu";
import colors from "../config/colors";
import CollectDonationNavigator from "./CollectDonationNavigator";
import BankDepositNavigator from "./BankDepositNavigator";
import ReportNavigator from "./ReportNavigator";

const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <Drawer.Navigator
    drawerContentOptions={{
      activeTintColor: colors.primary,
      itemStyle: { marginBottom: 0 },
    }}
    drawerContent={(props) => <CustomSidebarMenu {...props} />}
    initialRouteName="Dashboard"
  >
    <Drawer.Screen
      name="Dashboard"
      component={DashboardNavigator}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ marginLeft: -20 }}>Dashboard</Text>
        ),
        drawerIcon: ({ color, size }) => (
          <Image
            source={require("../assets/dashboard.png")}
            style={{
              width: 15,
              height: 15,
              resizeMode: "contain",
              // tintColor: colors.secondary,
            }}
            // color={color}
            // size={size}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="CollectDonation"
      component={CollectDonationNavigator}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ marginLeft: -20 }}>Collect Donation</Text>
        ),
        drawerIcon: ({ color, size }) => (
          <Image
            source={require("../assets/donate.png")}
            style={{
              width: 15,
              height: 15,
              resizeMode: "contain",
              // tintColor: colors.secondary,
            }}
            // color={color}
            // size={size}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="BankDeposit"
      component={BankDepositNavigator}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ marginLeft: -20 }}>Bank Deposit</Text>
        ),
        drawerIcon: ({ color, size }) => (
          <Image
            source={require("../assets/donation1.png")}
            style={{
              width: 15,
              height: 15,
              resizeMode: "contain",
              // tintColor: colors.secondary,
            }}
            // color={color}
            // size={size}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="Report"
      component={ReportNavigator}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ marginLeft: -20 }}>Report</Text>
        ),
        drawerIcon: ({ color, size }) => (
          <Image
            source={require("../assets/report.png")}
            style={{
              width: 15,
              height: 15,
              resizeMode: "contain",
              // tintColor: colors.secondary,
            }}
            // color={color}
            // size={size}
          />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default AppNavigator;
