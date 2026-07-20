const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const nodeEnv = process.env.NODE_ENV || "development";
const envFileByNodeEnv = {
  development: ".env.development",
  staging: ".env.stage",
  production: ".env.production",
};

const preferredEnvFile = envFileByNodeEnv[nodeEnv] ?? ".env.development";
const fallbackEnvFile = ".env";
const envPath = [preferredEnvFile, fallbackEnvFile]
  .map((fileName) => path.resolve(__dirname, fileName))
  .find((filePath) => fs.existsSync(filePath));

if (envPath) {
  dotenv.config({ path: envPath });
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: "save-app",
    slug: "save-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "saveapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logosplash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      dark: {
        backgroundColor: "#000000",
      },
    },
    extra: {
      eas: {
        projectId: "8130d895-81e4-4a7c-9071-9cc550259dbe",
      },
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
      EXPO_PUBLIC_URL: process.env.EXPO_PUBLIC_URL,
      EXPO_PUBLIC_URL2: process.env.EXPO_PUBLIC_URL2,
      EXPO_PUBLIC_IMAGE_URL: process.env.EXPO_PUBLIC_IMAGE_URL,
      EXPO_PUBLIC_GEOCODING_API_KEY: process.env.EXPO_PUBLIC_GEOCODING_API_KEY,
      EXPO_PUBLIC_GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      EXPO_PUBLIC_FACEBOOK_APPID: process.env.EXPO_PUBLIC_FACEBOOK_APPID,
      EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      EXPO_PUBLIC_FIREBASE_VAPID_KEY: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY,
      EXPO_PUBLIC_GA_ID: process.env.EXPO_PUBLIC_GA_ID,
      EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
      EXPO_PUBLIC_CURRENCY: process.env.EXPO_PUBLIC_CURRENCY,
      NODE_ENV: nodeEnv,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.saveapp.app",
      icon: "./assets/expo.icon",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.saveapp.app",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      bundler: "metro",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logosplash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-secure-store",
      "expo-image",
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
