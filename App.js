import React, { useState, useEffect } from "react";
import { View, Text, Platform, StyleSheet, ScrollView, StatusBar } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as Speech from "expo-speech";
import { Button, Card, Appbar } from "react-native-paper";
import * as Animatable from "react-native-animatable";

// Composant pour afficher le modèle 3D
function Model({ modelPath }) {
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={1.3} />;
  } catch (error) {
    console.error("Erreur de chargement du modèle :", error);
    return <Text style={styles.errorText}>❌ Modèle introuvable</Text>;
  }
}

export default function App() {
  const models = {
    "Théâtre Romain": require("./assets/models/theatre_romain.glb"),
    "Temple Antique": require("./assets/models/temple_antique.glb"),
  };

  const [selectedMonument, setSelectedMonument] = useState("Théâtre Romain");
  const [currentModel, setCurrentModel] = useState(models["Théâtre Romain"]);
  const [text, setText] = useState("🎤 Dites un monument...");

  useEffect(() => {
    setCurrentModel(models[selectedMonument]);
  }, [selectedMonument]);

  const startListening = () => {
    if (Platform.OS === "web") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setText(command);
        if (command.includes("théâtre")) setSelectedMonument("Théâtre Romain");
        if (command.includes("temple")) setSelectedMonument("Temple Antique");
      };
      recognition.start();
    } else {
      Speech.speak("Dites le nom du monument", { language: "fr" });
    }
  };

  const handleNarration = () => {
    Speech.speak(`Voici ${selectedMonument}`, {
      language: "fr",
      pitch: 0.8,
      rate: 0.9,
    });
  };

  return (
    <>
      {/* Barre de navigation */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="🏛️ Visite Virtuelle" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Sélection des monuments */}
        <Animatable.View animation="fadeInDown" delay={300} style={styles.section}>
          <Text style={styles.title}>🏛️ Sélectionnez un monument</Text>
          <Card style={styles.card}>
            <Picker
              selectedValue={selectedMonument}
              onValueChange={(itemValue) => setSelectedMonument(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Théâtre Romain" value="Théâtre Romain" />
              <Picker.Item label="Temple Antique" value="Temple Antique" />
            </Picker>
          </Card>
        </Animatable.View>

        {/* Modèle 3D */}
        <Animatable.View animation="fadeInUp" delay={500} style={styles.canvasContainer}>
          <Canvas style={styles.canvas}>
            <ambientLight intensity={1} />
            <spotLight position={[10, 15, 10]} angle={0.3} intensity={2} castShadow />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <Model modelPath={currentModel} />
            <OrbitControls />
          </Canvas>
        </Animatable.View>

        {/* Reconnaissance vocale */}
        <Animatable.View animation="fadeIn" delay={700} style={styles.section}>
          <Card style={styles.voiceCard}>
            <Text style={styles.text}>🎤 {text}</Text>
            <Button mode="contained" onPress={startListening} style={styles.button}>
              🎙️ Parler
            </Button>
          </Card>
        </Animatable.View>

        {/* Narration */}
        <Animatable.View animation="fadeInUp" delay={900} style={styles.section}>
          <Button mode="contained" onPress={handleNarration} style={styles.button}>
            🔊 Écouter la narration
          </Button>
        </Animatable.View>
      </ScrollView>
    </>
  );
}

// **💡 Design ultra-moderne et épuré**
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#0D1117", padding: 20, alignItems: "center" },
  appbar: { backgroundColor: "#1F6FEB", elevation: 5 },
  appbarTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  section: { width: "90%", marginBottom: 25, alignItems: "center" },
  canvasContainer: { height: 400, width: "100%", justifyContent: "center", alignItems: "center" },
  title: { color: "#58A6FF", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  text: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 10 },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  picker: { width: "100%", color: "#fff", backgroundColor: "#161B22", borderRadius: 8 },
  card: {
    width: "100%",
    backgroundColor: "#161B22",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    elevation: 5,
  },
  voiceCard: {
    width: "100%",
    backgroundColor: "#161B22",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    elevation: 5,
  },
  button: {
    backgroundColor: "#1F6FEB",
    marginTop: 10,
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    textAlign: "center",
  },
  canvas: { height: 350, width: "100%", backgroundColor: "#161B22", borderRadius: 10 },
});
