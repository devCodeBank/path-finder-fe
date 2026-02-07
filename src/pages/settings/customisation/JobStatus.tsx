import React, { useRef, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Tooltip } from "@mui/material";
import CloseXIcon from "@assets/icons/x.svg";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";

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

const GripIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="2" cy="2" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="6" cy="2" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="2" cy="6" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="6" cy="6" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="2" cy="10" r="1" fill="rgba(51, 51, 51, 0.7)" />
    <circle cx="6" cy="10" r="1" fill="rgba(51, 51, 51, 0.7)" />
  </svg>
);

const statusItems = [
  {
    id: "draft",
    title: "Draft",
    description: "Internal drafting phase. The job is not visible to candidates or external job boards.",
    category: "Preparation"
  },
  {
    id: "open",
    title: "Open",
    description: "The role is actively recruiting. Applications are being accepted and the post is public.",
    category: "Active"
  },
  {
    id: "on-hold",
    title: "On Hold",
    description: "Recruitment is currently suspended. No new applications can be submitted.",
    category: "Paused"
  },
  {
    id: "filled",
    title: "Filled",
    description: "A candidate has been successfully hired and the position is no longer available.",
    category: "Closed"
  },
  {
    id: "cancelled",
    title: "Cancelled",
    description: "The requisition is withdrawn before a hire was made. All activity is stopped.",
    category: "Closed"
  },
  {
    id: "archived",
    title: "Archived",
    description: "Administrative archived state. Used for historical reporting once all tasks are done.",
    category: "Closed"
  }
];

const JobStatus: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const [form, setForm] = useState({
    statusName: "",
    categoryGroup: "active",
    description: ""
  });

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

  const handleInputChange =
    (field: "statusName" | "description") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
      };

  return (
    <div className="flex flex-col gap-4">
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
          {statusItems.map((status) => (
            <div
              key={status.id}
              className="flex gap-4 items-start border border-[#E6E6E6] rounded-[6px] bg-white px-4 py-3"
            >
              <div className="pt-6 text-[#333333]">
                <GripIcon />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="px-3 h-[22px] rounded-full bg-[#EAEAEA]/25 border border-[#E6E6E6] text-[#333333] font-[500] text-[13px] flex items-center">
                    {status.title}
                  </span>
                  <span className="flex items-center gap-1 px-2 h-[22px] rounded-full  bg-[#EAEAEA]/25  text-[#333333] font-[400] text-[13px]">
                    <LockOutlinedIcon sx={{ fontSize: 12, color: "#999999" }} />
                    System
                  </span>
                </div>
                <div className="text-[13px] text-[#333333]/70">{status.description}</div>
                <div className="text-[13px] text-[#333333]/70">
                  Category: <span className="text-[#333333]">{status.category}</span>
                </div>
              </div>
            </div>
          ))}
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
              <span className="text-[16px] font-[500] text-[#333333] pt-3">Add Custom Job Status</span>
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
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px]" />
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
                    { value: "active", label: "Active (Public / Recruiting)" },
                    { value: "preparation", label: "Preparation (Drafting)" },
                    { value: "paused", label: "Paused (On Hold)" },
                    { value: "closed", label: "Closed (Filled / Cancelled)" }
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
                onClick={closePanel}
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
