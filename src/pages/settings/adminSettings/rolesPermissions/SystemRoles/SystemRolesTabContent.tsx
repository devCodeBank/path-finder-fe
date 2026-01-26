import React, { useMemo } from "react";

import admin from "../mockData/adminMockData.json";
import collaborator from "../mockData/collaboratorMockData.json";
import nameDescriptions from "../mockData/nameDescriptions.json";
import standardUser from "../mockData/standardUserMockData.json";
import superAdmin from "../mockData/superAdminMockData.json";

type ModuleEnum = "Everything" | "Team Only" | "Owned Only" | "Nothing";

interface ModulePermissions {
  name: string;
  canView: ModuleEnum | null;
  canCreate: boolean | null;
  canEdit: ModuleEnum | null;
  canDelete: ModuleEnum | null;
  changeOwnership: ModuleEnum | null;
  fileAccess: ModuleEnum | null;
}

type RoleSettingsRaw = {
  module: Record<string, ModulePermissions>;
  userSettings: { id: string; enabled: boolean }[];
  adminSettings: { id: string; enabled: boolean }[];
  jobSettings: { id: string; enabled: boolean }[];
  reports: { id: string; enabled: boolean; access?: string; accessOptions?: string[] }[];
  customization: { id: string; enabled: boolean }[];
  automation: { id: string; enabled: boolean }[];
  portalSettings: { id: string; enabled: boolean }[];
  dataAdmin: { id: string; enabled: boolean }[];
  developerSpace: { id: string; enabled: boolean }[];
  compliance: { id: string; enabled: boolean }[];
  pac: { id: string; enabled: boolean }[];
  generalPermissions: { id: string; enabled: boolean }[];
};

type PermissionItem = {
  label: string;
  enabled: boolean;
};

type SectionKey = Exclude<keyof RoleSettingsRaw, "module">;

const namesBySection = Object.keys(nameDescriptions as Record<string, unknown>).reduce(
  (acc, key) => {
    const items = (nameDescriptions as Record<string, { id: string; name: string; description: string }[]>)[key] || [];
    acc[key as SectionKey] = items.reduce<Record<string, { name: string; description: string }>>((map, item) => {
      map[item.id] = { name: item.name, description: item.description };
      return map;
    }, {});
    return acc;
  },
  {} as Record<SectionKey, Record<string, { name: string; description: string }>>,
);

const getRoleSettingsRaw = (tabName: string): RoleSettingsRaw => {
  const data =
    tabName === "super-admin"
      ? (superAdmin as unknown as RoleSettingsRaw)
      : tabName === "admin"
        ? (admin as unknown as RoleSettingsRaw)
        : tabName === "standard-user"
          ? (standardUser as unknown as RoleSettingsRaw)
          : (collaborator as unknown as RoleSettingsRaw);

  return JSON.parse(JSON.stringify(data)) as RoleSettingsRaw;
};

const isEnabled = (value: ModuleEnum | boolean | null | undefined) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  return value !== "Nothing";
};

const hasScope = (value: ModuleEnum | null | undefined, scope: "any" | "team" | "all") => {
  if (!value || value === "Nothing") return false;
  if (scope === "any") return true;
  if (scope === "team") return value === "Team Only" || value === "Everything";
  return value === "Everything";
};

const toLowerStart = (value: string) => `${value.charAt(0).toLowerCase()}${value.slice(1)}`;

const chunkItems = (items: PermissionItem[], size: number) => {
  const chunks: PermissionItem[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const Indicator: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <span
    className={[
      "inline-flex h-[16px] w-[16px] items-center justify-center rounded-[4px] border",
      enabled ? "border-transparent bg-[#57CC4D]/60" : "border-[#D9D9D9] bg-[#F3F4F6]",
    ].join(" ")}
    aria-hidden="true"
  >
    {enabled && (
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 5L4.5 8.5L11 1.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
);

const renderSectionRows = (items: PermissionItem[]) => {
  const pairs = chunkItems(items, 2);
  return (
    <>
      <div className="hidden md:block">
        {pairs.map((pair, index) => (
          <div
            key={`${pair[0]?.label ?? "row"}-${index}`}
            className="grid grid-cols-[2.2fr_24px_2.2fr_24px] gap-20 px-4 py-2 text-[13px] text-[#333333] border-t border-[#CCCCCC80] items-center"
          >
            <span className="truncate">{pair[0]?.label}</span>
            <div className="flex justify-center">{pair[0] && <Indicator enabled={pair[0].enabled} />}</div>
            <span className="truncate">{pair[1]?.label ?? ""}</span>
            <div className="flex justify-center">{pair[1] && <Indicator enabled={pair[1].enabled} />}</div>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="grid grid-cols-[1fr_24px] gap-2 px-4 py-2 text-[13px] text-[#333333] border-t border-[#CCCCCC80] items-center"
          >
            <span className="text-[13px] leading-[16px]">{item.label}</span>
            <div className="flex justify-center">
              <Indicator enabled={item.enabled} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const TabContent: React.FC<{ tabName: string }> = ({ tabName }) => {
  const roleSettingsRaw = useMemo(() => getRoleSettingsRaw(tabName), [tabName]);
  const getModule = (key: string): ModulePermissions | null => roleSettingsRaw.module[key] ?? null;
  const getEnabledFor = (key: SectionKey, id: string) =>
    Boolean((roleSettingsRaw[key] as { id: string; enabled: boolean }[]).find((row) => row.id === id)?.enabled);

  const moduleSections = useMemo(() => {
    const dashboard = getModule("dashboard");
    const candidates = getModule("candidates");
    const jobs = getModule("jobs");
    const companies = getModule("companies");
    const contacts = getModule("contacts");
    const deals = getModule("deals");
    const folders = getModule("folders");
    const activities = getModule("interviews");

    const sections: { title: string; items: PermissionItem[] }[] = [];

    if (dashboard) {
      const dashboardManageScope = dashboard.canEdit ?? dashboard.canView;
      sections.push({
        title: "Dashboards",
        items: [
          { label: "Can view dashboard module", enabled: hasScope(dashboard.canView, "any") },
          { label: "Can view own personal dashboard", enabled: hasScope(dashboard.canView, "any") },
          { label: "Can manage own personal dashboard", enabled: hasScope(dashboardManageScope, "any") },
          { label: "Can share own dashboard", enabled: hasScope(dashboardManageScope, "any") },
          { label: "Can view all dashboards", enabled: hasScope(dashboard.canView, "all") },
          { label: "Can view own team's dashboard", enabled: hasScope(dashboard.canView, "team") },
          { label: "Can manage team dashboards", enabled: hasScope(dashboardManageScope, "team") },
          { label: "Can view shared dashboards", enabled: hasScope(dashboard.canView, "any") },
        ],
      });
    }

    if (candidates) {
      sections.push({
        title: "Candidates",
        items: [
          { label: "Can view candidates module", enabled: hasScope(candidates.canView, "any") },
          { label: "Can view own candidates", enabled: hasScope(candidates.canView, "any") },
          { label: "Can create own candidates", enabled: isEnabled(candidates.canCreate) },
          { label: "Can edit own candidates", enabled: hasScope(candidates.canEdit, "any") },
          { label: "Can delete own candidates", enabled: hasScope(candidates.canDelete, "any") },
          { label: "Can change status of own candidates", enabled: hasScope(candidates.canEdit, "any") },
          { label: "Can submit candidates to client", enabled: hasScope(candidates.canEdit, "any") },
          { label: "Can parse candidates resume", enabled: isEnabled(candidates.canCreate) },
          { label: "Can access all files related to candidates", enabled: hasScope(candidates.fileAccess, "any") },
          { label: "Can view all candidates", enabled: hasScope(candidates.canView, "all") },
          { label: "Can view own team's candidates", enabled: hasScope(candidates.canView, "team") },
          { label: "Can edit all candidates", enabled: hasScope(candidates.canEdit, "all") },
          { label: "Can delete all candidates", enabled: hasScope(candidates.canDelete, "all") },
          { label: "Can transfer ownership of all candidates", enabled: hasScope(candidates.changeOwnership, "all") },
          { label: "Can change status of all candidates", enabled: hasScope(candidates.canEdit, "all") },
          { label: "Can transfer ownership of own candidates", enabled: hasScope(candidates.changeOwnership, "any") },
          { label: "Can assign candidates to a job", enabled: hasScope(candidates.canEdit, "any") },
        ],
      });
    }

    if (jobs) {
      sections.push({
        title: "Jobs",
        items: [
          { label: "Can view jobs module", enabled: hasScope(jobs.canView, "any") },
          { label: "Can view own jobs", enabled: hasScope(jobs.canView, "any") },
          { label: "Can create jobs", enabled: isEnabled(jobs.canCreate) },
          { label: "Can edit own jobs", enabled: hasScope(jobs.canEdit, "any") },
          { label: "Can delete own jobs", enabled: hasScope(jobs.canDelete, "any") },
          { label: "Can change status of own jobs", enabled: hasScope(jobs.canEdit, "any") },
          { label: "Can transfer ownership of own jobs", enabled: hasScope(jobs.changeOwnership, "any") },
          { label: "Can post job to free sites", enabled: isEnabled(jobs.canCreate) },
          { label: "View all jobs", enabled: hasScope(jobs.canView, "all") },
          { label: "Can view own Team's Jobs", enabled: hasScope(jobs.canView, "team") },
          { label: "Can edit all jobs", enabled: hasScope(jobs.canEdit, "all") },
          { label: "Can delete all jobs", enabled: hasScope(jobs.canDelete, "all") },
          { label: "Can change status of all jobs", enabled: hasScope(jobs.canEdit, "all") },
          { label: "Can transfer ownership of all jobs", enabled: hasScope(jobs.changeOwnership, "all") },
          { label: "Can post job in paid sites", enabled: isEnabled(jobs.canCreate) },
          { label: "Can access all files related to jobs", enabled: hasScope(jobs.fileAccess, "any") },
        ],
      });
    }

    if (companies) {
      sections.push({
        title: "Companies",
        items: [
          { label: "Can view companies module", enabled: hasScope(companies.canView, "any") },
          { label: "Can view own companies", enabled: hasScope(companies.canView, "any") },
          { label: "Can create companies", enabled: isEnabled(companies.canCreate) },
          { label: "Can edit own companies", enabled: hasScope(companies.canEdit, "any") },
          { label: "Can manage company duplicates", enabled: hasScope(companies.canEdit, "any") },
          { label: "Can transfer ownership of own companies", enabled: hasScope(companies.changeOwnership, "any") },
          { label: "Can view all companies", enabled: hasScope(companies.canView, "all") },
          { label: "Can edit all companies", enabled: hasScope(companies.canEdit, "all") },
          { label: "Can delete all companies", enabled: hasScope(companies.canDelete, "all") },
          { label: "Can delete own companies", enabled: hasScope(companies.canDelete, "any") },
          { label: "Can transfer ownership of all companies", enabled: hasScope(companies.changeOwnership, "all") },
          { label: "Can access all files related to companies", enabled: hasScope(companies.fileAccess, "any") },
        ],
      });
    }

    if (contacts) {
      sections.push({
        title: "Contacts",
        items: [
          { label: "Can view contacts module", enabled: hasScope(contacts.canView, "any") },
          { label: "Can view own contacts", enabled: hasScope(contacts.canView, "any") },
          { label: "Can create own contacts", enabled: isEnabled(contacts.canCreate) },
          { label: "Can edit own contacts", enabled: hasScope(contacts.canEdit, "any") },
          { label: "Can delete own contacts", enabled: hasScope(contacts.canDelete, "any") },
          { label: "Can view all contacts", enabled: hasScope(contacts.canView, "all") },
          { label: "Can edit all contacts", enabled: hasScope(contacts.canEdit, "all") },
          { label: "Can delete all contacts", enabled: hasScope(contacts.canDelete, "all") },
          { label: "Can manage contact duplicates", enabled: hasScope(contacts.canEdit, "all") },
          { label: "Can access all files related to contacts", enabled: hasScope(contacts.fileAccess, "any") },
        ],
      });
    }

    if (deals) {
      sections.push({
        title: "Deals",
        items: [
          { label: "Can view deals module", enabled: hasScope(deals.canView, "any") },
          { label: "Can view own deals", enabled: hasScope(deals.canView, "any") },
          { label: "Can create own deals", enabled: isEnabled(deals.canCreate) },
          { label: "Can edit own deals", enabled: hasScope(deals.canEdit, "any") },
          { label: "Can delete own deals", enabled: hasScope(deals.canDelete, "any") },
          { label: "Can transfer ownership of own deals", enabled: hasScope(deals.changeOwnership, "any") },
          { label: "Can access all files related to deals", enabled: hasScope(deals.fileAccess, "any") },
          { label: "Can view all deals", enabled: hasScope(deals.canView, "all") },
          { label: "Can view own teams deals", enabled: hasScope(deals.canView, "team") },
          { label: "Can edit all deals", enabled: hasScope(deals.canEdit, "all") },
          { label: "Can delete all deals", enabled: hasScope(deals.canDelete, "all") },
          { label: "Can transfer ownership of all deals", enabled: hasScope(deals.changeOwnership, "all") },
          { label: "Can manage invoicing", enabled: hasScope(deals.canEdit, "all") },
        ],
      });
    }

    if (folders) {
      sections.push({
        title: "Folders",
        items: [
          { label: "Can view folders module", enabled: hasScope(folders.canView, "any") },
          { label: "Can view own folders", enabled: hasScope(folders.canView, "any") },
          { label: "Can edit own folders", enabled: hasScope(folders.canEdit, "any") },
          { label: "Can delete own folders", enabled: hasScope(folders.canDelete, "any") },
          { label: "Can view all folders", enabled: hasScope(folders.canView, "all") },
          { label: "Can edit all folders", enabled: hasScope(folders.canEdit, "all") },
          { label: "Can view shared folders", enabled: hasScope(folders.canView, "any") },
        ],
      });
    }

    if (activities) {
      sections.push({
        title: "Activities",
        items: [
          { label: "Can view activities module", enabled: hasScope(activities.canView, "any") },
          { label: "Can view own activities", enabled: hasScope(activities.canView, "any") },
          { label: "Can schedule, edit, delete own interview", enabled: hasScope(activities.canEdit, "any") },
          { label: "Can schedule, edit, delete own meeting", enabled: hasScope(activities.canEdit, "any") },
          { label: "Can view all activities (system wide)", enabled: hasScope(activities.canView, "all") },
          { label: "Can view own team's activities", enabled: hasScope(activities.canView, "team") },
          { label: "Can add, edit, delete own note", enabled: isEnabled(activities.canCreate) },
          { label: "Can add, edit, delete own task", enabled: isEnabled(activities.canCreate) },
        ],
      });
    }

    return sections;
  }, [roleSettingsRaw]);

  const settingsSections = useMemo(() => {
    const getName = (key: SectionKey, id: string) => namesBySection[key]?.[id]?.name ?? id;
    const customizationIds = (roleSettingsRaw.customization || []).map((row) => row.id);
    const customizationItems = customizationIds.map((id) => ({
      id,
      label: `Can manage ${toLowerStart(getName("customization", id))}`,
    }));

    return [
      {
        title: "Reports",
        items: [
          { id: "teamPerformance", label: "Can manage team performance report" },
          { id: "timeToHire", label: "Can manage average time to fill report" },
          { id: "advancedAnalytics", label: "Can manage advanced analytics report" },
          { id: "recurringRevenue", label: "Can manage recurring revenue report" },
        ],
      },
      {
        title: "User Settings",
        items: [
          { id: "profile", label: "Can view own profile" },
          { id: "profile", label: "Can edit own profile" },
          { id: "notifications", label: "Can view own notifications settings" },
          { id: "notifications", label: "Can edit own notification settings" },
          { id: "privacySecurity", label: "Can view own privacy & security settings" },
          { id: "privacySecurity", label: "Can edit own privacy & security settings" },
          { id: "emailConfiguration", label: "Can configure own email account" },
          { id: "emailConfiguration", label: "Can remove own email account" },
          { id: "calendarConfiguration", label: "Can manage own calendar" },
          { id: "calendarConfiguration", label: "Can remove own calendar" },
          { id: "meetingAppsConfiguration", label: "Can configure meeting apps" },
          { id: "meetingAppsConfiguration", label: "Can remove meeting apps" },
        ],
      },
      {
        title: "Admin Settings",
        items: [
          { id: "adminSettings", label: "Can access admin settings" },
          { id: "users", label: "Can manage users" },
          { id: "rolesPermissions", label: "Can manage roles & permissions" },
          { id: "teams", label: "Can manage teams" },
          { id: "locations", label: "Can manage company details" },
          { id: "subscriptionBilling", label: "Can manage subscription & billing" },
          { id: "auditLog", label: "Can manage audit logs" },
        ],
      },
      {
        title: "Job Settings",
        items: [
          { id: "careerPage", label: "Can manage career page settings" },
          { id: "applicationForm", label: "Can manage application form settings" },
          { id: "quickApply", label: "Can manage quick apply settings" },
          { id: "jobBoards", label: "Can manage job boards settings" },
        ],
      },
      {
        title: "Configurations",
        items: customizationItems.length
          ? customizationItems
          : (roleSettingsRaw.customization || []).map((row) => ({
            id: row.id,
            label: `Can manage ${toLowerStart(getName("customization", row.id))}`,
          })),
      },
      {
        title: "Data Admin",
        items: [
          { id: "dataMigration", label: "Can manage data migration" },
          { id: "exportData", label: "Can export data to a spreadsheet" },
          { id: "recycleBin", label: "Can manage recycle bin" },
          { id: "bulkUpdateFields", label: "Can bulk update fields" },
          { id: "bulkDeleteFields", label: "Can bulk delete fields" },
        ],
      },
      {
        title: "Automation",
        items: [{ id: "emailTriggers", label: "Can manage email triggers" }],
      },
      {
        title: "Portal Settings",
        items: [{ id: "clientPortal", label: "Can manage client portal" }],
      },
      {
        title: "Developer Space",
        items: [{ id: "apis", label: "Can manage APIs token" }],
      },
      {
        title: "AI Assist",
        items: [
          {
            id: "pacAiAssist",
            label: "Can link OpenAI account with pathfinder ats crm to activate PAC AI Assist",
          },
        ],
      },
    ];
  }, [roleSettingsRaw]);

  const settingsSectionKeyMap: Record<string, SectionKey> = {
    Reports: "reports",
    "User Settings": "userSettings",
    "Admin Settings": "adminSettings",
    "Job Settings": "jobSettings",
    Configurations: "customization",
    "Data Admin": "dataAdmin",
    Automation: "automation",
    "Portal Settings": "portalSettings",
    "Developer Space": "developerSpace",
    "AI Assist": "pac",
  };

  return (
    <div className="flex flex-col gap-4  rounded-[4px] ">
      <p className="mt-3 pl-3 text-[13px] text-[#333333]/70">
        This role is system-defined and cannot be edited or deleted. If custom roles with specific permissions are required, a new role
        can be created.
      </p>

      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        {moduleSections.map((section, index) => (
          <div key={section.title}>
            <div
              className={[
                "bg-[#FAFAFA] h-[40px] px-4 flex items-center text-[14px] font-[500] text-[#333333]  border-[#CCCCCC80]",
                index > 0 ? "mt-6" : "",
              ].join(" ")}
            >
              {section.title}
            </div>
            <div className="border-b border-[#CCCCCC80]">
              {renderSectionRows(section.items)}
            </div>
          </div>
        ))}

        {settingsSections.map((section, index) => {
          const sectionKey = settingsSectionKeyMap[section.title];
          const items = section.items
            .map((item) => ({
              label: item.label,
              enabled: sectionKey ? getEnabledFor(sectionKey, item.id) : false,
            }))
            .filter((item) => item.label);
          if (!items.length) return null;
          return (
            <div key={section.title} className={index === 0 && moduleSections.length > 0 ? "mt-5" : ""}>
              <div className="bg-[#FAFAFA] h-[40px] px-4 flex items-center text-[14px] font-[500] text-[#333333] border-b border-[#CCCCCC80]">
                {section.title}
              </div>
              <div className={["border-b border-[#CCCCCC80]", index < settingsSections.length - 1 ? "mb-5" : ""].join(" ")}>
                {renderSectionRows(items)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabContent;
