import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { Button } from "@components/buttons/button/Button";
import DropDownModal from "@components/popupModals/dropdownModal";
import { SettingsHeader } from "@components/settingsHeader";
import { DataTable } from "@components/table";
import type { DataTableColumn } from "@components/table";
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
  grid-template-columns: 50% 50%;
  align-items: center;
  width: auto;
  gap: 0;
  cursor: pointer;
  background-color: ${({ theme }) => theme.tokens.color.overlay.brandLight};
  padding: 0;
  border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
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

  const tableColumns: DataTableColumn<TeamRow>[] = useMemo(
    () => [
      {
        id: "person",
        header: "",
        render: (row) => (
          <Box display="flex" alignItems="center" gap={1.25}>
            <Box component="span" aria-hidden>
              🧑‍💼
            </Box>
            <Box component="span">{row.name}</Box>
          </Box>
        ),
        minWidth: "fit-content",
        width: "50%",
      },
      {
        id: "title",
        header: "",
        render: (row) => <Box sx={{ color: theme.tokens.color.text.secondary }}>{row.title}</Box>,
        width: "auto",
        minWidth: "fit-content",
        align: "left",
      },
      {
        id: "role",
        header: "",
        render: (row) => <Box sx={{ color: theme.tokens.color.text.secondary }}>{row.role}</Box>,
        width: "auto",
        minWidth: "fit-content",
        align: "left",
      },
      {
        id: "status",
        header: "",
        render: (row) => <Box sx={{ color: theme.tokens.color.text.secondary }}>{row.status}</Box>,
        width: "auto",
        minWidth: "fit-content",
        align: "left",
      },
      {
        id: "actions",
        header: <span />,
        align: "right",
        width: "6%",
        minWidth: 56,
        render: (row) => (
          <>
            <IconButton aria-label={`row actions for ${row.name}`} onClick={handleOpenRowMenu(row.id)}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorByRowId[row.id]} open={Boolean(anchorByRowId[row.id])} onClose={handleCloseRowMenu(row.id)}>
              <MenuItem disabled={teams.length <= 1} onClick={handleOpenMoveTeamModal(row.id)}>
                Move
              </MenuItem>
              <MenuItem onClick={handleCloseRowMenu(row.id)}>Edit</MenuItem>
              <MenuItem onClick={handleCloseRowMenu(row.id)}>Delete</MenuItem>
            </Menu>
          </>
        ),
      },
    ],
    [anchorByRowId, teams.length],
  );

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
      <StyledSettingsHeader title="Teams" />
      <CustomBreadCrumbs breadcrumbs={[{ label: "Home" }]} />

      <Toolbar>
        <RightActions>
          <Button size="sm" onClick={handleCreateTeam} startIcon={<AddIcon />}>
            Create Team
          </Button>
        </RightActions>
      </Toolbar>

      {teams.map((team, index) => (
        <CollapsibleSection
          key={team.id}
          teamId={team.id}
          teamName={team.teamName}
          teamDescription={team.teamDescription}
          metrics={team.metrics}
          rows={team.members}
          columns={tableColumns}
          defaultCollapsed={index !== 0}
          showEditButton={index !== 0}
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

const CollapsibleSection = <T extends { id: string }>({
  teamId,
  teamName,
  teamDescription,
  metrics,
  rows,
  columns,
  defaultCollapsed = false,
  showEditButton = true,
}: {
  teamId: string;
  teamName: string;
  teamDescription: string;
  metrics: { openJobs: number; closedJobs: number; archivedJobs: number };
  rows: T[];
  columns: DataTableColumn<T>[];
  defaultCollapsed?: boolean;
  showEditButton?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        overflow: "hidden",
        padding: 0,
        marginBottom: 4,
      }}
    >
      <StyledCollapsibleHeader role="button" onClick={() => setCollapsed((p) => !p)}>
        <Box display="flex" flexDirection="column" sx={{ padding: 1 }}>
          <Box
            component="span"
            sx={{ fontSize: theme.tokens.typography.fontSize.md, fontWeight: theme.tokens.typography.fontWeight.medium }}
          >
            {teamName}
          </Box>
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
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", padding: 1 }}>
          <Metric label="Members" value={rows.length} />
          <Metric label="Open Jobs" value={metrics.openJobs} />
          <Metric label="Closed Jobs" value={metrics.closedJobs} />
          <Metric label="Archived Jobs" value={metrics.archivedJobs} />
          {collapsed ? (
            <KeyboardDoubleArrowDownRoundedIcon fontSize="medium" sx={{ color: theme.tokens.color.text.secondary }} />
          ) : (
            <KeyboardDoubleArrowUpRoundedIcon fontSize="medium" sx={{ color: theme.tokens.color.text.secondary }} />
          )}
          <Box
            sx={{
              border: "1.6px solid",
              borderColor: showEditButton ? "primary.main" : "transparent",
              borderRadius: "10%",
              padding: 0.25,
              visibility: showEditButton ? "visible" : "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              color="primary"
              aria-label="edit team"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/settings/admin/teams/create/${teamId}`);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </StyledCollapsibleHeader>

      {!collapsed && (
        <Box>
          <DataTable<T> rows={rows} columns={columns} hideHeader ariaLabel="teams table" />
        </Box>
      )}
    </Box>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <Box display="flex" flexDirection="column" justifyContent="center" sx={{ minHeight: 40, alignItems: "flex-start", width: "fit-content" }}>
    <Box display="flex" flexDirection="column" sx={{ alignItems: "center", width: "fit-content" }}>
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
  </Box>
);
