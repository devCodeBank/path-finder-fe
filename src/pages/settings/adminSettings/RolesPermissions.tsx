import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RoleRow {
  id: string;
  customRoleName: string;
  description: string;
  createdDate: string;
  createdBy: string;
}

const getMockRoles = (): RoleRow[] => {
  return [
    {
      id: "1",
      customRoleName: "Regional Auditor",
      description: "View only access to regional branch performance and financial logs",
      createdDate: "01/05/2025",
      createdBy: "John Doe",
    },
    {
      id: "2",
      customRoleName: "Talent Pipeline Manager",
      description: "Create and edit candidate records only",
      createdDate: "31/08/2025",
      createdBy: "John Doe",
    },
    {
      id: "3",
      customRoleName: "External vendor Coordinator",
      description: "Manage third-party job board integrations and external posting permissions",
      createdDate: "03/09/2025",
      createdBy: "John Doe",
    },
  ];
};

export const RolesPermissions: React.FC = () => {
  const navigate = useNavigate();
  const rows = getMockRoles();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < rows.length;

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const handleFilterClick = () => {
    // TODO: implement filter panel/modal
    console.warn("Filter clicked");
  };

  const handleViewSystemRoles = () => {
    navigate("/settings/admin/roles-permissions/system-roles");
  };

  const handleCreateCustomRole = () => {
    navigate("/settings/admin/roles-permissions/create-custom");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* <SettingsHeader title="Roles & Permissions" /> */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] text-[#333333]/70">
          <SecurityOutlinedIcon fontSize="small" />
          <span>{rows.length} custom roles</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            onClick={handleFilterClick}
            startIcon={<FilterAltOutlinedIcon fontSize="small" />}
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
                boxShadow: "none",
              },
            }}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            onClick={handleViewSystemRoles}
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
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
                boxShadow: "none",
              },
            }}
          >
            View System Roles
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCustomRole}
            startIcon={<AddIcon fontSize="small" />}
            sx={{
              height: "36px",
              backgroundColor: "#6E41E2",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "4px",
              boxShadow: "none",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#7B52F4",
                boxShadow: "none",
              },
            }}
          >
            Create Custom Role
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="grid grid-cols-[0.4fr_2.2fr_2.8fr_1.4fr_0.6fr] gap-2 px-4 py-3 text-[12px] font-[500] text-[#333333]/70 border-b border-[#CCCCCC80] bg-[#FAFAFA]">
          <div className="flex items-center">
            <input
              type="checkbox"
              ref={selectAllRef}
              className="h-[14px] w-[14px] rounded border border-[#CCCCCC80] accent-[#57CC4D]"
              checked={allSelected}
              onChange={() => {
                if (isIndeterminate || allSelected) {
                  setSelectedIds([]);
                } else {
                  setSelectedIds(rows.map((row) => row.id));
                }
              }}
              aria-checked={isIndeterminate ? "mixed" : allSelected}
              aria-label="Select all roles"
            />
          </div>
          <span>Custom Role Name</span>
          <span>Description</span>
          <span>Created By</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-[#CCCCCC80]">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[0.4fr_2.2fr_2.8fr_1.4fr_0.6fr] gap-2 px-4 py-3 text-[13px] text-[#333333] items-center"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={(event) => {
                    setSelectedIds((prev) =>
                      event.target.checked
                        ? [...prev, row.id]
                        : prev.filter((id) => id !== row.id)
                    );
                  }}
                  aria-label={`Select ${row.customRoleName}`}
                  className="h-[14px] w-[14px] rounded border border-[#CCCCCC80] accent-[#57CC4D]"
                />
              </div>
              <span className="font-[500]">{row.customRoleName}</span>
              <span className="text-[#333333]/80 truncate max-w-[420px]">{row.description}</span>
              <div className="flex flex-col text-[12px] text-[#333333]/80">
                <span className="text-[13px] text-[#333333]">{row.createdBy}</span>
                <span>{row.createdDate}</span>
              </div>
              <div className="flex justify-end">
                <IconButton
                  aria-label={`row actions for ${row.customRoleName}`}
                  size="small"
                  sx={{
                    border: "1px solid #CCCCCC80",
                    borderRadius: "4px",
                    width: "28px",
                    height: "28px",
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px] text-[#333333]/70 border-t border-[#CCCCCC80]">
          <span>Showing 1 to {rows.length} of {rows.length} results</span>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <div className="relative">
              <select
                className="h-[32px] w-[70px] rounded-[4px] border border-[#CCCCCC80] bg-white px-2 text-[12px] text-[#333333]"
                defaultValue="20"
                aria-label="Rows per page"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Page 1 of 1</span>
            <div className="flex items-center gap-2">
              <IconButton size="small" sx={{ border: "1px solid #CCCCCC80", borderRadius: "4px" }}>
                <FirstPageIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ border: "1px solid #CCCCCC80", borderRadius: "4px" }}>
                <NavigateBeforeIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ border: "1px solid #CCCCCC80", borderRadius: "4px" }}>
                <NavigateNextIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ border: "1px solid #CCCCCC80", borderRadius: "4px" }}>
                <LastPageIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;
