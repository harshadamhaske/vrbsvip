import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setSRFinished,
  setSRResult,
  setSRStarted
} from '../reducers/voice';
import Voice from '@react-native-voice/voice';
import Contacts from 'react-native-contacts';

const onSpeechStart = (e, dispatch) => {
  console.log('onSpeechStart: ', e);
  dispatch(setSRStarted(true));
  dispatch(setSRFinished(false));
};

const onSpeechRecognized = (e) => {
  console.log('onSpeechRecognized: ', e);
};

const onSpeechEnd = (e) => {
  console.log('onSpeechEnd: ', e);
};

const onSpeechError = (e, dispatch) => {
  console.log('onSpeechError: ', e);
  dispatch(setSRFinished(true));
  dispatch(setSRStarted(false));
};

const onSpeechResults = async (e, dispatch) => {
  console.log('onSpeechResults: ', e);
  dispatch(setSRFinished(true));
  dispatch(setSRStarted(false));
  dispatch(processRecognition(e.value[0]));
};

const onSpeechPartialResults = (e) => {
  console.log('onSpeechPartialResults: ', e);
};

const onSpeechVolumeChanged = (e) => {
  console.log('onSpeechVolumeChanged: ', e);
};

const processRecognition = result => async dispatch => {
  const contacts = await Contacts.getContactsMatchingString(result);
  dispatch(setSRResult(contacts));
};
const initVoice = dispatch => {
  Voice.onSpeechStart = e => {
    onSpeechStart(e, dispatch);
  };
  Voice.onSpeechRecognized = e => {
    onSpeechRecognized(e, dispatch);
  };
  Voice.onSpeechEnd = e => {
    onSpeechEnd(e, dispatch);
  };
  Voice.onSpeechError = e => {
    onSpeechError(e, dispatch);
  };
  Voice.onSpeechResults = e => {
    onSpeechResults(e, dispatch);
  };
  Voice.onSpeechPartialResults = e => {
    onSpeechPartialResults(e, dispatch);
  };
  Voice.onSpeechVolumeChanged = e => {
    onSpeechVolumeChanged(e, dispatch);
  };

  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
};

export default initVoice;
