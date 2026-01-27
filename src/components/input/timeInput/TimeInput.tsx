import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  background-color: ${({ theme }) => theme.tokens.color.background.primary};
  width: 80px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.tokens.color.neutral.gray250};
    border-width: 2px;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.tokens.color.neutral.gray250};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.tokens.color.background.disabledLight};
    border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
    cursor: not-allowed;
    font-weight: 400;
  }
`;

export interface TimeInputProps {
  /** The time value in HH:MM format */
  value: string;
  /** Callback when time value changes */
  onChange: (value: string) => void;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional placeholder text */
  placeholder?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, disabled = false, placeholder = "00:00" }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === "" || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return <StyledInput type="time" value={value} onChange={handleChange} disabled={disabled} placeholder={placeholder} />;
};

export default TimeInput;
