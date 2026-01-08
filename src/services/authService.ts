import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  confirmSignIn,
  rememberDevice,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";
import type {
  SignUpInput,
  SignInInput,
  ConfirmSignUpInput,
  ResendSignUpCodeInput,
  ConfirmSignInInput,
  ResetPasswordInput,
  ConfirmResetPasswordInput,
} from "aws-amplify/auth";

import type { AuthError, AuthUser, LoginData, SignInResult, SignUpData, ResetPasswordData, ConfirmResetPasswordData } from "../types/auth";

/**
 * Application-specific error codes for authentication.
 */
const AppError = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  MFA_REQUIRED: "MFA_REQUIRED",
  UNKNOWN_CHALLENGE: "UNKNOWN_CHALLENGE",
  SIGN_IN_FAILED: "SIGN_IN_FAILED",
  DEVICE_NOT_FOUND: "DEVICE_NOT_FOUND",
  CONFIRM_SIGN_IN_FAILED: "CONFIRM_SIGN_IN_FAILED",
  SIGNED_OUT: "signedOut",
} as const;

/**
 * Error codes returned by AWS Cognito.
 */
const CognitoError = {
  SOFTWARE_TOKEN_MFA: "SOFTWARE_TOKEN_MFA",
  SMS_MFA: "SMS_MFA",
  NEW_PASSWORD_REQUIRED: "NEW_PASSWORD_REQUIRED",
  RESOURCE_NOT_FOUND: "ResourceNotFoundException",
} as const;

/**
 * Multi-Factor Authentication (MFA) sign-in steps from AWS Amplify.
 */
const MfaSignInStep = {
  CONFIRM_SIGN_IN_WITH_EMAIL_CODE: "CONFIRM_SIGN_IN_WITH_EMAIL_CODE",
  CONFIRM_SIGN_IN_WITH_SMS_CODE: "CONFIRM_SIGN_IN_WITH_SMS_CODE",
  CONFIRM_SIGN_IN_WITH_TOTP_CODE: "CONFIRM_SIGN_IN_WITH_TOTP_CODE",
} as const;

/**
 * Standard and custom user attribute names for AWS Cognito.
 */
const UserAttribute = {
  EMAIL: "email",
  GIVEN_NAME: "given_name",
  FAMILY_NAME: "family_name",
  PHONE_NUMBER: "phone_number",
  ZONE_INFO: "zoneinfo",
  LOCALE: "locale",
  CUSTOM_COMPANY: "custom:company",
  CUSTOM_ACCOUNT_TYPE: "custom:accountType",
} as const;

class AuthService {
  /**
   * Extracts and standardizes error information from AWS Cognito responses.
   *
   * This method inspects the error object to find the most descriptive error code
   * and message, looking in common locations where AWS Amplify and Cognito errors
   * are nested.
   *
   * @param error - The error object, which can be of any type.
   * @param defaultMessage - A fallback message if no specific message can be found.
   * @returns An `AuthError` object with a standardized code and message.
   */
  private extractErrorInfo(error: unknown, defaultMessage: string): AuthError {
    const code =
      (error as { code?: string })?.code ||
      (error as { name?: string })?.name ||
      (error as { error?: { name?: string } })?.error?.name ||
      AppError.UNKNOWN_ERROR;

    const message = error instanceof Error ? error.message : (error as { error?: { message?: string } })?.error?.message || defaultMessage;

    return { code, message };
  }

  async signUp(data: SignUpData): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const signUpInput: SignUpInput = {
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            [UserAttribute.EMAIL]: data.email,
            [UserAttribute.GIVEN_NAME]: data.firstName,
            [UserAttribute.FAMILY_NAME]: data.lastName,
            [UserAttribute.PHONE_NUMBER]: data.phone,
            [UserAttribute.ZONE_INFO]: data.timeZone,
            [UserAttribute.LOCALE]: data.locale,
            // Note: custom:company and custom:accountType are excluded until configured in Cognito
          },
        },
      };

      await signUp(signUpInput);
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred during sign up");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async confirmSignUp(email: string, code: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const confirmSignUpInput: ConfirmSignUpInput = {
        username: email,
        confirmationCode: code,
      };

      await confirmSignUp(confirmSignUpInput);
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred during confirmation");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async resendSignUpCode(email: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const resendSignUpCodeInput: ResendSignUpCodeInput = {
        username: email,
      };

      await resendSignUpCode(resendSignUpCodeInput);
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred while resending the code");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async signIn(data: LoginData): Promise<SignInResult> {
    try {
      const signInInput: SignInInput = {
        username: data.email,
        password: data.password,
      };

      const signInOutput = await signIn(signInInput);

      if (signInOutput.isSignedIn) {
        const user = await this.getCurrentUser();
        return { success: true, user: user || undefined };
      } else if (signInOutput.nextStep) {
        // Handle MFA or other challenges
        const { signInStep } = signInOutput.nextStep;

        if (
          signInStep === MfaSignInStep.CONFIRM_SIGN_IN_WITH_EMAIL_CODE ||
          signInStep === MfaSignInStep.CONFIRM_SIGN_IN_WITH_SMS_CODE ||
          signInStep === MfaSignInStep.CONFIRM_SIGN_IN_WITH_TOTP_CODE
        ) {
          return {
            success: false,
            requiresMFA: true,
            email: data.email,
            error: {
              code: AppError.MFA_REQUIRED,
              message: "Verification code required",
            },
          };
        } else {
          return {
            success: false,
            error: {
              code: AppError.UNKNOWN_CHALLENGE,
              message: `Unexpected sign-in step: ${signInStep}`,
            },
          };
        }
      } else {
        return {
          success: false,
          error: {
            code: AppError.SIGN_IN_FAILED,
            message: "Sign in was not completed",
          },
        };
      }
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred during sign in");
      return this.handleSignInError(errorInfo, data.email);
    }
  }

  /**
   * Handles errors that occur during the sign-in process, including MFA challenges
   * and device-related issues.
   *
   * @param error - The extracted error information.
   * @param email - The user's email, if available, for MFA challenges.
   * @returns A `SignInResult` object with standardized error details.
   */
  private handleSignInError(error: AuthError, email?: string): SignInResult {
    // Handle MFA challenges
    if (
      error.code === CognitoError.SOFTWARE_TOKEN_MFA ||
      error.code === CognitoError.SMS_MFA ||
      error.code === CognitoError.NEW_PASSWORD_REQUIRED
    ) {
      return {
        success: false,
        requiresMFA: true,
        email,
        error: {
          code: error.code,
          message: "Verification code required",
        },
      };
    }

    // Handle device-related errors
    if (error.code === CognitoError.RESOURCE_NOT_FOUND && error.message.includes("Device does not exist")) {
      return {
        success: false,
        error: {
          code: AppError.DEVICE_NOT_FOUND,
          message: "Your device session has expired. Please try signing in again.",
        },
      };
    }

    // Handle other errors
    return {
      success: false,
      error,
    };
  }

  async confirmSignIn(code: string, trustDevice: boolean = false): Promise<SignInResult> {
    try {
      const confirmSignInInput: ConfirmSignInInput = {
        challengeResponse: code,
      };

      const result = await confirmSignIn(confirmSignInInput);

      if (result.isSignedIn) {
        const user = await this.getCurrentUser();

        // If user wants to trust this device, remember it after successful sign-in
        if (trustDevice) {
          try {
            await this.rememberDevice();
          } catch (error) {
            console.warn("Failed to remember device:", error);
            // Don't fail the entire sign-in process if device remembering fails
          }
        }

        return { success: true, user: user || undefined };
      } else {
        return {
          success: false,
          error: {
            code: AppError.CONFIRM_SIGN_IN_FAILED,
            message: "Sign in confirmation failed",
          },
        };
      }
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred during sign in confirmation");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async rememberDevice(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await rememberDevice();
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred while remembering device");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      return {
        id: currentUser.userId,
        email: attributes[UserAttribute.EMAIL] || "",
        firstName: attributes[UserAttribute.GIVEN_NAME] || undefined,
        lastName: attributes[UserAttribute.FAMILY_NAME] || undefined,
        company: attributes[UserAttribute.CUSTOM_COMPANY] || undefined,
        phone: attributes[UserAttribute.PHONE_NUMBER] || undefined,
        timeZone: attributes[UserAttribute.ZONE_INFO] || undefined,
        accountType: attributes[UserAttribute.CUSTOM_ACCOUNT_TYPE] || undefined,
        locale: attributes[UserAttribute.LOCALE] || undefined,
      };
    } catch {
      return null;
    }
  }

  async signOut(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await signOut();
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred during sign out");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const resetPasswordInput: ResetPasswordInput = {
        username: data.email,
      };

      await resetPassword(resetPasswordInput);
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred while initiating password reset");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async confirmResetPassword(data: ConfirmResetPasswordData): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const confirmResetPasswordInput: ConfirmResetPasswordInput = {
        username: data.email,
        confirmationCode: data.confirmationCode,
        newPassword: data.newPassword,
      };

      await confirmResetPassword(confirmResetPasswordInput);
      return { success: true };
    } catch (error: unknown) {
      const errorInfo = this.extractErrorInfo(error, "An error occurred while confirming password reset");
      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: AuthUser }> {
    try {
      const user = await this.getCurrentUser();
      return {
        isAuthenticated: !!user,
        user: user || undefined,
      };
    } catch {
      return {
        isAuthenticated: false,
      };
    }
  }

  async clearSession(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      // Check if a user session exists before attempting to sign out
      const { isAuthenticated } = await this.checkAuthStatus();

      if (isAuthenticated) {
        await signOut();
      }

      return { success: true };
    } catch (error: unknown) {
      // If signOut fails, it might be because the session is already invalid,
      // which we can treat as a successful sign-out for our purposes.
      const errorInfo = this.extractErrorInfo(error, "An error occurred while clearing session");
      if (errorInfo.code === AppError.SIGNED_OUT) {
        return { success: true };
      }

      return {
        success: false,
        error: errorInfo,
      };
    }
  }
}

export const authService = new AuthService();
export default authService;
