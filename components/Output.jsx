import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Output({
  answerAI = "Your summary will be displayed here",
}) {
  let answerAiList = answerAI.split("- ");

  if (answerAiList[0] === "") {
    answerAiList.shift();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {answerAiList.map((topic, index) => {
          const isSpecialMessage = [
            "Your summary will be displayed here",
            "Generating summary...",
            "Fetching transcription...",
          ].includes(topic);

          return (
            <Text key={index} style={styles.text}>
              {topic}
            </Text>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    marginTop: 16,
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  text: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
    textAlign: "justify",
  },
});
