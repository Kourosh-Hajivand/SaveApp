import Constants from "expo-constants";
import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.string().url({
    message: "EXPO_PUBLIC_API_BASE_URL is required and must be a valid URL",
  }),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional(),
  EXPO_PUBLIC_ANALYTICS_KEY: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const rawEnv = Constants.expoConfig?.extra ?? {};
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(
      `Required environment variables are missing or invalid: ${details}`,
    );
  }

  return result.data;
}

export const env = parseEnv();

export const config = {
  apiUrl: env.EXPO_PUBLIC_API_BASE_URL,
  sentryDsn: env.EXPO_PUBLIC_SENTRY_DSN,
  analyticsKey: env.EXPO_PUBLIC_ANALYTICS_KEY,
  isDev: env.NODE_ENV === "development",
  isStaging: env.NODE_ENV === "staging",
  isProd: env.NODE_ENV === "production",
};
