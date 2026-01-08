import Button from "@components/buttons/button";
import PasswordInput from "@components/input/passwordInput";
import TextInput from "@components/input/textInput";
import { Box, Typography, Alert } from "@mui/material";
import { authService } from "@services/authService";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const ResetPasswordContainer = styled(Box)`
  width: 100%;
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

export const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    confirmationCode: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      navigate("/auth/forgot-password");
    }
  }, [searchParams, navigate]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.confirmResetPassword({
        email,
        confirmationCode: formData.confirmationCode,
        newPassword: formData.password,
      });

      if (result.success) {
        navigate("/auth/login", {
          state: {
            message: "Password reset successful! Please sign in with your new password.",
          },
        });
      } else {
        setError(result.error?.message || "Failed to reset password");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.confirmationCode && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <ResetPasswordContainer>
      <FormTitle variant="h2">Set Password</FormTitle>
      <FormSubtitle>
        Enter the verification code sent to {email && `${email.substring(0, 3)}***@${email.split("@")[1]}`} and set a new password
      </FormSubtitle>

      {error && (
        <AlertContainer>
          <Alert severity="error">{error}</Alert>
        </AlertContainer>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Verification Code"
          value={formData.confirmationCode}
          onChange={handleInputChange("confirmationCode")}
          placeholder="Enter the 6-digit code"
          required
        />

        <PasswordInput
          label="New Password"
          value={formData.password}
          onChange={handleInputChange("password")}
          placeholder="••••••••••••••••"
          required
        />

        <PasswordInput
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleInputChange("confirmPassword")}
          placeholder="••••••••••••••••"
          required
        />

        <ButtonContainer>
          <Button type="submit" fullWidth disabled={!isFormValid || isLoading}>
            {isLoading ? "Setting password..." : "Set password"}
          </Button>
        </ButtonContainer>
      </form>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
