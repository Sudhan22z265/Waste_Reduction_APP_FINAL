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
} from "react-native";
import { Formik } from "formik";
import { Card } from "react-native-paper"; // Import Card from react-native-paper
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { KindeSDK } from "@kinde-oss/react-native-sdk-0-7x";

export default function Donate() {
  const list = {
    KINDE_ISSUER_URL: "https://sudhan123.kinde.com",
    KINDE_POST_CALLBACK_URL: "exp://192.168.110.4:8081",
    KINDE_POST_LOGOUT_REDIRECT_URL: "exp://192.168.110.4:8081",
    KINDE_CLIENT_ID: "06eea6fe24074922ba63b79d9133ce88",
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      saveImageToAppDirectory(result.assets[0].uri);
      setImages([...images, result.assets[0].uri]);
    }
  };

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
      source={require("./../assets/bg-food.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Card style={styles.card1}>
          <ImageBackground source={require("./../assets/grad.avif")}>
            <Text style={styles.heading}>Food Donation Platform</Text>
            <Text style={styles.slogan}>
              "Be a Food Hero: Donate Today, Transform Lives"
            </Text>
          </ImageBackground>
        </Card>
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
                Name:''
              }}
              onSubmit={(values) =>
                console.log(values,images)
              }
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
                    placeholder="Food Description"
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("foodQuantity")}
                    onBlur={handleBlur("foodQuantity")}
                    value={values.foodQuantity}
                    placeholder="Approx Food Quantity"
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
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>
                      Latitude: {location ? location.coords.latitude : ""}
                    </Text>
                    <Text style={styles.locationText}>
                      Longitude: {location ? location.coords.longitude : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={pickImage}
                      style={styles.pickerimg}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Pick an image from camera roll
                      </Text>
                    </TouchableOpacity>
                    {images.map((image, index) => (
                      <View key={index}>
                        <Image
                          source={{ uri: image }}
                          style={{ width: 125, height: 125, margin: 10 }}
                        />
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeImageFromDirectory(index)}
                        >
                          <Text style={styles.removeButtonText}>
                            Remove Image
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
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
  card1: {
    marginTop: 60,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderColor: "red",
    borderWidth: 2,
  },

  card2: {
    margin: 20,
    borderColor: "red",
    marginTop: 0,
    marginBottom: 50,
    padding: 15,
    paddingTop: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "black",
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
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "red",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 15,
    width: "50%",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
    fontStyle: "italic",
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
    backgroundColor: "limegreen",
    padding: 10,
    margin: 10,
    borderRadius: 15,
  },
});
