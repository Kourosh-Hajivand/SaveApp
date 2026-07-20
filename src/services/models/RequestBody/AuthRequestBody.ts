export interface SignInBody {
  username: string;
  password: string;
}

export interface UpdatePasswordBody {
  oldPassword?: string;
  password: string;
}

export interface SignUpBody {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  password?: string;
  email?: string;
  birthDate?: string;
  invitationCode?: string;
  gender?: "male" | "female";
  role?: "customer" | "manufacturer";
}

export interface RequestOTPBody {
  username: string;
}
