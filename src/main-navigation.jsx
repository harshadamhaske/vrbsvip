import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './services/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import RootLayout from './screens/intial/layout'; 
import Navigation from './screens/Modes/navigation'; 

const Stack = createStackNavigator();

const MainNavigation = () => {
  const [isFirstTime, setIsFirstTime] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error checking first-time usage:', error);
        setIsFirstTime(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstTimeUser();
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isFirstTime ? 'RootLayout' : 'Navigation'}>
          {isFirstTime ? (
            <>
              <Stack.Screen
                name="RootLayout"
                component={RootLayout}
                options={{ headerShown: false }} 
              />
              
              <Stack.Screen
                name="Navigation"
                component={Navigation} 
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Navigation" 
              component={Navigation} 
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default MainNavigation;