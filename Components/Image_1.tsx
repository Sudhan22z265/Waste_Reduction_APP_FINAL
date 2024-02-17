import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, firebase } from '../config';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; 

const Image1 = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageurl, setImageUrl] = useState('');
  const fetchApi = async() =>{
    
    addDoc(collection(db,"values"),{
      imageurl:imageurl
    }).then(()=>
    {
      console.log('saved');
    }).catch((err)=>{
      console.log(err);
    })
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
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
      fetchApi();
      
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={pickImage}>
        <Text>Pick an image</Text>
      </TouchableOpacity>
      <View>
        {image && <Image source={{ uri: image }} />}
        <TouchableOpacity onPress={uploadMedia}>
          <Text>Upload an image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Image1;
