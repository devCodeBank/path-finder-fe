import React, { useMemo, useRef, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";
import { cn } from "@/lib/utils";
import { Button, Checkbox, Tooltip } from "@mui/material";
import CloseXIcon from "@assets/icons/close-pop-up.svg";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 3V6M14 3V6M3 8.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
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
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 outline-none",
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
        "h-[14px] w-[14px] rounded-[3px] border flex items-center justify-center",
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



const LayoutHeader = ({
  title,

  onToggle,
  collapsed
}: {
  title: string;
  collapsed: boolean;

  onToggle: () => void;
}) => (
  <div className="w-full h-[52px] px-4 flex items-center justify-between border border-[#E6E6E6] rounded-[4px] bg-[#F9FAFB] text-[14px] font-[500] text-[#333333]">
    <span>{title}</span>
    <button
      type="button"
      aria-label={`Toggle ${title}`}
      aria-expanded={!collapsed}
      onClick={onToggle}
      className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#F3F4F6]"
    >
      {collapsed ? (
        <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
      ) : (
        <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
      )}
    </button>
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
  onDragStartRow: (sectionId: string, rowId: string, event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEndRow: () => void;
  onDragOverRow: (sectionId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onDropRow: (sectionId: string, rowId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onToggleSection: (sectionId: string, enabled: boolean) => void;
  onToggleCollapse: (sectionId: string) => void;
  onToggleRow: (sectionId: string, rowId: string, key: keyof FieldRow, value: boolean) => void;
}) => {
  return (
    <div className="bg-white  border-[#CCCCCC80] rounded-[4px] overflow-hidden">
      <div
        className="h-[52px] px-4 flex items-center justify-between rounded-[4px] border border-[#CCCCCC80] bg-[#F9FAFB]"
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
          <Toggle
            enabled={section.enabled}
            onChange={(val) => onToggleSection(section.id, val)}
            ariaLabel={`Toggle ${section.title}`}
          />
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
              className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
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
          <div className="grid grid-cols-[32px_2.2fr_1.4fr_0.8fr_0.7fr] gap-2 px-4 py-2 text-[13px] font-[500] text-[#333333] border-[#CCCCCC80] bg-[#FFFFFF]">
            <span />
            <span></span>
            <span>Fields Type</span>
            <span className="text-center">Visibility</span>
            <span className="text-center">Required</span>
          </div>
          <div className="flex flex-col gap-2">
            {section.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[32px_2.2fr_1.4fr_0.8fr_0.7fr] gap-2 px-4 h-[44px] text-[13px] text-[#333333] items-center border border-[#E6E6E6] rounded-[4px] bg-white"
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const JobFields: React.FC = () => {
  const targetDateRef = useRef<HTMLInputElement | null>(null);
  const jobDescModules = useMemo(
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
  const jobDescFormats = useMemo(
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
        id: "jobDetails",
        title: "Job Details",
        enabled: true,
        rows: [
          { id: "jobTitle", label: "Job Title", type: "Text", visibility: true, required: true, extension: false, visibilityLocked: true, requiredLocked: true },
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
      "jobDetails.jobTitle": layoutForm.jobTitle,
      "jobDetails.jobType": layoutForm.jobType,
      "jobDetails.jobCategory": layoutForm.jobCategory,
      "jobDetails.jobIndustry": layoutForm.jobIndustry,
      "jobDetails.jobLocationType": layoutForm.jobLocationType,
      "jobDetails.jobLevel": layoutForm.jobLevel,
      "jobDetails.city": layoutForm.city,
      "jobDetails.suburb": layoutForm.suburb,
      "jobDetails.state": layoutForm.state,
      "jobDetails.country": layoutForm.country,
      "jobDetails.postalCode": layoutForm.postalCode,
      "jobDetails.minSalary": layoutForm.minSalary,
      "jobDetails.maxSalary": layoutForm.maxSalary,
      "jobDetails.frequency": layoutForm.frequency,
      "jobDetails.currency": layoutForm.currency,
      "jobDetails.educationalQualifications": layoutForm.educationalQualification,
      "jobDetails.jobDescription": layoutForm.jobDescription,
      "jobDetails.skills": layoutForm.skills,
      "jobDetails.jobApplicationQuestions": layoutForm.jobQuestions,
      "admin.companyName": layoutForm.companyName,
      "admin.contactName": layoutForm.contactName,
      "admin.contactEmail": layoutForm.contactEmail,
      "admin.contactPhone": layoutForm.contactPhone,
      "admin.noOfPositions": layoutForm.positions,
      "admin.hiringPipeline": layoutForm.hiringPipeline,
      "admin.targetDate": layoutForm.targetDate,
      "admin.minExperience": layoutForm.minExperience,
      "admin.maxExperience": layoutForm.maxExperience,
      "admin.jobOpeningStatus": layoutForm.jobStatus,
      "admin.jobOwner": layoutForm.jobOwner,
      "admin.hiringManager": layoutForm.hiringManager,
      "admin.interviewScorecard": layoutForm.interviewScorecard,
      "admin.hiringTeamMembers": layoutForm.hiringTeam,
      "admin.enableJobApplication": layoutForm.enableJobApplication
    };
    return values[key];
  };

  const getPlainTextFromHtml = (value: string) =>
    value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

  const isFieldMissing = (sectionId: string, rowId: string) => {
    if (!isLayoutVisible(sectionId, rowId) || !isLayoutRequired(sectionId, rowId)) return false;
    const value = getFieldValue(sectionId, rowId);
    if (typeof value === "boolean") return !value;
    if (sectionId === "jobDetails" && rowId === "jobDescription") {
      return !getPlainTextFromHtml(String(value ?? ""));
    }
    return !String(value ?? "").trim();
  };

  const handleLayoutChange =
    (key: keyof typeof layoutForm) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setLayoutForm((prev) => ({ ...prev, [key]: value }));
      };

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref.current) return;
    if (typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    }
    ref.current.focus();
  };
  // const validateLayout = () => {
  //   const requiredFields: Array<{ sectionId: string; rowId: string }> = [
  //     { sectionId: "jobDetails", rowId: "jobTitle" },
  //     { sectionId: "jobDetails", rowId: "jobType" },
  //     { sectionId: "jobDetails", rowId: "jobCategory" },
  //     { sectionId: "jobDetails", rowId: "jobIndustry" },
  //     { sectionId: "jobDetails", rowId: "jobLocationType" },
  //     { sectionId: "jobDetails", rowId: "jobLevel" },
  //     { sectionId: "jobDetails", rowId: "city" },
  //     { sectionId: "jobDetails", rowId: "suburb" },
  //     { sectionId: "jobDetails", rowId: "state" },
  //     { sectionId: "jobDetails", rowId: "country" },
  //     { sectionId: "jobDetails", rowId: "postalCode" },
  //     { sectionId: "jobDetails", rowId: "minSalary" },
  //     { sectionId: "jobDetails", rowId: "maxSalary" },
  //     { sectionId: "jobDetails", rowId: "frequency" },
  //     { sectionId: "jobDetails", rowId: "currency" },
  //     { sectionId: "jobDetails", rowId: "educationalQualifications" },
  //     { sectionId: "jobDetails", rowId: "jobDescription" },
  //     { sectionId: "jobDetails", rowId: "skills" },
  //     { sectionId: "jobDetails", rowId: "jobApplicationQuestions" },
  //     { sectionId: "admin", rowId: "companyName" },
  //     { sectionId: "admin", rowId: "contactName" },
  //     { sectionId: "admin", rowId: "contactEmail" },
  //     { sectionId: "admin", rowId: "contactPhone" },
  //     { sectionId: "admin", rowId: "noOfPositions" },
  //     { sectionId: "admin", rowId: "hiringPipeline" },
  //     { sectionId: "admin", rowId: "targetDate" },
  //     { sectionId: "admin", rowId: "minExperience" },
  //     { sectionId: "admin", rowId: "maxExperience" },
  //     { sectionId: "admin", rowId: "jobOpeningStatus" },
  //     { sectionId: "admin", rowId: "jobOwner" },
  //     { sectionId: "admin", rowId: "hiringManager" },
  //     { sectionId: "admin", rowId: "interviewScorecard" },
  //     { sectionId: "admin", rowId: "hiringTeamMembers" },
  //     { sectionId: "admin", rowId: "enableJobApplication" }
  //   ];

  //   return !requiredFields.some(({ sectionId, rowId }) => isFieldMissing(sectionId, rowId));
  // };

  const fieldsContent = (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="px-4 h-[52px]  border-[#CCCCCC80] flex items-center justify-between bg-[White]">
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
            draggableTitle
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
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
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
                className="h-[36px] px-5 rounded-[6px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
                onClick={handleSaveEditSectionTitle}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const layoutContent = (
    <div className="flex flex-col gap-4 pt-4">
      <div style={{ order: getSectionOrder("jobDetails") }}>
        {isSectionEnabled("jobDetails") && (
          <>
            <LayoutHeader
              title="Job Details"
              collapsed={!layoutOpen.jobDetails}
              onToggle={() => setLayoutOpen((p) => ({ ...p, jobDetails: !p.jobDetails }))}
            />
            {layoutOpen.jobDetails && (
              <div className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  {isLayoutVisible("jobDetails", "jobTitle") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Job Title"
                        required={isLayoutRequired("jobDetails", "jobTitle")}
                        placeholder="e.g., Full Stack Engineer"
                        value={layoutForm.jobTitle}
                        onChange={handleLayoutChange("jobTitle")}
                        className={cn(
                          showLayoutErrors &&
                          isLayoutRequired("jobDetails", "jobTitle") &&
                          !layoutForm.jobTitle.trim() &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors &&
                        isLayoutRequired("jobDetails", "jobTitle") &&
                        !layoutForm.jobTitle.trim() && (
                          <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                            *Job Title is required.
                          </span>
                        )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "jobType") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Job Type"
                        placeholder="Select Job Type"
                        options={[]}
                        value={layoutForm.jobType}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobType: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "jobType") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "jobType") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Job Type is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "jobCategory") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Job Category"
                        placeholder="Select Job Category"
                        options={[]}
                        value={layoutForm.jobCategory}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobCategory: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "jobCategory") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "jobCategory") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Job Category is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "jobIndustry") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Job Industry"
                        placeholder="Select Job Industry"
                        options={[]}
                        value={layoutForm.jobIndustry}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobIndustry: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "jobIndustry") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "jobIndustry") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Job Industry is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "jobLocationType") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Job Location Type"
                        placeholder="Select Job Location Type"
                        options={[]}
                        value={layoutForm.jobLocationType}
                        onValueChange={(value) =>
                          setLayoutForm((prev) => ({ ...prev, jobLocationType: value }))
                        }
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "jobLocationType") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "jobLocationType") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Job Location Type is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "jobLevel") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Job Level"
                        placeholder="Select Job Level"
                        options={[]}
                        value={layoutForm.jobLevel}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobLevel: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "jobLevel") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "jobLevel") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Job Level is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "city") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="City"
                        required={isLayoutRequired("jobDetails", "city")}
                        placeholder="Search or Enter City"
                        value={layoutForm.city}
                        onChange={handleLayoutChange("city")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "city") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "city") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *City is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "suburb") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Suburb"
                        required={isLayoutRequired("jobDetails", "suburb")}
                        placeholder="Search or Enter Suburb"
                        value={layoutForm.suburb}
                        onChange={handleLayoutChange("suburb")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "suburb") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "suburb") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Suburb is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "state") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="State / Province"
                        required={isLayoutRequired("jobDetails", "state")}
                        placeholder="Search or Enter State / Province"
                        value={layoutForm.state}
                        onChange={handleLayoutChange("state")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "state") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "state") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *State / Province is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "country") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Country"
                        required={isLayoutRequired("jobDetails", "country")}
                        placeholder="Search or Enter Country"
                        value={layoutForm.country}
                        onChange={handleLayoutChange("country")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "country") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "country") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Country is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "postalCode") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Postal Code"
                        required={isLayoutRequired("jobDetails", "postalCode")}
                        placeholder="Search or Enter Postal Code"
                        value={layoutForm.postalCode}
                        onChange={handleLayoutChange("postalCode")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "postalCode") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "postalCode") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Postal Code is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "minSalary") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Minimum Salary"
                        required={isLayoutRequired("jobDetails", "minSalary")}
                        placeholder="e.g., 80000"
                        value={layoutForm.minSalary}
                        onChange={handleLayoutChange("minSalary")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "minSalary") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "minSalary") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Minimum Salary is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "maxSalary") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Maximum Salary"
                        required={isLayoutRequired("jobDetails", "maxSalary")}
                        placeholder="e.g., 100000"
                        value={layoutForm.maxSalary}
                        onChange={handleLayoutChange("maxSalary")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "maxSalary") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "maxSalary") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Maximum Salary is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "frequency") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Frequency"
                        placeholder="Select Salary Frequency"
                        options={[]}
                        value={layoutForm.frequency}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, frequency: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "frequency") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "frequency") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Frequency is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "currency") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Currency"
                        placeholder="Select Salary Currency Type"
                        options={[]}
                        value={layoutForm.currency}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, currency: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "currency") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "currency") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Currency is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("jobDetails", "educationalQualifications") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Educational Qualification"
                        required={isLayoutRequired("jobDetails", "educationalQualifications")}
                        placeholder="e.g., Bachelor of Computer Science"
                        value={layoutForm.educationalQualification}
                        onChange={handleLayoutChange("educationalQualification")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "educationalQualifications") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("jobDetails", "educationalQualifications") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Educational Qualification is required.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isLayoutVisible("jobDetails", "jobDescription") && (
                  <div className="relative flex flex-col gap-3 pt-2">
                    <span className="text-[13px] font-[500] text-[#333333]">Job Description</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
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
                      <ReactQuill
                        theme="snow"
                        modules={jobDescModules}
                        formats={jobDescFormats}
                        placeholder="Enter job description..."
                        value={layoutForm.jobDescription}
                        onChange={(value: string) => {
                          const isEmpty = !getPlainTextFromHtml(value);
                          setLayoutForm((prev) => ({ ...prev, jobDescription: isEmpty ? "" : value }));
                        }}
                        className={cn(
                          "pf-job-quill",
                          showLayoutErrors &&
                          isFieldMissing("jobDetails", "jobDescription") &&
                          "pf-job-quill-error"
                        )}
                      />
                    </div>
                    {showLayoutErrors && isFieldMissing("jobDetails", "jobDescription") && (
                      <span className="absolute left-0 -bottom-4 text-[11px] text-[#E53935]">
                        *Job Description is required.
                      </span>
                    )}
                  </div>
                )}

                {isLayoutVisible("jobDetails", "skills") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Skills"
                      required={isLayoutRequired("jobDetails", "skills")}
                      placeholder="+ Add Skill"
                      value={layoutForm.skills}
                      onChange={handleLayoutChange("skills")}
                      className={cn(
                        showLayoutErrors &&
                        isFieldMissing("jobDetails", "skills") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showLayoutErrors && isFieldMissing("jobDetails", "skills") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Skills is required.
                      </span>
                    )}
                  </div>
                )}

                {isLayoutVisible("jobDetails", "jobApplicationQuestions") && (
                  <div className="relative flex flex-col gap-2 pb-[14px]">
                    <span className="text-[13px] font-[500] text-[#333333]">Job Application Questions for Candidates</span>
                    <FloatingLabelSelect
                      label="Select Questions"
                      placeholder="Do you have experience in a sales role?"
                      options={[]}
                      value={layoutForm.jobQuestions}
                      onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, jobQuestions: value }))}
                      className={cn(
                        showLayoutErrors &&
                        isFieldMissing("jobDetails", "jobApplicationQuestions") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    <div className="flex items-center justify-between text-[13px] text-[#333333]">
                      <span>What is your expected annual salary?</span>
                      {/* <button type="button" className="text-[#999999]">�</button> */}
                    </div>
                    {showLayoutErrors && isFieldMissing("jobDetails", "jobApplicationQuestions") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Job Application Questions is required.
                      </span>
                    )}            </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ order: getSectionOrder("admin") }}>
        {isSectionEnabled("admin") && (
          <>
            <LayoutHeader
              title="Admin"
              collapsed={!layoutOpen.admin}
              onToggle={() => setLayoutOpen((p) => ({ ...p, admin: !p.admin }))}
            />
            {layoutOpen.admin && (
              <div className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  <div className="relative">
                    <FloatingLabelInput
                      label="Job ID"
                      placeholder="System Generated ID"
                      value={layoutForm.jobId}
                      onChange={handleLayoutChange("jobId")}
                      className="pr-9"
                    />
                    <span className="pointer-events-none absolute right-3 top-[44px] -translate-y-1/2 text-[#999999]">
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
                    <span className="pointer-events-none absolute right-3 top-[44px] -translate-y-1/2 text-[#999999]">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <rect x="4" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </div>

                {isLayoutVisible("admin", "companyName") && (
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1 flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Company Name"
                        required={isLayoutRequired("admin", "companyName")}
                        placeholder="Select the company name you are hiring for"
                        value={layoutForm.companyName}
                        onChange={handleLayoutChange("companyName")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "companyName") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "companyName") && (
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {isLayoutVisible("admin", "contactName") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Contact Name"
                        placeholder="Select Contact Name"
                        options={[]}
                        value={layoutForm.contactName}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactName: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "contactName") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "contactName") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Contact Name is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "contactEmail") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Contact Email"
                        required={isLayoutRequired("admin", "contactEmail")}
                        placeholder="Contact Email"
                        value={layoutForm.contactEmail}
                        onChange={handleLayoutChange("contactEmail")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "contactEmail") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "contactEmail") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Contact Email is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "contactPhone") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Contact Phone"
                        required={isLayoutRequired("admin", "contactPhone")}
                        placeholder="Contact Phone Number"
                        value={layoutForm.contactPhone}
                        onChange={handleLayoutChange("contactPhone")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "contactPhone") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "contactPhone") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Contact Phone is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "noOfPositions") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="No. of Positions"
                        required={isLayoutRequired("admin", "noOfPositions")}
                        placeholder="e.g., 1"
                        value={layoutForm.positions}
                        onChange={handleLayoutChange("positions")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "noOfPositions") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "noOfPositions") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *No. of Positions is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "hiringPipeline") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Hiring Pipeline"
                        placeholder="Select Hiring Pipeline"
                        options={[]}
                        value={layoutForm.hiringPipeline}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, hiringPipeline: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "hiringPipeline") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "hiringPipeline") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Hiring Pipeline is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "targetDate") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Target Date"
                        required={isLayoutRequired("admin", "targetDate")}
                        placeholder="e.g., 31/10/2025"
                        type="date"
                        ref={targetDateRef}
                        value={layoutForm.targetDate}
                        onChange={handleLayoutChange("targetDate")}
                        onClick={() => openDatePicker(targetDateRef)}
                        className={cn(
                          "pr-9 pf-hide-native-date-icon",
                          showLayoutErrors &&
                          isFieldMissing("admin", "targetDate") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      <span className="pointer-events-none absolute right-3 top-11 -translate-y-1/2 text-[#666666]/70">
                        <CalendarIcon />
                      </span>
                      {showLayoutErrors && isFieldMissing("admin", "targetDate") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Target Date is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "minExperience") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Minimum Experience"
                        placeholder="0 Years"
                        options={[]}
                        value={layoutForm.minExperience}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, minExperience: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "minExperience") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "minExperience") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Minimum Experience is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "maxExperience") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Maximum Experience"
                        placeholder="0 Years"
                        options={[]}
                        value={layoutForm.maxExperience}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, maxExperience: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "maxExperience") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "maxExperience") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Maximum Experience is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "jobOwner") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Job Owner"
                        required={isLayoutRequired("admin", "jobOwner")}
                        placeholder="Lead Recruiter for This Role"
                        value={layoutForm.jobOwner}
                        onChange={handleLayoutChange("jobOwner")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "jobOwner") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "jobOwner") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Job Owner is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "hiringManager") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelInput
                        label="Hiring Manager"
                        required={isLayoutRequired("admin", "hiringManager")}
                        placeholder="Search for Reporting Manager"
                        value={layoutForm.hiringManager}
                        onChange={handleLayoutChange("hiringManager")}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "hiringManager") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "hiringManager") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Hiring Manager is required.
                        </span>
                      )}
                    </div>
                  )}
                  {isLayoutVisible("admin", "interviewScorecard") && (
                    <div className="relative flex flex-col pb-[14px]">
                      <FloatingLabelSelect
                        label="Interview Scorecard"
                        placeholder="e.g., Standard Engineering Template"
                        options={[]}
                        value={layoutForm.interviewScorecard}
                        onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, interviewScorecard: value }))}
                        className={cn(
                          showLayoutErrors &&
                          isFieldMissing("admin", "interviewScorecard") &&
                          "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        )}
                      />
                      {showLayoutErrors && isFieldMissing("admin", "interviewScorecard") && (
                        <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                          *Interview Scorecard is required.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isLayoutVisible("admin", "enableJobApplication") && (
                  <div className="relative flex flex-col gap-2 pb-[14px]">
                    <span className="text-[13px] border-b border-[#CCCCCC80] pb-2 font-[500] text-[#333333]">Job Application Form</span>
                    <div className="flex items-center gap-3 pt-2">
                      <Checkbox
                        checked={layoutForm.enableJobApplication}
                        onChange={(event) =>
                          setLayoutForm((prev) => ({ ...prev, enableJobApplication: event.target.checked }))
                        }
                        size="small"
                        sx={{
                          padding: 0,
                          "& .MuiSvgIcon-root": { fontSize: 18 },
                          "&.Mui-checked": { color: "#22C55E" },
                          "&.Mui-checked:hover": { backgroundColor: "transparent" },
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                        inputProps={{ "aria-label": "Enable Job Application Form" }}
                      />
                      <span className="text-[13px] text-[#333333]">Enable Job Application Form</span>
                    </div>
                    {showLayoutErrors && isFieldMissing("admin", "enableJobApplication") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Enable Job Application is required.
                      </span>
                    )}
                  </div>
                )}

                {isLayoutVisible("admin", "hiringTeamMembers") && (
                  <div className="relative flex flex-col gap-2 pb-[14px]">
                    <span className="text-[13px] border-b border-[#CCCCCC80] font-[500] text-[#333333]  pb-2">Add Hiring Team Members</span>
                    <div className="text-[12px]  pt-2 text-[#666666]">Manage the hiring team involved with this position</div>
                    <FloatingLabelSelect
                      label="User / Team"
                      placeholder="Select a User or Team"
                      options={[]}
                      value={layoutForm.hiringTeam}
                      onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, hiringTeam: value }))}
                      className={cn(
                        showLayoutErrors &&
                        isFieldMissing("admin", "hiringTeamMembers") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showLayoutErrors && isFieldMissing("admin", "hiringTeamMembers") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Hiring Team Members is required.
                      </span>
                    )}
                  </div>
                )}
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
            console.warn("Add Job");
          }}
        >
          Add Job
        </Button>
      </div> */}
    </div>
  );



  return (
    <div className="flex flex-col w-full ">
      <style>{`
        .pf-job-quill .ql-toolbar.ql-snow {
          border: 0;
          border-bottom: 1px solid #E6E6E6;
          background: #F9FAFB;
        }
        .pf-job-quill .ql-container.ql-snow {
          border: 0;
          min-height: 220px;
          font-size: 13px;
          color: #333333;
        }
        .pf-job-quill .ql-editor {
          min-height: 220px;
          line-height: 1.4;
        }
        .pf-job-quill .ql-editor.ql-blank::before {
          color: #999999;
          font-style: normal;
        }
        .pf-job-quill-error .ql-toolbar.ql-snow,
        .pf-job-quill-error .ql-container.ql-snow {
          border-color: #E53935;
        }
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

export default JobFields;
