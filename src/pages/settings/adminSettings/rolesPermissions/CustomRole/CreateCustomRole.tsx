import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { TextInput } from "@components/input/textInput/TextInput";
import { SettingsHeader } from "@components/settingsHeader";
import { Box } from "@mui/material";
import TabContent from "@pages/settings/adminSettings/rolesPermissions/CustomRole/CustomRoleContent";
import React from "react";
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

export const SystemRoles: React.FC = () => {
  return (
    <Container>
      <StyledSettingsHeader title="Roles & Permissions" />
      <CustomBreadCrumbs breadcrumbs={[{ label: "Home", href: "/settings/admin/roles-permissions" }, { label: "Create Custom Role" }]} />

      <Toolbar display="flex" gap={2}>
        <TextInput label="Role Name*" placeholder="Add custom role name" />
        <TextInput label="Role Description*" placeholder="Add custom role description" />
      </Toolbar>
      <TabContent />
    </Container>
  );
};

export default SystemRoles;
