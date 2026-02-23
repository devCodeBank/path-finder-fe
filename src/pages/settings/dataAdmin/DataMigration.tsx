import BrandLogoIcon from "@assets/logos/brand-logo.svg?react";
import SearchCircleIcon from "@assets/icons/search-circle.svg?react";
import BrowserMaximizeIcon from "@assets/icons/Icon-browser-maximize.svg?react";
import ScrollRightHiringPipelineIcon from "@assets/icons/scroll-right-hiring-pipeline.svg?react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Button, Tooltip } from "@mui/material";
import React from "react";

import { FloatingLabelInput, FloatingLabelSelect } from "@/components/floatingLabelInput";
import TabsComponent from "@/components/tabs/TabsComponent";

const DataMigration: React.FC = () => {
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = React.useState(false);
  const [isSupportOpen, setIsSupportOpen] = React.useState(false);
  const [supportCountry, setSupportCountry] = React.useState("");
  const [supportUsersToMigrate, setSupportUsersToMigrate] = React.useState("");

  const migrationContent = (
    <div className="rounded-[6px]  border-[#CCCCCC80] p-4">
      <div className="rounded-[6px] bg-[#f9fafb] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-[2px] inline-flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#6E41E2] text-white">
              <ScrollRightHiringPipelineIcon width={24} height={24} />
            </span>
            <p className="mt-1 text-[13px] text-[#333333] text-center md:text-left">
              Before starting the data migration, ensure that all custom fields are created in your Pathfinder ATS CRM account to
              match your existing data structure.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[14px] text-[#6E41E2] hover:underline cursor-pointer"
            onClick={() => setIsKnowledgeBaseOpen(true)}
          >
            Learn more
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>

        <button
          type="button"
          className="mt-4 ml-9 h-[36px] rounded-[4px] bg-[#6E41E2] px-4 text-[14px] font-[500] text-white hover:bg-[#7B52F4] cursor-pointer"
          onClick={() => setIsSupportOpen(true)}
        >
          Need help? Contact Us
        </button>
      </div>

      <div className="mt-6 rounded-[6px] border border-[#CCCCCC80] px-6 pb-4 min-h-[520px]">
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex h-[220px] flex-col items-center justify-center rounded-[6px] border border-[#CCCCCC80] bg-white text-center">
            <span className="inline-flex h-[51px] w-[51px] items-center justify-center">
              <BrandLogoIcon width={51} height={51} />
            </span>
            <p className="mt-4 text-[16px] font-[500] text-[#333333]">Pathfinder ATS CRM</p>
            <button type="button" className="mt-4 bg-[#F9FAFB] text-[13px] text-[#6E41E2] rounded-[4px] cursor-pointer">
              Start Migration
            </button>
          </div>

          <div className="flex h-[220px] flex-col items-center justify-center rounded-[6px] border border-[#CCCCCC80] bg-white text-center">
            <span className="inline-flex h-[51px] w-[51px] items-center justify-center">
              <SearchCircleIcon width={51} height={51} />
            </span>
            <p className="mt-4 text-[16px] font-[500] text-[#333333]">Other ATS</p>
            <button type="button" className="mt-4 text-[13px] bg-[#F9FAFB] text-[#6E41E2] rounded-[4px] cursor-pointer">
              Start Migration
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const historyContent = (
    <div className="rounded-[6px] border border-[#CCCCCC80] min-h-[520px] p-4 mt-6">
      <div className="rounded-[6px] bg-[#F9FAFB] min-h-[180px] flex flex-col items-center justify-center text-center px-4">
        <span className="inline-flex h-[30px] w-[30px] items-center justify-center">
          <ScrollRightHiringPipelineIcon width={30} height={30} />
        </span>
        <p className="mt-4 text-[16px] font-[500] text-[#333333]">No recent import found</p>
        <p className="mt-3 text-[13px] text-[#666666]">
          Your data migration history will appear here once you initiate your first import.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-2">
        <div className="rounded-[10px]  border-[#CCCCCC80] bg-white ">
          <TabsComponent
            tabs={[
              { label: "Data Migration", value: "migration", content: migrationContent },
              { label: "Import History", value: "history", content: historyContent },
            ]}
            defaultTab="migration"
          />
        </div>
      </div>

      {isKnowledgeBaseOpen && (
        <div className="fixed inset-0 z-[2600] flex">
          <button
            type="button"
            aria-label="Close knowledge base"
            className="h-full flex-1 bg-[#00000066] cursor-pointer"
            onClick={() => setIsKnowledgeBaseOpen(false)}
          />

          <div className="h-full w-full max-w-[720px] bg-white border-l border-[#D9D9D9] shadow-[-10px_0px_20px_0px_#00000014]">
            <div className="flex items-center justify-between px-4 py-5 border-b border-[#E6E6E6]">
              <p className="text-[16px]  font-[500] text-[#333333]">Knowledge Base</p>
              <Tooltip
                title="Close"


                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 3000 } }
                }}
              >
                <button
                  type="button"
                  className="inline-flex h-[28px] w-[28px] items-center justify-center text-[#666666] hover:text-[#333333] cursor-pointer"
                  onClick={() => setIsKnowledgeBaseOpen(false)}
                  aria-label="Close panel"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </button>
              </Tooltip>
            </div>

            <div className="p-4">
              <div className="flex h-[42px] items-center gap-2 rounded-[4px] border border-[#CCCCCC] px-3 hover:text-[#333333] hover:border-[#333333] focus:text-[#333333] focus:border-[#333333]">
                <SearchOutlinedIcon sx={{ fontSize: 20, color: "#777777" }} />
                <input
                  type="text"
                  className="w-full bg-transparent text-[14px] text-[#333333] outline-none "
                  placeholder="Search articles"
                />
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-2">
                  <p className="text-[16px]  font-[500] text-[#333333]">Data Migration</p>
                  <button type="button" className="inline-flex text-[#666666] hover:text-[#333333] cursor-pointer" aria-label="Open article">
                    <BrowserMaximizeIcon width={16} height={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="mt-5 flex h-[42px] w-full items-center justify-between rounded-[4px] bg-[#F7F7F7] px-4 text-[13px] text-[#333333] cursor-pointer"
                >
                  <span>Table of contents</span>
                  <KeyboardArrowDownIcon sx={{ fontSize: 20, color: "#666666" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSupportOpen && (
        <div className="fixed inset-0 z-[2200] flex">
          <button
            type="button"
            aria-label="Close migration support"
            className="h-full flex-1 bg-[#00000066] cursor-pointer"
            onClick={() => setIsSupportOpen(false)}
          />

          <div className="h-full w-full max-w-[720px] bg-white border-l border-[#D9D9D9] shadow-[-10px_0px_20px_0px_#00000014] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-5 border-b border-[#E6E6E6]">
              <p className=" text-[16px] font-[500] text-[#333333]">Migration Support</p>
              <Tooltip
                title="Close"
                arrow
                componentsProps={{
                  tooltip: { sx: { bgcolor: "#797979" } },
                  arrow: { sx: { color: "#797979" } },
                  popper: { sx: { zIndex: 3000 } }
                }}
              >
                <button
                  type="button"
                  className="inline-flex h-[28px] w-[28px] items-center justify-center text-[#666666] hover:text-[#333333] cursor-pointer"
                  onClick={() => setIsSupportOpen(false)}
                  aria-label="Close migration support panel"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </button>
              </Tooltip>
            </div>

            <div className="px-4 py-5">
              <p className="text-[16px] text-[#666666]">Your Information</p>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FloatingLabelInput
                    label="First Name"
                    placeholder="Add First Name"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div>
                  <FloatingLabelInput
                    label="Last Name"
                    placeholder="Add Last Name"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div>
                  <FloatingLabelInput
                    label="Email"
                    type="email"
                    placeholder="Add Email"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div>
                  <FloatingLabelInput
                    label="Phone Number"
                    placeholder="Add Phone Number"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div>
                  <FloatingLabelInput
                    label="Company"
                    defaultValue="Acme Corporation"
                    placeholder="Add Company"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div>
                  <FloatingLabelSelect
                    label="Country"
                    value={supportCountry}
                    onValueChange={setSupportCountry}
                    options={[
                      { value: "af", label: "Afghanistan" },
                      { value: "al", label: "Albania" },
                      { value: "dz", label: "Algeria" },
                      { value: "ar", label: "Argentina" },
                      { value: "au", label: "Australia" },
                      { value: "at", label: "Austria" },
                      { value: "bd", label: "Bangladesh" },
                      { value: "be", label: "Belgium" },
                      { value: "br", label: "Brazil" },
                      { value: "ca", label: "Canada" },
                      { value: "cl", label: "Chile" },
                      { value: "cn", label: "China" },
                      { value: "co", label: "Colombia" },
                      { value: "dk", label: "Denmark" },
                      { value: "eg", label: "Egypt" },
                      { value: "fi", label: "Finland" },
                      { value: "fr", label: "France" },
                      { value: "de", label: "Germany" },
                      { value: "gr", label: "Greece" },
                      { value: "hk", label: "Hong Kong" },
                      { value: "in", label: "India" },
                      { value: "id", label: "Indonesia" },
                      { value: "ie", label: "Ireland" },
                      { value: "il", label: "Israel" },
                      { value: "it", label: "Italy" },
                      { value: "jp", label: "Japan" },
                      { value: "ke", label: "Kenya" },
                      { value: "my", label: "Malaysia" },
                      { value: "mx", label: "Mexico" },
                      { value: "ma", label: "Morocco" },
                      { value: "nl", label: "Netherlands" },
                      { value: "nz", label: "New Zealand" },
                      { value: "ng", label: "Nigeria" },
                      { value: "no", label: "Norway" },
                      { value: "pk", label: "Pakistan" },
                      { value: "pe", label: "Peru" },
                      { value: "ph", label: "Philippines" },
                      { value: "pl", label: "Poland" },
                      { value: "pt", label: "Portugal" },
                      { value: "qa", label: "Qatar" },
                      { value: "ro", label: "Romania" },
                      { value: "sa", label: "Saudi Arabia" },
                      { value: "sg", label: "Singapore" },
                      { value: "za", label: "South Africa" },
                      { value: "kr", label: "South Korea" },
                      { value: "es", label: "Spain" },
                      { value: "lk", label: "Sri Lanka" },
                      { value: "se", label: "Sweden" },
                      { value: "ch", label: "Switzerland" },
                      { value: "tw", label: "Taiwan" },
                      { value: "th", label: "Thailand" },
                      { value: "tr", label: "Turkey" },
                      { value: "ae", label: "United Arab Emirates" },
                      { value: "gb", label: "United Kingdom" },
                      { value: "us", label: "United States" },
                      { value: "vn", label: "Vietnam" },
                    ]}
                    placeholder="Choose Country"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#E6E6E6] px-4 py-5">
              <p className="text-[16px] text-[#666666]">Migration Details</p>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FloatingLabelInput
                    label="Current ATS Vendor (Source Software)"
                    placeholder="e.g. Greenhouse, Zoho"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div>
                  <FloatingLabelSelect
                    label="No. of Users to Migrate"
                    value={supportUsersToMigrate}
                    onValueChange={setSupportUsersToMigrate}
                    options={[
                      { value: "lt-5", label: "Less than 5" },
                      { value: "5-10", label: "5 - 10" },
                      { value: "10-15", label: "10 - 15" },
                      { value: "15-20", label: "15 - 20" },
                      { value: "20-25", label: "20 - 25" },
                      { value: "25-30", label: "25 - 30" },
                      { value: "30-35", label: "30 - 35" },
                      { value: "35-40", label: "35 - 40" },
                      { value: "40-45", label: "40 - 45" },
                      { value: "45-50", label: "45 - 50" },
                      { value: "50-55", label: "50 - 55" },
                      { value: "55-60", label: "55 - 60" },
                      { value: "60-65", label: "60 - 65" },
                      { value: "65-70", label: "65 - 70" },
                      { value: "70-75", label: "70 - 75" },
                      { value: "75-80", label: "75 - 80" },
                      { value: "80-85", label: "80 - 85" },
                      { value: "85-90", label: "85 - 90" },
                      { value: "90-95", label: "90 - 95" },
                      { value: "95-100", label: "95 - 100" },
                      { value: "100-plus", label: "100 +" },
                    ]}
                    placeholder="Select No. of Users"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div className="md:col-span-2">
                  <FloatingLabelInput
                    label="Expected Timeline"
                    placeholder="e.g. One Week"
                    className="h-[32px] rounded-[4px] border-[#CCCCCC] text-[13px]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[16px] text-[#666666]">Specific Requirements / Description</label>
                  <textarea
                    rows={6}
                    placeholder="Describe any custom field concerns or specific data needs..."
                    className="w-full rounded-[4px] border border-[#CCCCCC] px-3 py-2 text-[13px] outline-none resize-none"
                  />
                </div>
              </div>
              <div className="px-4 py-4  border-[#CCCCCC80] flex justify-end gap-3">
                <Button
                  variant="outlined"
                  onClick={() => setIsSupportOpen(false)}
                  sx={{
                    height: "36px",
                    borderColor: "#CCCCCC80",
                    color: "#333333",
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    borderRadius: "4px",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#CCCCCC80",
                      backgroundColor: "#F3F4F6",
                      boxShadow: "none",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
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
                  Submit Migration Request
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataMigration;
