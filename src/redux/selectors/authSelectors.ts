import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectRequiresMFA = (state: RootState) => state.auth.requiresMFA;
export const selectMfaEmail = (state: RootState) => state.auth.mfaEmail;

export const selectUserId = (state: RootState) => state.auth.user?.id;
export const selectUserEmail = (state: RootState) => state.auth.user?.email;
export const selectFirstName = (state: RootState) => state.auth.user?.firstName;
export const selectLastName = (state: RootState) => state.auth.user?.lastName;
export const selectCompany = (state: RootState) => state.auth.user?.company;
export const selectAccountType = (state: RootState) => state.auth.user?.accountType;

export const selectFullName = createSelector([selectFirstName, selectLastName], (firstName, lastName) => {
  if (!firstName && !lastName) return "";
  if (!firstName) return lastName || "";
  if (!lastName) return firstName || "";
  return `${firstName} ${lastName}`;
});

export const selectHasAccountType = createSelector([selectAccountType], (accountType) => (type: string) => accountType === type);
