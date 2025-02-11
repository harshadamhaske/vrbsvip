import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomePage from '.';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import LanguageSelection from './language-selection';
import EmergencyContactSetup from './emergency-contact-setup';
import SetupCompletion from './setup-completion';
import {useEffect} from 'react';
import {loadLanguage} from '../../services/translationService';
import {NavigationContainer} from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import EmergencyContactAdding from './emergency-contact-adding';

const Stack = createNativeStackNavigator();

const RootLayout = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadLanguage());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="index"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={WelcomePage}
          options={{
            title: t('welcomeScreen', {returnObjects: true}).title,
            headerRight: () => (
              <FontAwesome6 name="person" size={24} color="white" iconStyle='solid'/>
            ),
          }}
        />
        <Stack.Screen
          name="language-selection"
          component={LanguageSelection}
          options={{
            title: t('languageSelectionScreen', {returnObjects: true}).title,
            headerRight: () => (
              <FontAwesome6 name="language" size={24} color="white" iconStyle='solid'/>
            ),
          }}
        />
        <Stack.Screen
          name="emergency-contact-setup"
          component={EmergencyContactSetup}
          options={{
            title: t('emergencyContactScreen', {returnObjects: true}).title,
          }}
        />
        <Stack.Screen
        name="index"
        component={EmergencyContactAdding}
        options={{
          title: t('emergencyContactScreen', {returnObjects: true}).title,
        }}
      />
        <Stack.Screen
          name="setup-completion"
          component={SetupCompletion}
          options={{
            title: t('setupCompleteScreen', {returnObjects: true}).title,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayout;
