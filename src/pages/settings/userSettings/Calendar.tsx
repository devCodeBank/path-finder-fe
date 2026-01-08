import GoogleCalendarIcon from "@assets/icons/thirdParty/google-calendar-icon.svg";
import OutlookCalendarIcon from "@assets/icons/thirdParty/outlook-calendar-icon.svg";
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

export const Calendar: React.FC = () => {
  const handleConnectGoogle = () => {
    console.warn("Connect Google Calendar clicked");
  };

  const handleConnectOutlook = () => {
    console.warn("Connect Outlook Calendar clicked");
  };

  return (
    <Container>
      <SettingsHeader title="Calendar" />

      <SectionTitle variant="lg" component="h3">
        Connect Your Calendar
      </SectionTitle>

      <Cards>
        <IntegrationCard
          iconSrc={GoogleCalendarIcon}
          iconAlt="Google Calendar icon"
          title="Google Calendar"
          subtitle="Sync your Google Calendar with pathfinder ats crm"
          buttonText="Connect"
          onClick={handleConnectGoogle}
        />

        <IntegrationCard
          iconSrc={OutlookCalendarIcon}
          iconAlt="Outlook Calendar icon"
          title="Outlook Calendar"
          subtitle="Sync your Outlook Calendar with pathfinder ats crm"
          buttonText="Connect"
          onClick={handleConnectOutlook}
        />
      </Cards>
    </Container>
  );
};

export default Calendar;
