import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import ObjectRecognition from './ObjectRecognition';
import TextRecognition from './TextRecognition';
import NavigationAssistance from './NavigationAssistance';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: t('homeScreen', { returnObjects: true }).title,
          }}
        />
        {/* <Stack.Screen
          name="ObjectRecognition"
          component={ObjectRecognition}
          options={{
            title: t('objectRecognitionScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="TextRecognition"
          component={TextRecognition}
          options={{
            title: t('textRecognitionScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="NavigationAssistance"
          component={NavigationAssistance}
          options={{
            title: t('navigationAssistanceScreen', { returnObjects: true }).title,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
