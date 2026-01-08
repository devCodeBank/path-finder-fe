import EnvelopeIcon from "@assets/icons/envelope.svg?react";
import Button from "@components/buttons/button";
import TextInput from "@components/input/textInput";
import { Box, Typography, Link, Alert } from "@mui/material";
import { authService } from "@services/authService";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

const ForgotPasswordContainer = styled(Box)`
  width: 100%;
`;

const BackToLoginContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const FormTitle = styled(Typography)`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const FormSubtitle = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ButtonContainer = styled(Box)`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const AlertContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const SuccessContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const IconContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  svg {
    width: 96px;
    height: 96px;
  }
`;

const SuccessTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const SuccessMessage = styled(Typography)`
  font-size: 16px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  line-height: 1.5;
  max-width: 400px;
`;

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.resetPassword({ email });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error?.message || "Failed to initiate password reset");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);

    try {
      const result = await authService.resetPassword({ email });

      if (!result.success) {
        setError(result.error?.message || "Failed to resend password reset link");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    const maskedLocal = localPart.substring(0, 2) + "****";
    return `${maskedLocal}@${domain}`;
  };

  return (
    <ForgotPasswordContainer>
      {!success && (
        <>
          <BackToLoginContainer>
            <Link
              component={RouterLink}
              to="/auth/login"
              color="inherit"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: 400,
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                },
                "&::before": {
                  content: '"←"',
                  marginRight: 1,
                  fontSize: "16px",
                },
              }}
            >
              Back to login
            </Link>
          </BackToLoginContainer>

          <FormTitle variant="h2">Forgot Password?</FormTitle>
          <FormSubtitle>Enter your email below to recover password</FormSubtitle>
        </>
      )}

      {error && (
        <AlertContainer>
          <Alert severity="error">{error}</Alert>
        </AlertContainer>
      )}

      {success && (
        <SuccessContainer>
          <IconContainer>
            <EnvelopeIcon />
          </IconContainer>

          <SuccessTitle>Password reset link sent</SuccessTitle>

          <SuccessMessage>
            We have sent an email with a password reset link to {maskEmail(email)}. If you didn't receive the email, please also check your
            spam folder.
          </SuccessMessage>

          <ButtonContainer>
            <Button fullWidth onClick={handleResend} disabled={isResending}>
              {isResending ? "Resending..." : "Resend password reset link"}
            </Button>
          </ButtonContainer>
        </SuccessContainer>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Work Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />

          <ButtonContainer>
            <Button type="submit" fullWidth disabled={!email || isLoading}>
              {isLoading ? "Sending..." : "Submit"}
            </Button>
          </ButtonContainer>
        </form>
      )}
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
