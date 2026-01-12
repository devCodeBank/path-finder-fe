import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      { id: "preferences", label: "Preferences", path: "/settings/user/preferences" },
      { id: "activity-history", label: "Activity History", path: "/settings/user/activity-history" },
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
      { id: "billing", label: "Subscription & Billing", path: "/settings/admin/billing" },
      { id: "audit-log", label: "Audit Log", path: "/settings/admin/audit-log" },
    ],
  },
  {
    id: "job-settings",
    title: "Job Settings",
    items: [
      { id: "career-page", label: "Career Page", path: "/settings/job/career-page" },
      { id: "application-form", label: "Application Form", path: "/settings/job/application-form" },
    ],
  },
];

export const SettingsNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="w-full h-full bg-white border-t border-l border-b border-[#CCCCCC] rounded-tl-[20px] rounded-bl-[20px] px-1 py-4 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] shadow-[0px_4px_4px_0px_#00000014]">
      <div className="flex-1 flex flex-col gap-4">
        {navigationSections.map((section) => (
          <div key={section.id} className="px-1 flex flex-col gap-1">
            <h3 className=" pb-2 px-2 text-gray-800 text-[#333333] text-[16px] font-[500]">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const isSelected = isPathActive(item.path);
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  className={`
                    cursor-pointer transition-all duration-200 rounded-md
                    ${isSelected
                      ? 'bg-[#EAEAEA] text-[#333333] '
                      : 'bg-transparent text-[#333333] hover:bg-[#EAEAEA] hover:text-[#333333]'
                    }
                  `}
                >
                  <div className={`text-[14px] py-2 px-2 text-[#333333] font-[400]`}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsNavigation;
