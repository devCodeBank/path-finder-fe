import React, { useState } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";

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
  { value: "auckland", label: "(GMT +13) New Zealand Daylight Time" },
  { value: "sydney", label: "(GMT +11) Sydney Time" },
  { value: "tokyo", label: "(GMT +9) Tokyo Time" },
  { value: "utc", label: "(GMT +0) UTC" },
];

const roleOptions = [
  { value: "super_admin", label: "Account Owner / Super Admin" },
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
    firstName: "John",
    lastName: "Doe",
    email: "john.d@example.com",
    jobTitle: "Account Manager",
    companyName: "Acme Limited",
    role: "super_admin",
    contactNumber: "12-345663321",
    timeZone: "auckland",
    city: "Auckland",
    state: "auckland",
    country: "New Zealand",
    currency: "nzd",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Added this function which was missing in previous attempt but used in JSX
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


  const handleSaveChanges = () => {
    console.warn("Saving profile data:", formData);
    setIsEditing(false);
  };

  const getRoleLabel = (roleValue: string) => {
    const role = roleOptions.find((option) => option.value === roleValue);
    return role ? role.label : roleValue;
  };

  const getCurrencyLabel = (currencyValue: string) => {
    const currency = currencyOptions.find((option) => option.value === currencyValue);
    return currency ? currency.label : currencyValue;
  };

  const renderField = (label: string, value: string, fieldKey: keyof ProfileFormData, options: any[] = []) => {
    if (!isEditing) {
      // View Mode
      let displayValue = value;
      if (fieldKey === "role") displayValue = getRoleLabel(value);
      if (fieldKey === "currency") displayValue = getCurrencyLabel(value);
      if (fieldKey === "timeZone") displayValue = timeZoneOptions.find(o => o.value === value)?.label || value;
      if (fieldKey === "state") displayValue = stateOptions.find(o => o.value === value)?.label || value;

      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-500">{label}</label>
          <div className="text-gray-900 text-base font-medium min-h-6">{displayValue || "-"}</div>
        </div>
      );
    }

    // Edit Mode
    if (options.length > 0) {
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-500">{label}</label>
          <Select
            value={value}
            onChange={handleSelectChange(fieldKey)}
            size="small"
            fullWidth
            sx={{
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
              fontSize: '0.95rem'
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-500">{label}</label>
        <TextField
          value={value}
          onChange={handleInputChange(fieldKey)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={fieldKey === 'email' || fieldKey === 'companyName' || fieldKey === 'role' || fieldKey === 'currency'}
          sx={{
            backgroundColor: (fieldKey === 'email' || fieldKey === 'companyName' || fieldKey === 'role' || fieldKey === 'currency') ? '#F3F4F6' : '#fff',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
            '& .MuiInputBase-input': { fontSize: '0.95rem' }
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full pb-10 font-sans">
      {/* Top Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-full bg-[#f8f9fa] flex items-center justify-center text-xl font-bold text-gray-800 border-none">
            PK
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              {formData.jobTitle || "Account Manager"}
            </p>
            <div className="flex items-center gap-1 mt-0.5 cursor-pointer hover:text-purple-600 transition-colors group">
              <span className="text-xs text-gray-400 font-medium group-hover:text-purple-600">Upload Photo</span>
              <InfoOutlined sx={{ fontSize: 13, color: '#9CA3AF' }} className="group-hover:!text-purple-600" />
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-4 md:mt-0">
          <Button
            variant="contained"
            onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
            sx={{
              backgroundColor: '#6E41E2',
              textTransform: 'none',
              fontWeight: 500,
              padding: '8px 32px',
              borderRadius: '6px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#5b35d0',
                boxShadow: 'none',
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Details Grid Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
          {/* Row 1 */}
          {renderField("First Name", formData.firstName, "firstName")}
          {renderField("Last Name", formData.lastName, "lastName")}

          {/* Row 2 */}
          {renderField("Email", formData.email, "email")}
          {renderField("Job Title", formData.jobTitle, "jobTitle")}

          {/* Row 3 */}
          {renderField("Company Name", formData.companyName, "companyName")}
          {renderField("Role", formData.role, "role")}

          {/* Row 4 */}
          {renderField("Contact Number", formData.contactNumber, "contactNumber")}
          {renderField("Time Zone", formData.timeZone, "timeZone", timeZoneOptions)}

          {/* Row 5 */}
          {renderField("City", formData.city, "city")}
          {renderField("State", formData.state, "state", stateOptions)}

          {/* Row 6 */}
          {renderField("Country", formData.country, "country")}
          {renderField("Currency", formData.currency, "currency")}
        </div>
      </div>
    </div>
  );
};

export default Profile;
