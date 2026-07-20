import { config } from "@/config/env";
import { StorageKeys } from "@/enums/StorageKeys";
import { routes } from "@/api/routes";
import { Mutex } from "async-mutex";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let accessTokenMemory: string | null = null;
const refreshMutex = new Mutex();

export async function setAccessToken(token: string | null): Promise<void> {
  accessTokenMemory = token;
  if (token) {
    await SecureStore.setItemAsync(StorageKeys.token, token);
    return;
  }
  await SecureStore.deleteItemAsync(StorageKeys.token);
}

export async function clearAuthTokens(): Promise<void> {
  accessTokenMemory = null;
  await SecureStore.deleteItemAsync(StorageKeys.token);
  await SecureStore.deleteItemAsync(StorageKeys.refreshToken);
}

async function getAccessToken(): Promise<string | null> {
  if (accessTokenMemory) return accessTokenMemory;
  accessTokenMemory = await SecureStore.getItemAsync(StorageKeys.token);
  return accessTokenMemory;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await SecureStore.getItemAsync(StorageKeys.refreshToken);
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const { data } = await axios.post<RefreshResponse>(
    `${config.apiUrl}${routes.auth.refresh()}`,
    { refreshToken },
  );

  await setAccessToken(data.accessToken);
  if (data.refreshToken) {
    await SecureStore.setItemAsync(StorageKeys.refreshToken, data.refreshToken);
  }

  return data.accessToken;
}

axiosInstance.interceptors.request.use(async (requestConfig) => {
  const token = await getAccessToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newAccessToken = await refreshMutex.runExclusive(refreshAccessToken);
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      await clearAuthTokens();
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
