import GoogleMeetIcon from "@assets/icons/thirdParty/google-meet-icon.svg";
import TeamsIcon from "@assets/icons/thirdParty/teams-icon.svg";
import ZoomIcon from "@assets/icons/thirdParty/zoom-icon.svg";
import { IntegrationCard } from "@components/integrationCard";
import { SettingsHeader } from "@components/settingsHeader";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled(Typography)<TypographyProps>`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.semibold};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Cards = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const MeetingApps: React.FC = () => {
  const subtitle =
    "Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.";

  const handleConnectGoogleMeet = () => {
    console.warn("Connect Google Meet clicked");
  };

  const handleConnectTeams = () => {
    console.warn("Connect Microsoft Teams clicked");
  };

  const handleConnectZoom = () => {
    console.warn("Connect Zoom clicked");
  };

  return (
    <Container>
      <SettingsHeader title="Meeting Apps" />

      <SectionTitle variant="lg" component="h3">
        Integrate Your Virtual Meeting Apps
      </SectionTitle>

      <Cards>
        <IntegrationCard
          iconSrc={GoogleMeetIcon}
          iconAlt="Google Meet icon"
          title="Google Meet Integration"
          subtitle={subtitle}
          buttonText="Connect"
          onClick={handleConnectGoogleMeet}
        />

        <IntegrationCard
          iconSrc={TeamsIcon}
          iconAlt="Microsoft Teams icon"
          title="Microsoft Teams Integration"
          subtitle={subtitle}
          buttonText="Connect"
          onClick={handleConnectTeams}
        />

        <IntegrationCard
          iconSrc={ZoomIcon}
          iconAlt="Zoom icon"
          title="Zoom Integration"
          subtitle={subtitle}
          buttonText="Connect"
          onClick={handleConnectZoom}
        />
      </Cards>
    </Container>
  );
};

export default MeetingApps;
