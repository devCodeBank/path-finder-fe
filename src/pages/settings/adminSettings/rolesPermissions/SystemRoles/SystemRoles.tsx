import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Tab, Tabs } from "@mui/material";
import TabContent from "@pages/settings/adminSettings/rolesPermissions/SystemRoles/SystemRolesTabContent";
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
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
    padding-bottom: 18px;
`;

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledTabs = styled(Tabs)`
  background: ${({ theme }) => theme.tokens.color.background.primary};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  // border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};

  & .Mui-selected {
    color: ${({ theme }) => theme.tokens.color.text.primary};
  }

  & .MuiTabs-indicator {
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.tokens.color.brand.primary};
  }
`;

const StyledTab = styled(Tab)`
  color: ${({ theme }) => theme.tokens.color.text.primary};
  font-size: ${({ theme }) => theme.tokens.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  text-transform: none;'
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing(1, 2)};
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

      <Toolbar >
        <RightActions>
          <Button
            variant="contained"
            onClick={handleCreateCustomRole}
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
