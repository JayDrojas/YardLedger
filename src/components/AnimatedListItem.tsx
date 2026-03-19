import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  maxDelay?: number;
}

const STAGGER_MS = 50;
const DURATION_MS = 350;

export default function AnimatedListItem({
  children,
  index,
  maxDelay = 500,
}: AnimatedListItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const delay = Math.min(index * STAGGER_MS, maxDelay);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: DURATION_MS,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: DURATION_MS,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index, maxDelay]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}
