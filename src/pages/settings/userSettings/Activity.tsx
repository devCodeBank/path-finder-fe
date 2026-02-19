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
};

const activeSessions: SessionRow[] = [
  {
    id: "active-1",
    title: "MacBook",
    timeAgo: "47 minutes ago",
    location: "Auckland, Auckland, New Zealand",
    status: "current",
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
  },
  {
    id: "history-2",
    title: "pathfinder atc crm",
    timeAgo: "47 minutes ago",
    location: "Auckland, Auckland, New Zealand",
    status: "expired",
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

const SessionItem = ({ row, withAppIcon }: { row: SessionRow; withAppIcon?: boolean }) => (
  <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:gap-6">
    <div className="flex min-w-[240px] flex-1 items-center gap-3 mr-26">
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

    <div className="flex min-w-[150px] items-center gap-4 text-[#303030] ml-26">
      <ImacIcon width={24} height={24} />
      <MacIcon width={20} height={20} />
      <ChromeIcon width={20} height={20} />
    </div>

    <div className="flex flex-1 items-center gap-2 text-[13px] text-[#333333]">
      <span className="truncate">{row.location}</span>
      <LocationInfoTooltip />
    </div>

    <div className="min-w-[140px] text-right">
      {row.status === "current" && <span className="text-[13px] text-[#249A3B] mr-6">Current Session</span>}
      {row.status === "expired" && (
        <span className="inline-flex items-center gap-1 text-[13px] text-[#E24A4A] mr-6">
          Session Expired
          <Tooltip
            title="Session expired as per your organisation’s policy."
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
    </div>
  </div>
);

export const Activity: React.FC = () => {
  return (
    <div className="flex w-full max-w-full flex-col gap-4 pb-2 font-sans">
      <Section
        title="Active Sessions"
        headerAction={
          <button type="button" className="rounded-[4px] bg-[#D9534F] px-4 py-1.5 text-[12px] font-[500] text-white hover:bg-[#CA4742]">
            Terminate All Sessions
          </button>
        }
      >
        <div className="divide-y divide-[#ECECEC]">
          {activeSessions.map((row) => (
            <SessionItem key={row.id} row={row} />
          ))}
        </div>

        <div className="pt-12 text-center">
          <button type="button" className="text-[14px] font-[400] text-[#E24A4A] hover:underline">
            Terminate all other sessions
          </button>
        </div>
      </Section>

      <Section title="Activity History">
        <div className="divide-y divide-[#ECECEC]">
          {activityHistory.map((row) => (
            <SessionItem key={row.id} row={row} withAppIcon />
          ))}
        </div>

        <div className="pt-12 text-center">
          <button type="button" className="text-[13px] text-[#4A4DFF] hover:underline">
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
    </div>
  );
};

export default Activity;
