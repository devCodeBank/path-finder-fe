import React from "react";
import { Button } from "@mui/material";

const GoogleMeetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#00897B" />
  </svg>
);

const TeamsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#6264A7" />
  </svg>
);

const ZoomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#2D8CFF" />
  </svg>
);

const IntegrationCard = ({
  icon: Icon,
  title,
  description,
  onConnect
}: {
  icon: React.FC;
  title: string;
  description: string;
  onConnect: () => void;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC] rounded-lg p-5 shadow-[0px_4px_4px_0px_#00000014] flex justify-between items-start">
      <div className="flex gap-4">
        <div className="mt-1">
          <Icon />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[15px] font-[500] text-[#333333]">{title}</h4>
          <p className="text-[13px] text-[#717171] leading-relaxed max-w-[500px]">{description}</p>
        </div>
      </div>
      <Button
        variant="outlined"
        onClick={onConnect}
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
        Connect
      </Button>
    </div>
  );
};

export const MeetingApps: React.FC = () => {
  const subtitle = "Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.";

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
          />
          <IntegrationCard
            icon={TeamsIcon}
            title="Microsoft Teams Integration"
            description={subtitle}
            onConnect={() => console.log("Connect Teams")}
          />
          <IntegrationCard
            icon={ZoomIcon}
            title="Zoom Integration"
            description={subtitle}
            onConnect={() => console.log("Connect Zoom")}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingApps;
