import * as React from 'react';
import { View, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useFonts } from 'expo-font';
const LeftContent = props => <Avatar.Image size={40} source={require('../assets/profile.webp')} />

const Lend = () => (
  <ImageBackground
    source={require('./../assets/bg-food.jpg')}
    style={styles.backgroundImage}
  >
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="PSG TECH HOSTEL" subtitle="Peelmedu" left={LeftContent} />
          <Card.Content>
            <Text variant="titleLarge" style={{fontFamily:'serif',width:'120%'}}>Food Description: Idli,Sambar</Text>
            <Text variant="bodyMedium">Approx Food Quantity: 120</Text>
            <Text>Location: Cbe</Text>
            <Text>Contact No.: 8778440792</Text>
          </Card.Content>
          <Card.Cover style={styles.FoodImg} source={require('./../assets/test.webp')} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
        
      </View>
    </ScrollView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 10,
  },
  FoodImg:{
    width:'90%',
    margin:10,
    },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default Lend;
