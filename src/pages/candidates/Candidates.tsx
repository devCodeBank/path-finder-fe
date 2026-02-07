import React, { useMemo, useRef, useState } from "react";
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
  width: "120px",
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

type EducationEntry = {
  id: string;
  institute: string;
  qualification: string;
  specialization: string;
  summary: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentlyPursuing: boolean;
};

type WorkEntry = {
  id: string;
  jobTitle: string;
  company: string;
  industry: string;
  employmentType: string;
  arrangementType: string;
  summary: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  currentHere: boolean;
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



const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 3V6M14 3V6M3 8.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

const TextAreaField = ({
  label,
  placeholder,
  value,
  onChange
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[14px] font-medium text-[#333333]/70">{label}</label>
    <textarea
      className="min-h-[90px] w-full rounded-[4px] border border-[#CCCCCC80] bg-white px-3 py-2 text-[13px] text-[#333333] placeholder:text-[#9E9E9E] hover:border-[#666666] focus:border-[#333333] focus:outline-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
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

export const Candidates: React.FC = () => {
  const birthDateRef = useRef<HTMLInputElement | null>(null);
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "personal",
        title: "Personal Details",
        enabled: true,
        rows: [
          { id: "firstName", label: "First Name*", type: "Text", visibility: true, required: true, extension: true },
          { id: "lastName", label: "Last Name", type: "Text", visibility: true, required: false, extension: true },
          { id: "email", label: "Email", type: "Text (Email)", visibility: true, required: false, extension: true },
          { id: "phone", label: "Phone Number", type: "Text (Phone)", visibility: true, required: false, extension: true },
          { id: "gender", label: "Gender", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "birthDate", label: "Birth Date", type: "Date", visibility: true, required: false, extension: false },
          { id: "address", label: "Full Address", type: "Text", visibility: true, required: false, extension: false },
          { id: "city", label: "City", type: "Text", visibility: true, required: true, extension: false },
          { id: "suburb", label: "Suburb", type: "Text", visibility: true, required: false, extension: true },
          { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: false },
          { id: "country", label: "Country", type: "Searchable Dropdown", visibility: true, required: false, extension: false },
          { id: "postal", label: "Postal Code", type: "Text (String)", visibility: true, required: false, extension: false },
          { id: "relocate", label: "Willing to Relocate", type: "Toggle", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "professional",
        title: "Professional Details",
        enabled: true,
        rows: [
          { id: "employer", label: "Current Employer", type: "Text", visibility: true, required: false, extension: true },
          { id: "jobTitle", label: "Current Job Title", type: "Text", visibility: true, required: false, extension: true },
          { id: "experience", label: "Experience in Years", type: "Number", visibility: true, required: false, extension: false },
          { id: "salaryCurrent", label: "Current Salary", type: "Currency", visibility: true, required: false, extension: false },
          { id: "salaryExpected", label: "Expected Salary", type: "Currency", visibility: true, required: false, extension: false },
          { id: "employmentStatus", label: "Employment Status", type: "Single Select Dropdown", visibility: true, required: false, extension: false },
          { id: "notice", label: "Notice Period", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "availableFrom", label: "Available From", type: "Date", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "education",
        title: "Educational Details",
        enabled: true,
        rows: [
          { id: "institute", label: "Institute / School", type: "Text", visibility: true, required: false, extension: false },
          { id: "qualification", label: "Educational Qualification", type: "Text", visibility: true, required: true, extension: true },
          { id: "specialisation", label: "Specialisation", type: "Text", visibility: true, required: false, extension: false },
          { id: "duration", label: "Duration", type: "Text", visibility: true, required: false, extension: false },
          { id: "pursuing", label: "Currently Pursuing", type: "Toggle", visibility: true, required: false, extension: false },
          { id: "summary", label: "Educational Summary", type: "Long Text", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "workHistory",
        title: "Work History",
        enabled: true,
        rows: [
          { id: "job", label: "Job Title", type: "Text", visibility: true, required: true, extension: false },
          { id: "company", label: "Company", type: "Text", visibility: true, required: false, extension: false },
          { id: "employmentType", label: "Employment Type", type: "Single Dropdown", visibility: true, required: false, extension: false },
          { id: "industry", label: "Industry", type: "Single Dropdown", visibility: true, required: false, extension: false },
          { id: "arrangement", label: "Work Arrangement Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "current", label: "I currently work here", type: "Toggle", visibility: true, required: false, extension: false },
          { id: "workDuration", label: "Work Duration", type: "Text", visibility: true, required: false, extension: false },
          { id: "workSummary", label: "Work Summary", type: "Long Text", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "resumeSkills",
        title: "Resume & Skills",
        enabled: true,
        rows: [
          { id: "resume", label: "Resume", type: "File", visibility: true, required: false, extension: true },
          { id: "skills", label: "Skills", type: "Text", visibility: true, required: false, extension: true }
        ]
      },
      {
        id: "social",
        title: "Social Links",
        enabled: true,
        rows: [
          { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "xprofile", label: "X Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "github", label: "Github Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "website", label: "Website", type: "Text (URL)", visibility: true, required: false, extension: true }
        ]
      },
      {
        id: "summary",
        title: "Candidate Summary",
        enabled: true,
        rows: []
      }
    ],
    []
  );

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [enforceRequiredOnExtension, setEnforceRequiredOnExtension] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [layoutOpen, setLayoutOpen] = useState<Record<string, boolean>>({
    personal: true,
    professional: true,
    education: false,
    work: false,
    resume: true,
    social: true
  });
  const [layoutForm, setLayoutForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    address: "",
    city: "",
    suburb: "",
    state: "",
    country: "",
    postalCode: "",
    willingToRelocate: false,
    currentEmployer: "",
    currentJobTitle: "",
    experienceYears: "",
    currentSalary: "",
    expectedSalary: "",
    employmentStatus: "",
    noticePeriod: "",
    availableFrom: "",
    skills: "",
    linkedin: "",
    facebook: "",
    xprofile: "",
    github: "",
    website: "",
    candidateSummary: ""
  });
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    {
      id: "edu-1",
      institute: "",
      qualification: "",
      specialization: "",
      summary: "",
      fromMonth: "",
      fromYear: "",
      toMonth: "",
      toYear: "",
      currentlyPursuing: false
    }
  ]);
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([
    {
      id: "work-1",
      jobTitle: "",
      company: "",
      industry: "",
      employmentType: "",
      arrangementType: "",
      summary: "",
      fromMonth: "",
      fromYear: "",
      toMonth: "",
      toYear: "",
      currentHere: false
    }
  ]);
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

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref.current) return;
    if (typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
    ref.current.focus();
  };

  const handleLayoutChange =
    (key: keyof typeof layoutForm) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setLayoutForm((prev) => ({ ...prev, [key]: value }));
      };

  const updateEducationEntry = (entryId: string, key: keyof EducationEntry, value: string | boolean) => {
    setEducationEntries((prev) =>
      prev.map((entry) => (entry.id === entryId ? { ...entry, [key]: value } : entry))
    );
  };

  const updateWorkEntry = (entryId: string, key: keyof WorkEntry, value: string | boolean) => {
    setWorkEntries((prev) =>
      prev.map((entry) => (entry.id === entryId ? { ...entry, [key]: value } : entry))
    );
  };

  const addEducationEntry = () => {
    const nextId = `edu-${educationEntries.length + 1}`;
    setEducationEntries((prev) => ([
      ...prev,
      {
        id: nextId,
        institute: "",
        qualification: "",
        specialization: "",
        summary: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        currentlyPursuing: false
      }
    ]));
    setLayoutOpen((prev) => ({ ...prev, education: true }));
  };

  const addWorkEntry = () => {
    const nextId = `work-${workEntries.length + 1}`;
    setWorkEntries((prev) => ([
      ...prev,
      {
        id: nextId,
        jobTitle: "",
        company: "",
        industry: "",
        employmentType: "",
        arrangementType: "",
        summary: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        currentHere: false
      }
    ]));
    setLayoutOpen((prev) => ({ ...prev, work: true }));
  };

  const removeEducationEntry = (entryId: string) => {
    setEducationEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const removeWorkEntry = (entryId: string) => {
    setWorkEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const validateLayout = () => {
    if (!layoutForm.firstName.trim()) return false;
    if (!layoutForm.city.trim()) return false;
    if (!layoutForm.currentEmployer.trim()) return false;
    if (!layoutForm.currentJobTitle.trim()) return false;
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
        title="Personal Information"
        collapsed={!layoutOpen.personal}
        onToggle={() => setLayoutOpen((p) => ({ ...p, personal: !p.personal }))}
      />
      {layoutOpen.personal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="First Name"
              required
              placeholder="e.g., John"
              value={layoutForm.firstName}
              onChange={handleLayoutChange("firstName")}
              className={cn(showLayoutErrors && !layoutForm.firstName.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.firstName.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *First Name is required.
              </span>
            )}
          </div>
          <FloatingLabelInput
            label="Last Name"
            placeholder="e.g., Doe"
            value={layoutForm.lastName}
            onChange={handleLayoutChange("lastName")}
          />
          <FloatingLabelInput
            label="Email"
            placeholder="e.g., john.doe@example.com"
            value={layoutForm.email}
            onChange={handleLayoutChange("email")}
          />
          <FloatingLabelInput
            label="Phone"
            placeholder="e.g., +1 555-0123"
            value={layoutForm.phone}
            onChange={handleLayoutChange("phone")}
          />
          <FloatingLabelSelect
            label="Gender"
            placeholder="Select Gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" }
            ]}
            value={layoutForm.gender}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, gender: value }))}
          />
          <div className="relative">
            <FloatingLabelInput
              label="Birth Date"
              placeholder="DD/MM/YYYY"
              className="pr-9"
              type="date"
              ref={birthDateRef}
              value={layoutForm.birthDate}
              onChange={handleLayoutChange("birthDate")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]/70"
              onClick={() => openDatePicker(birthDateRef)}
              aria-label="Select birth date"
            >
              <CalendarIcon />
            </button>
          </div>
          <div className="md:col-span-2">
            <FloatingLabelInput
              label="Full Address"
              placeholder="e.g., 123 Wall St, Apt 4B"
              value={layoutForm.address}
              onChange={handleLayoutChange("address")}
            />
          </div>
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="City"
              required
              placeholder="e.g., New York"
              value={layoutForm.city}
              onChange={handleLayoutChange("city")}
              className={cn(showLayoutErrors && !layoutForm.city.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.city.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *City is required.
              </span>
            )}
          </div>
          <FloatingLabelInput
            label="Suburb"
            placeholder="e.g., Brooklyn"
            value={layoutForm.suburb}
            onChange={handleLayoutChange("suburb")}
          />
          <FloatingLabelInput
            label="State/Province"
            placeholder="e.g., NY"
            value={layoutForm.state}
            onChange={handleLayoutChange("state")}
          />
          <FloatingLabelInput
            label="Country"
            placeholder="Search or Add Country"
            value={layoutForm.country}
            onChange={handleLayoutChange("country")}
          />
          <FloatingLabelInput
            label="Postal Code"
            placeholder="e.g., 10001"
            value={layoutForm.postalCode}
            onChange={handleLayoutChange("postalCode")}
          />
          <div className="flex items-end">
            <div className="flex items-center gap-3 h-[40px]">
              <span className="text-[14px] font-medium text-[#333333]/70">Willing to Relocate</span>
              <Toggle
                enabled={layoutForm.willingToRelocate}
                onChange={(val) => setLayoutForm((prev) => ({ ...prev, willingToRelocate: val }))}
                ariaLabel="Willing to relocate"
              />
            </div>
          </div>
        </div>
      )}

      <LayoutHeader
        title="Professional Details"
        collapsed={!layoutOpen.professional}
        onToggle={() => setLayoutOpen((p) => ({ ...p, professional: !p.professional }))}
      />
      {layoutOpen.professional && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="Current Employer"
              required
              placeholder="e.g., Acme Corp"
              value={layoutForm.currentEmployer}
              onChange={handleLayoutChange("currentEmployer")}
              className={cn(showLayoutErrors && !layoutForm.currentEmployer.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.currentEmployer.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Current Employer is required.
              </span>
            )}
          </div>
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="Current Job Title"
              required
              placeholder="e.g., Software Engineer"
              value={layoutForm.currentJobTitle}
              onChange={handleLayoutChange("currentJobTitle")}
              className={cn(showLayoutErrors && !layoutForm.currentJobTitle.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.currentJobTitle.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Current Job Title is required.
              </span>
            )}
          </div>
          <FloatingLabelInput
            label="Experience in Years"
            placeholder="e.g., 5"
            value={layoutForm.experienceYears}
            onChange={handleLayoutChange("experienceYears")}
          />
          <FloatingLabelInput
            label="Current Salary"
            placeholder="e.g., 85,000"
            value={layoutForm.currentSalary}
            onChange={handleLayoutChange("currentSalary")}
          />
          <FloatingLabelInput
            label="Expected Salary"
            placeholder="e.g., 95,000"
            value={layoutForm.expectedSalary}
            onChange={handleLayoutChange("expectedSalary")}
          />
          <FloatingLabelSelect
            label="Employment Status"
            placeholder="Select Status"
            options={[
              { value: "full-time", label: "Full Time" },
              { value: "part-time", label: "Part Time" },
              { value: "contract", label: "Contract" }
            ]}
            value={layoutForm.employmentStatus}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, employmentStatus: value }))}
          />
          <FloatingLabelInput
            label="Notice Period"
            placeholder="e.g., 4 weeks"
            value={layoutForm.noticePeriod}
            onChange={handleLayoutChange("noticePeriod")}
          />
          <div className="relative">
            <FloatingLabelInput
              label="Available from"
              placeholder="DD/MM/YYYY"
              className="pr-9"
              value={layoutForm.availableFrom}
              onChange={handleLayoutChange("availableFrom")}
            />
            <span className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-[#666666]">
              <CalendarIcon />
            </span>
          </div>
        </div>
      )}

      <LayoutHeader
        title="Educational Details"
        collapsed={!layoutOpen.education}
        onToggle={() => setLayoutOpen((p) => ({ ...p, education: !p.education }))}
      />
      {layoutOpen.education && (
        <div className="flex flex-col gap-4">
          {educationEntries.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-4 border border-[#E6E6E6] rounded-[4px] p-4 bg-white">
              <FloatingLabelInput
                label="Institute / School"
                placeholder="e.g., Stanford University"
                value={entry.institute}
                onChange={(e) => updateEducationEntry(entry.id, "institute", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Educational Qualification"
                    required
                    placeholder="Add Qualification"
                    value={entry.qualification}
                    onChange={(e) => updateEducationEntry(entry.id, "qualification", e.target.value)}
                    className={cn(showLayoutErrors && !entry.qualification.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
                  />
                  {showLayoutErrors && !entry.qualification.trim() && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Educational Qualification is required.
                    </span>
                  )}
                </div>
                <FloatingLabelInput
                  label="Specialisation"
                  placeholder="e.g., Computer Science"
                  value={entry.specialization}
                  onChange={(e) => updateEducationEntry(entry.id, "specialization", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-[#333333]/70">Duration</label>
                  <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-2">
                    <FloatingLabelSelect
                      label=""
                      placeholder="Month"
                      options={[]}
                      value={entry.fromMonth}
                      onValueChange={(value) => updateEducationEntry(entry.id, "fromMonth", value)}
                    />
                    <FloatingLabelSelect
                      label=""
                      placeholder="Year"
                      options={[]}
                      value={entry.fromYear}
                      onValueChange={(value) => updateEducationEntry(entry.id, "fromYear", value)}
                    />
                    <div className="flex items-center justify-center text-[12px] text-[#666666]">To</div>
                    <FloatingLabelSelect
                      label=""
                      placeholder="Month"
                      options={[]}
                      value={entry.toMonth}
                      onValueChange={(value) => updateEducationEntry(entry.id, "toMonth", value)}
                    />
                    <FloatingLabelSelect
                      label=""
                      placeholder="Year"
                      options={[]}
                      value={entry.toYear}
                      onValueChange={(value) => updateEducationEntry(entry.id, "toYear", value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-3 h-[40px]">
                    <span className="text-[14px] font-medium text-[#333333]/70">Currently pursuing</span>
                    <Toggle
                      enabled={entry.currentlyPursuing}
                      onChange={(val) => updateEducationEntry(entry.id, "currentlyPursuing", val)}
                      ariaLabel="Currently pursuing"
                    />
                  </div>
                </div>
              </div>
              <TextAreaField
                label="Summary"
                placeholder="Brief overview of your studies..."
                value={entry.summary}
                onChange={(e) => updateEducationEntry(entry.id, "summary", e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="h-[32px] px-4 rounded-[4px] bg-[#E4554A] text-white text-[12px] font-[500]"
                  onClick={() => removeEducationEntry(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="w-full h-[44px] border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
        onClick={addEducationEntry}
      >
        + Add Educational Details
      </button>

      <LayoutHeader
        title="Work History"
        collapsed={!layoutOpen.work}
        onToggle={() => setLayoutOpen((p) => ({ ...p, work: !p.work }))}
      />
      {layoutOpen.work && (
        <div className="flex flex-col gap-4">
          {workEntries.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-4 border border-[#E6E6E6] rounded-[4px] p-4 bg-white">
              <FloatingLabelInput
                label="Job Title"
                placeholder="e.g., Product Manager"
                value={entry.jobTitle}
                onChange={(e) => updateWorkEntry(entry.id, "jobTitle", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput
                  label="Company"
                  placeholder="e.g., Google"
                  value={entry.company}
                  onChange={(e) => updateWorkEntry(entry.id, "company", e.target.value)}
                />
                <FloatingLabelSelect
                  label="Employment Type"
                  placeholder="Select Employment Type"
                  options={[
                    { value: "full-time", label: "Full Time" },
                    { value: "part-time", label: "Part Time" },
                    { value: "contract", label: "Contract" }
                  ]}
                  value={entry.employmentType}
                  onValueChange={(value) => updateWorkEntry(entry.id, "employmentType", value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelSelect
                  label="Industry"
                  placeholder="Select Industry"
                  options={[]}
                  value={entry.industry}
                  onValueChange={(value) => updateWorkEntry(entry.id, "industry", value)}
                />
                <FloatingLabelSelect
                  label="Work Arrangement Type"
                  placeholder="Select Work Arrangement Type"
                  options={[
                    { value: "remote", label: "Remote" },
                    { value: "hybrid", label: "Hybrid" },
                    { value: "onsite", label: "Onsite" }
                  ]}
                  value={entry.arrangementType}
                  onValueChange={(value) => updateWorkEntry(entry.id, "arrangementType", value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-[#333333]/70">Duration</label>
                  <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-2">
                    <FloatingLabelSelect
                      label=""
                      placeholder="Month"
                      options={[]}
                      value={entry.fromMonth}
                      onValueChange={(value) => updateWorkEntry(entry.id, "fromMonth", value)}
                    />
                    <FloatingLabelSelect
                      label=""
                      placeholder="Year"
                      options={[]}
                      value={entry.fromYear}
                      onValueChange={(value) => updateWorkEntry(entry.id, "fromYear", value)}
                    />
                    <div className="flex items-center justify-center text-[12px] text-[#666666]">To</div>
                    <FloatingLabelSelect
                      label=""
                      placeholder="Month"
                      options={[]}
                      value={entry.toMonth}
                      onValueChange={(value) => updateWorkEntry(entry.id, "toMonth", value)}
                    />
                    <FloatingLabelSelect
                      label=""
                      placeholder="Year"
                      options={[]}
                      value={entry.toYear}
                      onValueChange={(value) => updateWorkEntry(entry.id, "toYear", value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-3 h-[40px]">
                    <span className="text-[14px] font-medium text-[#333333]/70">I currently work here</span>
                    <Toggle
                      enabled={entry.currentHere}
                      onChange={(val) => updateWorkEntry(entry.id, "currentHere", val)}
                      ariaLabel="Currently work here"
                    />
                  </div>
                </div>
              </div>
              <TextAreaField
                label="Summary"
                placeholder="Describe your responsibilities..."
                value={entry.summary}
                onChange={(e) => updateWorkEntry(entry.id, "summary", e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="h-[32px] px-4 rounded-[4px] bg-[#E4554A] text-white text-[12px] font-[500]"
                  onClick={() => removeWorkEntry(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="w-full h-[44px] border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
        onClick={addWorkEntry}
      >
        + Add Work History
      </button>

      <LayoutHeader
        title="Resume & Skills"
        collapsed={!layoutOpen.resume}
        onToggle={() => setLayoutOpen((p) => ({ ...p, resume: !p.resume }))}
      />
      {layoutOpen.resume && (
        <div className="flex flex-col gap-4">
          <div className="h-[140px] border border-dashed border-[#D6D6D6] rounded-[6px] flex flex-col items-center justify-center gap-2 text-center">
            <div className="h-[28px] w-[28px] text-[#666666]">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M14 4V18" stroke="#666666" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M9 9l5-5 5 5" stroke="#666666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="4" y="18" width="20" height="6" rx="2" stroke="#CCCCCC" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="text-[12px] text-[#333333] font-[500]">Upload Candidate Resume</div>
            <div className="text-[11px] text-[#666666]">
              Drag & Drop to upload document or <span className="text-[#6E41E2]">choose</span> file from your computer
            </div>
          </div>
          <div className="relative">
            <FloatingLabelInput
              label="Skills"
              placeholder="Search and Add"
              className="pr-9"
              value={layoutForm.skills}
              onChange={handleLayoutChange("skills")}
            />
            <span className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-[#666666]">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="#666666" strokeWidth="1.5" />
                <path d="M14 14l3 3" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
      )}

      <LayoutHeader
        title="Social Links"
        collapsed={!layoutOpen.social}
        onToggle={() => setLayoutOpen((p) => ({ ...p, social: !p.social }))}
      />
      {layoutOpen.social && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            label="LinkedIn"
            placeholder="http://www.linkedin.com/johndoe"
            value={layoutForm.linkedin}
            onChange={handleLayoutChange("linkedin")}
          />
          <FloatingLabelInput
            label="Facebook"
            placeholder="http://www.facebook.com/johndoe"
            value={layoutForm.facebook}
            onChange={handleLayoutChange("facebook")}
          />
          <FloatingLabelInput
            label="X"
            placeholder="http://www.x.com/johndoe"
            value={layoutForm.xprofile}
            onChange={handleLayoutChange("xprofile")}
          />
          <FloatingLabelInput
            label="Github"
            placeholder="http://github.com/johndoe"
            value={layoutForm.github}
            onChange={handleLayoutChange("github")}
          />
          <div className="md:col-span-2">
            <FloatingLabelInput
              label="Website"
              placeholder="http://www.example.com"
              value={layoutForm.website}
              onChange={handleLayoutChange("website")}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        className="w-full h-[44px] border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
        onClick={() => console.warn("Add Candidate Summary")}
      >
        + Add Candidate Summary
      </button>

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
          className="min-h-[140px] w-full px-3 py-2 text-[13px] text-[#333333] placeholder:text-[#999999] focus:outline-none"
          placeholder="Summary of professional profile..."
          value={layoutForm.candidateSummary}
          onChange={handleLayoutChange("candidateSummary")}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="h-[32px] px-4 rounded-[4px] bg-[#E4554A] text-white text-[12px] font-[500]"
          onClick={() => setLayoutForm((prev) => ({ ...prev, candidateSummary: "" }))}
        >
          Delete
        </button>
      </div>

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
            console.warn("Add Candidate");
          }}
        >

          Add Candidate
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

export default Candidates;
