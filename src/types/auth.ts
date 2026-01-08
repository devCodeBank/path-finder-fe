export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  timeZone?: string;
  accountType?: string;
  locale?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  timeZone: string;
  accountType: string;
  locale: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ConfirmResetPasswordData {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export interface SignInResult {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
  requiresMFA?: boolean;
  email?: string;
}
