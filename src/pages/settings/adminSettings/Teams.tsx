import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import DropDownModal from "@components/popupModals/dropdownModal";
import { SettingsHeader } from "@components/settingsHeader";
import AddIcon from "@mui/icons-material/Add";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button as MuiButton, IconButton, Menu, MenuItem, Button, Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { selectTeams, selectTeamsError, selectTeamsStatus } from "@redux/selectors/teamsSelectors";
import { addTeam, fetchTeams } from "@redux/slices/teamsSlice";
import theme from "@theme/index";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import CloseXIcon from "@assets/icons/x.svg";
import DeleteMemberModal from "@components/popupModals/deleteMemberModal";

import type { Team, TeamRow } from "../../../types/teams";

const StyledSettingsHeader = styled(SettingsHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledCollapsibleHeader = styled(Box)`
  display: grid;
  grid-template-columns: minmax(240px, 1.8fr) minmax(280px, 2.2fr) auto;
  align-items: center;
  gap: 16px;
  cursor: default;
  background-color: #FAFAFA;
  padding: 14px 16px;
 
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 18px;
`;

const SelectedMembersList = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  grid-column: 1 / -1;
  align-items: flex-center;
`;

const MemberChip = styled(Box)`
  display: inline-flex;
  align-items: center;
  width: 168px;
  height: 32px;
  gap: ${({ theme }) => theme.spacing(1)};
  border: 1px solid #E6E6E6;
  background-color: #F7F7F7;
  border-radius: 20px;
  padding-left: 12px;
  padding-right: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #333333;
`;

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const isGeneralTeam = (teamName: string, teamId: string) =>
  teamId === "team-general" || teamName.trim().toLowerCase() === "general";

export const Teams: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCreateTeam = () => {
    resetCreateForm();
    setEditingTeamId(null);
    handleOpenCreatePanel();
  };

  const [anchorByRowId, setAnchorByRowId] = useState<Record<string, HTMLElement | null>>({});
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [destinationTeamId, setDestinationTeamId] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const createCloseTimerRef = useRef<number | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);


  const [teamName, setTeamName] = useState("");
  const [teamAdmin, setTeamAdmin] = useState("");
  const [teamMembersInput, setTeamMembersInput] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [teamStatus, setTeamStatus] = useState("active");
  const [showCreateErrors, setShowCreateErrors] = useState(false);

  const handleOpenMoveTeamModal = (rowId: string) => () => {
    setSelectedMemberId(rowId);
    setIsMoveModalOpen(true);
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const handleCloseMoveTeamModal = () => {
    setIsMoveModalOpen(false);
    setSelectedMemberId(null);
    setDestinationTeamId("");
  };

  const handleOpenDeleteModal = (memberId: string) => {
    setDeleteMemberId(memberId);
    // setDeleteMemberName(memberName);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteMemberId(null);
    // setDeleteMemberName("");
  };

  const handleOpenCreatePanel = () => {
    if (createCloseTimerRef.current) {
      window.clearTimeout(createCloseTimerRef.current);
      createCloseTimerRef.current = null;
    }
    setIsCreateOpen(true);
    requestAnimationFrame(() => setIsCreateVisible(true));
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

  const handleOpenRowMenu = (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };
  const handleCloseRowMenu = (rowId: string) => () => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const teams = useAppSelector(selectTeams);
  const status = useAppSelector(selectTeamsStatus);
  const error = useAppSelector(selectTeamsError);
  const [teamItems, setTeamItems] = useState<Team[]>([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTeams());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (teams.length > 0 && teamItems.length === 0) {
      setTeamItems(teams);
    }
  }, [teams, teamItems.length]);

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null;
    for (const team of teamItems) {
      const member = team.members.find((m) => m.id === selectedMemberId);
      if (member) return { member, team };
    }
    return null;
  }, [selectedMemberId, teamItems]);



  const moveMember = (memberId: string, destinationTeamIdValue: string) => {
    if (!memberId || !destinationTeamIdValue) return;
    setTeamItems((prev) => {
      const sourceTeam = prev.find((team) => team.members.some((m) => m.id === memberId));
      const memberToMove = sourceTeam?.members.find((m) => m.id === memberId);
      if (!sourceTeam || !memberToMove) return prev;
      const removedFromSource = prev.map((team) =>
        team.id === sourceTeam.id
          ? { ...team, members: team.members.filter((m) => m.id !== memberId) }
          : team
      );
      return removedFromSource.map((team) =>
        team.id === destinationTeamIdValue
          ? { ...team, members: [...team.members, memberToMove] }
          : team
      );
    });
  };

  const moveMemberToGeneral = (memberId: string) => {
    const generalTeam = teamItems.find((team) => isGeneralTeam(team.teamName, team.id));
    if (!generalTeam) return;
    moveMember(memberId, generalTeam.id);
  };

  const statusOptions = useMemo(
    () => [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    []
  );

  const resetCreateForm = () => {
    setTeamName("");
    setTeamAdmin("");
    setTeamMembersInput("");
    setTeamMembers([]);
    setTeamStatus("active");
    setShowCreateErrors(false);
  };

  const handleOpenEditTeam = (teamId: string) => {
    const team = teamItems.find((item) => item.id === teamId);
    if (!team) return;
    const adminMember = team.members.find((member) => member.role.toLowerCase() === "administrator");
    const fallbackAdmin = team.members[0];
    const resolvedAdmin = adminMember?.name || fallbackAdmin?.name || "";
    const nonAdminMembers = team.members
      .filter((member) => member.name !== resolvedAdmin)
      .map((member) => member.name);
    const statusFromMember = team.members[0]?.status?.toLowerCase() === "inactive" ? "inactive" : "active";

    setTeamName(team.teamName);
    setTeamAdmin(resolvedAdmin);
    setTeamMembers(nonAdminMembers);
    setTeamMembersInput("");
    setTeamStatus(statusFromMember);
    setShowCreateErrors(false);
    setEditingTeamId(teamId);
    handleOpenCreatePanel();
  };

  const parseMemberNames = (value: string) =>
    value
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

  const addMembersFromInput = (value: string) => {
    const names = parseMemberNames(value);
    if (names.length === 0) return;
    setTeamMembers((prev) => {
      const existing = new Set(prev.map((name) => name.toLowerCase()));
      const uniqueNames = names.filter((name) => !existing.has(name.toLowerCase()));
      return uniqueNames.length > 0 ? [...prev, ...uniqueNames] : prev;
    });
    setTeamMembersInput("");
  };

  const handleSubmitCreateTeam = () => {
    const isValid = teamName.trim() !== "" && teamAdmin.trim() !== "";
    if (!isValid) {
      setShowCreateErrors(true);
      return;
    }

    const statusLabel = teamStatus === "active" ? "Active" : "Inactive";
    const memberNames = [...teamMembers, ...parseMemberNames(teamMembersInput)].filter(
      (name, index, all) => all.findIndex((value) => value.toLowerCase() === name.toLowerCase()) === index
    );

    const members: TeamRow[] = [
      {
        id: `admin-${teamAdmin.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: teamAdmin.trim(),
        title: "",
        role: "Administrator",
        status: statusLabel,
      },
      ...memberNames.map((name, index) => ({
        id: `member-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}-${index}`,
        name,
        title: "",
        role: "Member",
        status: statusLabel,
      })),
    ];

    if (editingTeamId) {
      setTeamItems((prev) =>
        prev.map((team) =>
          team.id === editingTeamId
            ? {
              ...team,
              teamName: teamName.trim(),
              members,
            }
            : team
        )
      );
      const existingTeam = teamItems.find((team) => team.id === editingTeamId);
      if (existingTeam) {
        dispatch(
          addTeam({
            ...existingTeam,
            teamName: teamName.trim(),
            members,
          })
        );
      }
    } else {
      const newTeam: Team = {
        id: `team-${teamName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        teamName: teamName.trim(),
        teamDescription: "",
        metrics: { openJobs: 0, closedJobs: 0, archivedJobs: 0 },
        members,
      };

      dispatch(addTeam(newTeam));
      setTeamItems((prev) => [...prev, newTeam]);
    }
    resetCreateForm();
    setEditingTeamId(null);
    handleCloseCreatePanel();
  };

  if (status === "loading") {
    return (
      <Container>
        <StyledSettingsHeader title="Teams" />
        <CustomBreadCrumbs breadcrumbs={[{ label: "Home" }]} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
          <CircularProgress size={28} />
        </Box>
      </Container>
    );
  }

  if (status === "failed") {
    return (
      <Container>
        <StyledSettingsHeader title="Teams" />
        <CustomBreadCrumbs breadcrumbs={[{ label: "Home" }]} />
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error || "Failed to load teams."}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      {/* <StyledSettingsHeader title="Teams" />
      <CustomBreadCrumbs breadcrumbs={[{ label: "Home" }]} /> */}

      <Toolbar>
        <RightActions>
          <Button
            variant="contained"
            onClick={handleCreateTeam}
            startIcon={<AddIcon fontSize="small" />}
            sx={{
              height: "36px",
              backgroundColor: "#6E41E2",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 500,
              minWidth: "150px",
              borderRadius: "4px",
              boxShadow: "none",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#7B52F4",
                boxShadow: "none",
              },
            }}
          >
            Create Team
          </Button>
        </RightActions>
      </Toolbar>

      {teamItems
        .filter((team) => team.teamName.trim().toLowerCase() !== "sales hiring")
        .map((team, index) => (
          <CollapsibleSection
            key={team.id}
            teamId={team.id}
            teamName={team.teamName}
            teamDescription={team.teamDescription}
            metrics={team.metrics}
            rows={team.members}
            defaultCollapsed={index !== 0}
            showEditButton={index !== 0}
            onOpenRowMenu={handleOpenRowMenu}
            onCloseRowMenu={handleCloseRowMenu}
            onOpenMoveTeamModal={handleOpenMoveTeamModal}
            onDeleteMember={(memberId) => handleOpenDeleteModal(memberId)}
            onEditTeam={handleOpenEditTeam}
            rowMenuAnchorById={anchorByRowId}
            canMoveMember={teamItems.length > 1}
            isGeneralTeam={isGeneralTeam(team.teamName, team.id)}
          />
        ))}

      <DropDownModal
        open={isMoveModalOpen}
        onClose={handleCloseMoveTeamModal}
        teams={teamItems.map((t) => ({ id: t.id, name: t.teamName }))}
        value={destinationTeamId}
        onChange={(id: string) => setDestinationTeamId(id)}
        onConfirm={() => {
          if (selectedMember?.member?.id) {
            moveMember(selectedMember.member.id, destinationTeamId);
          }
          handleCloseMoveTeamModal();
        }}
        confirmDisabled={!destinationTeamId}
        memberName={selectedMember?.member?.name}
        currentTeamName={selectedMember?.team?.teamName}
      />

      <DeleteMemberModal
        open={isDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          if (deleteMemberId) {
            moveMemberToGeneral(deleteMemberId);
          }
          handleCloseDeleteModal();
        }}
      />

      {isCreateOpen && (
        <div
          className={[
            "fixed inset-0 z-[2200] flex justify-end bg-[#00000066] transition-opacity duration-300",
            isCreateVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "w-[60vw] max-w-[60vw] h-full  bg-white  flex flex-col overflow-hidden transition-transform duration-300 ease-out",
              isCreateVisible ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            <div className="h-[52px] px-5 py-8.5 border-b border-[#CCCCCC80] flex items-center justify-between">
              <span className="text-[16px] font-[500] text-[#333333] pt-3">
                {editingTeamId ? "Edit Team" : "Create Team"}
              </span>
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
                  aria-label="Close create team"
                  className="inline-flex h-[24px] w-[24px] items-center justify-center transition-opacity hover:opacity-80"
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
            <div className="px-4 py-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <FloatingLabelInput
                    id="create-team-name"
                    label="Team Name"
                    floatLabel
                    required
                    placeholder="E.g. Software Engineering Hiring Team"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    className={[
                      "w-full h-[36px]",
                      showCreateErrors && teamName.trim() === "" ? "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]" : "",
                    ].join(" ")}
                  />
                  {showCreateErrors && teamName.trim() === "" && (
                    <span className="text-[11px] text-[#E4554A]">*Team Name is required</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <FloatingLabelInput
                    id="create-team-admin"
                    label="Team Admin Name"
                    floatLabel
                    required
                    placeholder="Start Typing Name or Email"
                    value={teamAdmin}
                    onChange={(event) => setTeamAdmin(event.target.value)}
                    className={[
                      "w-full h-[36px]",
                      showCreateErrors && teamAdmin.trim() === "" ? "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]" : "",
                    ].join(" ")}
                  />
                  {showCreateErrors && teamAdmin.trim() === "" && (
                    <span className="text-[11px] text-[#E4554A]">*Team Admin Name is required</span>
                  )}
                </div>
                <FloatingLabelInput
                  id="create-team-members"
                  label="Team Members"

                  floatLabel
                  placeholder="Start Typing Name or Email"
                  value={teamMembersInput}
                  onChange={(event) => setTeamMembersInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addMembersFromInput(teamMembersInput);
                    }
                  }}
                  onBlur={() => addMembersFromInput(teamMembersInput)}
                  className="w-full h-[36px]"
                />
                <FloatingLabelSelect
                  id="create-team-status"
                  label="Team Status"
                  className="text-[#333333]"

                  value={teamStatus}
                  onValueChange={setTeamStatus}
                  options={statusOptions}
                  placeholder="Active"
                />
                {teamMembers.length > 0 && (
                  <SelectedMembersList aria-label="selected team members">
                    {teamMembers.map((name) => (
                      <MemberChip key={name}>
                        <span>{name}</span>
                        <IconButton
                          size="small"
                          aria-label={`remove ${name}`}
                          onClick={() => setTeamMembers((prev) => prev.filter((member) => member !== name))}
                          sx={{ padding: "91px" }}
                        >
                          <ClearRoundedIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </MemberChip>
                    ))}
                  </SelectedMembersList>
                )}
              </div>
            </div>
            <div className="px-4 py-4 border-t border-[#CCCCCC80] flex justify-end gap-3">
              <MuiButton
                variant="outlined"
                onClick={() => {
                  handleCloseCreatePanel();
                  resetCreateForm();
                  setEditingTeamId(null);
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
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleSubmitCreateTeam}
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
                {editingTeamId ? "Save Changes" : "Create Team"}
              </MuiButton>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Teams;

const CollapsibleSection = ({
  teamId,
  teamName,
  teamDescription,
  metrics,
  rows,
  defaultCollapsed = false,
  showEditButton = true,
  onOpenRowMenu,
  onCloseRowMenu,
  onOpenMoveTeamModal,
  onDeleteMember,
  onEditTeam,
  rowMenuAnchorById,
  canMoveMember,
  isGeneralTeam,
}: {
  teamId: string;
  teamName: string;
  teamDescription: string;
  metrics: { openJobs: number; closedJobs: number; archivedJobs: number };
  rows: TeamRow[];
  defaultCollapsed?: boolean;
  showEditButton?: boolean;
  onOpenRowMenu: (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseRowMenu: (rowId: string) => () => void;
  onOpenMoveTeamModal: (rowId: string) => () => void;
  onDeleteMember: (rowId: string) => void;
  onEditTeam: (teamId: string) => void;
  rowMenuAnchorById: Record<string, HTMLElement | null>;
  canMoveMember: boolean;
  isGeneralTeam: boolean;
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  return (
    <Box
      sx={{
        overflow: "hidden",
        padding: 0,
        marginBottom: "18px",
        border: "1px solid #E6E6E6",
        borderRadius: "6px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <StyledCollapsibleHeader>
        <Box display="flex" flexDirection="column">
          <Box
            component="span"
            sx={{ fontSize: theme.tokens.typography.fontSize.md, fontWeight: theme.tokens.typography.fontWeight.medium }}
          >
            {teamName}
          </Box>
          {teamDescription?.trim() ? (
            <Box
              component="span"
              sx={{
                fontSize: "12px",
                color: theme.tokens.color.text.secondary,
                fontWeight: theme.tokens.typography.fontWeight.normal,
              }}
            >
              {teamDescription}
            </Box>
          ) : null}
        </Box>

        <Box
          display="grid"
          sx={{
            gridTemplateColumns: "repeat(4, minmax(80px, 1fr))",
            justifyItems: "center",
            alignItems: "center",
            gap: 3,
            width: "100%",
          }}
        >
          <Metric label="Members" value={rows.length} />
          <Metric label="Open Jobs" value={metrics.openJobs} />
          <Metric label="Closed Jobs" value={metrics.closedJobs} />
          <Metric label="Archived Jobs" value={metrics.archivedJobs} />
        </Box>

        <Box display="flex" alignItems="center" gap="24px" sx={{ justifySelf: "end" }}>
          {showEditButton ? (
            <IconButton
              size="small"
              aria-label="edit team"
              onClick={(e) => {
                e.stopPropagation();
                onEditTeam(teamId);
              }}
              sx={{
                border: "1px solid #E6E6E6",
                borderRadius: "4px",
                padding: "3px",
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box sx={{ width: "28px", height: "28px" }} />
          )}
          <IconButton
            size="small"
            aria-label="toggle team rows"
            sx={{
              border: "1px solid #E6E6E6",
              borderRadius: "4px",
              padding: "3px",
            }}
            onClick={() => setCollapsed((p) => !p)}
          >
            {collapsed ? (
              <KeyboardDoubleArrowDownRoundedIcon fontSize="small" sx={{ color: theme.tokens.color.text.secondary }} />
            ) : (
              <KeyboardDoubleArrowUpRoundedIcon fontSize="small" sx={{ color: theme.tokens.color.text.secondary }} />
            )}
          </IconButton>
        </Box>
      </StyledCollapsibleHeader>

      {!collapsed && (
        <Box className="flex flex-col">
          {rows.length === 0 ? (
            <Box className="px-4 py-6 text-[13px] text-[#333333]/70">No members yet.</Box>
          ) : (
            <Box className="divide-y divide-[#E6E6E6]">
              {rows.map((row) => (
                <Box
                  key={row.id}
                  className="grid grid-cols-[minmax(260px,2.2fr)_1fr_1fr_auto] items-center gap-2 px-4 py-3 text-[13px] text-[#333333] transition-colors hover:bg-[#F8F8F8]"
                >
                  <Box display="flex" alignItems="center" gap="12px">
                    <Box className="h-[32px] w-[32px] rounded-full bg-[#EAEAEA]/25 flex items-center justify-center text-[11px] text-[#333333]">
                      {getInitials(row.name)}
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Box component="span" className="text-[13px] font-[500]">
                        {row.name}
                      </Box>
                      <Box component="span" className="text-[13px] text-[#333333]/70">
                        {row.title || "Not Available"}
                      </Box>
                    </Box>
                  </Box>
                  <Box component="span" className="justify-self-center">
                    <span className="inline-flex h-[20px] w-[112px] justify-center items-center rounded-[4px] bg-[#6E41E2] px-2 text-[13px] font-[400] text-white">
                      {row.role}
                    </span>
                  </Box>
                  <Box component="span" className="justify-self-center">
                    <span className="inline-flex h-[20px] w-[55px] items-center rounded-[4px] bg-[#6E41E2] px-2 text-[13px] font-[400] text-white">
                      {row.status}
                    </span>
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      aria-label={`row actions for ${row.name}`}
                      onClick={onOpenRowMenu(row.id)}
                      size="small"
                      sx={{
                        border: "1px solid #E6E6E6",
                        borderRadius: "4px",
                        padding: "3px",
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>

                    <Menu
                      anchorEl={rowMenuAnchorById[row.id]}
                      open={Boolean(rowMenuAnchorById[row.id])}
                      onClose={onCloseRowMenu(row.id)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      PaperProps={{
                        sx: {
                          borderRadius: "6px",
                          minWidth: "100px",
                          // boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                          border: "1px solid #E5E5E580",
                          backgroundColor: "#FFFFFF",
                          py: 0.5,
                        },
                      }}
                    >
                      <MenuItem
                        disabled={!canMoveMember}
                        onClick={onOpenMoveTeamModal(row.id)}
                        sx={{ fontSize: "13px", fontWeight: 500, color: "#333333" }}
                      >
                        Move
                      </MenuItem>
                      {!isGeneralTeam && (
                        <MenuItem
                          onClick={() => {
                            onCloseRowMenu(row.id)();
                            onDeleteMember(row.id);
                          }}
                          sx={{ fontSize: "13px", fontWeight: 500, color: "#333333" }}
                        >
                          Delete
                        </MenuItem>
                      )}
                    </Menu>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )
      }
    </Box >
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <Box display="flex" flexDirection="column" justifyContent="center" sx={{ minHeight: 32, alignItems: "center", width: "fit-content" }}>
    <Box component="span" sx={{ fontSize: "14px", fontWeight: theme.tokens.typography.fontWeight.medium, color: "#333333" }}>
      {value}
    </Box>
    <Box
      component="span"
      sx={{
        fontSize: "13px",
        color: "#666666",
        fontWeight: theme.tokens.typography.fontWeight.normal,
      }}
    >
      {label}
    </Box>
  </Box>
);

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
