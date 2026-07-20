import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient, type LinearGradientPoint } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

interface GradientTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
  /** Gradient stops, top-to-bottom by default. */
  colors?: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  start?: LinearGradientPoint;
  end?: LinearGradientPoint;
}

const DEFAULT_COLORS = ['#666666', '#7B7B7B', '#000000'] as const;
const DEFAULT_LOCATIONS = [0.2, 0.48, 0.75] as const;
const DEFAULT_START: LinearGradientPoint = { x: 0.5, y: 0 };
const DEFAULT_END: LinearGradientPoint = { x: 0.5, y: 1 };

/**
 * Renders text filled with a linear gradient by masking a gradient layer
 * with the glyphs. Mirrors Figma's `bg-clip-text` gradient headings.
 */
function GradientTextComponent({
  children,
  style,
  colors = DEFAULT_COLORS,
  locations = DEFAULT_LOCATIONS,
  start = DEFAULT_START,
  end = DEFAULT_END,
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text style={style} allowFontScaling={false}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={colors} locations={locations} start={start} end={end}>
        <Text style={[style, styles.hidden]} allowFontScaling={false}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});

export const GradientText = memo(GradientTextComponent);
