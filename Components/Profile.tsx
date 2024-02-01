import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';
import { useNavigation } from '@react-navigation/native';
const Profile = () => {
    const navigation = useNavigation();
  const list = {
    KINDE_ISSUER_URL: 'https://sudhan123.kinde.com',
    KINDE_POST_CALLBACK_URL: 'exp://192.168.54.4:8081',
    KINDE_POST_LOGOUT_REDIRECT_URL: 'exp://192.168.54.4:8081',
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
}

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.picture }} style={styles.profileImage} />
      <Text style={styles.text}>Name: {profile.email}</Text>
      <Text style={styles.text}>Credit: 0</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    marginBottom: 10,
  },
});

export default Profile;
