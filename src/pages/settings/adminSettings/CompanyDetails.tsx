import { InfoOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import { cn } from "@/lib/utils";

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

const currencyOptions = [
  { value: "$NZD - New Zealand", label: "Dollar ($NZD - New Zealand)" },
  { value: "$USD - United States", label: "Dollar ($USD - United States)" },
  { value: "$AUD - Australia", label: "Dollar ($AUD - Australia)" },
  { value: "€EUR - Europe", label: "Euro (€EUR - Europe)" },
];

export const CompanyDetails: React.FC = () => {
  const [formData, setFormData] = useState<CompanyDetailsFormData>({
    companyName: "Acme Corporation",
    country: "New Zealand",
    website: "Not available",
    accountOwner: "John Doe",
    accountId: "PFAC1057",
    accountType: "Agency",
    email: "john.d@acmecorp.com",
    timeZone: "Pacific/Auckland",
    currency: "$NZD - New Zealand",
    createdOn: "Sat, June 21, 2025, 5:03 pm",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof CompanyDetailsFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSelectChange = (field: keyof CompanyDetailsFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // TODO: Hook up to API when available
    console.warn("Saving company details:", formData);
    setIsEditing(false);
  };

  const getCurrencyLabel = (currencyValue: string) => {
    const normalized = currencyValue.toLowerCase();
    const c = currencyOptions.find((o) => o.value === normalized);
    return c ? c.label : currencyValue;
  };

  const getTimeZoneLabel = (timeZoneValue: string) => {
    const tz = timeZoneOptions.find((o) => o.value === timeZoneValue);
    return tz ? tz.label : timeZoneValue;
  };

  const isFieldReadOnly = (field: keyof CompanyDetailsFormData) => {
    return field !== "website";
  };

  const renderField = (
    label: string,
    value: string,
    fieldKey: keyof CompanyDetailsFormData,
    options: { value: string; label: string }[] = []
  ) => {
    if (!isEditing) {
      let displayValue = value;
      if (fieldKey === "currency") displayValue = getCurrencyLabel(value);
      if (fieldKey === "timeZone") displayValue = getTimeZoneLabel(value);

      return (
        <div className="flex flex-col gap-1.5">
          <label className="text-[#333333]/70 text-[14px] leading-[18px] font-[500]">{label}</label>
          <div className="text-[#333333] text-[13px] leading-[18px] font-[400]">{displayValue || "-"}</div>
        </div>
      );
    }

    if (options.length > 0) {
      return (
        <FloatingLabelSelect
          id={fieldKey}
          label={label}
          labelClassName="text-[#333333]/70"
          value={value}
          onValueChange={handleSelectChange(fieldKey)}
          options={options}
          disabled={isFieldReadOnly(fieldKey)}
          maxVisibleOptions={fieldKey === "timeZone" ? 10 : undefined}
          className={cn("w-full h-[56px]")}
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
        disabled={isFieldReadOnly(fieldKey)}
        className={cn("w-full h-[56px]")}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-full font-sans pb-10">


      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start gap-4">
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
                <InfoOutlined sx={{ fontSize: 13, color: '#666666' }} className="group-hover:!text-purple-600" />
                <span className="absolute left-[calc(100%+8px)] top-1/2 z-10 w-[260px] -translate-y-1/2 rounded-md bg-[#5A5A5A] px-3 py-2 text-[12px] text-white shadow-[0px_6px_16px_0px_#00000029] opacity-0 pointer-events-none group-hover:opacity-100">
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#5A5A5A]" />
                  File type supported: PNG, JPG, JPEG (Up to 500KB), recommended size with 100% and height 50px
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 justify-center mt-5">
            <h2 className="text-[14px] font-[500] text-[#333333] leading-tight">
              {formData.companyName}
            </h2>
            <p className="text-[13px] font-[400] text-[#333333]/70">
              {formData.accountType || "Director, Sales"}
            </p>
          </div>
        </div>
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

      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          {renderField("Company Name", formData.companyName, "companyName")}
          {renderField("Account Type", formData.accountType, "accountType")}
          {renderField("Country", formData.country, "country")}
          {renderField("Email", formData.email, "email")}
          {renderField("Company Website", formData.website, "website")}
          {renderField("Time Zone", formData.timeZone, "timeZone", timeZoneOptions)}
          {renderField("Account Owner/Admin", formData.accountOwner, "accountOwner")}
          {renderField("Currency", formData.currency, "currency")}
          {renderField("Account ID", formData.accountId, "accountId")}
          {renderField("Create On", formData.createdOn, "createdOn")}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
