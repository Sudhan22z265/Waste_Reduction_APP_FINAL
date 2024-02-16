import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';
import { useNavigation } from '@react-navigation/native';


const Profile = () => {
  const navigation = useNavigation();
  const list = {
    KINDE_ISSUER_URL: 'https://sudhan123.kinde.com',
    KINDE_POST_CALLBACK_URL: 'exp://192.168.110.4:8081',
    KINDE_POST_LOGOUT_REDIRECT_URL: 'exp://192.168.110.4:8081',
    KINDE_CLIENT_ID: '06eea6fe24074922ba63b79d9133ce88',
  };
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.picture }} style={styles.profileImage} />
        <Text style={styles.nameText}>{profile.email}</Text>
        <View style={styles.logout}>
        <Text style={styles.creditText}>Credit: 0</Text>
        </View>
      </View>
      <View >
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',

    height:'70%',

    backgroundColor: '#3498db',

  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
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
  body: {
    paddingHorizontal: 20,
    paddingVertical: 30,
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
  logout : {
    marginTop:40,
  }
});

export default Profile;
