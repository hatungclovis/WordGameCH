import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { HintData } from '../../types';
import { useGameStore } from '../../services/gameStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface HintOverlayProps {
  visible: boolean;
  hint: HintData | null;
  onClose: () => void;
}

export default function HintOverlay({ visible, hint, onClose }: HintOverlayProps) {
  const { settings } = useGameStore();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const overlayOpacity = useSharedValue(0);
  const hintScale = useSharedValue(0.5);
  const hintOpacity = useSharedValue(0);
  const letterScale = useSharedValue(0);
  const letterOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible && hint) {
      // Start the animation sequence
      startHintAnimation();
    } else {
      // Reset animation values
      overlayOpacity.value = 0;
      hintScale.value = 0.5;
      hintOpacity.value = 0;
      letterScale.value = 0;
      letterOpacity.value = 0;
    }
  }, [visible, hint]);
  
  const startHintAnimation = () => {
    // Phase 1: Show overlay and hint text
    overlayOpacity.value = withTiming(1, { duration: 300 });
    
    hintScale.value = withSequence(
      withTiming(1.2, { 
        duration: 500, 
        easing: Easing.out(Easing.cubic) 
      }),
      withTiming(1, { 
        duration: 200, 
        easing: Easing.inOut(Easing.quad) 
      })
    );
    
    hintOpacity.value = withTiming(1, { duration: 400 });
    
    // Phase 2: Show the letter with zoom effect (delayed)
    letterScale.value = withDelay(
      800,
      withSequence(
        withTiming(2, { 
          duration: 600, 
          easing: Easing.out(Easing.back(1.5)) 
        }),
        withTiming(1.5, { 
          duration: 300, 
          easing: Easing.inOut(Easing.quad) 
        })
      )
    );
    
    letterOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    
    // Phase 3: Auto-close after showing (delayed)
    setTimeout(() => {
      closeHintAnimation();
    }, 3000);
  };
  
  const closeHintAnimation = () => {
    // Fade out letter first
    letterOpacity.value = withTiming(0, { duration: 300 });
    letterScale.value = withTiming(0.5, { duration: 300 });
    
    // Then fade out hint text and overlay
    setTimeout(() => {
      hintOpacity.value = withTiming(0, { duration: 300 });
      hintScale.value = withTiming(0.8, { duration: 300 });
      
      overlayOpacity.value = withTiming(0, { 
        duration: 300 
      }, () => {
        runOnJS(onClose)();
      });
    }, 200);
  };
  
  // Animated styles
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });
  
  const hintTextStyle = useAnimatedStyle(() => {
    return {
      opacity: hintOpacity.value,
      transform: [{ scale: hintScale.value }],
    };
  });
  
  const letterStyle = useAnimatedStyle(() => {
    return {
      opacity: letterOpacity.value,
      transform: [{ scale: letterScale.value }],
    };
  });
  
  if (!visible || !hint) {
    return null;
  }
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity 
          style={[
            styles.touchableArea,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          ]} 
          activeOpacity={1} 
          onPress={closeHintAnimation}
        >
          <View style={styles.centeredContent}>
            <View style={[styles.content, settings.darkMode && styles.darkContent]}>
              {/* Hint Title and Text */}
              <Animated.View style={[styles.hintTextContainer, hintTextStyle]}>
                <Text style={[styles.hintTitle, settings.darkMode && styles.darkText]}>
                  💡 HINT
                </Text>
                <Text style={[styles.hintSubtitle, settings.darkMode && styles.darkSubtitle]}>
                  This letter is in the word:
                </Text>
              </Animated.View>
              
              {/* Large Letter Display */}
              <Animated.View style={[styles.letterContainer, letterStyle]}>
                <View style={[styles.letterTile, settings.darkMode && styles.darkLetterTile]}>
                  <Text style={[styles.letterText, settings.darkMode && styles.darkLetterText]}>
                    {hint.letter}
                  </Text>
                </View>
              </Animated.View>
              
              {/* Optional position hint */}
              {hint.position !== undefined && (
                <Animated.View style={[styles.positionHint, hintTextStyle]}>
                  <Text style={[styles.positionText, settings.darkMode && styles.darkSubtitle]}>
                    Position: {hint.position + 1}
                  </Text>
                </Animated.View>
              )}
              
              {/* Close instruction */}
              <Animated.View style={[styles.closeInstruction, hintTextStyle]}>
                <Text style={[styles.closeText, settings.darkMode && styles.darkSubtitle]}>
                  Tap anywhere to continue
                </Text>
              </Animated.View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: screenWidth * 0.8,
    maxWidth: screenWidth * 0.9,
    // Ensure content stays within safe area and is properly centered
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  darkContent: {
    backgroundColor: '#1a1a1b',
  },
  hintTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  hintTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 10,
  },
  hintSubtitle: {
    fontSize: 18,
    color: '#787c7e',
    textAlign: 'center',
  },
  letterContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  letterTile: {
    width: 120,
    height: 120,
    backgroundColor: '#c9b458',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  darkLetterTile: {
    backgroundColor: '#b8a448',
  },
  letterText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  darkLetterText: {
    color: '#ffffff',
  },
  positionHint: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(201, 180, 88, 0.1)',
    borderRadius: 10,
  },
  positionText: {
    fontSize: 16,
    color: '#787c7e',
    fontWeight: '600',
  },
  closeInstruction: {
    marginTop: 30,
  },
  closeText: {
    fontSize: 14,
    color: '#787c7e',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtitle: {
    color: '#a0a0a0',
  },
});
