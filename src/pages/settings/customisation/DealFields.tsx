import React, { useMemo, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { Tooltip } from "@mui/material";
import { cn } from "@/lib/utils";
import CloseXIcon from "@assets/icons/x.svg";

type FieldRow = {
  id: string;
  label: string;
  type: string;
  visibility: boolean;
  required: boolean;
};

type Section = {
  id: string;
  title: string;
  rows: FieldRow[];
};

const Toggle = ({
  enabled,
  onChange,
  ariaLabel,
  disabled = false
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(event) => {
        if (disabled) return;
        event.stopPropagation();
        onChange(!enabled);
      }}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 outline-none",
        enabled ? "bg-[#57CC4D]" : "bg-[#CCCCCC]",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        )}
      />
    </button>
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
      disabled={disabled}
      onClick={(event) => {
        if (disabled) return;
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "h-[14px] w-[14px] rounded-[3px] border flex items-center justify-center",
        checked ? "bg-[#57CC4D] border-[#57CC4D]" : "bg-white border-[#D7D7D7]",
        disabled && "cursor-not-allowed opacity-60"
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
    <rect x="1" y="5" width="2" height="2" fill="#666666" />
    <rect x="5" y="5" width="2" height="2" fill="#666666" />
    <rect x="1" y="9" width="2" height="2" fill="#666666" />
    <rect x="5" y="9" width="2" height="2" fill="#666666" />
  </svg>
);

const SectionCard = ({
  section,
  collapsed,
  onToggleCollapse,
  onEditTitle,
  onDragStartRow,
  onDragEndRow,
  onDragOverRow,
  onDropRow,
  onToggleRow
}: {
  section: Section;
  collapsed: boolean;
  onToggleCollapse: (sectionId: string) => void;
  onEditTitle: (section: Section) => void;
  onDragStartRow: (sectionId: string, rowId: string, event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEndRow: () => void;
  onDragOverRow: (sectionId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onDropRow: (sectionId: string, rowId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onToggleRow: (sectionId: string, rowId: string, key: keyof FieldRow, value: boolean) => void;
}) => {
  return (
    <div className="bg-white border-[#CCCCCC80] rounded-[6px] overflow-hidden">
      <div
        className="h-[52px] px-4 flex items-center justify-between rounded-[6px] border border-[#CCCCCC80] bg-[#FAFAFA]"
      >
        <div className="flex items-center gap-2 text-[14px] text-[#333333] font-[500]">
          <span className="text-[#333333] ">{section.title}</span>
        </div>
        <div className="flex items-center gap-10">
          <Tooltip
            title="Edit"
            arrow
            placement="left"
            componentsProps={{
              tooltip: { sx: { bgcolor: "#797979" } },
              arrow: { sx: { color: "#797979" } },
              popper: { sx: { zIndex: 2400 } }
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
          <div className="grid grid-cols-[32px_2.2fr_1.6fr_0.8fr_0.8fr] gap-2 px-4 py-2 text-[13px] font-[500] text-[#333333] border-[#CCCCCC80] bg-[#FFFFFF]">
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
                className="grid grid-cols-[32px_2.2fr_1.6fr_0.8fr_0.8fr] gap-2 px-4 h-[44px] text-[13px] text-[#333333] items-center border border-[#E6E6E6] rounded-[6px] bg-white"
                data-drag-row="true"
                onDragOver={(event) => onDragOverRow(section.id, event)}
                onDrop={(event) => onDropRow(section.id, row.id, event)}
              >
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    draggable
                    aria-label={`Reorder ${row.label}`}
                    className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6] cursor-grab active:cursor-grabbing"
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
                    disabled
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.required}
                    onChange={(val) => onToggleRow(section.id, row.id, "required", val)}
                    ariaLabel={`Toggle required for ${row.label}`}
                    disabled
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

const DealFields: React.FC = () => {
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "dealDetails",
        title: "Deal Details",
        rows: [
          { id: "dealName", label: "Deal Name", type: "Text (Single Line)", visibility: true, required: true },
          { id: "dealStage", label: "Deal Stage", type: "Dropdown (Single Select)", visibility: true, required: true },
          { id: "dealAmount", label: "Deal Amount", type: "Currency", visibility: true, required: true },
          { id: "closeDate", label: "Close Date", type: "Date Picker (DD/MM/YYYY)", visibility: true, required: true },
          { id: "owner", label: "Owner", type: "Lookup / User", visibility: true, required: true },
          { id: "dealType", label: "Deal Type", type: "Dropdown (Single Select)", visibility: true, required: true }
        ]
      },
      {
        id: "associatedWith",
        title: "Associated With",
        rows: [
          { id: "companyName", label: "Company Name", type: "Lookup (Account/Client)", visibility: true, required: true },
          { id: "contactName", label: "Contact Name", type: "Lookup (Contact)", visibility: true, required: true },
          { id: "candidateName", label: "Candidate Name", type: "Lookup (Candidate)", visibility: true, required: true },
          { id: "job", label: "Job", type: "Lookup (Job Order)", visibility: true, required: true }
        ]
      }
    ],
    []
  );

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [dragRow, setDragRow] = useState<{ sectionId: string; rowId: string } | null>(null);

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

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="w-full rounded-[4px] border border-[#CCCCCC80] p-3">
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              collapsed={Boolean(collapsedSections[section.id])}
              onToggleCollapse={handleToggleCollapse}
              onEditTitle={handleOpenEditSectionTitle}
              onDragStartRow={handleDragStartRow}
              onDragEndRow={handleDragEndRow}
              onDragOverRow={handleDragOverRow}
              onDropRow={handleDropRow}
              onToggleRow={handleToggleRow}
            />
          ))}
        </div>
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
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
                </button>
              </Tooltip>
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
};

export default DealFields;
