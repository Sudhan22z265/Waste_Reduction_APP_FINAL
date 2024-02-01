import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';
import Home from "./Home";
import { useNavigation } from '@react-navigation/native';


export default function LandingPage() {
  // Inside your component
const navigation = useNavigation();

  const list = {
    KINDE_ISSUER_URL:'https://sudhan123.kinde.com',
KINDE_POST_CALLBACK_URL : 'exp://192.168.54.4:8081',
KINDE_POST_LOGOUT_REDIRECT_URL : 'exp://192.168.54.4:8081',
KINDE_CLIENT_ID:'06eea6fe24074922ba63b79d9133ce88',
};
  const client = new KindeSDK(list.KINDE_ISSUER_URL, list.KINDE_POST_CALLBACK_URL, list.KINDE_CLIENT_ID, list.KINDE_POST_LOGOUT_REDIRECT_URL);
  const handleSignUp = async () => {
    try {
      const token = await client.register();
      if (token) {
        console.log('Token:', token);
        console.log('signup successful');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  const handleSignIn = async () => {
    const token = await client.login();
    if (token) {
      console.log(token);
      navigation.navigate('Home'); 
    }
  };

  return (
    <View style={styles.page}>
      <Image
        style={styles.image}
        source={require("./../assets/Blog-1-june.jpg")}
      />
      <Text style={styles.welcome}>
        Welcome to <Text style={styles.title}>Food Rescue Hub</Text>
      </Text>
      <TouchableOpacity style={styles.loginbutton} onPress={handleSignIn}>
        <Text style={styles.login}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.newacc} >Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 460, 
    resizeMode: "cover",
  },
  welcome: {
    fontSize: 40,
    textAlign:'center',
    marginTop:30,
  },
  title: {
    margin: 5,
    color: "#ff0000",
  },
  loginbutton: {
    backgroundColor: "red",
    marginTop: 40,
    marginHorizontal: 40,
    borderRadius: 10,
    padding: 10,
  },
  login: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
  newacc: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
  },
  page:{
    backgroundColor:'#FFBFBF',
    height:'100%'
    
  },
});
