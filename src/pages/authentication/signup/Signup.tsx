import Button from "@components/buttons/button";
import PasswordInput from "@components/input/passwordInput";
import SelectInput from "@components/input/selectInput";
import TextInput from "@components/input/textInput";
import { Box, Typography, Checkbox, Link, Alert } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { selectIsLoading, selectAuthError } from "@redux/selectors/authSelectors";
import { signUp, clearError } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import { getBrowserLocale, getDefaultTimezone, getTimezoneOptions } from "@utils/browserUtils";
import { formatPhoneNumber, validatePhoneNumber } from "@utils/phoneUtils";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const accountTypeOptions = [
  { value: "agency", label: "Agency" },
  { value: "direct_employer", label: "Direct Employer" },
];

const SignupContainer = styled(Box)`
  width: 100%;
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

const FormRow = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  & > * {
    flex: 1;
    margin-bottom: 0;
  }
`;

const LastFormRow = styled(FormRow)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const TermsContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  .terms-text {
    font-size: 14px;
    color: ${({ theme }) => theme.tokens.color.text.secondary};

    .terms-link {
      color: ${({ theme }) => theme.tokens.color.brand.primary};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ButtonContainer = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

const LoginPrompt = styled(Typography)`
  text-align: center;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  font-size: 14px;

  .login-link {
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    font-weight: 600;
    text-decoration: none;

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

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    timeZone: getDefaultTimezone(),
    accountType: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    company: false,
    email: false,
    phone: false,
    accountType: false,
    password: false,
    confirmPassword: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: e.target.checked,
    }));
  };

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.company ||
      !formData.email ||
      !formData.phone ||
      !formData.timeZone ||
      !formData.accountType ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.agreeToTerms
    ) {
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      return false;
    }

    if (!validateEmail(formData.email)) {
      return false;
    }

    if (!validatePassword(formData.password)) {
      return false;
    }

    if (!validatePhoneNumber(formatPhoneNumber(formData.phone))) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const signUpData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      phone: formatPhoneNumber(formData.phone),
      timeZone: formData.timeZone,
      accountType: formData.accountType,
      locale: getBrowserLocale(),
    };

    const result = await dispatch(signUp(signUpData));

    if (signUp.fulfilled.match(result)) {
      if (result.payload.success) {
        setShowSuccess(true);
        navigate("/auth/verify-email", {
          state: { email: formData.email },
        });
      }
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "UsernameExistsException":
        return "An account with this email already exists.";
      case "InvalidPasswordException":
        return "Password does not meet requirements. It must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.";
      case "InvalidParameterException":
        return "Please check your input and try again. Make sure your phone number is in a valid format (e.g., 555-123-4567).";
      case "TooManyRequestsException":
        return "Too many requests. Please try again later.";
      default:
        return "An error occurred during sign up. Please try again.";
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailErrorMessage = () => {
    if (!touched.email) {
      return undefined;
    }

    if (!formData.email) {
      return "Please fill in this field";
    }

    if (!validateEmail(formData.email)) {
      return "Please enter a valid email address.";
    }

    return undefined;
  };

  const getAccountTypeErrorMessage = () => {
    if (!touched.accountType) {
      return undefined;
    }

    if (!formData.accountType) {
      return "*Please select an account type.";
    }

    return undefined;
  };

  const getConfirmPasswordErrorMessage = () => {
    if (!touched.confirmPassword) {
      return undefined;
    }

    if (!formData.confirmPassword) {
      return "Please fill in this field";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    return undefined;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const getPasswordErrorMessage = () => {
    if (!touched.password) {
      return undefined;
    }

    if (!formData.password) {
      return "Please fill in this field";
    }

    if (!validatePassword(formData.password)) {
      return "*Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    return undefined;
  };

  return (
    <SignupContainer>
      <FormTitle variant="h2">Sign up</FormTitle>
      <FormSubtitle>14 days free trial. No credit card required.</FormSubtitle>

      {error && (
        <ErrorAlert severity="error" onClose={() => dispatch(clearError())}>
          {getErrorMessage(error.code)}
        </ErrorAlert>
      )}

      {showSuccess && (
        <SuccessAlert severity="success">Account created successfully! Please check your email for verification.</SuccessAlert>
      )}

      <form onSubmit={handleSubmit}>
        <FormRow>
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange("firstName")}
            onBlur={handleBlur("firstName")}
            touched={touched.firstName}
            placeholder="John"
            required
            disabled={isLoading}
          />
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChange={handleInputChange("lastName")}
            onBlur={handleBlur("lastName")}
            touched={touched.lastName}
            placeholder="Doe"
            required
            disabled={isLoading}
          />
        </FormRow>

        <FormRow>
          <TextInput
            label="Company"
            value={formData.company}
            onChange={handleInputChange("company")}
            onBlur={handleBlur("company")}
            touched={touched.company}
            placeholder="ABC Limited"
            required
            disabled={isLoading}
          />

          <TextInput
            label="Work Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            onBlur={handleBlur("email")}
            touched={touched.email}
            placeholder="john.doe@abc.com"
            required
            disabled={isLoading}
            errorMessage={getEmailErrorMessage()}
          />
        </FormRow>

        <FormRow>
          <TextInput
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            onBlur={handleBlur("phone")}
            touched={touched.phone}
            placeholder="555-123-4567"
            required
            disabled={isLoading}
          />
          <SelectInput
            label="Time Zone"
            value={formData.timeZone}
            onChange={handleSelectChange("timeZone")}
            options={getTimezoneOptions()}
            placeholder="Please select time zone"
            required
            disabled={isLoading}
          />
        </FormRow>

        <FormRow>
          <SelectInput
            label="Account Type"
            value={formData.accountType}
            onChange={handleSelectChange("accountType")}
            onBlur={handleBlur("accountType")}
            touched={touched.accountType}
            options={accountTypeOptions}
            placeholder="Please select"
            required
            disabled={isLoading}
            errorMessage={getAccountTypeErrorMessage()}
          />
        </FormRow>

        <FormRow>
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={handleInputChange("password")}
            onBlur={handleBlur("password")}
            touched={touched.password}
            placeholder="Enter password"
            required
            disabled={isLoading}
            errorMessage={getPasswordErrorMessage()}
          />
        </FormRow>

        <LastFormRow>
          <PasswordInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            touched={touched.confirmPassword}
            placeholder="Confirm password"
            required
            disabled={isLoading}
            errorMessage={getConfirmPasswordErrorMessage()}
          />
        </LastFormRow>

        <TermsContainer>
          <Box display="flex" alignItems="center" justifyContent="flex-start" gap={1}>
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={handleCheckboxChange}
              size="small"
              disabled={isLoading}
              sx={{ padding: "4px" }}
            />
            <span className="terms-text">
              I agree to Pathfinder ATS CRM's{" "}
              <Link component={RouterLink} to="/terms-and-conditions" className="terms-link">
                Terms of service
              </Link>{" "}
              and{" "}
              <Link component={RouterLink} to="/privacy-policy" className="terms-link">
                Privacy Policies
              </Link>
            </span>
          </Box>
        </TermsContainer>

        <ButtonContainer>
          <Button type="submit" fullWidth disabled={!validateForm() || isLoading}>
            {isLoading ? "Creating account..." : "Create your account"}
          </Button>
        </ButtonContainer>
      </form>

      <LoginPrompt>
        Already have an account?{" "}
        <Link component={RouterLink} to="/auth/login" className="login-link">
          Login
        </Link>
      </LoginPrompt>
    </SignupContainer>
  );
};

export default Signup;
