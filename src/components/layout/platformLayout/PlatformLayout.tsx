import LoadingSpinner from "@components/loading";
import { Box } from "@mui/material";
import { selectIsLoading } from "@redux/selectors/authSelectors";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import { Footer } from "../footer";
import { Sidebar } from "../sidebar";
import { TopNavBar } from "../topNavBar";
import PageLayout from "./PageLayout";

import { SidebarContext } from "./SidebarContext";

const PlatformContainer = styled(Box)`
  height: 100vh;
  overflow: hidden;
  background:#eaeaea;
`;

const ContentArea = styled(Box) <{ $sidebarWidth: number; $top: number }>`
  position: absolute;
  top: ${({ $top }) => `${$top}px`};
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const PlatformLayout: React.FC = () => {
  const isLoading = useSelector(selectIsLoading);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarWidth = sidebarExpanded ? 240 : 68;
  const location = useLocation();
  const isSettingsPage = location.pathname.includes("/settings");

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  if (isLoading) {
    return <LoadingSpinner isLoading />;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" state={{ from: location }} replace />;
  // }

  return (
    <SidebarContext.Provider value={{ sidebarExpanded, sidebarWidth, onToggleExpand: handleSidebarToggle }}>
      <PlatformContainer>
        <TopNavBar />
        <Sidebar isExpanded={sidebarExpanded} onToggleExpand={handleSidebarToggle} />

        <ContentArea $sidebarWidth={sidebarWidth} $top={64}>
          <MainContent>
            {isSettingsPage ? (
              <Outlet />
            ) : (
              <PageLayout>
                <Outlet />
              </PageLayout>
            )}
            <Footer />
          </MainContent>
        </ContentArea>
      </PlatformContainer>
    </SidebarContext.Provider>
  );
};

export default PlatformLayout;
