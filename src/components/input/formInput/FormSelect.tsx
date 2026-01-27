import { FormControl, Select, MenuItem, FormHelperText } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
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

const StyledFormControl = styled(FormControl)`
  width: 100%;

  .MuiInputLabel-root {
    display: none; /* Hide the floating label since we have our own above */
  }

  .MuiSelect-select {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 400;
  }

  .MuiOutlinedInput-root {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.tokens.color.background.primary};

    & .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
    }

    &:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.neutral.gray250};
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.neutral.gray250};
      border-width: 2px;
    }

    &.Mui-disabled {
      background-color: ${({ theme }) => theme.tokens.color.background.disabledLight};

      & .MuiOutlinedInput-notchedOutline {
        border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
      }
    }
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiSelect-select {
    font-weight: 400;
  }

  .MuiSelect-select em {
    color: ${({ theme }) => theme.tokens.color.neutral.gray350};
    font-style: normal;
  }
`;

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  onChange: (event: SelectChangeEvent<string>) => void;
  touched?: boolean;
  errorMessage?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  options,
  placeholder = "Please select",
  helperText,
  required = false,
  disabled = false,
  error = false,
  onChange,
  touched = false,
  errorMessage,
  onBlur,
  ...props
}) => {
  const showError = required && touched && (!value || value === "");
  const hasCustomError = errorMessage && touched;
  const mergedHelperText = hasCustomError ? errorMessage : showError ? "*Please fill in this field." : helperText;

  return (
    <Container>
      <Label data-disabled={disabled ? "true" : "false"}>
        {label}
        {required && <RequiredIndicator> *</RequiredIndicator>}
      </Label>
      <StyledFormControl variant="outlined" required={required} disabled={disabled} error={showError || hasCustomError || error}>
        <Select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          displayEmpty={!!placeholder}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          {...props}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {mergedHelperText && <FormHelperText>{mergedHelperText}</FormHelperText>}
      </StyledFormControl>
    </Container>
  );
};

export default FormSelect;
