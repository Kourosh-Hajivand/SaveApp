import { QueryKey } from "@/enums/QueryKey";
import AuthService from "@/services/AuthService";
import type {
  RequestOTPBody,
  SignInBody,
  SignUpBody,
  UpdatePasswordBody,
} from "@/services/models/RequestBody/AuthRequestBody";
import type {
  AuthResponse,
  RequestOTPResponse,
  SignInResponse,
  SignUpResponse,
} from "@/services/models/Response/AuthResponse";
import type { VerifyTokenQuery } from "@/api/routes/auth";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

export function useVerifyToken(): UseMutationResult<
  AuthResponse,
  Error,
  VerifyTokenQuery
> {
  return useMutation({
    mutationFn: (query) => AuthService.verifyToken(query),
  });
}

export function useSignIn(): UseMutationResult<SignInResponse, Error, SignInBody> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => AuthService.signIn(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.AuthSession] });
    },
  });
}

export function useSignUp(): UseMutationResult<SignUpResponse, Error, SignUpBody> {
  return useMutation({
    mutationFn: (body) => AuthService.signUp(body),
  });
}

export function useRequestOTP(): UseMutationResult<
  RequestOTPResponse,
  Error,
  RequestOTPBody
> {
  return useMutation({
    mutationFn: (body) => AuthService.requestOTP(body),
  });
}

export function useUpdatePassword(): UseMutationResult<
  unknown,
  Error,
  UpdatePasswordBody
> {
  return useMutation({
    mutationFn: (body) => AuthService.updatePassword(body),
  });
}
