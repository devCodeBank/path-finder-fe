import React, { useState } from "react";
import { cn } from "@/lib/utils";

const Toggle = ({
  enabled,
  onChange
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) => {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 outline-none",
        enabled ? "bg-[#57CC4D]" : "bg-[#CCCCCC]"
      )}
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
};

const PreferenceCard = ({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC] rounded-lg p-6 flex items-center justify-between">
      <div className="flex flex-col gap-1 max-w-[70%]">
        <h4 className="text-[14px] font-[500] text-[#333333]">{title}</h4>
        <p className="text-[13px] font-[400] text-[#333333] leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
};

export const Prefrence: React.FC = () => {
  const [dateFormat, setDateFormat] = useState("DD/MM/YY");
  const [newSigninAlert, setNewSigninAlert] = useState(false);
  const [thirdPartyAlert, setThirdPartyAlert] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full font-sans pb-10">
      <PreferenceCard
        title="Date Format"
        description="Select the date and time format to be used for your pathfinder account activity"
      >
        <div className="inline-flex items-center gap-4 h-[32px] rounded-md border border-[#CCCCCC] px-3 text-[12px] text-[#333333] hover:border-[#666666] hover:bg-[#EAEAEA]/25 focus-within:border-[#666666]">
          <select
            value={dateFormat}
            onChange={(event) => setDateFormat(event.target.value)}
            className="bg-transparent focus:outline-none appearance-none cursor-pointer"
          >
            <option value="DD/MM/YY">DD/MM/YY</option>
            <option value="MM/DD/YY">MM/DD/YY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
          <span className="text-[12px] text-[#333333]">11/12/25</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </PreferenceCard>

      <PreferenceCard
        title="New Sign-in to account alert"
        description="Receive email alerts whenever your account is signed in from a new device, browser, or location"
      >
        <Toggle enabled={newSigninAlert} onChange={setNewSigninAlert} />
      </PreferenceCard>

      <PreferenceCard
        title="Third-party app access alert"
        description="Receive email alerts whenever your account is accessed from a new third-party app or location. Example: IMAP/POP clients such as mail apps and calendar apps"
      >
        <Toggle enabled={thirdPartyAlert} onChange={setThirdPartyAlert} />
      </PreferenceCard>

      <PreferenceCard
        title="Newsletter Subscription"
        description="Receive marketing communication regarding pathfinder products, services, and events from pathfinder and its regional partners."
      >
        <Toggle enabled={newsletter} onChange={setNewsletter} />
      </PreferenceCard>
    </div>
  );
};

export default Prefrence;
