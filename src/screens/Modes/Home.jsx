import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import initVoice from "../../services/voiceRecognitionService";
import { setResults } from "../../reducers/voice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const voiceResults = useSelector((state) => state.voice.results) || []; // Default to empty array
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(null);

  // Function to handle tap navigation
  const handleTap = (destination) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 500) {
      setTapCount((prev) => prev + 1);
    } else {
      setTapCount(1);
    }
    setLastTap(now);

    if (destination === "ObjectRecognition" && tapCount === 1) {
      navigation.navigate("ObjectRecognition");
      setTapCount(0);
    } else if (destination === "TextRecognition" && tapCount === 2) {
      navigation.navigate("TextRecognition");
      setTapCount(0);
    } else if (destination === "NavigationAssistance" && tapCount === 3) {
      navigation.navigate("NavigationAssistance");
      setTapCount(0);
    }
  };

  // Voice commands navigation
  useEffect(() => {
    initVoice.setCallback("onSpeechResults", (e) => {
      const command = e.value[0]?.toLowerCase();
      dispatch(setResults(e.value));

      if (command.includes("object recognition")) {
        navigation.navigate("ObjectRecognition");
      } else if (command.includes("text recognition")) {
        navigation.navigate("TextRecognition");
      } else if (command.includes("navigation assistance")) {
        navigation.navigate("NavigationAssistance");
      }
    });

    return () => {
      initVoice.destroy();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* View for Object Recognition */}
      <TouchableWithoutFeedback onPress={() => handleTap("ObjectRecognition")}>
        <View style={styles.section}>
          <Text style={styles.title}>Tap Once for Object Recognition</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* View for Text Recognition */}
      <TouchableWithoutFeedback onPress={() => handleTap("TextRecognition")}>
        <View style={styles.section}>
          <Text style={styles.title}>Tap Twice for Text Recognition</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* View for Navigation Assistance */}
      <TouchableWithoutFeedback onPress={() => handleTap("NavigationAssistance")}>
        <View style={styles.section}>
          <Text style={styles.title}>Tap Thrice for Navigation Assistance</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Display detected voice command */}
      <Text style={styles.results}>Voice Command: {voiceResults.join(", ")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  section: {
    width: "80%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  results: {
    marginTop: 20,
    fontSize: 16,
    color: "blue",
  },
});

export default HomeScreen;
