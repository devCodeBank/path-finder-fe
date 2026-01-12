import CalendarIcon from "@assets/icons/calendar.svg?react";
import CandidatesIcon from "@assets/icons/candidates.svg?react";
import CompanyIcon from "@assets/icons/company.svg?react";
import ContactsIcon from "@assets/icons/contacts.svg?react";
import DashboardIcon from "@assets/icons/dashboard.svg?react";
import FolderIcon from "@assets/icons/folder.svg?react";
import JobsIcon from "@assets/icons/jobs.svg?react";
import LogoutIcon from "@assets/icons/logout.svg?react";
import MailIcon from "@assets/icons/mail-close.svg?react";
import ReportsIcon from "@assets/icons/reports.svg?react";
import SettingsIcon from "@assets/icons/settings.svg?react";
import { signOut } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import { type FC, type ComponentType } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import SidebarMenuItem from "./SidebarMenuItem";

export interface MenuItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface SidebarProps {
  isExpanded?: boolean;
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
  { id: "logout", icon: LogoutIcon, label: "Logout", path: "/logout" },
  { id: "user-avatar", icon: DashboardIcon, label: "User Profile", path: "#" },
];

const routesWithNestedPages = ["/settings"];

const isRouteSelected = (currentPath: string, itemPath: string): boolean => {
  if (routesWithNestedPages.includes(itemPath)) {
    return currentPath.startsWith(itemPath);
  }
  return currentPath === itemPath;
};

export const Sidebar: FC<SidebarProps> = ({ isExpanded = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();



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

      if (item.id === "user-avatar") {
        return (
          <div key={item.id} className={cn(
            "flex items-center h-[34px] mx-[6px] rounded-[4px] mb-2",
            isExpanded ? "w-[calc(100%-12px)] px-3 justify-start" : "w-[56px] justify-center"
          )}>
            <div className="w-[24px] h-[24px] rounded-full bg-[#666666] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              PK
            </div>
            {isExpanded && (
              <span className="text-[14px] font-medium text-[#333333] ml-3">
                User Profile
              </span>
            )}
          </div>
        );
      }

      return (
        <SidebarMenuItem
          key={item.id}
          item={item}
          isSelected={isSelected}
          isExpanded={isExpanded}
          onItemClick={handleItemClick}
        />
      );
    });
  };



  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen transition-[width] duration-300 ease-in-out z-[1040] pt-16 flex flex-col bg-[#eaeaea]",
        isExpanded ? "w-[240px]" : "w-[68px]"
      )}
    >
      <nav className="flex-1 flex flex-col pt-2">
        <div className="flex flex-col mt-[55px]">
          {renderMenuItems(mainMenuItems)}
        </div>

        <div className="flex flex-col mt-auto pb-[50px] gap-2">
          {renderMenuItems(bottomMenuItems)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar
