import { SvgIcon } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import { cn } from "@/lib/utils";
import CloseXIcon from "@assets/icons/x.svg";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 24px;
  margin-top: 8px;
`;

type UserStatus = "Active" | "Pending" | "Link Expired" | "Disabled" | "Locked Out";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle?: string;
  teams?: string;
  status: UserStatus;
  lastActivity: string;
  lastActivityDate: string;
  companyName: string;
  contactNumber: string;
  timeZone: string;
  city: string;
  state: string;
  country: string;
  currency: string;
}

interface InviteUserForm {
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  jobTitle: string;
  contactNumber: string;
  timeZone: string;
  city: string;
  state: string;
  country: string;
  roles: string[];
  customRoles: string[];
}

const getTimeZoneOffsetLabel = (timeZone: string) => {
  const now = new Date();
  const local = new Date(now.toLocaleString("en-US", { timeZone }));
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMinutes = Math.round((local.getTime() - utc.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const minutes = String(absMinutes % 60).padStart(2, "0");
  return `(GMT ${sign}${hours}:${minutes})`;
};

const timeZoneOptions = (() => {
  const zones =
    typeof Intl !== "undefined" && "supportedValuesOf" in Intl
      ? Intl.supportedValuesOf("timeZone")
      : ["UTC"];
  return zones
    .map((zone) => ({
      value: zone,
      label: `${getTimeZoneOffsetLabel(zone)} ${zone}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
})();

const teamOptions = [
  { value: "sales", label: "Sales" },
  { value: "default", label: "Default" },
];

const cityOptions = [
  { value: "auckland", label: "Auckland" },
  { value: "wellington", label: "Wellington" },
  { value: "christchurch", label: "Christchurch" },
  { value: "hamilton", label: "Hamilton" },
];

const stateOptions = [
  { value: "auckland", label: "Auckland" },
  { value: "wellington", label: "Wellington" },
  { value: "christchurch", label: "Christchurch" },
  { value: "hamilton", label: "Hamilton" },
];

const countryOptions = [
  { value: "nz", label: "New Zealand" },
  { value: "au", label: "Australia" },
  { value: "us", label: "United States" },
];

const systemRoles = ["Super Admin", "Administrator", "Standard User", "Collaborator"];

const customRoles = [
  {
    id: "regional-auditor",
    name: "Regional Auditor",
    description: "View only access to regional branch performance and financial logs",
  },
  {
    id: "talent-pipeline-manager",
    name: "Talent Pipeline Manager",
    description: "Create and edit candidate records only",
  },
  {
    id: "external-vendor-coordinator",
    name: "External vendor Coordinator",
    description: "Manage third-party job board integrations and external posting permissions",
  },
];

const getMockUsers = (): UserRow[] => {
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john.d@acmecorp.com",
      role: "Account Owner",
      jobTitle: "Director, Sales",
      teams: "Sales",
      status: "Active",
      lastActivity: "about 6 hours ago",
      lastActivityDate: "01/05/2025",
      companyName: "Acme Corporation",
      contactNumber: "12-345663321",
      timeZone: "Pacific/Auckland",
      city: "Auckland",
      state: "Auckland",
      country: "New Zealand",
      currency: "Dollar ($NZD - New Zealand)",
    },
    {
      id: "2",
      name: "David Miller",
      email: "david.m@acmecorp.com",
      role: "Standard User",
      jobTitle: "Account Manager",
      teams: "Default",
      status: "Disabled",
      lastActivity: "about 7 days ago",
      lastActivityDate: "23/04/2025",
      companyName: "Acme Corporation",
      contactNumber: "12-345663321",
      timeZone: "Pacific/Auckland",
      city: "Auckland",
      state: "Auckland",
      country: "New Zealand",
      currency: "Dollar ($NZD - New Zealand)",
    },
    {
      id: "3",
      name: "Jessica Lee",
      email: "j.lee@acmecorp.com",
      role: "Administrator",
      jobTitle: "Managing Consultant",
      teams: "Default",
      status: "Pending",
      lastActivity: "about 2 hours ago",
      lastActivityDate: "01/05/2025",
      companyName: "Acme Corporation",
      contactNumber: "12-345663321",
      timeZone: "Pacific/Auckland",
      city: "Auckland",
      state: "Auckland",
      country: "New Zealand",
      currency: "Dollar ($NZD - New Zealand)",
    },
    {
      id: "4",
      name: "Alex Rivera",
      email: "a.rivera@acmecorp.com",
      role: "Standard User",
      jobTitle: "Account Manager",
      teams: "Default",
      status: "Link Expired",
      lastActivity: "about 6 hours ago",
      lastActivityDate: "01/05/2025",
      companyName: "Acme Corporation",
      contactNumber: "12-345663321",
      timeZone: "Pacific/Auckland",
      city: "Auckland",
      state: "Auckland",
      country: "New Zealand",
      currency: "Dollar ($NZD - New Zealand)",
    },
    {
      id: "5",
      name: "Sophie Taylor",
      email: "s.taylor@acmecorp.com",
      role: "Standard User",
      jobTitle: "Recruitment Consultant",
      teams: "Default",
      status: "Locked Out",
      lastActivity: "about 3 hours ago",
      lastActivityDate: "01/05/2025",
      companyName: "Acme Corporation",
      contactNumber: "12-345663321",
      timeZone: "Pacific/Auckland",
      city: "Auckland",
      state: "Auckland",
      country: "New Zealand",
      currency: "Dollar ($NZD - New Zealand)",
    },
  ];
};

export const Users: React.FC = () => {
  const rows: UserRow[] = getMockUsers();
  const [anchorByRowId, setAnchorByRowId] = useState<Record<string, HTMLElement | null>>({});
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [showInviteErrors, setShowInviteErrors] = useState(false);
  const [detailsUser, setDetailsUser] = useState<UserRow | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [inviteMode, setInviteMode] = useState<"invite" | "edit" | "resend">("invite");
  const inviteCloseTimerRef = useRef<number | null>(null);
  const detailsCloseTimerRef = useRef<number | null>(null);
  const createDefaultInviteForm = (): InviteUserForm => ({
    firstName: "",
    lastName: "",
    email: "",
    team: "",
    jobTitle: "",
    contactNumber: "",
    timeZone: "Pacific/Auckland",
    city: "auckland",
    state: "auckland",
    country: "nz",
    roles: [],
    customRoles: [],
  });
  const [inviteForm, setInviteForm] = useState<InviteUserForm>(createDefaultInviteForm);

  const handleOpenRowMenu = (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };

  const handleCloseRowMenu = (rowId: string) => () => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const handleAddUser = () => {
    setShowInviteErrors(false);
    setEditingUser(null);
    setInviteMode("invite");
    setInviteForm(createDefaultInviteForm());
    openInvitePanel();
  };

  const handleEditUser = (row: UserRow) => {
    const [firstName, ...rest] = row.name.split(" ");
    setEditingUser(row);
    setInviteMode("edit");
    const assignedRoles = systemRoles.includes(row.role) ? [row.role] : [];
    setInviteForm((prev) => ({
      ...prev,
      firstName,
      lastName: rest.join(" "),
      email: row.email,
      jobTitle: row.jobTitle ?? "",
      timeZone: row.timeZone,
      city: row.city.toLowerCase(),
      state: row.state.toLowerCase(),
      country: row.country === "New Zealand" ? "nz" : row.country === "Australia" ? "au" : "us",
      roles: assignedRoles,
    }));
    setShowInviteErrors(false);
    openInvitePanel();
  };

  const handleResendInvite = (row: UserRow) => {
    const [firstName, ...rest] = row.name.split(" ");
    setEditingUser(row);
    setInviteMode("resend");
    const assignedRoles = systemRoles.includes(row.role) ? [row.role] : [];
    setInviteForm((prev) => ({
      ...prev,
      firstName,
      lastName: rest.join(" "),
      email: row.email,
      team: row.teams?.toLowerCase() ?? "",
      jobTitle: row.jobTitle ?? "",
      timeZone: row.timeZone,
      city: row.city.toLowerCase(),
      state: row.state.toLowerCase(),
      country: row.country === "New Zealand" ? "nz" : row.country === "Australia" ? "au" : "us",
      roles: assignedRoles,
    }));
    setShowInviteErrors(false);
    openInvitePanel();
  };
  const openInvitePanel = () => {
    if (inviteCloseTimerRef.current) {
      window.clearTimeout(inviteCloseTimerRef.current);
      inviteCloseTimerRef.current = null;
    }
    setIsInviteOpen(true);
    requestAnimationFrame(() => setIsInviteVisible(true));
  };

  const closeInvitePanel = () => {
    setIsInviteVisible(false);
    if (inviteCloseTimerRef.current) {
      window.clearTimeout(inviteCloseTimerRef.current);
    }
    inviteCloseTimerRef.current = window.setTimeout(() => {
      setIsInviteOpen(false);
      inviteCloseTimerRef.current = null;
    }, 300);
  };

  const openDetailsPanel = (row: UserRow) => {
    if (detailsCloseTimerRef.current) {
      window.clearTimeout(detailsCloseTimerRef.current);
      detailsCloseTimerRef.current = null;
    }
    setDetailsUser(row);
    setIsDetailsOpen(true);
    requestAnimationFrame(() => setIsDetailsVisible(true));
  };

  const closeDetailsPanel = () => {
    setIsDetailsVisible(false);
    if (detailsCloseTimerRef.current) {
      window.clearTimeout(detailsCloseTimerRef.current);
    }
    detailsCloseTimerRef.current = window.setTimeout(() => {
      setIsDetailsOpen(false);
      setDetailsUser(null);
      detailsCloseTimerRef.current = null;
    }, 300);
  };
  const handleFilterClick = () => {
    console.warn("Filter clicked");
  };

  const handleInviteInputChange = (field: keyof InviteUserForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleInviteSelectChange = (field: keyof InviteUserForm) => (value: string) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (role: string) => {
    setInviteForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const toggleCustomRole = (roleId: string) => {
    setInviteForm((prev) => ({
      ...prev,
      customRoles: prev.customRoles.includes(roleId)
        ? prev.customRoles.filter((r) => r !== roleId)
        : [...prev.customRoles, roleId],
    }));
  };

  const isInviteMissing = (value: string) => showInviteErrors && value.trim() === "";

  const getMenuState = (status: UserStatus) => {
    return {
      edit: status === "Active",
      resendInvite: status === "Link Expired",
      copyInviteLink: status === "Pending",
      deleteUser: status === "Pending" || status === "Link Expired",
      disableUser: status === "Active",
      reactivateUser: status === "Disabled",
      viewDetails: status === "Active" || status === "Disabled" || status === "Locked Out",
      unlockUser: status === "Locked Out",
    };
  };
  const rowsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const isSinglePage = totalPages <= 1;

  return (
    <Container>


      <Toolbar>
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
        <Button
          variant="contained"
          onClick={handleAddUser}
          startIcon={<PersonAddAltOutlinedIcon fontSize="small" />}
          sx={{
            height: "36px",
            width: "125px",
            backgroundColor: "#6E41E2",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 500,
            minWidth: "121px",
            borderRadius: "4px",
            boxShadow: "none",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#7B52F4",
              boxShadow: "none",
            },
          }}
        >
          Invite User
        </Button>
      </Toolbar>

      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="px-4 h-[52px] flex items-center">
          <div className="flex items-center gap-3 text-[13px] text-[#333333]">
            <PeopleOutlineIcon fontSize="small" />
            <span>{rows.length} total users</span>
          </div>
        </div>
        <div className="grid h-[52px] grid-cols-[2.2fr_1.5fr_1.2fr_1.6fr_1.2fr_1.4fr_0.6fr] gap-2 px-4 text-[14px] font-[500] text-[#333333] border-b border-[#CCCCCC80] bg-[#FAFAFA] items-center justify-items-start text-left">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Job Title</span>
          <span>Teams</span>
          <span>Last Activity</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-[#CCCCCC80]">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[2.2fr_1.5fr_1.2fr_1.6fr_1.2fr_1.4fr_0.6fr] gap-2 px-4 py-3 text-[13px] text-[#333333] items-center transition-colors hover:bg-[#EAEAEA]/25"
            >
              <div className="flex items-center gap-3">
                <div className="h-[32px] w-[32px] rounded-full bg-[#EAEAEA]/25 flex items-center justify-center text-[11px] text-[#333333]">
                  {row.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div className=" flex flex-col ">
                  <span className="text-[13px] font-[500]">{row.name}</span>
                  <span className="text-[13px] font-[400] text-[#333333]/70">{row.email}</span>
                </div>
              </div>
              <span className="inline-flex h-[20px] w-[106px] items-center justify-start rounded-[4px] bg-[#6E41E2] px-2 text-[12px] font-[500] text-white">
                {row.role}
              </span>
              <span className="inline-flex h-[20px] w-[88px] items-center rounded-[4px] bg-[#6E41E2] px-2 text-[12px] font-[500] text-white">
                {row.status === "Pending" ? "Pending" : row.status === "Link Expired" ? "Link Expired" : row.status}
              </span>
              <span>{row.jobTitle ?? "Not Available"}</span>
              <span>{row.teams ?? "Not Available"}</span>
              <div className="flex flex-col">
                <span>{row.lastActivity}</span>
                <span className="text-[12px] text-[#333333]/70">{row.lastActivityDate}</span>
              </div>
              <div className="flex justify-end">
                <IconButton aria-label={`row actions for ${row.name}`} onClick={handleOpenRowMenu(row.id)} size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorByRowId[row.id]}
                  open={Boolean(anchorByRowId[row.id])}
                  onClose={handleCloseRowMenu(row.id)}

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
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {(() => {
                    const menuState = getMenuState(row.status);
                    return (
                      <>
                        <MenuItem
                          onClick={() => {
                            handleCloseRowMenu(row.id)();
                            handleEditUser(row);
                          }}
                          disabled={!menuState.edit}
                          sx={{ fontSize: "13px", color: menuState.edit ? "#333333" : "#999999" }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          disabled={!menuState.resendInvite}
                          onClick={() => {
                            handleCloseRowMenu(row.id)();
                            handleResendInvite(row);
                          }}
                          sx={{ fontSize: "13px", color: menuState.resendInvite ? "#333333" : "#999999" }}
                        >
                          Resend Invite
                        </MenuItem>
                        <MenuItem disabled={!menuState.copyInviteLink} sx={{ fontSize: "13px", color: menuState.copyInviteLink ? "#333333" : "#999999" }}>
                          Copy Invite Link
                        </MenuItem>
                        <MenuItem
                          disabled={!menuState.deleteUser}
                          onClick={handleCloseRowMenu(row.id)}
                          sx={{ fontSize: "13px", color: menuState.deleteUser ? "#333333" : "#999999" }}
                        >
                          Delete User
                        </MenuItem>
                        <MenuItem
                          disabled={!menuState.disableUser}
                          onClick={handleCloseRowMenu(row.id)}
                          sx={{ fontSize: "13px", color: menuState.disableUser ? "#333333" : "#999999" }}
                        >
                          Disable User
                        </MenuItem>
                        <MenuItem disabled={!menuState.reactivateUser} sx={{ fontSize: "13px", color: menuState.reactivateUser ? "#333333" : "#999999" }}>
                          Reactivate User
                        </MenuItem>
                        <MenuItem
                          disabled={!menuState.viewDetails}
                          onClick={() => {
                            handleCloseRowMenu(row.id)();
                            openDetailsPanel(row);
                          }}
                          sx={{ fontSize: "13px", color: menuState.viewDetails ? "#333333" : "#999999" }}
                        >
                          View User Details
                        </MenuItem>
                        <MenuItem
                          disabled={!menuState.unlockUser}
                          onClick={handleCloseRowMenu(row.id)}
                          sx={{ fontSize: "13px", color: menuState.unlockUser ? "#333333" : "#999999" }}
                        >
                          Unlock User
                        </MenuItem>
                      </>
                    );
                  })()}
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
                className="h-[30px] min-w-[70px] appearance-none rounded-[4px] border border-[#CCCCCC80] bg-white px-2 pr-7 text-[12px] text-[#333333] hover:border-[#666666] focus:border-[#CCCCCC80] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                defaultValue="20"
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

      {isInviteOpen && (
        <div
          className={[
            "fixed inset-0 z-[2000] flex justify-end bg-[#00000066] transition-opacity duration-300",
            isInviteVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[60vw] max-w-[60vw] h-full bg-white flex flex-col transition-transform duration-300 ease-out",
              isInviteVisible ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 py-8.5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333] pt-3 ">
                {editingUser ? "Edit User" : "Invite User"}
              </span>
              <div className="flex items-center gap-3 padding-right-50px pr-[20px]">
                {editingUser?.status === "Active" && (
                  <span className="rounded-[4px] bg-[#2FB344] px-4 py-2 text-[12px] font-[500] text-white">
                    Active User
                  </span>
                )}
                {editingUser?.status === "Link Expired" && (
                  <span className="rounded-[4px] bg-[#E15555] px-4 py-2 text-[12px] font-[500] text-white">
                    Activation Link Expired
                  </span>
                )}
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
                    aria-label="Close"
                    className="inline-flex h-[24px] w-[24px] items-center  justify-center transition-opacity hover:opacity-80"
                    onClick={() => {
                      closeInvitePanel();
                      setShowInviteErrors(false);
                      setEditingUser(null);
                      setInviteMode("invite");
                    }}
                  >
                    <img src={CloseXIcon} alt="" className=" h-[15px] w-[15px] transition-[filter] group-hover:filter group-hover:invert group-hover:brightness-[-2]" />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="px-4 py-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    id="invite-first-name"
                    label="First Name"

                    floatLabel
                    required
                    placeholder="Add First Name"
                    value={inviteForm.firstName}
                    onChange={handleInviteInputChange("firstName")}
                    className={cn(
                      "w-full h-[36px]",
                      isInviteMissing(inviteForm.firstName) && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {isInviteMissing(inviteForm.firstName) && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *First name is required.
                    </span>
                  )}
                </div>
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    id="invite-last-name"
                    label="Last Name"

                    floatLabel
                    required
                    placeholder="Add Last Name"
                    value={inviteForm.lastName}
                    onChange={handleInviteInputChange("lastName")}
                    className={cn(
                      "w-full h-[36px]",
                      isInviteMissing(inviteForm.lastName) && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {isInviteMissing(inviteForm.lastName) && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Last name is required.
                    </span>
                  )}
                </div>
                <div className="relative flex flex-col pb-[14px]">
                  <FloatingLabelInput
                    id="invite-email"
                    label="Email"

                    floatLabel
                    required
                    placeholder="Add Email"
                    value={inviteForm.email}
                    onChange={handleInviteInputChange("email")}
                    className={cn(
                      "w-full h-[36px]",
                      isInviteMissing(inviteForm.email) && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]"
                    )}
                  />
                  {isInviteMissing(inviteForm.email) && (
                    <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                      *Email is required.
                    </span>
                  )}
                </div>
                <FloatingLabelSelect
                  id="invite-team"
                  label="Team"
                  className="text-[#333333]"

                  value={inviteForm.team}
                  onValueChange={handleInviteSelectChange("team")}
                  options={teamOptions}
                  placeholder="Select Team"
                />
                <FloatingLabelInput
                  id="invite-job-title"
                  label="Job Title"


                  floatLabel
                  placeholder="Add Job Title"
                  value={inviteForm.jobTitle}
                  onChange={handleInviteInputChange("jobTitle")}
                  className={cn("w-full h-[36px]")}
                />
                <FloatingLabelInput
                  id="invite-contact-number"
                  label="Contact Number"

                  floatLabel
                  placeholder="Add Contact Number"
                  value={inviteForm.contactNumber}
                  onChange={handleInviteInputChange("contactNumber")}
                  className={cn("w-full h-[36px]")}
                />
                <FloatingLabelSelect
                  id="invite-time-zone"
                  label="Time Zone"
                  className="text-[#333333]"

                  value={inviteForm.timeZone}
                  onValueChange={handleInviteSelectChange("timeZone")}
                  options={timeZoneOptions}
                  maxVisibleOptions={10}
                  placeholder="Select Time Zone"
                />
                <FloatingLabelSelect
                  id="invite-city"
                  label="City"
                  className="text-[#333333]"

                  value={inviteForm.city}
                  onValueChange={handleInviteSelectChange("city")}
                  options={cityOptions}
                  placeholder="Select City"
                />
                <FloatingLabelSelect
                  id="invite-state"
                  label="State"
                  className="text-[#333333]"

                  value={inviteForm.state}
                  onValueChange={handleInviteSelectChange("state")}
                  options={stateOptions}
                  placeholder="Select State"
                />
                <FloatingLabelSelect
                  id="invite-country"
                  label="Country"
                  className="text-[#333333]"

                  value={inviteForm.country}
                  onValueChange={handleInviteSelectChange("country")}
                  options={countryOptions}
                  placeholder="Select Country"
                />
              </div>

              <div className="mt-6">
                <div className="text-[13px] font-[500] text-[#333333] mb-2">System Roles &amp; Permissions</div>
                <div className="border-t border-[#CCCCCC80] pt-3 flex flex-col gap-3">
                  {systemRoles.map((role) => {
                    const roleId = `system-role-${role.toLowerCase().replace(/\s+/g, "-")}`;
                    return (
                      <div
                        key={role}
                        className="flex items-center gap-3 text-[13px] text-[#333333] select-none"
                      >
                        <label htmlFor={roleId} className="cursor-pointer">
                          <input
                            id={roleId}
                            type="checkbox"
                            checked={inviteForm.roles.includes(role)}
                            onChange={() => toggleRole(role)}
                            className="sr-only"
                          />

                          <span
                            className={cn(
                              "h-[16px] w-[16px] rounded-[4px] border border-[#CCCCCC80] flex items-center justify-center",
                              inviteForm.roles.includes(role) && "bg-[#57CC4D] border-[#57CC4D]"
                            )}
                          >
                            {inviteForm.roles.includes(role) && (
                              <svg
                                width="12"
                                height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                              >
                                <path
                                  d="M1 5L4.5 8.5L11 1.5"
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                        </label>

                        <span className="cursor-default">{role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[13px] font-[500] text-[#333333] mb-2">Custom Roles &amp; Permissions</div>
                <div className="border-t border-[#CCCCCC80]">
                  <div className="grid grid-cols-[1.2fr_2fr] gap-2 py-2 text-[14px] font-[500] text-[#333333]">
                    <span>Role Name</span>
                    <span>Description</span>
                  </div>
                  {customRoles.map((role) => (
                    <div key={role.id} className="grid grid-cols-[1.2fr_2fr] gap-2 py-2 border-t border-[#CCCCCC80]">
                      <div className="flex items-center gap-3 text-[13px] font-[400] text-[#333333] select-none">
                        <label htmlFor={role.id} className="cursor-pointer">
                          <input
                            id={role.id}
                            type="checkbox"
                            checked={inviteForm.customRoles.includes(role.id)}
                            onChange={() => toggleCustomRole(role.id)}
                            className="sr-only"
                          />

                          <span
                            className={cn(
                              "h-[16px] w-[16px] rounded-[4px] border border-[#CCCCCC80] flex items-center justify-center",
                              inviteForm.customRoles.includes(role.id) &&
                              "bg-[#57CC4D] border-[#57CC4D]"
                            )}
                          >
                            {inviteForm.customRoles.includes(role.id) && (
                              <svg
                                width="12"
                                height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                              >
                                <path
                                  d="M1 5L4.5 8.5L11 1.5"
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                        </label>

                        <span className="cursor-default">{role.name}</span>
                      </div>

                      <div className="text-[13px] text-[#333333]">{role.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[14px] font-[500] text-[#333333] mb-2">User Email*</div>
                <div className="border border-[#CCCCCC80] rounded-[4px] px-3 py-2 text-[13px] font-[400] text-[#333333]/70">
                  {inviteForm.email || "The user's email address will be displayed here once it is entered above."}
                </div>
                <div className="mt-2 text-[12px] text-[#333333]">
                  A link will be sent to the above email to complete the login process. For security reasons, the link to sign in will expire after 72 hours.
                </div>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3">
              <Button
                variant="outlined"
                onClick={() => {
                  closeInvitePanel();
                  setShowInviteErrors(false);
                  setEditingUser(null);
                  setInviteMode("invite");
                }}
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
                onClick={() => setShowInviteErrors(true)}
              >
                {inviteMode === "resend" ? "Resend Invite" : inviteMode === "edit" ? "Save Changes" : "Send Invite"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDetailsOpen && detailsUser && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex justify-end bg-[#00000066] transition-opacity duration-300",
            isDetailsVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[60vw] max-w-[720px] h-full rounded-l-[6px] bg-white shadow-[0px_10px_30px_0px_#00000024] overflow-y-auto transition-transform duration-300 ease-out",
              isDetailsVisible ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 py-8.5 border-b border-[#CCCCCC80] pr-[20px] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333] pt-3">User Details</span>
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
                  aria-label="Close details"
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
                  onClick={closeDetailsPanel}
                >
                  <img src={CloseXIcon} alt="" className="h-[15px] w-[15px] transition-[filter] group-hover:filter group-hover:invert group-hover:brightness-[-2]" />
                </button>
              </Tooltip>
            </div>
            <div className="px-4 py-4">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-4 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-[79px] w-[93px] bg-[#CCCCCC26] rounded-[4px] flex items-center justify-center">
                    <div className="text-[#333333] bg-white flex items-center justify-center rounded-full w-[47px] h-[47px] text-center text-[16px] font-[600]">
                      {detailsUser.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 justify-center mt-5">
                    <span className="text-[14px] font-[600] text-[#333333]">{detailsUser.name}</span>
                    <span className="text-[13px] text-[#333333]/70">{detailsUser.jobTitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-[13px] text-[#333333]/70">
                    <div className="text-[13px] font-[600] text-[#333333]">Last Activity</div>
                    <div>{detailsUser.lastActivity}</div>
                    <div>{detailsUser.lastActivityDate}</div>
                  </div>
                  <Button
                    variant="contained"
                    sx={{
                      height: "32px",
                      backgroundColor: "#31C24D",
                      textTransform: "none",
                      fontSize: "12px",
                      fontWeight: 500,
                      borderRadius: "4px",
                      boxShadow: "none",
                      color: "#FFFFFF",
                      cursor: "not-allowed",
                      "&:hover": {
                        backgroundColor: "#31C24D",
                        boxShadow: "none",
                      },
                    }}
                  >
                    View Only
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-4 pb-6">
              <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">First Name</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.name.split(" ")[0]}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Last Name</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.name.split(" ").slice(1).join(" ")}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Email</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.email}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Job Title</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.jobTitle}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Company Name</label>
                    <div className="text-[#333333]/ text-[13px] leading-[18px] font-[400]">{detailsUser.companyName}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Role</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.role}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Contact Number</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.contactNumber}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Time Zone</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.timeZone}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">City</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.city}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">State</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.state}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Country</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.country}</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">Currency</label>
                    <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{detailsUser.currency}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-6 flex justify-end">
              <Button
                variant="outlined"
                onClick={closeDetailsPanel}
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
                    boxShadow: "none",
                  },
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Users;
