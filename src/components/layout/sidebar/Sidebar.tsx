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
import BrandLogo from "@assets/logos/brand-logo.png";
import BrandName from "@assets/logos/brand-name.png";

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
            "flex items-center h-[36px] w-[calc(100%-12px)] mx-[6px] rounded-[4px]  px-3 justify-start transition-[background-color] ",
            isExpanded ? "bg-[#666666]" : ""
          )}>
            <div className={cn(`w-[24px] h-[24px] rounded-full  flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${isExpanded ? "bg-[#CCCCCC]" : "bg-[#666666]"}`)}>
              PK
            </div>
            {isExpanded && (
              <>
                <div className="flex flex-col ml-[18px]">
                  <span className="text-[10px] font-medium text-[#FFFFFF]">
                    Pankaj Kumar
                  </span>
                  <span className="text-[10px] font-medium text-[#FFFFFF]">
                    Pathfinder ats crm
                  </span>

                </div>
                <div className="ml-[18px]">
                  <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.83333 9.50781L5.16667 14.1745L0.5 9.50781" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M0.502605 5.16808L5.16921 0.501359L9.83594 5.16797" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </>

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
        "fixed left-0 top-[13px] h-[calc(100vh-13px)] transition-[width] duration-300 ease-in-out z-[1040] flex flex-col bg-[#eaeaea] overflow-hidden",
        isExpanded ? "w-[219px]" : "w-[68px]"
      )}
      style={{ willChange: "width" }}
    >
      <div className={cn(
        "h-[56px] flex items-center px-[12px] border-[#CCCCCC] bg-[#EAEAEA]",
        isExpanded ? "justify-start" : "justify-center"
      )}>
        {isExpanded ? (
          <div className="flex items-center gap-[10px]">
            <img src={BrandLogo} alt="Pathfinder logo" className="h-[30px] w-[30px]" />
            <img src={BrandName} alt="Pathfinder ATS CRM" className="h-[24px] w-auto" />
          </div>
        ) : (
          <img src={BrandLogo} alt="Pathfinder logo" className="h-[30px] w-[30px]" />
        )}
      </div>
      <nav className="flex-1 flex flex-col">
        <div className="flex flex-col mt-[12px] gap-[5px] justify-center">
          {renderMenuItems(mainMenuItems)}
        </div>

        <div className="flex flex-col mt-auto  gap-[18px] pb-[16px]">
          {renderMenuItems(bottomMenuItems)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar
