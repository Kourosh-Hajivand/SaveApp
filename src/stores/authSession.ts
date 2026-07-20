import { StorageKeys } from "@/enums/StorageKeys";
import * as SecureStore from "expo-secure-store";

type AuthSnapshot = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

let authSnapshot: AuthSnapshot = {
  isAuthenticated: false,
  isLoading: true,
};

const listeners = new Set<() => void>();

function emitAuthChange() {
  for (const listener of listeners) {
    listener();
  }
}

function setAuthSnapshot(next: AuthSnapshot) {
  authSnapshot = next;
  emitAuthChange();
}

export function subscribeAuthSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSessionSnapshot() {
  return authSnapshot;
}

export async function syncAuthSessionFromStorage(): Promise<void> {
  try {
    const token = await SecureStore.getItemAsync(StorageKeys.token);
    setAuthSnapshot({
      isAuthenticated: Boolean(token),
      isLoading: false,
    });
  } catch {
    setAuthSnapshot({
      isAuthenticated: false,
      isLoading: false,
    });
  }
}

export function markSignedOut(): void {
  setAuthSnapshot({
    isAuthenticated: false,
    isLoading: false,
  });
}

void syncAuthSessionFromStorage();
