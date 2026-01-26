import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { Button } from "@components/buttons/button/Button";
import DropDownModal from "@components/popupModals/dropdownModal";
import { SettingsHeader } from "@components/settingsHeader";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { makeSelectMemberById, selectTeams, selectTeamsError, selectTeamsStatus } from "@redux/selectors/teamsSelectors";
import { fetchTeams } from "@redux/slices/teamsSlice";
import theme from "@theme/index";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import type { TeamRow } from "../../../types/teams";

const StyledSettingsHeader = styled(SettingsHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledCollapsibleHeader = styled(Box)`
  display: grid;
  grid-template-columns: 1.6fr 3fr auto;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  background-color: #fafafa;
  padding: 16px;
  border-bottom: 1px solid #cccccc80;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
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

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const Teams: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreateTeam = () => {
    navigate("/settings/admin/teams/create");
  };

  const [anchorByRowId, setAnchorByRowId] = useState<Record<string, HTMLElement | null>>({});
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [destinationTeamId, setDestinationTeamId] = useState<string>("");

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

  const handleOpenRowMenu = (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };
  const handleCloseRowMenu = (rowId: string) => () => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const teams = useAppSelector(selectTeams);
  const status = useAppSelector(selectTeamsStatus);
  const error = useAppSelector(selectTeamsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTeams());
    }
  }, [dispatch, status]);

  const selectMemberById = useMemo(makeSelectMemberById, []);
  const selectedMember = useAppSelector((state) => selectMemberById(state, selectedMemberId));

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
            variant="solid"
            onClick={handleCreateTeam}
            startIcon={<AddIcon fontSize="small" />}
            sx={{
              height: "36px",
              backgroundColor: "#6E41E2",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 500,
              minWidth: "132px",
              width: "132px",
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

      {teams
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
            rowMenuAnchorById={anchorByRowId}
            canMoveMember={teams.length > 1}
          />
        ))}

      <DropDownModal
        open={isMoveModalOpen}
        onClose={handleCloseMoveTeamModal}
        teams={teams.map((t) => ({ id: t.id, name: t.teamName }))}
        value={destinationTeamId}
        onChange={(id: string) => setDestinationTeamId(id)}
        onConfirm={() => {
          console.warn("Move member", selectedMember?.member.id, "to team", destinationTeamId);
          handleCloseMoveTeamModal();
        }}
        confirmDisabled={!destinationTeamId}
      />
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
  rowMenuAnchorById,
  canMoveMember,
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
  rowMenuAnchorById: Record<string, HTMLElement | null>;
  canMoveMember: boolean;
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        overflow: "hidden",
        padding: 0,
        marginBottom: "25px",
        border: "1px solid #E6E6E6",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <StyledCollapsibleHeader role="button" onClick={() => setCollapsed((p) => !p)}>
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
                fontSize: theme.tokens.typography.fontSize.md,
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
            gap: 2,
            width: "100%",
          }}
        >
          <Metric label="Members" value={rows.length} />
          <Metric label="Open Jobs" value={metrics.openJobs} />
          <Metric label="Closed Jobs" value={metrics.closedJobs} />
          <Metric label="Archived Jobs" value={metrics.archivedJobs} />
        </Box>

        <Box display="flex" alignItems="center" gap={1} sx={{ justifySelf: "end" }}>
          {showEditButton && (
            <IconButton
              size="small"
              aria-label="edit team"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/settings/admin/teams/create/${teamId}`);
              }}
              sx={{
                border: "1px solid #CCCCCC80",
                borderRadius: "6px",
                padding: "4px",
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" aria-label="toggle team rows" sx={{ padding: "4px" }}>
            {collapsed ? (
              <KeyboardDoubleArrowDownRoundedIcon fontSize="small" sx={{ color: theme.tokens.color.text.secondary }} />
            ) : (
              <KeyboardDoubleArrowUpRoundedIcon fontSize="small" sx={{ color: theme.tokens.color.text.secondary }} />
            )}
          </IconButton>
        </Box>
      </StyledCollapsibleHeader>

      {!collapsed && (
        <Box className="flex flex-col gap-[12px]">
          {rows.length === 0 ? (
            <Box className="px-4 py-6 text-[13px] text-[#333333]/70">No members yet.</Box>
          ) : (
            rows.map((row) => (
              <Box
                key={row.id}
                className="grid grid-cols-[minmax(260px,2.2fr)_1fr_1fr_auto] items-center gap-2 px-4 py-3 text-[13px] text-[#333333] transition-colors hover:bg-[#EAEAEA]/25 border-b border-[#CCCCCC80]"
              >
                <Box display="flex" alignItems="center" gap="16px">
                  <Box className="h-[32px] w-[32px] rounded-full bg-[#EAEAEA]/25 border border-[#CCCCCC80] flex items-center justify-center text-[11px] text-[#333333]">
                    {getInitials(row.name)}
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Box component="span" className="text-[13px] font-[500]">
                      {row.name}
                    </Box>
                    <Box component="span" className="text-[12px] text-[#333333]/70">
                      {row.title || "Not Available"}
                    </Box>
                  </Box>
                </Box>
                <Box component="span">{row.role}</Box>
                <Box component="span">{row.status}</Box>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    aria-label={`row actions for ${row.name}`}
                    onClick={onOpenRowMenu(row.id)}
                    size="small"
                    sx={{
                      border: "1px solid #CCCCCC80",
                      borderRadius: "6px",
                      padding: "4px",
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu anchorEl={rowMenuAnchorById[row.id]} open={Boolean(rowMenuAnchorById[row.id])} onClose={onCloseRowMenu(row.id)}>
                    <MenuItem disabled={!canMoveMember} onClick={onOpenMoveTeamModal(row.id)}>
                      Move
                    </MenuItem>
                    <MenuItem onClick={onCloseRowMenu(row.id)}>Edit</MenuItem>
                    <MenuItem onClick={onCloseRowMenu(row.id)}>Delete</MenuItem>
                  </Menu>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <Box display="flex" flexDirection="column" justifyContent="center" sx={{ minHeight: 40, alignItems: "center", width: "fit-content" }}>
    <Box component="span" sx={{ fontSize: theme.tokens.typography.fontSize.md, fontWeight: theme.tokens.typography.fontWeight.medium }}>
      {value}
    </Box>
    <Box
      component="span"
      sx={{
        fontSize: theme.tokens.typography.fontSize.md,
        color: theme.tokens.color.text.secondary,
        fontWeight: theme.tokens.typography.fontWeight.medium,
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
