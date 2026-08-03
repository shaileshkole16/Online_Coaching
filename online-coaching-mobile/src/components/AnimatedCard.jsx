import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from 'react-native-paper';

const AnimatedCard = ({ children, onPress, style, ...props }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      if (onPress) {
        runOnJS(onPress)();
      }
    })
    .onCancel(() => {
      scale.value = withSpring(1);
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle, style]}>
        <Card
          style={[styles.card, { backgroundColor: colors.surface }]}
          {...props}
        >
          {children}
        </Card>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    borderRadius: 12,
  },
});

export default AnimatedCard;
