import ToggleSwitch from "@components/input/toggleSwitch/ToggleSwitch";
import SelectDropdown from "@components/selectDropdown/selectDropdown";
import { DataTable } from "@components/table/DataTable";
import type { DataTableColumn } from "@components/table/DataTable";
import { Box, Typography, MenuItem } from "@mui/material";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import styled from "styled-components";

import mockData from "../mockData/collaboratorMockData.json";
import nameDescriptions from "../mockData/nameDescriptions.json";

const TableSpacer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

interface SwitchRow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

type ReportsRow = SwitchRow & { access?: string; accessOptions?: string[] };

type RoleSettings = {
  userSettings: SwitchRow[];
  adminSettings: SwitchRow[];
  jobSettings: SwitchRow[];
  reports: ReportsRow[];
  customization: SwitchRow[];
  automation: SwitchRow[];
  portalSettings: SwitchRow[];
  dataAdmin: SwitchRow[];
  developerSpace: SwitchRow[];
  compliance: SwitchRow[];
  pac: SwitchRow[];
  generalPermissions: SwitchRow[];
};

type RoleSettingsRaw = {
  userSettings: { id: string; enabled: boolean }[];
  adminSettings: { id: string; enabled: boolean }[];
  jobSettings: { id: string; enabled: boolean }[];
  reports: ({ id: string; enabled: boolean } & { access?: string; accessOptions?: string[] })[];
  customization: { id: string; enabled: boolean }[];
  automation: { id: string; enabled: boolean }[];
  portalSettings: { id: string; enabled: boolean }[];
  dataAdmin: { id: string; enabled: boolean }[];
  developerSpace: { id: string; enabled: boolean }[];
  compliance: { id: string; enabled: boolean }[];
  pac: { id: string; enabled: boolean }[];
  generalPermissions: { id: string; enabled: boolean }[];
};

const getRoleSettingsRaw = (): RoleSettingsRaw => {
  return JSON.parse(JSON.stringify(mockData)) as unknown as RoleSettingsRaw;
};

type SectionKey = keyof RoleSettings;

function arrayToIdLookup(
  items: { id: string; name: string; description: string }[],
): Record<string, { name: string; description: string }> {
  return items.reduce<Record<string, { name: string; description: string }>>((m, item) => {
    m[item.id] = { name: item.name, description: item.description };
    return m;
  }, {});
}

const namesBySection: Record<SectionKey, Record<string, { name: string; description: string }>> = (
  Object.keys(nameDescriptions as Record<string, unknown>) as SectionKey[]
).reduce(
  (acc, sectionKey) => {
    const items = (nameDescriptions as Record<string, { id: string; name: string; description: string }[]>)[sectionKey] || [];
    const map = arrayToIdLookup(items);
    acc[sectionKey] = map;
    return acc;
  },
  {} as Record<SectionKey, Record<string, { name: string; description: string }>>,
);

function enrichSection(sectionKey: Exclude<SectionKey, "reports">, rows: { id: string; enabled: boolean }[]): SwitchRow[] {
  const names = namesBySection[sectionKey] || {};
  return rows.map((r) => ({
    id: r.id,
    name: names[r.id]?.name ?? r.id,
    description: names[r.id]?.description ?? "",
    enabled: r.enabled,
  }));
}

function enrichReports(rows: RoleSettingsRaw["reports"]): ReportsRow[] {
  const names = namesBySection["reports"] || {};
  return rows.map((r) => ({
    id: r.id,
    name: names[r.id]?.name ?? r.id,
    description: names[r.id]?.description ?? "",
    enabled: r.enabled,
    access: r.access,
    accessOptions: r.accessOptions,
  }));
}

const buildColumns = (title: string, onToggle: (rowId: string) => void): DataTableColumn<SwitchRow>[] => [
  {
    id: "setting",
    header: title,
    width: "80%",
    minWidth: 100,
    render: (row) => (
      <Box display="flex" flexDirection="column">
        <Typography variant="md">{row.name}</Typography>
        <Typography variant="sm" color="text.secondary">
          {row.description}
        </Typography>
      </Box>
    ),
  },
  {
    id: "enabled",
    header: "",
    align: "left",
    width: "20%",
    minWidth: 100,
    render: (row) => (
      <Box pl={2}>
        <ToggleSwitch checked={row.enabled} onChange={() => onToggle(row.id)} disabled={false} />
      </Box>
    ),
    disabled: false,
  },
];

export const SwitchSettings: React.FC = () => {
  const roleSettingsRaw = useMemo(() => getRoleSettingsRaw(), []);
  const roleSettings: RoleSettings = useMemo(
    () => ({
      userSettings: enrichSection("userSettings", roleSettingsRaw.userSettings),
      adminSettings: enrichSection("adminSettings", roleSettingsRaw.adminSettings),
      jobSettings: enrichSection("jobSettings", roleSettingsRaw.jobSettings),
      reports: enrichReports(roleSettingsRaw.reports),
      customization: enrichSection("customization", roleSettingsRaw.customization),
      automation: enrichSection("automation", roleSettingsRaw.automation),
      portalSettings: enrichSection("portalSettings", roleSettingsRaw.portalSettings),
      dataAdmin: enrichSection("dataAdmin", roleSettingsRaw.dataAdmin),
      developerSpace: enrichSection("developerSpace", roleSettingsRaw.developerSpace),
      compliance: enrichSection("compliance", roleSettingsRaw.compliance),
      pac: enrichSection("pac", roleSettingsRaw.pac),
      generalPermissions: enrichSection("generalPermissions", roleSettingsRaw.generalPermissions),
    }),
    [roleSettingsRaw],
  );

  const [settings, setSettings] = useState<RoleSettings>(roleSettings);

  useEffect(() => {
    setSettings(roleSettings);
  }, [roleSettings]);

  const handleToggle = useCallback((section: Exclude<SectionKey, "reports">, rowId: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: prev[section].map((r) => (r.id === rowId ? { ...r, enabled: !r.enabled } : r)),
    }));
  }, []);

  const handleToggleReport = useCallback((rowId: string) => {
    setSettings((prev) => ({
      ...prev,
      reports: prev.reports.map((r) => (r.id === rowId ? { ...r, enabled: !r.enabled } : r)),
    }));
  }, []);

  const sectionConfigs: Array<{ key: Exclude<SectionKey, "reports">; title: string; aria: string }> = [
    { key: "userSettings", title: "User Settings", aria: "user settings table" },
    { key: "adminSettings", title: "Admin Settings", aria: "admin settings table" },
    { key: "jobSettings", title: "Job Settings", aria: "job settings table" },
    { key: "customization", title: "Customization", aria: "customization table" },
    { key: "automation", title: "Automation", aria: "automation table" },
    { key: "portalSettings", title: "Portal Settings", aria: "portal settings table" },
    { key: "dataAdmin", title: "Data Admin", aria: "data admin table" },
    { key: "developerSpace", title: "Developer Space", aria: "developer space table" },
    { key: "compliance", title: "Compliance", aria: "compliance table" },
    { key: "pac", title: "PAC", aria: "pac table" },
    { key: "generalPermissions", title: "General Permissions", aria: "general permissions table" },
  ];

  const customRoleOptions = sectionConfigs.map(({ key, title, aria }) => ({
    section: key,
    rows: settings[key],
    ariaLabel: aria,
    columns: buildColumns(title, (id) => handleToggle(key, id)),
    disabled: false,
  }));

  return (
    <>
      {customRoleOptions.slice(0, 3).map((option) => (
        <TableSpacer key={option.section}>
          <DataTable<SwitchRow> rows={option.rows} ariaLabel={option.ariaLabel} columns={option.columns} disabled={option.disabled} />
        </TableSpacer>
      ))}

      <TableSpacer>
        <DataTable<RoleSettings["reports"][number]>
          rows={settings.reports}
          ariaLabel="reports table"
          disabled={false}
          columns={[
            {
              id: "setting",
              header: "Reports",
              width: "60%",
              minWidth: 150,
              render: (row: RoleSettings["reports"][number]) => (
                <Box display="flex" flexDirection="column">
                  <Typography variant="md">{row.name}</Typography>
                  <Typography variant="sm" color="text.secondary">
                    {row.description}
                  </Typography>
                </Box>
              ),
            },
            {
              id: "access",
              header: "",
              width: "20%",
              render: (row: RoleSettings["reports"][number]) =>
                row.accessOptions && row.accessOptions.length ? (
                  <SelectDropdown value={row.access}>
                    {row.accessOptions.map((opt: string) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </SelectDropdown>
                ) : null,
            },
            {
              id: "enabled",
              header: "",
              align: "left",
              width: "20%",
              render: (row: RoleSettings["reports"][number]) => (
                <Box pl={2}>
                  <ToggleSwitch checked={row.enabled} onChange={() => handleToggleReport(row.id)} disabled={false} />
                </Box>
              ),
              disabled: true,
            },
          ]}
        />
      </TableSpacer>

      {customRoleOptions.slice(3).map((option) => (
        <TableSpacer key={option.section}>
          <DataTable<SwitchRow> rows={option.rows} ariaLabel={option.ariaLabel} columns={option.columns} disabled={option.disabled} />
        </TableSpacer>
      ))}
    </>
  );
};

export default SwitchSettings;
