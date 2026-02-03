import AddIcon from "@mui/icons-material/Add";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, IconButton, Menu, MenuItem, SvgIcon, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import CreateCustomRole from "@pages/settings/adminSettings/rolesPermissions/CustomRole/CreateCustomRole";
import SystemRoles from "@pages/settings/adminSettings/rolesPermissions/SystemRoles/SystemRoles";
import CloseXIcon from "@assets/icons/x.svg";

interface RoleRow {
  id: string;
  customRoleName: string;
  description: string;
  createdDate: string;
  createdBy: string;
  users: string;
}

const DescriptionCell: React.FC<{ text: string; maxWidth?: number }> = ({ text, maxWidth = 300 }) => {
  const content = (
    <span
      className="text-[#333333] truncate inline-block align-middle"
      style={{ maxWidth }}
    >
      {text}
    </span>
  );

  return (
    <Tooltip
      title={text}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            minWidth: "220px",
            maxWidth: "260px",
            width: "230px",
            minHeight: "36px",
            bgcolor: "#666666",
            color: "#FFFFFF",
            fontSize: "12px",
            lineHeight: "16px",
            borderRadius: "6px",
            px: 2,
            py: 1,
            textAlign: "center",
          },
        },
        arrow: { sx: { color: "#666666" } },
        popper: { sx: { zIndex: 2300 } },
      }}
    >
      {content}
    </Tooltip>
  );
};

const getMockRoles = (): RoleRow[] => {
  return [
    {
      id: "1",
      customRoleName: "Regional Auditor",
      description: "View only access to regional branch performance and financial logs",
      createdDate: "01/05/2025",
      createdBy: "John Doe",
      users: "5",
    },
    {
      id: "2",
      customRoleName: "Talent Pipeline Manager",
      description: "Create and edit candidate records only",
      createdDate: "31/08/2025",
      createdBy: "John Doe",
      users: "12",
    },
    {
      id: "3",
      customRoleName: "External vendor Coordinator",
      description: "Manage third-party job board integrations and external posting permissions",
      createdDate: "03/09/2025",
      createdBy: "John Doe",
      users: "3",
    },
  ];
};

export const RolesPermissions: React.FC = () => {
  const rows = getMockRoles();
  const [anchorByRowId, setAnchorByRowId] = useState<Record<string, HTMLElement | null>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const createCloseTimerRef = useRef<number | null>(null);
  const [customRoleName, setCustomRoleName] = useState("");
  const [customRoleDescription, setCustomRoleDescription] = useState("");
  const [showCustomRoleErrors, setShowCustomRoleErrors] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [isSystemVisible, setIsSystemVisible] = useState(false);
  const systemCloseTimerRef = useRef<number | null>(null);

  const handleFilterClick = () => {
    // TODO: implement filter panel/modal
    console.warn("Filter clicked");
  };

  const handleViewSystemRoles = () => {
    if (systemCloseTimerRef.current) {
      window.clearTimeout(systemCloseTimerRef.current);
      systemCloseTimerRef.current = null;
    }
    setIsSystemOpen(true);
    requestAnimationFrame(() => setIsSystemVisible(true));
  };

  const handleCreateCustomRole = () => {
    if (createCloseTimerRef.current) {
      window.clearTimeout(createCloseTimerRef.current);
      createCloseTimerRef.current = null;
    }
    setCustomRoleName("");
    setCustomRoleDescription("");
    setShowCustomRoleErrors(false);
    setIsCreateOpen(true);
    requestAnimationFrame(() => setIsCreateVisible(true));
  };
  const handleOpenRowMenu = (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };

  const handleCloseRowMenu = (rowId: string) => () => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const handleCloseCreatePanel = () => {
    setIsCreateVisible(false);
    if (createCloseTimerRef.current) {
      window.clearTimeout(createCloseTimerRef.current);
    }
    createCloseTimerRef.current = window.setTimeout(() => {
      setIsCreateOpen(false);
      createCloseTimerRef.current = null;
    }, 300);
  };

  const handleCloseSystemPanel = () => {
    setIsSystemVisible(false);
    if (systemCloseTimerRef.current) {
      window.clearTimeout(systemCloseTimerRef.current);
    }
    systemCloseTimerRef.current = window.setTimeout(() => {
      setIsSystemOpen(false);
      systemCloseTimerRef.current = null;
    }, 300);
  };

  const openCreateFromSystem = () => {
    handleCloseSystemPanel();
    handleCreateCustomRole();
  };
  const rowsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const isSinglePage = totalPages <= 1;

  return (
    <div className="flex flex-col w-full">


      <div className="flex flex-wrap items-center justify-between gap-3 mt-2 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            onClick={handleFilterClick}
            startIcon={
              <SvgIcon
                fontSize="small"
                viewBox="0 0 20 20"
                sx={{ stroke: "currentColor", fill: "none", color: "#666666", opacity: "50%" }}
              >
                <path
                  d="M3.5 4.5H16.5L12 9.5V14.25L8 16V9.5L3.5 4.5Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </SvgIcon>
            }
            sx={{
              width: "94px",
              height: "36px",
              borderColor: "#CCCCCC80",
              color: "#333333",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 400,
              borderRadius: "4px",
              boxShadow: "none",
              "& .MuiButton-startIcon": {
                borderRadius: "4px",
              },
              "&:hover": {
                borderColor: "#CCCCCC80",
                backgroundColor: "#F3F4F6",
                boxShadow: "none",
              },
            }}
          >
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="outlined"
            onClick={handleViewSystemRoles}
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            sx={{
              height: "36px",
              width: "auto",
              borderColor: "#6E41E2",
              color: "#6E41E2",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "4px",
              padding: "0 14px",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#6E41E2",
                backgroundColor: "rgba(110, 65, 226, 0.08)",
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
              width: "auto",
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
        <div className="px-4 h-[52px] flex items-center ">
          <div className="flex items-center gap-2 text-[13px] text-[#333333]/70">
            <SecurityOutlinedIcon fontSize="small" />
            <span>{rows.length} custom roles</span>
          </div>
        </div>
        <div className="grid h-[52px] grid-cols-[2.2fr_2.8fr_1.4fr_0.6fr_0.5fr] gap-2 px-4 text-[14px] font-[500] text-[#333333] border-b border-[#CCCCCC80] bg-[#EAEAEA]/25 items-center">
          <span>Custom Role Name</span>
          <span>Description</span>
          <span>Created By</span>
          <span>Users</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-[#CCCCCC80]">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[2.2fr_2.8fr_1.4fr_0.6fr_0.5fr] gap-2 px-4 py-3 text-[13px] font-[400] text-[#333333] items-center transition-colors hover:bg-[#EAEAEA]/25"
            >
              <span className="font-[400] text-[13px]">{row.customRoleName}</span>
              <DescriptionCell text={row.description} />
              <div className="flex flex-col text-[13px] text-[#333333]">
                <span className="text-[13px] text-[#333333]">{row.createdBy}</span>
                <span className="text-[#333333]/70">{row.createdDate}</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex h-[28px] min-w-[28px] items-center justify-center rounded-[4px] bg-[#6E41E2] px-2 text-[12px] font-[500] text-white">
                  {row.users}
                </span>
              </div>
              <div className="flex justify-end">
                <IconButton
                  aria-label={`row actions for ${row.customRoleName}`}
                  size="small"
                  onClick={handleOpenRowMenu(row.id)}
                  sx={{
                    border: "1px solid #CCCCCC80",
                    borderRadius: "4px",
                    width: "28px",
                    height: "28px",
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorByRowId[row.id]}
                  open={Boolean(anchorByRowId[row.id])}
                  onClose={handleCloseRowMenu(row.id)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: "6px",
                      minWidth: "100px",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                      border: "1px solid #E5E5E580",
                      backgroundColor: "#FFFFFF",
                      py: 0.5,
                    },
                  }}

                >
                  <MenuItem onClick={handleCloseRowMenu(row.id)} sx={{ fontSize: "13px", color: "#333333" }}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={handleCloseRowMenu(row.id)} sx={{ fontSize: "13px", color: "#333333" }}>
                    Disable
                  </MenuItem>
                  <MenuItem onClick={handleCloseRowMenu(row.id)} sx={{ fontSize: "13px", color: "#333333" }}>
                    View
                  </MenuItem>
                </Menu>
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
                className="h-[32px] w-[70px] appearance-none rounded-[4px] border border-[#CCCCCC80] bg-white px-2 pr-7 text-[12px] text-[#333333] hover:border-[#666666] focus:border-[#CCCCCC80] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                defaultValue="20"
                aria-label="Rows per page"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <svg
                className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#666666]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.25 7.5L10 12.25L14.75 7.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Page 1 of {totalPages}</span>
            <div className="flex items-center gap-2">
              <IconButton
                size="small"
                disabled={isSinglePage}
                sx={{
                  border: "1px solid #CCCCCC80",
                  borderRadius: "4px",
                  "&.Mui-disabled": { color: "#999999", borderColor: "#CCCCCC80" },
                }}
              >
                <FirstPageIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={isSinglePage}
                sx={{
                  border: "1px solid #CCCCCC80",
                  borderRadius: "4px",
                  "&.Mui-disabled": { color: "#999999", borderColor: "#CCCCCC80" },
                }}
              >
                <NavigateBeforeIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={isSinglePage}
                sx={{
                  border: "1px solid #CCCCCC80",
                  borderRadius: "4px",
                  "&.Mui-disabled": { color: "#999999", borderColor: "#CCCCCC80" },
                }}
              >
                <NavigateNextIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={isSinglePage}
                sx={{
                  border: "1px solid #CCCCCC80",
                  borderRadius: "4px",
                  "&.Mui-disabled": { color: "#999999", borderColor: "#CCCCCC80" },
                }}
              >
                <LastPageIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex justify-end bg-[#00000066] transition-opacity duration-300",
            isCreateVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[60vw] max-w-[60vw] h-full  bg-white shadow-[0px_10px_30px_0px_#00000024] flex flex-col overflow-hidden transition-transform duration-300 ease-out",
              isCreateVisible ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            <div className="h-[52px] pr-[30px] pt-10 py-7  px-4 border-b border-[#CCCCCC80] flex items-center justify-between shrink-0">
              <span className="text-[16px] font-[500] text-[#333333]">Create Custom Role</span>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 2400 } },
                }}
              >
                <button
                  type="button"
                  aria-label="Close create role"
                  className="group inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity "
                  onClick={handleCloseCreatePanel}
                >
                  <img
                    src={CloseXIcon}
                    alt=""
                    className="h-[15px] w-[15px] transition-[filter] group-hover:filter group-hover:invert group-hover:brightness-[-2]"
                  />
                </button>
              </Tooltip>
            </div>
            <div className="px-4 py-4 flex-1 overflow-y-auto">
              <CreateCustomRole
                roleName={customRoleName}
                roleDescription={customRoleDescription}
                showErrors={showCustomRoleErrors}
                onChange={(field, value) => {
                  if (field === "roleName") setCustomRoleName(value);
                  if (field === "roleDescription") setCustomRoleDescription(value);
                }}
              />
            </div>
            <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3 shrink-0">
              <Button
                variant="outlined"
                onClick={handleCloseCreatePanel}
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
                Cancel
              </Button>
              <Button
                variant="contained"
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
                onClick={() => {
                  if (customRoleName.trim() === "" || customRoleDescription.trim() === "") {
                    setShowCustomRoleErrors(true);
                    return;
                  }
                  console.warn("Save custom role");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSystemOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex justify-end bg-[#00000066] transition-opacity duration-300",
            isSystemVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[60vw] max-w-[60vw] h-full  bg-white shadow-[0px_10px_30px_0px_#00000024] flex flex-col overflow-hidden transition-transform duration-300 ease-out",
              isSystemVisible ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            <div className="h-[52px] pr-[30px] px-4 pt-10 py-7 border-b border-[#CCCCCC80] flex items-center justify-between shrink-0">
              <span className="text-[16px] font-[500] text-[#333333]">System Roles</span>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 2400 } },
                }}
              >
                <button
                  type="button"
                  aria-label="Close system roles"
                  className="group inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                  onClick={handleCloseSystemPanel}
                >
                  <img
                    src={CloseXIcon}
                    alt=""
                    className="h-[15px] w-[15px]transition-[filter] group-hover:filter group-hover:invert group-hover:brightness-[-2]"
                  />
                </button>
              </Tooltip>
            </div>
            <div className="px-4 py-4 flex-1 overflow-y-auto">
              <SystemRoles onCreateCustomRole={openCreateFromSystem} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;
