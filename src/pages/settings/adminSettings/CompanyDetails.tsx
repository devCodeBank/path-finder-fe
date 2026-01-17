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

interface CompanyDetailsFormData {
  companyName: string;
  country: string;
  website: string;
  accountOwner: string;
  accountId: string;
  accountType: string;
  email: string;
  timeZone: string;
  currency: string;
  createdOn: string;
}

const timeZoneOptions = [
  { value: "auckland", label: "Auckland Time +12:00" },
  { value: "sydney", label: "Sydney Time +11:00" },
  { value: "tokyo", label: "Tokyo Time +9:00" },
  { value: "utc", label: "UTC +0:00" },
];

const currencyOptions = [
  { value: "nzd", label: "Dollar ($NZD - New Zealand)" },
  { value: "usd", label: "Dollar ($USD - United States)" },
  { value: "aud", label: "Dollar ($AUD - Australia)" },
  { value: "eur", label: "Euro (€EUR - Europe)" },
];

export const CompanyDetails: React.FC = () => {
  const [formData, setFormData] = useState<CompanyDetailsFormData>({
    companyName: "Pathfinder AtsCrm",
    country: "New Zealand",
    website: "Not available",
    accountOwner: "John Doe",
    accountId: "PFAC1057",
    accountType: "Agency",
    email: "pankaj.kumar@pathfinderatscrm.com",
    timeZone: "auckland",
    currency: "nzd",
    createdOn: "Sat, June 21, 2025, 5:03 pm",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof CompanyDetailsFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSelectChange = (field: keyof CompanyDetailsFormData) => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleBlur = (field: keyof CompanyDetailsFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSaveChanges = () => {
    // TODO: Hook up to API when available
    console.warn("Saving company details:", formData);
  };

  const handleLogoUpload = () => {
    // TODO: Implement logo upload
    console.warn("Upload logo clicked");
  };

  const getCurrencyLabel = (currencyValue: string) => {
    const c = currencyOptions.find((o) => o.value === currencyValue);
    return c ? c.label : currencyValue;
  };

  return (
    <Container>
      <SettingsHeader title="Company Details" />

      <HeaderWithUpload name={formData.companyName} subtitle="Agency" onUpload={handleLogoUpload} uploadLabel="Upload Logo" />

      <FormContainer>
        <FormRow>
          <FormInput
            label="Company Name"
            value={formData.companyName}
            onChange={handleInputChange("companyName")}
            onBlur={handleBlur("companyName")}
            touched={touched.companyName}
          />
          <FormInput
            label="Account Type"
            value={formData.accountType}
            onChange={handleInputChange("accountType")}
            onBlur={handleBlur("accountType")}
            touched={touched.accountType}
            disabled
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="Country"
            value={formData.country}
            onChange={handleInputChange("country")}
            onBlur={handleBlur("country")}
            touched={touched.country}
            disabled
          />
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            onBlur={handleBlur("email")}
            touched={touched.email}
            disabled
          />
        </FormRow>

        <FormRow>
          <FormInput
            label="Company Website"
            placeholder="Not available"
            value={formData.website}
            onChange={handleInputChange("website")}
            onBlur={handleBlur("website")}
            touched={touched.website}
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
            label="Account Owner/Admin"
            value={formData.accountOwner}
            onChange={handleInputChange("accountOwner")}
            onBlur={handleBlur("accountOwner")}
            touched={touched.accountOwner}
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

        <FormRow>
          <FormInput
            label="Account ID"
            value={formData.accountId}
            onChange={handleInputChange("accountId")}
            onBlur={handleBlur("accountId")}
            touched={touched.accountId}
            disabled
          />
          <FormInput
            label="Create On"
            value={formData.createdOn}
            onChange={handleInputChange("createdOn")}
            onBlur={handleBlur("createdOn")}
            touched={touched.createdOn}
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

export default CompanyDetails;
