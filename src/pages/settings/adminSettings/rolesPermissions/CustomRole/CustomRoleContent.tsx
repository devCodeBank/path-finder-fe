import { Button } from "@mui/material";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type PermissionSection = {
  title: string;
  items: string[];
};

const sections: PermissionSection[] = [
  {
    title: "Dashboards",
    items: [
      "Can view dashboard module",
      "Can view own personal dashboard",
      "Can manage own personal dashboard",
      "Can share own dashboard",
      "Can view all dashboards",
      "Can view own team's dashboard",
      "Can manage team dashboards",
      "Can view shared dashboards",
    ],
  },
  {
    title: "Candidates",
    items: [
      "Can view candidates module",
      "Can view own candidates",
      "Can create own candidates",
      "Can edit own candidates",
      "Can delete own candidates",
      "Can change status of own candidates",
      "Can submit candidates to client",
      "Can parse candidates resume",
      "Can access all files related to candidates",
      "Can view all candidates",
      "Can view own team's candidates",
      "Can edit all candidates",
      "Can delete all candidates",
      "Can transfer ownership of all candidates",
      "Can change status of all candidates",
      "Can transfer ownership of own candidates",
      "Can assign candidates to a job",
    ],
  },
  {
    title: "Jobs",
    items: [
      "Can view jobs module",
      "Can view own jobs",
      "Can create jobs",
      "Can edit own jobs",
      "Can delete own jobs",
      "Can change status of own jobs",
      "Can transfer ownership of own jobs",
      "Can post job to free sites",
      "View all jobs",
      "Can view own Team's Jobs",
      "Can edit all jobs",
      "Can delete all jobs",
      "Can change status of all jobs",
      "Can transfer ownership of all jobs",
      "Can post job in paid sites",
      "Can access all files related to jobs",
    ],
  },
  {
    title: "Companies",
    items: [
      "Can view companies module",
      "Can view own companies",
      "Can create companies",
      "Can edit own companies",
      "Can manage company duplicates",
      "Can transfer ownership of own companies",
      "Can view all companies",
      "Can edit all companies",
      "Can delete all companies",
      "Can delete own companies",
      "Can transfer ownership of all companies",
      "Can access all files related to companies",
    ],
  },
  {
    title: "Contacts",
    items: [
      "Can view contacts module",
      "Can view own contacts",
      "Can create own contacts",
      "Can edit own contacts",
      "Can delete own contacts",
      "Can view all contacts",
      "Can edit all contacts",
      "Can delete all contacts",
      "Can manage contact duplicates",
      "Can access all files related to contacts",
    ],
  },
  {
    title: "Deals",
    items: [
      "Can view deals module",
      "Can view own deals",
      "Can create own deals",
      "Can edit own deals",
      "Can delete own deals",
      "Can transfer ownership of own deals",
      "Can access all files related to deals",
      "Can view all deals",
      "Can view own teams deals",
      "Can edit all deals",
      "Can delete all deals",
      "Can transfer ownership of all deals",
      "Can manage invoicing",
    ],
  },
  {
    title: "Folders",
    items: [
      "Can view folders module",
      "Can view own folders",
      "Can edit own folders",
      "Can delete own folders",
      "Can view all folders",
      "Can edit all folders",
      "Can view shared folders",
    ],
  },
  {
    title: "Reports",
    items: [
      "Can manage team performance report",
      "Can manage average time to fill report",
      "Can manage advanced analytics report",
      "Can manage recurring revenue report",
    ],
  },
  {
    title: "Activities",
    items: [
      "Can view activities module",
      "Can view own activities",
      "Can schedule, edit, delete own interview",
      "Can schedule, edit, delete own meeting",
      "Can view all activities (system wide)",
      "Can view own team's activities",
      "Can add, edit, delete own note",
      "Can add, edit, delete own task",
    ],
  },
  {
    title: "User Settings",
    items: [
      "Can view own profile",
      "Can edit own profile",
      "Can view own notifications settings",
      "Can edit own notification settings",
      "Can view own privacy & security settings",
      "Can edit own privacy & security settings",
      "Can configure own email account",
      "Can remove own email account",
      "Can manage own calendar",
      "Can remove own calendar",
      "Can configure meeting apps",
      "Can remove meeting apps",
      "Can view own preferences",
      "Can edit own preferences",
      "Can view own activity history",
    ],
  },
  {
    title: "Admin Settings",
    items: [
      "Can access admin settings",
      "Can manage users",
      "Can manage roles & permissions",
      "Can manage teams",
      "Can manage company details",
      "Can manage subscription & billing",
      "Can manage audit logs",
    ],
  },
  {
    title: "Job Settings",
    items: [
      "Can manage career page settings",
      "Can manage application form settings",
      "Can manage quick apply settings",
      "Can manage job boards settings",
    ],
  },
  {
    title: "Configurations",
    items: [
      "Can manage candidate fields",
      "Can manage contact fields",
      "Can manage contact stage",
      "Can manage company fields",
      "Can manage job fields",
      "Can manage job status",
      "Can manage job templates",
      "Can manage hiring pipeline",
      "Can manage deals pipeline",
      "Can manage deals fields",
      "Can manage meeting type",
      "Can manage task type",
      "Can manage tags",
      "Can manage skill set",
    ],
  },
  {
    title: "Data Admin",
    items: [
      "Can manage data migration",
      "Can export data to a spreadsheet",
      "Can bulk delete fields",
      "Can manage recycle bin",
    ],
  },
  {
    title: "Automation",
    items: ["Can manage email triggers"],
  },
  {
    title: "Portal Settings",
    items: ["Can manage client portal"],
  },
  {
    title: "Developer Space",
    items: ["Can manage APIs token"],
  },
  {
    title: "AI Assist",
    items: ["Can link OpenAI account with pathfinder ats crm to activate PAC AI Assist"],
  },
];

const chunkItems = (items: string[], size: number) => {
  const chunks: string[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const renderSectionRows = (
  sectionTitle: string,
  items: string[],
  checkedItems: Record<string, boolean>,
  onToggle: (key: string) => void
) => {
  const pairs = chunkItems(items, 2);
  return (
    <>
      <div className="hidden md:block">
        {pairs.map((pair, index) => (
          <div
            key={`${pair[0]}-${index}`}
            className="grid grid-cols-[2.2fr_0.3fr_2.2fr_0.3fr] gap-10 px-4 py-2 text-[13px] text-[#333333] border-t border-[#CCCCCC80] items-center"
          >
            <span className="truncate">{pair[0]}</span>
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={checkedItems[`${sectionTitle}:${pair[0]}`] ?? false}
                onChange={() => onToggle(`${sectionTitle}:${pair[0]}`)}
                aria-label={pair[0]}
                className="sr-only"
              />
              <span
                className={cn(
                  "h-[16px] w-[16px] rounded-[4px] border border-[#CCCCCC80] flex items-center justify-center cursor-pointer",
                  checkedItems[`${sectionTitle}:${pair[0]}`] && "bg-[#57CC4D] border-[#57CC4D]"
                )}
                onClick={() => onToggle(`${sectionTitle}:${pair[0]}`)}
              >
                {checkedItems[`${sectionTitle}:${pair[0]}`] && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5L4.5 8.5L11 1.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </div>
            <span className="truncate">{pair[1] ?? ""}</span>
            <div className="flex justify-center">
              {pair[1] ? (
                <>
                  <input
                    type="checkbox"
                    checked={checkedItems[`${sectionTitle}:${pair[1]}`] ?? false}
                    onChange={() => onToggle(`${sectionTitle}:${pair[1]}`)}
                    aria-label={pair[1]}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "h-[16px] w-[16px]  rounded-[4px] border border-[#CCCCCC80] flex items-center justify-center cursor-pointer",
                      checkedItems[`${sectionTitle}:${pair[1]}`] && "bg-[#57CC4D] border-[#57CC4D]"
                    )}
                    onClick={() => onToggle(`${sectionTitle}:${pair[1]}`)}
                  >
                    {checkedItems[`${sectionTitle}:${pair[1]}`] && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="grid grid-cols-[1fr_24px] gap-10 px-4 py-2 text-[13px] text-[#333333] border-t border-[#CCCCCC80] items-center"
          >
            <span className="text-[13px] leading-[16px]">{item}</span>
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={checkedItems[`${sectionTitle}:${item}`] ?? false}
                onChange={() => onToggle(`${sectionTitle}:${item}`)}
                aria-label={item}
                className="sr-only"
              />
              <span
                className={cn(
                  "h-[16px] w-[16px] rounded-[4px] border border-[#CCCCCC80] flex items-center justify-center cursor-pointer",
                  checkedItems[`${sectionTitle}:${item}`] && "bg-[#57CC4D] border-[#57CC4D]"
                )}
                onClick={() => onToggle(`${sectionTitle}:${item}`)}
              >
                {checkedItems[`${sectionTitle}:${item}`] && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5L4.5 8.5L11 1.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const CustomRoleContent: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-4  rounded-[4px]">
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        {sections.map((section, index) => (
          <div key={section.title}>
            <div
              className={[
                "bg-[#FAFAFA] h-[40px] px-4 flex items-center text-[14px] font-[500] text-[#333333] ",
                index > 0 ? "mt-6" : "",
              ].join(" ")}
            >
              {section.title}
            </div>
            <div className="border-b border-[#CCCCCC80]">
              {renderSectionRows(section.title, section.items, checkedItems, handleToggle)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CustomRoleContent;
