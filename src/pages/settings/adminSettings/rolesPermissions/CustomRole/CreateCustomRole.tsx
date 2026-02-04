import { FloatingLabelInput } from "@/components/floatingLabelInput";
import { Box } from "@mui/material";
import TabContent from "@pages/settings/adminSettings/rolesPermissions/CustomRole/CustomRoleContent";
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

type CreateCustomRoleProps = {
  roleName?: string;
  roleDescription?: string;
  showErrors?: boolean;
  onChange?: (field: "roleName" | "roleDescription", value: string) => void;
};

export const SystemRoles: React.FC<CreateCustomRoleProps> = ({
  roleName: roleNameProp,
  roleDescription: roleDescriptionProp,
  showErrors = false,
  onChange,
}) => {
  const [localRoleName, setLocalRoleName] = React.useState("");
  const [localRoleDescription, setLocalRoleDescription] = React.useState("");

  const roleName = roleNameProp ?? localRoleName;
  const roleDescription = roleDescriptionProp ?? localRoleDescription;

  const handleInputChange = (field: "roleName" | "roleDescription") => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(field, event.target.value);
      return;
    }
    if (field === "roleName") {
      setLocalRoleName(event.target.value);
      return;
    }
    setLocalRoleDescription(event.target.value);
  };

  return (
    <Container>

      <Toolbar>
        <div className="relative flex flex-col pb-[14px]">
          <FloatingLabelInput
            id="role-name"
            label="Role Name"
            required
            value={roleName}
            onChange={handleInputChange("roleName")}
            floatLabel
            className="w-full h-[36px]"
            placeholder="Add Custom Role Name"
          />
          {showErrors && roleName.trim() === "" && (
            <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">
              *Role Name is required
            </span>
          )}
        </div>
        <div className="relative flex flex-col pb-[14px]">
          <FloatingLabelInput
            id="role-description"
            label="Role Description"
            required
            value={roleDescription}
            onChange={handleInputChange("roleDescription")}
            floatLabel
            className="w-full h-[36px]"
            placeholder="Add Custom Role Dsescription"
          />
          {showErrors && roleDescription.trim() === "" && (
            <span className="absolute left-0 bottom-0 text-[11px] text-[#E4554A]">
              *Role Description is required
            </span>
          )}
        </div>
      </Toolbar>
      <TabContent />
    </Container>
  );
};

export default SystemRoles;
