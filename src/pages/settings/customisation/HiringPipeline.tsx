import React, { useEffect, useMemo, useRef, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Tooltip } from "@mui/material";
import CloseXIcon from "@assets/icons/close-pop-up.svg";
import { FloatingLabelInput } from "@/components/floatingLabelInput";
import { cn } from "@/lib/utils";

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

const stageOptions = [
  { id: "applied", label: "Applied", locked: true },
  { id: "assigned", label: "Assigned", locked: true },
  { id: "phone-screening", label: "Phone Screening" },
  { id: "interview-scheduled", label: "Interview Scheduled" },
  { id: "first-interview", label: "1st Interview" },
  { id: "second-interview", label: "2nd Interview" },
  { id: "third-interview", label: "3rd Interview" },
  { id: "skills-assessment", label: "Skills Assessment" },
  { id: "on-hold", label: "On Hold" },
  { id: "rejected", label: "Rejected" },
  { id: "reference-check", label: "Reference Check" },
  { id: "offer-extended", label: "Offer Extended" },
  { id: "placed", label: "Placed", locked: true }
];

const HiringPipeline: React.FC = () => {
  const lockedTooltip = "Certain status cannot be edited, deleted or moved.";
  const [pipelines, setPipelines] = useState([
    {
      id: "default",
      name: "Hiring Pipeline (Default)",
      stageIds: stageOptions.map((stage) => stage.id)
    }
  ]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const [pipelineName, setPipelineName] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [editPipelineId, setEditPipelineId] = useState<string | null>(null);
  const [selectedStages, setSelectedStages] = useState<string[]>(
    stageOptions.map((stage) => stage.id)
  );
  const [stageOrder, setStageOrder] = useState<string[]>(stageOptions.map((stage) => stage.id));
  const [dragStageId, setDragStageId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<"before" | "after" | null>(null);
  const [recentlyMovedStageId, setRecentlyMovedStageId] = useState<string | null>(null);
  const reorderTimerRef = useRef<number | null>(null);
  const transparentDragImageRef = useRef<HTMLImageElement | null>(null);

  const stageMeta = useMemo(() => {
    return stageOptions.reduce<Record<string, { label: string; locked?: boolean }>>((acc, stage) => {
      acc[stage.id] = { label: stage.label, locked: stage.locked };
      return acc;
    }, {});
  }, []);

  const openPanel = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setEditPipelineId(null);
    setPipelineName("");
    setSelectedStages(stageOptions.map((stage) => stage.id));
    setStageOrder(stageOptions.map((stage) => stage.id));
    setShowErrors(false);
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
      setEditPipelineId(null);
      closeTimerRef.current = null;
    }, 300);
  };

  const openEditPanel = (pipelineId: string) => {
    const pipeline = pipelines.find((item) => item.id === pipelineId);
    if (pipeline) {
      setPipelineName(pipeline.name);
      setSelectedStages(pipeline.stageIds);
      setStageOrder(pipeline.stageIds);
    }
    setEditPipelineId(pipelineId);
    setIsPanelOpen(true);
    requestAnimationFrame(() => setIsPanelVisible(true));
  };

  const toggleStage = (stageId: string, locked?: boolean) => {
    if (locked) return;
    setSelectedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );
  };

  const handleCreatePipeline = () => {
    const trimmed = pipelineName.trim();
    const picked = selectedStages.length
      ? selectedStages
      : stageOptions.filter((s) => s.locked).map((s) => s.id);
    if (!trimmed) {
      setShowErrors(true);
      return;
    }
    const orderedPicked = stageOrder.filter(
      (stageId) => picked.includes(stageId) || stageMeta[stageId]?.locked
    );
    setPipelines((prev) => [
      ...prev,
      {
        id: `${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: trimmed,
        stageIds: orderedPicked
      }
    ]);
    setPipelineName("");
    setSelectedStages(stageOptions.map((stage) => stage.id));
    setShowErrors(false);
    closePanel();
  };

  const handleSavePipeline = () => {
    const trimmed = pipelineName.trim();
    if (!trimmed) {
      setShowErrors(true);
      return;
    }
    const picked = selectedStages.length
      ? selectedStages
      : stageOptions.filter((s) => s.locked).map((s) => s.id);
    const orderedPicked = stageOrder.filter(
      (stageId) => picked.includes(stageId) || stageMeta[stageId]?.locked
    );
    setPipelines((prev) =>
      prev.map((pipeline) =>
        pipeline.id === editPipelineId
          ? { ...pipeline, name: trimmed, stageIds: orderedPicked }
          : pipeline
      )
    );
    setShowErrors(false);
    closePanel();
  };

  const canReorderStage = (order: string[], fromIndex: number, toIndex: number) => {
    if (fromIndex === -1 || toIndex < 0 || toIndex > order.length || fromIndex === toIndex) return false;
    const boundedToIndex = Math.min(toIndex, order.length - 1);
    const fromId = order[fromIndex];
    const toId = order[boundedToIndex];
    if (stageMeta[fromId]?.locked || stageMeta[toId]?.locked) return false;
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    return !order.slice(start, end + 1).some((id) => stageMeta[id]?.locked);
  };

  const handleDragStartStage =
    (stageId: string) => (event: React.DragEvent<HTMLDivElement>) => {
      setDragStageId(stageId);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", stageId);
      if (!transparentDragImageRef.current) {
        const img = new Image();
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        transparentDragImageRef.current = img;
      }
      event.dataTransfer.setDragImage(transparentDragImageRef.current, 0, 0);
    };

  const handleDragEndStage = () => {
    setDragStageId(null);
    setDragOverStageId(null);
    setDragOverPosition(null);
    if (reorderTimerRef.current) {
      window.clearTimeout(reorderTimerRef.current);
      reorderTimerRef.current = null;
    }
    setRecentlyMovedStageId(null);
  };

  const handleDragOverStage =
    (targetStageId: string) => (event: React.DragEvent<HTMLDivElement>) => {
      const sourceId = dragStageId ?? event.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetStageId) {
        return;
      }
      const fromIndex = stageOrder.indexOf(sourceId);
      const toIndex = stageOrder.indexOf(targetStageId);
      if (!canReorderStage(stageOrder, fromIndex, toIndex)) {
        event.dataTransfer.dropEffect = "none";
        return;
      }
      const targetRect = event.currentTarget.getBoundingClientRect();
      const shouldInsertAfter = event.clientY > targetRect.top + targetRect.height / 2;
      setDragOverStageId(targetStageId);
      setDragOverPosition(shouldInsertAfter ? "after" : "before");
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      setStageOrder((prev) => {
        const currentFromIndex = prev.indexOf(sourceId);
        const currentTargetIndex = prev.indexOf(targetStageId);
        if (currentFromIndex === -1 || currentTargetIndex === -1) {
          return prev;
        }
        const nextIndex = shouldInsertAfter ? currentTargetIndex + 1 : currentTargetIndex;
        const adjustedToIndex = currentFromIndex < nextIndex ? nextIndex - 1 : nextIndex;
        if (currentFromIndex === adjustedToIndex) {
          return prev;
        }
        if (!canReorderStage(prev, currentFromIndex, adjustedToIndex)) {
          return prev;
        }
        const next = [...prev];
        const [moved] = next.splice(currentFromIndex, 1);
        next.splice(adjustedToIndex, 0, moved);
        setRecentlyMovedStageId(sourceId);
        if (reorderTimerRef.current) {
          window.clearTimeout(reorderTimerRef.current);
        }
        reorderTimerRef.current = window.setTimeout(() => {
          setRecentlyMovedStageId(null);
          reorderTimerRef.current = null;
        }, 180);
        return next;
      });
    };

  const handleDropStage =
    (targetStageId: string) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const targetRect = event.currentTarget.getBoundingClientRect();
      const shouldInsertAfter = event.clientY > targetRect.top + targetRect.height / 2;
      const sourceId = dragStageId ?? event.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetStageId) {
        return;
      }
      setStageOrder((prev) => {
        const fromIndex = prev.indexOf(sourceId);
        const targetIndex = prev.indexOf(targetStageId);
        if (fromIndex === -1 || targetIndex === -1) {
          return prev;
        }
        const toIndex = shouldInsertAfter ? targetIndex + 1 : targetIndex;
        const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
        if (!canReorderStage(prev, fromIndex, adjustedToIndex)) {
          return prev;
        }
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(adjustedToIndex, 0, moved);
        return next;
      });
      setDragStageId(null);
      setDragOverStageId(null);
      setDragOverPosition(null);
    };

  const GripIcon: React.FC<{ locked?: boolean }> = ({ locked }) => (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="2" cy="2" r="1" fill={locked ? "rgba(170, 170, 170, 0.9)" : "rgba(51, 51, 51, 0.7)"} />
      <circle cx="6" cy="2" r="1" fill={locked ? "rgba(170, 170, 170, 0.9)" : "rgba(51, 51, 51, 0.7)"} />
      <circle cx="2" cy="6" r="1" fill={locked ? "rgba(170, 170, 170, 0.9)" : "rgba(51, 51, 51, 0.7)"} />
      <circle cx="6" cy="6" r="1" fill={locked ? "rgba(170, 170, 170, 0.9)" : "rgba(51, 51, 51, 0.7)"} />
      <circle cx="2" cy="10" r="1" fill={locked ? "rgba(170, 170, 170, 0.9)" : "rgba(51, 51, 51, 0.7)"} />
      <circle cx="6" cy="10" r="1" fill={locked ? "rgba(170, 170, 170, 0.9)" : "rgba(51, 51, 51, 0.7)"} />
    </svg>
  );

  const PipelineStages: React.FC<{ stageIds: string[] }> = ({ stageIds }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
    };

    const scrollByAmount = (amount: number) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollBy({ left: amount, behavior: "smooth" });
    };

    useEffect(() => {
      const handleResize = () => updateScrollButtons();
      const raf = window.requestAnimationFrame(updateScrollButtons);
      window.addEventListener("resize", handleResize);
      return () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener("resize", handleResize);
      };
    }, [stageIds]);

    return (
      <div className="flex items-center gap-3 text-[13px] text-[#333333]">
        <button
          type="button"
          className={[
            "h-[24px] w-[24px] rounded-full flex items-center justify-center",
            canScrollLeft ? "bg-[#5C5C5C] text-white" : "bg-[#EAEAEA]/30 text-[#AAAAAA] cursor-not-allowed"
          ].join(" ")}
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-240)}
          disabled={!canScrollLeft}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 12 }} />
        </button>

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0 scroll-smooth no-scrollbar"
        >
          {stageIds.map((stageId, index) => {
            const stage = stageMeta[stageId];
            if (!stage) return null;
            return (
              <React.Fragment key={stageId}>
                <div
                  className={[
                    "h-[36px] px-4 w-[auto] rounded-[6px] border text-[13px] flex items-center gap-2 whitespace-nowrap",
                    stage.locked
                      ? "bg-[#EAEAEA] border-[#D8D8D8] text-[#333333]"
                      : "bg-white border-[#D8D8D8] text-[#333333]"
                  ].join(" ")}
                >
                  {stage.locked && (
                    <Tooltip
                      title={lockedTooltip}
                      arrow
                      placement="right"
                      componentsProps={{
                        tooltip: { sx: { bgcolor: "#797979", maxWidth: "none", whiteSpace: "nowrap" } },
                        arrow: { sx: { color: "#797979" } },
                        popper: { sx: { zIndex: 2400 } }
                      }}
                    >
                      <span className="flex items-center justify-center">
                        <LockOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />
                      </span>
                    </Tooltip>
                  )}
                  <span>{stage.label}</span>
                </div>
                {index < stageIds.length - 1 && <ChevronRightIcon sx={{ fontSize: 18, color: "#666666" }} />}
              </React.Fragment>
            );
          })}
        </div>

        <button
          type="button"
          className={[
            "h-[24px] w-[24px] rounded-full flex items-center justify-center",
            canScrollRight ? "bg-[#5C5C5C] text-white" : "bg-[#EAEAEA]/30 text-[#AAAAAA] cursor-not-allowed"
          ].join(" ")}
          aria-label="Scroll right"
          onClick={() => scrollByAmount(240)}
          disabled={!canScrollRight}
        >
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <style>{`
        @keyframes hp-reorder-pop {
          0% {
            transform: translateY(0) scale(1);
            box-shadow: 0 0 0 rgba(110, 65, 226, 0);
          }
          45% {
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 8px 18px rgba(110, 65, 226, 0.18);
          }
          100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 0 0 rgba(110, 65, 226, 0);
          }
        }
        .hp-stage-row-moved {
          animation: hp-reorder-pop 240ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
      `}</style>
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<span className="inline-flex items-center justify-center text-[16px] leading-none -translate-y-[1px]">+</span>}
          onClick={openPanel}
        >
          Add New Pipline
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden">
            <div className="h-[52px] px-4 bg-[#F9FAFB] flex items-center justify-between border-b border-[#CCCCCC80]">
              <span className="text-[14px] font-[500] text-[#333333]">{pipeline.name}</span>
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
                  aria-label="Edit pipeline"
                  className="h-[28px] w-[28px] cursor-pointer flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
                  onClick={() => openEditPanel(pipeline.id)}
                >
                  <EditOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />
                </button>
              </Tooltip>
            </div>

            <div className="px-4 py-5">
              <PipelineStages stageIds={pipeline.stageIds} />
            </div>
          </div>
        ))}
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
                {editPipelineId ? "Edit Hiring Pipeline" : "New Hiring Pipeline"}
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
                <>
                  <FloatingLabelInput
                    id="pipeline-name"
                    label="Pipeline Name*"
                    floatLabel
                    placeholder="e.g., Executive Search"
                    value={pipelineName}
                    onChange={(event) => setPipelineName(event.target.value)}
                    className={[
                      "w-full h-[36px]",
                      showErrors && !pipelineName.trim()
                        ? "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                        : ""
                    ].join(" ")}
                  />
                  {showErrors && !pipelineName.trim() && (
                    <span className="text-[11px] text-[#E53935]">*Pipeline Name required.</span>
                  )}

                  <div className="text-[14px] text-[#333333]">Add Custom Stages</div>

                  <div className="flex flex-col gap-3">
                    {stageOrder.map((stageId) => {
                      const stage = stageMeta[stageId];
                      if (!stage) return null;
                      const isSelected = selectedStages.includes(stageId) || stage.locked;
                      const showDropBefore = dragStageId && dragOverStageId === stageId && dragOverPosition === "before";
                      const showDropAfter = dragStageId && dragOverStageId === stageId && dragOverPosition === "after";
                      const isDraggingRow = dragStageId === stageId;
                      const isRecentlyMoved = recentlyMovedStageId === stageId;
                      const rowContent = (
                        <div
                          key={stageId}
                          draggable={!stage.locked}
                          aria-label={stage.locked ? `${stage.label} is locked` : `Reorder ${stage.label}`}
                          aria-disabled={stage.locked}
                          className={[
                            "hp-stage-row flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[40px] transition-[transform,box-shadow] duration-150 ease-out",
                            showDropBefore ? "border-t-2 border-t-[#6E41E2]" : "",
                            showDropAfter ? "border-b-2 border-b-[#6E41E2]" : "",
                            isRecentlyMoved ? "hp-stage-row-moved" : "",
                            isDraggingRow ? "bg-white text-[#333333]" : "",
                            stage.locked ? "bg-[#EAEAEA]/25 text-[#A7A7A7] cursor-not-allowed" : "bg-white text-[#333333] cursor-default"
                          ].join(" ")}
                          onDragStart={stage.locked ? undefined : handleDragStartStage(stageId)}
                          onDragEnd={stage.locked ? undefined : handleDragEndStage}
                          onDragOver={handleDragOverStage(stageId)}
                          onDrop={handleDropStage(stageId)}
                        >
                          {stage.locked ? (
                            <Tooltip
                              title={lockedTooltip}
                              arrow
                              placement="bottom-start"
                              PopperProps={{
                                disablePortal: true
                              }}
                              componentsProps={{
                                tooltip: { sx: { bgcolor: "#797979", maxWidth: "none", whiteSpace: "nowrap" } },
                                arrow: { sx: { color: "#797979" } },
                                popper: { sx: { zIndex: 2400 } }
                              }}
                            >
                              <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                                <span>
                                  <GripIcon locked />
                                </span>
                                <span>{stage.label}</span>
                              </div>
                            </Tooltip>
                          ) : (
                            <div className={cn(
                              "flex items-center gap-3 text-[13px]",
                              "text-[#333333]"
                            )}>
                              <span className={cn(
                                "group/drag flex h-[20px] w-[20px] items-center justify-center rounded-[4px] text-[#666666] hover:border-[#D7D7D7] cursor-grab",
                                isDraggingRow && "text-[#666666]"
                              )}>

                                <GripIcon />
                              </span>

                              <span>{stage.label}</span>
                            </div>
                          )}
                          {stage.locked ? (
                            <span className="flex items-center justify-center">
                              <LockOutlinedIcon sx={{ fontSize: 14, color: "#999999" }} />
                            </span>
                          ) : (
                            <button
                              type="button"
                              aria-pressed={isSelected}
                              aria-label={`Toggle ${stage.label}`}
                              onClick={() => toggleStage(stageId, stage.locked)}
                              className={[
                                "h-[16px] w-[16px] rounded-[4px] border flex items-center justify-center",
                                isSelected ? "border-[#22C55E] bg-[#22C55E]" : "border-[#D7D7D7] bg-white"
                              ].join(" ")}
                            >
                              {isSelected && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
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
                          )}
                        </div>
                      );

                      return rowContent;
                    })}
                  </div>
                </>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3">
              <Button
                variant="outlined"
                onClick={closePanel}
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
              {editPipelineId ? (
                <Button variant="contained" sx={primaryButtonSx} onClick={handleSavePipeline}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="contained" sx={primaryButtonSx} onClick={handleCreatePipeline}>
                  Create Pipeline
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringPipeline;
