import React from "react";
import { Button } from "@mui/material";
import EnvelopeIcon from "@assets/icons/envelope.svg?react";

const CheckIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5.5L4.5 9L12.5 1" stroke="#57CC4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Email: React.FC = () => {
  const outlineButtonSx = {
    height: "36px ",
    borderColor: "#CCCCCC",
    color: "#333333",
    textTransform: "none",
    fontSize: "12px",
    width: "110px",
    fontWeight: 400,
    borderRadius: "4px",

    boxShadow: "none",
    "&.Mui-disabled": {
      color: "#CCCCCC",
      boxShadow: "none",
      opacity: 1
    },
    "&.MuiButton-outlined.Mui-disabled": {
      borderColor: "#CCCCCC !important",
      border: "1px solid #CCCCCC"
    },
    "&:hover": {
      borderColor: "#CCCCCC",
      backgroundColor: "#EAEAEA",
      boxShadow: "none"
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full font-sans pb-10">
      <div className="bg-white border border-[#CCCCCC] rounded-[4px] p-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <EnvelopeIcon className="h-18 w-14" />
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-[500] text-[#333333]">Email</h2>
            <p className="text-[13px] font-[400] text-[#333333]">Connect your email with pathfinder ats crm</p>
          </div>
        </div>
        <Button variant="outlined" sx={outlineButtonSx}>
          Connect
        </Button>
      </div>

      <div className="bg-white border border-[#CCCCCC] rounded-[4px] p-6">
        <ul className="flex flex-col gap-4">
          {[
            "Manage all your communication directly from one platform.",
            "Emails auto-link to profiles.",
            "Parse resumes from email.",
            "Get email open notifications.",
            "Emails sync automatically (e.g., every couple of hours).",
            "Full control, disconnect anytime."
          ].map((benefit, i) => (
            <li key={i} className="flex items-center gap-3 text-[13px] text-[#333333]">
              <CheckIcon />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Email;
