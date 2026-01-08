import { Button } from "@components/buttons/button/Button";
import { FilterButton } from "@components/buttons/filterButton/FilterButton";
import { SettingsHeader } from "@components/settingsHeader";
import { DataTable } from "@components/table";
import type { DataTableColumn } from "@components/table";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const LeftActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const NameIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
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
}

const getMockUsers = (): UserRow[] => {
  // static rows to mirror the design
  return [
    {
      id: "1",
      name: "Pankaj Kumar",
      email: "pankaj.kumar@pathfinderatscrm.com",
      role: "Account Owner/Admin",
      jobTitle: "Account Manager",
      teams: "Not Available",
      status: "Active",
    },
    {
      id: "2",
      name: "Pankaj Kumar",
      email: "pankaj.kumar@pathfinderatscrm.com",
      role: "Standard User",
      jobTitle: "Not Available",
      teams: "Not Available",
      status: "Pending",
    },
    {
      id: "3",
      name: "Pankaj Kumar",
      email: "pankaj.kumar@pathfinderatscrm.com",
      role: "Collaborator",
      jobTitle: "Not Available",
      teams: "Not Available",
      status: "Link Expired",
    },
    {
      id: "4",
      name: "Pankaj Kumar",
      email: "pankaj.kumar@pathfinderatscrm.com",
      role: "Admin",
      jobTitle: "Not Available",
      teams: "Not Available",
      status: "Disabled",
    },
    {
      id: "5",
      name: "Pankaj Kumar",
      email: "pankaj.kumar@pathfinderatscrm.com",
      role: "Admin",
      jobTitle: "Not Available",
      teams: "Not Available",
      status: "Locked Out",
    },
  ];
};

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const rows: UserRow[] = getMockUsers();
  const [anchorByRowId, setAnchorByRowId] = useState<Record<string, HTMLElement | null>>({});

  const handleOpenRowMenu = (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };

  const handleCloseRowMenu = (rowId: string) => () => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const handleAddUser = () => {
    navigate("/settings/admin/users/add");
  };

  const handleFilterClick = () => {
    // TODO: implement filter panel/modal
    console.warn("Filter clicked");
  };

  const columns: DataTableColumn<UserRow>[] = [
    {
      id: "name",
      header: "Name",
      width: "22%",
      minWidth: 200,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1.25}>
          <NameIcon>🧑‍💼</NameIcon>
          <Typography variant="md">{row.name}</Typography>
        </Box>
      ),
    },
    { id: "email", header: "Email", field: "email", width: "28%", minWidth: 260 },
    { id: "role", header: "Role", field: "role", width: "16%", minWidth: 160 },
    { id: "jobTitle", header: "Job Title", render: (r) => r.jobTitle ?? "Not Available", width: "16%", minWidth: 160 },
    { id: "teams", header: "Team(s)", render: (r) => r.teams ?? "Not Available", width: "14%", minWidth: 140 },
    {
      id: "status",
      header: "Status",
      field: "status",
      width: 100,
      minWidth: 100,
    },
    {
      id: "actions",
      header: <span />,
      align: "right",
      width: 56,
      minWidth: 56,
      render: (row) => (
        <>
          <IconButton aria-label={`row actions for ${row.name}`} onClick={handleOpenRowMenu(row.id)}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorByRowId[row.id]} open={Boolean(anchorByRowId[row.id])} onClose={handleCloseRowMenu(row.id)}>
            <MenuItem onClick={handleCloseRowMenu(row.id)}>View</MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseRowMenu(row.id)();
                navigate(`/settings/admin/users/edit/${row.id}`);
              }}
            >
              Edit
            </MenuItem>
            <MenuItem onClick={handleCloseRowMenu(row.id)}>Disable</MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Container>
      <SettingsHeader title="Users" />

      <Toolbar>
        <LeftActions>
          <FilterButton aria-label="filter users" onClick={handleFilterClick} />
        </LeftActions>

        <Button size="sm" onClick={handleAddUser} startIcon={<AddIcon />}>
          Add User
        </Button>
      </Toolbar>

      <DataTable<UserRow> rows={rows} columns={columns} ariaLabel="users table" />
    </Container>
  );
};

export default Users;
