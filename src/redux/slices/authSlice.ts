import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import authService from "@services/authService";

import type { AuthUser, AuthError, SignUpData } from "../../types/auth";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  requiresMFA: boolean;
  mfaEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requiresMFA: false,
  mfaEmail: null,
};

export const checkAuthStatus = createAsyncThunk("auth/checkAuthStatus", async () => {
  return await authService.checkAuthStatus();
});

export const signIn = createAsyncThunk("auth/signIn", async ({ email, password }: { email: string; password: string }) => {
  return await authService.signIn({ email, password });
});

export const confirmSignIn = createAsyncThunk(
  "auth/confirmSignIn",
  async ({ code, trustDevice }: { code: string; trustDevice?: boolean }) => {
    return await authService.confirmSignIn(code, trustDevice);
  },
);

export const signUp = createAsyncThunk("auth/signUp", async (signUpData: SignUpData) => {
  return await authService.signUp(signUpData);
});

export const confirmSignUp = createAsyncThunk("auth/confirmSignUp", async ({ email, code }: { email: string; code: string }) => {
  return await authService.confirmSignUp(email, code);
});

export const resendSignUpCode = createAsyncThunk("auth/resendSignUpCode", async (email: string) => {
  return await authService.resendSignUpCode(email);
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  return await authService.signOut();
});

export const clearAuthSession = createAsyncThunk("auth/clearAuthSession", async () => {
  return await authService.clearSession();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearMFA: (state) => {
      state.requiresMFA = false;
      state.mfaEmail = null;
    },
  },
  extraReducers: (builder) => {
    // Check auth status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Sign in
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.requiresMFA = false;
        state.mfaEmail = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user || null;
          state.error = null;
          state.requiresMFA = false;
          state.mfaEmail = null;
        } else if (action.payload.requiresMFA) {
          state.requiresMFA = true;
          state.mfaEmail = action.payload.email || null;
          state.error = null;
        } else {
          state.error = action.payload.error || null;
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          code: "SIGN_IN_FAILED",
          message: action.error.message || "Sign in failed",
        };
      });

    // Confirm sign in
    builder
      .addCase(confirmSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user || null;
          state.error = null;
          state.requiresMFA = false;
          state.mfaEmail = null;
        } else {
          state.error = action.payload.error || null;
        }
      })
      .addCase(confirmSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          code: "CONFIRM_SIGN_IN_FAILED",
          message: action.error.message || "Sign in confirmation failed",
        };
      });

    // Sign up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.error = null;
        } else {
          state.error = action.payload.error || null;
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          code: "SIGN_UP_FAILED",
          message: action.error.message || "Sign up failed",
        };
      });

    // Confirm sign up
    builder
      .addCase(confirmSignUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmSignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.error = null;
        } else {
          state.error = action.payload.error || null;
        }
      })
      .addCase(confirmSignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          code: "CONFIRM_SIGN_UP_FAILED",
          message: action.error.message || "Confirmation failed",
        };
      });

    // Resend sign up code
    builder
      .addCase(resendSignUpCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendSignUpCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.error = null;
        } else {
          state.error = action.payload.error || null;
        }
      })
      .addCase(resendSignUpCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          code: "RESEND_CODE_FAILED",
          message: action.error.message || "Failed to resend code",
        };
      });

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.requiresMFA = false;
        state.mfaEmail = null;
      })
      .addCase(signOut.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setLoading, clearMFA } = authSlice.actions;
export default authSlice.reducer;
