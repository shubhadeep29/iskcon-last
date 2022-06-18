import React, { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import { StatusBar } from "expo-status-bar";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import * as Localization from "expo-localization";

// on top of your index.android.js file
const isAndroid = require("react-native").Platform.OS === "android"; // this line is only needed if you don't use an .android.js file
const isHermesEnabled = !!global.HermesInternal; // this line is only needed if you don't use an .android.js file

// in your index.js file
if (isHermesEnabled || isAndroid) {
  // this line is only needed if you don't use an .android.js file

  require("@formatjs/intl-getcanonicallocales/polyfill");
  require("@formatjs/intl-locale/polyfill");

  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

  require("@formatjs/intl-displaynames/polyfill");
  require("@formatjs/intl-displaynames/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

  require("@formatjs/intl-listformat/polyfill");
  require("@formatjs/intl-listformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

  require("@formatjs/intl-numberformat/polyfill");
  require("@formatjs/intl-numberformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

  require("@formatjs/intl-datetimeformat/polyfill");
  // require("@formatjs/intl-datetimeformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
  require("@formatjs/intl-datetimeformat/locale-data/en-GB.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

  require("@formatjs/intl-datetimeformat/add-golden-tz.js");

  // https://formatjs.io/docs/polyfills/intl-datetimeformat/#default-timezone

  if ("__setDefaultTimeZone" in Intl.DateTimeFormat) {
    // If you are using react-native-cli
    // let RNLocalize = require("react-native-localize");

    Intl.DateTimeFormat.__setDefaultTimeZone(Localization.timezone);

    //  Are you using Expo, use this instead of previous 2 lines
    //  Intl.DateTimeFormat.__setDefaultTimeZone(
    //    require("expo-localization").timezone
    //  );
  }
} // this line is only needed if you don't use an .android.js file
import {
  en,
  nl,
  de,
  pl,
  pt,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";

registerTranslation("en", en);
registerTranslation("nl", nl);
registerTranslation("pl", pl);
registerTranslation("pt", pt);
registerTranslation("de", de);
registerTranslation("en-GB", enGB);

export default function App() {
  const [user, setUser] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  const appOnLoad = async () => {
    await SplashScreen.preventAutoHideAsync();

    let uuid = await authStorage.getUUID();
    if (!uuid) {
      await authStorage.storeUUID();
    }

    const user = await authStorage.getUserData();
    if (user) setUser(user);

    setAppIsReady(true);
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    appOnLoad();
  }, []);

  // useEffect(async () => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.

  //   }
  // }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#00dcf4",
      secondary: "#d28f0d",
      black: "#000",
      white: "#fff",
      medium: "#6e6969",
      light: "#f8f4f4",
      dark: "#0c0c0c",
      grey: "#cccccc",
      greyShade: "#f2f2f2",
      greyShade2: "#cccccc",
      danger: "#f16a6a",
      green: "#84C67C",
      blueShade: "#73B8F4",
    },
  };

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={navigationTheme}>
            {user ? <AppNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </PaperProvider>
      </AuthContext.Provider>
      <StatusBar style="auto" />
    </>
  );
}
