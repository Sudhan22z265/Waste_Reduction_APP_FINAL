import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Button,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import Image1 from "./Image_1";
import { Formik } from "formik";
import { Card } from "react-native-paper"; // Import Card from react-native-paper
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { KindeSDK } from "@kinde-oss/react-native-sdk-0-7x";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { list } from "./Auth_kinde";
import { db, firebase } from "../config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function Donate() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageurl, setImageUrl] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadMedia = async () => {
    setUploading(true);
  
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);
  
      await ref.put(blob);
      setUploading(false);
      Alert.alert('Photo uploaded!');
      setImageUrl(filename); // Set the image URL state to the filename
      setImage(null);
      return filename; // Return filename when upload is complete
    } catch (err) {
      console.error(err);
      setUploading(false);
      throw err; // Rethrow error if upload fails
    }
  };
  

  const client = new KindeSDK(
    list.KINDE_ISSUER_URL,
    list.KINDE_POST_CALLBACK_URL,
    list.KINDE_CLIENT_ID,
    list.KINDE_POST_LOGOUT_REDIRECT_URL
  );
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  Location.setGoogleApiKey("AIzaSyD5GUOMMrDY5Ml8JOQ5j7z7p9f8GaGCDBg");
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }
      var currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log(currentLocation);
      console.log(location);
    };
    getPermissions();
  }, []);

  const reverseGeocode = async () => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    console.log("Reverse Geocoded:");
    console.log(reverseGeocodedAddress); //Address
  };

  const [images, setImages] = useState([]);

  const saveImageToAppDirectory = async (imageUri) => {
    const fileName = imageUri.split("/").pop();
    const appDirectory = FileSystem.documentDirectory + "images/";

    await FileSystem.makeDirectoryAsync(appDirectory, { intermediates: true });

    const newImageUri = appDirectory + fileName;

    await FileSystem.copyAsync({
      from: imageUri,
      to: newImageUri,
    });

    console.log("Image saved to: ", newImageUri); //Images
  };

  const removeImageFromDirectory = async (index) => {
    if (images.length > 0 && index < images.length) {
      await FileSystem.deleteAsync(images[index]);
      console.log("Image removed from directory: ", images[index]);
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    }
  };

  const geocode = async () => {
    const geoCodedLocation = await Location.geocodeAsync(address);
    console.log("Geocoded Address : ");
    console.log(geoCodedLocation);
  };

  return (
    <ImageBackground
      source={require("./../assets/backdonate.jpeg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.slogan}>Scraps</Text>
          <Text style={styles.slogan1}>Save.</Text>
        </View>
        <Card style={styles.card2}>
          <ImageBackground
            source={require("./../assets/grad.avif")}
            style={{ overflow: "hidden" }}
          >
            <Formik
              initialValues={{
                description: "",
                foodQuantity: "",
                location: "",
                contactNumber: "",
                Name: "",
                email : "",
                latitude : "",
                longitude: "",
              }}
              onSubmit={async (values) => {
                values = { ...values, imageurl ,longitude: location.coords.longitude,
                  latitude: location.coords.latitude,};
                console.log(values);
                await addDoc(collection(db, "values"), { values })
                  .then(() => {
                    console.log(values);
                    console.log("saved");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={styles.container}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("Name")}
                    onBlur={handleBlur("Name")}
                    value={values.Name}
                    placeholder="Name"
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    placeholder="Description"
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="email"
                  />

                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("location")}
                    onBlur={handleBlur("location")}
                    value={values.location}
                    placeholder="Location"
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("contactNumber")}
                    onBlur={handleBlur("contactNumber")}
                    value={values.contactNumber}
                    placeholder="Contact Number"
                    keyboardType="phone-pad"
                  />
                  <Picker
                    selectedValue={values.foodQuantity}
                    onValueChange={handleChange("foodQuantity")}
                    style={styles.picker}
                  >
                    <Picker.Item label="Recyclable" value="Recyclable" />
                    <Picker.Item
                      label="Non-recyclable"
                      value="Non-recyclable"
                    />
                  </Picker>
                  <Image
                    source={require("./../assets/map.png")}
                    style={{ width: 60, height: 60 }} // Adjust width and height as needed
                  />

                  <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>
                      Latitude: {location ? location.coords.latitude : ""}
                    </Text>
                    <Text style={styles.locationText}>
                      Longitude: {location ? location.coords.longitude : ""}
                    </Text>
                  </View>
                  {/* Image picker */}
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <SafeAreaView>
                      <TouchableOpacity style={styles.pickerimg} onPress={pickImage}>
                        <Text style={{color:'black',fontWeight:'bold'}}>Pick an image from gallery</Text>
                      </TouchableOpacity>
                    </SafeAreaView>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      uploadMedia().then(handleSubmit);
                    }}
                  >
                    <Text style={styles.buttonText}>Donate</Text>
                  </TouchableOpacity>

                  {/* <Button title="Reverse Geocode Current Location" onPress={handleLogout} /> */}
                </View>
              )}
            </Formik>
          </ImageBackground>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card2: {
    margin: 20,
    borderColor: "black",
    marginTop: 120,
    marginBottom: 50,
    padding: 15,
    paddingTop: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#ffffff",
  },
  locationContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  locationText: {
    color: "black",
    fontSize: 16,
    marginBottom: 5,
  },
  slogan: {
    fontSize: 40,
    marginTop: 90,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff",
    textDecorationLine: "line-through",
    opacity: 0.5,
  },

  slogan1: {
    fontSize: 40,
    marginTop: 0,
    fontWeight: "bold",

    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 15,
    width: "50%",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 20,
  },
  removeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: "white",
    textAlign: "center",
  },
  pickerimg: {
    backgroundColor: "#ffffff",
    padding: 10,
    margin: 10,
    borderRadius: 15,
  },

  picker: {
    height: 40,
    width: "100%",
    borderColor: "red",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    color: "black", // Add this line to set text color
  },
  
});
