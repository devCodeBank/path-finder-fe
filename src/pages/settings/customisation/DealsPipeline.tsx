import React, { useState } from "react";
import { Button } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
    setRows((prev) => [
      ...prev,
      {
        id: `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        label,
        probability,
        color: "#3F51E5",
        deletable: true
      }
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
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[2.2fr_2fr_0.6fr] gap-4 items-center border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white"
              >
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <GripIcon />
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
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                  )}
                </div>
              </div>
            ))}

            {isAdding && (
              <div className="grid grid-cols-[2.2fr_2fr_0.6fr] gap-4 items-center border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white">
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <GripIcon />
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

export default DealsPipeline;
