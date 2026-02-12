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

const initialTypes = [
  { id: "internal", label: "Internal Meeting", deletable: false },
  { id: "client", label: "Client Meeting", deletable: false }
];

const MeetingType: React.FC = () => {
  const [types, setTypes] = useState(initialTypes);
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState("");
  const lockedTooltip = "Certain status cannot be edited, deleted or moved.";
  const deleteTooltip = "You want to Remove this field? Your data associated with this field will be set as Empty!";

  const handleAddType = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewType("");
  };

  const handleSaveAdd = () => {
    const label = newType.trim();
    if (!label) {
      return;
    }
    setTypes((prev) => [
      ...prev,
      { id: `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, label, deletable: true }
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
          onClick={handleAddType}
        >
          Meeting Type
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[6px] overflow-hidden">
        <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#CCCCCC80] bg-[#EAEAEA26]">
          <span className="text-[14px] font-[500] text-[#333333]">Meeting Type</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex flex-col gap-3">
            {types.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white"
              >
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <span>{type.label}</span>
                </div>
                <div className="flex items-center justify-center text-[#666666]">
                  {type.deletable ? (
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
            ))}

            {isAdding && (
              <div className="flex items-center justify-between border border-[#E6E6E6] rounded-[6px] px-3 h-[44px] bg-white">
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <input
                    type="text"
                    placeholder="Add new meeting type"
                    value={newType}
                    onChange={(event) => setNewType(event.target.value)}
                    className="h-[28px] w-[220px] rounded-[4px] border border-[#D8D8D8] px-2 text-[13px] text-[#333333] focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-center text-[#666666]">
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

export default MeetingType;
