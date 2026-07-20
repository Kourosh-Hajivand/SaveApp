import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { OpeningHour } from '../types';

interface OpeningHoursProps {
  hours: OpeningHour[];
}

function OpeningHoursComponent({ hours }: OpeningHoursProps) {
  const lastIndex = hours.length - 1;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Opening Hours</Text>
      {hours.map((hour, index) => (
        <View
          key={hour.label}
          style={[styles.row, index < lastIndex && styles.rowBorder]}
        >
          <Text style={styles.day}>{hour.label}</Text>
          <Text style={styles.time}>{hour.time}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingBottom: 16,
  },
  heading: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 28,
    color: colors.blackText,
    paddingTop: 12,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.strokeColor,
  },
  day: {
    fontFamily: fonts.light,
    fontSize: 14,
    lineHeight: 20,
    color: colors.blackText,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 28,
    color: colors.blackText,
  },
});

export const OpeningHours = memo(OpeningHoursComponent);
