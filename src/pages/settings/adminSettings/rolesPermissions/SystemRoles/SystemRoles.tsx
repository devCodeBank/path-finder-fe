import TabsComponent from "@/components/tabs/TabsComponent";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import TabContent from "@pages/settings/adminSettings/rolesPermissions/SystemRoles/SystemRolesTabContent";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
    padding-bottom: 18px;
`;

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;


export interface SystemRolesProps {
  onCreateCustomRole?: () => void;
}

export const SystemRoles: React.FC<SystemRolesProps> = ({ onCreateCustomRole }) => {

  return (
    <Container>

      <Toolbar >
        <RightActions>
          <Button
            variant="contained"
            onClick={onCreateCustomRole}
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
        </RightActions>
      </Toolbar>
      <TabsComponent
        tabs={[
          { label: "Super Admin", value: "super-admin", content: <Box><TabContent tabName="super-admin" /></Box> },
          { label: "Admin", value: "admin", content: <Box><TabContent tabName="admin" /></Box> },
          { label: "Standard User", value: "standard-user", content: <Box><TabContent tabName="standard-user" /></Box> },
          { label: "Collaborator", value: "collaborator", content: <Box><TabContent tabName="collaborator" /></Box> },
        ]}
      />
    </Container>
  );
};

export default SystemRoles;
