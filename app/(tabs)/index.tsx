import React from 'react';
import { View, Text } from 'react-native';
import SpeechTest from '../components/SpeechTest';

const HomeScreen = () => {
  return (
    <View>
      <Text>Bienvenue à Sbiba AR</Text>
      <SpeechTest />
    </View>
  );
};

export default HomeScreen;
