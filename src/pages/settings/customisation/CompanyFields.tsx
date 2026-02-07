import React, { useMemo, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";
import { cn } from "@/lib/utils";
import { Button } from "@mui/material";

const primaryButtonSx = {
  height: "36px",
  backgroundColor: "#6E41E2",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  boxShadow: "none",
  width: "120px",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#7B52F4",
    boxShadow: "none",
  },
};
const outlineButtonSx = {
  height: "36px",
  borderColor: "#CCCCCC80",
  color: "#333333",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "4px",
  width: "90px",
  boxShadow: "none",
  "&:hover": {
    borderColor: "#CCCCCC80",
    backgroundColor: "#F3F4F6",
    boxShadow: "none",
  },
};
type FieldRow = {
  id: string;
  label: string;
  type: string;
  visibility: boolean;
  required: boolean;
  extension: boolean;
};

type Section = {
  id: string;
  title: string;
  enabled: boolean;
  rows: FieldRow[];
};


const Toggle = ({
  enabled,
  onChange,
  ariaLabel,
  showLabel = false,
  label = ""
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
  showLabel?: boolean;
  label?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-3", showLabel ? "" : "")}>
      <button
        type="button"
        aria-pressed={enabled}
        aria-label={ariaLabel}
        onClick={(event) => {
          event.stopPropagation();
          onChange(!enabled);
        }}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 outline-none",
          enabled ? "bg-[#57CC4D]" : "bg-[#CCCCCC]"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
            enabled ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </button>
      {showLabel && (
        <span className="text-[13px] font-[400] text-[#333333]">{label}</span>
      )}
    </div>
  );
};

const Flag = ({
  checked,
  onChange,
  ariaLabel
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
}) => {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "h-[14px] w-[14px] rounded-[3px] border flex items-center justify-center",
        checked ? "bg-[#57CC4D] border-[#57CC4D]" : "bg-white border-[#D7D7D7]"
      )}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

const GripIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="2" height="2" fill="#666666" />
    <rect x="5" y="1" width="2" height="2" fill="#666666" />
    {/* <rect x="9" y="1" width="2" height="2" fill="#666666" /> */}
    <rect x="1" y="5" width="2" height="2" fill="#666666" />
    <rect x="5" y="5" width="2" height="2" fill="#666666" />
    {/* <rect x="9" y="5" width="2" height="2" fill="#666666" /> */}
    <rect x="1" y="9" width="2" height="2" fill="#666666" />
    <rect x="5" y="9" width="2" height="2" fill="#666666" />
    {/* <rect x="9" y="9" width="2" height="2" fill="#666666" /> */}
  </svg>
);



const LayoutHeader = ({
  title,

  onToggle,
  collapsed
}: {
  title: string;
  collapsed: boolean;

  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full h-[52px] px-4 flex items-center justify-between border border-[#E6E6E6] rounded-[4px] bg-[#FAFAFA] text-[14px] font-[500] text-[#333333]"
  >
    <span>{title}</span>
    {collapsed ? (
      <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
    ) : (
      <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
    )}
  </button>
);

const SectionCard = ({
  section,
  collapsed,
  onToggleSection,
  onToggleCollapse,
  onToggleRow
}: {
  section: Section;
  collapsed: boolean;
  onToggleSection: (sectionId: string, enabled: boolean) => void;
  onToggleCollapse: (sectionId: string) => void;
  onToggleRow: (sectionId: string, rowId: string, key: keyof FieldRow, value: boolean) => void;
}) => {
  return (
    <div className="bg-white  border-[#CCCCCC80] rounded-[4px] overflow-hidden">
      <div
        className="h-[52px] px-4 flex items-center justify-between rounded-[4px] border border-[#CCCCCC80] bg-[#FAFAFA] cursor-pointer"
        onClick={() => onToggleCollapse(section.id)}
      >
        <div className="flex items-center gap-2 text-[14px] text-[#333333] font-[500]">
          <span className="text-[#333333] ">{section.title}</span>
        </div>
        <div className="flex items-center gap-10">
          <Toggle
            enabled={section.enabled}
            onChange={(val) => onToggleSection(section.id, val)}
            ariaLabel={`Toggle ${section.title}`}
          />
          <button
            type="button"
            aria-label={`Edit ${section.title}`}
            className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
            onClick={(event) => event.stopPropagation()}
          >
            <EditOutlinedIcon sx={{ fontSize: 14, color: "#666666" }} />
          </button>
          <button
            type="button"
            aria-label={`Toggle ${section.title}`}
            className="h-[24px] w-[24px] flex items-center justify-center rounded-[4px] border border-[#CCCCCC80] text-[#666666] hover:bg-[#F3F4F6]"
            onClick={(event) => {
              event.stopPropagation();
              onToggleCollapse(section.id);
            }}
          >
            {collapsed ? (
              <KeyboardDoubleArrowDownRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
            ) : (
              <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: 16, color: "#666666" }} />
            )}
          </button>
        </div>
      </div>
      {!collapsed && (
        <>
          <div className="grid grid-cols-[32px_2.2fr_1.4fr_0.8fr_0.7fr_0.8fr] gap-2 px-4 py-2 text-[13px] font-[500] text-[#333333] border-[#CCCCCC80] bg-[#FFFFFF]">
            <span />
            <span></span>
            <span>Fields Type</span>
            <span className="text-center">Visibility</span>
            <span className="text-center">Required</span>
            <span className="text-center">Extension</span>
          </div>
          <div className="flex flex-col gap-2">
            {section.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[32px_2.2fr_1.4fr_0.8fr_0.7fr_0.8fr] gap-2 px-4 h-[44px] text-[13px] text-[#333333] items-center border border-[#E6E6E6] rounded-[4px] bg-white"
              >
                <div className="flex items-center justify-center">
                  <GripIcon />
                </div>
                <span className="font-[500] text-[13px]">{row.label}</span>
                <span className="text-[13px] font-[400] text-[#333333]/70">{row.type}</span>
                <div className="flex justify-center">
                  <Toggle
                    enabled={row.visibility}
                    onChange={(val) => onToggleRow(section.id, row.id, "visibility", val)}
                    ariaLabel={`Toggle visibility for ${row.label}`}
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.required}
                    onChange={(val) => onToggleRow(section.id, row.id, "required", val)}
                    ariaLabel={`Toggle required for ${row.label}`}
                  />
                </div>
                <div className="flex justify-center">
                  <Flag
                    checked={row.extension}
                    onChange={(val) => onToggleRow(section.id, row.id, "extension", val)}
                    ariaLabel={`Toggle extension for ${row.label}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const CompanyFields: React.FC = () => {
  const initialSections: Section[] = useMemo(
    () => [
      {
        id: "companyDetails",
        title: "Company Details",
        enabled: true,
        rows: [
          { id: "companyName", label: "Company Name*", type: "Text", visibility: true, required: true, extension: true },
          { id: "industry", label: "Industry*", type: "Single-Select Dropdown", visibility: true, required: true, extension: true },
          { id: "clientType", label: "Client Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: true },
          { id: "website", label: "Website*", type: "Text (URL)", visibility: true, required: true, extension: true },
          { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "companySize", label: "Company Size", type: "Single-Select Dropdown", visibility: true, required: false, extension: true },
          { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "existingContacts", label: "Existing Contacts", type: "Searchable Dropdown", visibility: true, required: false, extension: true },
          { id: "xprofile", label: "X Profile", type: "Text (URL)", visibility: true, required: false, extension: true }
        ]
      },
      {
        id: "aboutCompany",
        title: "About Company",
        enabled: true,
        rows: [
          { id: "about", label: "About Company", type: "Long Text", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "location",
        title: "Location",
        enabled: true,
        rows: [
          { id: "fullAddress", label: "Full Address", type: "Text", visibility: true, required: false, extension: false },
          { id: "city", label: "City", type: "Text", visibility: true, required: false, extension: false },
          { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: false },
          { id: "country", label: "Country*", type: "Searchable Dropdown", visibility: true, required: true, extension: false },
          { id: "postal", label: "Postal Code", type: "Text", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "accountManagement",
        title: "Account Management & Billing",
        enabled: true,
        rows: [
          { id: "accountStatus", label: "Account Status*", type: "Single-Select Dropdown", visibility: true, required: true, extension: true },
          { id: "accountOwner", label: "Account Owner*", type: "Searchable Dropdown", visibility: true, required: true, extension: true },
          { id: "source", label: "Source", type: "Single-Select Dropdown", visibility: true, required: false, extension: true },
          { id: "billingTerms", label: "Billing Terms", type: "Single-Select Dropdown", visibility: true, required: false, extension: true },
          { id: "taxVatId", label: "Tax / VAT ID", type: "Text", visibility: true, required: false, extension: false },
          { id: "estRevenue", label: "EST. Revenue", type: "Currency", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "contactDetails",
        title: "Contact Details",
        enabled: true,
        rows: [
          { id: "firstName", label: "First Name", type: "Text", visibility: true, required: false, extension: true },
          { id: "lastName", label: "Last Name", type: "Text", visibility: true, required: false, extension: true },
          { id: "title", label: "Title", type: "Text", visibility: true, required: false, extension: true },
          { id: "contactType", label: "Contact Type", type: "Single-Select Dropdown", visibility: true, required: false, extension: true },
          { id: "contactStage", label: "Contact Stage", type: "Single-Select Dropdown", visibility: true, required: false, extension: true }
        ]
      },
      {
        id: "contactCommunication",
        title: "Contact Communication",
        enabled: true,
        rows: [
          { id: "email", label: "Email", type: "Text (Email)", visibility: true, required: false, extension: true },
          { id: "phone", label: "Phone Number", type: "Text (Phone)", visibility: true, required: false, extension: true },
          { id: "altEmail", label: "Alt. Email", type: "Text (Email)", visibility: true, required: false, extension: true }
        ]
      },
      {
        id: "contactSocial",
        title: "Contact Social Links",
        enabled: true,
        rows: [
          { id: "linkedin", label: "LinkedIn Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "xprofile", label: "X Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "facebook", label: "Facebook Profile", type: "Text (URL)", visibility: true, required: false, extension: true },
          { id: "website", label: "Website", type: "Text (URL)", visibility: true, required: false, extension: true }
        ]
      },
      {
        id: "contactAddress",
        title: "Contact Address Info",
        enabled: true,
        rows: [
          { id: "fullAddress", label: "Full Address", type: "Text", visibility: true, required: false, extension: false },
          { id: "city", label: "City", type: "Text", visibility: true, required: false, extension: false },
          { id: "state", label: "State / Province", type: "Text", visibility: true, required: false, extension: false },
          { id: "country", label: "Country", type: "Text", visibility: true, required: false, extension: false },
          { id: "postal", label: "Postal Code", type: "Text", visibility: true, required: false, extension: false }
        ]
      },
      {
        id: "contactRelationship",
        title: "Contact Relationship",
        enabled: true,
        rows: [
          { id: "department", label: "Department", type: "Text", visibility: true, required: false, extension: true },
          { id: "manager", label: "Manager", type: "Text", visibility: true, required: false, extension: true }
        ]
      }
    ],
    []
  );

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [enforceRequiredOnExtension, setEnforceRequiredOnExtension] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [layoutOpen, setLayoutOpen] = useState<Record<string, boolean>>({
    companyDetails: true,
    aboutCompany: true,
    location: false,
    accountManagement: false,
    contactDetails: true,
    contactCommunication: true,
    contactSocial: true,
    contactAddress: false,
    contactRelationship: false
  });
  const [layoutForm, setLayoutForm] = useState({
    companyName: "",
    industry: "",
    clientType: "",
    website: "",
    linkedin: "",
    companySize: "",
    facebook: "",
    existingContacts: "",
    xprofile: "",
    aboutCompany: "",
    fullAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    accountStatus: "",
    accountOwner: "",
    source: "",
    billingTerms: "",
    taxVatId: "",
    estRevenue: "",
    contactFirstName: "",
    contactLastName: "",
    contactTitle: "",
    contactType: "",
    contactStage: "",
    contactEmail: "",
    contactPhone: "",
    contactAltEmail: "",
    contactLinkedin: "",
    contactX: "",
    contactFacebook: "",
    contactWebsite: "",
    contactAddress: "",
    contactCity: "",
    contactState: "",
    contactCountry: "",
    contactPostalCode: "",
    contactDepartment: "",
    contactManager: ""
  });
  const [showLayoutErrors, setShowLayoutErrors] = useState(false);

  const handleToggleSection = (sectionId: string, enabled: boolean) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, enabled } : section))
    );
  };

  const handleToggleRow = (
    sectionId: string,
    rowId: string,
    key: keyof FieldRow,
    value: boolean
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }
        return {
          ...section,
          rows: section.rows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
        };
      })
    );
  };

  const handleToggleCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleLayoutChange =
    (key: keyof typeof layoutForm) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setLayoutForm((prev) => ({ ...prev, [key]: value }));
      };
  const validateLayout = () => {
    if (!layoutForm.companyName.trim()) return false;
    if (!layoutForm.industry.trim()) return false;
    if (!layoutForm.website.trim()) return false;
    if (!layoutForm.country.trim()) return false;
    if (!layoutForm.accountStatus.trim()) return false;
    if (!layoutForm.accountOwner.trim()) return false;
    return true;
  };

  const fieldsContent = (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
        <div className="px-4 h-[52px] border-b border-[#CCCCCC80] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex flex-col">
            <span className="text-[14px] text-[#333333] font-[500]">Enforce required fields on extension</span>
            <button type="button" className="text-[13px] text-[#6E41E2] font-[400] hover:underline w-fit">
              Learn more
            </button>
          </div>
          <Toggle
            enabled={enforceRequiredOnExtension}
            onChange={setEnforceRequiredOnExtension}
            ariaLabel="Enforce required fields on extension"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            collapsed={Boolean(collapsedSections[section.id])}
            onToggleSection={handleToggleSection}
            onToggleCollapse={handleToggleCollapse}
            onToggleRow={handleToggleRow}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="h-[36px] px-4 rounded-[4px] bg-[#6E41E2] text-white text-[12px] font-[500] hover:bg-[#7B52F4]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const layoutContent = (
    <div className="flex flex-col gap-4 pt-4">
      <LayoutHeader
        title="Company Details"
        collapsed={!layoutOpen.companyDetails}
        onToggle={() => setLayoutOpen((p) => ({ ...p, companyDetails: !p.companyDetails }))}
      />
      {layoutOpen.companyDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="Company Name"
              required
              placeholder="e.g., Acme Corporation"
              value={layoutForm.companyName}
              onChange={handleLayoutChange("companyName")}
              className={cn(showLayoutErrors && !layoutForm.companyName.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.companyName.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Company Name is required.
              </span>
            )}
          </div>
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelSelect
              label="Industry"
              placeholder="Select Industry"
              options={[]}
              value={layoutForm.industry}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, industry: value }))}
              className={cn(showLayoutErrors && !layoutForm.industry.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.industry.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Industry is required.
              </span>
            )}
          </div>
          <FloatingLabelSelect
            label="Client Type"
            placeholder="Select Client Type"
            options={[]}
            value={layoutForm.clientType}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, clientType: value }))}
          />
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="Website"
              required
              placeholder="http://www.example.com"
              value={layoutForm.website}
              onChange={handleLayoutChange("website")}
              className={cn(showLayoutErrors && !layoutForm.website.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.website.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Website is required.
              </span>
            )}
          </div>
          <FloatingLabelInput
            label="LinkedIn Profile"
            placeholder="www.linkedin.com/acme"
            value={layoutForm.linkedin}
            onChange={handleLayoutChange("linkedin")}
          />
          <FloatingLabelSelect
            label="Company Size"
            placeholder="Select Company Size"
            options={[]}
            value={layoutForm.companySize}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, companySize: value }))}
          />
          <FloatingLabelInput
            label="Facebook Profile"
            placeholder="www.facebook.com/acme"
            value={layoutForm.facebook}
            onChange={handleLayoutChange("facebook")}
          />
          <FloatingLabelInput
            label="Existing Contacts"
            placeholder="Search by Name or Email"
            value={layoutForm.existingContacts}
            onChange={handleLayoutChange("existingContacts")}
          />
          <FloatingLabelInput
            label="X Profile"
            placeholder="www.x.com/acme"
            value={layoutForm.xprofile}
            onChange={handleLayoutChange("xprofile")}
          />
        </div>
      )}

      <LayoutHeader
        title="About Company"
        collapsed={!layoutOpen.aboutCompany}
        onToggle={() => setLayoutOpen((p) => ({ ...p, aboutCompany: !p.aboutCompany }))}
      />
      {layoutOpen.aboutCompany && (
        <div className="border border-[#E6E6E6] rounded-[4px] bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-3 h-[36px] border-b border-[#E6E6E6] text-[12px] text-[#333333]">
            <span className="font-[500]">B</span>
            <span className="italic">I</span>
            <span className="underline">U</span>
            <span className="mx-1 text-[#999999]">|</span>
            <span>Verdana</span>
            <span className="mx-1 text-[#999999]">|</span>
            <span>10</span>
            <span className="mx-1 text-[#999999]">|</span>
            <span>(1.2) Normal</span>
          </div>
          <textarea
            className="min-h-[140px] w-full px-3 py-2 text-[13px] text-[#333333] placeholder:text-[#999999] focus:outline-none"
            placeholder="About Company"
            value={layoutForm.aboutCompany}
            onChange={handleLayoutChange("aboutCompany")}
          />
        </div>
      )}

      <LayoutHeader
        title="Location"
        collapsed={!layoutOpen.location}
        onToggle={() => setLayoutOpen((p) => ({ ...p, location: !p.location }))}
      />
      {layoutOpen.location && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FloatingLabelInput
              label="Full Address"
              placeholder="e.g., 123 Business Way, Suite 500"
              value={layoutForm.fullAddress}
              onChange={handleLayoutChange("fullAddress")}
            />
          </div>
          <FloatingLabelInput
            label="City"
            placeholder="Search or Enter City"
            value={layoutForm.city}
            onChange={handleLayoutChange("city")}
          />
          <FloatingLabelInput
            label="State / Province"
            placeholder="Search or Add State / Province"
            value={layoutForm.state}
            onChange={handleLayoutChange("state")}
          />
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="Country"
              required
              placeholder="Search or Enter Country"
              value={layoutForm.country}
              onChange={handleLayoutChange("country")}
              className={cn(showLayoutErrors && !layoutForm.country.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.country.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Country is required.
              </span>
            )}
          </div>
          <FloatingLabelInput
            label="Postal Code"
            placeholder="Search or Enter Postal Code"
            value={layoutForm.postalCode}
            onChange={handleLayoutChange("postalCode")}
          />
        </div>
      )}

      <LayoutHeader
        title="Account Management & Billing"
        collapsed={!layoutOpen.accountManagement}
        onToggle={() => setLayoutOpen((p) => ({ ...p, accountManagement: !p.accountManagement }))}
      />
      {layoutOpen.accountManagement && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelSelect
              label="Account Status"
              placeholder="Select Account Status"
              options={[]}
              value={layoutForm.accountStatus}
              onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, accountStatus: value }))}
              className={cn(showLayoutErrors && !layoutForm.accountStatus.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.accountStatus.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Account Status is required.
              </span>
            )}
          </div>
          <div className="relative flex flex-col pb-[14px]">
            <FloatingLabelInput
              label="Account Owner"
              required
              placeholder="Search or Enter Account Owner"
              value={layoutForm.accountOwner}
              onChange={handleLayoutChange("accountOwner")}
              className={cn(showLayoutErrors && !layoutForm.accountOwner.trim() && "border-[#E53935] focus-visible:border-[#E53935] hover:border-[#E53935]")}
            />
            {showLayoutErrors && !layoutForm.accountOwner.trim() && (
              <span className="absolute left-0 bottom-0 text-[11px] text-[#E53935]">
                *Account Owner is required.
              </span>
            )}
          </div>
          <FloatingLabelSelect
            label="Source"
            placeholder="Select Source"
            options={[]}
            value={layoutForm.source}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, source: value }))}
          />
          <FloatingLabelSelect
            label="Billing Terms"
            placeholder="Select Billing Terms"
            options={[]}
            value={layoutForm.billingTerms}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, billingTerms: value }))}
          />
          <FloatingLabelInput
            label="Tax / VAT ID"
            placeholder="Add Tax / VAT ID"
            value={layoutForm.taxVatId}
            onChange={handleLayoutChange("taxVatId")}
          />
          <FloatingLabelInput
            label="EST. Revenue"
            placeholder="Add Estimated Annual Revenue"
            value={layoutForm.estRevenue}
            onChange={handleLayoutChange("estRevenue")}
          />
        </div>
      )}

      <LayoutHeader
        title="Contact Details"
        collapsed={!layoutOpen.contactDetails}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactDetails: !p.contactDetails }))}
      />
      {layoutOpen.contactDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            label="First Name"
            placeholder="e.g., Maria"
            value={layoutForm.contactFirstName}
            onChange={handleLayoutChange("contactFirstName")}
          />
          <FloatingLabelInput
            label="Last Name"
            placeholder="e.g., Lopez"
            value={layoutForm.contactLastName}
            onChange={handleLayoutChange("contactLastName")}
          />
          <FloatingLabelInput
            label="Title"
            placeholder="e.g., HR Director"
            value={layoutForm.contactTitle}
            onChange={handleLayoutChange("contactTitle")}
          />
          <FloatingLabelSelect
            label="Contact Type"
            placeholder="Select Contact Type"
            options={[]}
            value={layoutForm.contactType}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactType: value }))}
          />
          <FloatingLabelSelect
            label="Contact Stage"
            placeholder="Lead"
            options={[]}
            value={layoutForm.contactStage}
            onValueChange={(value) => setLayoutForm((prev) => ({ ...prev, contactStage: value }))}
          />
        </div>
      )}

      <LayoutHeader
        title="Contact Communication"
        collapsed={!layoutOpen.contactCommunication}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactCommunication: !p.contactCommunication }))}
      />
      {layoutOpen.contactCommunication && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            label="Email"
            placeholder="e.g., maria.lopez@example.com"
            value={layoutForm.contactEmail}
            onChange={handleLayoutChange("contactEmail")}
          />
          <FloatingLabelInput
            label="Phone Number"
            placeholder="e.g., +1 555-0123"
            value={layoutForm.contactPhone}
            onChange={handleLayoutChange("contactPhone")}
          />
          <FloatingLabelInput
            label="Alt. Email"
            placeholder="e.g., maria.lopez@example.com"
            value={layoutForm.contactAltEmail}
            onChange={handleLayoutChange("contactAltEmail")}
          />
        </div>
      )}

      <LayoutHeader
        title="Contact Social Links"
        collapsed={!layoutOpen.contactSocial}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactSocial: !p.contactSocial }))}
      />
      {layoutOpen.contactSocial && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            label="LinkedIn Profile"
            placeholder="www.linkedin.com/marialopez"
            value={layoutForm.contactLinkedin}
            onChange={handleLayoutChange("contactLinkedin")}
          />
          <FloatingLabelInput
            label="X Profile"
            placeholder="www.x.com/marialopez"
            value={layoutForm.contactX}
            onChange={handleLayoutChange("contactX")}
          />
          <FloatingLabelInput
            label="Facebook Profile"
            placeholder="www.facebook.com/marialopez"
            value={layoutForm.contactFacebook}
            onChange={handleLayoutChange("contactFacebook")}
          />
          <FloatingLabelInput
            label="Website"
            placeholder="http://www.example.com"
            value={layoutForm.contactWebsite}
            onChange={handleLayoutChange("contactWebsite")}
          />
        </div>
      )}

      <LayoutHeader
        title="Contact Address Info"
        collapsed={!layoutOpen.contactAddress}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactAddress: !p.contactAddress }))}
      />
      {layoutOpen.contactAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FloatingLabelInput
              label="Full Address"
              placeholder="e.g., 123 Wall St, Apt 4B"
              value={layoutForm.contactAddress}
              onChange={handleLayoutChange("contactAddress")}
            />
          </div>
          <FloatingLabelInput
            label="City"
            placeholder="Search or Enter City"
            value={layoutForm.contactCity}
            onChange={handleLayoutChange("contactCity")}
          />
          <FloatingLabelInput
            label="State / Province"
            placeholder="Search or Enter State"
            value={layoutForm.contactState}
            onChange={handleLayoutChange("contactState")}
          />
          <FloatingLabelInput
            label="Country"
            placeholder="Search or Enter Country"
            value={layoutForm.contactCountry}
            onChange={handleLayoutChange("contactCountry")}
          />
          <FloatingLabelInput
            label="Postal Code"
            placeholder="Search or Enter Postal Code"
            value={layoutForm.contactPostalCode}
            onChange={handleLayoutChange("contactPostalCode")}
          />
        </div>
      )}

      <LayoutHeader
        title="Contact Relationship"
        collapsed={!layoutOpen.contactRelationship}
        onToggle={() => setLayoutOpen((p) => ({ ...p, contactRelationship: !p.contactRelationship }))}
      />
      {layoutOpen.contactRelationship && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            label="Department"
            placeholder="e.g., Human Resources"
            value={layoutForm.contactDepartment}
            onChange={handleLayoutChange("contactDepartment")}
          />
          <FloatingLabelInput
            label="Manager"
            placeholder="e.g., John Doe - COO"
            value={layoutForm.contactManager}
            onChange={handleLayoutChange("contactManager")}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outlined"
          sx={outlineButtonSx}
          onClick={() => setShowLayoutErrors(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={primaryButtonSx}
          onClick={() => {
            if (!validateLayout()) {
              setShowLayoutErrors(true);
              return;
            }
            setShowLayoutErrors(false);
            console.warn("Add Company");
          }}
        >
          Add Company
        </Button>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col w-full">

      <TabsComponent
        tabs={[
          { label: "Fields", value: "fields", content: fieldsContent },
          { label: "Layout", value: "layout", content: layoutContent }
        ]}
      />
    </div>
  );
};

export default CompanyFields;

