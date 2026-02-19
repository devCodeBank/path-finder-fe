import React, { useMemo, useRef, useState } from "react";
import InfoTooltipIcon from "@assets/icons/InfoTooltipIcon.svg?react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Tooltip } from "@mui/material";
import CloseXIcon from "@assets/icons/close-pop-up.svg";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TrashIcon from "@/components/icons/TrashIcon";

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

const GripIcon = ({ color = "rgba(51, 51, 51, 0.7)" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="2" cy="2" r="1" fill={color} />
    <circle cx="6" cy="2" r="1" fill={color} />
    <circle cx="2" cy="6" r="1" fill={color} />
    <circle cx="6" cy="6" r="1" fill={color} />
    <circle cx="2" cy="10" r="1" fill={color} />
    <circle cx="6" cy="10" r="1" fill={color} />
  </svg>
);

type StatusItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  system?: boolean;
  locked?: boolean;
};

const initialStatusItems: StatusItem[] = [
  {
    id: "draft",
    title: "Draft",
    description: "Internal drafting phase. The job is not visible to candidates or external job boards.",
    category: "Preparation",
    system: true,
    locked: true
  },
  {
    id: "open",
    title: "Open",
    description: "The role is actively recruiting. Applications are being accepted and the post is public.",
    category: "Active",
    system: true,
    locked: true
  },
  {
    id: "on-hold",
    title: "On Hold",
    description: "Recruitment is currently suspended. No new applications can be submitted.",
    category: "Paused",
    system: true,
    locked: true
  },
  {
    id: "cancelled",
    title: "Cancelled",
    description: "The requisition is withdrawn before a hire was made. All activity is stopped.",
    category: "Closed",
    system: true,
    locked: true
  },
  {
    id: "filled",
    title: "Filled",
    description: "A candidate has been successfully hired and the position is no longer available.",
    category: "Closed",
    system: true,
    locked: false
  },
  {
    id: "archived",
    title: "Archived",
    description: "Administrative archived state. Used for historical reporting once all tasks are done.",
    category: "Closed",
    system: true,
    locked: false
  }
];

const JobStatus: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const [statusList, setStatusList] = useState<StatusItem[]>(initialStatusItems);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    statusName: "",
    categoryGroup: "active",
    description: ""
  });

  const categoryLabels = useMemo(
    () => ({
      active: "Active",
      preparation: "Preparation",
      paused: "Paused",
      closed: "Closed"
    }),
    []
  );

  const openPanel = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setForm({ statusName: "", categoryGroup: "active", description: "" });
    setIsPanelOpen(true);
    requestAnimationFrame(() => setIsPanelVisible(true));
  };

  const closePanel = () => {
    setIsPanelVisible(false);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setIsPanelOpen(false);
      closeTimerRef.current = null;
    }, 300);
  };

  const handleInputChange =
    (field: "statusName" | "description") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
      };

  const canReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return false;
    }
    if (statusList[toIndex]?.locked) {
      return false;
    }
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    return !statusList.slice(start, end + 1).some((status) => status.locked);
  };

  const handleDragStart = (statusId: string) => (event: React.DragEvent<HTMLButtonElement>) => {
    const dragTarget = (event.currentTarget as HTMLElement).closest("[data-drag-row='true']") as HTMLElement | null;
    if (dragTarget) {
      event.dataTransfer.setDragImage(dragTarget, 0, 0);
    }
    setDraggingId(statusId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", statusId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (statusId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    const sourceId = draggingId ?? event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === statusId) {
      return;
    }
    const fromIndex = statusList.findIndex((item) => item.id === sourceId);
    const toIndex = statusList.findIndex((item) => item.id === statusId);
    if (!canReorder(fromIndex, toIndex)) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (statusId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const sourceId = draggingId ?? event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === statusId) {
      return;
    }
    const fromIndex = statusList.findIndex((item) => item.id === sourceId);
    const toIndex = statusList.findIndex((item) => item.id === statusId);
    if (!canReorder(fromIndex, toIndex)) {
      return;
    }
    const next = [...statusList];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setStatusList(next);
    setDraggingId(null);
  };

  const handleSaveStatus = () => {
    const trimmedName = form.statusName.trim();
    if (!trimmedName) {
      return;
    }
    const category = categoryLabels[form.categoryGroup as keyof typeof categoryLabels] ?? "Active";
    const newId = `${trimmedName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setStatusList((prev) => [
      ...prev,
      {
        id: newId,
        title: trimmedName,
        description: form.description.trim(),
        category
      }
    ]);
    closePanel();
  };

  const handleDeleteStatus = (statusId: string) => {
    setStatusList((prev) => prev.filter((status) => status.id !== statusId));
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<span className="text-[16px]">+</span>}
          onClick={openPanel}
        >
          Custom Job Status
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] p-4">
        <div className="flex flex-col gap-4">
          {statusList.map((status) => {
            const isSystem = Boolean(status.system);
            const isLocked = Boolean(status.locked);
            const canDrag = !isLocked;
            const gripColor = canDrag ? "rgba(51, 51, 51, 0.7)" : "rgba(51, 51, 51, 0.25)";
            const lockedTooltip = "Certain status cannot be edited, deleted or moved.";
            return (
              <div
                key={status.id}
                className="flex gap-4 items-start border border-[#E6E6E6] rounded-[6px] bg-white px-4 py-3"
                data-drag-row="true"
                onDragOver={handleDragOver(status.id)}
                onDrop={handleDrop(status.id)}
              >
                <div className="pt-6 text-[#333333]">
                  <button
                    type="button"
                    draggable={canDrag}
                    aria-label={canDrag ? `Reorder ${status.title}` : `${status.title} is locked`}
                    aria-disabled={!canDrag}
                    className={[
                      "flex h-[22px] w-[22px] items-center justify-center rounded-[4px]",
                      canDrag
                        ? "text-[#666666] hover:bg-[#F3F4F6] cursor-grab active:cursor-grabbing"
                        : "cursor-not-allowed opacity-70"
                    ].join(" ")}
                    onDragStart={canDrag ? handleDragStart(status.id) : undefined}
                    onDragEnd={canDrag ? handleDragEnd : undefined}
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <GripIcon color={gripColor} />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="px-3 h-[22px] rounded-full bg-[#EAEAEA]/25 border border-[#E6E6E6] text-[#333333] font-[500] text-[13px] flex items-center">
                      {status.title}
                    </span>
                    {isSystem ? (
                      isLocked ? (

                        <span className="flex items-center gap-1 px-2 h-[22px] rounded-full  bg-[#EAEAEA]/25  text-[#333333] font-[400] text-[13px]">
                          <LockOutlinedIcon sx={{ fontSize: 12, color: "#999999" }} />
                          System
                        </span>

                      ) : (
                        <span className="flex items-center gap-1 px-2 h-[22px] rounded-full  bg-[#EAEAEA]/25  text-[#333333] font-[400] text-[13px]">
                          <LockOutlinedIcon sx={{ fontSize: 12, color: "#999999" }} />
                          System
                        </span>
                      )
                    ) : (
                      <span className="flex items-center gap-1 px-2 h-[22px] rounded-full  bg-[#EAEAEA]/25  text-[#333333] font-[400] text-[13px]">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-[#333333]/70">{status.description}</div>
                  <div className="text-[13px] text-[#333333]/70">
                    Category: <span className="text-[#333333]">{status.category}</span>
                  </div>
                </div>
                <div className="ml-auto" />
                {status.id === "archived" || !status.system ? (
                  <Tooltip
                    title="You want to Remove this field? Your data associated with this field will be set as Empty!"
                    arrow
                    placement="left"
                    componentsProps={{
                      tooltip: { sx: { bgcolor: "#797979", width: "560px", textAlign: "center" } },
                      arrow: { sx: { color: "#797979" } },
                      popper: { sx: { zIndex: 2400 } }
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Delete ${status.title}`}
                      className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#666666] hover:bg-[#F3F4F6] cursor-pointer self-center"
                      onClick={() => handleDeleteStatus(status.id)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </Tooltip>
                ) : (
                  <div className="self-center">
                    <Tooltip
                      title={isLocked ? lockedTooltip : "Certain status cannot be edited, deleted or moved."}
                      arrow
                      placement="left"
                      componentsProps={{
                        tooltip: { sx: { bgcolor: "#797979", maxWidth: "none", whiteSpace: "nowrap" } },
                        arrow: { sx: { color: "#797979" } },
                        popper: { sx: { zIndex: 2400 } },

                      }}
                    >
                      <span className="flex h-[22px] w-[22px] items-center justify-center text-[#999999]">
                        <InfoTooltipIcon width={16} height={16} />
                      </span>
                    </Tooltip>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {isPanelOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex justify-end bg-[#00000066] transition-opacity duration-300",
            isPanelVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          ].join(" ")}
        >
          <div
            className={[
              "w-[60vw] max-w-[720px] h-full  bg-white shadow-[0px_10px_30px_0px_#00000024] overflow-y-auto transition-transform duration-300 ease-out",
              isPanelVisible ? "translate-x-0" : "translate-x-full"
            ].join(" ")}
          >
            <div className="h-[52px] px-5 py-8.5 border-b border-[#CCCCCC80] pr-[20px] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333] pt-3">
                Add Custom Job Status
              </span>
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
                  aria-label="Close panel"
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                  onClick={closePanel}
                >
                  <img src={CloseXIcon} alt="" width={24} height={24} />
                </button>
              </Tooltip>
            </div>

            <div className="px-4 py-5">
              <div className="flex flex-col gap-4">
                <FloatingLabelInput
                  id="job-status-name"
                  label="Status Name"
                  floatLabel
                  placeholder="e.g., Talent Pool"
                  value={form.statusName}
                  onChange={handleInputChange("statusName")}
                  className="w-full h-[36px]"
                />
                <FloatingLabelSelect
                  id="job-status-category"
                  label="Category Group"
                  className="text-[#333333]"
                  value={form.categoryGroup}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, categoryGroup: value }))}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "preparation", label: "Preparation" },
                    { value: "paused", label: "Paused" },
                    { value: "closed", label: "Closed " }
                  ]}
                  placeholder="Select Category Group"
                />
                <FloatingLabelInput
                  id="job-status-description"
                  label="Description"
                  floatLabel
                  placeholder="Describe the objective of this stage"
                  value={form.description}
                  onChange={handleInputChange("description")}
                  className="w-full h-[36px]"
                />
              </div>
            </div>

            <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3">
              <Button
                variant="outlined"
                onClick={closePanel}
                sx={{
                  height: "36px",
                  borderColor: "#CCCCCC80",
                  color: "#333333",
                  textTransform: "none",
                  fontSize: "12px",
                  fontWeight: 500,
                  borderRadius: "4px",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#CCCCCC80",
                    backgroundColor: "#F3F4F6",
                    boxShadow: "none"
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={primaryButtonSx}
                onClick={handleSaveStatus}
              >
                Create Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStatus;
