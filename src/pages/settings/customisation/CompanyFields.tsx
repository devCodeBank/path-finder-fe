import React, { useMemo, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";
import { cn } from "@/lib/utils";
import { Tooltip } from "@mui/material";

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
        className="h-[52px] px-4 flex items-center justify-between rounded-[4px] border border-[#CCCCCC80] bg-[#FAFAFA] cursor-pointer"
        data-drag-section="true"
        onClick={() => onToggleCollapse(section.id)}
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
            title="Edit"
            arrow
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

export const CompanyFields: React.FC = () => {
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "companyDetails",
        title: "Company Details",
        enabled: true,
        rows: [
          { id: "companyName", label: "Company Name*", type: "Text", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "industry", label: "Industry*", type: "Single-Select Dropdown", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "clientType", label: "Client Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "website", label: "Website*", type: "Text (URL)", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: false },
          { id: "companySize", label: "Company Size", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: false },
          { id: "existingContacts", label: "Existing Contacts", type: "Searchable Dropdown", visibility: true, required: false, extension: false },
          { id: "xprofile", label: "X Profile", type: "Text (URL)", visibility: true, required: false, extension: false }
        ]
      },
      // {
      //   id: "aboutCompany",
      //   title: "About Company",
      //   enabled: true,
      //   rows: [
      //     { id: "about", label: "About Company", type: "Long Text", visibility: true, required: false, extension: false }
      //   ]
      // },
      {
        id: "location",
        title: "Location",
        enabled: true,
        rows: [
          { id: "fullAddress", label: "Full Address", type: "Text", visibility: true, required: false, extension: false },
          { id: "city", label: "City", type: "Text", visibility: true, required: false, extension: false },
          { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: false },
          { id: "country", label: "Country*", type: "Searchable Dropdown", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "postal", label: "Postal Code", type: "Text", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "accountManagement",
        title: "Account Management & Billing",
        enabled: true,
        rows: [
          { id: "accountStatus", label: "Account Status*", type: "Single-Select Dropdown", visibility: true, required: true, extension: false, visibilityLocked: true, requiredLocked: true },
          { id: "accountOwner", label: "Account Owner*", type: "Searchable Dropdown", visibility: true, required: true, extension: false, visibilityLocked: true, requiredLocked: true },
          { id: "source", label: "Source", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "billingTerms", label: "Billing Terms", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "taxVatId", label: "Tax / VAT ID", type: "Text", visibility: true, required: false, extension: false },
          { id: "estRevenue", label: "EST. Revenue", type: "Currency", visibility: true, required: false, extension: false }
        ]
      },
      // {
      //   id: "contactDetails",
      //   title: "Contact Details",
      //   enabled: true,
      //   rows: [
      //     { id: "firstName", label: "First Name", type: "Text", visibility: true, required: false, extension: true },
      //     { id: "lastName", label: "Last Name", type: "Text", visibility: true, required: false, extension: true },
      //     { id: "title", label: "Title", type: "Text", visibility: true, required: false, extension: true },
      //     { id: "contactType", label: "Contact Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: true },
      //     { id: "contactStage", label: "Contact Stage", type: "Single-Select Dropdown", visibility: true, required: false, extension: true }
      //   ]
      // },
      // {
      //   id: "contactCommunication",
      //   title: "Contact Communication",
      //   enabled: true,
      //   rows: [
      //     { id: "email", label: "Email", type: "Text (Email)", visibility: true, required: false, extension: true },
      //     { id: "phone", label: "Phone Number", type: "Text (Phone)", visibility: true, required: false, extension: true },
      //     { id: "altEmail", label: "Alt. Email", type: "Text (Email)", visibility: true, required: false, extension: true }
      //   ]
      // },
      // {
      //   id: "contactSocial",
      //   title: "Contact Social Links",
      //   enabled: true,
      //   rows: [
      //     { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
      //     { id: "xprofile", label: "X Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
      //     { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
      //     { id: "website", label: "Website", type: "Text (URL)", visibility: true, required: false, extension: true }
      //   ]
      // },
      // {
      //   id: "contactAddress",
      //   title: "Contact Address Info",
      //   enabled: true,
      //   rows: [
      //     { id: "fullAddress", label: "Full Address", type: "Text", visibility: true, required: false, extension: false },
      //     { id: "city", label: "City", type: "Text", visibility: true, required: false, extension: false },
      //     { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: false },
      //     { id: "country", label: "Country", type: "Text", visibility: true, required: false, extension: false },
      //     { id: "postal", label: "Postal Code", type: "Text", visibility: true, required: false, extension: false }
      //   ]
      // },
      // {
      //   id: "contactRelationship",
      //   title: "Contact Relationship",
      //   enabled: true,
      //   rows: [
      //     { id: "department", label: "Department", type: "Text", visibility: true, required: false, extension: true },
      //     { id: "manager", label: "Manager", type: "Text", visibility: true, required: false, extension: true }
      //   ]
      // }
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
    companyDetails: true,
    aboutCompany: true,
    location: false,
    accountManagement: false,
    contactDetails: true,
    contactCommunication: true,
    contactSocial: true,
    contactAddress: false,
    contactRelationship: false
  });
  const [layoutForm, setLayoutForm] = useState({
    companyName: "",
    industry: "",
    clientType: "",
    website: "",
    linkedin: "",
    companySize: "",
    facebook: "",
    existingContacts: "",
    xprofile: "",
    aboutCompany: "",
    fullAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    accountStatus: "",
    accountOwner: "",
    source: "",
    billingTerms: "",
    taxVatId: "",
    estRevenue: "",
    contactFirstName: "",
    contactLastName: "",
    contactTitle: "",
    contactType: "",
    contactStage: "",
    contactEmail: "",
    contactPhone: "",
    contactAltEmail: "",
    contactLinkedin: "",
    contactX: "",
    contactFacebook: "",
    contactWebsite: "",
    contactAddress: "",
    contactCity: "",
    contactState: "",
    contactCountry: "",
    contactPostalCode: "",
    contactDepartment: "",
    contactManager: ""
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

  const getFieldValue = (sectionId: string, rowId: string) => {
    const key = `${sectionId}.${rowId}`;
    const values: Record<string, string | boolean> = {
      "companyDetails.companyName": layoutForm.companyName,
      "companyDetails.industry": layoutForm.industry,
      "companyDetails.clientType": layoutForm.clientType,
      "companyDetails.website": layoutForm.website,
      "companyDetails.linkedin": layoutForm.linkedin,
      "companyDetails.companySize": layoutForm.companySize,
      "companyDetails.facebook": layoutForm.facebook,
      "companyDetails.existingContacts": layoutForm.existingContacts,
      "companyDetails.xprofile": layoutForm.xprofile,
      "companyDetails.aboutCompany": layoutForm.aboutCompany,
      "location.fullAddress": layoutForm.fullAddress,
      "location.city": layoutForm.city,
      "location.state": layoutForm.state,
      "location.country": layoutForm.country,
      "location.postal": layoutForm.postalCode,
      "accountManagement.accountStatus": layoutForm.accountStatus,
      "accountManagement.accountOwner": layoutForm.accountOwner,
      "accountManagement.source": layoutForm.source,
      "accountManagement.billingTerms": layoutForm.billingTerms,
      "accountManagement.taxVatId": layoutForm.taxVatId,
      "accountManagement.estRevenue": layoutForm.estRevenue,
      "contactDetails.firstName": layoutForm.contactFirstName,
      "contactDetails.lastName": layoutForm.contactLastName,
      "contactDetails.title": layoutForm.contactTitle,
      "contactDetails.contactType": layoutForm.contactType,
      "contactDetails.contactStage": layoutForm.contactStage,
      "contactCommunication.email": layoutForm.contactEmail,
      "contactCommunication.phone": layoutForm.contactPhone,
      "contactCommunication.altEmail": layoutForm.contactAltEmail,
      "contactSocialLinks.linkedin": layoutForm.contactLinkedin,
      "contactSocialLinks.xprofile": layoutForm.contactX,
      "contactSocialLinks.facebook": layoutForm.contactFacebook,
      "contactSocialLinks.website": layoutForm.contactWebsite,
      "contactAddressInfo.fullAddress": layoutForm.contactAddress,
      "contactAddressInfo.city": layoutForm.contactCity,
      "contactAddressInfo.state": layoutForm.contactState,
      "contactAddressInfo.country": layoutForm.contactCountry,
      "contactAddressInfo.postalCode": layoutForm.contactPostalCode,
      "contactRelationship.department": layoutForm.contactDepartment,
      "contactRelationship.manager": layoutForm.contactManager
    };
    return values[key];
  };

  const isFieldMissing = (sectionId: string, rowId: string) => {
    if (!isLayoutVisible(sectionId, rowId) || !isLayoutRequired(sectionId, rowId)) return false;
    const value = getFieldValue(sectionId, rowId);
    if (typeof value === "boolean") return !value;
    return !String(value ?? "").trim();
  };


  const handleLayoutChange =
    (key: keyof typeof layoutForm) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setLayoutForm((prev) => ({ ...prev, [key]: value }));
      };
  // const validateLayout = () => {
  //   const requiredFields: Array<{ sectionId: string; rowId: string }> = [
  //     { sectionId: "companyDetails", rowId: "companyName" },
  //     { sectionId: "companyDetails", rowId: "industry" },
  //     { sectionId: "companyDetails", rowId: "clientType" },
  //     { sectionId: "companyDetails", rowId: "website" },
  //     { sectionId: "companyDetails", rowId: "linkedin" },
  //     { sectionId: "companyDetails", rowId: "companySize" },
  //     { sectionId: "companyDetails", rowId: "facebook" },
  //     { sectionId: "companyDetails", rowId: "existingContacts" },
  //     { sectionId: "companyDetails", rowId: "xprofile" },
  //     { sectionId: "companyDetails", rowId: "aboutCompany" },
  //     { sectionId: "location", rowId: "fullAddress" },
  //     { sectionId: "location", rowId: "city" },
  //     { sectionId: "location", rowId: "state" },
  //     { sectionId: "location", rowId: "country" },
  //     { sectionId: "location", rowId: "postal" },
  //     { sectionId: "accountManagement", rowId: "accountStatus" },
  //     { sectionId: "accountManagement", rowId: "accountOwner" },
  //     { sectionId: "accountManagement", rowId: "source" },
  //     { sectionId: "accountManagement", rowId: "billingTerms" },
  //     { sectionId: "accountManagement", rowId: "taxVatId" },
  //     { sectionId: "accountManagement", rowId: "estRevenue" },
  //     { sectionId: "contactDetails", rowId: "firstName" },
  //     { sectionId: "contactDetails", rowId: "lastName" },
  //     { sectionId: "contactDetails", rowId: "title" },
  //     { sectionId: "contactDetails", rowId: "contactType" },
  //     { sectionId: "contactDetails", rowId: "contactStage" },
  //     { sectionId: "contactCommunication", rowId: "email" },
  //     { sectionId: "contactCommunication", rowId: "phone" },
  //     { sectionId: "contactCommunication", rowId: "altEmail" },
  //     { sectionId: "contactSocialLinks", rowId: "linkedin" },
  //     { sectionId: "contactSocialLinks", rowId: "xprofile" },
  //     { sectionId: "contactSocialLinks", rowId: "facebook" },
  //     { sectionId: "contactSocialLinks", rowId: "website" },
  //     { sectionId: "contactAddressInfo", rowId: "fullAddress" },
  //     { sectionId: "contactAddressInfo", rowId: "city" },
  //     { sectionId: "contactAddressInfo", rowId: "state" },
  //     { sectionId: "contactAddressInfo", rowId: "country" },
  //     { sectionId: "contactAddressInfo", rowId: "postalCode" },
  //     { sectionId: "contactRelationship", rowId: "department" },
  //     { sectionId: "contactRelationship", rowId: "manager" }
  //   ];

  //   return !requiredFields.some(({ sectionId, rowId }) => isFieldMissing(sectionId, rowId));
  // };

  const getMissingLayoutFields = () => {
    const missing: string[] = [];
    sections.forEach((section) => {
      section.rows.forEach((row) => {
        if (isFieldMissing(section.id, row.id)) {
          missing.push(row.label);
        }
      });
    });
    return missing;
  };

  const missingLayoutFields = showLayoutErrors ? getMissingLayoutFields() : [];

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
          className="h-[36px] px-4 rounded-[4px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
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
              <button
                type="button"
                aria-label="Close"
                className="h-[28px] w-[28px] rounded-[6px] text-[#666666] hover:bg-[#F3F4F6]"
                onClick={handleCloseEditSectionTitle}
              >
                ×
              </button>
            </div>
            <div className="mt-6">
              <input
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
      {showLayoutErrors && missingLayoutFields.length > 0 && (
        <div className="rounded-[6px] border border-[#E53935] bg-[#FDECEC] px-3 py-2 text-[12px] text-[#B71C1C]">
          <div className="font-[600]">Please fill required fields:</div>
          <div className="mt-1">{missingLayoutFields.join(", ")}</div>
        </div>
      )}
      {isSectionEnabled("companyDetails") && (
        <>
          <LayoutHeader
            title="Company Details"
            collapsed={!layoutOpen.companyDetails}
            onToggle={() => setLayoutOpen((p) => ({ ...p, companyDetails: !p.companyDetails }))}
          />
          {layoutOpen.companyDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("companyDetails", "companyName") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Company Name"
                    required={isLayoutRequired("companyDetails", "companyName")}
                    placeholder="e.g., Acme Corporation"
                    value={layoutForm.companyName}
                    onChange={handleLayoutChange("companyName")}
                    className={cn(
                      showLayoutErrors &&
                      isLayoutRequired("companyDetails", "companyName") &&
                      !layoutForm.companyName.trim() &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showLayoutErrors &&
                    isLayoutRequired("companyDetails", "companyName") &&
                    !layoutForm.companyName.trim() && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Company Name is required.
                      </span>
                    )}
                </div>
              )}
              {isLayoutVisible("companyDetails", "industry") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Industry"
                    placeholder="Select Industry"
                    options={[]}
                    value={layoutForm.industry}
                    onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, industry: value }))}
                    className={cn(
                      showLayoutErrors &&
                      isLayoutRequired("companyDetails", "industry") &&
                      !layoutForm.industry.trim() &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showLayoutErrors &&
                    isLayoutRequired("companyDetails", "industry") &&
                    !layoutForm.industry.trim() && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Industry is required.
                      </span>
                    )}
                </div>
              )}
              {isLayoutVisible("companyDetails", "clientType") && (
                <FloatingLabelSelect
                  label="Client Type"
                  placeholder="Select Client Type"
                  options={[]}
                  value={layoutForm.clientType}
                  onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, clientType: value }))}
                />
              )}
              {isLayoutVisible("companyDetails", "website") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Website"
                    required={isLayoutRequired("companyDetails", "website")}
                    placeholder="http://www.example.com"
                    value={layoutForm.website}
                    onChange={handleLayoutChange("website")}
                    className={cn(
                      showLayoutErrors &&
                      isLayoutRequired("companyDetails", "website") &&
                      !layoutForm.website.trim() &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showLayoutErrors &&
                    isLayoutRequired("companyDetails", "website") &&
                    !layoutForm.website.trim() && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Website is required.
                      </span>
                    )}
                </div>
              )}
              {isLayoutVisible("companyDetails", "linkedin") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="LinkedIn Profile"
                    placeholder="www.linkedin.com/acme"
                    value={layoutForm.linkedin}
                    onChange={handleLayoutChange("linkedin")}
                  />
                </div>
              )}

              {isLayoutVisible("companyDetails", "companySize") && (
                <FloatingLabelSelect
                  label="Company Size"
                  placeholder="Select Company Size"
                  options={[]}
                  value={layoutForm.companySize}
                  onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, companySize: value }))}
                />
              )}
              {isLayoutVisible("companyDetails", "facebook") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Facebook Profile"
                    placeholder="www.facebook.com/acme"
                    value={layoutForm.facebook}
                    onChange={handleLayoutChange("facebook")}
                  />
                </div>
              )}
              {isLayoutVisible("companyDetails", "existingContacts") && (
                <FloatingLabelInput
                  label="Existing Contacts"
                  placeholder="Search by Name or Email"
                  value={layoutForm.existingContacts}
                  onChange={handleLayoutChange("existingContacts")}
                />
              )}
              {isLayoutVisible("companyDetails", "xprofile") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="X Profile"
                    placeholder="www.x.com/acme"
                    value={layoutForm.xprofile}
                    onChange={handleLayoutChange("xprofile")}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* <LayoutHeader
        title="About Company"
        collapsed={!layoutOpen.aboutCompany}
        onToggle={() => setLayoutOpen((p) => ({ ...p, aboutCompany: !p.aboutCompany }))}
      />
      {layoutOpen.aboutCompany && (
        isLayoutVisible("aboutCompany", "about") && (
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
              placeholder="About Company"
              value={layoutForm.aboutCompany}
              onChange={handleLayoutChange("aboutCompany")}
            />
          </div>
        )
      )} */}

      {isSectionEnabled("location") && (
        <>
          <LayoutHeader
            title="Location"
            collapsed={!layoutOpen.location}
            onToggle={() => setLayoutOpen((p) => ({ ...p, location: !p.location }))}
          />
          {layoutOpen.location && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {isLayoutVisible("location", "fullAddress") && (
                <div className="md:col-span-2">
                  <FloatingLabelInput
                    label="Full Address"
                    placeholder="e.g., 123 Business Way, Suite 500"
                    value={layoutForm.fullAddress}
                    onChange={handleLayoutChange("fullAddress")}
                  />
                </div>
              )}
              {isLayoutVisible("location", "city") && (
                <FloatingLabelInput
                  label="City"
                  placeholder="Search or Enter City"
                  value={layoutForm.city}
                  onChange={handleLayoutChange("city")}
                />
              )}
              {isLayoutVisible("location", "state") && (
                <FloatingLabelInput
                  label="State / Province"
                  placeholder="Search or Add State / Province"
                  value={layoutForm.state}
                  onChange={handleLayoutChange("state")}
                />
              )}
              {isLayoutVisible("location", "country") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Country"
                    required={isLayoutRequired("location", "country")}
                    placeholder="Search or Enter Country"
                    value={layoutForm.country}
                    onChange={handleLayoutChange("country")}
                    className={cn(
                      showLayoutErrors &&
                      isLayoutRequired("location", "country") &&
                      !layoutForm.country.trim() &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showLayoutErrors &&
                    isLayoutRequired("location", "country") &&
                    !layoutForm.country.trim() && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Country is required.
                      </span>
                    )}
                </div>
              )}
              {isLayoutVisible("location", "postal") && (
                <FloatingLabelInput
                  label="Postal Code"
                  placeholder="Search or Enter Postal Code"
                  value={layoutForm.postalCode}
                  onChange={handleLayoutChange("postalCode")}
                />
              )}
            </div>
          )}
        </>
      )}

      {isSectionEnabled("accountManagement") && (
        <>
          <LayoutHeader
            title="Account Management & Billing"
            collapsed={!layoutOpen.accountManagement}
            onToggle={() => setLayoutOpen((p) => ({ ...p, accountManagement: !p.accountManagement }))}
          />
          {layoutOpen.accountManagement && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("accountManagement", "accountStatus") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Account Status"
                    placeholder="Select Account Status"
                    options={[]}
                    value={layoutForm.accountStatus}
                    onValueChange={(value) =>
                      setLayoutForm((prev) => ({ ...prev, accountStatus: value }))
                    }
                    className={cn(
                      showLayoutErrors &&
                      isLayoutRequired("accountManagement", "accountStatus") &&
                      !layoutForm.accountStatus.trim() &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showLayoutErrors &&
                    isLayoutRequired("accountManagement", "accountStatus") &&
                    !layoutForm.accountStatus.trim() && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Account Status is required.
                      </span>
                    )}
                </div>
              )}
              {isLayoutVisible("accountManagement", "accountOwner") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Account Owner"
                    required={isLayoutRequired("accountManagement", "accountOwner")}
                    placeholder="Search or Enter Account Owner"
                    value={layoutForm.accountOwner}
                    onChange={handleLayoutChange("accountOwner")}
                    className={cn(
                      showLayoutErrors &&
                      isLayoutRequired("accountManagement", "accountOwner") &&
                      !layoutForm.accountOwner.trim() &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showLayoutErrors &&
                    isLayoutRequired("accountManagement", "accountOwner") &&
                    !layoutForm.accountOwner.trim() && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Account Owner is required.
                      </span>
                    )}
                </div>
              )}
              {isLayoutVisible("accountManagement", "source") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Source"
                    placeholder="Select Source"
                    options={[]}
                    value={layoutForm.source}
                    onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, source: value }))}
                  />
                </div>
              )}
              {isLayoutVisible("accountManagement", "billingTerms") && (
                <FloatingLabelSelect
                  label="Billing Terms"
                  placeholder="Select Billing Terms"
                  options={[]}
                  value={layoutForm.billingTerms}
                  onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, billingTerms: value }))}
                />
              )}
              {isLayoutVisible("accountManagement", "taxVatId") && (
                <FloatingLabelInput
                  label="Tax / VAT ID"
                  placeholder="Add Tax / VAT ID"
                  value={layoutForm.taxVatId}
                  onChange={handleLayoutChange("taxVatId")}
                />
              )}
              {isLayoutVisible("accountManagement", "estRevenue") && (
                <FloatingLabelInput
                  label="EST. Revenue"
                  placeholder="Add Estimated Annual Revenue"
                  value={layoutForm.estRevenue}
                  onChange={handleLayoutChange("estRevenue")}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* <LayoutHeader
        title="Contact Details"
        collapsed={!layoutOpen.contactDetails}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactDetails: !p.contactDetails }))}
      />
      {layoutOpen.contactDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {isLayoutVisible("contactDetails", "firstName") && (
            <FloatingLabelInput
              label="First Name"
              placeholder="e.g., Maria"
              value={layoutForm.contactFirstName}
              onChange={handleLayoutChange("contactFirstName")}
            />
          )}
          {isLayoutVisible("contactDetails", "lastName") && (
            <FloatingLabelInput
              label="Last Name"
              placeholder="e.g., Lopez"
              value={layoutForm.contactLastName}
              onChange={handleLayoutChange("contactLastName")}
            />
          )}
          {isLayoutVisible("contactDetails", "title") && (
            <FloatingLabelInput
              label="Title"
              placeholder="e.g., HR Director"
              value={layoutForm.contactTitle}
              onChange={handleLayoutChange("contactTitle")}
            />
          )}
          {isLayoutVisible("contactDetails", "contactType") && (
            <FloatingLabelSelect
              label="Contact Type"
              placeholder="Select Contact Type"
              options={[]}
              value={layoutForm.contactType}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactType: value }))}
            />
          )}
          {isLayoutVisible("contactDetails", "contactStage") && (
            <FloatingLabelSelect
              label="Contact Stage"
              placeholder="Lead"
              options={[]}
              value={layoutForm.contactStage}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactStage: value }))}
            />
          )}
        </div>
      )}

      <LayoutHeader
        title="Contact Communication"
        collapsed={!layoutOpen.contactCommunication}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactCommunication: !p.contactCommunication }))}
      />
      {layoutOpen.contactCommunication && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {isLayoutVisible("contactCommunication", "email") && (
            <FloatingLabelInput
              label="Email"
              placeholder="e.g., maria.lopez@example.com"
              value={layoutForm.contactEmail}
              onChange={handleLayoutChange("contactEmail")}
            />
          )}
          {isLayoutVisible("contactCommunication", "phone") && (
            <FloatingLabelInput
              label="Phone Number"
              placeholder="e.g., +1 555-0123"
              value={layoutForm.contactPhone}
              onChange={handleLayoutChange("contactPhone")}
            />
          )}
          {isLayoutVisible("contactCommunication", "altEmail") && (
            <FloatingLabelInput
              label="Alt. Email"
              placeholder="e.g., maria.lopez@example.com"
              value={layoutForm.contactAltEmail}
              onChange={handleLayoutChange("contactAltEmail")}
            />
          )}
        </div>
      )}

      <LayoutHeader
        title="Contact Social Links"
        collapsed={!layoutOpen.contactSocial}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactSocial: !p.contactSocial }))}
      />
      {layoutOpen.contactSocial && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {isLayoutVisible("contactSocial", "linkedin") && (
            <FloatingLabelInput
              label="LinkedIn Profile"
              placeholder="www.linkedin.com/marialopez"
              value={layoutForm.contactLinkedin}
              onChange={handleLayoutChange("contactLinkedin")}
            />
          )}
          {isLayoutVisible("contactSocial", "xprofile") && (
            <FloatingLabelInput
              label="X Profile"
              placeholder="www.x.com/marialopez"
              value={layoutForm.contactX}
              onChange={handleLayoutChange("contactX")}
            />
          )}
          {isLayoutVisible("contactSocial", "facebook") && (
            <FloatingLabelInput
              label="Facebook Profile"
              placeholder="www.facebook.com/marialopez"
              value={layoutForm.contactFacebook}
              onChange={handleLayoutChange("contactFacebook")}
            />
          )}
          {isLayoutVisible("contactSocial", "website") && (
            <FloatingLabelInput
              label="Website"
              placeholder="http://www.example.com"
              value={layoutForm.contactWebsite}
              onChange={handleLayoutChange("contactWebsite")}
            />
          )}
        </div>
      )} */}

      {/* <LayoutHeader
        title="Contact Address Info"
        collapsed={!layoutOpen.contactAddress}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactAddress: !p.contactAddress }))}
      />
      {layoutOpen.contactAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {isLayoutVisible("contactAddress", "fullAddress") && (
            <div className="md:col-span-2">
              <FloatingLabelInput
                label="Full Address"
                placeholder="e.g., 123 Wall St, Apt 4B"
                value={layoutForm.contactAddress}
                onChange={handleLayoutChange("contactAddress")}
              />
            </div>
          )}
          {isLayoutVisible("contactAddress", "city") && (
            <FloatingLabelInput
              label="City"
              placeholder="Search or Enter City"
              value={layoutForm.contactCity}
              onChange={handleLayoutChange("contactCity")}
            />
          )}
          {isLayoutVisible("contactAddress", "state") && (
            <FloatingLabelInput
              label="State / Province"
              placeholder="Search or Enter State"
              value={layoutForm.contactState}
              onChange={handleLayoutChange("contactState")}
            />
          )}
          {isLayoutVisible("contactAddress", "country") && (
            <FloatingLabelInput
              label="Country"
              placeholder="Search or Enter Country"
              value={layoutForm.contactCountry}
              onChange={handleLayoutChange("contactCountry")}
            />
          )}
          {isLayoutVisible("contactAddress", "postal") && (
            <FloatingLabelInput
              label="Postal Code"
              placeholder="Search or Enter Postal Code"
              value={layoutForm.contactPostalCode}
              onChange={handleLayoutChange("contactPostalCode")}
            />
          )}
        </div>
      )}

      <LayoutHeader
        title="Contact Relationship"
        collapsed={!layoutOpen.contactRelationship}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactRelationship: !p.contactRelationship }))}
      />
      {layoutOpen.contactRelationship && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {isLayoutVisible("contactRelationship", "department") && (
            <FloatingLabelInput
              label="Department"
              placeholder="e.g., Human Resources"
              value={layoutForm.contactDepartment}
              onChange={handleLayoutChange("contactDepartment")}
            />
          )}
          {isLayoutVisible("contactRelationship", "manager") && (
            <FloatingLabelInput
              label="Manager"
              placeholder="e.g., John Doe - COO"
              value={layoutForm.contactManager}
              onChange={handleLayoutChange("contactManager")}
            />
          )}
        </div>
      )} */}

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
            console.warn("Add Company");
          }}
        >
          Add Company
        </Button>
      </div> */}
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

export default CompanyFields;

