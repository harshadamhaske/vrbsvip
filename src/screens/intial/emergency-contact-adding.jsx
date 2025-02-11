import {View, Text, Pressable, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import initVoice from '../../services/voiceRecognitionService';
import Voice from '@react-native-voice/voice';
import Listening from '../../components/Listening';
import ContactsView from '../../components/ContactsView';

const EmergencyContactAdding = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector(state => state.voice.isSRFinished);
  const isSRStarted = useSelector(state => state.voice.isSRStarted);
  useEffect(() => {
    initVoice(dispatch);
  }, [dispatch]);

  const handlePress = () => {
    Voice.isAvailable()
      .then(() => {
        Voice.start('en-US')
          .then(console.log('Speech recognition started'))
          .catch(error => {
            console.error('Error starting speech recognition:', error);
          });
      })
      .catch(error => console.log('Voice module is not yet ready.', error));
  };

  return (
    <Pressable onLongPress={handlePress}>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}>
        <View className="flex items-center px-2 gap-2 h-full">
          {isSRStarted && !isSRFinished && <Listening />}

          {isSRFinished && !isSRStarted && <ContactsView />}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default EmergencyContactAdding;
