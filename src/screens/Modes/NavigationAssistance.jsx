import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera"; // ✅ Correct Camera
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd"; // ✅ Object Detection
import Tts from "react-native-tts"; // ✅ Text to Speech

const NavigationAssistance = () => {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [model, setModel] = useState(null);
  const [recognizedObjects, setRecognizedObjects] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // ✅ Ask for Camera Permission
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    };
    requestPermission();

    // ✅ Load TensorFlow Model
    const loadModel = async () => {
      await tf.ready(); // Ensure TensorFlow is ready
      const loadedModel = await cocoSsd.load(); // Load model
      setModel(loadedModel);
    };
    loadModel();

    // ✅ Initialize TTS
    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultRate(0.5);
  }, []);

  const handleObjectRecognition = async () => {
    if (!cameraRef.current || !model) return;

    try {
      const photo = await cameraRef.current.takePhoto(); // ✅ Take a snapshot
      const imageTensor = tf.browser.fromPixels(photo); // ✅ Convert to Tensor

      const predictions = await model.detect(imageTensor); // ✅ Object Detection
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
    return <Text style={styles.permissionText}>Camera permission is required.</Text>;
  }

  return (
    <View style={styles.container}>
      {device ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        <Text>Loading Camera...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleObjectRecognition}>
        <Text style={styles.buttonText}>Detect Objects</Text>
      </TouchableOpacity>

      <View style={styles.recognizedContainer}>
        {recognizedObjects.map((obj, index) => (
          <Text key={index} style={styles.recognizedText}>
            {obj.class} (Confidence: {Math.round(obj.score * 100)}%)
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { width: "100%", height: "70%" },
  button: {
    backgroundColor: "blue",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: { color: "white", fontSize: 18 },
  recognizedContainer: { marginTop: 20 },
  recognizedText: { fontSize: 16, color: "black" },
  permissionText: { fontSize: 18, color: "red", textAlign: "center" },
});

export default NavigationAssistance;