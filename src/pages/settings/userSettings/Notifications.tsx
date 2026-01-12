import React, { useState } from "react";
import { Button } from "@mui/material";
import { FloatingLabelInput } from "@/components/floatingLabelInput";
import { cn } from "@/lib/utils";

const NotificationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0893 7.33301C12.4767 10.9163 14 11.9997 14 11.9997H2C2 11.9997 4 10.5777 4 5.59967C4 4.46834 4.42133 3.38301 5.17133 2.58301C5.92133 1.78301 6.94 1.33301 8 1.33301C8.22533 1.33301 8.44756 1.35301 8.66667 1.39301M9.15333 13.9997C9.03613 14.2017 8.8679 14.3694 8.66548 14.486C8.46307 14.6026 8.23359 14.664 8 14.664C7.76641 14.664 7.53693 14.6026 7.33452 14.486C7.13211 14.3694 6.96387 14.2017 6.84667 13.9997M12.6667 5.33301C13.1971 5.33301 13.7058 5.12229 14.0809 4.74722C14.456 4.37215 14.6667 3.86344 14.6667 3.33301C14.6667 2.80257 14.456 2.29387 14.0809 1.91879C13.7058 1.54372 13.1971 1.33301 12.6667 1.33301C12.1362 1.33301 11.6275 1.54372 11.2525 1.91879C10.8774 2.29387 10.6667 2.80257 10.6667 3.33301C10.6667 3.86344 10.8774 4.37215 11.2525 4.74722C11.6275 5.12229 12.1362 5.33301 12.6667 5.33301Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface NotificationSettings {
  doNotDisturb: boolean;
  doNotDisturbFrom: string;
  doNotDisturbTo: string;
  selectedDaysOff: string[];
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Toggle = ({
  enabled,
  onChange,
  label
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string
}) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!enabled)}>
      <div
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 outline-none",
          enabled ? "bg-[#6E41E2]" : "bg-[#CCCCCC]"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
            enabled ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </div>
      <span className="text-[13px] font-[400] text-[#333333] group-hover:text-[#000000] transition-colors">
        {label}
      </span>
    </div>
  );
};

export const Notifications: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    doNotDisturb: true,
    doNotDisturbFrom: "17:00",
    doNotDisturbTo: "08:00",
    selectedDaysOff: ["Sat", "Sun"],
    preferredEmail: "username@example.com",
    notifications: {
      newJobPosted: false,
      newApplicant: false,
      mentionedInNote: false,
      noteAdded: false,
      addedToTeam: false,
      candidateBookedEvent: false,
      upcomingEventReminders: false,
      eventAccepted: false,
      eventDeclined: false,
      eventUpdated: false,
      eventDeleted: false,
      eventActivated: false,
      offerAccepted: false,
      offerDeclined: false,
    },
  });

  const handleToggle = (key: keyof NotificationSettings["notifications"]) => (val: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: val }
    }));
  };

  const toggleDay = (day: string) => {
    setSettings(prev => ({
      ...prev,
      selectedDaysOff: prev.selectedDaysOff.includes(day)
        ? prev.selectedDaysOff.filter(d => d !== day)
        : [...prev.selectedDaysOff, day]
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full font-sans pb-10">
      {/* Do Not Disturb Section */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg p-4 shadow-[0px_4px_4px_0px_#00000014]">
        <h3 className="text-[14px] font-[500] text-[#333333] mb-2">Do Not Disturb</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
          <div className="flex items-center gap-2">
            <div
              onClick={() => setSettings(prev => ({ ...prev, doNotDisturb: !prev.doNotDisturb }))}
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors",
                settings.doNotDisturb
                  ? "bg-[#57CC4D] border-[#57CC4D]"
                  : "bg-white border-[#CCCCCC]"
              )}
            >
              {settings.doNotDisturb && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <label
              onClick={() => setSettings(prev => ({ ...prev, doNotDisturb: !prev.doNotDisturb }))}
              className="text-[13px] font-[400] text-[#333333] cursor-pointer select-none"
            >
              Do not notify me from:
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={settings.doNotDisturbFrom}
              onChange={(e) => setSettings(prev => ({ ...prev, doNotDisturbFrom: e.target.value }))}
              className="w-[70px] h-[36px] border border-[#CCCCCC] rounded-md text-center text-[13px] font-[400] focus:outline-none focus:border-[#6E41E2]"
            />
            <span className="text-[13px] font-[400] text-[#333333]">To:</span>
            <input
              type="text"
              value={settings.doNotDisturbTo}
              onChange={(e) => setSettings(prev => ({ ...prev, doNotDisturbTo: e.target.value }))}
              className="w-[70px] h-[36px] border border-[#CCCCCC] rounded-md text-center text-[13px] font-[400] focus:outline-none focus:border-[#6E41E2]"
            />
          </div>

          <p className="text-[13px] font-[400] text-[#333333] ml-auto lg:ml-0">
            Notifications paused until tomorrow at 08:00
          </p>

          <div className="ml-auto">
            <Button
              variant="outlined"
              sx={{
                height: '36px',
                borderColor: '#CCCCCC',
                color: '#333333',
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                gap: '8px',
                '&:hover': {
                  borderColor: '#6E41E2',
                  backgroundColor: 'rgba(110, 65, 226, 0.04)',
                }
              }}
              startIcon={<NotificationIcon />}
            >
              Resume Notifications
            </Button>
          </div>
        </div>
      </div>

      {/* Days Off Section */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg p-5 shadow-[0px_4px_4px_0px_#00000014]">
        <h3 className="text-[14px] font-[500] text-[#333333] mb-5">Do not disturb me on my days off</h3>

        <div className="flex gap-[2px]">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={cn(
                "w-[62px] h-[28px] rounded-md border text-[13px] font-[500] transition-colors",
                settings.selectedDaysOff.includes(day)
                  ? "border-[#6E41E2] bg-[#6E41E2] text-white"
                  : "border-[#CCCCCC] bg-white text-[#333333] hover:border-[#6E41E2]"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Email Notifications Section */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg p-5 shadow-[0px_4px_4px_0px_#00000014]">
        <h3 className="text-[14px] font-[500] text-[#333333] mb-5">Email Notifications</h3>

        <div className="max-w-[400px]">
          <FloatingLabelInput
            label="Preferred Email"
            value={settings.preferredEmail}
            onChange={(e) => setSettings(prev => ({ ...prev, preferredEmail: e.target.value }))}
            className="w-full"
          />
        </div>
      </div>

      {/* List Preferences Card */}
      <div className="bg-white border border-[#CCCCCC] rounded-lg p-5 shadow-[0px_4px_4px_0px_#00000014]">
        <p className="text-[14px] font-[500] text-[#333333] mb-6">
          Send email and push notifications for:
        </p>

        <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <Toggle
            enabled={settings.notifications.newJobPosted}
            onChange={handleToggle("newJobPosted")}
            label="Receive emails when a new job is posted in a team you are a member of."
          />
          <Toggle
            enabled={settings.notifications.newApplicant}
            onChange={handleToggle("newApplicant")}
            label="Receive emails when you get a new applicant for a job within a team you are a member of."
          />
          <Toggle
            enabled={settings.notifications.mentionedInNote}
            onChange={handleToggle("mentionedInNote")}
            label="Receive emails when when you are mentioned by a team member in a note."
          />
          <Toggle
            enabled={settings.notifications.noteAdded}
            onChange={handleToggle("noteAdded")}
            label="Receive emails when a team member adds a note."
          />
          <Toggle
            enabled={settings.notifications.addedToTeam}
            onChange={handleToggle("addedToTeam")}
            label="Receive emails when you are added to a new team."
          />
          <Toggle
            enabled={settings.notifications.candidateBookedEvent}
            onChange={handleToggle("candidateBookedEvent")}
            label="Receive emails when a candidate books an event slot for an event you are attending."
          />
          <Toggle
            enabled={settings.notifications.upcomingEventReminders}
            onChange={handleToggle("upcomingEventReminders")}
            label="Receive email reminders for upcoming events you are attending."
          />
          <Toggle
            enabled={settings.notifications.eventAccepted}
            onChange={handleToggle("eventAccepted")}
            label="Receive emails when an event you are attending is accepted by a candidate."
          />
          <Toggle
            enabled={settings.notifications.eventDeclined}
            onChange={handleToggle("eventDeclined")}
            label="Receive emails when an event you are attending is declined by a candidate."
          />
          <Toggle
            enabled={settings.notifications.eventUpdated}
            onChange={handleToggle("eventUpdated")}
            label="Receive emails when an event is updated."
          />
          <Toggle
            enabled={settings.notifications.eventDeleted}
            onChange={handleToggle("eventDeleted")}
            label="Receive emails when an event you are attending is deleted."
          />
          <Toggle
            enabled={settings.notifications.eventActivated}
            onChange={handleToggle("eventActivated")}
            label="Receive emails when an event you are attending is activated."
          />
          <Toggle
            enabled={settings.notifications.offerAccepted}
            onChange={handleToggle("offerAccepted")}
            label="Receive emails when an offer is accepted by a candidate within a team you are a member of."
          />
          <Toggle
            enabled={settings.notifications.offerDeclined}
            onChange={handleToggle("offerDeclined")}
            label="Receive emails when an offer is declined by a candidate within a team you are a member of."
          />
        </div>
      </div>

      {/* Save Button Container */}
      <div className="flex justify-end pr-1 mt-4">
        <Button
          variant="contained"
          sx={{
            width: '110px',
            height: '36px',
            backgroundColor: '#6E41E2',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '12px',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#9A77F0',
              boxShadow: 'none',
            },
            color: "white",
          }}
        >
          Save
        </Button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CCCCCC;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aaaaaa;
        }
      `}</style>

    </div>
  );
};

export default Notifications;
