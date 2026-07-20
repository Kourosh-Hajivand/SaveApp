import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OurStoryProps {
  story: string;
}

function OurStoryComponent({ story }: OurStoryProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Our Story:</Text>
      <Text style={styles.body}>{story}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 12,
  },
  heading: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 28,
    color: colors.blackText,
    paddingTop: 12,
  },
  body: {
    fontFamily: fonts.light,
    fontSize: 16,
    lineHeight: 24,
    color: colors.blackText,
  },
});

export const OurStory = memo(OurStoryComponent);
