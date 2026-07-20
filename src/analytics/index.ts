interface AnalyticsEvent {
  user_signed_in: { method: "email" | "google" | "facebook" };
  user_signed_up: { method: "email" | "google" | "facebook" };
  user_signed_out: Record<string, never>;
  screen_viewed: { screen_name: string };
  error_occurred: {
    error_message: string;
    error_code?: string;
    status_code?: number;
    screen?: string;
  };
}

class Analytics {
  private isEnabled = true;

  track<T extends keyof AnalyticsEvent>(
    eventName: T,
    properties: AnalyticsEvent[T],
  ) {
    if (!this.isEnabled) return;

    if (__DEV__) {
      console.info("Analytics:", eventName, properties);
    }
  }

  identify(userId: string, traits?: Record<string, unknown>) {
    if (!this.isEnabled) return;

    if (__DEV__) {
      console.info("Analytics Identify:", userId, traits);
    }
  }

  setUserProperties(properties: Record<string, unknown>) {
    if (!this.isEnabled) return;

    if (__DEV__) {
      console.info("Analytics User Properties:", properties);
    }
  }

  screen(screenName: string) {
    if (!this.isEnabled) return;
    this.track("screen_viewed", { screen_name: screenName });
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

export const analytics = new Analytics();
