import React, { useMemo, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";
import { cn } from "@/lib/utils";
import { Button, Tooltip } from "@mui/material";

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
        className="h-[52px] px-4 flex items-center justify-between border rounded-[4px]  border-[#CCCCCC80] bg-[#FAFAFA] cursor-pointer"
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

export const ContactFields: React.FC = () => {
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "contactDetails",
        title: "Contact Details",
        enabled: true,
        rows: [
          { id: "firstName", label: "First Name", type: "Text", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "lastName", label: "Last Name", type: "Text", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "title", label: "Title", type: "Text", visibility: true, required: false, extension: true, extensionLocked: true },
          { id: "contactType", label: "Contact Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "contactStage", label: "Contact Stage", type: "Single-Select Dropdown", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "recordDetails",
        title: "Record Details",
        enabled: true,
        rows: [
          { id: "contactOwner", label: "Contact Owner", type: "Searchable Dropdown", visibility: true, required: true, extension: false, visibilityLocked: true, requiredLocked: true },
          { id: "source", label: "Source", type: "Single-Select Dropdown", visibility: true, required: true, extension: false, visibilityLocked: true, requiredLocked: true }
        ]
      },
      {
        id: "contactAddressInfo",
        title: "Contact Address Info",
        enabled: true,
        rows: [
          { id: "fullAddress", label: "Full Address", type: "Text", visibility: true, required: false, extension: true, extensionLocked: true },
          { id: "city", label: "City", type: "Text", visibility: true, required: false, extension: false },
          { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: true, extensionLocked: true },
          { id: "country", label: "Country", type: "Single-Select Dropdown", visibility: true, required: false, extension: false },
          { id: "postalCode", label: "Postal Code", type: "Text (String)", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "contactCommunication",
        title: "Contact Communication",
        enabled: true,
        rows: [
          { id: "email", label: "Email", type: "Text (Email)", visibility: true, required: true, extension: true, visibilityLocked: true, requiredLocked: true, extensionLocked: true },
          { id: "phone", label: "Phone Number", type: "Text (Phone)", visibility: true, required: false, extension: true, extensionLocked: true },
          { id: "altEmail", label: "Alt. Email", type: "Text (Email)", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "contactRelationship",
        title: "Contact Relationship",
        enabled: true,
        rows: [
          { id: "company", label: "Company", type: "Record Link (Company)", visibility: true, required: true, extension: true, extensionLocked: true },
          { id: "department", label: "Department", type: "Text", visibility: true, required: false, extension: false },
          { id: "manager", label: "Manager", type: "Record Link (Contact)", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "contactSocialLinks",
        title: "Contact Social Links",
        enabled: true,
        rows: [
          { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: true, extensionLocked: true },
          { id: "xprofile", label: "X profile", type: "Text (URL)", visibility: true, required: false, extension: false },
          { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: false },
          { id: "website", label: "Website", type: "Text (URL)", visibility: true, required: false, extension: false }
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
    contactDetails: true,
    recordDetails: true,
    contactAddressInfo: false,
    contactCommunication: true,
    contactRelationship: true,
    contactSocialLinks: true
  });
  const [layoutForm, setLayoutForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
    contactType: "",
    contactStage: "",
    contactOwner: "",
    source: "",
    fullAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    email: "",
    phone: "",
    altEmail: "",
    company: "",
    department: "",
    manager: "",
    linkedin: "",
    xprofile: "",
    facebook: "",
    website: ""
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
      "contactDetails.firstName": layoutForm.firstName,
      "contactDetails.lastName": layoutForm.lastName,
      "contactDetails.title": layoutForm.title,
      "contactDetails.contactType": layoutForm.contactType,
      "contactDetails.contactStage": layoutForm.contactStage,
      "recordDetails.contactOwner": layoutForm.contactOwner,
      "recordDetails.source": layoutForm.source,
      "contactAddressInfo.fullAddress": layoutForm.fullAddress,
      "contactAddressInfo.city": layoutForm.city,
      "contactAddressInfo.state": layoutForm.state,
      "contactAddressInfo.country": layoutForm.country,
      "contactAddressInfo.postalCode": layoutForm.postalCode,
      "contactCommunication.email": layoutForm.email,
      "contactCommunication.phone": layoutForm.phone,
      "contactCommunication.altEmail": layoutForm.altEmail,
      "contactRelationship.company": layoutForm.company,
      "contactRelationship.department": layoutForm.department,
      "contactRelationship.manager": layoutForm.manager,
      "contactSocialLinks.linkedin": layoutForm.linkedin,
      "contactSocialLinks.xprofile": layoutForm.xprofile,
      "contactSocialLinks.facebook": layoutForm.facebook,
      "contactSocialLinks.website": layoutForm.website
    };
    return values[key];
  };

  const isFieldMissing = (sectionId: string, rowId: string) => {
    if (!isLayoutVisible(sectionId, rowId) || !isLayoutRequired(sectionId, rowId)) return false;
    const value = getFieldValue(sectionId, rowId);
    if (typeof value === "boolean") return !value;
    return !String(value ?? "").trim();
  };

  const showFieldError = (sectionId: string, rowId: string) =>
    showLayoutErrors && isFieldMissing(sectionId, rowId);

  const handleLayoutChange =
    (key: keyof typeof layoutForm) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setLayoutForm((prev) => ({ ...prev, [key]: value }));
      };
  // const validateLayout = () => {
  //   const requiredFields: Array<{ sectionId: string; rowId: string }> = [
  //     { sectionId: "contactDetails", rowId: "firstName" },
  //     { sectionId: "contactDetails", rowId: "lastName" },
  //     { sectionId: "contactDetails", rowId: "title" },
  //     { sectionId: "contactDetails", rowId: "contactType" },
  //     { sectionId: "contactDetails", rowId: "contactStage" },
  //     { sectionId: "recordDetails", rowId: "contactOwner" },
  //     { sectionId: "recordDetails", rowId: "source" },
  //     { sectionId: "contactAddressInfo", rowId: "fullAddress" },
  //     { sectionId: "contactAddressInfo", rowId: "city" },
  //     { sectionId: "contactAddressInfo", rowId: "state" },
  //     { sectionId: "contactAddressInfo", rowId: "country" },
  //     { sectionId: "contactAddressInfo", rowId: "postalCode" },
  //     { sectionId: "contactCommunication", rowId: "email" },
  //     { sectionId: "contactCommunication", rowId: "phone" },
  //     { sectionId: "contactCommunication", rowId: "altEmail" },
  //     { sectionId: "contactRelationship", rowId: "company" },
  //     { sectionId: "contactRelationship", rowId: "department" },
  //     { sectionId: "contactRelationship", rowId: "manager" },
  //     { sectionId: "contactSocialLinks", rowId: "linkedin" },
  //     { sectionId: "contactSocialLinks", rowId: "xprofile" },
  //     { sectionId: "contactSocialLinks", rowId: "facebook" },
  //     { sectionId: "contactSocialLinks", rowId: "website" }
  //   ];

  //   return !requiredFields.some(({ sectionId, rowId }) => isFieldMissing(sectionId, rowId));
  // };

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
      {isSectionEnabled("contactDetails") && (
        <>
          <LayoutHeader
            title="Contact Details"
            collapsed={!layoutOpen.contactDetails}
            onToggle={() => setLayoutOpen((p) => ({ ...p, contactDetails: !p.contactDetails }))}
          />
          {layoutOpen.contactDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("contactDetails", "firstName") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="First Name"
                    required={isLayoutRequired("contactDetails", "firstName")}
                    placeholder="e.g., Sarah"
                    value={layoutForm.firstName}
                    onChange={handleLayoutChange("firstName")}
                    className={cn(
                      showFieldError("contactDetails", "firstName") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactDetails", "firstName") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *First Name is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactDetails", "lastName") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Last Name"
                    required={isLayoutRequired("contactDetails", "lastName")}
                    placeholder="e.g., Johnson"
                    value={layoutForm.lastName}
                    onChange={handleLayoutChange("lastName")}
                    className={cn(
                      showFieldError("contactDetails", "lastName") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactDetails", "lastName") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Last Name is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactDetails", "title") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Title"
                    required={isLayoutRequired("contactDetails", "title")}
                    placeholder="e.g., Chief Technology Officer"
                    value={layoutForm.title}
                    onChange={handleLayoutChange("title")}
                    className={cn(
                      showFieldError("contactDetails", "title") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactDetails", "title") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Title is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactDetails", "contactType") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Contact Type"
                    placeholder="Select Contact Type"
                    options={[]}
                    value={layoutForm.contactType}
                    onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactType: value }))}
                    className={cn(
                      showFieldError("contactDetails", "contactType") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactDetails", "contactType") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Contact Type is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactDetails", "contactStage") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Contact Stage"
                    placeholder="Lead"
                    options={[]}
                    value={layoutForm.contactStage}
                    onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactStage: value }))}
                    className={cn(
                      showFieldError("contactDetails", "contactStage") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactDetails", "contactStage") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Contact Stage is required.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isSectionEnabled("recordDetails") && (
        <>
          <LayoutHeader
            title="Record Details"
            collapsed={!layoutOpen.recordDetails}
            onToggle={() => setLayoutOpen((p) => ({ ...p, recordDetails: !p.recordDetails }))}
          />
          {layoutOpen.recordDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("recordDetails", "contactOwner") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Contact Owner"
                    placeholder="John Doe"
                    options={[]}
                    value={layoutForm.contactOwner}
                    onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactOwner: value }))}
                    className={cn(
                      showFieldError("recordDetails", "contactOwner") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("recordDetails", "contactOwner") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Contact Owner is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("recordDetails", "source") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelSelect
                    label="Source"
                    placeholder="Added by user"
                    options={[]}
                    value={layoutForm.source}
                    onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, source: value }))}
                    className={cn(
                      showFieldError("recordDetails", "source") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("recordDetails", "source") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Source is required.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isSectionEnabled("contactAddressInfo") && (
        <>
          <LayoutHeader
            title="Contact Address Info"
            collapsed={!layoutOpen.contactAddressInfo}
            onToggle={() => setLayoutOpen((p) => ({ ...p, contactAddressInfo: !p.contactAddressInfo }))}
          />
          {layoutOpen.contactAddressInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("contactAddressInfo", "fullAddress") && (
                <div className="relative flex flex-col pb-[14px] md:col-span-2">
                  <FloatingLabelInput
                    label="Full Address"
                    required={isLayoutRequired("contactAddressInfo", "fullAddress")}
                    placeholder="e.g., 123 Business Way, Suite 500"
                    value={layoutForm.fullAddress}
                    onChange={handleLayoutChange("fullAddress")}
                    className={cn(
                      showFieldError("contactAddressInfo", "fullAddress") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactAddressInfo", "fullAddress") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Full Address is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactAddressInfo", "city") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="City"
                    required={isLayoutRequired("contactAddressInfo", "city")}
                    placeholder="Search or Enter City"
                    value={layoutForm.city}
                    onChange={handleLayoutChange("city")}
                    className={cn(
                      showFieldError("contactAddressInfo", "city") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactAddressInfo", "city") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *City is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactAddressInfo", "state") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="State / Province"
                    required={isLayoutRequired("contactAddressInfo", "state")}
                    placeholder="Search or Enter State / Province"
                    value={layoutForm.state}
                    onChange={handleLayoutChange("state")}
                    className={cn(
                      showFieldError("contactAddressInfo", "state") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactAddressInfo", "state") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *State / Province is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactAddressInfo", "country") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Country"
                    required={isLayoutRequired("contactAddressInfo", "country")}
                    placeholder="Search or Enter Country"
                    value={layoutForm.country}
                    onChange={handleLayoutChange("country")}
                    className={cn(
                      showFieldError("contactAddressInfo", "country") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactAddressInfo", "country") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Country is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactAddressInfo", "postalCode") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Postal Code"
                    required={isLayoutRequired("contactAddressInfo", "postalCode")}
                    placeholder="Search or Enter Postal Code"
                    value={layoutForm.postalCode}
                    onChange={handleLayoutChange("postalCode")}
                    className={cn(
                      showFieldError("contactAddressInfo", "postalCode") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactAddressInfo", "postalCode") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Postal Code is required.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isSectionEnabled("contactCommunication") && (
        <>
          <LayoutHeader
            title="Contact Communication"
            collapsed={!layoutOpen.contactCommunication}
            onToggle={() => setLayoutOpen((p) => ({ ...p, contactCommunication: !p.contactCommunication }))}
          />
          {layoutOpen.contactCommunication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("contactCommunication", "email") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Email"
                    required={isLayoutRequired("contactCommunication", "email")}
                    placeholder="e.g., sarah.johnson@example.com"
                    value={layoutForm.email}
                    onChange={handleLayoutChange("email")}
                    className={cn(
                      showFieldError("contactCommunication", "email") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactCommunication", "email") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Email is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactCommunication", "phone") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Phone Number"
                    required={isLayoutRequired("contactCommunication", "phone")}
                    placeholder="e.g., +1 555-0123"
                    value={layoutForm.phone}
                    onChange={handleLayoutChange("phone")}
                    className={cn(
                      showFieldError("contactCommunication", "phone") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactCommunication", "phone") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Phone Number is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactCommunication", "altEmail") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Alt. Email"
                    required={isLayoutRequired("contactCommunication", "altEmail")}
                    placeholder="e.g., sarah.johnson@example.com"
                    value={layoutForm.altEmail}
                    onChange={handleLayoutChange("altEmail")}
                    className={cn(
                      showFieldError("contactCommunication", "altEmail") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactCommunication", "altEmail") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Alt. Email is required.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isSectionEnabled("contactRelationship") && (
        <>
          <LayoutHeader
            title="Contact Relationship"
            collapsed={!layoutOpen.contactRelationship}
            onToggle={() => setLayoutOpen((p) => ({ ...p, contactRelationship: !p.contactRelationship }))}
          />
          {layoutOpen.contactRelationship && (
            <div className="flex flex-col gap-4">
              {isLayoutVisible("contactRelationship", "company") && (
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="relative flex-1 flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Company"
                      required={isLayoutRequired("contactRelationship", "company")}
                      placeholder="Search by Company Name or ID"
                      value={layoutForm.company}
                      onChange={handleLayoutChange("company")}
                      className={cn(
                        showFieldError("contactRelationship", "company") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("contactRelationship", "company") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Company is required.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                {isLayoutVisible("contactRelationship", "department") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Department"
                      required={isLayoutRequired("contactRelationship", "department")}
                      placeholder="e.g., Engineering"
                      value={layoutForm.department}
                      onChange={handleLayoutChange("department")}
                      className={cn(
                        showFieldError("contactRelationship", "department") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("contactRelationship", "department") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Department is required.
                      </span>
                    )}
                  </div>
                )}
                {isLayoutVisible("contactRelationship", "manager") && (
                  <div className="relative flex flex-col pb-[14px]">
                    <FloatingLabelInput
                      label="Manager"
                      required={isLayoutRequired("contactRelationship", "manager")}
                      placeholder="e.g., John Doe"
                      value={layoutForm.manager}
                      onChange={handleLayoutChange("manager")}
                      className={cn(
                        showFieldError("contactRelationship", "manager") &&
                        "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                      )}
                    />
                    {showFieldError("contactRelationship", "manager") && (
                      <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                        *Manager is required.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {isSectionEnabled("contactSocialLinks") && (
        <>
          <LayoutHeader
            title="Contact Social Links"
            collapsed={!layoutOpen.contactSocialLinks}
            onToggle={() => setLayoutOpen((p) => ({ ...p, contactSocialLinks: !p.contactSocialLinks }))}
          />
          {layoutOpen.contactSocialLinks && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {isLayoutVisible("contactSocialLinks", "linkedin") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="LinkedIn Profile"
                    required={isLayoutRequired("contactSocialLinks", "linkedin")}
                    placeholder="www.linkedin.com/sarahjohnson"
                    value={layoutForm.linkedin}
                    onChange={handleLayoutChange("linkedin")}
                    className={cn(
                      showFieldError("contactSocialLinks", "linkedin") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactSocialLinks", "linkedin") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *LinkedIn Profile is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactSocialLinks", "xprofile") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="X Profile"
                    required={isLayoutRequired("contactSocialLinks", "xprofile")}
                    placeholder="www.x.com/sarahjohnson"
                    value={layoutForm.xprofile}
                    onChange={handleLayoutChange("xprofile")}
                    className={cn(
                      showFieldError("contactSocialLinks", "xprofile") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactSocialLinks", "xprofile") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *X Profile is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactSocialLinks", "facebook") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Facebook Profile"
                    required={isLayoutRequired("contactSocialLinks", "facebook")}
                    placeholder="www.facebook.com/sarahjohnson"
                    value={layoutForm.facebook}
                    onChange={handleLayoutChange("facebook")}
                    className={cn(
                      showFieldError("contactSocialLinks", "facebook") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactSocialLinks", "facebook") && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Facebook Profile is required.
                    </span>
                  )}
                </div>
              )}
              {isLayoutVisible("contactSocialLinks", "website") && (
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    label="Website"
                    required={isLayoutRequired("contactSocialLinks", "website")}
                    placeholder="http://www.example.com"
                    value={layoutForm.website}
                    onChange={handleLayoutChange("website")}
                    className={cn(
                      showFieldError("contactSocialLinks", "website") &&
                      "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {showFieldError("contactSocialLinks", "website") && (
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
      {/* 
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
            console.warn("Add Contact");
          }}
        >
          Add Contact
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

export default ContactFields;
