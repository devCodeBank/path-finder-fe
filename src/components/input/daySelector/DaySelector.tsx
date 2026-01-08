import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-wrap: wrap;
`;

const DayButton = styled.button<{ selected: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  border-radius: 6px;
  background-color: ${({ selected, theme }) => (selected ? theme.tokens.color.brand.primary : theme.tokens.color.background.primary)};
  color: ${({ selected, theme }) => (selected ? theme.tokens.color.neutral.white : theme.tokens.color.text.primary)};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 44px;

  &:hover {
    border-color: ${({ theme }) => theme.tokens.color.brand.primary};
    ${({ selected, theme }) => !selected && `background-color: ${theme.tokens.color.brand.primary}15;`}
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.tokens.color.brand.primary}40;
  }
`;

export interface DaySelectorProps {
  /** Array of selected day indices (0-6, where 0 is Sunday) */
  selectedDays: number[];
  /** Callback when day selection changes */
  onChange: (selectedDays: number[]) => void;
  /** Optional disabled state */
  disabled?: boolean;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange, disabled = false }) => {
  const handleDayToggle = (dayIndex: number) => {
    if (disabled) return;

    const isSelected = selectedDays.includes(dayIndex);
    let newSelectedDays: number[];

    if (isSelected) {
      newSelectedDays = selectedDays.filter((day) => day !== dayIndex);
    } else {
      newSelectedDays = [...selectedDays, dayIndex];
    }

    onChange(newSelectedDays);
  };

  return (
    <Container>
      {DAYS.map((day, index) => (
        <DayButton key={day} selected={selectedDays.includes(index)} onClick={() => handleDayToggle(index)} disabled={disabled}>
          {day}
        </DayButton>
      ))}
    </Container>
  );
};

export default DaySelector;
