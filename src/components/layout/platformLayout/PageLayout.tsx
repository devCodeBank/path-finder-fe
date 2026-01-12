import React from "react";
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useSidebarContext } from "./SidebarContext";
import { cn } from "@/lib/utils";

// Icons
import BellIcon from "@assets/icons/bell.svg?react";
import CollapseIcon from "@assets/icons/collapse.svg?react";
import ExpandIcon from "@assets/icons/expand.svg?react";
import QuestionIcon from "@assets/icons/question.svg?react";
import SearchIcon from "@assets/icons/search.svg?react";

const BreadcrumbSeparator = () => (
    <svg
        style={{
            position: "relative",
            top: "2px",
            margin: "0 3px"
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
    if (segments.length === 0) return ["Dashboard"];
    return segments.map(segment => routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "));
};

interface PageLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, sidebar }) => {
    const { sidebarExpanded, onToggleExpand } = useSidebarContext();
    const location = useLocation();
    const breadcrumbPath = getBreadcrumbPath(location.pathname);

    return (
        <div className="h-full flex flex-col pr-2 pb-6 overflow-hidden">
            {/* Main Card with Shadow and Border */}
            <div className="flex-1 flex flex-col bg-white border border-[#CCCCCC] rounded-[20px] overflow-hidden shadow-sm">

                {/* Card Header (Breadcrumb) */}
                <div className="h-14 border-b border-[#CCCCCC] flex items-center justify-between px-4 bg-white flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <CircularIconButton
                            onClick={() => onToggleExpand(!sidebarExpanded)}
                            style={{ flexShrink: 0 }}
                        >
                            {sidebarExpanded ? (
                                <CollapseIcon width={20} height={20} style={{ color: '#717171' }} />
                            ) : (
                                <ExpandIcon width={20} height={20} style={{ color: '#717171' }} />
                            )}
                        </CircularIconButton>

                        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar">
                            {breadcrumbPath.map((label, index) => (
                                <React.Fragment key={index}>
                                    <span className={cn(
                                        "text-[16px] font-[400]",
                                        index === breadcrumbPath.length - 1 ? "text-[#333333]" : "text-[#717171]"
                                    )}>
                                        {label}
                                    </span>
                                    {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <CircularIconButton><SearchIcon width={20} height={20} /></CircularIconButton>
                        <CircularIconButton><QuestionIcon width={20} height={20} /></CircularIconButton>
                        <CircularIconButton><BellIcon width={20} height={20} /></CircularIconButton>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Optional Sidebar */}
                    {sidebar && (
                        <div className="w-[260px] flex-shrink-0 h-full overflow-y-auto bg-white pl-4 py-3 border-r border-[#F0F0F0]">
                            {sidebar}
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className={cn(
                        "my-3 mr-4 flex-1 flex flex-col bg-white overflow-hidden border-[#CCCCCC] border shadow-[0px_4px_4px_0px_#00000014]",
                        sidebar ? "rounded-tr-[20px] rounded-br-[20px]" : "rounded-[20px] ml-4"
                    )}>
                        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CCCCCC; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default PageLayout;
