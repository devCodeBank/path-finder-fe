import { Button } from "@components/buttons/button/Button";
import { DaySelector } from "@components/input/daySelector";
import { FormInput } from "@components/input/formInput";
import { TimeInput } from "@components/input/timeInput";
import { ToggleSwitch } from "@components/input/toggleSwitch";
import { SettingsHeader } from "@components/settingsHeader";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const Section = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const SectionTitle = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const DoNotDisturbContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

const TimeRangeContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const DaysOffSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const DaysOffLabel = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

const EmailSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const NotificationItem = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

interface NotificationSettings {
  doNotDisturb: boolean;
  doNotDisturbFrom: string;
  doNotDisturbTo: string;
  selectedDaysOff: number[];
  preferredEmail: string;
  notifications: {
    newJobPosted: boolean;
    newApplicant: boolean;
    mentionedInNote: boolean;
    noteAdded: boolean;
    addedToTeam: boolean;
    candidateBookedEvent: boolean;
    upcomingEventReminders: boolean;
    eventAccepted: boolean;
    eventDeclined: boolean;
    eventUpdated: boolean;
    eventDeleted: boolean;
    eventActivated: boolean;
    offerAccepted: boolean;
    offerDeclined: boolean;
  };
}

export const Notifications: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    doNotDisturb: false,
    doNotDisturbFrom: "00:00",
    doNotDisturbTo: "00:00",
    selectedDaysOff: [],
    preferredEmail: "abc@pathfinderatscrm.com",
    notifications: {
      newJobPosted: true,
      newApplicant: true,
      mentionedInNote: true,
      noteAdded: true,
      addedToTeam: true,
      candidateBookedEvent: true,
      upcomingEventReminders: true,
      eventAccepted: true,
      eventDeclined: true,
      eventUpdated: true,
      eventDeleted: true,
      eventActivated: true,
      offerAccepted: true,
      offerDeclined: true,
    },
  });

  const handleDoNotDisturbChange = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      doNotDisturb: checked,
    }));
  };

  const handleTimeChange = (field: "doNotDisturbFrom" | "doNotDisturbTo") => (value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDaysOffChange = (selectedDays: number[]) => {
    setSettings((prev) => ({
      ...prev,
      selectedDaysOff: selectedDays,
    }));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      preferredEmail: event.target.value,
    }));
  };

  const handleNotificationToggle = (key: keyof NotificationSettings["notifications"]) => (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }));
  };

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.warn("Saving notification settings:", settings);
  };

  return (
    <Container>
      <SettingsHeader title="Notifications" />

      <Section>
        <SectionTitle>Do Not Disturb</SectionTitle>
        <DoNotDisturbContainer>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.doNotDisturb}
                onChange={(e) => handleDoNotDisturbChange(e.target.checked)}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
              />
            }
            label="Do not notify me from:"
            sx={{ marginRight: 0 }}
          />
          <TimeRangeContainer>
            <TimeInput
              value={settings.doNotDisturbFrom}
              onChange={handleTimeChange("doNotDisturbFrom")}
              disabled={!settings.doNotDisturb}
            />
            <Typography variant="md">To:</Typography>
            <TimeInput value={settings.doNotDisturbTo} onChange={handleTimeChange("doNotDisturbTo")} disabled={!settings.doNotDisturb} />
          </TimeRangeContainer>
        </DoNotDisturbContainer>

        <DaysOffSection>
          <DaysOffLabel>Do not disturb me on my days off</DaysOffLabel>
          <DaySelector selectedDays={settings.selectedDaysOff} onChange={handleDaysOffChange} />
        </DaysOffSection>
      </Section>

      <Section>
        <SectionTitle>Email Notifications</SectionTitle>
        <Box style={{ marginBottom: 24, width: "400px" }}>
          <FormInput label="Preferred email" value={settings.preferredEmail} onChange={handleEmailChange} type="email" />
        </Box>

        <EmailSection>
          <Typography variant="lg" style={{ marginBottom: 16, fontWeight: 500 }}>
            Send email and push notifications for:
          </Typography>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.newJobPosted}
              onChange={handleNotificationToggle("newJobPosted")}
              label="Receive emails when a new job is posted in a team you are a member of."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.newApplicant}
              onChange={handleNotificationToggle("newApplicant")}
              label="Receive emails when you get a new applicant for a job within a team you are a member of."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.mentionedInNote}
              onChange={handleNotificationToggle("mentionedInNote")}
              label="Receive emails when when you are mentioned by a team member in a note."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.noteAdded}
              onChange={handleNotificationToggle("noteAdded")}
              label="Receive emails when a team member adds a note."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.addedToTeam}
              onChange={handleNotificationToggle("addedToTeam")}
              label="Receive emails when you are added to a new team."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.candidateBookedEvent}
              onChange={handleNotificationToggle("candidateBookedEvent")}
              label="Receive emails when a candidate books an event slot for an event you are attending."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.upcomingEventReminders}
              onChange={handleNotificationToggle("upcomingEventReminders")}
              label="Receive email reminders for upcoming events you are attending."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.eventAccepted}
              onChange={handleNotificationToggle("eventAccepted")}
              label="Receive emails when an event you are attending is accepted by a candidate."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.eventDeclined}
              onChange={handleNotificationToggle("eventDeclined")}
              label="Receive emails when an event you are attending is declined by a candidate."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.eventUpdated}
              onChange={handleNotificationToggle("eventUpdated")}
              label="Receive emails when an event is updated."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.eventDeleted}
              onChange={handleNotificationToggle("eventDeleted")}
              label="Receive emails when an event you are attending is deleted."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.eventActivated}
              onChange={handleNotificationToggle("eventActivated")}
              label="Receive emails when an event you are attending is activated."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.offerAccepted}
              onChange={handleNotificationToggle("offerAccepted")}
              label="Receive emails when an offer is accepted by a candidate within a team you are a member of."
            />
          </NotificationItem>

          <NotificationItem>
            <ToggleSwitch
              checked={settings.notifications.offerDeclined}
              onChange={handleNotificationToggle("offerDeclined")}
              label="Receive emails when an offer is declined by a candidate within a team you are a member of."
            />
          </NotificationItem>
        </EmailSection>
      </Section>

      <ButtonContainer>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </ButtonContainer>
    </Container>
  );
};

export default Notifications;
