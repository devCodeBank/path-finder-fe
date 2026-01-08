import { Button as MuiButton } from "@mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material";
import type { FC } from "react";
import styled, { css } from "styled-components";

const buttonVariants = {
  solid: css`
    background: ${({ theme }) => theme.tokens.color.brand.primary};
    color: ${({ theme }) => theme.tokens.color.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.brand.primaryHover};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.brand.primaryPressed};
    }

    &:disabled {
      background: ${({ theme }) => theme.tokens.color.brand.primaryHover} !important;
      color: ${({ theme }) => theme.tokens.color.text.inverse} !important;
      border: none !important;
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,

  outlined: css`
    background: ${({ theme }) => theme.tokens.color.background.primary};
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    border: 1px solid ${({ theme }) => theme.tokens.color.brand.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.overlay.brandLight};
      color: ${({ theme }) => theme.tokens.color.brand.primary};
      border-color: ${({ theme }) => theme.tokens.color.brand.primary};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.background.autofill};
      color: ${({ theme }) => theme.tokens.color.brand.primary};
      border-color: ${({ theme }) => theme.tokens.color.brand.primary};
    }

    &:disabled {
      background: ${({ theme }) => theme.tokens.color.overlay.brandLight};
      color: ${({ theme }) => theme.tokens.color.brand.primary};
      border-color: ${({ theme }) => theme.tokens.color.brand.primary};
      opacity: 0.7;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,
  neutral: css`
    background: ${({ theme }) => theme.tokens.color.background.primary};
    color: ${({ theme }) => theme.tokens.color.text.primary};
    border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.background.disabledLight};
      border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
      box-shadow: none;
      transform: none;
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.border.mediumLight};
      box-shadow: none;
      transform: none;
    }

    &:disabled {
      background: ${({ theme }) => theme.tokens.color.background.primary};
      color: ${({ theme }) => theme.tokens.color.text.primary};
      border-color: ${({ theme }) => theme.tokens.color.border.mediumLight};
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,
  text: css`
    background: transparent;
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.overlay.brandLight};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.background.autofill};
    }

    &:disabled {
      background: ${({ theme }) => theme.tokens.color.background.autofill};
      color: ${({ theme }) => theme.tokens.color.brand.primary};
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,
  textNeutral: css`
    background: transparent;
    color: ${({ theme }) => theme.tokens.color.text.secondary};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.overlay.grayLight};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.overlay.grayLight};
    }

    &:disabled {
      background: ${({ theme }) => theme.tokens.color.overlay.grayLight};
      color: ${({ theme }) => theme.tokens.color.text.secondary};
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,
  soft: css`
    background: transparent;
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.brand.primaryHover};
      color: ${({ theme }) => theme.tokens.color.text.inverse};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.brand.primary};
      color: ${({ theme }) => theme.tokens.color.text.inverse};
    }

    &:disabled {
      background: ${({ theme }) => theme.tokens.color.brand.primaryHover};
      color: ${({ theme }) => theme.tokens.color.text.inverse};
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.tokens.color.semantic.error};
    color: ${({ theme }) => theme.tokens.color.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.tokens.color.semantic.error};
      filter: brightness(0.9);
    }

    &:disabled {
      color: ${({ theme }) => theme.tokens.color.text.inverse};
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
      transform: none !important;
    }
  `,
};

const StyledButton = styled(MuiButton)<StyledButtonProps>`
  ${({ $variant = "solid" }) => buttonVariants[$variant]};

  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.tokens.radius.sm};
  box-shadow: none;
  text-transform: none;
  transition: all 200ms ease-in-out;

  ${({ $size = "md", theme }) => {
    const sizes = {
      sm: css`
        height: ${theme.tokens.component.button.height.sm};
        padding: ${theme.spacing(1, 1.5)};
        font-size: ${theme.tokens.typography.fontSize.sm};
      `,
      md: css`
        height: ${theme.tokens.component.button.height.md};
        padding: ${theme.spacing(1.25, 2)};
        font-size: ${theme.tokens.typography.fontSize.md};
      `,
      lg: css`
        height: ${theme.tokens.component.button.height.lg};
        padding: ${theme.spacing(1.5, 3)};
        font-size: ${theme.tokens.typography.fontSize.lg};
      `,
    };
    return sizes[$size];
  }}

  &:hover {
    box-shadow: ${({ theme }) => theme.tokens.shadow.md};
  }

  &:active {
    box-shadow: ${({ theme }) => theme.tokens.shadow.md};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.tokens.shadow.focus};
  }
`;

interface StyledButtonProps {
  $variant?: "solid" | "outlined" | "text" | "textNeutral" | "soft" | "neutral" | "danger";
  $size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}
export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "color" | "size"> {
  /** Button variant */
  variant?: "solid" | "outlined" | "text" | "textNeutral" | "soft" | "neutral" | "danger";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Icon to display before text */
  startIcon?: React.ReactNode;
  /** Icon to display after text */
  endIcon?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  variant = "solid",
  size = "md",
  fullWidth = false,
  children,
  startIcon,
  endIcon,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled || loading}
      disableElevation
      {...props}
    >
      {loading ? "Loading..." : children}
    </StyledButton>
  );
};

export default Button;
