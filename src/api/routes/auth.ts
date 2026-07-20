import { prepareQuery } from "@/utils/helpers/query";

export type VerifyTokenQuery = {
  token: string;
  code: string;
};

export const authRoutes = {
  signIn: () => "auth/login",
  signUp: () => "auth/signup",
  requestOTP: () => "auth/request-otp",
  verifyToken: (query: VerifyTokenQuery) =>
    `auth/verify-token${prepareQuery(query)}`,
  updatePassword: () => "profile/update-password",
  refresh: () => "auth/refresh",
} as const;
