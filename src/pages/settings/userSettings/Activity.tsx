import React from "react";

const ActivityCard = ({
  title,
  children,
  headerAction
}: {
  title: string;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC80] rounded-[4px] overflow-hidden">
      <div className="px-4 h-[36px] border-b border-[#CCCCCC80] flex items-center justify-between bg-[#F5F5F5]">
        <h3 className="text-[14px] font-[500] text-[#333333]">{title}</h3>
        {headerAction}
      </div>
      <div className="min-h-[142px]">{children}</div>
    </div>
  );
};

export const Activity: React.FC = () => {
  const initialSessions = [
    {
      id: "current",
      device: "Personal Computer",
      lastActive: "15 days ago",
      startedTime: "Jan 12, 2026 21:05 (GMT +05:00)",
      app: "Cliq 1.8.0",
      ipAddress: "39.46.82.162",
      os: "Windows",
      browser: "Chrome",
      location: "New Multan, Punjab, Pakistan",
      isCurrent: true
    },
    {
      id: "recent-1",
      device: "Personal Computer",
      lastActive: "4 days ago",
      startedTime: "Jan 12, 2026 21:05 (GMT +05:00)",
      app: "Cliq 1.8.0",
      ipAddress: "39.46.82.162",
      os: "Windows",
      browser: "Web App",
      location: "New Multan, Punjab, Pakistan",
      isCurrent: false
    },
    {
      id: "recent-2",
      device: "Personal Computer",
      lastActive: "15 days ago",
      startedTime: "Jan 12, 2026 21:05 (GMT +05:00)",
      app: "Cliq 1.8.0",
      ipAddress: "39.46.82.162",
      os: "Windows",
      browser: "Chrome",
      location: "New Multan, Punjab, Pakistan",
      isCurrent: false
    },
    {
      id: "recent-3",
      device: "Personal Computer",
      lastActive: "2 days ago",
      startedTime: "Jan 14, 2026 09:20 (GMT +05:00)",
      app: "Cliq 1.8.0",
      ipAddress: "39.46.82.162",
      os: "Windows",
      browser: "Web App",
      location: "Burewala, Punjab, Pakistan",
      isCurrent: false
    }
  ];
  const [sessions, setSessions] = React.useState(initialSessions);
  const [visibleCount, setVisibleCount] = React.useState(2);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = React.useState<string | null>(null);
  const [isActivityHistoryOpen, setIsActivityHistoryOpen] = React.useState(false);

  const visibleSessions = sessions.slice(0, visibleCount);
  const canShowMoreSessions = visibleCount < sessions.length;

  const handleShowMoreSessions = () => {
    setVisibleCount((count) => Math.min(count + 1, sessions.length));
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((rows) => {
      const nextRows = rows.filter((row) => row.id !== sessionId);
      setVisibleCount((count) => Math.min(count, nextRows.length));
      return nextRows;
    });
  };

  const handleTerminateAllSessions = () => {
    setSessions([]);
    setVisibleCount(0);
  };

  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? null;

  const activityHistory = [
    {
      id: "cliq-1",
      app: "Cliq",
      lastActive: "4 days ago",
      signInTime: "Jan 12, 2026 21:05 (GMT +05:00)",
      deviceName: "Personal Computer",
      deviceType: "Desktop",
      referrer: "cliq.Path Finder.com",
      ipAddress: "39.46.82.162",
      appVersion: "1.8.0",
      os: "Windows",
      browser: "Web App",
      location: "New Multan, Punjab, Pakistan"
    },
    {
      id: "cliq-2",
      app: "Cliq",
      lastActive: "14 days ago",
      signInTime: "Jan 12, 2026 21:05 (GMT +05:00)",
      deviceName: "Personal Computer",
      deviceType: "Mobile",
      referrer: "cliq.Path Finder.com",
      ipAddress: "39.46.82.162",
      appVersion: "1.8.0",
      os: "Android",
      browser: "App",
      location: "Burewala, Punjab, Pakistan"
    },
    {
      id: "cliq-3",
      app: "Cliq",
      lastActive: "15 days ago",
      signInTime: "Jan 12, 2026 21:05 (GMT +05:00)",
      deviceName: "Personal Computer",
      deviceType: "Desktop",
      referrer: "cliq.Path Finder.com",
      ipAddress: "39.46.82.162",
      appVersion: "1.8.0",
      os: "Windows",
      browser: "Chrome",
      location: "New Multan, Punjab, Pakistan"
    }
  ];
  const activeActivity = activityHistory.find((item) => item.id === activeActivityId) ?? null;

  return (
    <div className="flex flex-col gap-4 w-full max-w-full font-sans ">
      <ActivityCard
        title="Active Sessions"
        headerAction={
          <button
            className="text-[12px] font-[500] text-[#E53935] hover:underline"
            onClick={handleTerminateAllSessions}
            type="button"
          >
            Terminate all
          </button>
        }
      >
        <div className="px-5 py-4 flex flex-col gap-6">
          {visibleSessions.map((session, index) => (
            <div
              key={session.id}
              className={index === visibleSessions.length - 1 ? "flex items-center cursor-pointer" : "flex items-center pb-4 border-b border-[#F0F0F080] cursor-pointer"}
              onClick={() => setActiveSessionId(session.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-[34px] w-[54px] rounded-sm border border-[#CCCCCC80] bg-[#1F2A66] flex items-center justify-center text-[12px] text-white font-[600]">
                  PC
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-[500] text-[#333333]">{session.device}</span>
                  <span className="text-[12px] text-[#717171]">{session.lastActive}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-1">
                <div className="h-[28px] w-[28px] rounded-md border border-[#CCCCCC80] bg-[#0078D4] text-white text-[11px] font-[600] flex items-center justify-center">
                  W
                </div>
                <div className="h-[28px] w-[28px] rounded-md border border-[#CCCCCC80] bg-[#F4F4F4] text-[#333333] text-[11px] font-[600] flex items-center justify-center">
                  {session.browser === "Chrome" ? "C" : "A"}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#333333]">
                  <span>{session.location}</span>
                  <span className="relative group">
                    <span className="h-[16px] w-[16px] rounded-full border border-[#71717180] text-[11px] text-[#717171] flex items-center justify-center">
                      i
                    </span>
                    <span className="absolute -top-2 left-6 z-10 w-[220px] rounded-md border border-[#E5E5E580] bg-white p-2 text-[11px] text-[#555555] shadow-[0px_6px_16px_0px_#0000001F] opacity-0 pointer-events-none group-hover:opacity-100">
                      The location shown is approximated based on the accessed IP address. Click to view the exact IP address.
                    </span>
                  </span>
                </div>
              </div>

              <div className="w-[160px] flex justify-end">
                {session.isCurrent && (
                  <span className="text-[13px] font-[500] text-[#1FA54A]">Current Session</span>
                )}
                {!session.isCurrent && (
                  <button
                    className="text-[13px] font-[500] text-[#E53935] hover:underline"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleTerminateSession(session.id);
                    }}
                    title="Terminate this session"
                    type="button"
                  >
                    Terminate
                  </button>
                )}
              </div>
            </div>
          ))}

          {sessions.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <button
                className="text-[13px] font-[500] text-[#1E88E5] hover:underline"
                onClick={handleShowMoreSessions}
                type="button"
                disabled={!canShowMoreSessions}
              >
                View 1 more session
              </button>
              <button className="flex items-center gap-2 text-[13px] font-[500] text-[#E53935] hover:underline">
                <span className="h-[16px] w-[16px] rounded-full border border-[#E53935] text-[12px] leading-[14px] flex items-center justify-center">
                  x
                </span>
                Terminate all other sessions
              </button>
            </div>
          )}
        </div>
      </ActivityCard>
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000066] p-4">
          <div className="w-full max-w-[720px] bg-white rounded-[6px] border border-[#E5E5E580] shadow-[0px_10px_30px_0px_#00000024]">
            <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E5E580]">
              <div className="flex items-center gap-4">
                <div className="h-[44px] w-[60px] rounded-sm border border-[#CCCCCC80] bg-[#1F2A66] flex items-center justify-center text-[14px] text-white font-[600]">
                  PC
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-[600] text-[#111111]">{activeSession.device}</span>
                  <span className="text-[12px] text-[#717171]">{activeSession.lastActive}</span>
                </div>
              </div>
              <button
                className="text-[20px] leading-[20px] text-[#9E9E9E] hover:text-[#666666]"
                onClick={() => setActiveSessionId(null)}
                type="button"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">Started Time</span>
                <span className="text-[14px] text-[#111111]">{activeSession.startedTime}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">Operating System</span>
                <div className="flex items-center gap-2 text-[14px] text-[#111111]">
                  <span className="h-[22px] w-[22px] rounded-sm border border-[#CCCCCC80] bg-[#0078D4] text-white text-[10px] font-[600] flex items-center justify-center">
                    W
                  </span>
                  <span>{activeSession.os}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">App</span>
                <div className="flex items-center gap-2 text-[14px] text-[#111111]">
                  <span className="h-[22px] w-[22px] rounded-md border border-[#CCCCCC80] bg-[#F4F4F4] text-[#333333] text-[10px] font-[600] flex items-center justify-center">
                    A
                  </span>
                  <span>{activeSession.app}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">IP Address</span>
                <span className="text-[14px] text-[#111111]">{activeSession.ipAddress}</span>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[13px] text-[#777777]">Location</span>
                <span className="text-[14px] text-[#111111]">{activeSession.location}</span>
              </div>
              <div className="md:col-span-2">
                <button
                  className="px-6 py-2 rounded-[4px] bg-[#D64B4B] text-white text-[14px] font-[600] hover:bg-[#C43C3C]"
                  onClick={() => {
                    handleTerminateSession(activeSession.id);
                    setActiveSessionId(null);
                  }}
                  type="button"
                >
                  Terminate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ActivityCard title="Activity History">
        <div className="px-5 py-4">
          <div className="text-[13px] text-[#717171] mb-4">
            View and manage all of your Path Finder account activity.
          </div>
          <div className="flex flex-col gap-6">
            {activityHistory.map((item, index) => (
              <div
                key={item.id}
                className={index === activityHistory.length - 1 ? "flex items-center cursor-pointer" : "flex items-center pb-4 border-b border-[#F0F0F080] cursor-pointer"}
                onClick={() => setActiveActivityId(item.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-[44px] w-[44px] rounded-full bg-[#F3F4F6] flex items-center justify-center text-[12px] font-[600] text-[#666666]">
                    C
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-[500] text-[#333333]">{item.app}</span>
                    <span className="text-[12px] text-[#717171]">{item.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  <div className="h-[26px] w-[26px] rounded-md border border-[#CCCCCC80] bg-[#1F2A66] text-white text-[10px] font-[600] flex items-center justify-center">
                    {item.deviceType === "Desktop" ? "PC" : "M"}
                  </div>
                  <div className="h-[26px] w-[26px] rounded-md border border-[#CCCCCC80] bg-[#0078D4] text-white text-[10px] font-[600] flex items-center justify-center">
                    {item.os === "Windows" ? "W" : "A"}
                  </div>
                  <div className="h-[26px] w-[26px] rounded-md border border-[#CCCCCC80] bg-[#F4F4F4] text-[#333333] text-[10px] font-[600] flex items-center justify-center">
                    {item.browser === "Chrome" ? "C" : "A"}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#333333]">
                    <span>{item.location}</span>
                    <span className="relative group">
                      <span className="h-[16px] w-[16px] rounded-full border border-[#71717180] text-[11px] text-[#717171] flex items-center justify-center">
                        i
                      </span>
                      <span className="absolute -top-2 left-6 z-10 w-[220px] rounded-md border border-[#E5E5E580] bg-white p-2 text-[11px] text-[#555555] shadow-[0px_6px_16px_0px_#0000001F] opacity-0 pointer-events-none group-hover:opacity-100">
                        The location shown is approximated based on the accessed IP address. Click to view the exact IP address.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="text-[13px] font-[500] text-[#1E88E5] hover:underline self-center"
              onClick={() => setIsActivityHistoryOpen(true)}
              type="button"
            >
              View more
            </button>
          </div>
        </div>
      </ActivityCard>
      {isActivityHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000066] p-4">
          <div className="w-full max-w-[1200px] bg-white rounded-[8px] border border-[#E5E5E580] shadow-[0px_10px_30px_0px_#00000024]">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#F0F0F080]">
              <div>
                <h3 className="text-[18px] font-[600] text-[#111111]">Activity History</h3>
                <p className="text-[13px] text-[#717171]">
                  View and manage all of your Path Finder account activity.
                </p>
              </div>
              <button
                className="text-[22px] leading-[22px] text-[#9E9E9E] hover:text-[#666666]"
                onClick={() => setIsActivityHistoryOpen(false)}
                type="button"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
              {activityHistory.map((item) => (
                <div key={item.id} className="flex items-center pb-4 border-b border-[#F0F0F080] last:border-b-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-[44px] w-[44px] rounded-full bg-[#F3F4F6] flex items-center justify-center text-[12px] font-[600] text-[#666666]">
                      C
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-[500] text-[#333333]">{item.app}</span>
                      <span className="text-[12px] text-[#717171]">{item.lastActive}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-[26px] w-[26px] rounded-md border border-[#CCCCCC80] bg-[#1F2A66] text-white text-[10px] font-[600] flex items-center justify-center">
                      {item.deviceType === "Desktop" ? "PC" : "M"}
                    </div>
                    <div className="h-[26px] w-[26px] rounded-md border border-[#CCCCCC80] bg-[#0078D4] text-white text-[10px] font-[600] flex items-center justify-center">
                      {item.os === "Windows" ? "W" : "A"}
                    </div>
                    <div className="h-[26px] w-[26px] rounded-md border border-[#CCCCCC80] bg-[#F4F4F4] text-[#333333] text-[10px] font-[600] flex items-center justify-center">
                      {item.browser === "Chrome" ? "C" : "A"}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[#333333]">
                      <span>{item.location}</span>
                      <span className="relative group">
                        <span className="h-[16px] w-[16px] rounded-full border border-[#71717180] text-[11px] text-[#717171] flex items-center justify-center">
                          i
                        </span>
                        <span className="absolute -top-2 left-6 z-10 w-[220px] rounded-md border border-[#E5E5E580] bg-white p-2 text-[11px] text-[#555555] shadow-[0px_6px_16px_0px_#0000001F] opacity-0 pointer-events-none group-hover:opacity-100">
                          The location shown is approximated based on the accessed IP address. Click to view the exact IP address.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000066] p-4">
          <div className="w-full max-w-[760px] bg-white rounded-[8px] border border-[#E5E5E580] shadow-[0px_10px_30px_0px_#00000024]">
            <div className="flex items-start justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-[48px] w-[48px] rounded-full bg-[#F3F4F6] flex items-center justify-center text-[12px] font-[600] text-[#666666]">
                  C
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-[600] text-[#111111]">{activeActivity.app}</span>
                  <span className="text-[12px] text-[#717171]">{activeActivity.lastActive}</span>
                </div>
              </div>
              <button
                className="h-[32px] w-[32px] rounded-full bg-[#F1F1F1] text-[#8A8A8A] text-[18px] leading-[18px] hover:text-[#555555]"
                onClick={() => setActiveActivityId(null)}
                type="button"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">Sign-in time</span>
                <span className="text-[14px] text-[#111111]">{activeActivity.signInTime}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">Operating System</span>
                <div className="flex items-center gap-2 text-[14px] text-[#111111]">
                  <span className="h-[22px] w-[22px] rounded-sm border border-[#CCCCCC80] bg-[#0078D4] text-white text-[10px] font-[600] flex items-center justify-center">
                    W
                  </span>
                  <span>{activeActivity.os}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">Device</span>
                <div className="flex items-center gap-2 text-[14px] text-[#111111]">
                  <span className="h-[22px] w-[22px] rounded-sm border border-[#CCCCCC80] bg-[#1F2A66] text-white text-[10px] font-[600] flex items-center justify-center">
                    PC
                  </span>
                  <span>{activeActivity.deviceName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">App</span>
                <div className="flex items-center gap-2 text-[14px] text-[#111111]">
                  <span className="h-[22px] w-[22px] rounded-md border border-[#CCCCCC80] bg-[#F4F4F4] text-[#333333] text-[10px] font-[600] flex items-center justify-center">
                    A
                  </span>
                  <span>{activeActivity.app} {activeActivity.appVersion}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">Referrer</span>
                <span className="text-[14px] text-[#111111]">{activeActivity.referrer}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] text-[#777777]">IP Address</span>
                <span className="text-[14px] text-[#111111]">{activeActivity.ipAddress}</span>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[13px] text-[#777777]">Location</span>
                <span className="text-[14px] text-[#111111]">{activeActivity.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <ActivityCard title="Connected Apps">
        <div className="px-5 py-4">
          <div className="text-[13px] text-[#717171] mb-6">
            View and manage all of the web applications connected to your Path Finder account.
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-[88px] w-[88px] rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
              <div className="h-[54px] w-[54px] rounded-lg bg-white border border-[#E5E5E580] shadow-[0px_2px_6px_0px_#00000014] flex flex-col items-start justify-center px-2 gap-2">
                <span className="h-[8px] w-[8px] rounded-full bg-[#FFB3B3]" />
                <span className="h-[8px] w-[8px] rounded-full bg-[#B7E4C7]" />
                <span className="h-[8px] w-[8px] rounded-full bg-[#FFE08A]" />
              </div>
            </div>
            <p className="text-[14px] font-[500] text-[#333333]">
              There are no apps connected to this account
            </p>
          </div>
        </div>
      </ActivityCard>
    </div>
  );
};

export default Activity;

