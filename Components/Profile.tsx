import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet ,ImageBackground,Linking} from 'react-native';
import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';
import { useNavigation } from '@react-navigation/native';
import {list} from './Auth_kinde'

const Profile = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:aravindhkrishnanprakash@gmail.com'); // Change email address accordingly
  };
  const navigation = useNavigation();

  const client = new KindeSDK(
    list.KINDE_ISSUER_URL,
    list.KINDE_POST_CALLBACK_URL,
    list.KINDE_CLIENT_ID,
    list.KINDE_POST_LOGOUT_REDIRECT_URL
  );
  const [profile, setProfile] = useState({});

  const getProfile = async () => {
    try {
      const userProfile = await client.getUserDetails();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      navigation.navigate('LandingPage');
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ImageBackground
     source={require("./../assets/firstpage.jpeg")}
     style={styles.backgroundImage}
    > 
      <View style={styles.container1}>
        <View style={styles.header}>
          <Image source={{ uri: profile.picture }} style={styles.profileImage} />
          <Text style={styles.nameText}>{profile.email}</Text>
          <View style={styles.logout}>
            <Text style={styles.creditText}>Credit: 0</Text>
          </View>
        </View>
     
        <View style={styles.container2}>
       
          <TouchableOpacity style={styles.logoutButton} onPress={handleEmailPress}>
            <Text style={styles.buttonText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}  
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'transparent',
    
    // Set container background to transparent
  },
  container2:{
    backgroundColor:'white',
    marginBottom:10,
    borderColor:'white',
    borderWidth:2
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  creditText: {
    fontSize: 20,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logout: {
    marginTop: 40,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor:'blue',
    marginBottom:20,
    
  },
});


export default Profile;