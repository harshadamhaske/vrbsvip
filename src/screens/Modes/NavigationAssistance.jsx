import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Tts from "react-native-tts";

const NavigationAssistance = () => {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [model, setModel] = useState(null);
  const [recognizedObjects, setRecognizedObjects] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    };
    requestPermission();

    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();

    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultRate(0.5);
  }, []);

  const handleObjectRecognition = async () => {
    if (!cameraRef.current || !model) return;

    try {
      const photo = await cameraRef.current.takePhoto();
      const imageTensor = tf.browser.fromPixels(photo);
      const predictions = await model.detect(imageTensor);
      setRecognizedObjects(predictions);

      if (predictions.length > 0) {
        const closestObject = predictions[0].class;
        Tts.speak(`Closest object detected: ${closestObject}`);
      } else {
        Tts.speak("No objects detected.");
      }
    } catch (error) {
      console.error("Error during object recognition:", error);
      Alert.alert("Error", "Failed to recognize objects.");
    }
  };

  if (!hasPermission) {
    return <Text className="text-lg text-red-600 text-center">Camera permission is required.</Text>;
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
      {device ? (
        <Camera ref={cameraRef} className="w-full h-[70%]" device={device} isActive={true} photo={true} />
      ) : (
        <Text className="text-lg text-gray-600">Loading Camera...</Text>
      )}

      <TouchableOpacity className="bg-blue-600 p-3 rounded-lg mt-5" onPress={handleObjectRecognition}>
        <Text className="text-white text-lg">Detect Objects</Text>
      </TouchableOpacity>

      <View className="mt-5">
        {recognizedObjects.map((obj, index) => (
          <Text key={index} className="text-lg text-black">
            {obj.class} (Confidence: {Math.round(obj.score * 100)}%)
          </Text>
        ))}
      </View>
    </View>
  );
};

export default NavigationAssistance;
