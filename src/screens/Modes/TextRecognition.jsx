import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Camera, useCameraDevices } from 'react-native-vision-camera'; // Using vision-camera for the camera
import MLKitOcr from "react-native-mlkit-ocr"; // ML Kit OCR
import Tts from "react-native-tts"; // for text-to-speech
import { useNavigation } from "@react-navigation/native";

const TextRecognition = () => {
  const [recognizedText, setRecognizedText] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const navigation = useNavigation();
  
  const devices = useCameraDevices();
  const device = devices.back; // Get the back camera

  useEffect(() => {
    // Initialize text-to-speech
    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultRate(0.5); // Set rate of speech
  }, []);

  const handleTextRecognition = async (imageData) => {
    try {
      // Perform OCR on the camera image using MLKit
      const result = await MLKitOcr.recognize(imageData, {
        lang: "en", // Language code for English
      });

      if (result.text) {
        setRecognizedText(result.text); // Update the recognized text
        Tts.speak(`Recognized text is: ${result.text}`); // Speak the recognized text
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
      const imageData = frame.toDataURL(); // Convert frame to a Data URL for OCR
      await handleTextRecognition(imageData);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View style={styles.container}>
        {/* Camera Section */}
        {device != null && (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              device={device}
              isActive={true}
              onInitialized={onCameraReady}
              frameProcessorFps={5} // Limit FPS to improve performance
              frameProcessor={onFrameProcessed} // Process frames for text recognition
            />
          </View>
        )}

        {/* Recognized Text Section */}
        {recognizedText ? (
          <View style={styles.recognizedContainer}>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </View>
        ) : (
          <Text style={styles.instructions}>Looking for text...</Text>
        )}

        <Text style={styles.instructions}>Tap anywhere to go back</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  recognizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recognizedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  instructions: {
    fontSize: 18,
    marginTop: 10,
    color: "gray",
  },
});

export default TextRecognition;