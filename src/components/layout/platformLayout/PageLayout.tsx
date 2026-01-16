import React from "react";
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useSidebarContext } from "./SidebarContext";
import { cn } from "@/lib/utils";

// Icons
import BellIcon from "@assets/icons/bell.svg?react";
import QuestionIcon from "@assets/icons/question.svg?react";
import SearchIcon from "@assets/icons/search.svg?react";

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
  margin-inline: 8px;
  background-color: #F3F4F6;
`;

const CircularIconButton1 = styled(IconButton)`
  background-color: transparent;
  width: 32px;
  height: 32px;
  padding: 6px;
  margin-inline: 8px;
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

const SidebarToggleIcon = ({ expanded, ...props }: { expanded: boolean } & React.SVGProps<SVGSVGElement>) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
        {...props}
    >
        <path
            d="M6.547 0.75V17.25M12.04 11.25L14.25 9M14.25 9L12.04 6.75M14.25 9H9.55M0.75 4.25C0.75 3.32174 1.11875 2.4315 1.77513 1.77513C2.4315 1.11875 3.32174 0.75 4.25 0.75H13.75C14.6783 0.75 15.5685 1.11875 16.2249 1.77513C16.8813 2.4315 17.25 3.32174 17.25 4.25V13.75C17.25 14.6783 16.8813 15.5685 16.2249 16.2249C15.5685 16.8813 14.6783 17.25 13.75 17.25H4.25C3.32174 17.25 2.4315 16.8813 1.77513 16.2249C1.11875 15.5685 0.75 14.6783 0.75 13.75V4.25Z"
            stroke="#666666"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface PageLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, sidebar }) => {
    const { sidebarExpanded, onToggleExpand } = useSidebarContext();
    const location = useLocation();
    const breadcrumbPath = getBreadcrumbPath(location.pathname);

    return (
        <div className="h-full flex flex-col pr-2 pb-[14px] overflow-hidden">
            {/* Main Card with Shadow and Border */}
            <div className="flex-1 flex flex-col bg-white border border-[#CCCCCC] rounded-[14px] overflow-hidden ">

                {/* Card Header (Breadcrumb) */}
                <div className="h-[50px] border-b border-[#CCCCCC] flex items-center justify-between bg-white flex-shrink-0 ">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <CircularIconButton1
                            onClick={() => onToggleExpand(!sidebarExpanded)}
                            style={{ flexShrink: 0 }}
                        >
                            <SidebarToggleIcon expanded={sidebarExpanded} />
                        </CircularIconButton1>

                        <div className="flex items-center mx-[8px] overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar">
                            {breadcrumbPath.map((label, index) => (
                                <React.Fragment key={index}>
                                    <span className={cn(
                                        "text-[16px] font-[500]",
                                        index === breadcrumbPath.length - 1 ? "text-[#333333]" : "text-[#717171]"
                                    )}>
                                        {label}
                                    </span>
                                    {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-centerflex-shrink-0 ml-4">
                        <CircularIconButton><SearchIcon width={16} height={16} /></CircularIconButton>
                        <CircularIconButton><QuestionIcon width={16} height={16} /></CircularIconButton>
                        <CircularIconButton><BellIcon width={16} height={16} /></CircularIconButton>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Optional Sidebar */}
                    {sidebar && (
                        <div className="w-[260px] flex-shrink-0 h-full overflow-y-auto bg-white pl-[18px] py-[18px] ">
                            {sidebar}
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className={cn(
                        "my-[18px] mr-4 flex-1 flex flex-col bg-white overflow-hidden border-[#CCCCCC] border ",
                        sidebar ? "rounded-tr-[14px] rounded-br-[14px]" : "rounded-[14px] ml-4"
                    )}>
                        <div className="flex-1 overflow-y-auto px-[18px] my-[18px] custom-scrollbar">
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
