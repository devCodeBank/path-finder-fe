import Button from "@components/buttons/button";
import { Box, Typography, Link, TextField, Alert, FormControlLabel, Checkbox } from "@mui/material";
import { selectIsLoading, selectAuthError } from "@redux/selectors/authSelectors";
import { confirmSignUp, resendSignUpCode, confirmSignIn, clearError } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const EmailVerificationContainer = styled(Box)`
  width: 100%;
`;

const BackToLoginContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const FormTitle = styled(Typography)`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

const FormSubtitle = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const OtpContainer = styled(Box)`
  display: flex;
  gap: 3%;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 899px) {
    gap: 2%;
  }
`;

const OtpInput = styled(TextField)`
  flex: 1;

  .MuiOutlinedInput-root {
    height: 64px;
    width: 100%;

    .MuiOutlinedInput-input {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      padding: 0;
    }

    &.Mui-focused {
      .MuiOutlinedInput-notchedOutline {
        border-color: ${({ theme }) => theme.tokens.color.brand.primary};
        border-width: 2px;
      }
    }
  }
`;

const ButtonContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ResendContainer = styled(Box)`
  text-align: center;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  font-size: 14px;

  .resend-link {
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    font-weight: 600;
    text-decoration: none;
    margin-left: ${({ theme }) => theme.spacing(0.5)};
    border: none;
    background: none;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    vertical-align: baseline;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorAlert = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const SuccessAlert = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const TrustDeviceContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const EmailVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState<string>("");
  const [isMFA, setIsMFA] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    // Get email and MFA status from location state or localStorage
    const emailFromState = location.state?.email;
    const isMFAFromState = location.state?.isMFA || false;
    const emailFromStorage = localStorage.getItem("signupEmail");
    const mfaEmailFromStorage = localStorage.getItem("mfaEmail");
    const emailToUse = emailFromState || emailFromStorage || mfaEmailFromStorage;

    if (emailToUse) {
      setEmail(emailToUse);
      setIsMFA(isMFAFromState || !!mfaEmailFromStorage);

      if (emailFromState) {
        localStorage.setItem("signupEmail", emailFromState);
      }
    } else {
      navigate("/auth/login");
    }

    dispatch(clearError());
  }, [dispatch, location.state, navigate]);

  const handleInputChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleInput = (index: number, e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (value && !/^\d$/.test(value)) {
      target.value = otp[index];
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.select();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = ["", "", "", "", "", ""];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6 || !email) {
      return;
    }

    let result;

    if (isMFA) {
      result = await dispatch(confirmSignIn({ code: otpCode, trustDevice }));
    } else {
      result = await dispatch(confirmSignUp({ email, code: otpCode }));
    }

    if (isMFA) {
      if (confirmSignIn.fulfilled.match(result)) {
        if (result.payload.success) {
          setShowSuccess(true);
          localStorage.removeItem("mfaEmail");
          navigate("/dashboard");
        }
      }
    } else {
      if (confirmSignUp.fulfilled.match(result)) {
        if (result.payload.success) {
          setShowSuccess(true);
          localStorage.removeItem("signupEmail");
          navigate("/auth/login");
        }
      }
    }
  };

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    let result;

    if (isMFA) {
      console.log("MFA code sent automatically");
      setIsResending(false);
      return;
    } else {
      result = await dispatch(resendSignUpCode(email));
    }

    setIsResending(false);

    if (resendSignUpCode.fulfilled.match(result)) {
      if (result.payload.success) {
        console.log("Verification code resent successfully");
      }
    }
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "CodeMismatchException":
        return "Invalid verification code. Please check your email and try again.";
      case "ExpiredCodeException":
        return "Verification code has expired. Please request a new one.";
      case "TooManyRequestsException":
        return "Too many attempts. Please try again later.";
      case "UserNotFoundException":
        return "User not found. Please sign up again.";
      case "CONFIRM_SIGN_IN_FAILED":
        return "Invalid verification code. Please try again.";
      default:
        return "An error occurred during verification. Please try again.";
    }
  };

  const getTitle = () => {
    return isMFA ? "Sign In Verification" : "Email Verification";
  };

  const getSubtitle = () => {
    if (isMFA) {
      return `We sent a verification code to <strong>${email}</strong>. Please enter the code to complete your sign in.`;
    }
    return `We sent a verification code to <strong>${email}</strong>. Please enter the code to verify your account.`;
  };

  const getSuccessMessage = () => {
    return isMFA ? "Sign in successful! Redirecting to dashboard..." : "Email verified successfully! Redirecting to login...";
  };

  if (!email) {
    return null;
  }

  return (
    <EmailVerificationContainer>
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

      <FormTitle variant="h2">{getTitle()}</FormTitle>
      <FormSubtitle dangerouslySetInnerHTML={{ __html: getSubtitle() }} />

      {error && (
        <ErrorAlert severity="error" onClose={() => dispatch(clearError())}>
          {getErrorMessage(error.code)}
        </ErrorAlert>
      )}

      {showSuccess && <SuccessAlert severity="success">{getSuccessMessage()}</SuccessAlert>}

      <form onSubmit={handleSubmit}>
        <OtpContainer>
          {otp.map((digit, index) => (
            <OtpInput
              key={index}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onInput={(e) => handleInput(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputRef={(el) => (inputRefs.current[index] = el)}
              inputProps={{
                maxLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              variant="outlined"
              disabled={isLoading}
            />
          ))}
        </OtpContainer>

        {isMFA && (
          <TrustDeviceContainer>
            <FormControlLabel
              control={
                <Checkbox checked={trustDevice} onChange={(e) => setTrustDevice(e.target.checked)} size="small" disabled={isLoading} />
              }
              label="Trust this device for 30 days"
            />
          </TrustDeviceContainer>
        )}

        <ButtonContainer>
          <Button type="submit" fullWidth disabled={otp.join("").length !== 6 || isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </ButtonContainer>
      </form>

      {!isMFA && (
        <ResendContainer>
          Didn't get a code?
          <Link onClick={handleResend} className="resend-link" component="button" type="button" disabled={isResending}>
            {isResending ? "Resending..." : "Resend"}
          </Link>
        </ResendContainer>
      )}
    </EmailVerificationContainer>
  );
};

export default EmailVerification;
