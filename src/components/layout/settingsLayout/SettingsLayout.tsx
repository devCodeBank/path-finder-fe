import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import SettingsNavigation from "../settingsNavigation";

const LayoutContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ContentArea = styled(Box)`
  flex: 1;
  margin-left: 230px;
  background: ${({ theme }) => theme.tokens.color.background.primary};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(Box)`
  flex: 1;
  padding: 24px 20px;
`;

export const SettingsLayout: React.FC = () => {
  return (
      <div style={{background: "white" }}>
    <LayoutContainer>
        <SettingsNavigation />
      <ContentArea>
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentArea>
    </LayoutContainer>
      </div>
  );
};

export default SettingsLayout;
