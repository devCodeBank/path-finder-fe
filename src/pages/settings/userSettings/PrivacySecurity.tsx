import React, { useState } from "react";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";


const Toggle = ({
  enabled,
  onChange,
  label,
  description,
  linkLabel,
  linkHref = "#"
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
  linkLabel?: string;
  linkHref?: string;
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F0F0F080] last:border-0">
      <div className="flex flex-col gap-1 pr-4">
        <span className="text-[14px] font-[500] text-[#333333]">{label}</span>
        {description && (
          <p className="text-[13px] font-[400] text-[#333333]/70 leading-relaxed">
            {description}
          </p>
        )}
        {linkLabel && (
          <a href={linkHref} className="text-[13px] text-[#6E41E2] hover:underline">
            {linkLabel}
          </a>
        )}
      </div>
      <div
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 outline-none",
          enabled ? "bg-[#57CC4D]" : "bg-[#CCCCCC]"
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
  const [phoneNumber, setPhoneNumber] = useState("64123456789");
  const [phoneInput, setPhoneInput] = useState("");
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [alternateEmail, setAlternateEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [newSigninAlert, setNewSigninAlert] = useState(false);
  const [thirdPartyAlert, setThirdPartyAlert] = useState(false);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);
  const outlineButtonSx = {
    height: "36px",
    backgroundColor: "#6E41E2",
    color: "#FFFFFF",
    textTransform: "none",
    fontSize: "12px",
    width: "129px",
    fontWeight: 500,
    padding: "inherit",
    borderRadius: "4px",
    boxShadow: "none",

    "&.Mui-disabled": {
      color: "#FFFFFF",
      backgroundColor: "#CCCCCC80",
      boxShadow: "none",
      opacity: 1
    },
    "&:hover": {
      backgroundColor: "#7B52F4",
      boxShadow: "none"
    }
  };

  return (
    <div className="flex flex-col gap-[18px] w-full max-w-full font-sans ">
      {/* Default Security Card */}
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px] w-full">
        <div className="px-4 h-[52px] w-full border-b border-[#CCCCCC80] flex items-center bg-[#F9FAFB]">
          <h3 className="text-[14px] font-[500] text-[#333333]">Default Security</h3>
        </div>

        <div className="px-5">
          {/* Email Row */}
          <div className="flex items-center justify-between py-4 border-b border-[#F0F0F080]">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Primary Email</span>
              <span className="text-[13px] font-[400] text-[#333333]/70">{primaryEmail}</span>
            </div>
          </div>

          {/* Password Row */}
          <div className="flex items-center justify-between py-4 border-b border-[#F0F0F080]">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Password</span>
              <p className="text-[13px] font-[400] text-[#333333]/70">*#0!x%&</p>
            </div>
            <Button variant="contained" sx={outlineButtonSx}>
              Change Password
            </Button>
          </div>

          {/* Recovery Codes Row */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-1 max-w-[70%]">
              <span className="text-[14px] font-[500] text-[#333333]">Recovery Codes</span>
              <p className="text-[13px] font-[400] text-[#333333]/70">
                If you lose access to your password or verification methods, you will be able to log in with a recovery code.
              </p>
              <a href="#" className="text-[13px] text-[#6E41E2] hover:underline mt-1">Learn More About Recovery Codes</a>
            </div>
            <Button variant="contained" sx={outlineButtonSx}>
              Show Codes
            </Button>
          </div>
        </div>
      </div>

      {/* Login Security Card */}
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px]">
        <div className="px-4 h-[52px] border-b border-[#CCCCCC80] flex items-center bg-[#F9FAFB]">
          <h3 className="text-[14px] font-[500] text-[#333333]">Login Security</h3>
        </div>
        <div className="px-5">
          <Toggle
            label="New Device Verification"
            description="Require additional verification step for logins from a new device or browser."
            linkLabel="Learn More"
            enabled={newDeviceVerification}
            onChange={setNewDeviceVerification}
          />
          <Toggle
            label="Two-Step Verification"
            description="Require a verification code when you log in with a password."
            linkLabel="Learn More"
            enabled={twoStepVerification}
            onChange={setTwoStepVerification}
          />
        </div>
      </div>

      {/* Verification Methods Card */}
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px]">
        <div className="px-4 h-[52px] border-b border-[#CCCCCC80] flex items-center bg-[#F9FAFB]">
          <h3 className="text-[14px] font-[500] text-[#333333]">Verification Methods</h3>
        </div>
        <div className="px-5">
          {/* Phone Number */}
          <div className="flex items-center justify-between py-4 border-b border-[#F0F0F080]">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Phone Number</span>
              <p className="text-[13px] font-[400] text-[#333333]/70">Require additional verification step for logins from a new device or browser.</p>
              {phoneNumber ? (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[13px] font-[500] text-[#333333]">{phoneNumber}</span>
                  <button
                    className="text-[13px] font-[500] text-[#6E41E2] hover:underline"
                    onClick={() => {
                      setPhoneNumber("");
                      setIsPhoneEditing(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ) : isPhoneEditing ? (
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(event) => setPhoneInput(event.target.value)}
                  placeholder="Enter phone number"
                  className="mt-2 w-[200px] h-[36px] rounded-md border border-[#CCCCCC80] px-3 text-[12px] text-[#333333] focus:outline-none focus:border-[#666666] hover:border-[#666666]"
                />
              ) : null}
            </div>
            <Button
              variant="contained"
              sx={outlineButtonSx}
              disabled={Boolean(phoneNumber) || (isPhoneEditing && phoneInput.trim().length === 0)}
              onClick={() => {
                if (!isPhoneEditing) {
                  setIsPhoneEditing(true);
                  return;
                }
                const nextPhone = phoneInput.trim();
                if (!nextPhone) {
                  return;
                }
                setPhoneNumber(nextPhone);
                setPhoneInput("");
                setIsPhoneEditing(false);
              }}
            >
              {isPhoneEditing ? "Save" : "Add Phone"}
            </Button>
          </div>

          {/* Alternate Emails */}
          <div className="flex items-center justify-between py-4 border-b border-[#F0F0F080]">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Alternate Emails</span>
              <p className="text-[13px] font-[400] text-[#333333]/70">Add alternate emails in addition to your default email to receive a verification code.</p>
              {alternateEmail ? (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[13px] font-[500] text-[#333333]">{alternateEmail}</span>
                  <button
                    className="text-[13px] font-[500] text-[#6E41E2] hover:underline"
                    onClick={() => {
                      setAlternateEmail("");
                      setIsEmailEditing(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ) : isEmailEditing ? (
                <input
                  type="email"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  placeholder="Enter Email Address"
                  className="mt-2 w-[240px] h-[36px] rounded-md border border-[#CCCCCC80] px-3 text-[12px] text-[#333333] focus:outline-none focus:border-[#666666] hover:border-[#666666]"
                />
              ) : null}
            </div>
            <Button
              variant="contained"
              sx={outlineButtonSx}
              disabled={Boolean(alternateEmail) || (isEmailEditing && emailInput.trim().length === 0)}
              onClick={() => {
                if (!isEmailEditing) {
                  setIsEmailEditing(true);
                  return;
                }
                const nextEmail = emailInput.trim();
                if (!nextEmail) {
                  return;
                }
                setAlternateEmail(nextEmail);
                setEmailInput("");
                setIsEmailEditing(false);
              }}
            >
              {isEmailEditing ? "Save" : "Add Email"}
            </Button>
          </div>

          {/* Authenticator App */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-[500] text-[#333333]">Authenticator App</span>
              <p className="text-[13px] font-[400] text-[#333333]/70">Set up an authenticator on your mobile device to receive verification code.</p>
            </div>
            <Button variant="contained" sx={outlineButtonSx}>
              Set Up App
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="bg-white border border-[#CCCCCC80] rounded-[4px]">
        <div className="px-4 h-[52px] border-b border-[#CCCCCC80] flex items-center bg-[#F9FAFB]">
          <h3 className="text-[14px] font-[500] text-[#333333]">Notifications</h3>
        </div>
        <div className="px-5">
          <Toggle
            label="New Sign-in to account alert"
            description="Receive email alerts whenever your account is signed in from a new device, browser, or location"
            enabled={newSigninAlert}
            onChange={setNewSigninAlert}
          />
          <Toggle
            label="Third-party app access alert"
            description="Receive email alerts whenever your account is accessed from a new third-party app or location. Example: IMAP/POP clients such as mail apps and calendar apps"
            enabled={thirdPartyAlert}
            onChange={setThirdPartyAlert}
          />
          <Toggle
            label="Newsletter Subscription"
            description="Receive marketing communication regarding pathfinder products, services, and events from pathfinder and its regional partners."
            enabled={newsletterSubscription}
            onChange={setNewsletterSubscription}
          />
        </div>
      </div>

    </div>
  );
};

export default PrivacySecurity;
