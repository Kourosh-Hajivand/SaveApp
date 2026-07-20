import axiosInstance, {
  clearAuthTokens,
  setAccessToken,
} from "@/api/AxiosInstance";
import { routes } from "@/api/routes";
import type { VerifyTokenQuery } from "@/api/routes/auth";
import { Status } from "@/enums/Status";
import { StorageKeys } from "@/enums/StorageKeys";
import { syncAuthSessionFromStorage } from "@/stores/authSession";
import { handleMutationError } from "@/utils/helpers/errorHandler";
import { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import type {
  RequestOTPBody,
  SignInBody,
  SignUpBody,
  UpdatePasswordBody,
} from "./models/RequestBody/AuthRequestBody";
import type {
  AuthResponse,
  RequestOTPResponse,
  SignInResponse,
  SignUpResponse,
} from "./models/Response/AuthResponse";

function isSuccessStatus(status: number): boolean {
  return status === Status.Ok || status === Status.Created;
}

async function persistSession(data: AuthResponse): Promise<void> {
  await setAccessToken(data.accessToken);
  await SecureStore.setItemAsync(StorageKeys.refreshToken, data.refreshToken);
  await syncAuthSessionFromStorage();
}

async function unwrapAuthError(error: unknown): Promise<never> {
  handleMutationError(error);

  if (isAxiosError(error)) {
    const message =
      typeof error.response?.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
        ? error.response.data.message
        : "Unknown error occurred";
    throw new Error(message);
  }

  throw error;
}

const AuthService = {
  async signIn(body: SignInBody): Promise<SignInResponse> {
    try {
      const response = await axiosInstance.post<SignInResponse>(
        routes.auth.signIn(),
        body,
      );

      if (!isSuccessStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      await persistSession(response.data);
      return response.data;
    } catch (error) {
      return unwrapAuthError(error);
    }
  },

  async signUp(body: SignUpBody): Promise<SignUpResponse> {
    try {
      const response = await axiosInstance.post<SignUpResponse>(
        routes.auth.signUp(),
        body,
      );

      if (!isSuccessStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.data;
    } catch (error) {
      return unwrapAuthError(error);
    }
  },

  async requestOTP(body: RequestOTPBody): Promise<RequestOTPResponse> {
    try {
      const response = await axiosInstance.post<RequestOTPResponse>(
        routes.auth.requestOTP(),
        body,
      );

      if (!isSuccessStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.data;
    } catch (error) {
      return unwrapAuthError(error);
    }
  },

  async verifyToken(query: VerifyTokenQuery): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        routes.auth.verifyToken(query),
      );

      if (!isSuccessStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      await persistSession(response.data);
      return response.data;
    } catch (error) {
      return unwrapAuthError(error);
    }
  },

  async updatePassword(body: UpdatePasswordBody): Promise<unknown> {
    try {
      const response = await axiosInstance.post(
        routes.auth.updatePassword(),
        body,
      );

      if (!isSuccessStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.data;
    } catch (error) {
      return unwrapAuthError(error);
    }
  },

  async logout(): Promise<void> {
    await clearAuthTokens();
  },
};

export default AuthService;
