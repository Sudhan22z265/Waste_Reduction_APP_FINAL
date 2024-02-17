import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';


import { getStorage, ref, getDownloadURL } from './../config.js';



export default function App({ imagePath }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, imagePath); // Use the prop for image path
        const imageUrl = await getDownloadURL(imageRef);
        setUrl(imageUrl);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchImage();
  }, [imagePath]);

  return (
    <View style={{ flex: 1, backgroundColor: '#123456', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <Image style={{ width: '70%', height: '70%' }} source={{ uri: url }} />
      )}
    </View>
  );
}
