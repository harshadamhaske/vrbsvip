import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
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
    // Load Coco SSD model for object detection
    const model = await cocoSsd.load();

    // Detect objects in the camera frame
    const predictions = await model.detect(imageData);

    if (predictions.length > 0) {
      const object = predictions[0].class; // Get the first detected object
      setRecognizedObject(object);
      Tts.speak(`Recognized object is ${object}`); // Speak the recognized object
    }
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  const onFrameProcessed = async (frame) => {
    if (cameraReady && frame) {
      // Process the camera frame for object recognition
      const imageTensor = tf.browser.fromPixels(frame);
      await handleObjectRecognition(imageTensor);
      imageTensor.dispose(); // Clean up memory
    }
  };

  if (device == null) return <Text>Loading camera...</Text>;

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View style={styles.container}>
        {/* Camera Section */}
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            onReady={onCameraReady}
            onFrameProcessor={onFrameProcessed} // Updated to use frame processor
            frameProcessorFps={5} // Limit FPS to improve performance
          />
        </View>

        {/* Recognized Object Section */}
        {recognizedObject ? (
          <View style={styles.recognizedContainer}>
            <Text style={styles.recognizedText}>{recognizedObject}</Text>
          </View>
        ) : (
          <Text style={styles.instructions}>Looking for objects...</Text>
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

export default ObjectRecognition;