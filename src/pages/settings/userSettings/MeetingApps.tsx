import React from "react";
import { Button } from "@mui/material";
import GoogleMeetIcon from "@assets/icons/meet.svg?react";
import TeamsIcon from "@assets/icons/thirdParty/teams-icon.svg?react";
import ZoomIcon from "@assets/icons/Zoom-meet.svg?react";

const IntegrationCard = ({
  icon: Icon,
  title,
  description,
  onConnect,
  buttonSx
}: {
  icon: React.FC;
  title: string;
  description: string;
  onConnect: () => void;
  buttonSx: object;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC] rounded-lg p-6 flex items-center justify-between">
      <div className="flex gap-4">
        <div className="mt-1">
          <Icon className="h-12 w-12" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[15px] font-[500] text-[#333333]">{title}</h4>
          <p className="text-[13px] font-[400] text-[#333333] leading-relaxed max-w-[500px]">{description}</p>
        </div>
      </div>
      <Button
        variant="outlined"
        onClick={onConnect}
        sx={buttonSx}
      >
        Connect
      </Button>
    </div>
  );
};

export const MeetingApps: React.FC = () => {
  const subtitle = "Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.";
  const outlineButtonSx = {
    height: "36px",
    borderColor: "#CCCCCC",
    color: "#333333",
    textTransform: "none",
    fontSize: "12px",
    width: "128px",
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
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full font-sans pb-10">
      <div className="flex flex-col gap-4">
        <h3 className="text-[16px] font-[500] text-[#333333] ml-1">Integrate Your Virtual Meeting Apps</h3>

        <div className="flex flex-col gap-4">
          <IntegrationCard
            icon={GoogleMeetIcon}
            title="Google Meet Integration"
            description={subtitle}
            onConnect={() => console.log("Connect Meet")}
            buttonSx={outlineButtonSx}
          />
          <IntegrationCard
            icon={TeamsIcon}
            title="Microsoft Teams Integration"
            description={subtitle}
            onConnect={() => console.log("Connect Teams")}
            buttonSx={outlineButtonSx}
          />
          <IntegrationCard
            icon={ZoomIcon}
            title="Zoom Integration"
            description={subtitle}
            onConnect={() => console.log("Connect Zoom")}
            buttonSx={outlineButtonSx}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingApps;
