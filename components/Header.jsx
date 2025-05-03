import { Image, View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        style={styles.logo}
        source={require("../assets/ResumifAiLogo.png")}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>YouTube Video Summarizer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#666",
  },
  title: {
    fontSize: 75,
    fontWeight: "bold",
    color: "white",
  },
  titleInside: {
    fontSize: 50,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 5,
  },
});
