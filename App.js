import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './Components/LandingPage';
import Home from './Components/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Home">
        <Stack.Screen name="LandingPage" options={{ headerShown:false }} component={LandingPage} />
        <Stack.Screen name="Home" options={{ headerShown:false }} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


