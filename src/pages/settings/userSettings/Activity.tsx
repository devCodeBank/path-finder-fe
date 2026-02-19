import ClosePopupIcon from "@assets/icons/close-pop-up.svg?react";
import ConnectedAppsEmptyIcon from "@assets/icons/connected-apps-empty.svg?react";
import ChromeIcon from "@assets/icons/Icon-chrome.svg?react";
import ImacIcon from "@assets/icons/Icon-imac.svg?react";
import MacIcon from "@assets/icons/Icons_mac.svg?react";
import InfoTooltipIcon from "@assets/icons/InfoTooltipIcon.svg?react";
import BrandLogo2Icon from "@assets/logos/brand-logo-2.svg?react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
import React from "react";

type SessionRow = {
  id: string;
  title: string;
  timeAgo: string;
  location: string;
  status: "current" | "expired" | "none";
  sessionName?: string;
  startedTime?: string;
  signInTime?: string;
  deviceName?: string;
  referrer?: string;
  ipAddress?: string;
  operatingSystem?: string;
  appVersion?: string;
};

const initialActiveSessions: SessionRow[] = [
  {
    id: "active-1",
    title: "MacBook",
    timeAgo: "47 minutes ago",
    location: "Auckland, Auckland, New Zealand",
    status: "current",
    sessionName: "pathfinder ats crm",
    startedTime: "14/02/2026",
    ipAddress: "134.12.65.198",
    operatingSystem: "macOS",
    appVersion: "Google Chrome 123.0.0",
  },
  {
    id: "active-2",
    title: "MacBook",
    timeAgo: "47 minutes ago",
    location: "Auckland, Auckland, New Zealand",
    status: "none",
  },
];

const activityHistory: SessionRow[] = [
  {
    id: "history-1",
    title: "pathfinder atc crm",
    timeAgo: "47 minutes ago",
    location: "Auckland, Auckland, New Zealand",
    status: "none",
    sessionName: "pathfinder ats crm",
    signInTime: "17/01/2026",
    deviceName: "iMac",
    referrer: "pathfinderatscrm.com",
    ipAddress: "134.12.65.198",
    operatingSystem: "macOS",
    appVersion: "Google Chrome 123.0.0",
  },
  {
    id: "history-2",
    title: "pathfinder atc crm",
    timeAgo: "47 minutes ago",
    location: "Auckland, Auckland, New Zealand",
    status: "expired",
    sessionName: "pathfinder ats crm",
    signInTime: "17/01/2026",
    deviceName: "iMac",
    referrer: "pathfinderatscrm.com",
    ipAddress: "134.12.65.198",
    operatingSystem: "macOS",
    appVersion: "Google Chrome 123.0.0",
  },
];

const Section = ({ title, headerAction, children }: { title: string; headerAction?: React.ReactNode; children: React.ReactNode }) => (
  <section className="overflow-hidden rounded-[4px] border border-[#D6D6D6] bg-white">
    <div className="flex h-[46px] items-center justify-between border-b border-[#D6D6D6] bg-[#FAFAFA] px-4">
      <h2 className="text-[14px] font-[500] text-[#2C2C2C]">{title}</h2>
      {headerAction}
    </div>
    <div className="px-4 py-5">{children}</div>
  </section>
);

const LocationInfoTooltip = () => (
  <Tooltip
    title={
      <>
        The location is approximated based on the accessed
        <br />
        IP address. Click to view the exact IP address.
      </>
    }
    arrow
    placement="bottom"
    componentsProps={{
      tooltip: { sx: { bgcolor: "#797979", width: "fit-content", maxWidth: "none", textAlign: "center", whiteSpace: "nowrap" } },
      arrow: { sx: { color: "#797979" } },
      popper: { sx: { zIndex: 2400 } },
    }}
  >
    <span className="inline-flex items-center justify-center">
      <InfoTooltipIcon width={16} height={16} />
    </span>
  </Tooltip>
);

const SessionItem = ({
  row,
  withAppIcon,
  showTerminateOnHover,
  onTerminate,
  onCurrentInfoClick,
  onHistoryInfoClick,
}: {
  row: SessionRow;
  withAppIcon?: boolean;
  showTerminateOnHover?: boolean;
  onTerminate?: (id: string) => void;
  onCurrentInfoClick?: (session: SessionRow) => void;
  onHistoryInfoClick?: (session: SessionRow) => void;
}) => (
  <div
    className={[
      "group flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:gap-6",
      showTerminateOnHover || withAppIcon ? "rounded-[4px] transition-colors hover:bg-[#F8F8F8]" : "",
    ].join(" ")}
  >
    <div className="mr-26 flex min-w-[240px] flex-1 items-center gap-3">
      {withAppIcon ? (
        <span className="inline-flex h-[28px] w-[28px] items-center justify-center">
          <BrandLogo2Icon width={25} height={25} />
        </span>
      ) : (
        <ImacIcon width={25} height={25} />
      )}
      <div className="leading-tight">
        <p className="text-[14px] font-[500] text-[#333333]">{row.title}</p>
        <p className="text-[10px] text-[#7A7A7A]">{row.timeAgo}</p>
      </div>
    </div>

    <div className="ml-26 flex min-w-[150px] items-center gap-4 text-[#303030]">
      <ImacIcon width={24} height={24} />
      <MacIcon width={20} height={20} />
      <ChromeIcon width={20} height={20} />
    </div>

    <div className="flex flex-1 items-center gap-2 text-[13px] text-[#333333]">
      <span className="truncate">{row.location}</span>
      {row.status === "current" && onCurrentInfoClick ? (
        <Tooltip
          title={
            <>
              The location is approximated based on the accessed
              <br />
              IP address. Click to view the exact IP address.
            </>
          }
          arrow
          placement="bottom"
          componentsProps={{
            tooltip: { sx: { bgcolor: "#797979", textAlign: "center", maxWidth: "none", whiteSpace: "nowrap" } },
            arrow: { sx: { color: "#797979" } },
            popper: { sx: { zIndex: 2400 } },
          }}
        >
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center"
            onClick={() => onCurrentInfoClick(row)}
            aria-label="View current session details"
          >
            <InfoTooltipIcon width={16} height={16} />
          </button>
        </Tooltip>
      ) : withAppIcon && onHistoryInfoClick ? (
        <Tooltip
          title={
            <>
              The location is approximated based on the accessed
              <br />
              IP address. Click to view the exact IP address.
            </>
          }
          arrow
          placement="bottom"
          componentsProps={{
            tooltip: { sx: { bgcolor: "#797979", textAlign: "center", maxWidth: "none", whiteSpace: "nowrap" } },
            arrow: { sx: { color: "#797979" } },
            popper: { sx: { zIndex: 2400 } },
          }}
        >
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center"
            onClick={() => onHistoryInfoClick(row)}
            aria-label="View activity history details"
          >
            <InfoTooltipIcon width={16} height={16} />
          </button>
        </Tooltip>
      ) : (
        <LocationInfoTooltip />
      )}
    </div>

    <div className="min-w-[140px] text-right">
      {row.status === "current" && <span className="mr-6 inline-flex items-center gap-1 text-[13px] text-[#249A3B]">Current Session</span>}
      {row.status === "expired" && (
        <span className="mr-6 inline-flex items-center gap-1 text-[13px] text-[#E24A4A]">
          Session Expired
          <Tooltip
            title="Session expired as per your organisation's policy."
            arrow
            placement="left"
            componentsProps={{
              tooltip: { sx: { bgcolor: "#797979", textAlign: "center", maxWidth: "none", whiteSpace: "nowrap" } },
              arrow: { sx: { color: "#797979" } },
              popper: { sx: { zIndex: 2400 } },
            }}
          >
            <span className="inline-flex items-center justify-center">
              <InfoOutlinedIcon sx={{ fontSize: 14, color: "#E24A4A" }} />
            </span>
          </Tooltip>
        </span>
      )}
      {row.status === "none" && showTerminateOnHover && onTerminate && (
        <button
          type="button"
          className="mr-16 pointer-events-none cursor-pointer text-[13px] text-[#E24A4A] opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 hover:underline"
          onClick={() => onTerminate(row.id)}
        >
          Terminate
        </button>
      )}
    </div>
  </div>
);

export const Activity: React.FC = () => {
  const [activeSessions, setActiveSessions] = React.useState<SessionRow[]>(initialActiveSessions);
  const [selectedCurrentSession, setSelectedCurrentSession] = React.useState<SessionRow | null>(null);
  const [selectedHistorySession, setSelectedHistorySession] = React.useState<SessionRow | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
  const [isTerminateOtherModalOpen, setIsTerminateOtherModalOpen] = React.useState(false);
  const hasOtherSessions = activeSessions.some((session) => session.status !== "current");

  const handleTerminateSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const handleTerminateAllSessions = () => {
    setActiveSessions([]);
  };

  const handleTerminateAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((session) => session.status === "current"));
  };

  const handleConfirmTerminateAllOtherSessions = () => {
    handleTerminateAllOtherSessions();
    setIsTerminateOtherModalOpen(false);
  };

  return (
    <div className="flex w-full max-w-full flex-col gap-4 pb-2 font-sans">
      <Section
        title="Active Sessions"
        headerAction={
          <button
            type="button"
            className="cursor-pointer rounded-[4px] bg-[#D9534F] px-4 py-1.5 text-[12px] font-[500] text-white hover:bg-[#CA4742]"
            onClick={handleTerminateAllSessions}
          >
            Terminate All Sessions
          </button>
        }
      >
        <div className="divide-y divide-[#ECECEC]">
          {activeSessions.map((row) => (
            <SessionItem
              key={row.id}
              row={row}
              showTerminateOnHover
              onTerminate={handleTerminateSession}
              onCurrentInfoClick={setSelectedCurrentSession}
            />
          ))}
        </div>

        <div className="pt-12 text-center">
          <button
            type="button"
            className="cursor-pointer text-[14px] font-[400] text-[#E24A4A] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setIsTerminateOtherModalOpen(true)}
            disabled={!hasOtherSessions}
          >
            Terminate all other sessions
          </button>
        </div>
      </Section>

      <Section title="Activity History">
        <div className="divide-y divide-[#ECECEC]">
          {activityHistory.map((row) => (
            <SessionItem key={row.id} row={row} withAppIcon onHistoryInfoClick={setSelectedHistorySession} />
          ))}
        </div>

        <div className="pt-12 text-center">
          <button
            type="button"
            className="cursor-pointer text-[13px] text-[#4A4DFF] hover:underline"
            onClick={() => setIsHistoryModalOpen(true)}
          >
            View More
          </button>
        </div>
      </Section>

      <Section title="Connected Apps">
        <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F3F3F3]">
            <ConnectedAppsEmptyIcon width={78} height={77} />
          </div>
          <p className="text-[14px] font-[500] text-[#333333]">There are no apps connected to this account</p>
        </div>
      </Section>

      {selectedCurrentSession && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-[#00000066] p-4">
          <div className="w-full max-w-[680px] rounded-[10px] border border-[#D8D8D8] bg-white p-7 shadow-[0px_10px_14px_0px_#00000024]">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <BrandLogo2Icon width={28} height={28} />
                <div>
                  <p className="text-[14px] font-[500] text-[#333333]">{selectedCurrentSession.sessionName ?? "pathfinder ats crm"}</p>
                  <p className="text-[10px] text-[#7A7A7A]">{selectedCurrentSession.timeAgo}</p>
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer text-[24px] leading-none text-[#888888] hover:text-[#555555]"
                onClick={() => setSelectedCurrentSession(null)}
                aria-label="Close session details"
              >
                <ClosePopupIcon width={24} height={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-7">
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Started Time</p>
                  <p className="text-[13px] font-[400] mt-2 text-[#333333]">{selectedCurrentSession.startedTime ?? "-"}</p>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">IP Address</p>
                  <p className="text-[13px] font-[400] mt-2 text-[#333333]">{selectedCurrentSession.ipAddress ?? "-"}</p>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Location</p>
                  <p className="text-[13px] font-[400] mt-2 text-[#333333]">{selectedCurrentSession.location}</p>
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Operating System</p>
                  <div className="flex items-center  mt-2 gap-2 text-[13px] text-[#333333]">
                    <MacIcon width={24} height={24} />
                    <span>{selectedCurrentSession.operatingSystem ?? "macOS"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">App</p>
                  <div className="flex items-center gap-2 font-[400] mt-2 text-[13px] text-[#333333]">
                    <ChromeIcon width={24} height={24} />
                    <span>{selectedCurrentSession.appVersion ?? "Google Chrome 123.0.0"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedHistorySession && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-[#00000066] p-4">
          <div className="w-full max-w-[680px] rounded-[10px] border border-[#D8D8D8] bg-white p-7 shadow-[0px_10px_14px_0px_#00000024]">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <BrandLogo2Icon width={28} height={28} />
                <div>
                  <p className="text-[14px] font-[500] text-[#333333]">{selectedHistorySession.sessionName ?? "pathfinder ats crm"}</p>
                  <p className="text-[10px] text-[#7A7A7A]">{selectedHistorySession.timeAgo}</p>
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer text-[24px] leading-none text-[#888888] hover:text-[#555555]"
                onClick={() => setSelectedHistorySession(null)}
                aria-label="Close history session details"
              >
                <ClosePopupIcon width={24} height={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-7">
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Sign-in-time</p>
                  <p className="mt-2 text-[13px] font-[400] text-[#333333]">{selectedHistorySession.signInTime ?? "-"}</p>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Device</p>
                  <div className="mt-2 flex items-center gap-2 text-[13px] text-[#333333]">
                    <ImacIcon width={20} height={20} />
                    <span>{selectedHistorySession.deviceName ?? "iMac"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Referrer</p>
                  <p className="mt-2 text-[13px] font-[400] text-[#333333]">{selectedHistorySession.referrer ?? "-"}</p>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Location</p>
                  <p className="mt-2 text-[13px] font-[400] text-[#333333]">{selectedHistorySession.location}</p>
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">Operating System</p>
                  <div className="mt-2 flex items-center gap-2 text-[13px] text-[#333333]">
                    <MacIcon width={24} height={24} />
                    <span>{selectedHistorySession.operatingSystem ?? "macOS"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">App</p>
                  <div className="mt-2 flex items-center gap-2 text-[13px] text-[#333333]">
                    <ChromeIcon width={24} height={24} />
                    <span>{selectedHistorySession.appVersion ?? "Google Chrome 123.0.0"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#666666]">IP Address</p>
                  <p className="mt-2 text-[13px] font-[400] text-[#333333]">{selectedHistorySession.ipAddress ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-[#00000066] p-4">
          <div className="w-full max-w-[1220px] rounded-[10px] border border-[#D8D8D8] bg-white p-6 shadow-[0px_10px_14px_0px_#00000024]">
            <div className="mb-4 flex items-start justify-between border-b border-[#ECECEC] pb-4">
              <div>
                <p className="text-[16px] font-[500] text-[#333333]">Recent Activity History</p>
                <p className="text-[12px] text-[#7A7A7A]">Latest sign-ins and session records</p>
              </div>
              <button
                type="button"
                className="cursor-pointer text-[24px] leading-none text-[#888888] hover:text-[#555555]"
                onClick={() => setIsHistoryModalOpen(false)}
                aria-label="Close recent history"
              >
                <ClosePopupIcon width={24} height={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <div className="divide-y divide-[#ECECEC]">
                {activityHistory.map((row) => (
                  <div key={`recent-${row.id}`} className="rounded-[4px] py-4 transition-colors hover:bg-[#F8F8F8]">
                    <SessionItem row={row} withAppIcon onHistoryInfoClick={setSelectedHistorySession} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isTerminateOtherModalOpen && (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center bg-[#00000080] p-4">
          <div className="w-full max-w-[620px] overflow-hidden rounded-[10px] border border-[#D8D8D8] bg-white shadow-[0px_10px_14px_0px_#00000024]">
            <div className="flex items-center justify-between border-b border-[#ECECEC] px-8 py-7">
              <p className="text-[16px] font-[500] text-[#1F1F1F]">Terminate all the browsers sessions.</p>
              <button
                type="button"
                className="cursor-pointer rounded-full  p-2 text-[#9A9A9A] "
                onClick={() => setIsTerminateOtherModalOpen(false)}
                aria-label="Close terminate sessions confirmation"
              >
                <ClosePopupIcon width={24} height={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="px-8 py-8">
              <p className="mb-8 text-[14px] font-[400] text-[#333333]">
                This will sign you out of all your Zoho account sessions that are active in browsers.
              </p>
              <button
                type="button"
                className="cursor-pointer rounded-[6px] bg-[#E65858] px-4 py-2 text-[13px] font-[500] text-white hover:bg-[#D74C4C]"
                onClick={handleConfirmTerminateAllOtherSessions}
              >
                Terminate all Active Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
