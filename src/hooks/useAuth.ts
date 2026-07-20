import { clearAuthTokens } from "@/api/AxiosInstance";
import {
  getAuthSessionSnapshot,
  markSignedOut,
  subscribeAuthSession,
  syncAuthSessionFromStorage,
} from "@/stores/authSession";
import { useCallback, useSyncExternalStore } from "react";

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const snapshot = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    getAuthSessionSnapshot,
  );

  const refreshAuthState = useCallback(async () => {
    await syncAuthSessionFromStorage();
  }, []);

  const logout = useCallback(async () => {
    await clearAuthTokens();
    markSignedOut();
  }, []);

  return {
    isAuthenticated: snapshot.isAuthenticated,
    isLoading: snapshot.isLoading,
    logout,
    refreshAuthState,
  };
}
