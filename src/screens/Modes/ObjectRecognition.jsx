import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera"; // Updated Camera import
import Tts from "react-native-tts"; // for text-to-speech
import * as tf from "@tensorflow/tfjs"; // TensorFlow
import * as cocoSsd from "@tensorflow-models/coco-ssd"; // Object detection model
import "@tensorflow/tfjs-react-native"; // TensorFlow for React Native

const ObjectRecognition = ({ navigation }) => {
  const [recognizedObject, setRecognizedObject] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    // Initialize text-to-speech
    Tts.setDefaultLanguage("en-US");

    // Load the TensorFlow model
    const loadModel = async () => {
      await tf.ready(); // Ensure TensorFlow is ready
      console.log("TensorFlow ready");
    };

    loadModel();
  }, []);

  const handleObjectRecognition = async (imageData) => {
    const model = await cocoSsd.load();
    const predictions = await model.detect(imageData);

    if (predictions.length > 0) {
      const object = predictions[0].class;
      setRecognizedObject(object);
      Tts.speak(`Recognized object is ${object}`);
    }
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  const onFrameProcessed = async (frame) => {
    if (cameraReady && frame) {
      const imageTensor = tf.browser.fromPixels(frame);
      await handleObjectRecognition(imageTensor);
      imageTensor.dispose();
    }
  };

  if (device == null) return <Text className="text-lg text-gray-600">Loading camera...</Text>;

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View className="flex-1 justify-center items-center bg-white">
        {/* Camera Section */}
        <View className="flex-3 w-full justify-center items-center bg-black">
          <Camera
            className="w-full h-full"
            device={device}
            isActive={true}
            onReady={onCameraReady}
            onFrameProcessor={onFrameProcessed}
            frameProcessorFps={5}
          />
        </View>

        {/* Recognized Object Section */}
        {recognizedObject ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-bold text-black">{recognizedObject}</Text>
          </View>
        ) : (
          <Text className="text-lg text-gray-600 mt-2">Looking for objects...</Text>
        )}

        <Text className="text-lg text-gray-500 mt-4">Tap anywhere to go back</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ObjectRecognition;
