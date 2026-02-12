import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

const GripIcon = ({ color = "rgba(51, 51, 51, 0.7)" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="2" cy="2" r="1" fill={color} />
    <circle cx="6" cy="2" r="1" fill={color} />
    <circle cx="2" cy="6" r="1" fill={color} />
    <circle cx="6" cy="6" r="1" fill={color} />
    <circle cx="2" cy="10" r="1" fill={color} />
    <circle cx="6" cy="10" r="1" fill={color} />
  </svg>
);

const initialRows = [
  { id: "open", label: "Open", probability: 10, color: "#3F51E5", deletable: true },
  { id: "in-progress", label: "In Progress", probability: 25, color: "#3F51E5", deletable: true },
  { id: "opportunity", label: "Opportunity", probability: 50, color: "#3F51E5", deletable: true },
  { id: "won", label: "Won", probability: 100, color: "#57CC4D", deletable: false },
  { id: "lost", label: "Lost", probability: 0, color: "#E0E0E0", deletable: false }
];

const DealsPipeline: React.FC = () => {
  const [rows, setRows] = useState(initialRows);
  const [isAdding, setIsAdding] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newProbability, setNewProbability] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lockedTooltip = "Certain status cannot be edited, deleted or moved.";
  const deleteTooltip = "You want to Remove this field? Your data associated with this field will be set as Empty!";

  const canReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return false;
    }
    if (!rows[toIndex]?.deletable) {
      return false;
    }
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    return !rows.slice(start, end + 1).some((row) => !row.deletable);
  };

  const handleDragStart = (rowId: string) => (event: React.DragEvent<HTMLButtonElement>) => {
    const dragTarget = (event.currentTarget as HTMLElement).closest("[data-drag-row='true']") as HTMLElement | null;
    if (dragTarget) {
      event.dataTransfer.setDragImage(dragTarget, 0, 0);
    }
    setDraggingId(rowId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", rowId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (rowId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    const sourceId = draggingId ?? event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === rowId) {
      return;
    }
    const fromIndex = rows.findIndex((item) => item.id === sourceId);
    const toIndex = rows.findIndex((item) => item.id === rowId);
    if (!canReorder(fromIndex, toIndex)) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (rowId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const sourceId = draggingId ?? event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === rowId) {
      return;
    }
    const fromIndex = rows.findIndex((item) => item.id === sourceId);
    const toIndex = rows.findIndex((item) => item.id === rowId);
    if (!canReorder(fromIndex, toIndex)) {
      return;
    }
    setRows((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggingId(null);
  };

  const handleAddRow = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStatus("");
    setNewProbability("");
  };

  const handleSaveAdd = () => {
    const label = newStatus.trim();
    const parsed = Number(newProbability);
    const probability = Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
    if (!label) {
      return;
    }
    const newRow = {
      id: `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      label,
      probability,
      color: "#3F51E5",
      deletable: true
    };
    setRows((prev) => {
      const winIndex = prev.findIndex((row) => row.id === "won");
      if (winIndex === -1) {
        return [...prev, newRow];
      }
      const next = [...prev];
      next.splice(winIndex, 0, newRow);
      return next;
    });
    handleCancelAdd();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<span className="text-[16px]">+</span>}
          onClick={handleAddRow}
        >
          Add Deal Status
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden">
        <div className="h-[52px] px-4 flex bg-[#EAEAEA]/15 items-center justify-between border-b border-[#CCCCCC80]">
          <span className="text-[14px] font-[500] text-[#333333]">Deals Pipeline</span>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-[2.2fr_2fr_0.6fr] gap-4 px-3 pb-2 text-[13px] font-[500] text-[#333333]">
            <span>Status</span>
            <span>Probability (%)</span>
            <span className="text-center">Action</span>
          </div>

          <div className="flex flex-col gap-3">
            {(() => {
              const winIndex = rows.findIndex((row) => row.id === "won");
              const beforeRows = winIndex === -1 ? rows : rows.slice(0, winIndex);
              const afterRows = winIndex === -1 ? [] : rows.slice(winIndex);
              const renderRow = (row: typeof rows[number]) => {
                const canDrag = row.deletable;
                const gripColor = canDrag ? "rgba(51, 51, 51, 0.7)" : "rgba(51, 51, 51, 0.25)";
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[2.2fr_2fr_0.6fr] gap-4 items-center border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white"
                    data-drag-row="true"
                    onDragOver={handleDragOver(row.id)}
                    onDrop={handleDrop(row.id)}
                  >
                    <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                      <button
                        type="button"
                        draggable={canDrag}
                        aria-label={canDrag ? `Reorder ${row.label}` : `${row.label} is locked`}
                        aria-disabled={!canDrag}
                        className={[
                          "flex h-[22px] w-[22px] items-center justify-center rounded-[4px]",
                          canDrag
                            ? "text-[#666666] hover:bg-[#F3F4F6] cursor-grab active:cursor-grabbing"
                            : "cursor-not-allowed opacity-70"
                        ].join(" ")}
                        onDragStart={canDrag ? handleDragStart(row.id) : undefined}
                        onDragEnd={canDrag ? handleDragEnd : undefined}
                        onClick={(event) => event.stopPropagation()}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <GripIcon color={gripColor} />
                      </button>
                      <span>{row.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-[24px] w-[44px] rounded-full bg-[#F5F5F5] text-[12px] text-[#333333] flex items-center justify-center">
                        {row.probability}
                      </span>
                      <div className="h-[8px] w-full rounded-full bg-[#F5F5F5]">
                        <div
                          className="h-[8px] rounded-full"
                          style={{ width: `${row.probability}%`, backgroundColor: row.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-[#666666]">
                      {row.deletable ? (
                        <Tooltip
                          title={deleteTooltip}
                          arrow
                          placement="left"
                          componentsProps={{
                            tooltip: { sx: { bgcolor: "#797979", width: "600px" } },
                            arrow: { sx: { color: "#797979" } },
                            popper: { sx: { zIndex: 2400 } }
                          }}
                        >
                          <span className="flex h-[22px] w-[22px] items-center justify-center text-[#666666]">
                            <TrashIcon size={18} />
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={lockedTooltip}
                          arrow
                          placement="left"
                          componentsProps={{
                            tooltip: { sx: { bgcolor: "#797979", width: "600px" } },
                            arrow: { sx: { color: "#797979" } },
                            popper: { sx: { zIndex: 2400 } }
                          }}
                        >
                          <span className="flex h-[22px] w-[22px] items-center justify-center text-[#999999]">
                            <InfoOutlinedIcon sx={{ fontSize: 18, color: "#999999" }} />
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <>
                  {beforeRows.map(renderRow)}
                  {isAdding && (
                    <div className="grid grid-cols-[2.2fr_2fr_0.6fr] gap-4 items-center border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white">
                      <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                        <GripIcon color="rgba(51, 51, 51, 0.25)" />
                        <input
                          type="text"
                          placeholder=""
                          value={newStatus}
                          onChange={(event) => setNewStatus(event.target.value)}
                          className="h-[28px] w-[200px] rounded-[4px] border border-[#D8D8D8] px-2 text-[13px] text-[#333333] focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="(%)"
                          value={newProbability}
                          onChange={(event) => setNewProbability(event.target.value)}
                          className="h-[28px] w-[56px] rounded-[4px] border border-[#D8D8D8] px-2 text-[12px] text-[#333333] focus:outline-none"
                        />
                        <div className="h-[8px] w-full rounded-full bg-[#F5F5F5]" />
                      </div>
                      <div className="flex items-center justify-center text-[#666666]">
                        <TrashIcon size={18} />
                      </div>
                    </div>
                  )}
                  {afterRows.map(renderRow)}
                </>
              );
            })()}
          </div>
        </div>

        {isAdding && (
          <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={handleCancelAdd}
              sx={{
                height: "32px",
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

export default DealsPipeline;
