import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { Button } from "@components/buttons/button/Button";
import { SettingsHeader } from "@components/settingsHeader";
import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import TabContent from "@pages/settings/adminSettings/rolesPermissions/SystemRoles/SystemRolesTabContent";
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
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledTabs = styled(Tabs)`
  background: ${({ theme }) => theme.tokens.color.overlay.brandLight};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  & .Mui-selected {
    background: ${({ theme }) => theme.tokens.color.background.primary};
    color: ${({ theme }) => theme.tokens.color.text.primary};
  }

  & .MuiTabs-indicator {
    height: 0.25rem;
    border-radius: 8px;
  }
`;

const StyledTab = styled(Tab)`
  color: ${({ theme }) => theme.tokens.color.text.primary};
  font-size: ${({ theme }) => theme.tokens.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  text-transform: none;'
`;

export const SystemRoles: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("super-admin");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleCreateCustomRole = () => {
    navigate("/settings/admin/roles-permissions/create-custom");
  };

  return (
    <Container>
      <StyledSettingsHeader title="Roles & Permissions" />
      <CustomBreadCrumbs breadcrumbs={[{ label: "Home", href: "/settings/admin/roles-permissions" }, { label: "System Roles" }]} />

      <Toolbar>
        <RightActions>
          <Button size="sm" onClick={handleCreateCustomRole} startIcon={<AddIcon />}>
            Create Custom Role
          </Button>
        </RightActions>
      </Toolbar>
      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab label="Super Admin" value="super-admin" />
        <StyledTab label="Admin" value="admin" />
        <StyledTab label="Standard User" value="standard-user" />
        <StyledTab label="Collaborator" value="collaborator" />
      </StyledTabs>
      <TabContent tabName={value} />
    </Container>
  );
};

export default SystemRoles;
