import React, { useMemo, useRef, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";
import { cn } from "@/lib/utils";
import { Tooltip } from "@mui/material";
import CloseXIcon from "@assets/icons/close-pop-up.svg";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// const primaryButtonSx = {
//   height: "36px",
//   backgroundColor: "#6E41E2",
//   textTransform: "none",
//   fontSize: "12px",
//   fontWeight: 500,
//   borderRadius: "4px",
//   boxShadow: "none",
//   width: "120px",
//   color: "#FFFFFF",
//   "&:hover": {
//     backgroundColor: "#7B52F4",
//     boxShadow: "none",
//   },
// };
// const outlineButtonSx = {
//   height: "36px",
//   borderColor: "#CCCCCC80",
//   color: "#333333",
//   textTransform: "none",
//   fontSize: "12px",
//   fontWeight: 500,
//   borderRadius: "4px",
//   width: "90px",
//   boxShadow: "none",
//   "&:hover": {
//     borderColor: "#CCCCCC80",
//     backgroundColor: "#F3F4F6",
//     boxShadow: "none",
//   },
// };
type FieldRow = {
  id: string;
  label: string;
  type: string;
  visibility: boolean;
  required: boolean;
  extension: boolean;
  visibilityLocked?: boolean;
  requiredLocked?: boolean;
  extensionLocked?: boolean;
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
  label = "",
  disabled = false
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
  showLabel?: boolean;
  label?: string;
  disabled?: boolean;
}) => {
  return (
    <div className={cn("flex items-center gap-3", showLabel ? "" : "")}>
      <button
        type="button"
        aria-pressed={enabled}
        aria-label={ariaLabel}
        onClick={(event) => {
          if (disabled) return;
          event.stopPropagation();
          onChange(!enabled);
        }}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 outline-none",
          enabled ? "bg-[#57CC4D]" : "bg-[#CCCCCC]",
          disabled ? "opacity-60 cursor-not-allowed" : ""
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
  ariaLabel,
  disabled = false
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={(event) => {
        if (disabled) return;
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "h-[14px] w-[14px] cursor-pointer rounded-[3px] border flex items-center justify-center",
        checked ? "bg-[#57CC4D] border-[#57CC4D]" : "bg-white border-[#D7D7D7]",
        disabled ? "opacity-60 cursor-not-allowed" : ""
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
  <div className="w-full h-[52px] px-4 flex items-center justify-between  border-[#E6E6E6] rounded-[4px] bg-[#F9FAFB] text-[14px] font-[500] text-[#333333]">
    <span>{title}</span>
    <button
      type="button"
      aria-label={`Toggle ${title}`}
      aria-expanded={!collapsed}
      onClick={onToggle}
      className="h-[24px] w-[24px] cursor-pointer flex items-center justify-center rounded-[4px] hover:bg-[#F3F4F6]"
    >
      {collapsed ? (
        <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
      ) : (
        <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
      )}
    </button>
  </div>
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
  draggableTitle,
  onDragStartTitle,
  onDragEndTitle,
  onDropSection,
  onDragOverSection,
  onEditTitle,
  onDragStartRow,
  onDragEndRow,
  onDragOverRow,
  onDropRow,
  onToggleSection,
  onToggleCollapse,
  onToggleRow
}: {
  section: Section;
  collapsed: boolean;
  draggableTitle: boolean;
  onDragStartTitle: (sectionId: string, event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEndTitle: () => void;
  onDropSection: (sectionId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onDragOverSection: (event: React.DragEvent<HTMLDivElement>) => void;
  onEditTitle: (section: Section) => void;
  onDragStartRow: (
    sectionId: string,
    rowId: string,
    event: React.DragEvent<HTMLButtonElement>
  ) => void;
  onDragEndRow: () => void;
  onDragOverRow: (sectionId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onDropRow: (
    sectionId: string,
    rowId: string,
    event: React.DragEvent<HTMLDivElement>
  ) => void;
  onToggleSection: (sectionId: string, enabled: boolean) => void;
  onToggleCollapse: (sectionId: string) => void;
  onToggleRow: (sectionId: string, rowId: string, key: keyof FieldRow, value: boolean) => void;
}) => {
  return (
    <div className="bg-white  border-[#CCCCCC80] rounded-[4px] overflow-hidden">
      <div
        className="h-[52px] px-4 flex items-center justify-between rounded-[4px]  border-[#CCCCCC80] bg-[#F9FAFB]"
        data-drag-section="true"
        onDragOver={onDragOverSection}
        onDrop={(event) => onDropSection(section.id, event)}
      >
        <div className="flex items-center gap-2 text-[14px] text-[#333333] font-[500]">
          {draggableTitle && (
            <button
              type="button"
              draggable
              aria-label={`Reorder ${section.title}`}
              className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px]  border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6] cursor-grab active:cursor-grabbing"
              onDragStart={(event) => onDragStartTitle(section.id, event)}
              onDragEnd={onDragEndTitle}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <GripIcon />
            </button>
          )}
          <span className="text-[#333333] ">{section.title}</span>
        </div>
        <div className="flex items-center gap-10">
          {section.title !== "Personal Details" && (
            <Toggle
              enabled={section.enabled}
              onChange={(val) => onToggleSection(section.id, val)}
              ariaLabel={`Toggle ${section.title}`}
            />
          )}
          <Tooltip
            title="Edit Section Name"
            arrow
            placement="left"
            componentsProps={{
              tooltip: { sx: { bgcolor: "#797979" } },
              arrow: { sx: { color: "#797979" } },
              popper: { sx: { zIndex: 2400 } },
            }}
          >
            <button
              type="button"
              aria-label={`Edit ${section.title}`}
              className="h-[24px] w-[24px] cursor-pointer flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#EAAEAEA]"
              onClick={(event) => {
                event.stopPropagation();
                onEditTitle(section);
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />
            </button>
          </Tooltip>
          <button
            type="button"
            aria-label={`Toggle ${section.title}`}
            className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6] cursor-pointer"
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
                data-drag-row="true"
                onDragOver={(event) => onDragOverRow(section.id, event)}
                onDrop={(event) => onDropRow(section.id, row.id, event)}
              >
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    draggable
                    aria-label={`Reorder ${row.label}`}
                    className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px]  border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6] cursor-grab active:cursor-grabbing"
                    onDragStart={(event) => onDragStartRow(section.id, row.id, event)}
                    onDragEnd={onDragEndRow}
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <GripIcon />
                  </button>
                </div>
                <span className="font-[500] text-[13px]">{row.label}</span>
                <span className="text-[13px] font-[400] text-[#333333]/70">{row.type}</span>
                <div className="flex justify-center">
                  <Toggle
                    enabled={row.visibility}
                    onChange={(val) => onToggleRow(section.id, row.id, "visibility", val)}
                    ariaLabel={`Toggle visibility for ${row.label}`}
                    disabled={Boolean(row.visibilityLocked)}
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.required}
                    onChange={(val) => onToggleRow(section.id, row.id, "required", val)}
                    ariaLabel={`Toggle required for ${row.label}`}
                    disabled={Boolean(row.requiredLocked)}
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.extension}
                    onChange={(val) => onToggleRow(section.id, row.id, "extension", val)}
                    ariaLabel={`Toggle extension for ${row.label}`}
                    disabled={Boolean(row.extensionLocked)}
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
  const availableFromRef = useRef<HTMLInputElement | null>(null);
  const monthOptions = useMemo(
    () => [
      { value: "01", label: "Jan" },
      { value: "02", label: "Feb" },
      { value: "03", label: "Mar" },
      { value: "04", label: "Apr" },
      { value: "05", label: "May" },
      { value: "06", label: "Jun" },
      { value: "07", label: "Jul" },
      { value: "08", label: "Aug" },
      { value: "09", label: "Sep" },
      { value: "10", label: "Oct" },
      { value: "11", label: "Nov" },
      { value: "12", label: "Dec" }
    ],
    []
  );
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const earliestYear = currentYear - 60;
    const latestYear = currentYear + 5;
    const options = [];
    for (let year = latestYear; year >= earliestYear; year -= 1) {
      const value = String(year);
      options.push({ value, label: value });
    }
    return options;
  }, []);
  const summaryModules = useMemo(
    () => ({
      toolbar: [
        [{ font: [] }, { size: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }, { direction: "rtl" }],
        ["link", "image", "video"],
        ["clean"]
      ]
    }),
    []
  );
  const summaryFormats = useMemo(
    () => [
      "font",
      "size",
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "color",
      "background",
      "script",
      "align",
      "list",
      "indent",
      "direction",
      "link",
      "image",
      "video"
    ],
    []
  );
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "personal",
        title: "Personal Details",
        enabled: true,
        rows: [
          {
            id: "firstName",
            label: "First Name*",
            type: "Text",
            visibility: true,
            required: true,
            extension: true,
            visibilityLocked: true,
            requiredLocked: true,
            extensionLocked: true
          },
          { id: "lastName", label: "Last Name", type: "Text", visibility: true, required: false, extension: true, extensionLocked: true },
          { id: "email", label: "Email", type: "Text (Email)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "phone", label: "Phone Number", type: "Text (Phone)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "gender", label: "Gender", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "birthDate", label: "Birth Date", type: "Date", visibility: true, required: false, extension: false },
          { id: "address", label: "Full Address", type: "Text", visibility: true, required: false, extension: false },
          { id: "city", label: "City", type: "Text", visibility: true, required: true, extension: false },
          { id: "suburb", label: "Suburb", type: "Text", visibility: true, required: false, extension: true, extensionLocked: true },
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
          { id: "employer", label: "Current Employer", type: "Text", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "jobTitle", label: "Current Job Title", type: "Text", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
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
          { id: "qualification", label: "Educational Qualification", type: "Text", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true },
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
          { id: "job", label: "Job Title", type: "Text", visibility: true, required: true, extension: false, visibilityLocked: true, requiredLocked: true },
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
          { id: "resume", label: "Resume", type: "File", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "skills", label: "Skills", type: "Text", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true }
        ]
      },
      {
        id: "social",
        title: "Social Links",
        enabled: true,
        rows: [
          { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "xprofile", label: "X Profile", type: "Text (URL)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "github", label: "Github Profile", type: "Text (URL)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true },
          { id: "website", label: "Website", type: "Text (URL)", visibility: true, required: false, extension: true, visibilityLocked: true, extensionLocked: true }
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
  const [layoutRowState, setLayoutRowState] = useState<Record<string, Record<string, FieldRow>>>(() => {
    const state: Record<string, Record<string, FieldRow>> = {};
    initialSections.forEach((section) => {
      state[section.id] = {};
      section.rows.forEach((row) => {
        state[section.id][row.id] = row;
      });
    });
    return state;
  });
  const [enforceRequiredOnExtension, setEnforceRequiredOnExtension] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [layoutOpen, setLayoutOpen] = useState<Record<string, boolean>>({
    personal: true,
    professional: false,
    education: false,
    work: false,
    resume: false,
    social: false,
    summary: false
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
  const [showLayoutErrors] = useState(false);
  const [dragSectionId, setDragSectionId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [dragRow, setDragRow] = useState<{ sectionId: string; rowId: string } | null>(null);

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

  const handleDragStartSectionTitle = (
    sectionId: string,
    event: React.DragEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const dragTarget = (event.currentTarget as HTMLElement).closest("[data-drag-section='true']") as HTMLElement | null;
    if (dragTarget) {
      event.dataTransfer.setDragImage(dragTarget, 0, 0);
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sectionId);
    setDragSectionId(sectionId);
  };

  const handleDragEndSectionTitle = () => {
    setDragSectionId(null);
  };

  const handleDragOverSection = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragSectionId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropSection = (targetSectionId: string, event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const sourceId = dragSectionId || event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetSectionId) {
      setDragSectionId(null);
      return;
    }
    setSections((prev) => {
      const sourceIndex = prev.findIndex((section) => section.id === sourceId);
      const targetIndex = prev.findIndex((section) => section.id === targetSectionId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragSectionId(null);
  };

  const handleDragStartRow = (
    sectionId: string,
    rowId: string,
    event: React.DragEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const dragTarget = (event.currentTarget as HTMLElement).closest("[data-drag-row='true']") as HTMLElement | null;
    if (dragTarget) {
      event.dataTransfer.setDragImage(dragTarget, 0, 0);
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${sectionId}:${rowId}`);
    setDragRow({ sectionId, rowId });
  };

  const handleDragEndRow = () => {
    setDragRow(null);
  };

  const handleDragOverRow = (sectionId: string, event: React.DragEvent<HTMLDivElement>) => {
    if (!dragRow || dragRow.sectionId !== sectionId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropRow = (
    sectionId: string,
    targetRowId: string,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const sourcePayload = dragRow?.sectionId === sectionId ? dragRow : null;
    if (!sourcePayload) {
      const data = event.dataTransfer.getData("text/plain");
      const [payloadSectionId, payloadRowId] = data.split(":");
      if (payloadSectionId !== sectionId) {
        setDragRow(null);
        return;
      }
      if (!payloadRowId || payloadRowId === targetRowId) {
        setDragRow(null);
        return;
      }
      setDragRow({ sectionId: payloadSectionId, rowId: payloadRowId });
    }

    const sourceRowId = sourcePayload ? sourcePayload.rowId : dragRow?.rowId;
    if (!sourceRowId || sourceRowId === targetRowId) {
      setDragRow(null);
      return;
    }

    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const sourceIndex = section.rows.findIndex((row) => row.id === sourceRowId);
        const targetIndex = section.rows.findIndex((row) => row.id === targetRowId);
        if (sourceIndex === -1 || targetIndex === -1) return section;
        const nextRows = [...section.rows];
        const [moved] = nextRows.splice(sourceIndex, 1);
        nextRows.splice(targetIndex, 0, moved);
        return { ...section, rows: nextRows };
      })
    );
    setDragRow(null);
  };

  const handleOpenEditSectionTitle = (section: Section) => {
    setEditingSectionId(section.id);
    setEditingSectionTitle(section.title);
  };

  const handleCloseEditSectionTitle = () => {
    setEditingSectionId(null);
    setEditingSectionTitle("");
  };

  const handleSaveEditSectionTitle = () => {
    if (!editingSectionId) return;
    const nextTitle = editingSectionTitle.trim();
    if (!nextTitle) return;
    setSections((prev) =>
      prev.map((section) =>
        section.id === editingSectionId ? { ...section, title: nextTitle } : section
      )
    );
    handleCloseEditSectionTitle();
  };

  const getLayoutRow = (sectionId: string, rowId: string) => {
    return layoutRowState[sectionId]?.[rowId];
  };

  const isLayoutVisible = (sectionId: string, rowId: string) => {
    return getLayoutRow(sectionId, rowId)?.visibility ?? true;
  };

  const isLayoutRequired = (sectionId: string, rowId: string) => {
    return getLayoutRow(sectionId, rowId)?.required ?? false;
  };

  const isSectionEnabled = (sectionId: string) => {
    return sections.find((section) => section.id === sectionId)?.enabled ?? true;
  };

  const sectionOrder = useMemo(
    () =>
      sections.reduce<Record<string, number>>((acc, section, index) => {
        acc[section.id] = index;
        return acc;
      }, {}),
    [sections]
  );

  const getSectionOrder = (sectionId: string) => sectionOrder[sectionId] ?? Number.MAX_SAFE_INTEGER;

  const getFieldValue = (sectionId: string, rowId: string) => {
    const key = `${sectionId}.${rowId}`;
    const values: Record<string, string | boolean> = {
      "personal.firstName": layoutForm.firstName,
      "personal.lastName": layoutForm.lastName,
      "personal.email": layoutForm.email,
      "personal.phone": layoutForm.phone,
      "personal.gender": layoutForm.gender,
      "personal.birthDate": layoutForm.birthDate,
      "personal.address": layoutForm.address,
      "personal.city": layoutForm.city,
      "personal.suburb": layoutForm.suburb,
      "personal.state": layoutForm.state,
      "personal.country": layoutForm.country,
      "personal.postal": layoutForm.postalCode,
      "personal.relocate": layoutForm.willingToRelocate,
      "professional.employer": layoutForm.currentEmployer,
      "professional.jobTitle": layoutForm.currentJobTitle,
      "professional.experience": layoutForm.experienceYears,
      "professional.salaryCurrent": layoutForm.currentSalary,
      "professional.salaryExpected": layoutForm.expectedSalary,
      "professional.employmentStatus": layoutForm.employmentStatus,
      "professional.notice": layoutForm.noticePeriod,
      "professional.availableFrom": layoutForm.availableFrom,
      "resumeSkills.skills": layoutForm.skills,
      "social.linkedin": layoutForm.linkedin,
      "social.facebook": layoutForm.facebook,
      "social.xprofile": layoutForm.xprofile,
      "social.github": layoutForm.github,
      "social.website": layoutForm.website,
      "summary.candidateSummary": layoutForm.candidateSummary
    };
    return values[key];
  };

  const getPlainTextFromHtml = (value: string) =>
    value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

  const isFieldMissing = (sectionId: string, rowId: string) => {
    if (!isLayoutVisible(sectionId, rowId) || !isLayoutRequired(sectionId, rowId)) return false;

    if (sectionId === "education") {
      return educationEntries.some((entry) => {
        const value =
          rowId === "institute"
            ? entry.institute
            : rowId === "qualification"
              ? entry.qualification
              : rowId === "specialisation"
                ? entry.specialization
                : rowId === "duration"
                  ? `${entry.fromMonth}${entry.fromYear}${entry.toMonth}${entry.toYear}`
                  : rowId === "pursuing"
                    ? entry.currentlyPursuing
                    : rowId === "summary"
                      ? entry.summary
                      : "";
        if (typeof value === "boolean") return !value;
        return !String(value ?? "").trim();
      });
    }

    if (sectionId === "workHistory") {
      return workEntries.some((entry) => {
        const value =
          rowId === "job"
            ? entry.jobTitle
            : rowId === "company"
              ? entry.company
              : rowId === "employmentType"
                ? entry.employmentType
                : rowId === "industry"
                  ? entry.industry
                  : rowId === "arrangement"
                    ? entry.arrangementType
                    : rowId === "current"
                      ? entry.currentHere
                      : rowId === "workDuration"
                        ? `${entry.fromMonth}${entry.fromYear}${entry.toMonth}${entry.toYear}`
                        : rowId === "workSummary"
                          ? entry.summary
                          : "";
        if (typeof value === "boolean") return !value;
        return !String(value ?? "").trim();
      });
    }

    const value = getFieldValue(sectionId, rowId);
    if (typeof value === "boolean") return !value;
    if (sectionId === "summary" && rowId === "candidateSummary") {
      return !getPlainTextFromHtml(String(value ?? ""));
    }
    return !String(value ?? "").trim();
  };

  const showFieldError = (sectionId: string, rowId: string) =>
    showLayoutErrors && isFieldMissing(sectionId, rowId);

  const showEntryFieldError = (
    sectionId: string,
    rowId: string,
    value: string | boolean
  ) => {
    if (!showLayoutErrors || !isLayoutRequired(sectionId, rowId)) return false;
    if (typeof value === "boolean") return !value;
    return !String(value ?? "").trim();
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

  // const validateLayout = () => {
  //   const requiredFields: Array<{ sectionId: string; rowId: string }> = [
  //     { sectionId: "personal", rowId: "firstName" },
  //     { sectionId: "personal", rowId: "lastName" },
  //     { sectionId: "personal", rowId: "email" },
  //     { sectionId: "personal", rowId: "phone" },
  //     { sectionId: "personal", rowId: "gender" },
  //     { sectionId: "personal", rowId: "birthDate" },
  //     { sectionId: "personal", rowId: "address" },
  //     { sectionId: "personal", rowId: "city" },
  //     { sectionId: "personal", rowId: "suburb" },
  //     { sectionId: "personal", rowId: "state" },
  //     { sectionId: "personal", rowId: "country" },
  //     { sectionId: "personal", rowId: "postal" },
  //     { sectionId: "personal", rowId: "relocate" },
  //     { sectionId: "professional", rowId: "employer" },
  //     { sectionId: "professional", rowId: "jobTitle" },
  //     { sectionId: "professional", rowId: "experience" },
  //     { sectionId: "professional", rowId: "salaryCurrent" },
  //     { sectionId: "professional", rowId: "salaryExpected" },
  //     { sectionId: "professional", rowId: "employmentStatus" },
  //     { sectionId: "professional", rowId: "notice" },
  //     { sectionId: "professional", rowId: "availableFrom" },
  //     { sectionId: "education", rowId: "institute" },
  //     { sectionId: "education", rowId: "qualification" },
  //     { sectionId: "education", rowId: "specialisation" },
  //     { sectionId: "education", rowId: "duration" },
  //     { sectionId: "education", rowId: "pursuing" },
  //     { sectionId: "education", rowId: "summary" },
  //     { sectionId: "workHistory", rowId: "job" },
  //     { sectionId: "workHistory", rowId: "company" },
  //     { sectionId: "workHistory", rowId: "employmentType" },
  //     { sectionId: "workHistory", rowId: "industry" },
  //     { sectionId: "workHistory", rowId: "arrangement" },
  //     { sectionId: "workHistory", rowId: "current" },
  //     { sectionId: "workHistory", rowId: "workDuration" },
  //     { sectionId: "workHistory", rowId: "workSummary" },
  //     { sectionId: "resumeSkills", rowId: "resume" },
  //     { sectionId: "resumeSkills", rowId: "skills" },
  //     { sectionId: "social", rowId: "linkedin" },
  //     { sectionId: "social", rowId: "facebook" },
  //     { sectionId: "social", rowId: "xprofile" },
  //     { sectionId: "social", rowId: "github" },
  //     { sectionId: "social", rowId: "website" },
  //     { sectionId: "summary", rowId: "candidateSummary" }
  //   ];

  //   return !requiredFields.some(({ sectionId, rowId }) => isFieldMissing(sectionId, rowId));
  // };

  const fieldsContent = (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="px-4 h-[52px]  border-[#CCCCCC80] flex items-center justify-between bg-[white]">
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
            draggableTitle={section.title !== "Personal Details"}
            onDragStartTitle={handleDragStartSectionTitle}
            onDragEndTitle={handleDragEndSectionTitle}
            onDropSection={handleDropSection}
            onDragOverSection={handleDragOverSection}
            onEditTitle={handleOpenEditSectionTitle}
            onDragStartRow={handleDragStartRow}
            onDragEndRow={handleDragEndRow}
            onDragOverRow={handleDragOverRow}
            onDropRow={handleDropRow}
            onToggleSection={handleToggleSection}
            onToggleCollapse={handleToggleCollapse}
            onToggleRow={handleToggleRow}
          />
        ))}
      </div>
      {editingSectionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={handleCloseEditSectionTitle}
        >
          <div
            className="w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-[600] text-[#333333]">Edit Section Name</div>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 2400 } }
                }}
              >
                <button
                  type="button"
                  aria-label="Close"
                  className="inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
                  onClick={handleCloseEditSectionTitle}
                >
                  <img src={CloseXIcon} alt="" width={24} height={24} />
                </button>
              </Tooltip>
            </div>
            <div className="mt-6">
              <FloatingLabelInput
                type="text"
                value={editingSectionTitle}
                onChange={(event) => setEditingSectionTitle(event.target.value)}
                className="h-[44px] w-full rounded-[6px] border border-[#D6D6D6] px-4 text-[14px] text-[#333333] focus:border-[#6E41E2] focus:outline-none"
                placeholder="Section name"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="h-[36px] cursor-pointer px-5 rounded-[6px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
                onClick={handleSaveEditSectionTitle}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          className="h-[36px] px-4 rounded-[4px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4] cursor-pointer"
          onClick={() => {
            const state: Record<string, Record<string, FieldRow>> = {};
            sections.forEach((section) => {
              state[section.id] = {};
              section.rows.forEach((row) => {
                state[section.id][row.id] = row;
              });
            });
            setLayoutRowState(state);
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const layoutContent = (
    <div className="flex flex-col gap-4 pt-4 ">
      <div style={{ order: getSectionOrder("personal") }}>
        {isSectionEnabled("personal") && (
          <>
            <LayoutHeader
              title="Personal Information"
              collapsed={!layoutOpen.personal}
              onToggle={() => setLayoutOpen((p) => ({ ...p, personal: !p.personal }))}
            />
            {layoutOpen.personal && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                {isLayoutVisible("personal", "firstName") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="First Name"
                      required={isLayoutRequired("personal", "firstName")}
                      placeholder="e.g., John"
                      value={layoutForm.firstName}
                      onChange={handleLayoutChange("firstName")}
                      className={cn(
                        showFieldError("personal", "firstName") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "firstName") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *First Name is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "lastName") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Last Name"
                      required={isLayoutRequired("personal", "lastName")}
                      placeholder="e.g., Doe"
                      value={layoutForm.lastName}
                      onChange={handleLayoutChange("lastName")}
                      className={cn(
                        showFieldError("personal", "lastName") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "lastName") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Last Name is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "email") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Email"
                      required={isLayoutRequired("personal", "email")}
                      placeholder="e.g., john.doe@example.com"
                      value={layoutForm.email}
                      onChange={handleLayoutChange("email")}
                      className={cn(
                        showFieldError("personal", "email") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "email") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Email is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "phone") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Phone"
                      required={isLayoutRequired("personal", "phone")}
                      placeholder="e.g., +1 555-0123"
                      value={layoutForm.phone}
                      onChange={handleLayoutChange("phone")}
                      className={cn(
                        showFieldError("personal", "phone") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "phone") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Phone is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "gender") && (
                  <div className="relative flex flex-col pb-[14px]">
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
                      className={cn(
                        showFieldError("personal", "gender") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "gender") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Gender is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "birthDate") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Birth Date"
                      required={isLayoutRequired("personal", "birthDate")}
                      placeholder="DD/MM/YYYY"
                      className={cn(
                        "pr-9",
                        "pf-hide-native-date-icon",
                        showFieldError("personal", "birthDate") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                      type="date"
                      ref={birthDateRef}
                      value={layoutForm.birthDate}
                      onChange={handleLayoutChange("birthDate")}
                      onClick={() => openDatePicker(birthDateRef)}
                    />
                    <span className="pointer-events-none absolute right-3 top-11 -translate-y-1/2 text-[#666666]/70">
                      <CalendarIcon />
                    </span>
                    {showFieldError("personal", "birthDate") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Birth Date is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "address") && (
                  <div className="relative flex flex-col pb-[14px] md:col-span-2">
                    <FloatingLabelInput
                      label="Full Address"
                      required={isLayoutRequired("personal", "address")}
                      placeholder="e.g., 123 Wall St, Apt 4B"
                      value={layoutForm.address}
                      onChange={handleLayoutChange("address")}
                      className={cn(
                        showFieldError("personal", "address") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "address") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Full Address is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "city") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="City"
                      required={isLayoutRequired("personal", "city")}
                      placeholder="e.g., New York"
                      value={layoutForm.city}
                      onChange={handleLayoutChange("city")}
                      className={cn(
                        showFieldError("personal", "city") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "city") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *City is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "suburb") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Suburb"
                      required={isLayoutRequired("personal", "suburb")}
                      placeholder="e.g., Brooklyn"
                      value={layoutForm.suburb}
                      onChange={handleLayoutChange("suburb")}
                      className={cn(
                        showFieldError("personal", "suburb") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "suburb") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Suburb is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "state") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="State/Province"
                      required={isLayoutRequired("personal", "state")}
                      placeholder="e.g., NY"
                      value={layoutForm.state}
                      onChange={handleLayoutChange("state")}
                      className={cn(
                        showFieldError("personal", "state") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "state") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *State/Province is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "country") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Country"
                      required={isLayoutRequired("personal", "country")}
                      placeholder="Search or Add Country"
                      value={layoutForm.country}
                      onChange={handleLayoutChange("country")}
                      className={cn(
                        showFieldError("personal", "country") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "country") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Country is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "postal") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Postal Code"
                      required={isLayoutRequired("personal", "postal")}
                      placeholder="e.g., 10001"
                      value={layoutForm.postalCode}
                      onChange={handleLayoutChange("postalCode")}
                      className={cn(
                        showFieldError("personal", "postal") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("personal", "postal") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Postal Code is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("personal", "relocate") && (
                  <div className="relative flex flex-col pb-[14px] pt-[24px]">
                    <div className="flex items-center gap-3 h-[36px]">
                      <span className="text-[14px] font-medium text-[#333333]/70">Willing to Relocate</span>
                      <Toggle
                        enabled={layoutForm.willingToRelocate}
                        onChange={(val) => setLayoutForm((prev) => ({ ...prev, willingToRelocate: val }))}
                        ariaLabel="Willing to relocate"
                      />
                    </div>
                    {showFieldError("personal", "relocate") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Willing to Relocate is required.
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("professional") }}>
        {isSectionEnabled("professional") && (
          <>
            <LayoutHeader
              title="Professional Details"
              collapsed={!layoutOpen.professional}
              onToggle={() => setLayoutOpen((p) => ({ ...p, professional: !p.professional }))}
            />
            {layoutOpen.professional && (
              <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-y-4 gap-x-10">
                {isLayoutVisible("professional", "employer") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Current Employer"
                      required={isLayoutRequired("professional", "employer")}
                      placeholder="e.g., Acme Corp"
                      value={layoutForm.currentEmployer}
                      onChange={handleLayoutChange("currentEmployer")}
                      className={cn(
                        showFieldError("professional", "employer") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "employer") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Current Employer is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "jobTitle") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Current Job Title"
                      required={isLayoutRequired("professional", "jobTitle")}
                      placeholder="e.g., Software Engineer"
                      value={layoutForm.currentJobTitle}
                      onChange={handleLayoutChange("currentJobTitle")}
                      className={cn(
                        showFieldError("professional", "jobTitle") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "jobTitle") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Current Job Title is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "experience") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Experience in Years"
                      required={isLayoutRequired("professional", "experience")}
                      placeholder="e.g., 5"
                      value={layoutForm.experienceYears}
                      onChange={handleLayoutChange("experienceYears")}
                      className={cn(
                        showFieldError("professional", "experience") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "experience") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Experience in Years is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "salaryCurrent") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Current Salary"
                      required={isLayoutRequired("professional", "salaryCurrent")}
                      placeholder="e.g., 85,000"
                      value={layoutForm.currentSalary}
                      onChange={handleLayoutChange("currentSalary")}
                      className={cn(
                        showFieldError("professional", "salaryCurrent") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "salaryCurrent") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Current Salary is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "salaryExpected") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Expected Salary"
                      required={isLayoutRequired("professional", "salaryExpected")}
                      placeholder="e.g., 95,000"
                      value={layoutForm.expectedSalary}
                      onChange={handleLayoutChange("expectedSalary")}
                      className={cn(
                        showFieldError("professional", "salaryExpected") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "salaryExpected") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Expected Salary is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "employmentStatus") && (
                  <div className="relative flex flex-col pb-[14px]">
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
                      className={cn(
                        showFieldError("professional", "employmentStatus") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "employmentStatus") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Employment Status is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "notice") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Notice Period"
                      required={isLayoutRequired("professional", "notice")}
                      placeholder="e.g., 4 weeks"
                      value={layoutForm.noticePeriod}
                      onChange={handleLayoutChange("noticePeriod")}
                      className={cn(
                        showFieldError("professional", "notice") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("professional", "notice") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Notice Period is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("professional", "availableFrom") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Available from"
                      placeholder="DD/MM/YYYY"
                      className={cn(
                        "pr-9",
                        "pf-hide-native-date-icon",
                        showFieldError("professional", "availableFrom") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                      type="date"
                      ref={availableFromRef}
                      value={layoutForm.availableFrom}
                      onChange={handleLayoutChange("availableFrom")}
                      onClick={() => openDatePicker(availableFromRef)}
                    />
                    <span className="pointer-events-none absolute right-3 top-11 -translate-y-1/2 text-[#666666]/70">
                      <CalendarIcon />
                    </span>
                    {showFieldError("professional", "availableFrom") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Available From is required.
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("education") }}>
        {isSectionEnabled("education") && (
          <>
            <LayoutHeader
              title="Educational Details"
              collapsed={!layoutOpen.education}
              onToggle={() => setLayoutOpen((p) => ({ ...p, education: !p.education }))}
            />
            {!layoutOpen.education && (
              <button
                type="button"
                className="mt-4 w-full h-[44px] cursor-pointer border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
                onClick={() => setLayoutOpen((prev) => ({ ...prev, education: true }))}
              >
                + Add Educational Details
              </button>
            )}
            {layoutOpen.education && (
              <div className="mt-2 flex flex-col gap-4">
                {educationEntries.map((entry) => {
                  const durationValue = `${entry.fromMonth}${entry.fromYear}${entry.toMonth}${entry.toYear}`;
                  return (
                    <div key={entry.id} className="flex flex-col gap-4  border-[#E6E6E6] rounded-[4px] p-4 bg-white">
                      {isLayoutVisible("education", "institute") && (
                        <div className="relative flex flex-col pb-[14px]">
                          <FloatingLabelInput
                            label="Institute / School"
                            required={isLayoutRequired("education", "institute")}
                            placeholder="e.g., Stanford University"
                            value={entry.institute}
                            onChange={(e) => updateEducationEntry(entry.id, "institute", e.target.value)}
                            className={cn(
                              showEntryFieldError("education", "institute", entry.institute) &&
                              "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                            )}
                          />
                          {showEntryFieldError("education", "institute", entry.institute) && (
                            <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                              *Institute / School is required.
                            </span>
                          )}
                        </div>
                      )}
                      {(isLayoutVisible("education", "qualification") ||
                        isLayoutVisible("education", "specialisation")) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                            {isLayoutVisible("education", "qualification") && (
                              <div className="relative flex flex-col pb-[14px]">
                                <FloatingLabelInput
                                  label="Educational Qualification"
                                  required={isLayoutRequired("education", "qualification")}
                                  placeholder="Add Qualification"
                                  value={entry.qualification}
                                  onChange={(e) => updateEducationEntry(entry.id, "qualification", e.target.value)}
                                  className={cn(
                                    showEntryFieldError("education", "qualification", entry.qualification) &&
                                    "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                                  )}
                                />
                                {showEntryFieldError("education", "qualification", entry.qualification) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Educational Qualification is required.
                                  </span>
                                )}
                              </div>
                            )}
                            {isLayoutVisible("education", "specialisation") && (
                              <div className="relative flex flex-col pb-[14px]">
                                <FloatingLabelInput
                                  label="Specialisation"
                                  required={isLayoutRequired("education", "specialisation")}
                                  placeholder="e.g., Computer Science"
                                  value={entry.specialization}
                                  onChange={(e) => updateEducationEntry(entry.id, "specialization", e.target.value)}
                                  className={cn(
                                    showEntryFieldError("education", "specialisation", entry.specialization) &&
                                    "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                                  )}
                                />
                                {showEntryFieldError("education", "specialisation", entry.specialization) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Specialisation is required.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      {(isLayoutVisible("education", "duration") ||
                        isLayoutVisible("education", "pursuing")) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                            {isLayoutVisible("education", "duration") && (
                              <div className="relative flex flex-col gap-1 pb-[14px]">
                                <label className="text-[14px] font-medium text-[#333333]/70">Duration</label>
                                <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-2">
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Month"
                                    options={monthOptions}
                                    value={entry.fromMonth}
                                    onValueChange={(value) => updateEducationEntry(entry.id, "fromMonth", value)}
                                  />
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Year"
                                    options={yearOptions}
                                    value={entry.fromYear}
                                    onValueChange={(value) => updateEducationEntry(entry.id, "fromYear", value)}
                                  />
                                  <div className="flex items-center justify-center text-[12px] text-[#666666]">To</div>
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Month"
                                    options={monthOptions}
                                    value={entry.toMonth}
                                    onValueChange={(value) => updateEducationEntry(entry.id, "toMonth", value)}
                                  />
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Year"
                                    options={yearOptions}
                                    value={entry.toYear}
                                    onValueChange={(value) => updateEducationEntry(entry.id, "toYear", value)}
                                  />
                                </div>
                                {showEntryFieldError("education", "duration", durationValue) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Duration is required.
                                  </span>
                                )}
                              </div>
                            )}
                            {isLayoutVisible("education", "pursuing") && (
                              <div className="relative flex flex-col pb-[14px] justify-end">
                                <div className="flex items-center gap-3 h-[40px]">
                                  <span className="text-[14px] font-medium text-[#333333]/70">Currently pursuing</span>
                                  <Toggle
                                    enabled={entry.currentlyPursuing}
                                    onChange={(val) => updateEducationEntry(entry.id, "currentlyPursuing", val)}
                                    ariaLabel="Currently pursuing"
                                  />
                                </div>
                                {showEntryFieldError("education", "pursuing", entry.currentlyPursuing) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Currently pursuing is required.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      {isLayoutVisible("education", "summary") && (
                        <div className="relative flex flex-col pb-[14px]">
                          <TextAreaField
                            label="Summary"
                            placeholder="Brief overview of your studies..."
                            value={entry.summary}
                            onChange={(e) => updateEducationEntry(entry.id, "summary", e.target.value)}
                          />
                          {showEntryFieldError("education", "summary", entry.summary) && (
                            <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                              *Summary is required.
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="h-[32px] cursor-pointer px-4 rounded-[4px] bg-[#E4554A] text-white text-[12px] font-[500]"
                          onClick={() => removeEducationEntry(entry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="w-full h-[44px] cursor-pointer border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
                  onClick={addEducationEntry}
                >
                  + Add Educational Details
                </button>
              </div>
            )}

          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("workHistory") }}>
        {isSectionEnabled("workHistory") && (
          <>
            <LayoutHeader
              title="Work History"
              collapsed={!layoutOpen.work}
              onToggle={() => setLayoutOpen((p) => ({ ...p, work: !p.work }))}
            />
            {!layoutOpen.work && (
              <button
                type="button"
                className="mt-4 w-full h-[44px] cursor-pointer border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
                onClick={() => setLayoutOpen((prev) => ({ ...prev, work: true }))}
              >
                + Add Work History
              </button>
            )}
            {layoutOpen.work && (
              <div className="mt-2 flex flex-col gap-4">
                {workEntries.map((entry) => {
                  const durationValue = `${entry.fromMonth}${entry.fromYear}${entry.toMonth}${entry.toYear}`;
                  return (
                    <div key={entry.id} className="flex flex-col gap-4  border-[#E6E6E6] rounded-[4px] p-4 bg-white">
                      {isLayoutVisible("workHistory", "job") && (
                        <div className="relative flex flex-col pb-[14px]">
                          <FloatingLabelInput
                            label="Job Title"
                            required={isLayoutRequired("workHistory", "job")}
                            placeholder="e.g., Product Manager"
                            value={entry.jobTitle}
                            onChange={(e) => updateWorkEntry(entry.id, "jobTitle", e.target.value)}
                            className={cn(
                              showEntryFieldError("workHistory", "job", entry.jobTitle) &&
                              "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                            )}
                          />
                          {showEntryFieldError("workHistory", "job", entry.jobTitle) && (
                            <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                              *Job Title is required.
                            </span>
                          )}
                        </div>
                      )}
                      {(isLayoutVisible("workHistory", "company") ||
                        isLayoutVisible("workHistory", "employmentType")) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                            {isLayoutVisible("workHistory", "company") && (
                              <div className="relative flex flex-col pb-[14px]">
                                <FloatingLabelInput
                                  label="Company"
                                  required={isLayoutRequired("workHistory", "company")}
                                  placeholder="e.g., Google"
                                  value={entry.company}
                                  onChange={(e) => updateWorkEntry(entry.id, "company", e.target.value)}
                                  className={cn(
                                    showEntryFieldError("workHistory", "company", entry.company) &&
                                    "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                                  )}
                                />
                                {showEntryFieldError("workHistory", "company", entry.company) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Company is required.
                                  </span>
                                )}
                              </div>
                            )}
                            {isLayoutVisible("workHistory", "employmentType") && (
                              <div className="relative flex flex-col pb-[14px]">
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
                                  className={cn(
                                    showEntryFieldError("workHistory", "employmentType", entry.employmentType) &&
                                    "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                                  )}
                                />
                                {showEntryFieldError("workHistory", "employmentType", entry.employmentType) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Employment Type is required.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      {(isLayoutVisible("workHistory", "industry") ||
                        isLayoutVisible("workHistory", "arrangement")) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                            {isLayoutVisible("workHistory", "industry") && (
                              <div className="relative flex flex-col pb-[14px]">
                                <FloatingLabelSelect
                                  label="Industry"
                                  placeholder="Select Industry"
                                  options={[]}
                                  value={entry.industry}
                                  onValueChange={(value) => updateWorkEntry(entry.id, "industry", value)}
                                  className={cn(
                                    showEntryFieldError("workHistory", "industry", entry.industry) &&
                                    "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                                  )}
                                />
                                {showEntryFieldError("workHistory", "industry", entry.industry) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Industry is required.
                                  </span>
                                )}
                              </div>
                            )}
                            {isLayoutVisible("workHistory", "arrangement") && (
                              <div className="relative flex flex-col pb-[14px]">
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
                                  className={cn(
                                    showEntryFieldError("workHistory", "arrangement", entry.arrangementType) &&
                                    "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                                  )}
                                />
                                {showEntryFieldError("workHistory", "arrangement", entry.arrangementType) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Work Arrangement Type is required.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      {(isLayoutVisible("workHistory", "workDuration") ||
                        isLayoutVisible("workHistory", "current")) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                            {isLayoutVisible("workHistory", "workDuration") && (
                              <div className="relative flex flex-col gap-1 pb-[14px]">
                                <label className="text-[14px] font-medium text-[#333333]/70">Duration</label>
                                <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-2">
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Month"
                                    options={monthOptions}
                                    value={entry.fromMonth}
                                    onValueChange={(value) => updateWorkEntry(entry.id, "fromMonth", value)}
                                  />
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Year"
                                    options={yearOptions}
                                    value={entry.fromYear}
                                    onValueChange={(value) => updateWorkEntry(entry.id, "fromYear", value)}
                                  />
                                  <div className="flex items-center justify-center text-[12px] text-[#666666]">To</div>
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Month"
                                    options={monthOptions}
                                    value={entry.toMonth}
                                    onValueChange={(value) => updateWorkEntry(entry.id, "toMonth", value)}
                                  />
                                  <FloatingLabelSelect
                                    label=""
                                    placeholder="Year"
                                    options={yearOptions}
                                    value={entry.toYear}
                                    onValueChange={(value) => updateWorkEntry(entry.id, "toYear", value)}
                                  />
                                </div>
                                {showEntryFieldError("workHistory", "workDuration", durationValue) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Duration is required.
                                  </span>
                                )}
                              </div>
                            )}
                            {isLayoutVisible("workHistory", "current") && (
                              <div className="relative flex flex-col pb-[14px] justify-end">
                                <div className="flex items-center gap-3 h-[40px]">
                                  <span className="text-[14px] font-medium text-[#333333]/70">I currently work here</span>
                                  <Toggle
                                    enabled={entry.currentHere}
                                    onChange={(val) => updateWorkEntry(entry.id, "currentHere", val)}
                                    ariaLabel="Currently work here"
                                  />
                                </div>
                                {showEntryFieldError("workHistory", "current", entry.currentHere) && (
                                  <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                                    *Currently work here is required.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      {isLayoutVisible("workHistory", "workSummary") && (
                        <div className="relative flex flex-col pb-[14px]">
                          <TextAreaField
                            label="Summary"
                            placeholder="Describe your responsibilities..."
                            value={entry.summary}
                            onChange={(e) => updateWorkEntry(entry.id, "summary", e.target.value)}
                          />
                          {showEntryFieldError("workHistory", "workSummary", entry.summary) && (
                            <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                              *Summary is required.
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="h-[32px] cursor-pointer px-4 rounded-[4px] bg-[#E4554A] text-white text-[12px] font-[500]"
                          onClick={() => removeWorkEntry(entry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="w-full h-[44px] cursor-pointer border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
                  onClick={addWorkEntry}
                >
                  + Add Work History
                </button>
              </div>

            )}

          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("resumeSkills") }}>
        {isSectionEnabled("resumeSkills") && (
          <>
            <LayoutHeader
              title="Resume & Skills"
              collapsed={!layoutOpen.resume}
              onToggle={() => setLayoutOpen((p) => ({ ...p, resume: !p.resume }))}
            />
            {layoutOpen.resume && (
              <div className="flex pt-6 flex-col gap-4">
                {isLayoutVisible("resumeSkills", "resume") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <div className={cn(
                      "h-[140px] border border-dashed border-[#D6D6D6] rounded-[6px] flex flex-col items-center justify-center gap-2 text-center",
                      showFieldError("resumeSkills", "resume") && "border-[#E53935]"
                    )}>
                      <div className="h-[28px] w-[28px] text-[#666666]">
                        <svg width="23" height="28" viewBox="0 0 23 28" fill="none" aria-hidden="true">
                          <path
                            d="M6.57143 21.4118V11.5294H0L11.5 0L23 11.5294H16.4286V21.4118H6.57143ZM0 28V24.7059H23V28H0Z"
                            fill="#666666"
                          />
                        </svg>
                      </div>
                      <div className="text-[12px] text-[#333333] font-[500]">Upload Candidate Resume</div>
                      <div className="text-[11px] text-[#666666]">
                        Drag & Drop to upload document or <span className="text-[#6E41E2]">choose</span> file from your computer
                      </div>
                    </div>
                    {showFieldError("resumeSkills", "resume") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Resume is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("resumeSkills", "skills") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Skills"
                      placeholder="Search and Add"
                      className={cn(
                        "pr-9",
                        showFieldError("resumeSkills", "skills") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                      value={layoutForm.skills}
                      onChange={handleLayoutChange("skills")}
                    />
                    <span className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-[#666666]">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <circle cx="9" cy="9" r="6" stroke="#666666" strokeWidth="1.5" />
                        <path d="M14 14l3 3" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    {showFieldError("resumeSkills", "skills") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Skills is required.
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("social") }}>
        {isSectionEnabled("social") && (
          <>
            <LayoutHeader
              title="Social Links"
              collapsed={!layoutOpen.social}
              onToggle={() => setLayoutOpen((p) => ({ ...p, social: !p.social }))}
            />
            {layoutOpen.social && (
              <div className="grid pt-6 grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                {isLayoutVisible("social", "linkedin") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="LinkedIn"
                      required={isLayoutRequired("social", "linkedin")}
                      placeholder="http://www.linkedin.com/johndoe"
                      value={layoutForm.linkedin}
                      onChange={handleLayoutChange("linkedin")}
                      className={cn(
                        showFieldError("social", "linkedin") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("social", "linkedin") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *LinkedIn is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("social", "facebook") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Facebook"
                      required={isLayoutRequired("social", "facebook")}
                      placeholder="http://www.facebook.com/johndoe"
                      value={layoutForm.facebook}
                      onChange={handleLayoutChange("facebook")}
                      className={cn(
                        showFieldError("social", "facebook") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("social", "facebook") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Facebook is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("social", "xprofile") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="X"
                      required={isLayoutRequired("social", "xprofile")}
                      placeholder="http://www.x.com/johndoe"
                      value={layoutForm.xprofile}
                      onChange={handleLayoutChange("xprofile")}
                      className={cn(
                        showFieldError("social", "xprofile") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("social", "xprofile") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *X is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("social", "github") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Github"
                      required={isLayoutRequired("social", "github")}
                      placeholder="http://github.com/johndoe"
                      value={layoutForm.github}
                      onChange={handleLayoutChange("github")}
                      className={cn(
                        showFieldError("social", "github") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("social", "github") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Github is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("social", "website") && (
                  <div className="relative flex flex-col pb-[14px] md:col-span-2">
                    <FloatingLabelInput
                      label="Website"
                      required={isLayoutRequired("social", "website")}
                      placeholder="http://www.example.com"
                      value={layoutForm.website}
                      onChange={handleLayoutChange("website")}
                      className={cn(
                        showFieldError("social", "website") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("social", "website") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Website is required.
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("summary") }}>
        {isSectionEnabled("summary") && (
          <>
            {!layoutOpen.summary && (
              <button
                type="button"
                className="w-full h-[44px] cursor-pointer border border-[#E6E6E6] rounded-[4px] text-[#6E41E2] text-[13px] font-[500] bg-white"
                onClick={() => setLayoutOpen((prev) => ({ ...prev, summary: true }))}
              >
                + Add Candidate Summary
              </button>
            )}

            {layoutOpen.summary && (
              <div className={cn(
                "relative mt-6 border border-[#E6E6E6] rounded-[4px] bg-white overflow-hidden pb-[14px]",
                showFieldError("summary", "candidateSummary") && "border-[#E53935]"
              )}>
                <ReactQuill
                  theme="snow"
                  modules={summaryModules}
                  formats={summaryFormats}
                  placeholder="Summary of professional profile..."
                  value={layoutForm.candidateSummary}
                  onChange={(value: string) => {
                    const isEmpty = !getPlainTextFromHtml(value);
                    setLayoutForm((prev) => ({ ...prev, candidateSummary: isEmpty ? "" : value }));
                  }}
                  className={cn(
                    "pf-summary-quill",
                    showFieldError("summary", "candidateSummary") && "pf-summary-quill-error"
                  )}
                />
                {showFieldError("summary", "candidateSummary") && (
                  <span className="absolute left-3 bottom-[4px] text-[11px] text-[#E53935]">
                    *Candidate Summary is required.
                  </span>
                )}
              </div>
            )}
            {layoutOpen.summary && (
              <div className="flex mt-6 justify-end">
                <button
                  type="button"
                  className="h-[32px] cursor-pointer px-4 rounded-[4px] bg-[#E4554A] text-white text-[12px] font-[500]"
                  onClick={() => {
                    setLayoutForm((prev) => ({ ...prev, candidateSummary: "" }));
                    setLayoutOpen((prev) => ({ ...prev, summary: false }));
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* <div className="flex justify-end gap-3 pt-2">
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
      </div> */}
    </div>
  );

  return (
    <div className="flex flex-col w-full ">
      <style>{`
        .pf-hide-native-date-icon::-webkit-calendar-picker-indicator {
          opacity: 0;
          display: none;
        }
        .pf-hide-native-date-icon::-webkit-clear-button,
        .pf-hide-native-date-icon::-webkit-inner-spin-button {
          display: none;
        }
        .pf-hide-native-date-icon {
          -webkit-appearance: none;
          appearance: none;
        }
        .pf-summary-quill .ql-toolbar.ql-snow {
          border: 0;
          border-bottom: 1px solid #E6E6E6;
          background: #F9FAFB;
        }
        .pf-summary-quill .ql-container.ql-snow {
          border: 0;
          min-height: 140px;
          font-size: 13px;
          color: #333333;
        }
        .pf-summary-quill .ql-editor {
          min-height: 140px;
          line-height: 1.4;
        }
        .pf-summary-quill .ql-editor.ql-blank::before {
          color: #999999;
          font-style: normal;
        }
        .pf-summary-quill-error .ql-toolbar.ql-snow,
        .pf-summary-quill-error .ql-container.ql-snow {
          border-color: #E53935;
        }
      `}</style>

      <div className="w-full rounded-[4px] border border-[#CCCCCC80] p-3">
        <TabsComponent
          tabs={[
            { label: "Fields", value: "fields", content: fieldsContent },
            { label: "Layout", value: "layout", content: layoutContent }
          ]}
        />
      </div>
    </div>
  );
};

export default Candidates;
