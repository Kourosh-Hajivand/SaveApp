import Constants from "expo-constants";

interface FeatureFlags {
   enableBiometrics: boolean;
   enableDarkMode: boolean;
   enableAnalytics: boolean;
   enablePushNotifications: boolean;
   enableOAuthLogin: boolean;
   enableOfflineMode: boolean;
}

const developmentFlags: FeatureFlags = {
   enableBiometrics: true,
   enableDarkMode: true,
   enableAnalytics: false, // Disabled in dev
   enablePushNotifications: false,
   enableOAuthLogin: true,
   enableOfflineMode: true,
};

const stagingFlags: FeatureFlags = {
   enableBiometrics: true,
   enableDarkMode: true,
   enableAnalytics: true,
   enablePushNotifications: true,
   enableOAuthLogin: true,
   enableOfflineMode: true,
};

const productionFlags: FeatureFlags = {
   enableBiometrics: true,
   enableDarkMode: true,
   enableAnalytics: true,
   enablePushNotifications: true,
   enableOAuthLogin: true,
   enableOfflineMode: false, // Disabled in prod initially
};

function getFeatureFlags(): FeatureFlags {
   const env = Constants.expoConfig?.extra?.NODE_ENV;

   switch (env) {
      case "test":
         return stagingFlags;
      case "production":
         return productionFlags;
      default:
         return developmentFlags;
   }
}

export const featureFlags = getFeatureFlags();
