import LoadingSpinner from "@components/loading";
import { Box } from "@mui/material";
import { selectIsLoading } from "@redux/selectors/authSelectors";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import { Footer } from "../footer";
import { Sidebar } from "../sidebar";
import { TopNavBar } from "../topNavBar";
import { RouteBreadcrumb } from "../breadcrumb";

import { SidebarContext } from "./SidebarContext";

const PlatformContainer = styled(Box)`
  height: 100vh;
  overflow: hidden;
`;

const ContentArea = styled(Box)<{ $sidebarWidth: number }>`
  position: absolute;
  top: 112px; /* 64px (top nav) + 48px (breadcrumb) */
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
  // padding: 24px;
`;

export const PlatformLayout: React.FC = () => {
  const isLoading = useSelector(selectIsLoading);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarWidth = sidebarExpanded ? 240 : 68;

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
    <SidebarContext.Provider value={{ sidebarExpanded, sidebarWidth }}>
      <PlatformContainer>
        <TopNavBar />
        <Sidebar isExpanded={sidebarExpanded} onToggleExpand={handleSidebarToggle} />
        <RouteBreadcrumb
          sidebarWidth={sidebarWidth}
          sidebarExpanded={sidebarExpanded}
          onSidebarToggle={() => handleSidebarToggle(!sidebarExpanded)}
          onMenuItemClick={(label) => console.log("TO BE IMPLEMENTED: " + label)}
        />
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
