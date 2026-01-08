import { Box, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useSidebarContext } from "../platformLayout/SidebarContext";

const NavigationContainer = styled(Box)<{ $sidebarWidth: number }>`
  width: 230px;
  height: calc(100vh - 212px);
  background: white;
  // border-right: 1px solid ${({ theme }) => theme.tokens.color.border.light};
  border-top: 1px solid var(--color-medium-light-gray-boarder, #CCCCCC);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: ${({ $sidebarWidth }) => `${$sidebarWidth}px`};
  top: 212px; /* Account for top nav height */
  z-index: ${({ theme }) => theme.tokens.zIndex.fixed};
  overflow-y: auto;
  transition: left 0.3s ease;
  border-top-left-radius: 20px;
`;



const NavigationContent = styled(Box)`
  flex: 1;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled(Box)`
  padding: ${({ theme }) => theme.spacing(0, 1, 0, 1)};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionHeader = styled(Typography)`
  padding: ${({ theme }) => theme.spacing(0, 1, 0.75, 1)};
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
`;

const MenuItem = styled(Box)<{ $isSelected?: boolean }>`
  cursor: pointer;
  transition: all 0.1s ease;
  background: ${({ $isSelected, theme }) => ($isSelected ? theme.tokens.color.brand.primary : theme.tokens.color.overlay.transparent)};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.tokens.color.neutral.white : theme.tokens.color.text.primary)};
  border-radius: 4px;

  &:hover {
    background: ${({ $isSelected, theme }) => ($isSelected ? theme.tokens.color.brand.primary : theme.tokens.color.neutral.gray50)};
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.tokens.color.neutral.white : theme.tokens.color.brand.primary)};
  }
`;

const MenuText = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  padding: ${({ theme }) => theme.spacing(1, 1)};
`;

interface NavigationItem {
  id: string;
  label: string;
  path: string;
}

interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    id: "user-settings",
    title: "User Settings",
    items: [
      { id: "profile", label: "Profile", path: "/settings/user/profile" },
      { id: "notifications", label: "Notifications", path: "/settings/user/notifications" },
      { id: "privacy-security", label: "Privacy & Security", path: "/settings/user/privacy-security" },
      { id: "email", label: "Email", path: "/settings/user/email" },
      { id: "calendar", label: "Calendar", path: "/settings/user/calendar" },
      { id: "meeting-apps", label: "Meeting Apps", path: "/settings/user/meeting-apps" },
    ],
  },
  {
    id: "admin-settings",
    title: "Admin Settings",
    items: [
      { id: "company-details", label: "Company Details", path: "/settings/admin/company-details" },
      { id: "users", label: "Users", path: "/settings/admin/users" },
      { id: "roles-permissions", label: "Roles & Permissions", path: "/settings/admin/roles-permissions" },
      { id: "teams", label: "Teams", path: "/settings/admin/teams" },
      { id: "locations", label: "Locations", path: "/settings/admin/locations" },
      { id: "billing", label: "Billing", path: "/settings/admin/billing" },
      { id: "audit-log", label: "Audit Log", path: "/settings/admin/audit-log" },
    ],
  },
  {
    id: "job-settings",
    title: "Job Settings",
    items: [
      { id: "layout", label: "Layout", path: "/settings/job/layout" },
      { id: "fields", label: "Fields", path: "/settings/job/fields" },
      { id: "status", label: "Status", path: "/settings/job/status" },
      { id: "tags", label: "Tags", path: "/settings/job/tags" },
      { id: "skill-set", label: "Skill Set", path: "/settings/job/skill-set" },
      { id: "page", label: "Page", path: "/settings/job/page" },
    ],
  },
];

export const SettingsNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarWidth } = useSidebarContext();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const isPathActive = (itemPath: string) => {
    // Exact match
    if (location.pathname === itemPath) return true;

    // Check if current path is a child of the item path
    // For example: /settings/admin/users/add is a child of /settings/admin/users
    if (location.pathname.startsWith(itemPath + "/")) return true;

    return false;
  };

  return (
    
    <NavigationContainer $sidebarWidth={sidebarWidth}>

      <NavigationContent>
        {navigationSections.map((section) => (
          <Section key={section.id}>
            <SectionHeader variant="lg">{section.title}</SectionHeader>
            {section.items.map((item) => (
              <MenuItem key={item.id} $isSelected={isPathActive(item.path)} onClick={() => handleItemClick(item.path)}>
                <MenuText>{item.label}</MenuText>
              </MenuItem>
            ))}
          </Section>
        ))}
      </NavigationContent>
    </NavigationContainer>
  );
};

export default SettingsNavigation;
