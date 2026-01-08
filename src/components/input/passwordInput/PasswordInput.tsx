import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

const StyledTextField = styled(TextField)`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};

  .MuiInputLabel-root {
    color: ${({ theme }) => theme.tokens.color.text.primary};
    font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.tokens.typography.fontSize.lg};
    z-index: 1;

    &.MuiInputLabel-shrink {
      background-color: ${({ theme }) => theme.tokens.color.background.primary};
      padding: 0 4px;
      margin-left: -4px;
    }

    &.Mui-focused {
      color: ${({ theme }) => theme.tokens.color.text.secondary};
    }

    &.Mui-error {
      color: ${({ theme }) => theme.tokens.color.text.primary};
    }

    .MuiFormLabel-asterisk {
      color: ${({ theme }) => theme.tokens.color.text.primary};
    }
  }

  .MuiOutlinedInput-root {
    background-color: ${({ theme }) => theme.tokens.color.background.primary};
    border-radius: ${({ theme }) => theme.tokens.radius.md};
    height: ${({ theme }) => theme.tokens.component.input.height};
    font-family: ${({ theme }) => theme.tokens.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.tokens.typography.fontSize.md};
    transition: all 200ms ease-in-out;

    & fieldset {
      border-color: ${({ theme }) => theme.tokens.color.border.medium};
      border-width: ${({ theme }) => theme.tokens.component.input.borderWidth};
    }

    &:hover:not(.Mui-focused):not(.Mui-error) fieldset {
      border-color: ${({ theme }) => theme.tokens.color.border.dark};
    }

    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.tokens.color.border.dark};
      border-width: ${({ theme }) => theme.tokens.component.input.focusBorderWidth};
    }

    &.Mui-error fieldset {
      border-color: ${({ theme }) => theme.tokens.color.semantic.error};
    }

    &.Mui-disabled {
      background-color: ${({ theme }) => theme.tokens.color.background.disabled};

      & fieldset {
        border-color: ${({ theme }) => theme.tokens.color.border.light};
      }
    }

    & input {
      padding: ${({ theme }) => theme.spacing(1, 2)};
      color: ${({ theme }) => theme.tokens.color.text.primary};

      &::placeholder {
        color: ${({ theme }) => theme.tokens.color.text.placeholder};
        opacity: 1;
      }

      &:disabled {
        color: ${({ theme }) => theme.tokens.color.text.disabled};
      }

      /* Chrome autofill styling override */
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.tokens.color.background.autofill} inset !important;
        -webkit-text-fill-color: ${({ theme }) => theme.tokens.color.text.primary} !important;
        caret-color: ${({ theme }) => theme.tokens.color.text.primary} !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }

  .MuiFormHelperText-root {
    font-size: ${({ theme }) => theme.tokens.typography.fontSize.sm};
    margin-top: ${({ theme }) => theme.spacing(0.25)};
    margin-left: 0;
    line-height: ${({ theme }) => theme.tokens.typography.lineHeight.default};

    &.Mui-error {
      color: ${({ theme }) => theme.tokens.color.semantic.error};
    }
  }
`;

export interface PasswordInputProps extends Omit<TextFieldProps, "variant" | "type"> {
  /** The label for the input field */
  label: string;
  /** The placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional margin bottom override */
  marginBottom?: string;
  /** Initial visibility state of the password */
  defaultVisible?: boolean;
  /** Whether the field has been touched (blurred at least once) */
  touched?: boolean;
  /** Error message to display if invalid */
  errorMessage?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  required = false,
  marginBottom,
  defaultVisible = false,
  touched,
  errorMessage,
  value,
  helperText,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(defaultVisible);

  const shouldShrink = !!placeholder;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showError = required && touched && (!value || value === "");
  const hasCustomError = errorMessage && touched;
  const mergedHelperText = hasCustomError ? `*${errorMessage}` : showError ? `*Please fill in this field.` : helperText;

  return (
    <StyledTextField
      fullWidth
      label={label}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      variant="outlined"
      required={required}
      sx={marginBottom ? { marginBottom } : undefined}
      InputLabelProps={{ shrink: shouldShrink }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end" aria-label="toggle password visibility">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={showError || hasCustomError || error}
      helperText={mergedHelperText}
      value={value}
      {...rest}
    />
  );
};

export default PasswordInput;
