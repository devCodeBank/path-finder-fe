import React, { useMemo, useRef, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button } from "@mui/material";
import CloseXIcon from "@assets/icons/x.svg";
import { FloatingLabelInput } from "@/components/floatingLabelInput";

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
  const [pipelines, setPipelines] = useState([
    {
      id: "default",
      name: "Hiring Pipeline (Default)",
      stageIds: ["applied", "assigned", "phone-screening", "first-interview", "second-interview", "third-interview"]
    }
  ]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const [pipelineName, setPipelineName] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [selectedStages, setSelectedStages] = useState<string[]>(
    stageOptions.map((stage) => stage.id)
  );

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

  const toggleStage = (stageId: string, locked?: boolean) => {
    if (locked) return;
    setSelectedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );
  };

  const handleCreatePipeline = () => {
    const trimmed = pipelineName.trim();
    const picked = selectedStages.length ? selectedStages : stageOptions.filter((s) => s.locked).map((s) => s.id);
    if (!trimmed) {
      setShowErrors(true);
      return;
    }
    setPipelines((prev) => [
      ...prev,
      {
        id: `${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: trimmed,
        stageIds: picked
      }
    ]);
    setPipelineName("");
    setSelectedStages(stageOptions.map((stage) => stage.id));
    setShowErrors(false);
    closePanel();
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<span className="text-[16px]">+</span>}
          onClick={openPanel}
        >
          New Pipeline
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden">
            <div className="h-[52px] px-4 bg-[#EAEAEA]/15 flex items-center justify-between border-b border-[#CCCCCC80]">
              <span className="text-[14px] font-[500] text-[#333333]">{pipeline.name}</span>
              <button
                type="button"
                aria-label="Edit pipeline"
                className="h-[28px] w-[28px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
              >
                <EditOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />
              </button>
            </div>

            <div className="px-4 py-5">
              <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                <button
                  type="button"
                  className="h-[24px] w-[24px] rounded-full bg-[#EAEAEA]/60 flex items-center justify-center text-[#666666]"
                  aria-label="Scroll left"
                >
                  <ArrowBackIosNewRoundedIcon sx={{ fontSize: 12 }} />
                </button>

                <div className="flex items-center gap-3 overflow-hidden">
                  {pipeline.stageIds.map((stageId, index) => {
                    const stage = stageMeta[stageId];
                    if (!stage) return null;
                    return (
                      <React.Fragment key={stageId}>
                        <div
                          className={[
                            "h-[36px] px-4 w-[128px] rounded-[6px] border text-[13px] flex items-center gap-2 whitespace-nowrap",
                            stage.locked
                              ? "bg-[#EAEAEA] border-[#D8D8D8] text-[#333333]"
                              : "bg-white border-[#D8D8D8] text-[#333333]"
                          ].join(" ")}
                        >
                          {stage.locked && <LockOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />}
                          <span>{stage.label}</span>
                        </div>
                        {index < pipeline.stageIds.length - 1 && (
                          <ChevronRightIcon sx={{ fontSize: 18, color: "#666666" }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="h-[24px] w-[24px] rounded-full bg-[#5C5C5C] flex items-center justify-center text-white"
                  aria-label="Scroll right"
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
                </button>
              </div>
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
              "w-[60vw] max-w-[720px] h-full rounded-l-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] overflow-y-auto transition-transform duration-300 ease-out",
              isPanelVisible ? "translate-x-0" : "translate-x-full"
            ].join(" ")}
          >
            <div className="h-[52px] px-5 py-8.5 border-b border-[#CCCCCC80] pr-[20px] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333] pt-3">New Hiring Pipeline</span>
              <button
                type="button"
                aria-label="Close panel"
                className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                onClick={closePanel}
              >
                <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
              </button>
            </div>

            <div className="px-4 py-5">
              <div className="flex flex-col gap-4">
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
                  {stageOptions.map((stage) => {
                    const isSelected = selectedStages.includes(stage.id) || stage.locked;
                    return (
                      <div
                        key={stage.id}
                        className={[
                          "flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[40px]",
                          stage.locked ? "bg-[#EAEAEA]/25" : "bg-white"
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                          <GripIcon />
                          <span>{stage.label}</span>
                        </div>
                        {stage.locked ? (
                          <LockOutlinedIcon sx={{ fontSize: 14, color: "#999999" }} />
                        ) : (
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`Toggle ${stage.label}`}
                            onClick={() => toggleStage(stage.id, stage.locked)}
                            className={[
                              "h-[16px] w-[16px] rounded-[4px] border flex items-center justify-center",
                              isSelected ? "border-[#6E41E2] bg-[#6E41E2]" : "border-[#D7D7D7] bg-white"
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
                  })}
                </div>
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
              <Button variant="contained" sx={primaryButtonSx} onClick={handleCreatePipeline}>
                Create Pipeline
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringPipeline;
