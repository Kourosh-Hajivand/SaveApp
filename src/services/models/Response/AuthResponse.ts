export interface AuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  permissions: Record<string, unknown>;
}

export interface RequestOTPResponse {
  token: string;
}

export type SignInResponse = AuthResponse;
export type SignUpResponse = { token: string };
