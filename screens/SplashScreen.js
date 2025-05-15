import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({navigation}) { 
  const insets = useSafeAreaInsets();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const circleScale = useSharedValue(0);
  
  useEffect(() => {
    // Animate logo
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    );
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    // Animate background
    backgroundOpacity.value = withTiming(1, { duration: 1000 });
    
    // Animate text
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(600, withTiming(0, { duration: 800 }));
    
    // Animate circle
    circleScale.value = withDelay(200, withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.cubic) 
    }));
    
    // Navigate to main after animation
    setTimeout(() => {
      navigation.replace('Main');
    }, 2500);
  }, []);
  
  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });
  
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });
  
  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });
  
  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, backgroundStyle]}>
        <LinearGradient
          colors={['#0A0A12', '#1A103D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
        
        <Animated.View style={[styles.circle, circleStyle]}>
          <LinearGradient
            colors={['rgba(255, 61, 255, 0.2)', 'rgba(93, 0, 255, 0.05)']}
            style={styles.circleGradient}
          />
        </Animated.View>
      </Animated.View>
      
      <View style={styles.contentContainer}>
        <MaskedView
          style={styles.logoContainer}
          maskElement={
            <Animated.View style={[styles.logoMask, logoStyle]}>
              <View style={styles.logoText}>
                <View style={styles.logoN} />
                <View style={styles.logoF1} />
                <View style={styles.logoF2} />
                <View style={styles.logoT} />
              </View>
            </Animated.View>
          }
        >
          <LinearGradient
            colors={['#FF3DFF', '#5D00FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          />
        </MaskedView>
        
        <Animated.Text style={[styles.title, textStyle]}>
          NEXUS
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, textStyle]}>
          Premium NFT Marketplace
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    top: -width * 0.5,
    left: -width * 0.25,
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.75,
  },
  contentContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logoMask: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGradient: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  logoN: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 15,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  logoF1: {
    position: 'absolute',
    left: 25,
    top: 0,
    width: 15,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  logoF2: {
    position: 'absolute',
    left: 25,
    top: 0,
    width: 40,
    height: 15,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  logoT: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 15,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
});