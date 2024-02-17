import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking
} from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useFonts } from "expo-font";
import Image_fetch from "./../Components/Image_fetch";
import { db } from "../config";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from './../config.js';
import { Entypo, FontAwesome } from '@expo/vector-icons'; // Import icons from expo/vector-icons
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for Google Maps icon

const LeftContent = (props) => (
  <Avatar.Image size={40} source={require("../assets/profile.webp")} />
);

const Lend = () => {

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`); // Change email address accordingly
  };

  const handlePhonePress = (phone) => {
    Linking.openURL(`tel:${phone}`); // Change phone number accordingly
  };

  const handleMapPress = (latitude,longitude) => {

    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [alldocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urlMap, setUrlMap] = useState({});

  const fetchImage = async (imagePath) => {
    try {
      setLoading(true);
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);
      const imageUrl = await getDownloadURL(imageRef);
      setLoading(false);
      return imageUrl;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchImage();
  }, []); // Empty dependency array to ensure this effect runs only once

  const fetchAllDocs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "values"));
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const urls = {};
      await Promise.all(
        documents.map(async (doc) => {
          const imageUrl = await fetchImage(doc.values.imageurl);
          urls[doc.id] = imageUrl;
        })
      );
      
      setUrlMap(urls);
      setAllDocs(documents);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  };

    console.log(urlMap);
  const renderCards = () => {
    console.log(alldocs)
    return alldocs.map((doc) => (
      <Card key={doc.id} style={styles.card}>
        <Card.Title
          title={doc.values.Name}
          subtitle={doc.values.foodQuantity ? doc.values.foodQuantity : "Recyclable"}
          left={LeftContent}
        />
        <Card.Content>
          <Image style={{ width: 50, height: 50 }} source={{ uri: urlMap[doc.id] }} />
          <Text
            variant="titleLarge"
            style={{ fontFamily: "serif", width: "120%" }}
          >
            Waste Description: {doc.values.description}
          </Text>
          <Text>Location: {doc.values.location}</Text>
          <Text>Contact No.: {doc.values.contactNumber}</Text>
        </Card.Content>
        <Card.Actions>
          {/* Use arrow functions to delay function execution */}
          <Button style={styles.buttonemail} icon={() => <FontAwesome name="envelope" size={24} color="red" />} onPress={() => handleEmailPress(doc.values.email)} />
          {/* Use arrow functions to delay function execution */}
          <Button style={styles.buttonmap} icon={() => <MaterialIcons name="location-on" size={24} color="green" />} onPress={() => handleMapPress(doc.values.latitude,doc.values.longitude)} />
          {/* Use arrow functions to delay function execution */}
          <Button style={styles.buttonphone} icon={() => <FontAwesome name="phone" size={24} color="blue" />} onPress={() => handlePhonePress(doc.values.contactNumber)} />
        </Card.Actions>
      </Card>
    ));
  };
  return (
    <ImageBackground
      source={require("./../assets/bachHH.jpeg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity onPress={fetchAllDocs} style={styles.button}>
            <Text style={styles.buttonText}>Get Updates</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : alldocs.length > 0 ? (
            renderCards()
          ) : null}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 10,
  },
  FoodImg: {
    width: "90%",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 20,
  },button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 15,
    width: "50%",
    display:'flex',
    marginTop: 20,
    alignItems:'center',
    justifyContent:'center',
  
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  buttonemail: {
    paddingLeft: 15,
    borderWidth: 1
  },
  buttonphone: {
    paddingLeft: 15,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonmap: {
    paddingLeft: 15,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default Lend;
