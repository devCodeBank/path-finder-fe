import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  color: ${({ theme }) => theme.tokens.color.text.primary};

  &[data-disabled="true"] {
    font-weight: 400;
  }
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.tokens.color.semantic.error};
  margin-left: 2px;
`;

const StyledTextField = styled(TextField)`
  .MuiInputLabel-root {
    display: none; /* Hide the floating label since we have our own above */
  }

  .MuiOutlinedInput-root {
    background-color: ${({ theme }) => theme.tokens.color.background.primary};
    font-size: 13px;
    font-weight: 400;

    & fieldset {
      border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
    }

    &:hover:not(.Mui-disabled) fieldset {
      border-color: ${({ theme }) => theme.tokens.color.neutral.gray250};
    }

    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.tokens.color.neutral.gray250};
      border-width: 2px;
    }

    &.Mui-disabled {
      background-color: ${({ theme }) => theme.tokens.color.background.disabledLight};
      font-weight: 400;

      & fieldset {
        border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
      }
    }

    & input::placeholder {
      color: ${({ theme }) => theme.tokens.color.neutral.gray350};
      opacity: 1;
    }
  }
`;

export interface FormInputProps extends Omit<TextFieldProps, "variant" | "label"> {
  /** The label for the input field */
  label: string;
  /** The placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** The input type */
  type?: "text" | "email" | "tel" | "url" | "search";
  /** Whether the field has been touched (blurred at least once) */
  touched?: boolean;
  /** Error message to display if invalid */
  errorMessage?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  required = false,
  type = "text",
  value,
  touched,
  errorMessage,
  ...rest
}) => {
  const showError = required && touched && (!value || value === "");
  const hasCustomError = errorMessage && touched;
  const helperText = hasCustomError ? errorMessage : showError ? "*Please fill in this field." : rest.helperText;
  const isDisabled = !!rest.disabled;

  return (
    <Container>
      <Label data-disabled={isDisabled ? "true" : "false"}>
        {label}
        {required && <RequiredIndicator> *</RequiredIndicator>}
      </Label>
      <StyledTextField
        fullWidth
        type={type}
        placeholder={placeholder}
        variant="outlined"
        error={showError || hasCustomError || rest.error}
        helperText={helperText}
        value={value}
        {...rest}
      />
    </Container>
  );
};

export default FormInput;
