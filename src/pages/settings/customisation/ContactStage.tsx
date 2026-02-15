import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
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
    boxShadow: "none"
  }
};

const GripIcon = () => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="2" cy="2" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="6" cy="2" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="2" cy="6" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="6" cy="6" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="2" cy="10" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="6" cy="10" r="1" fill="rgba(51, 51, 51, 0.7)" />
  </svg>
);

const initialStages = [
  { id: "acquisition", label: "Acquisition" },
  { id: "engagement", label: "Engagement" },
  { id: "client", label: "Client" }
];

const ContactStage: React.FC = () => {
  const [stages, setStages] = useState(initialStages);
  const [isAdding, setIsAdding] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [dragStageId, setDragStageId] = useState<string | null>(null);

  const deleteTooltip =
    "You want to Remove this field? Your data associated with this field will be set as Empty!";

  const handleAddStage = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStage("");
  };

  const handleSaveAdd = () => {
    const label = newStage.trim();
    if (!label) {
      return;
    }
    setStages((prev) => [
      ...prev,
      { id: `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, label }
    ]);
    handleCancelAdd();
  };

  const handleDeleteStage = (stageId: string) => {
    setStages((prev) => prev.filter((stage) => stage.id !== stageId));
  };

  const handleDragStartStage = (stageId: string, event: React.DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const dragTarget = (event.currentTarget as HTMLElement).closest("[data-drag-row='true']") as HTMLElement | null;
    if (dragTarget) {
      event.dataTransfer.setDragImage(dragTarget, 0, 0);
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", stageId);
    setDragStageId(stageId);
  };

  const handleDragEndStage = () => {
    setDragStageId(null);
  };

  const handleDragOverStage = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragStageId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropStage = (targetStageId: string, event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const sourceId = dragStageId ?? event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetStageId) {
      setDragStageId(null);
      return;
    }

    setStages((prev) => {
      const sourceIndex = prev.findIndex((stage) => stage.id === sourceId);
      const targetIndex = prev.findIndex((stage) => stage.id === targetStageId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });

    setDragStageId(null);
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<span className="inline-flex items-center justify-center text-[16px] leading-none -translate-y-[1px]">+</span>}
          onClick={handleAddStage}
        >
          Add Contact Stage
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden">
        <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#CCCCCC80] bg-[#EAEAEA26]">
          <span className="text-[14px] font-[500] text-[#333333]">Contact Stage</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex flex-col gap-3">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white"
                data-drag-row="true"
                onDragOver={handleDragOverStage}
                onDrop={(event) => handleDropStage(stage.id, event)}
              >
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <button
                    type="button"
                    draggable
                    aria-label={`Reorder ${stage.label}`}
                    className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] text-[#666666] hover:bg-[#F3F4F6] cursor-grab active:cursor-grabbing"
                    onDragStart={(event) => handleDragStartStage(stage.id, event)}
                    onDragEnd={handleDragEndStage}
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <GripIcon />
                  </button>
                  <span>{stage.label}</span>
                </div>
                <div className="flex items-center justify-center text-[#666666]">
                  <Tooltip
                    title={deleteTooltip}
                    placement="left"
                    arrow
                    componentsProps={{
                      tooltip: { sx: { bgcolor: "#797979", textAlign: "center" } },
                      arrow: { sx: { color: "#797979" } },
                      popper: { sx: { zIndex: 2400 } }
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Delete ${stage.label}`}
                      className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#666666] hover:bg-[#F3F4F6] cursor-pointer"
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}

            {isAdding && (
              <div className="flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white">
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <GripIcon />
                  <input
                    type="text"
                    placeholder="Add new contact stage"
                    value={newStage}
                    onChange={(event) => setNewStage(event.target.value)}
                    className="h-[28px] w-[200px] rounded-[4px] border border-[#D8D8D8] px-2 text-[13px] text-[#333333] focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-center text-[#666666]">
                  <Tooltip
                    title={deleteTooltip}
                    placement="left"
                    arrow
                    componentsProps={{
                      tooltip: { sx: { bgcolor: "#797979" } },
                      arrow: { sx: { color: "#797979" } },
                      popper: { sx: { zIndex: 2400 } }
                    }}
                  >
                    <button
                      type="button"
                      aria-label="Delete new stage"
                      className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#666666] hover:bg-[#F3F4F6] cursor-pointer"
                      onClick={handleCancelAdd}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>

        {isAdding && (
          <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={handleCancelAdd}
              sx={{
                height: "36px",
                px: "20px",
                minWidth: "78px",
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
            <Button variant="contained" sx={primaryButtonSx} onClick={handleSaveAdd}>
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactStage;
