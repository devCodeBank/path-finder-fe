import React, { useState } from "react";
import { Button } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={primaryButtonSx}
          startIcon={<span className="text-[16px]">+</span>}
          onClick={handleAddStage}
        >
          Contact Stage
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden">
        <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#CCCCCC80]">
          <span className="text-[14px] font-[500] text-[#333333]">Contact Stage</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex flex-col gap-3">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white"
              >
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <GripIcon />
                  <span>{stage.label}</span>
                </div>
                <div className="flex items-center justify-center text-[#666666]">
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
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
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
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

export default ContactStage;
