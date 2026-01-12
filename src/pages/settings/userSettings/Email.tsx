import React from "react";
import { Button } from "@mui/material";

const CheckIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5.5L4.5 9L12.5 1" stroke="#57CC4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12C8 9.79086 9.79086 8 12 8H36C38.2091 8 40 9.79086 40 12V36C40 38.2091 38.2091 40 36 40H12C9.79086 40 8 38.2091 8 36V12Z" fill="#F4F0FF" stroke="#6E41E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12L24 24L40 12" stroke="#6E41E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Email: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full font-sans pb-10">



      <div className="bg-white border border-[#CCCCCC] rounded-lg shadow-[0px_4px_4px_0px_#00000014] p-10 flex flex-col items-center text-center">
        <div className="mb-6">
          <EnvelopeIcon />
        </div>

        <h2 className="text-[20px] font-[600] text-[#333333] mb-2">Connect Your Email Account</h2>
        <p className="text-[14px] text-[#717171] mb-8">Connect your email with pathfinder ats crm</p>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#6E41E2',
            textTransform: 'none',
            px: 4,
            py: 1,
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#5A35B8',
              boxShadow: 'none',
            }
          }}
        >
          Connect Your Email
        </Button>

        <div className="mt-12 w-full max-w-[500px] text-left">
          <h3 className="text-[15px] font-[500] text-[#333333] mb-6">Why you should connect your email account to Pathfinder ATS CRM?</h3>

          <ul className="flex flex-col gap-5">
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
    </div>
  );
};

export default Email;
