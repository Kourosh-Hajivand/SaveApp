/* eslint-disable react-hooks/immutability -- Reanimated shared values are mutated via `.value` inside gesture worklets by design; the immutability rule flags these deferred worklet writes as false positives. */
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { Image } from 'expo-image';
import { memo, useCallback, useState } from 'react';
import {
  type ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const DISMISS_THRESHOLD = 120;
const SWIPE_THRESHOLD_RATIO = 0.25;

function clampValue(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

interface PreviewPageProps {
  source: ImageSourcePropType;
  index: number;
  width: number;
  height: number;
  activeIndex: SharedValue<number>;
  scale: SharedValue<number>;
  offsetX: SharedValue<number>;
  offsetY: SharedValue<number>;
}

function PreviewPage({
  source,
  index,
  width,
  height,
  activeIndex,
  scale,
  offsetX,
  offsetY,
}: PreviewPageProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex.value;
    return {
      transform: isActive
        ? [
            { translateX: offsetX.value },
            { translateY: offsetY.value },
            { scale: scale.value },
          ]
        : [{ scale: 1 }],
    };
  });

  return (
    <View style={[styles.page, { width, height }]}>
      <Animated.View style={animatedStyle}>
        <Image
          source={source}
          style={{ width, height }}
          contentFit="contain"
          transition={0}
        />
      </Animated.View>
    </View>
  );
}

interface ImagePreviewProps {
  visible: boolean;
  images: ImageSourcePropType[];
  initialIndex: number;
  onClose: () => void;
}

function ImagePreviewComponent({ visible, images, initialIndex, onClose }: ImagePreviewProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const lastIndex = images.length - 1;

  const [pageIndex, setPageIndex] = useState(initialIndex);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const savedOffsetX = useSharedValue(0);
  const savedOffsetY = useSharedValue(0);

  const activeIndex = useSharedValue(initialIndex);
  const translateX = useSharedValue(-initialIndex * width);
  const baseTranslateX = useSharedValue(-initialIndex * width);
  const translateY = useSharedValue(0);

  const resetTransforms = useCallback(() => {
    scale.value = 1;
    savedScale.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
    savedOffsetX.value = 0;
    savedOffsetY.value = 0;
    translateY.value = 0;
  }, [scale, savedScale, offsetX, offsetY, savedOffsetX, savedOffsetY, translateY]);

  const handleShow = useCallback(() => {
    activeIndex.value = initialIndex;
    translateX.value = -initialIndex * width;
    baseTranslateX.value = -initialIndex * width;
    resetTransforms();
    setPageIndex(initialIndex);
  }, [activeIndex, baseTranslateX, initialIndex, resetTransforms, translateX, width]);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clampValue(savedScale.value * event.scale, 1, MAX_SCALE);
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        scale.value = withTiming(1);
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
        savedScale.value = 1;
        savedOffsetX.value = 0;
        savedOffsetY.value = 0;
      } else {
        savedScale.value = scale.value;
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
        savedScale.value = 1;
        savedOffsetX.value = 0;
        savedOffsetY.value = 0;
      } else {
        scale.value = withTiming(DOUBLE_TAP_SCALE);
        savedScale.value = DOUBLE_TAP_SCALE;
      }
    });

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(() => {
      baseTranslateX.value = translateX.value;
      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
    })
    .onUpdate((event) => {
      if (scale.value > 1) {
        const maxX = (width * (scale.value - 1)) / 2;
        const maxY = (height * (scale.value - 1)) / 2;
        offsetX.value = clampValue(savedOffsetX.value + event.translationX, -maxX, maxX);
        offsetY.value = clampValue(savedOffsetY.value + event.translationY, -maxY, maxY);
        return;
      }
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = event.translationY;
      } else {
        translateX.value = baseTranslateX.value + event.translationX;
      }
    })
    .onEnd((event) => {
      if (scale.value > 1) {
        savedOffsetX.value = offsetX.value;
        savedOffsetY.value = offsetY.value;
        return;
      }

      const isVertical = Math.abs(event.translationY) > Math.abs(event.translationX);
      if (isVertical) {
        if (Math.abs(translateY.value) > DISMISS_THRESHOLD) {
          runOnJS(onClose)();
        } else {
          translateY.value = withTiming(0);
        }
        return;
      }

      let nextIndex = activeIndex.value;
      if (event.translationX < -width * SWIPE_THRESHOLD_RATIO && nextIndex < lastIndex) {
        nextIndex += 1;
      } else if (event.translationX > width * SWIPE_THRESHOLD_RATIO && nextIndex > 0) {
        nextIndex -= 1;
      }
      activeIndex.value = nextIndex;
      translateX.value = withTiming(-nextIndex * width);
      runOnJS(setPageIndex)(nextIndex);
    });

  const composedGesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pan, pinch));

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(Math.abs(translateY.value) / 400, 0.85),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />

        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[styles.strip, { width: width * images.length, height }, stripStyle]}
          >
            {images.map((source, index) => (
              <PreviewPage
                key={`preview-${index}`}
                source={source}
                index={index}
                width={width}
                height={height}
                activeIndex={activeIndex}
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
              />
            ))}
          </Animated.View>
        </GestureDetector>

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close preview"
            onPress={onClose}
            hitSlop={12}
            style={styles.closeButton}
          >
            <Text style={styles.closeGlyph}>✕</Text>
          </Pressable>

          {images.length > 1 ? (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{`${pageIndex + 1} / ${images.length}`}</Text>
            </View>
          ) : null}

          <View style={styles.closeButton} />
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backdrop: {
    backgroundColor: '#000000',
  },
  strip: {
    flexDirection: 'row',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  closeGlyph: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  counter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  counterText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
});

export const ImagePreview = memo(ImagePreviewComponent);
