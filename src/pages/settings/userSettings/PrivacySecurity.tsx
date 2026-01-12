import React, { useState } from "react";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";

const Toggle = ({
  enabled,
  onChange,
  label,
  description
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-[#F0F0F0] last:border-0">
      <div className="flex flex-col gap-1 pr-4">
        <span className="text-[14px] font-[500] text-[#333333]">{label}</span>
        {description && (
          <p className="text-[13px] font-[400] text-[#717171] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 outline-none mt-1",
          enabled ? "bg-[#6E41E2]" : "bg-[#CCCCCC]"
        )}
        onClick={() => onChange(!enabled)}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
            enabled ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </div>
    </div>
  );
};

export const PrivacySecurity: React.FC = () => {
  const [newDeviceVerification, setNewDeviceVerification] = useState(false);
  const [twoStepVerification, setTwoStepVerification] = useState(false);
  const [primaryEmail] = useState("username@example.com");

  return (
    <div className="flex flex-col gap-6 w-full max-w-full font-sans pb-10">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-[400] text-[#717171] mb-2 px-1">
        <span>Settings</span>
        <span className="text-[10px]">→</span>
        <span>User Settings</span>
        <span className="text-[10px]">→</span>
        <span className="text-[#333333] font-[500]">Privacy & Security</span>
      </div>

      {/* Default Security Card */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg shadow-[0px_4px_4px_0px_#00000014]">
        <div className="px-5 py-4 border-b border-[#CCCCCC]">
          <h3 className="text-[15px] font-[500] text-[#333333]">Default Security</h3>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Email Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Primary Email</span>
              <span className="text-[13px] font-[400] text-[#717171]">{primaryEmail}</span>
            </div>
          </div>

          {/* Password Row */}
          <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Password</span>
              <p className="text-[13px] font-[400] text-[#717171]">Change your password</p>
            </div>
            <Button
              variant="outlined"
              sx={{
                height: '32px',
                borderColor: '#CCCCCC',
                color: '#333333',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#6E41E2',
                  backgroundColor: 'rgba(110, 65, 226, 0.04)',
                }
              }}
            >
              Change Password
            </Button>
          </div>

          {/* Recovery Codes Row */}
          <div className="flex items-start justify-between border-t border-[#F0F0F0] pt-6">
            <div className="flex flex-col gap-1 max-w-[70%]">
              <span className="text-[14px] font-[500] text-[#333333]">Recovery Codes</span>
              <p className="text-[13px] font-[400] text-[#717171]">
                If you lose access to your password or verification methods, you will be able to log in with a recovery code.
              </p>
              <a href="#" className="text-[13px] text-[#6E41E2] hover:underline mt-1">Learn More About Recovery Codes</a>
            </div>
            <Button
              variant="outlined"
              sx={{
                height: '32px',
                borderColor: '#CCCCCC',
                color: '#333333',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#6E41E2',
                  backgroundColor: 'rgba(110, 65, 226, 0.04)',
                }
              }}
            >
              Show Codes
            </Button>
          </div>
        </div>
      </div>

      {/* Login Security Card */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg shadow-[0px_4px_4px_0px_#00000014]">
        <div className="px-5 py-4 border-b border-[#CCCCCC]">
          <h3 className="text-[15px] font-[500] text-[#333333]">Login Security</h3>
        </div>
        <div className="px-5">
          <Toggle
            label="New Device Verification"
            description="Require additional verification step for logins from a new device or browser. Learn More"
            enabled={newDeviceVerification}
            onChange={setNewDeviceVerification}
          />
          <Toggle
            label="Two-Step Verification"
            description="Require a verification code when you log in with a password. Learn More"
            enabled={twoStepVerification}
            onChange={setTwoStepVerification}
          />
        </div>
      </div>

      {/* Verification Methods Card */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg shadow-[0px_4px_4px_0px_#00000014]">
        <div className="px-5 py-4 border-b border-[#CCCCCC]">
          <h3 className="text-[15px] font-[500] text-[#333333]">Verification Methods</h3>
        </div>
        <div className="p-5 flex flex-col gap-6">
          {/* Phone Number */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Phone Number</span>
              <p className="text-[13px] font-[400] text-[#717171]">Require additional verification step for logins from a new device or browser.</p>
              <span className="text-[13px] font-[500] text-[#333333] mt-2">64123456789</span>
            </div>
            <button className="text-[13px] font-[500] text-[#6E41E2] hover:underline">Add Phone</button>
          </div>

          {/* Alternate Emails */}
          <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Alternate Emails</span>
              <p className="text-[13px] font-[400] text-[#717171]">Add alternate emails in addition to your default email to receive a verification code.</p>
            </div>
            <button className="text-[13px] font-[500] text-[#6E41E2] hover:underline">Add Email</button>
          </div>

          {/* Authenticator App */}
          <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Authenticator App</span>
              <p className="text-[13px] font-[400] text-[#717171]">Set up an authenticator on your mobile device to receive verification code.</p>
            </div>
            <button className="text-[13px] font-[500] text-[#6E41E2] hover:underline">Set Up App</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrivacySecurity;
