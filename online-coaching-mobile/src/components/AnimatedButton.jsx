import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedButton = ({ children, onPress, style, loading, disabled, ...props }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      if (!loading && !disabled) {
        scale.value = withSpring(0.9);
      }
    })
    .onEnd(() => {
      if (!loading && !disabled) {
        scale.value = withSequence(
          withSpring(1.1),
          withSpring(1)
        );
        if (onPress) {
          // Trigger onPress after animation
          setTimeout(() => onPress(), 100);
        }
      }
    })
    .onCancel(() => {
      if (!loading && !disabled) {
        scale.value = withSpring(1);
      }
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle, style]}>
        <Button
          mode="contained"
          onPress={onPress}
          loading={loading}
          disabled={disabled}
          style={[styles.button, { backgroundColor: !disabled ? colors.primary : colors.surfaceVariant }]}
          contentStyle={styles.buttonContent}
          labelStyle={{ color: !disabled ? colors.onError : colors.onSurfaceVariant }}
          {...props}
        >
          {children}
        </Button>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default AnimatedButton;
