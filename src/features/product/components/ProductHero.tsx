import { colors } from '@/constants/colors';
import { Image } from 'expo-image';
import { memo, useCallback, useState } from 'react';
import {
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { ImagePreview } from './ImagePreview';

/** Figma hero aspect ratio (height / width). */
const HERO_RATIO = 308.573 / 430;

interface ProductHeroProps {
  images: ImageSourcePropType[];
}

function ProductHeroComponent({ images }: ProductHeroProps) {
  const { width } = useWindowDimensions();
  const heroHeight = Math.round(width * HERO_RATIO);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex((current) => (current === next ? current : next));
    },
    [width],
  );

  const handleOpenPreview = useCallback((index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  return (
    <View style={[styles.container, { height: heroHeight }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Pressable key={`hero-${index}`} onPress={() => handleOpenPreview(index)}>
            <Image
              source={image}
              style={{ width, height: heroHeight }}
              contentFit="cover"
              transition={200}
            />
          </Pressable>
        ))}
      </ScrollView>

      {images.length > 1 ? (
        <View style={styles.dots} pointerEvents="none">
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}

      <ImagePreview
        visible={previewVisible}
        images={images}
        initialIndex={previewIndex}
        onClose={handleClosePreview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.blackText,
  },
  dots: {
    position: 'absolute',
    // Keep the indicator clear of the white sheet that overlaps the hero (~24px).
    bottom: 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.59)',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.white,
  },
});

export const ProductHero = memo(ProductHeroComponent);
