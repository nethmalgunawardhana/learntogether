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
      {/* Header Text */}
      <Text style={styles.headerText}>PING INTELLIGENCE</Text>

      {/* Logo Area */}
      <View style={styles.logoContainer}>
        {/* Stacked Layers Icon */}
        <View style={styles.layersContainer}>
          <View style={[styles.layer, styles.layer1]} />
          <View style={[styles.layer, styles.layer2]} />
          <View style={[styles.layer, styles.layer3]} />
        </View>

        {/* Curved Wave Background */}
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
          
          {/* Percentage Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>94%</Text>
          </View>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to the online{'\n'}E-Learning App</Text>
        
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur{'\n'}
          adipiscing elit, sed do eiusmod tempor{'\n'}
          incididunt ut.
        </Text>

        {/* Start Learning Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleStartLearning}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start Learning...</Text>
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
  headerText: {
    color: '#A0A0C0',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  layersContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  layer: {
    position: 'absolute',
    width: 90,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    transform: [{ perspective: 400 }],
  },
  layer1: {
    top: 0,
    opacity: 1,
    transform: [{ perspective: 400 }, { rotateX: '-10deg' }],
  },
  layer2: {
    top: 30,
    opacity: 0.9,
  },
  layer3: {
    top: 60,
    opacity: 0.8,
    transform: [{ perspective: 400 }, { rotateX: '10deg' }],
  },
  waveContainer: {
    width: width,
    height: height * 0.5,
    position: 'relative',
  },
  wave: {
    width: width,
    height: height * 0.5,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    transform: [{ scaleX: 2 }],
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: width * 0.15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A4FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A4FFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 24,
    fontWeight: '600',
    color: '#4A4399',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
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
