/**
 * Custom hook for Vibration API
 * Provides haptic feedback for game events
 */
export function useVibration() {
  const vibrate = (pattern: number | number[] = [100, 50, 100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return { vibrate };
}

