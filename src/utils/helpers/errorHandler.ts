import { analytics } from "@/analytics";
import { isAxiosError } from "axios";
import { Toast } from "toastify-react-native";

type BackendErrorBody = {
  message?: string;
};

function getBackendMessage(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const message = (data as BackendErrorBody).message;
  return typeof message === "string" ? message : undefined;
}

export function getErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : "An unexpected error occurred";
  }

  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return "Network connection failed. Please check your internet connection.";
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (error.response?.status === 404) {
    return "The requested service is unavailable.";
  }

  if (error.response?.status === 500) {
    return "Server error. Please try again later.";
  }

  return getBackendMessage(error.response?.data) ?? "An unexpected error occurred";
}

export function handleMutationError(error: unknown): void {
  const errorMessage = getErrorMessage(error);
  Toast.error(errorMessage);

  if (isAxiosError(error)) {
    analytics.track("error_occurred", {
      error_message: error.message,
      error_code: error.code,
      status_code: error.response?.status,
      screen: "api_call",
    });
  }
}
