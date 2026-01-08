/**
 * Get the user's locale from the browser
 * @returns locale string (e.g., "en-US", "es-ES")
 */
export const getBrowserLocale = (): string => {
  const locale = navigator.language || navigator.languages?.[0] || "en-US";
  return locale;
};

/**
 * Get the user's timezone from the browser
 * @returns timezone string (e.g., "America/New_York", "Europe/London")
 */
export const getBrowserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get a formatted timezone offset string
 * @returns formatted timezone string (e.g., "UTC-5", "UTC+1")
 */
export const getFormattedTimezone = (): string => {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset <= 0 ? "+" : "-";

  return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

/**
 * Get timezone options with browser's timezone pre-selected
 * @returns array of timezone options with current timezone marked
 */
export const getTimezoneOptions = () => {
  const timeZoneOptions = [
    { value: "UTC-12", label: "(UTC-12:00) Baker Island" },
    { value: "UTC-11", label: "(UTC-11:00) American Samoa" },
    { value: "UTC-10", label: "(UTC-10:00) Hawaii" },
    { value: "UTC-9", label: "(UTC-09:00) Alaska" },
    { value: "UTC-8", label: "(UTC-08:00) Pacific Time" },
    { value: "UTC-7", label: "(UTC-07:00) Mountain Time" },
    { value: "UTC-6", label: "(UTC-06:00) Central Time" },
    { value: "UTC-5", label: "(UTC-05:00) Eastern Time" },
    { value: "UTC-4", label: "(UTC-04:00) Atlantic Time" },
    { value: "UTC-3", label: "(UTC-03:00) Argentina" },
    { value: "UTC-2", label: "(UTC-02:00) Mid-Atlantic" },
    { value: "UTC-1", label: "(UTC-01:00) Azores" },
    { value: "UTC+0", label: "(UTC+00:00) London" },
    { value: "UTC+1", label: "(UTC+01:00) Central Europe" },
    { value: "UTC+2", label: "(UTC+02:00) Eastern Europe" },
    { value: "UTC+3", label: "(UTC+03:00) Moscow" },
    { value: "UTC+4", label: "(UTC+04:00) Gulf" },
    { value: "UTC+5", label: "(UTC+05:00) Pakistan" },
    { value: "UTC+6", label: "(UTC+06:00) Bangladesh" },
    { value: "UTC+7", label: "(UTC+07:00) Thailand" },
    { value: "UTC+8", label: "(UTC+08:00) China" },
    { value: "UTC+9", label: "(UTC+09:00) Japan" },
    { value: "UTC+10", label: "(UTC+10:00) Australia" },
    { value: "UTC+11", label: "(UTC+11:00) Solomon Islands" },
    { value: "UTC+12", label: "(UTC+12:00) New Zealand" },
  ];

  return timeZoneOptions;
};

/**
 * Get the default timezone value based on browser detection
 * @returns timezone value string
 */
export const getDefaultTimezone = (): string => {
  const currentOffset = -new Date().getTimezoneOffset() / 60;

  const offsetMap: { [key: number]: string } = {
    "-12": "UTC-12",
    "-11": "UTC-11",
    "-10": "UTC-10",
    "-9": "UTC-9",
    "-8": "UTC-8",
    "-7": "UTC-7",
    "-6": "UTC-6",
    "-5": "UTC-5",
    "-4": "UTC-4",
    "-3": "UTC-3",
    "-2": "UTC-2",
    "-1": "UTC-1",
    "0": "UTC+0",
    "1": "UTC+1",
    "2": "UTC+2",
    "3": "UTC+3",
    "4": "UTC+4",
    "5": "UTC+5",
    "6": "UTC+6",
    "7": "UTC+7",
    "8": "UTC+8",
    "9": "UTC+9",
    "10": "UTC+10",
    "11": "UTC+11",
    "12": "UTC+12",
  };

  return offsetMap[Math.round(currentOffset)] || "UTC+0";
};
