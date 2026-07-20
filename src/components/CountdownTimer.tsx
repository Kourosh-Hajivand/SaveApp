import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

type CountdownTimerProps = {
  initialTime: number;
  onComplete?: () => void;
};

/**
 * Remount with a new `key` from the parent to restart the countdown.
 */
export default function CountdownTimer({
  initialTime,
  onComplete,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(initialTime);

  useEffect(() => {
    let done = false;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!done) {
            done = true;
            onComplete?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // Intentionally only depend on mount/remount via parent key.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart via remount
  }, []);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <Text style={styles.text}>
      {minutes}:{seconds}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: "#28262E",
  },
});
