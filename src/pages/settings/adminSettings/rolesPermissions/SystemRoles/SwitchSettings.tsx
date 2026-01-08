import ToggleSwitch from "@components/input/toggleSwitch/ToggleSwitch";
import SelectDropdown from "@components/selectDropdown/selectDropdown";
import { DataTable } from "@components/table/DataTable";
import type { DataTableColumn } from "@components/table/DataTable";
import { Box, Typography, MenuItem } from "@mui/material";
import React, { useMemo } from "react";
import styled from "styled-components";

import admin from "../mockData/adminMockData.json";
import collaborator from "../mockData/collaboratorMockData.json";
import nameDescriptions from "../mockData/nameDescriptions.json";
import standardUser from "../mockData/standardUserMockData.json";
import superAdmin from "../mockData/superAdminMockData.json";

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

const getRoleSettingsRaw = (tabName: string): RoleSettingsRaw => {
  const data =
    tabName === "super-admin"
      ? (superAdmin as unknown as RoleSettingsRaw)
      : tabName === "admin"
        ? (admin as unknown as RoleSettingsRaw)
        : tabName === "standard-user"
          ? (standardUser as unknown as RoleSettingsRaw)
          : (collaborator as unknown as RoleSettingsRaw);

  // deep clone to prevent accidental mutations
  return JSON.parse(JSON.stringify(data)) as RoleSettingsRaw;
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

const buildColumns = (title: string): DataTableColumn<SwitchRow>[] => [
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
        <ToggleSwitch checked={row.enabled} onChange={() => {}} disabled={true} />
      </Box>
    ),
    disabled: true,
  },
];

export const SwitchSettings: React.FC<{ tabName: string }> = ({ tabName }) => {
  const roleSettingsRaw = useMemo(() => getRoleSettingsRaw(tabName), [tabName]);
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

  return (
    <>
      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.userSettings}
          ariaLabel="user settings table"
          columns={buildColumns("User Settings")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.adminSettings}
          ariaLabel="admin settings table"
          columns={buildColumns("Admin Settings")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.jobSettings}
          ariaLabel="job settings table"
          columns={buildColumns("Job Settings")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<RoleSettings["reports"][number]>
          rows={roleSettings.reports}
          ariaLabel="reports table"
          disabled={true}
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
                  <SelectDropdown value={row.access} disabled>
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
                  <ToggleSwitch checked={row.enabled} onChange={() => {}} disabled={true} />
                </Box>
              ),
              disabled: true,
            },
          ]}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.customization}
          ariaLabel="customization table"
          columns={buildColumns("Customization")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.automation}
          ariaLabel="automation table"
          columns={buildColumns("Automation")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.portalSettings}
          ariaLabel="portal settings table"
          columns={buildColumns("Portal Settings")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.dataAdmin}
          ariaLabel="data admin table"
          columns={buildColumns("Data Admin")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.developerSpace}
          ariaLabel="developer space table"
          columns={buildColumns("Developer Space")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.compliance}
          ariaLabel="compliance table"
          columns={buildColumns("Compliance")}
          disabled={true}
        />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow> rows={roleSettings.pac} ariaLabel="pac table" columns={buildColumns("PAC")} disabled={true} />
      </TableSpacer>

      <TableSpacer>
        <DataTable<SwitchRow>
          rows={roleSettings.generalPermissions}
          ariaLabel="general permissions table"
          columns={buildColumns("General Permissions")}
          disabled={true}
        />
      </TableSpacer>
    </>
  );
};

export default SwitchSettings;
