import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive utility functions
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

const responsiveFont = (small, medium, large) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const responsiveSpacing = (small, medium, large) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const responsiveWidth = (percentage) => screenWidth * (percentage / 100);

export default function Index() {
  const [isModalVisible, setIsModalVisible] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [displayedText, setDisplayedText] = React.useState('');
  const fullText = "Welcome To Aaron's Movie Recommender!!";

  const handleSubscribe = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    if (!isValid) {
      if (Platform.OS === 'web') {
        // Use browser alert to ensure visibility on web
        // eslint-disable-next-line no-alert
        alert('Invalid email. Please enter a valid email address.');
      } else {
        Alert.alert('Invalid email', 'Please enter a valid email address.');
      }
      return;
    }

    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      alert("Subscribed! You're all set for weekly picks!");
      setIsModalVisible(false);
    } else {
      Alert.alert('Subscribed', "You're all set for weekly picks!", [
        { text: 'OK', onPress: () => setIsModalVisible(false) },
      ]);
    }
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!!</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/Home')}>
          <Text style={styles.primaryButtonText}>Explore Movies</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get weekly movie picks</Text>
            <Text style={styles.cardSubtitle}>Sign up to receive curated recommendations by email.</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.signupButton} onPress={handleSubscribe}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.linkText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f13',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveSpacing(16, 20, 24),
    paddingVertical: responsiveSpacing(20, 24, 32),
  },
  title: {
    color: Colors.dark.tint,
    fontSize: responsiveFont(32, 36, 40),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: responsiveSpacing(24, 32, 40),
    lineHeight: responsiveFont(32, 38, 44),
    paddingHorizontal: responsiveSpacing(8, 12, 16),
    letterSpacing: '1px',
  },
  primaryButton: {
    backgroundColor: '#551313',
    paddingHorizontal: responsiveSpacing(16, 20, 24),
    paddingVertical: responsiveSpacing(10, 12, 14),
    borderRadius: 10,
    minHeight: 44, // Ensure minimum touch target
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: responsiveFont(14, 16, 18),
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveSpacing(16, 20, 24),
  },
  card: {
    width: '100%',
    maxWidth: isSmallScreen ? responsiveWidth(95) : 420,
    backgroundColor: '#121821',
    borderRadius: responsiveSpacing(12, 14, 16),
    padding: responsiveSpacing(16, 18, 20),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginHorizontal: responsiveSpacing(8, 12, 16),
  },
  cardTitle: {
    color: '#fff',
    fontSize: responsiveFont(20, 24, 30),
    fontWeight: '700',
    marginBottom: responsiveSpacing(4, 5, 6),
    lineHeight: responsiveFont(26, 30, 36),
  },
  cardSubtitle: {
    color: '#d1d5db',
    fontSize: responsiveFont(12, 13, 14),
    marginBottom: responsiveSpacing(12, 14, 16),
    lineHeight: responsiveFont(16, 18, 20),
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1f2a37',
    backgroundColor: '#0b1220',
    color: '#fff',
    paddingHorizontal: responsiveSpacing(10, 12, 14),
    paddingVertical: responsiveSpacing(10, 12, 14),
    borderRadius: 10,
    marginBottom: responsiveSpacing(10, 12, 14),
    fontSize: responsiveFont(14, 15, 16),
    minHeight: 44, // Ensure minimum touch target
  },
  signupButton: {
    backgroundColor: '#551313',
    borderRadius: 10,
    paddingVertical: responsiveSpacing(10, 12, 14),
    alignItems: 'center',
    marginBottom: responsiveSpacing(6, 7, 8),
    minHeight: 44, // Ensure minimum touch target
  },
  signupButtonText: {
    color: '#fff',
    fontSize: responsiveFont(14, 16, 18),
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: responsiveSpacing(8, 10, 12),
    minHeight: 44, // Ensure minimum touch target
  },
  linkText: {
    color: '#9ca3af',
    fontSize: responsiveFont(12, 13, 14),
  },
});