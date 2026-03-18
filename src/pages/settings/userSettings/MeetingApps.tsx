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
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  onConnect: () => void;
  buttonSx: object;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC80] rounded-[4px] p-6 flex items-center justify-between">
      <div className="flex gap-4">
        <div className="mt-1">
          <Icon className="h-12 w-12" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[14px] font-[500] text-[#333333]">{title}</h4>
          <p className="text-[13px] font-[400] text-[#333333]/70 leading-relaxed max-w-[500px]">{description}</p>
        </div>
      </div>
      <Button variant="contained" onClick={onConnect} sx={buttonSx}>
        Connect
      </Button>
    </div>
  );
};

export const MeetingApps: React.FC = () => {
  const subtitle = "Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.";
  const outlineButtonSx = {
    height: "36px",
    backgroundColor: "#6E41E2",
    color: "#FFFFFF",
    textTransform: "none",
    fontSize: "12px",
    width: "110px",
    fontWeight: 500,
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
    <div className="flex flex-col gap-[18px] w-full max-w-full font-sans pb-10">
      <div className="flex flex-col gap-[18px]">
        {/* <h3 className="text-[16px] font-[500] text-[#333333] ml-1">Integrate Your Virtual Meeting Apps</h3> */}

        <div className="flex flex-col gap-[18px]">
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

