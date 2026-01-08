import { Button } from "@components/buttons/button/Button";
import { HeaderWithUpload } from "@components/headerWithUpload";
import { FormInput, FormSelect } from "@components/input/formInput";
import { SettingsHeader } from "@components/settingsHeader";
import type { SelectChangeEvent } from "@mui/material";
import { Box } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const FormContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const FormRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(8)};
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  companyName: string;
  role: string;
  contactNumber: string;
  timeZone: string;
  city: string;
  state: string;
  country: string;
  currency: string;
}

const timeZoneOptions = [
  { value: "auckland", label: "Auckland Time +12:00" },
  { value: "sydney", label: "Sydney Time +11:00" },
  { value: "tokyo", label: "Tokyo Time +9:00" },
  { value: "utc", label: "UTC +0:00" },
];

const roleOptions = [
  { value: "super_admin", label: "Account Owner - Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "viewer", label: "Viewer" },
];

const stateOptions = [
  { value: "auckland", label: "Auckland" },
  { value: "wellington", label: "Wellington" },
  { value: "christchurch", label: "Christchurch" },
  { value: "hamilton", label: "Hamilton" },
];

const currencyOptions = [
  { value: "nzd", label: "Dollar ($NZD - New Zealand)" },
  { value: "usd", label: "Dollar ($USD - United States)" },
  { value: "aud", label: "Dollar ($AUD - Australia)" },
  { value: "eur", label: "Euro (€EUR - Europe)" },
];

export const Profile: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "Pankaj",
    lastName: "Kumar",
    email: "pankaj.kumar@pathfinderatscrm.com",
    jobTitle: "",
    companyName: "pathfinderatscrm",
    role: "super_admin",
    contactNumber: "123-5678900",
    timeZone: "auckland",
    city: "Auckland",
    state: "auckland",
    country: "New Zealand",
    currency: "nzd",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof ProfileFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof ProfileFormData) => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleBlur = (field: keyof ProfileFormData) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.warn("Saving profile data:", formData);
  };

  const handlePhotoUpload = () => {
    // TODO: Implement photo upload functionality
    console.warn("Photo upload clicked");
  };

  const getRoleLabel = (roleValue: string) => {
    const role = roleOptions.find((option) => option.value === roleValue);
    return role ? role.label : roleValue;
  };

  const getCurrencyLabel = (currencyValue: string) => {
    const currency = currencyOptions.find((option) => option.value === currencyValue);
    return currency ? currency.label : currencyValue;
  };

  return (
    <Container>
      <SettingsHeader title="Profile" />

      <HeaderWithUpload
        name={`${formData.firstName} ${formData.lastName}`}
        subtitle={formData.jobTitle || "Job Title"}
        onUpload={handlePhotoUpload}
      />

      <FormContainer>
        <FormRow>
          <FormInput
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange("firstName")}
            onBlur={handleBlur("firstName")}
            touched={touched.firstName}
          />
          <FormInput
            label="Last Name"
            value={formData.lastName}
            onChange={handleInputChange("lastName")}
            onBlur={handleBlur("lastName")}
            touched={touched.lastName}
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            onBlur={handleBlur("email")}
            touched={touched.email}
            disabled
          />
          <FormInput
            label="Job Title"
            placeholder="Add Job Title"
            value={formData.jobTitle}
            onChange={handleInputChange("jobTitle")}
            onBlur={handleBlur("jobTitle")}
            touched={touched.jobTitle}
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="Company Name"
            value={formData.companyName}
            onChange={handleInputChange("companyName")}
            onBlur={handleBlur("companyName")}
            touched={touched.companyName}
            disabled
          />
          <FormInput
            label="Role"
            value={getRoleLabel(formData.role)}
            onChange={handleInputChange("role")}
            onBlur={handleBlur("role")}
            touched={touched.role}
            disabled
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="Contact Number"
            type="tel"
            value={formData.contactNumber}
            onChange={handleInputChange("contactNumber")}
            onBlur={handleBlur("contactNumber")}
            touched={touched.contactNumber}
          />
          <FormSelect
            label="Time Zone"
            value={formData.timeZone}
            options={timeZoneOptions}
            onChange={handleSelectChange("timeZone")}
            onBlur={handleBlur("timeZone")}
            touched={touched.timeZone}
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="City"
            value={formData.city}
            onChange={handleInputChange("city")}
            onBlur={handleBlur("city")}
            touched={touched.city}
          />
          <FormSelect
            label="State"
            value={formData.state}
            options={stateOptions}
            onChange={handleSelectChange("state")}
            onBlur={handleBlur("state")}
            touched={touched.state}
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="Country"
            value={formData.country}
            onChange={handleInputChange("country")}
            onBlur={handleBlur("country")}
            touched={touched.country}
          />
          <FormInput
            label="Currency"
            value={getCurrencyLabel(formData.currency)}
            onChange={handleInputChange("currency")}
            onBlur={handleBlur("currency")}
            touched={touched.currency}
            disabled
          />
        </FormRow>
      </FormContainer>

      <ButtonContainer>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </ButtonContainer>
    </Container>
  );
};

export default Profile;
