import LogoIcon from "@assets/logos/company-logo.svg?react";
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const NavBarContainer = styled(Box)`
  position: fixed;
  top: 0;
  z-index: ${({ theme }) => theme.tokens.zIndex.navbar};
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #EAEAEA;
  // border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  padding: 0 24px;

  @media (max-width: 600px) {
    padding: 0 4px 0 16px;
  }
`;

const LeftSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AppName = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  color: #666666;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const TopNavBar: React.FC = () => {
  return (
    <NavBarContainer>
      <LeftSection>
        <LogoIcon width={23} height={23} />
        <AppName variant="h6">pathfinder ats crm</AppName>
      </LeftSection>
    </NavBarContainer>
  );
};

export default TopNavBar;
