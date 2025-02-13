import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';

import en from '../../locales/en.json';
import hi from '../../locales/hi.json';
import mr from '../../locales/mr.json';

const selectedLanguage = 'hi';
const Home = () => {
  const navigation = useNavigation();
  const [tapCount, setTapCount] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const langData = selectedLanguage === 'en' ? en : selectedLanguage === 'hi' ? hi : mr;

  useEffect(() => {
    if (isFirstVisit) {
      Tts.speak(langData.homeScreen.audio.join(' '));
      setIsFirstVisit(false);
    }

    Voice.onSpeechResults = (e) => {
      const command = e.value[0].toLowerCase();
      if (command.includes(langData.homeScreen.message[0].toLowerCase())) {
        navigation.navigate('ObjectRecognition');
      } else if (command.includes(langData.homeScreen.message[1].toLowerCase())) {
        navigation.navigate('TextRecognition');
      } else if (command.includes(langData.homeScreen.message[2].toLowerCase())) {
        navigation.navigate('NavigationAssistance');
      } else if (command.includes(langData.homeScreen.backCommand.toLowerCase())) {
        navigation.navigate('Home');
      }
    };

    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, [isFirstVisit]);

  const handleTap = () => {
    setTapCount(tapCount + 1);
    setTimeout(() => {
      if (tapCount === 1) navigation.navigate('ObjectRecognition');
      else if (tapCount === 2) navigation.navigate('TextRecognition');
      else if (tapCount === 3) navigation.navigate('NavigationAssistance');
      setTapCount(0);
    }, 300);
  };

  return (
    <TouchableOpacity
      className="flex-1 justify-center items-center bg-gray-100"
      onPress={handleTap}
      onLongPress={() => Voice.start(selectedLanguage)}
    >
      {/* Background Image */}
      {/* <Image source={require('../../assets/images/initialSetup/home.jpg')} className="w-full h-64 rounded-lg mb-5" /> */}

      {/* Title */}
      <Text className="text-2xl font-bold mb-4">{langData.homeScreen.title}</Text>

      {/* Modes */}
      <View className="w-11/12 items-center">
        {langData.homeScreen.message.map((msg, index) => (
          <View key={index} className="bg-gray-300 p-4 my-2 w-full rounded-lg items-center">
            <Text className="text-lg text-center">{msg}</Text>
          </View>
        ))}
      </View>

      <Text className="text-lg text-gray-600 mt-4">Long press to use voice commands</Text>
    </TouchableOpacity>
  );
};

export default Home;
