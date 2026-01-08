import React from "react";
import styled, { useTheme } from "styled-components";
import type { DefaultTheme } from "styled-components";

const Container = styled.div<{ disabled?: boolean; hasLabel: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-bottom: ${({ theme, hasLabel }) => (hasLabel ? theme.spacing(3) : 0)};
`;

const SwitchContainer = styled.div<{
  checked: boolean;
  disabled?: boolean;
  borderColor: string;
}>`
  position: relative;
  width: 28px;
  height: 16px;
  background-color: ${({ theme }) => theme.tokens.color.overlay.transparent};
  border: 3px solid ${({ borderColor }) => borderColor};
  border-radius: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
`;

const SwitchThumb = styled.div<{
  checked: boolean;
  disabled?: boolean;
  thumbColor: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ checked }) => (checked ? "12px" : "2px")};
  width: 9.5px;
  height: 9px;
  background-color: ${({ thumbColor }) => thumbColor};
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.tokens.color.overlay.blackLight} 0px 1px 3px 0px;
`;

const Label = styled.label<{ disabled?: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  line-height: 1.2;
`;

export interface ToggleSwitchProps {
  /** Whether the toggle is checked */
  checked: boolean;
  /** Callback when toggle state changes */
  onChange: (checked: boolean) => void;
  /** Optional label text for the toggle */
  label?: string;
  /** Optional disabled state */
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  const theme = useTheme() as DefaultTheme;
  const success = disabled ? theme.palette.success.light : theme.palette.success.main;
  const gray = disabled ? theme.tokens.color.neutral.gray300 : theme.tokens.color.neutral.gray150;
  const borderColor = checked ? success : gray;
  const thumbColor = checked ? success : gray;
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <Container disabled={disabled} hasLabel={Boolean(label)}>
      <SwitchContainer checked={checked} disabled={disabled} borderColor={borderColor} onClick={handleToggle}>
        <SwitchThumb checked={checked} disabled={disabled} thumbColor={thumbColor} />
      </SwitchContainer>
      {label ? (
        <Label disabled={disabled} onClick={handleToggle}>
          {label}
        </Label>
      ) : null}
    </Container>
  );
};

export default ToggleSwitch;
