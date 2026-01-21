import BellIcon from "@assets/icons/bell.svg?react";
import CollapseIcon from "@assets/icons/collapse.svg?react";
import ExpandIcon from "@assets/icons/expand.svg?react";
import QuestionIcon from "@assets/icons/question.svg?react";
import SearchIcon from "@assets/icons/search.svg?react";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const BreadcrumbContainer = styled(Box) <{ $sidebarWidth: number }>`
  position: fixed;
  top: 64px;
  left: ${({ $sidebarWidth }) => `${$sidebarWidth}px`};
  right: 0;
  height: 48px;
  background: ${({ theme }) => theme.tokens.color.neutral.gray50 || "#F5F5F5"};
  border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.light || "#E0E0E0"};
  display: flex;
  align-items: center;
  padding: 0 16px;
  transition: left 0.3s ease;
  justify-content: space-between;
  z-index: ${({ theme }) => theme.tokens?.zIndex?.navbar ? theme.tokens.zIndex.navbar - 1 : 1049};
  border-top-left-radius: 20px;
`;

const BreadcrumbContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BreadcrumbText = styled(Typography) <{ $isActive?: boolean }>`
  font-size: 16px;
  font-weight: 400;
  color: ${({ $isActive }) => ($isActive ? "#333333" : "#717171")};
`;

const BreadcrumbSeparator = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0 8px;
`;

const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const CircularIconButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.tokens.color.overlay.brandLight};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.tokens.color.background.autofill};
  }

  &:active {
    background-color: ${({ theme }) => theme.tokens.color.background.autofill};
  }
`;


const SidebarToggleButton = styled(IconButton)`
  background-color: transparent;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  padding: 6px;
  margin-right: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.tokens.color.background.autofill};
  }

  &:active {
    background-color: ${({ theme }) => theme.tokens.color.background.autofill};
  }
`;

// Route to label mapping
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  candidates: "Candidates",
  jobs: "Jobs",
  companies: "Companies",
  contacts: "Contacts",
  mail: "Mail",
  folders: "Folders",
  reports: "Reports",
  activities: "Activities",
  chat: "Chat",
  settings: "Settings",
  user: "User Settings",
  admin: "Admin Settings",
  job: "Job Settings",
  profile: "Profile",
  notifications: "Notifications",
  "privacy-security": "Privacy & Security",
  email: "Email",
  calendar: "Calendar",
  "meeting-apps": "Meeting Apps",
  "company-details": "Company Details",
  users: "Users",
  "roles-permissions": "Roles & Permissions",
  teams: "Teams",
  locations: "Locations",
  billing: "Billing",
  "audit-log": "Audit Log",
  layout: "Layout",
  fields: "Fields",
  status: "Status",
  tags: "Tags",
  "skill-set": "Skill Set",
  page: "Page",
  add: "Add",
  edit: "Edit",
  "system-roles": "System Roles",
  "create-custom": "Create Custom Role",
  create: "Create",
};

const getBreadcrumbPath = (pathname: string): string[] => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return ["Dashboard"];
  }

  // Map each segment to its label
  return segments.map(segment => {
    return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  });
};

interface RouteBreadcrumbProps {
  sidebarWidth: number;
  sidebarExpanded: boolean;
  onSidebarToggle: () => void;
  onMenuItemClick?: (label: string) => void;
}

export const RouteBreadcrumb: React.FC<RouteBreadcrumbProps> = ({
  sidebarWidth,
  sidebarExpanded,
  onSidebarToggle,
  onMenuItemClick
}) => {
  const location = useLocation();

  const breadcrumbPath = getBreadcrumbPath(location.pathname);
  const isSettingsPage = location.pathname.includes("/settings");

  return (
    <BreadcrumbContainer
      $sidebarWidth={sidebarWidth}
      sx={isSettingsPage ? {
        left: `${sidebarWidth + 24}px !important`,
        right: '24px !important',
        background: '#FFFFFF !important',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        border: '1px solid #E0E0E0',
        borderBottom: '1px solid #E0E0E0',
        zIndex: 100
      } : {}}
    >
      <BreadcrumbContent>
        <SidebarToggleButton
          onClick={onSidebarToggle}
          aria-label={sidebarExpanded ? "collapse sidebar" : "expand sidebar"}
        >
          {sidebarExpanded ? (
            <CollapseIcon width={20} height={20} />
          ) : (
            <ExpandIcon width={20} height={20} />
          )}
        </SidebarToggleButton>
        {breadcrumbPath.map((label, index) => (
          <React.Fragment key={index}>
            <BreadcrumbText $isActive={index === breadcrumbPath.length - 1}>
              {label}
            </BreadcrumbText>
            {index < breadcrumbPath.length - 1 && (
              <BreadcrumbSeparator>
                <svg
                  style={{
                    position: "relative",
                    top: "2px",
                  }} width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">

                  <path d="M12 1L19 6.54167M19 6.54167L12 12.0833M19 6.54167L1 6.54167" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbContent>

      <RightSection>
        <CircularIconButton onClick={() => onMenuItemClick?.("search")} aria-label="search">
          <SearchIcon width={20} height={20} />
        </CircularIconButton>
        <CircularIconButton onClick={() => onMenuItemClick?.("help")} aria-label="help">
          <QuestionIcon width={20} height={20} />
        </CircularIconButton>
        <CircularIconButton onClick={() => onMenuItemClick?.("notifications")} aria-label="notifications">
          <BellIcon width={20} height={20} />
        </CircularIconButton>

      </RightSection>
    </BreadcrumbContainer>
  );
};

export default RouteBreadcrumb;
