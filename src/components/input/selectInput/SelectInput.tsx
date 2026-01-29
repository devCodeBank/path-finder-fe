import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import theme from "@theme/index";
import React from "react";
import styled from "styled-components";

const StyledFormControl = styled(FormControl)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};

  .MuiInputLabel-root {
    color: ${({ theme }) => theme.tokens.color.text.primary};
    font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.tokens.typography.fontSize.md};
    font-family: ${({ theme }) => theme.tokens.typography.fontFamily.primary};
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

    &.Mui-disabled {
      font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.normal};
      cursor: not-allowed;
    }

    .MuiFormLabel-asterisk {
      color: ${({ theme }) => theme.tokens.color.text.primary};
    }
  }

  .MuiSelect-select {
    padding: ${({ theme }) => theme.spacing(1, 2)};
    font-family: ${({ theme }) => theme.tokens.typography.fontFamily.primary};
    font-size: 13px;
    font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.normal};
    color: ${({ theme }) => theme.tokens.color.text.primary};

    &.Mui-disabled {
      color: ${({ theme }) => theme.tokens.color.text.disabled};
      -webkit-text-fill-color: ${({ theme }) => theme.tokens.color.text.disabled};
      font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.normal};
      cursor: not-allowed;
    }
  }

  .MuiSelect-icon.Mui-disabled {
    cursor: not-allowed;
  }

  .MuiOutlinedInput-root {
    border-radius: ${({ theme }) => theme.tokens.radius.md};
    background-color: ${({ theme }) => theme.tokens.color.background.primary};
    height: ${({ theme }) => theme.tokens.component.input.height};
    transition: all 200ms ease-in-out;

    & .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.border.medium};
      border-width: ${({ theme }) => theme.tokens.component.input.borderWidth};
    }

    &:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.border.dark};
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.border.dark};
      border-width: ${({ theme }) => theme.tokens.component.input.focusBorderWidth};
    }

    &.Mui-error .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.tokens.color.semantic.error};
    }

    &.Mui-disabled {
      background-color: ${({ theme }) => theme.tokens.color.background.disabled};
      cursor: not-allowed;

      & .MuiOutlinedInput-notchedOutline {
        border-color: ${({ theme }) => theme.tokens.color.border.light};
      }
    }
  }

  .MuiInputBase-root.Mui-disabled {
    cursor: not-allowed;
  }

  .MuiSelect-select em {
    color: ${({ theme }) => theme.tokens.color.text.placeholder};
    font-style: normal;
  }

  .MuiSelect-select.Mui-disabled em {
    color: ${({ theme }) => theme.tokens.color.text.disabled};
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

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
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
  zIndex?: number;
}

export const SelectInput: React.FC<SelectInputProps> = ({
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
  zIndex,
  ...props
}) => {
  const shouldShrink = !!placeholder || !!value;

  const showError = required && touched && (!value || value === "");
  const hasCustomError = errorMessage && touched;
  const mergedHelperText = hasCustomError ? `*${errorMessage}` : showError ? `*Please fill in this field.` : helperText;

  return (
    <StyledFormControl variant="outlined" required={required} disabled={disabled} error={showError || hasCustomError || error}>
      <InputLabel shrink={shouldShrink}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
        displayEmpty={!!placeholder}
        notched={shouldShrink}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          ...(zIndex ? { slotProps: { paper: { sx: { zIndex: zIndex } } } } : {}),
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
      {mergedHelperText && <FormHelperText sx={{ fontSize: theme.tokens.typography.fontSize.sm }}>{mergedHelperText}</FormHelperText>}
    </StyledFormControl>
  );
};

export default SelectInput;
