import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { KindeSDK } from "@kinde-oss/react-native-sdk-0-7x";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Donate from './Donate'
import Lend from "./Lend";
import {list} from './Auth_kinde'
import Profile from "./Profile";
export default function Home() {
  const [auth, setAuth] = useState(false);
 
  const client = new KindeSDK(
    list.KINDE_ISSUER_URL,
    list.KINDE_POST_CALLBACK_URL,
    list.KINDE_CLIENT_ID,
    list.KINDE_POST_LOGOUT_REDIRECT_URL
  );
  //logout
  const navigation = useNavigation();
  const handleLogout = async () => {
    const loggedOut = await client.logout(true);
    if (loggedOut) {
      console.log("Logout");
      navigation.navigate("LandingPage"); // Use navigation to go back to the 'LandingPage'
    }
  };
  //check authenticated
  const checkAuthenticate = async () => {
    // Using `isAuthenticated` to check if the user is authenticated or not
    if (await client.isAuthenticated) {
      const userProfile = await client.getUserDetails();
      setAuth(true);

      // Need to implement, e.g: call an api, etc...
    } else {
      navigation.navigate("LandingPage");
    }
  };

  useEffect(() => {
    checkAuthenticate();
  }, []);
  //navbar





  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Food Surplus"
        component={Donate}
        options={{
          tabBarIcon: (color, size) => (
            <MaterialIcons name="food-bank" size={30} color="royalblue" />
          ),
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 , fontWeight: 'bold',marginBottom:1},
          tabBarStyle: { paddingTop: 5 }
        }}
      />
      <Tab.Screen
        name="Helping Hands"
        component={Lend}
        options={{
          tabBarIcon: (color, size) => (
            <FontAwesome5 name="hands-helping" size={30} color="royalblue" />
          ),
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold',marginBottom:1 },
          tabBarStyle: { paddingTop: 5 }
          
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: (color, size) => (
            <AntDesign name="profile" size={30} color="royalblue" />
          ),
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold',marginBottom:1 },
          tabBarStyle: { paddingTop: 5 },
        }}
      />
    </Tab.Navigator>
  );
}
