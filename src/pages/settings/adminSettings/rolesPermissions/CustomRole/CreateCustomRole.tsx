import { FloatingLabelInput } from "@/components/floatingLabelInput";
import { Box } from "@mui/material";
import TabContent from "@pages/settings/adminSettings/rolesPermissions/CustomRole/CustomRoleContent";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  gap: 24px;
  padding-top: 10px;
  padding-bottom: 24px;

  & > * {
    flex: 1;
    min-width: 0;
  }
`;

export const SystemRoles: React.FC = () => {
  const [formData, setFormData] = useState({ roleName: "", roleDescription: "" });

  const handleInputChange = (field: "roleName" | "roleDescription") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Container>

      <Toolbar>
        <FloatingLabelInput
          id="role-name"
          label="Role Name"
          required

          value={formData.roleName}
          onChange={handleInputChange("roleName")}
          floatLabel
          className="w-full h-[56px]"
          placeholder="Add Custom Role Name"
        />
        <FloatingLabelInput
          id="role-description"
          label="Role Description"
          required

          value={formData.roleDescription}
          onChange={handleInputChange("roleDescription")}
          floatLabel
          className="w-full h-[56px]"
          placeholder="Add Custom Role Dsescription"
        />
      </Toolbar>
      <TabContent />
    </Container>
  );
};

export default SystemRoles;
