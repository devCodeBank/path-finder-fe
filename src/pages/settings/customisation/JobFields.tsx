import React, { useMemo, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";
import { cn } from "@/lib/utils";
import { Button } from "@mui/material";

const primaryButtonSx = {
  height: "36px",
  backgroundColor: "#6E41E2",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  boxShadow: "none",
  width: "auto",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#7B52F4",
    boxShadow: "none",
  },
};
const outlineButtonSx = {
  height: "36px",
  borderColor: "#CCCCCC80",
  color: "#333333",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  width: "90px",
  boxShadow: "none",
  "&:hover": {
    borderColor: "#CCCCCC80",
    backgroundColor: "#F3F4F6",
    boxShadow: "none",
  },
};
type FieldRow = {
  id: string;
  label: string;
  type: string;
  visibility: boolean;
  required: boolean;
  extension: boolean;
};

type Section = {
  id: string;
  title: string;
  enabled: boolean;
  rows: FieldRow[];
};


const Toggle = ({
  enabled,
  onChange,
  ariaLabel,
  showLabel = false,
  label = ""
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
  showLabel?: boolean;
  label?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-3", showLabel ? "" : "")}>
      <button
        type="button"
        aria-pressed={enabled}
        aria-label={ariaLabel}
        onClick={(event) => {
          event.stopPropagation();
          onChange(!enabled);
        }}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 outline-none",
          enabled ? "bg-[#57CC4D]" : "bg-[#CCCCCC]"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
            enabled ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </button>
      {showLabel && (
        <span className="text-[13px] font-[400] text-[#333333]">{label}</span>
      )}
    </div>
  );
};

const Flag = ({
  checked,
  onChange,
  ariaLabel
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
}) => {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "h-[14px] w-[14px] rounded-[3px] border flex items-center justify-center",
        checked ? "bg-[#57CC4D] border-[#57CC4D]" : "bg-white border-[#D7D7D7]"
      )}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

const GripIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="2" height="2" fill="#666666" />
    <rect x="5" y="1" width="2" height="2" fill="#666666" />
    {/* <rect x="9" y="1" width="2" height="2" fill="#666666" /> */}
    <rect x="1" y="5" width="2" height="2" fill="#666666" />
    <rect x="5" y="5" width="2" height="2" fill="#666666" />
    {/* <rect x="9" y="5" width="2" height="2" fill="#666666" /> */}
    <rect x="1" y="9" width="2" height="2" fill="#666666" />
    <rect x="5" y="9" width="2" height="2" fill="#666666" />
    {/* <rect x="9" y="9" width="2" height="2" fill="#666666" /> */}
  </svg>
);



const LayoutHeader = ({
  title,

  onToggle,
  collapsed
}: {
  title: string;
  collapsed: boolean;

  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full h-[52px] px-4 flex items-center justify-between border border-[#E6E6E6] rounded-[4px] bg-[#FAFAFA] text-[14px] font-[500] text-[#333333]"
  >
    <span>{title}</span>
    {collapsed ? (
      <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
    ) : (
      <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
    )}
  </button>
);

const SectionCard = ({
  section,
  collapsed,
  onToggleSection,
  onToggleCollapse,
  onToggleRow
}: {
  section: Section;
  collapsed: boolean;
  onToggleSection: (sectionId: string, enabled: boolean) => void;
  onToggleCollapse: (sectionId: string) => void;
  onToggleRow: (sectionId: string, rowId: string, key: keyof FieldRow, value: boolean) => void;
}) => {
  return (
    <div className="bg-white  border-[#CCCCCC80] rounded-[4px] overflow-hidden">
      <div
        className="h-[52px] px-4 flex items-center justify-between rounded-[4px] border border-[#CCCCCC80] bg-[#FAFAFA] cursor-pointer"
        onClick={() => onToggleCollapse(section.id)}
      >
        <div className="flex items-center gap-2 text-[14px] text-[#333333] font-[500]">
          <span className="text-[#333333] ">{section.title}</span>
        </div>
        <div className="flex items-center gap-10">
          <Toggle
            enabled={section.enabled}
            onChange={(val) => onToggleSection(section.id, val)}
            ariaLabel={`Toggle ${section.title}`}
          />
          <button
            type="button"
            aria-label={`Edit ${section.title}`}
            className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
            onClick={(event) => event.stopPropagation()}
          >
            <EditOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />
          </button>
          <button
            type="button"
            aria-label={`Toggle ${section.title}`}
            className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
            onClick={(event) => {
              event.stopPropagation();
              onToggleCollapse(section.id);
            }}
          >
            {collapsed ? (
              <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
            ) : (
              <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
            )}
          </button>
        </div>
      </div>
      {!collapsed && (
        <>
          <div className="grid grid-cols-[32px_2.2fr_1.4fr_0.8fr_0.7fr_0.8fr] gap-2 px-4 py-2 text-[13px] font-[500] text-[#333333] border-[#CCCCCC80] bg-[#FFFFFF]">
            <span />
            <span></span>
            <span>Fields Type</span>
            <span className="text-center">Visibility</span>
            <span className="text-center">Required</span>
            <span className="text-center">Extension</span>
          </div>
          <div className="flex flex-col gap-2">
            {section.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[32px_2.2fr_1.4fr_0.8fr_0.7fr_0.8fr] gap-2 px-4 h-[44px] text-[13px] text-[#333333] items-center border border-[#E6E6E6] rounded-[4px] bg-white"
              >
                <div className="flex items-center justify-center">
                  <GripIcon />
                </div>
                <span className="font-[500] text-[13px]">{row.label}</span>
                <span className="text-[13px] font-[400] text-[#333333]/70">{row.type}</span>
                <div className="flex justify-center">
                  <Toggle
                    enabled={row.visibility}
                    onChange={(val) => onToggleRow(section.id, row.id, "visibility", val)}
                    ariaLabel={`Toggle visibility for ${row.label}`}
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.required}
                    onChange={(val) => onToggleRow(section.id, row.id, "required", val)}
                    ariaLabel={`Toggle required for ${row.label}`}
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.extension}
                    onChange={(val) => onToggleRow(section.id, row.id, "extension", val)}
                    ariaLabel={`Toggle extension for ${row.label}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const JobFields: React.FC = () => {
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "jobDetails",
        title: "Job Details",
        enabled: true,
        rows: [
          { id: "jobTitle", label: "Job Title", type: "Text", visibility: true, required: true, extension: false },
          { id: "jobType", label: "Job Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "jobCategory", label: "Job Category", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "jobIndustry", label: "Job Industry", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "jobLocationType", label: "Job Location Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "jobLevel", label: "Job Level", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "city", label: "City", type: "Text", visibility: true, required: false, extension: false },
          { id: "suburb", label: "Suburb", type: "Text", visibility: true, required: false, extension: false },
          { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: false },
          { id: "country", label: "Country", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "postalCode", label: "Postal Code", type: "Text", visibility: true, required: false, extension: false },
          { id: "minSalary", label: "Minimum Salary", type: "Currency", visibility: true, required: false, extension: false },
          { id: "maxSalary", label: "Maximum Salary", type: "Currency", visibility: true, required: false, extension: false },
          { id: "frequency", label: "Frequency", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "currency", label: "Currency", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "jobDescription", label: "Job Description", type: "Long Text", visibility: true, required: false, extension: false },
          { id: "educationalQualifications", label: "Educational Qualifications", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "skills", label: "Skills", type: "Multi-Tags", visibility: true, required: false, extension: false },
          { id: "jobApplicationQuestions", label: "Job Application Questions For Candidates", type: "Dynamic Form Builder", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "admin",
        title: "Admin",
        enabled: true,
        rows: [
          { id: "companyName", label: "Company Name", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "contactName", label: "Contact Name", type: "Link (Contact)", visibility: true, required: false, extension: false },
          { id: "contactEmail", label: "Contact Email", type: "Text (Email)", visibility: true, required: false, extension: false },
          { id: "contactPhone", label: "Contact Phone", type: "Text (Phone)", visibility: true, required: false, extension: false },
          { id: "noOfPositions", label: "No. of Positions", type: "Number", visibility: true, required: false, extension: false },
          { id: "hiringPipeline", label: "Hiring Pipeline", type: "Config Link", visibility: true, required: false, extension: false },
          { id: "targetDate", label: "Target Date", type: "Date", visibility: true, required: false, extension: false },
          { id: "minExperience", label: "Min. Experience", type: "Number", visibility: true, required: false, extension: false },
          { id: "maxExperience", label: "Max. Experience", type: "Number", visibility: true, required: false, extension: false },
          { id: "jobOpeningStatus", label: "Job Opening Status", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "jobOwner", label: "Job Owner", type: "User Link", visibility: true, required: false, extension: false },
          { id: "hiringManager", label: "Hiring Manager", type: "User Link", visibility: true, required: false, extension: false },
          { id: "interviewScorecard", label: "Interview Scorecard", type: "Config Link", visibility: true, required: false, extension: false },
          { id: "hiringTeamMembers", label: "Hiring Team Members", type: "Multi-User Link", visibility: true, required: false, extension: false },
          { id: "enableJobApplication", label: "Enable Job Application", type: "Toggle", visibility: true, required: false, extension: false }
        ]
      }
    ],
    []
  );

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [enforceRequiredOnExtension, setEnforceRequiredOnExtension] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [layoutOpen, setLayoutOpen] = useState<Record<string, boolean>>({
    jobDetails: true,
    admin: true
  });
  const [layoutForm, setLayoutForm] = useState({
    jobTitle: "",
    jobType: "",
    jobCategory: "",
    jobIndustry: "",
    jobLocationType: "",
    jobLevel: "",
    city: "",
    suburb: "",
    state: "",
    country: "",
    postalCode: "",
    minSalary: "",
    maxSalary: "",
    frequency: "",
    currency: "",
    educationalQualification: "",
    descriptionTemplate: "",
    aiAssist: "",
    jobDescription: "",
    skills: "",
    jobQuestions: "",
    jobId: "",
    jobStatus: "",
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    positions: "",
    hiringPipeline: "",
    targetDate: "",
    minExperience: "",
    maxExperience: "",
    jobOwner: "",
    hiringManager: "",
    interviewScorecard: "",
    enableJobApplication: false,
    hiringTeam: ""
  });
  const [showLayoutErrors, setShowLayoutErrors] = useState(false);

  const handleToggleSection = (sectionId: string, enabled: boolean) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, enabled } : section))
    );
  };

  const handleToggleRow = (
    sectionId: string,
    rowId: string,
    key: keyof FieldRow,
    value: boolean
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }
        return {
          ...section,
          rows: section.rows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
        };
      })
    );
  };

  const handleToggleCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleLayoutChange =
    (key: keyof typeof layoutForm) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setLayoutForm((prev) => ({ ...prev, [key]: value }));
      };
  const validateLayout = () => {
    if (!layoutForm.jobTitle.trim()) return false;
    if (!layoutForm.companyName.trim()) return false;
    return true;
  };

  const fieldsContent = (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="px-4 h-[52px] border-b border-[#CCCCCC80] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex flex-col">
            <span className="text-[14px] text-[#333333] font-[500]">Enforce required fields on extension</span>
            <button type="button" className="text-[13px] text-[#6E41E2] font-[400] hover:underline w-fit">
              Learn more
            </button>
          </div>
          <Toggle
            enabled={enforceRequiredOnExtension}
            onChange={setEnforceRequiredOnExtension}
            ariaLabel="Enforce required fields on extension"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            collapsed={Boolean(collapsedSections[section.id])}
            onToggleSection={handleToggleSection}
            onToggleCollapse={handleToggleCollapse}
            onToggleRow={handleToggleRow}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="h-[36px] px-4 rounded-[4px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const layoutContent = (
    <div className="flex flex-col gap-4 pt-4">
      <LayoutHeader
        title="Job Details"
        collapsed={!layoutOpen.jobDetails}
        onToggle={() => setLayoutOpen((p) => ({ ...p, jobDetails: !p.jobDetails }))}
      />
      {layoutOpen.jobDetails && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative flex flex-col pb-[14px]">
              <FloatingLabelInput
                label="Job Title"
                required
                placeholder="e.g., Full Stack Engineer"
                value={layoutForm.jobTitle}
                onChange={handleLayoutChange("jobTitle")}
                className={cn(showLayoutErrors && !layoutForm.jobTitle.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
              />
              {showLayoutErrors && !layoutForm.jobTitle.trim() && (
                <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                  *Job Title is required.
                </span>
              )}
            </div>
            <FloatingLabelSelect
              label="Job Type"
              placeholder="Select Job Type"
              options={[]}
              value={layoutForm.jobType}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobType: value }))}
            />
            <FloatingLabelSelect
              label="Job Category"
              placeholder="Select Job Category"
              options={[]}
              value={layoutForm.jobCategory}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobCategory: value }))}
            />
            <FloatingLabelSelect
              label="Job Industry"
              placeholder="Select Job Industry"
              options={[]}
              value={layoutForm.jobIndustry}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobIndustry: value }))}
            />
            <FloatingLabelSelect
              label="Job Location Type"
              placeholder="Select Job Location Type"
              options={[]}
              value={layoutForm.jobLocationType}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobLocationType: value }))}
            />
            <FloatingLabelSelect
              label="Job Level"
              placeholder="Select Job Level"
              options={[]}
              value={layoutForm.jobLevel}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobLevel: value }))}
            />
            <FloatingLabelInput
              label="City"
              placeholder="Search or Enter City"
              value={layoutForm.city}
              onChange={handleLayoutChange("city")}
            />
            <FloatingLabelInput
              label="Suburb"
              placeholder="Search or Enter Suburb"
              value={layoutForm.suburb}
              onChange={handleLayoutChange("suburb")}
            />
            <FloatingLabelInput
              label="State / Province"
              placeholder="Search or Enter State / Province"
              value={layoutForm.state}
              onChange={handleLayoutChange("state")}
            />
            <FloatingLabelInput
              label="Country"
              placeholder="Search or Enter Country"
              value={layoutForm.country}
              onChange={handleLayoutChange("country")}
            />
            <FloatingLabelInput
              label="Postal Code"
              placeholder="Search or Enter Postal Code"
              value={layoutForm.postalCode}
              onChange={handleLayoutChange("postalCode")}
            />
            <FloatingLabelInput
              label="Minimum Salary"
              placeholder="e.g., 80000"
              value={layoutForm.minSalary}
              onChange={handleLayoutChange("minSalary")}
            />
            <FloatingLabelInput
              label="Maximum Salary"
              placeholder="e.g., 100000"
              value={layoutForm.maxSalary}
              onChange={handleLayoutChange("maxSalary")}
            />
            <FloatingLabelSelect
              label="Frequency"
              placeholder="Select Salary Frequency"
              options={[]}
              value={layoutForm.frequency}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, frequency: value }))}
            />
            <FloatingLabelSelect
              label="Currency"
              placeholder="Select Salary Currency Type"
              options={[]}
              value={layoutForm.currency}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, currency: value }))}
            />
            <FloatingLabelInput
              label="Educational Qualification"
              placeholder="e.g., Bachelor of Computer Science"
              value={layoutForm.educationalQualification}
              onChange={handleLayoutChange("educationalQualification")}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <span className="text-[13px] font-[500] text-[#333333]">Job Description</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingLabelSelect
                label="Template"
                placeholder="Select a Job Description Template"
                options={[]}
                value={layoutForm.descriptionTemplate}
                onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, descriptionTemplate: value }))}
              />
              <div className="relative">
                <FloatingLabelInput
                  label="AI Assist"
                  placeholder="Create Job Description with AI"
                  className="pr-9"
                  value={layoutForm.aiAssist}
                  onChange={handleLayoutChange("aiAssist")}
                />
                <span className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-[#6E41E2]">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 3l1.5 3.5L15 8l-3.5 1.5L10 13l-1.5-3.5L5 8l3.5-1.5L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="border border-[#E6E6E6] rounded-[4px] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 h-[36px] border-b border-[#E6E6E6] text-[12px] text-[#333333]">
                <span className="font-[500]">B</span>
                <span className="italic">I</span>
                <span className="underline">U</span>
                <span className="mx-1 text-[#999999]">|</span>
                <span>Verdana</span>
                <span className="mx-1 text-[#999999]">|</span>
                <span>10</span>
                <span className="mx-1 text-[#999999]">|</span>
                <span>(1.2) Normal</span>
              </div>
              <textarea
                className="min-h-[220px] w-full px-3 py-2 text-[13px] text-[#333333] placeholder:text-[#999999] focus:outline-none"
                placeholder=""
                value={layoutForm.jobDescription}
                onChange={handleLayoutChange("jobDescription")}
              />
            </div>
          </div>

          <FloatingLabelInput
            label="Skills"
            placeholder="+ Add Skill"
            value={layoutForm.skills}
            onChange={handleLayoutChange("skills")}
          />

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-[500] text-[#333333]">Job Application Questions for Candidates</span>
            <FloatingLabelSelect
              label="Select Questions"
              placeholder="Do you have experience in a sales role?"
              options={[]}
              value={layoutForm.jobQuestions}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobQuestions: value }))}
            />
            <div className="flex items-center justify-between text-[13px] text-[#333333]">
              <span>What is your expected annual salary</span>
              <button type="button" className="text-[#999999]">�</button>
            </div>
          </div>
        </div>
      )}

      <LayoutHeader
        title="Admin"
        collapsed={!layoutOpen.admin}
        onToggle={() => setLayoutOpen((p) => ({ ...p, admin: !p.admin }))}
      />
      {layoutOpen.admin && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FloatingLabelInput
                label="Job ID"
                placeholder="System Generated ID"
                value={layoutForm.jobId}
                onChange={handleLayoutChange("jobId")}
                className="pr-9"
              />
              <span className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-[#999999]">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="4" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="relative">
              <FloatingLabelInput
                label="Job Status"
                placeholder="Default Draft"
                value={layoutForm.jobStatus}
                onChange={handleLayoutChange("jobStatus")}
                className="pr-9"
              />
              <span className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-[#999999]">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="4" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 flex flex-col pb-[14px]">
              <FloatingLabelInput
                label="Company Name"
                required
                placeholder="Select the company name you are hiring for"
                value={layoutForm.companyName}
                onChange={handleLayoutChange("companyName")}
                className={cn(showLayoutErrors && !layoutForm.companyName.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
              />
              {showLayoutErrors && !layoutForm.companyName.trim() && (
                <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                  *Company Name is required.
                </span>
              )}
            </div>
            <div className="md:pt-[14px]">
              <Button variant="contained" sx={primaryButtonSx}>
                Create New Company
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelSelect
              label="Contact Name"
              placeholder="Select Contact Name"
              options={[]}
              value={layoutForm.contactName}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactName: value }))}
            />
            <FloatingLabelInput
              label="Contact Email"
              placeholder="Contact Email"
              value={layoutForm.contactEmail}
              onChange={handleLayoutChange("contactEmail")}
            />
            <FloatingLabelInput
              label="Contact Phone"
              placeholder="Contact Phone Number"
              value={layoutForm.contactPhone}
              onChange={handleLayoutChange("contactPhone")}
            />
            <FloatingLabelInput
              label="No. of Positions"
              placeholder="e.g., 1"
              value={layoutForm.positions}
              onChange={handleLayoutChange("positions")}
            />
            <FloatingLabelSelect
              label="Hiring Pipeline"
              placeholder="Select Hiring Pipeline"
              options={[]}
              value={layoutForm.hiringPipeline}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, hiringPipeline: value }))}
            />
            <FloatingLabelInput
              label="Target Date"
              placeholder="e.g., 31/10/2025"
              value={layoutForm.targetDate}
              onChange={handleLayoutChange("targetDate")}
            />
            <FloatingLabelSelect
              label="Minimum Experience"
              placeholder="0 Years"
              options={[]}
              value={layoutForm.minExperience}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, minExperience: value }))}
            />
            <FloatingLabelSelect
              label="Maximum Experience"
              placeholder="0 Years"
              options={[]}
              value={layoutForm.maxExperience}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, maxExperience: value }))}
            />
            <FloatingLabelInput
              label="Job Owner"
              placeholder="Lead Recruiter for This Role"
              value={layoutForm.jobOwner}
              onChange={handleLayoutChange("jobOwner")}
            />
            <FloatingLabelInput
              label="Hiring Manager"
              placeholder="Search for Reporting Manager"
              value={layoutForm.hiringManager}
              onChange={handleLayoutChange("hiringManager")}
            />
            <FloatingLabelSelect
              label="Interview Scorecard"
              placeholder="e.g., Standard Engineering Template"
              options={[]}
              value={layoutForm.interviewScorecard}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, interviewScorecard: value }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-[500] text-[#333333]">Job Application Form</span>
            <div className="flex items-center gap-3">
              <Toggle
                enabled={layoutForm.enableJobApplication}
                onChange={(val) => setLayoutForm((prev) => ({ ...prev, enableJobApplication: val }))}
                ariaLabel="Enable Job Application Form"
              />
              <span className="text-[13px] text-[#333333]">Enable Job Application Form</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-[500] text-[#333333]">Add Hiring Team Members</span>
            <div className="text-[12px] text-[#666666]">Manage the hiring team involved with this position</div>
            <FloatingLabelSelect
              label="User / Team"
              placeholder="Select a User or Team"
              options={[]}
              value={layoutForm.hiringTeam}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, hiringTeam: value }))}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outlined"
          sx={outlineButtonSx}
          onClick={() => setShowLayoutErrors(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={primaryButtonSx}
          onClick={() => {
            if (!validateLayout()) {
              setShowLayoutErrors(true);
              return;
            }
            setShowLayoutErrors(false);
            console.warn("Add Job");
          }}
        >
          Add Job
        </Button>
      </div>
    </div>
  );



  return (
    <div className="flex flex-col w-full">

      <TabsComponent
        tabs={[
          { label: "Fields", value: "fields", content: fieldsContent },
          { label: "Layout", value: "layout", content: layoutContent }
        ]}
      />
    </div>
  );
};

export default JobFields;
