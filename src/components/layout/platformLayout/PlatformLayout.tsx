import LoadingSpinner from "@components/loading";
import { Box } from "@mui/material";
import { selectIsAuthenticated, selectIsLoading } from "@redux/selectors/authSelectors";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import styled from "styled-components";

import { Footer } from "../footer";
import { Sidebar } from "../sidebar";
import { TopNavBar } from "../topNavBar";

import { SidebarContext } from "./SidebarContext";

const PlatformContainer = styled(Box)`
  height: 100vh;
  overflow: hidden;
`;

const ContentArea = styled(Box)<{ $sidebarWidth: number }>`
  position: absolute;
  top: 64px;
  bottom: 0;
  left: ${({ $sidebarWidth }) => `${$sidebarWidth}px`};
  right: 0;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled(Box)`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

export const PlatformLayout: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarWidth = sidebarExpanded ? 240 : 68;

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  if (isLoading) {
    return <LoadingSpinner isLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <SidebarContext.Provider value={{ sidebarExpanded, sidebarWidth }}>
      <PlatformContainer>
        <TopNavBar />
        <Sidebar onToggleExpand={handleSidebarToggle} />
        <ContentArea $sidebarWidth={sidebarWidth}>
          <MainContent>
            <Box sx={{ flex: 1 }}>
              <Outlet />
            </Box>
            <Footer />
          </MainContent>
        </ContentArea>
      </PlatformContainer>
    </SidebarContext.Provider>
  );
};

export default PlatformLayout;
