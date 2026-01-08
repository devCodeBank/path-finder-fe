import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { Button } from "@components/buttons/button/Button";
import { FilterButton } from "@components/buttons/filterButton/FilterButton";
import { SettingsHeader } from "@components/settingsHeader";
import { DataTable, type DataTableColumn } from "@components/table/DataTable";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledSettingsHeader = styled(SettingsHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

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

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

interface RoleRow {
  id: string;
  customRoleName: string;
  description: string;
  createdDate: Date;
  createdBy: string;
}

const getMockRoles = (): RoleRow[] => {
  return [
    {
      id: "1",
      customRoleName: "Custom Role 1",
      description: "Custom Role 1 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
    {
      id: "2",
      customRoleName: "Custom Role 2",
      description: "Custom Role 2 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
    {
      id: "3",
      customRoleName: "Custom Role 3",
      description: "Custom Role 3 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
    {
      id: "4",
      customRoleName: "Custom Role 4",
      description: "Custom Role 4 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
    {
      id: "5",
      customRoleName: "Custom Role 5",
      description: "Custom Role 5 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
    {
      id: "6",
      customRoleName: "Custom Role 6",
      description: "Custom Role 6 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
    {
      id: "7",
      customRoleName: "Custom Role 7",
      description: "Custom Role 7 Description",
      createdDate: new Date("2025-01-01"),
      createdBy: "John Doe",
    },
  ];
};

export const RolesPermissions: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<RoleRow[]>(getMockRoles());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [anchorByRowId, setAnchorByRowId] = useState<Record<string, HTMLElement | null>>({});

  const handleOpenRowMenu = (rowId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };

  const handleCloseRowMenu = (rowId: string) => () => {
    setAnchorByRowId((prev) => ({ ...prev, [rowId]: null }));
  };

  const columns: DataTableColumn<RoleRow>[] = [
    { id: "customRoleName", header: "Custom Role Name", field: "customRoleName", width: "25%", minWidth: 200 },
    { id: "description", header: "Description", field: "description", width: "35%", minWidth: 260 },
    { id: "createdDate", header: "Created Date", render: (row) => row.createdDate.toLocaleDateString(), width: "20%", minWidth: 100 },
    { id: "createdBy", header: "Created By", field: "createdBy", width: "10%", minWidth: 100 },
    {
      id: "actions",
      header: <span />,
      align: "right",
      width: "6%",
      minWidth: 56,
      render: (row) => (
        <>
          <IconButton aria-label={`row actions for ${row.customRoleName}`} onClick={handleOpenRowMenu(row.id)}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorByRowId[row.id]} open={Boolean(anchorByRowId[row.id])} onClose={handleCloseRowMenu(row.id)}>
            <MenuItem onClick={handleCloseRowMenu(row.id)}>View</MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseRowMenu(row.id)();
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setRows((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
  };

  const numSelected = selectedIds.length;

  return (
    <Container>
      <StyledSettingsHeader title="Roles & Permissions" />
      <CustomBreadCrumbs breadcrumbs={[{ label: "Home" }]} />

      <Toolbar>
        <LeftActions>
          <FilterButton aria-label="filter roles & permissions" onClick={handleFilterClick} />
          {numSelected > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <span>{numSelected} selected</span>
              <Button size="sm" variant="danger" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </Box>
          )}
        </LeftActions>

        <RightActions>
          <Button size="sm" onClick={handleViewSystemRoles} startIcon={<ViewIcon />}>
            View System Roles
          </Button>
          <Button size="sm" onClick={handleCreateCustomRole} startIcon={<AddIcon />}>
            Create Custom Role
          </Button>
        </RightActions>
      </Toolbar>

      <DataTable<RoleRow>
        rows={rows}
        columns={columns}
        ariaLabel="roles table"
        selectable
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
      />
    </Container>
  );
};

export default RolesPermissions;
