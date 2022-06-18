import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text } from "react-native";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import colors from "../config/colors";

import authenticationApi from "../api/authentication";
import { StackActions } from "@react-navigation/native";

const CustomSidebarMenu = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const [apiErrorMsg, setApiErrorMsg] = useState("");

  const logout = useApi(authenticationApi.logout);

  const handleLogout = () => {
    logout.request(user);
  };

  const removeUserData = async () => {
    await authStorage.removeUserData();
    setUser(null);
  };

  useEffect(() => {
    if (logout.data && Object.keys(logout.data).length > 0) {
      if (logout.data.status === 1) {
        removeUserData();
      } else {
        setApiErrorMsg(logout.data.message);
      }
    }
  }, [logout.data]);

  const onPress = {
    dispatch: (event: any) => {
      const routeName = event?.payload?.name;
      if (!routeName) {
        props.navigation.dispatch(StackActions.popToTop());
        return props.navigation.closeDrawer();
      } else {
        return props.navigation.reset({
          index: 0,
          routes: [{ name: routeName }],
        });
      }
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, top: 30 }}>
      {/*Top Large Image */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.sideMenuProfileIcon}
      />

      <DrawerContentScrollView {...props}>
        <View
          style={{
            marginTop: -30,
            marginBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.secondary,
              letterSpacing: 1,
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              color: colors.primary,
            }}
          >
            {user.unique_id}
          </Text>
        </View>
        <DrawerItemList {...props} navigation={onPress} />

        <DrawerItem
          label="Logout"
          labelStyle={{ color: colors.black, marginLeft: -20 }}
          onPress={handleLogout}
          icon={({ color, size }) => (
            <Image
              source={require("../assets/logout.png")}
              style={{
                width: 15,
                height: 15,
                resizeMode: "contain",
                marginLeft: 1.5,
                // tintColor: colors.secondary,
              }}
              // color={color}
              // size={size}
            />
          )}
        />
      </DrawerContentScrollView>
      {apiErrorMsg !== "" && (
        <Text
          style={{
            textAlign: "center",
            marginBottom: 12,
            color: colors.danger,
          }}
        >
          {apiErrorMsg}
        </Text>
      )}
      {/* <Text style={{ fontSize: 16, textAlign: "center", color: "grey" }}>
        www.aboutreact.com
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  // customItem: {
  //   padding: 16,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  dropdown: {
    borderRadius: 4,
    marginHorizontal: 17,
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
    width: 15,
    height: 15,
  },
  shadow: {
    marginTop: Platform.OS === "android" ? -25 : 0,
    borderWidth: 0,
    borderColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
});

export default CustomSidebarMenu;
