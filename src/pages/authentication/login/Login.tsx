import Button from "@components/buttons/button";
import PasswordInput from "@components/input/passwordInput";
import TextInput from "@components/input/textInput";
import { Box, Typography, Link, Alert } from "@mui/material";
import { selectIsLoading, selectAuthError } from "@redux/selectors/authSelectors";
import { signIn, clearError, clearAuthSession } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginContainer = styled(Box)`
  width: 100%;
`;

const FormTitle = styled(Typography)`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ForgotPasswordContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ButtonContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const SignUpPrompt = styled(Typography)`
  text-align: center;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};

  .sign-up-link {
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorAlert = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.tokens.color.semantic.error};
`;

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [hasAuthError, setHasAuthError] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(clearError());
    setHasAuthError(false);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setHasAuthError(true);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const result = await dispatch(signIn({ email, password }));

    if (signIn.fulfilled.match(result)) {
      if (result.payload.success) {
        navigate("/dashboard");
      } else if (result.payload.requiresMFA) {
        localStorage.setItem("mfaEmail", result.payload.email || "");
        navigate("/auth/verify-email", {
          state: {
            email: result.payload.email,
            isMFA: true,
          },
        });
      } else if (result.payload.error?.code === "DEVICE_NOT_FOUND") {
        await dispatch(clearAuthSession());
        const retryResult = await dispatch(signIn({ email, password }));
        if (signIn.fulfilled.match(retryResult) && retryResult.payload.requiresMFA) {
          localStorage.setItem("mfaEmail", retryResult.payload.email || "");
          navigate("/auth/verify-email", {
            state: {
              email: retryResult.payload.email,
              isMFA: true,
            },
          });
        }
      }
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "NotAuthorizedException":
        return "Incorrect email or password.";
      case "UserNotConfirmedException":
        return "Please verify your email address before signing in.";
      case "UserNotFoundException":
        return "No account found with this email address.";
      case "TooManyRequestsException":
        return "Too many failed attempts. Please try again later.";
      case "SOFTWARE_TOKEN_MFA":
      case "SMS_MFA":
      case "MFA_REQUIRED":
        return "Verification code required. Please check your email.";
      case "DEVICE_NOT_FOUND":
        return "Your device session has expired. Please try signing in again.";
      default:
        return "An error occurred during sign in. Please try again.";
    }
  };

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: "email" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === "email") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }

    if (hasAuthError) {
      setHasAuthError(false);
      dispatch(clearError());
    }
  };

  const getEmailErrorMessage = () => {
    if (!touched.email) {
      return undefined;
    }
    if (!email || email.trim() === "") {
      return "Please enter your email address.";
    }
    return undefined;
  };

  const getPasswordErrorMessage = () => {
    if (!touched.password) {
      return undefined;
    }
    if (!password || password.trim() === "") {
      return "Please enter your password.";
    }
    return undefined;
  };

  const isLoginButtonDisabled = isLoading || !email || !password || hasAuthError;

  return (
    <LoginContainer>
      <FormTitle variant="h2">Sign in</FormTitle>

      {error && (
        <ErrorAlert
          severity="error"
          onClose={() => {
            dispatch(clearError());
            setHasAuthError(false);
          }}
        >
          {getErrorMessage(error.code)}
        </ErrorAlert>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={handleInputChange("email")}
          onBlur={handleBlur("email")}
          touched={touched.email}
          placeholder="Enter your email address"
          required
          disabled={isLoading}
          errorMessage={getEmailErrorMessage()}
          error={hasAuthError || (touched.email && (!email || email.trim() === ""))}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={handleInputChange("password")}
          onBlur={handleBlur("password")}
          touched={touched.password}
          placeholder="Enter your password"
          required
          disabled={isLoading}
          errorMessage={getPasswordErrorMessage()}
          error={hasAuthError || (touched.password && (!password || password.trim() === ""))}
        />

        <ForgotPasswordContainer>
          <Link
            component={RouterLink}
            to="/auth/forgot-password"
            color="inherit"
            underline="none"
            sx={{
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: 400,
              color: "text.secondary",
            }}
          >
            Forgot password?
          </Link>
        </ForgotPasswordContainer>

        <ButtonContainer>
          <Button type="submit" fullWidth disabled={isLoginButtonDisabled} size="lg">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </ButtonContainer>
      </form>

      <SignUpPrompt variant="md">
        Don't have an account?{" "}
        <Link component={RouterLink} to="/auth/signup" className="sign-up-link">
          Sign up
        </Link>
      </SignUpPrompt>
    </LoginContainer>
  );
};

export default Login;
