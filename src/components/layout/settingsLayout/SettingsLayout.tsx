import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import { useSidebarContext } from "../platformLayout/SidebarContext";
import SettingsNavigation from "../settingsNavigation";

// Icons
import BellIcon from "@assets/icons/bell.svg?react";
import CollapseIcon from "@assets/icons/collapse.svg?react";
import ExpandIcon from "@assets/icons/expand.svg?react";
import QuestionIcon from "@assets/icons/question.svg?react";
import SearchIcon from "@assets/icons/search.svg?react";

const BreadcrumbText = styled(Typography) <{ $isActive?: boolean }>`
  font-size: 16px;
  font-weight: 400;
  color: ${({ $isActive }) => ($isActive ? "#333333" : "#717171")};
`;

const BreadcrumbSeparator = () => (
  <svg
    style={{
      position: "relative",
      top: "2px",
      margin: "0 8px"
    }} width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L19 6.54167M19 6.54167L12 12.0833M19 6.54167L1 6.54167" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CircularIconButton = styled(IconButton)`
  background-color: transparent;
  width: 32px;
  height: 32px;
  padding: 6px;
  &:hover { background-color: #F3F4F6; }
`;

// Helper to get readable labels
const getBreadcrumbLabels = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const labels = segments.map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "));
  if (labels[0] === "Settings") return labels;
  return ["Settings", ...labels];
};

export const SettingsLayout: React.FC = () => {
  const { sidebarExpanded, onToggleExpand } = useSidebarContext();
  const location = useLocation();
  const labels = getBreadcrumbLabels(location.pathname);

  return (
    <div className="h-full flex flex-col px-6 pb-6">
      {/* Main Card with Shadow and Border */}
      <div className="flex-1 flex flex-col bg-white border border-[#CCCCCC] rounded-[20px] overflow-hidden shadow-sm">

        {/* Card Header (Breadcrumb) */}
        <div className="h-14 border-b border-[#CCCCCC] flex items-center justify-between px-6 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <CircularIconButton onClick={() => onToggleExpand(!sidebarExpanded)}>
              {sidebarExpanded ? (
                <CollapseIcon width={22} height={22} style={{ color: '#717171' }} />
              ) : (
                <ExpandIcon width={22} height={22} style={{ color: '#717171' }} />
              )}
            </CircularIconButton>

            {labels.map((label, index) => (
              <React.Fragment key={index}>
                <BreadcrumbText $isActive={index === labels.length - 1}>
                  {label}
                </BreadcrumbText>
                {index < labels.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <CircularIconButton><SearchIcon width={20} height={20} /></CircularIconButton>
            <CircularIconButton><QuestionIcon width={20} height={20} /></CircularIconButton>
            <CircularIconButton><BellIcon width={20} height={20} /></CircularIconButton>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 flex overflow-hidden ">
          {/* Settings Sidebar */}
          <div className="w-[260px] flex-shrink-0  h-full overflow-hidden bg-white pl-4 py-3">
            <SettingsNavigation />
          </div>

          {/* Main Content Area */}
          <div className="my-3 mr-4 flex-1 flex flex-col bg-white overflow-hidden border-[#CCCCCC] border rounded-tr-[20px] rounded-br-[20px]">
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
