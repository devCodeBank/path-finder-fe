import BellIcon from "@assets/icons/bell.svg?react";
import ChevronDownIcon from "@assets/icons/chevron-down.svg?react";
import QuestionIcon from "@assets/icons/question.svg?react";
import SearchIcon from "@assets/icons/search.svg?react";
import UserIcon from "@assets/icons/user.svg?react";
import LogoIcon from "@assets/logos/company-logo.svg?react";
import { Box, IconButton, Typography } from "@mui/material";
import { selectFullName } from "@redux/selectors/authSelectors";
import React from "react";
import { useSelector } from "react-redux";
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

const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const HideOnMobile = styled(Box)`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 600px) {
    display: none !important;
  }
`;

const AppName = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  color: #666666;

  @media (max-width: 600px) {
    display: none;
  }
`;

const UserName = styled(Typography)`
  font-weight: 500;
  font-size: 1rem;
  color: ${({ theme }) => theme.tokens.color.neutral.gray850};
  padding: 0 16px 0 16px;
`;

const CircularIconButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.tokens.color.overlay.brandLight};
  border-radius: 50%;
  width: 28px;
  height: 28px;
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.tokens.color.background.autofill};
  }

  &:active {
    background-color: ${({ theme }) => theme.tokens.color.background.autofill};
  }
`;

const UserIconWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.tokens.color.overlay.brandLight};
  border-radius: 50%;
  width: 28px;
  height: 28px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TopNavBar: React.FC = () => {
  const displayName = useSelector(selectFullName);

  const handleClick = (label: string) => () => {
    console.log("TO BE IMPLEMENTED: " + label);
  };

  return (
    <NavBarContainer>
      <LeftSection>
        <LogoIcon width={23} height={23} />
        <AppName variant="h6">pathfinder ats crm</AppName>
      </LeftSection>
      {/* <RightSection>
        <HideOnMobile>
          <CircularIconButton onClick={handleClick("search")} aria-label="search">
            <SearchIcon width={20} height={20} />
          </CircularIconButton>
          <CircularIconButton onClick={handleClick("help")} aria-label="help">
            <QuestionIcon width={20} height={20} />
          </CircularIconButton>
          <CircularIconButton onClick={handleClick("notifications")} aria-label="notifications">
            <BellIcon width={20} height={20} />
          </CircularIconButton>
        </HideOnMobile>
        <IconButton
          onClick={handleClick("user-menu")}
          aria-label="user menu"
          size="large"
          sx={{ display: "flex", alignItems: "center", padding: "0" }}
        >
          <UserIconWrapper>
            <UserIcon width={16} height={16} />
          </UserIconWrapper>
          <UserName>{displayName}</UserName>
          <ChevronDownIcon width={20} height={20} />
        </IconButton>
      </RightSection> */}
    </NavBarContainer>
  );
};

export default TopNavBar;
