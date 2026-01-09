import { Box } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

interface FooterContainerProps {
  $isSettingsPage: boolean;
}

const FooterContainer = styled(Box) <FooterContainerProps>`
  margin-bottom: 48px;
  // border-top: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  background: ${({ theme }) => theme.tokens.color.background.primary};
  margin-left: ${({ $isSettingsPage }) => ($isSettingsPage ? "230px" : "0")};
`;

export const Footer: React.FC = () => {
  const location = useLocation();
  const isSettingsPage = location.pathname.startsWith("/settings");

  return <FooterContainer $isSettingsPage={isSettingsPage}></FooterContainer>;
};

export default Footer;
