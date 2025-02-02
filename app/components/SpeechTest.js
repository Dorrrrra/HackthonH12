import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import * as Animatable from 'react-native-animatable';

// Descriptions des monuments par époque
const narrations = {
    "temple_jupiter": {
        "rome": "Voici le temple de Jupiter, construit sous l’Empire romain au IIe siècle. Il dominait la cité de Sbiba.",
        "numide": "À l’époque numide, cet emplacement était un lieu de culte ancestral dédié aux divinités berbères.",
        "saint-augustin": "Durant l’ère de Saint Augustin, ce temple a été en partie transformé en lieu de prière chrétien.",
        "byzantin": "Sous l’empire byzantin, des fortifications ont été ajoutées autour du temple pour le protéger."
    },
    "theatre_romain": {
        "rome": "Le théâtre romain de Sbiba pouvait accueillir des centaines de spectateurs pour des pièces et des combats de gladiateurs.",
        "numide": "À cette époque, il n'existait pas encore, mais des rassemblements avaient lieu sur la place centrale.",
        "saint-augustin": "Le théâtre a commencé à perdre son usage païen et servait parfois à des lectures philosophiques.",
        "byzantin": "Les Byzantins ont renforcé certaines structures, mais l’endroit était moins utilisé pour les spectacles."
    }
};

const SpeechTest = () => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [selectedMonument, setSelectedMonument] = useState("temple_jupiter");
    const [selectedEpoch, setSelectedEpoch] = useState("rome");

    // Charger les voix disponibles et choisir une voix historique
    useEffect(() => {
        const getVoices = async () => {
            const availableVoices = await Speech.getAvailableVoicesAsync();
            setVoices(availableVoices);
            
            // Sélectionner automatiquement une voix historique (si disponible)
            const historicalVoice = availableVoices.find(voice => 
                voice.name.toLowerCase().includes("grandpa") || 
                voice.name.toLowerCase().includes("narrator") || 
                voice.name.toLowerCase().includes("deep")
            );

            setSelectedVoice(historicalVoice ? historicalVoice.identifier : availableVoices[0]?.identifier);
        };
        getVoices();
    }, []);

    // Fonction pour lire la description correspondant au monument et à l'époque
    const speak = () => {
        if (!selectedVoice) {
            alert("Aucune voix disponible !");
            return;
        }
        
        const description = narrations[selectedMonument][selectedEpoch];
        Speech.speak(description, {
            language: 'fr',
            pitch: 0.85, // Ton grave pour immersion
            rate: 0.85, // Lecture lente pour une meilleure narration
            voice: selectedVoice
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Animatable.View animation="fadeInDown" delay={200} style={styles.section}>
                <Text style={styles.title}>🏛 Sélectionnez un monument</Text>
                <View style={styles.card}>
                    <Picker
                        selectedValue={selectedMonument}
                        onValueChange={(itemValue) => setSelectedMonument(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Temple de Jupiter" value="temple_jupiter" />
                        <Picker.Item label="Théâtre Romain" value="theatre_romain" />
                    </Picker>
                </View>
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" delay={300} style={styles.section}>
                <Text style={styles.title}>📜 Sélectionnez une époque</Text>
                <View style={styles.card}>
                    <Picker
                        selectedValue={selectedEpoch}
                        onValueChange={(itemValue) => setSelectedEpoch(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Rome (Septime Sévère)" value="rome" />
                        <Picker.Item label="Numide (Roi Jugurtha)" value="numide" />
                        <Picker.Item label="Saint Augustin" value="saint-augustin" />
                        <Picker.Item label="Byzantin (Général Solomon)" value="byzantin" />
                    </Picker>
                </View>
            </Animatable.View>

            <Animatable.View animation="fadeInRight" delay={400} style={styles.section}>
                <Text style={styles.title}>🔊 Voix sélectionnée</Text>
                <View style={styles.card}>
                    <Picker
                        selectedValue={selectedVoice}
                        onValueChange={(itemValue) => setSelectedVoice(itemValue)}
                        style={styles.picker}
                    >
                        {voices.map((voice) => (
                            <Picker.Item key={voice.identifier} label={voice.name} value={voice.identifier} />
                        ))}
                    </Picker>
                </View>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={500} style={styles.section}>
                <TouchableOpacity style={styles.button} onPress={speak}>
                    <Text style={styles.buttonText}>🎙️ Écouter la narration</Text>
                </TouchableOpacity>
            </Animatable.View>
        </ScrollView>
    );
};

// **💡 Design ultra-moderne et épuré**
const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#121212", padding: 20, alignItems: "center" },
    section: { width: "90%", marginBottom: 25, alignItems: "center" },
    title: { color: "#58A6FF", fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    picker: { width: "100%", color: "#fff", backgroundColor: "#1E1E1E", borderRadius: 8 },
    card: {
        width: "100%",
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        elevation: 5,
    },
    button: {
        backgroundColor: "#1F6FEB",
        marginTop: 10,
        paddingVertical: 12,
        width: "90%",
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    }
});

export default SpeechTest;
