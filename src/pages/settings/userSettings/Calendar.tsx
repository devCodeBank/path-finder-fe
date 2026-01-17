import React from "react";
import { Button } from "@mui/material";
import GoogleCalendarIcon from "@assets/icons/g-calendar.svg?react";
import OutlookCalendarIcon from "@assets/icons/outlook-calendar-icon.svg?react";

const IntegrationCard = ({
  icon: Icon,
  title,
  description,
  onConnect
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  onConnect: () => void;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC] rounded-lg p-6 flex items-center justify-between">
      <div className="flex gap-4">
        <div className="mt-1">
          <Icon className="h-12 w-12" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[15px] font-[500] text-[#333333]">{title}</h4>
          <p className="text-[13px] font-[400] text-[#333333] leading-relaxed max-w-[400px]">{description}</p>
        </div>
      </div>
      <Button
        variant="outlined"
        onClick={onConnect}
        sx={{
          height: "36px",
          borderColor: "#CCCCCC",
          color: "#333333",
          textTransform: "none",
          fontSize: "12px",
          width: "110px",
          fontWeight: 400,

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
        }}
      >
        Connect
      </Button>
    </div>
  );
};

export const Calendar: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full font-sans pb-10">


      <div className="grid grid-cols-1 gap-4">
        <IntegrationCard
          icon={GoogleCalendarIcon}
          title="Google Calendar"
          description="Sync your Google Calendar with pathfinder ats crm"
          onConnect={() => console.log("Connect Google")}
        />
        <IntegrationCard
          icon={OutlookCalendarIcon}
          title="Outlook Calendar"
          description="Sync your Outlook Calendar with pathfinder ats crm"
          onConnect={() => console.log("Connect Outlook")}
        />
      </div>
    </div>
  );
};

export default Calendar;
