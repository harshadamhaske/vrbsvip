import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import MLKitOcr from "react-native-mlkit-ocr";
import Tts from "react-native-tts";
import { useNavigation } from "@react-navigation/native";

const TextRecognition = () => {
  const [recognizedText, setRecognizedText] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const navigation = useNavigation();

  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultRate(0.5);
  }, []);

  const handleTextRecognition = async (imageData) => {
    try {
      const result = await MLKitOcr.recognize(imageData, { lang: "en" });
      if (result.text) {
        setRecognizedText(result.text);
        Tts.speak(`Recognized text is: ${result.text}`);
      }
    } catch (error) {
      console.error("OCR Error: ", error);
    }
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  const onFrameProcessed = async (frame) => {
    if (cameraReady && frame) {
      const imageData = frame.toDataURL();
      await handleTextRecognition(imageData);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View className="flex-1 justify-center items-center bg-white">
        {device && (
          <View className="flex-3 w-full justify-center items-center bg-black">
            <Camera
              className="w-full h-full"
              device={device}
              isActive={true}
              onInitialized={onCameraReady}
              frameProcessorFps={5}
              frameProcessor={onFrameProcessed}
            />
          </View>
        )}

        {recognizedText ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-bold text-black">{recognizedText}</Text>
          </View>
        ) : (
          <Text className="text-lg text-gray-600 mt-2">Looking for text...</Text>
        )}

        <Text className="text-lg text-gray-500 mt-4">Tap anywhere to go back</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TextRecognition;