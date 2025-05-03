import { useState } from "react";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import axios from "axios";

import Output from "./components/Output";
import Header from "./components/Header";

export default function App() {
  const backEndUrl = process.env.EXPO_PUBLIC_SERVER_URL;
  const [urlSubmitted, setUrlSubmitted] = useState("");
  const [summary, setSummary] = useState("Your summary will be displayed here");
  const [selectedWordLimit, setSelectedWordLimit] = useState("200");

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setUrlSubmitted(text);
    const idFound = await urlValidate(text);
    fetchTranscriptionAndSummary(idFound);
  };

  const handleResumifAiPressed = async () => {
    const idFound = await urlValidate(urlSubmitted);
    fetchTranscriptionAndSummary(idFound);
  };

  const fetchTranscriptionAndSummary = async (videoId) => {
    Keyboard.dismiss();

    try {
      if (videoId === "Invalid ID!")
        throw new Error("Invalid ID, try another URL");

      setSummary("Fetching transcription...");

      const transcriptionResponse = await axios.get(
        `${backEndUrl}/transcription/${videoId}`
      );

      setSummary("Generating summary...");

      const summaryResponse = await axios.post(
        `${backEndUrl}/summary/${selectedWordLimit}`,
        {
          transcription: transcriptionResponse.data.transcription,
          wordLimit: selectedWordLimit,
        }
      );

      setSummary(summaryResponse.data.summary);
    } catch (error) {
      setSummary(error.message);
      Alert.alert("Error", error.message);
    }
  };

  const handlePressResetButton = () => {
    setSummary("Your summary will be displayed here");
    setSelectedWordLimit("200");
    setUrlSubmitted("");
  };

  const urlValidate = async (url) => {
    // console.log("URL tested:", url);

    let idDetected = "Invalid ID!";

    // Check if URL is from Youtube and collect its ID
    if (url.includes("https://www.youtube.com/watch?v=")) {
      idDetected = url.split(/watch\?v=|&/)[1];
      idDetected.length == 11 ? null : (idDetected = "Invalid ID!");
    } else if (url.includes("https://youtu.be/")) {
      idDetected = url.split(/youtu.be\/|\?/)[1];
      idDetected.length == 11 ? null : (idDetected = "Invalid ID!");
    } else if (url.includes("https://www.youtube.com/live/")) {
      // Insert here the possibility to recognize live links
      idDetected = url.split(/live\/|\?/)[1];
      idDetected.length == 11 ? null : (idDetected = "Invalid ID!");
    }

    // console.log(`Video ID: ${idDetected}`);

    return idDetected;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Header />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Paste here the video URL"
              placeholderTextColor="#666"
              onChangeText={(text) => setUrlSubmitted(text)}
              value={urlSubmitted}
            />
            <TouchableOpacity
              style={styles.pasteButton}
              onPress={fetchCopiedText}
            >
              <Text style={styles.pasteButtonText}>Paste'n'Go</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleResumifAiPressed()}
            >
              <Text style={styles.buttonText}>ResumifAI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handlePressResetButton}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                selectedWordLimit === "200" && styles.radioButtonSelected,
              ]}
              onPress={() => setSelectedWordLimit("200")}
            >
              <Text style={styles.radioText}>200 words</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                selectedWordLimit === "300" && styles.radioButtonSelected,
              ]}
              onPress={() => setSelectedWordLimit("300")}
            >
              <Text style={styles.radioText}>300 words</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                selectedWordLimit === "noLimits" && styles.radioButtonSelected,
              ]}
              onPress={() => setSelectedWordLimit("noLimits")}
            >
              <Text style={styles.radioText}>No limit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.customWordContainer}>
            <Text style={styles.radioText}>Other quantity (min: 25):</Text>
            <TextInput
              style={styles.customWordInput}
              keyboardType="numeric"
              value={selectedWordLimit}
              onChangeText={(customQuantity) =>
                setSelectedWordLimit(customQuantity)
              }
              maxLength={4}
            />
          </View>
        </View>

        <Output answerAI={summary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00022e",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
  },
  input: {
    padding: 12,
    color: "black",
  },
  pasteButton: {
    padding: 10,
    marginRight: 6,
    backgroundColor: "#666",
    borderRadius: 4,
  },
  pasteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#4a4a4a",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  radioButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#666",
  },
  radioButtonSelected: {
    backgroundColor: "#666",
  },
  radioText: {
    color: "white",
    fontSize: 12,
  },
  customWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  customWordInput: {
    backgroundColor: "white",
    width: 60,
    padding: 4,
    borderRadius: 4,
    color: "black",
  },
  errorContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff000033",
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 8,
    borderRadius: 4,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    fontWeight: "600",
  },
  placeholderContainer: {
    height: 50,
    width: "100%",
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
});
