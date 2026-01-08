import CalendarIcon from "@assets/icons/calendar.svg?react";
import CandidatesIcon from "@assets/icons/candidates.svg?react";
import ChatIcon from "@assets/icons/chat.svg?react";
import CollapseIcon from "@assets/icons/collapse.svg?react";
import CompanyIcon from "@assets/icons/company.svg?react";
import ContactsIcon from "@assets/icons/contacts.svg?react";
import DashboardIcon from "@assets/icons/dashboard.svg?react";
import ExpandIcon from "@assets/icons/expand.svg?react";
import FolderIcon from "@assets/icons/folder.svg?react";
import JobsIcon from "@assets/icons/jobs.svg?react";
import LogoutIcon from "@assets/icons/logout.svg?react";
import MailIcon from "@assets/icons/mail-close.svg?react";
import ReportsIcon from "@assets/icons/reports.svg?react";
import SettingsIcon from "@assets/icons/settings.svg?react";
import { Box, IconButton } from "@mui/material";
import { signOut } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import { useState, useEffect, type FC, type ComponentType } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import SidebarMenuItem from "./SidebarMenuItem";

const SidebarContainer = styled(Box)<{ $isExpanded: boolean }>`
  width: ${({ $isExpanded, theme }) =>
    $isExpanded ? theme.tokens.component.sidebar.width.expanded : theme.tokens.component.sidebar.width.collapsed};
  height: 100vh;
  border-right: 1px solid ${({ theme }) => theme.tokens.color.border.light};
  background:#EAEAEA;
  transition: width 300ms ease-in-out;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: ${({ theme }) => theme.tokens.zIndex.sidebar};
  padding-top: ${({ theme }) => theme.tokens.component.topNav.height};
`;

const SidebarHeader = styled(Box)<{ $isExpanded: boolean }>`
  padding: ${({ theme }) => theme.spacing(1.5, 0.75)};
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) => ($isExpanded ? "flex-end" : "center")};
`;

const MenuSection = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MainMenuItems = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

const BottomMenuItems = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-top: auto;
  padding: ${({ theme }) => theme.spacing(0, 0, 3)};
`;

const ExpandButton = styled(IconButton)`
  width: 56px;
  height: 32px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  transition: color 200ms ease-in-out;

  svg {
    width: 24px;
    height: 24px;
    color: inherit;
  }

  &:hover {
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    background: ${({ theme }) => theme.tokens.color.background.secondary};

    svg {
      color: ${({ theme }) => theme.tokens.color.brand.primary};
    }
  }
`;

export interface MenuItem {
  id: string;
  icon: ComponentType;
  label: string;
  path: string;
}

interface SidebarProps {
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

const mainMenuItems: MenuItem[] = [
  { id: "dashboard", icon: DashboardIcon, label: "Dashboard", path: "/dashboard" },
  { id: "candidates", icon: CandidatesIcon, label: "Candidates", path: "/candidates" },
  { id: "jobs", icon: JobsIcon, label: "Jobs", path: "/jobs" },
  { id: "companies", icon: CompanyIcon, label: "Companies", path: "/companies" },
  { id: "contacts", icon: ContactsIcon, label: "Contacts", path: "/contacts" },
  { id: "mail", icon: MailIcon, label: "Mail", path: "/mail" },
  { id: "folders", icon: FolderIcon, label: "Folders", path: "/folders" },
  { id: "reports", icon: ReportsIcon, label: "Reports", path: "/reports" },
  { id: "activities", icon: CalendarIcon, label: "Activities", path: "/activities" },
];

const bottomMenuItems: MenuItem[] = [
  { id: "settings", icon: SettingsIcon, label: "Settings", path: "/settings" },
  { id: "chat", icon: ChatIcon, label: "Chat", path: "/chat" },
  { id: "logout", icon: LogoutIcon, label: "Logout", path: "/logout" },
];

const routesWithNestedPages = ["/settings"];

const isRouteSelected = (currentPath: string, itemPath: string): boolean => {
  if (routesWithNestedPages.includes(itemPath)) {
    return currentPath.startsWith(itemPath);
  }
  return currentPath === itemPath;
};

export const Sidebar: FC<SidebarProps> = ({ isExpanded = false, onToggleExpand }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    onToggleExpand?.(newExpandedState);
  };

  useEffect(() => {
    onToggleExpand?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await dispatch(signOut());
    navigate("/auth/login");
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.id === "logout") {
      handleLogout();
      return;
    }

    const isSelected = isRouteSelected(location.pathname, item.path);
    if (!isSelected) {
      navigate(item.path);
    }
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const isSelected = isRouteSelected(location.pathname, item.path);

      return <SidebarMenuItem key={item.id} item={item} isSelected={isSelected} isExpanded={isExpanded} onItemClick={handleItemClick} />;
    });
  };

  const isSettingsPage = location.pathname.startsWith('/settings');

  return (
    <SidebarContainer $isExpanded={isExpanded}>
      <SidebarHeader $isExpanded={isExpanded}>
        {!isSettingsPage && (
          <ExpandButton onClick={toggleExpanded}>{isExpanded ? <CollapseIcon /> : <ExpandIcon />}</ExpandButton>
        )}
      </SidebarHeader>

      <MenuSection>
        <MainMenuItems>{renderMenuItems(mainMenuItems)}</MainMenuItems>

        <BottomMenuItems>{renderMenuItems(bottomMenuItems)}</BottomMenuItems>
      </MenuSection>
    </SidebarContainer>
  );
};

export default Sidebar;
