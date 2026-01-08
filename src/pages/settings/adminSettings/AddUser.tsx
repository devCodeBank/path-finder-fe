import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { Button } from "@components/buttons/button/Button";
import { SelectInput } from "@components/input/selectInput/SelectInput";
import { TextInput } from "@components/input/textInput/TextInput";
import { SettingsHeader } from "@components/settingsHeader";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledSettingsHeader = styled(SettingsHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(1)}; /* 8px gap to breadcrumb */
`;

const FormSection = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const SectionTitle = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  grid-column: 1 / -1;
`;

const CustomRolesSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledTableContainer = styled(TableContainer)`
  border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  border-radius: ${({ theme }) => theme.tokens.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledTableHead = styled(TableHead)`
  background-color: ${({ theme }) => theme.tokens.color.background.secondary};
`;

const StyledTableCell = styled(TableCell)`
  color: ${({ theme }) => theme.tokens.color.text.primary};
  font-weight: 500;
  border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(0)};
`;

const StyledTableBodyCell = styled(TableCell)`
  padding: 4px 0;
`;

const EmailSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const InfoText = styled(Typography)`
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  font-size: 14px;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  jobTitle: string;
  contactNumber: string;
  timeZone: string;
  city: string;
  state: string;
  country: string;
  companyName: string;
  currency: string;
  userEmail: string;
  systemRoles: {
    superAdmin: boolean;
    admin: boolean;
    standardUser: boolean;
    collaborator: boolean;
  };
  customRoles: {
    [key: string]: boolean;
  };
}

export const AddEditUser: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const isEditMode = !!userId;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    team: "",
    jobTitle: "",
    contactNumber: "",
    timeZone: "Wellington Region (GMT+12)",
    city: "Auckland",
    state: "Auckland",
    country: "New Zealand",
    companyName: "pathfinderatscrm",
    currency: "Dollar ($NZD - New Zealand)",
    userEmail: "user.name@pathfinderatscrm.com",
    systemRoles: {
      superAdmin: false,
      admin: false,
      standardUser: false,
      collaborator: false,
    },
    customRoles: {
      customRole1: false,
      customRole2: false,
      customRole3: false,
    },
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isEditMode && userId) {
      const mockUserData = {
        firstName: "Pankaj",
        lastName: "Kumar",
        email: "pankaj.kumar@pathfinderatscrm.com",
        team: "",
        jobTitle: "Account Manager",
        contactNumber: "",
        timeZone: "Wellington Region (GMT+12)",
        city: "Auckland",
        state: "Auckland",
        country: "New Zealand",
        companyName: "pathfinderatscrm",
        currency: "Dollar ($NZD - New Zealand)",
        userEmail: "pankaj.kumar@pathfinderatscrm.com",
        systemRoles: {
          superAdmin: false,
          admin: false,
          standardUser: true,
          collaborator: false,
        },
        customRoles: {
          customRole1: false,
          customRole2: false,
          customRole3: false,
        },
      };
      setFormData(mockUserData);
    }
  }, [isEditMode, userId]);

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSelectChange = (field: keyof FormData) => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSystemRoleChange = (role: keyof FormData["systemRoles"]) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      systemRoles: {
        ...prev.systemRoles,
        [role]: event.target.checked,
      },
    }));
  };

  const handleCustomRoleChange = (role: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      customRoles: {
        ...prev.customRoles,
        [role]: event.target.checked,
      },
    }));
  };

  const handleCancel = () => {
    navigate("/settings/admin/users");
  };

  const handleSaveOrInvite = () => {
    if (isEditMode) {
      // TODO: Implement save changes logic
      console.warn("Saving user changes:", formData);
    } else {
      // TODO: Implement send invite logic
      console.warn("Sending invite with data:", formData);
    }
    navigate("/settings/admin/users");
  };

  const teamOptions = [
    { value: "", label: "Select Team" },
    { value: "engineering", label: "Engineering" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
  ];

  const timeZoneOptions = [
    { value: "Wellington Region (GMT+12)", label: "Wellington Region (GMT+12)" },
    { value: "Auckland (GMT+12)", label: "Auckland (GMT+12)" },
    { value: "Sydney (GMT+10)", label: "Sydney (GMT+10)" },
    { value: "Singapore (GMT+8)", label: "Singapore (GMT+8)" },
    { value: "London (GMT)", label: "London (GMT)" },
    { value: "New York (GMT-5)", label: "New York (GMT-5)" },
  ];

  const cityOptions = [
    { value: "Auckland", label: "Auckland" },
    { value: "Wellington", label: "Wellington" },
    { value: "Christchurch", label: "Christchurch" },
    { value: "Hamilton", label: "Hamilton" },
    { value: "Dunedin", label: "Dunedin" },
  ];

  const stateOptions = [
    { value: "Auckland", label: "Auckland" },
    { value: "Wellington", label: "Wellington" },
    { value: "Canterbury", label: "Canterbury" },
    { value: "Waikato", label: "Waikato" },
    { value: "Otago", label: "Otago" },
  ];

  const countryOptions = [
    { value: "New Zealand", label: "New Zealand" },
    { value: "Australia", label: "Australia" },
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
  ];

  // const currencyOptions = [
  //   { value: "Dollar ($NZD - New Zealand)", label: "Dollar ($NZD - New Zealand)" },
  //   { value: "Dollar ($AUD - Australia)", label: "Dollar ($AUD - Australia)" },
  //   { value: "Dollar ($USD - United States)", label: "Dollar ($USD - United States)" },
  //   { value: "Pound (£GBP - United Kingdom)", label: "Pound (£GBP - United Kingdom)" },
  //   { value: "Euro (€EUR - Europe)", label: "Euro (€EUR - Europe)" },
  // ];

  return (
    <Container>
      <StyledSettingsHeader title="Users" />
      <CustomBreadCrumbs
        breadcrumbs={[{ label: "Home", href: "/settings/admin/users" }, { label: isEditMode ? "Edit User Details" : "Add User" }]}
      />

      <FormSection>
        <TextInput
          label="First Name"
          placeholder="Add First Name"
          value={formData.firstName}
          onChange={handleInputChange("firstName")}
          onBlur={handleBlur("firstName")}
          touched={touched.firstName}
          required
        />
        <TextInput
          label="Last Name"
          placeholder="Add Last Name"
          value={formData.lastName}
          onChange={handleInputChange("lastName")}
          onBlur={handleBlur("lastName")}
          touched={touched.lastName}
          required
        />
        <TextInput
          label="Email"
          placeholder="Add Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange("email")}
          onBlur={handleBlur("email")}
          touched={touched.email}
          required
          dataNoneditable={isEditMode ? true : false}
        />
        <SelectInput
          label="Team"
          value={formData.team}
          options={teamOptions}
          placeholder="Select Team"
          onChange={handleSelectChange("team")}
          onBlur={handleBlur("team")}
          touched={touched.team}
        />
        <TextInput
          label="Job Title"
          placeholder="Add Job Title"
          value={formData.jobTitle}
          onChange={handleInputChange("jobTitle")}
          onBlur={handleBlur("jobTitle")}
        />
        <TextInput
          label="Contact Number"
          placeholder="Add Contact Number"
          type="tel"
          value={formData.contactNumber}
          onChange={handleInputChange("contactNumber")}
          onBlur={handleBlur("contactNumber")}
        />
        <SelectInput
          label="Time Zone"
          value={formData.timeZone}
          options={timeZoneOptions}
          onChange={handleSelectChange("timeZone")}
          onBlur={handleBlur("timeZone")}
        />
        <SelectInput
          label="City"
          value={formData.city}
          options={cityOptions}
          onChange={handleSelectChange("city")}
          onBlur={handleBlur("city")}
        />
        <SelectInput
          label="State"
          value={formData.state}
          options={stateOptions}
          onChange={handleSelectChange("state")}
          onBlur={handleBlur("state")}
        />
        <SelectInput
          label="Country"
          value={formData.country}
          options={countryOptions}
          onChange={handleSelectChange("country")}
          onBlur={handleBlur("country")}
        />
        <TextInput
          label="Company Name"
          placeholder="pathfinderatscrm"
          value={formData.companyName}
          onChange={handleInputChange("companyName")}
          onBlur={handleBlur("companyName")}
          dataNoneditable={true}
        />

        <TextInput
          label="Currency"
          value={formData.currency}
          placeholder="Dollar ($NZD - New Zealand)"
          onChange={handleInputChange("currency")}
          onBlur={handleBlur("currency")}
          dataNoneditable={true}
        />
      </FormSection>

      <Box>
        <SectionTitle>System Roles & Permissions</SectionTitle>
        <Box display="flex" flexDirection="column" gap={1} mb={3}>
          <FormControlLabel
            control={<Checkbox checked={formData.systemRoles.superAdmin} onChange={handleSystemRoleChange("superAdmin")} color="primary" />}
            label="Super Admin"
          />
          <FormControlLabel
            control={<Checkbox checked={formData.systemRoles.admin} onChange={handleSystemRoleChange("admin")} color="primary" />}
            label="Admin"
          />
          <FormControlLabel
            control={
              <Checkbox checked={formData.systemRoles.standardUser} onChange={handleSystemRoleChange("standardUser")} color="primary" />
            }
            label="Standard User"
          />
          <FormControlLabel
            control={
              <Checkbox checked={formData.systemRoles.collaborator} onChange={handleSystemRoleChange("collaborator")} color="primary" />
            }
            label="Collaborator"
          />
        </Box>
      </Box>

      <CustomRolesSection>
        <SectionTitle>Custom Roles & Permissions</SectionTitle>
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell width="5%"></StyledTableCell>
                <StyledTableCell>Role Name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              <TableRow>
                <StyledTableBodyCell>
                  <Checkbox checked={formData.customRoles.customRole1} onChange={handleCustomRoleChange("customRole1")} color="primary" />
                </StyledTableBodyCell>
                <StyledTableBodyCell>Custom Role Name</StyledTableBodyCell>
                <StyledTableBodyCell>Custom Role Description</StyledTableBodyCell>
              </TableRow>
              <TableRow>
                <StyledTableBodyCell>
                  <Checkbox checked={formData.customRoles.customRole2} onChange={handleCustomRoleChange("customRole2")} color="primary" />
                </StyledTableBodyCell>
                <StyledTableBodyCell>Custom Role Name</StyledTableBodyCell>
                <StyledTableBodyCell>Custom Role Description</StyledTableBodyCell>
              </TableRow>
              <TableRow>
                <StyledTableBodyCell>
                  <Checkbox checked={formData.customRoles.customRole3} onChange={handleCustomRoleChange("customRole3")} color="primary" />
                </StyledTableBodyCell>
                <StyledTableBodyCell>Custom Role Name</StyledTableBodyCell>
                <StyledTableBodyCell>Custom Role Description</StyledTableBodyCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </CustomRolesSection>

      {!isEditMode && (
        <EmailSection>
          <SectionTitle>User Email*</SectionTitle>
          <TextInput
            label=""
            placeholder="user.name@pathfinderatscrm.com"
            type="email"
            value={formData.userEmail}
            onChange={handleInputChange("userEmail")}
            onBlur={handleBlur("userEmail")}
            touched={touched.userEmail}
            required
          />
          <InfoText>
            A link will be sent to the above email to complete the login process. For security reasons, the link to sign in will expire
            after 72 hours.
          </InfoText>
        </EmailSection>
      )}

      <ButtonContainer>
        <Button variant="neutral" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="solid" size="sm" onClick={handleSaveOrInvite}>
          {isEditMode ? "Save Changes" : "Send Invite"}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default AddEditUser;
