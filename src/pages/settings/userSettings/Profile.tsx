import React, { useState } from "react";
import { Button } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import { cn } from "@/lib/utils";

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

const getTimeZoneOffsetLabel = (timeZone: string) => {
  const now = new Date();
  const local = new Date(now.toLocaleString("en-US", { timeZone }));
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMinutes = Math.round((local.getTime() - utc.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const minutes = String(absMinutes % 60).padStart(2, "0");
  return `(GMT ${sign}${hours}:${minutes})`;
};

const timeZoneOptions = (() => {
  const zones =
    typeof Intl !== "undefined" && "supportedValuesOf" in Intl
      ? Intl.supportedValuesOf("timeZone")
      : ["UTC"];
  return zones
    .map((zone) => ({
      value: zone,
      label: `${getTimeZoneOffsetLabel(zone)} ${zone}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
})();

const roleOptions = [
  { value: "super_admin", label: "Account Owner" },
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
    email: "john.d@acmecorp.com",
    jobTitle: "Director, Sales",
    companyName: "Acme Corporation",
    role: "super_admin",
    contactNumber: "12-345663321",
    timeZone: "Pacific/Auckland",
    city: "Auckland",
    state: "auckland",
    country: "New Zealand",
    currency: "nzd",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof ProfileFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof ProfileFormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
        <div className="flex flex-col gap-1.5">
          <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">{label}</label>
          <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{displayValue || "-"}</div>
        </div>
      );
    }

    // Edit Mode
    if (options.length > 0) {
      return (
        <FloatingLabelSelect
          id={fieldKey}
          label={label}
          labelClassName="text-[#333333]/70"
          value={value}
          onValueChange={handleSelectChange(fieldKey)}
          options={options}
          disabled={fieldKey === 'role' || fieldKey === 'currency'}
          maxVisibleOptions={fieldKey === "timeZone" ? 10 : undefined}
          className={cn(
            "w-full h-[56px]",
          )}
        />
      );
    }

    return (
      <FloatingLabelInput
        id={fieldKey}
        label={label}
        labelClassName="text-[#333333]/70"
        value={value}
        onChange={handleInputChange(fieldKey)}
        disabled={fieldKey === 'email' || fieldKey === 'companyName'}
        className={cn(
          "w-full h-[56px]",
        )}
      />
    );
  };

  return (
    <div className="flex flex-col w-full max-w-full  font-sans h-[100%]">
      {/* Top Profile Card */}
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between    my-[0px]">
        <div className="flex items-start gap-6">
          <div className="flex flex-col gap-2">
            {/* Avatar Box */}
            <div className="h-[79px] w-[93px] bg-[#CCCCCC26] rounded-[4px] flex items-center justify-center border-none">
              <div className="text-[#333333] bg-white flex items-center justify-center rounded-full w-[47px] h-[47px] text-center text-xl font-bold">
                JD
              </div>
            </div>
            {/* Upload Photo below avatar */}
            <div className="flex items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors group relative">
              <span className="text-[13px] text-[#333333] font-[400] group-hover:text-purple-600">Upload Photo</span>
              <span className="relative inline-flex items-center justify-center h-[16px] w-[16px]">
                <InfoOutlined sx={{ fontSize: 12, color: '#666666', position: "relative", top: "1px" }} className="group-hover:!text-purple-600" />
                <span className="absolute left-[calc(100%+8px)] top-1/2 z-10 w-[260px] -translate-y-1/2 rounded-md bg-[#5A5A5A] px-3 py-2 text-[12px] text-white shadow-[0px_6px_16px_0px_#00000029] opacity-0 pointer-events-none group-hover:opacity-100">
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#5A5A5A]" />
                  File type supported: PNG, JPG, JPEG (Up to 500KB), recommended size with 100% and height 50px
                </span>
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1 justify-center mt-5">
            <h2 className="text-[14px] font-[500] text-[#333333] leading-tight">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-[13px] font-[400] text-[#333333]/70">
              {formData.jobTitle || "Director, Sales"}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-4 md:mt-0">
          <Button
            variant="contained"
            onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
            sx={{
              width: '110px',
              height: '36px',
              backgroundColor: '#6E41E2',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '18px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#9A77F0',
                boxShadow: 'none',
              },
              '&:active': {
                boxShadow: 'none',
              },
              color: "white",
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Details Grid Card */}
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-4   my-[18px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          {/* Row 1 */}
          {renderField("First Name", formData.firstName, "firstName")}
          {renderField("Last Name", formData.lastName, "lastName")}

          {/* Row 2 */}
          {renderField("Email", formData.email, "email")}
          {renderField("Job Title", formData.jobTitle, "jobTitle")}

          {/* Row 3 */}
          {renderField("Company Name", formData.companyName, "companyName")}
          {renderField("Role", formData.role, "role", roleOptions)}

          {/* Row 4 */}
          {renderField("Contact Number", formData.contactNumber, "contactNumber")}
          {renderField("Time Zone", formData.timeZone, "timeZone", timeZoneOptions)}

          {/* Row 5 */}
          {renderField("City", formData.city, "city")}
          {renderField("State", formData.state, "state", stateOptions)}

          {/* Row 6 */}
          {renderField("Country", formData.country, "country")}
          {renderField("Currency", formData.currency, "currency", currencyOptions)}
        </div>
      </div>
    </div>
  );
};

export default Profile;

