import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const handleStartLearning = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#4A4399', '#3D3581', '#2E2868']}
      style={styles.container}
    >
      {/* Book Icon - Top Logo */}
      <View style={styles.topIconContainer}>
        <Ionicons name="book" size={160} color="white" />
        
      </View>

      {/* Logo Area */}
      <View style={styles.logoContainer}>
        <View style={styles.featureBadgesContainer}>
          <View style={styles.featureBadge}>
            <Ionicons name="book" size={16} color={COLORS.primary} />
            <Text style={styles.featureText}>Learn</Text>
          </View>
          <View style={styles.featureBadge}>
            <Ionicons name="people" size={16} color={COLORS.secondary} />
            <Text style={styles.featureText}>Connect</Text>
          </View>
          <View style={styles.featureBadge}>
            <Ionicons name="trophy" size={16} color={COLORS.accent} />
            <Text style={styles.featureText}>Grow</Text>
          </View>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Learn Together</Text>
        
        <Text style={styles.description}>
          Connect with peers, share knowledge,{'\n'}
          and grow together through collaborative{'\n'}
          learning and study groups
        </Text>

        {/* Start Learning Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleStartLearning}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topIconContainer: {
    alignItems: 'center',
    paddingTop: 180,
    marginBottom: 40,
  },
  taglineText: {
    color: 'white',
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 16,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  featureBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  featureBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A4399',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2E2868',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 8,
    width: width - 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SplashScreen;
