import CompanyLogoSVG from "@assets/logos/company-logo.svg?react";
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

interface StyledCompanyLogoProps {
  $size: "small" | "medium" | "large";
}

const StyledCompanyLogo = styled(CompanyLogoSVG)<StyledCompanyLogoProps>`
  width: ${({ $size }) => {
    switch ($size) {
      case "small":
        return "20px";
      case "medium":
        return "24px";
      case "large":
        return "40px";
      default:
        return "24px";
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case "small":
        return "20px";
      case "medium":
        return "24px";
      case "large":
        return "40px";
      default:
        return "24px";
    }
  }};
  flex-shrink: 0;
`;

interface LogoTextProps {
  $size: "small" | "medium" | "large";
}

const LogoText = styled(Typography)<LogoTextProps>`
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  font-size: ${({ $size }) => {
    switch ($size) {
      case "small":
        return "16px";
      case "medium":
        return "18px";
      case "large":
        return "28px";
      default:
        return "18px";
    }
  }};
`;

export interface LogoProps {
  size?: "small" | "medium" | "large";
}

export const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  return (
    <LogoContainer>
      <StyledCompanyLogo $size={size} />
      <LogoText $size={size} variant="h6">
        pathfinder ats crm
      </LogoText>
    </LogoContainer>
  );
};

export default Logo;
