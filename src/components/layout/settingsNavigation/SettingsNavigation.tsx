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
      // { id: "preferences", label: "Preferences", path: "/settings/user/preferences" },
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
      { id: "job-boards", label: "Job Boards", path: "/settings/job/job-boards" },
    ],
  },

  {
    id: "customisation",
    title: "Customisation",
    items: [
      { id: "candidate-fields", label: "Candidate Fields", path: "/settings/customisation/candidate-fields" },
      { id: "company-fields", label: "Company Fields", path: "/settings/customisation/company-fields" },
      { id: "contact-fields", label: "Contact Fields", path: "/settings/customisation/contact-fields" },
      { id: "job-fields", label: "Job Fields", path: "/settings/customisation/job-fields" },
      { id: "job-templates", label: "Job Templates", path: "/settings/customisation/job-templates" },
      { id: "job-status", label: "Job Status", path: "/settings/customisation/job-status" },
      { id: "email-templates", label: "Email Templates", path: "/settings/customisation/email-templates" },
      { id: "hiring-pipeline", label: "Hiring Pipeline", path: "/settings/customisation/hiring-pipeline" },
      { id: "deals-pipeline", label: "Deals Pipeline", path: "/settings/customisation/deals-pipeline" },
      { id: "deal-fields", label: "Deal Fields", path: "/settings/customisation/deal-fields" },
      { id: "contact-stage", label: "Contact Stage", path: "/settings/customisation/contact-stage" },
      { id: "meeting-type", label: "Meeting Type", path: "/settings/customisation/meeting-type" },
      { id: "note-type", label: "Note Type", path: "/settings/customisation/note-type" },
      { id: "task-type", label: "Task Type", path: "/settings/customisation/task-type" },
      { id: "interview-type", label: "Interview Type", path: "/settings/customisation/interview-type" },
      { id: "tags", label: "Tags", path: "/settings/customisation/tags" },
      { id: "skill-set", label: "Skill Set", path: "/settings/customisation/skill-set" },
    ],
  },

  {
    id: "automation",
    title: "Automation",
    items: [
      { id: "email-triggers", label: "Email Triggers", path: "/settings/automation/email-triggers" },
    ],
  },

  {
    id: "portal-settings",
    title: "Portal Settings",
    items: [
      { id: "client-portal", label: "Client Portal", path: "/settings/portal/client-portal" },
    ],
  },

  {
    id: "data-admin",
    title: "Data Admin",
    items: [
      { id: "data-migration", label: "Data Migration", path: "/settings/data/migration" },
      { id: "export-data", label: "Export Data", path: "/settings/data/export" },
      { id: "storage", label: "Storage", path: "/settings/data/storage" },
      { id: "recycle-bin", label: "Recycle Bin", path: "/settings/data/recycle-bin" },
    ],
  },

  {
    id: "developer-space",
    title: "Developer Space",
    items: [
      { id: "apis", label: "APIs", path: "/settings/developer/apis" },
    ],
  },

  {
    id: "compliance",
    title: "Compliance",
    items: [
      { id: "gdpr", label: "GDPR", path: "/settings/compliance/gdpr" },
    ],
  },

  {
    id: "ai-assist",
    title: "AI Assist",
    items: [
      { id: "pac", label: "PAC", path: "/settings/ai/pac" },
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
    <div className="w-full h-full bg-white border-t border-l border-b border-[#CCCCCC80] rounded-tl-[14px] rounded-bl-[14px] px-1 py-3 flex flex-col overflow-y-auto ">
      <div className="flex-1 flex flex-col gap-3">
        {navigationSections.map((section) => (
          <div key={section.id} className="px-1 flex flex-col gap-1.5">
            <h3 className="px-[8px] text-[#333333] text-[16px] font-[400] leading-[18px] py-[10px]">
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
                      ? 'bg-[#EAEAEA] text-[#666666]'
                      : 'bg-transparent text-[#666666] hover:bg-[#EAEAEA] hover:text-[#666666]'
                    }
                  `}
                >
                  <div className="text-[14px] leading-[18px] py-[10px] px-[10px] text-[#333333] font-[400]">
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

