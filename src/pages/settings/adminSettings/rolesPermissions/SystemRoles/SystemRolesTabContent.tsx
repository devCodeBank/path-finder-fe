import SelectDropdown from "@components/selectDropdown/selectDropdown";
import { DataTable } from "@components/table/DataTable";
import type { DataTableColumn } from "@components/table/DataTable";
import { MenuItem, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import admin from "../mockData/adminMockData.json";
import collaborator from "../mockData/collaboratorMockData.json";
import standardUser from "../mockData/standardUserMockData.json";
import superAdmin from "../mockData/superAdminMockData.json";

import SwitchSettings from "./SwitchSettings";

enum ModuleEnum {
  Everything = "Everything",
  TeamOnly = "Team Only",
  OwnedOnly = "Owned Only",
  Nothing = "Nothing",
}

interface ModulePermissions {
  name: string;
  canView: ModuleEnum;
  canCreate: boolean;
  canEdit: ModuleEnum;
  canDelete: ModuleEnum;
  changeOwnership: ModuleEnum;
  fileAccess: ModuleEnum;
}

interface TabContentRows {
  module: {
    dashboard: {
      name: string;
      canView: ModuleEnum;
    };
    candidates: ModulePermissions;
    jobs: ModulePermissions;
    companies: ModulePermissions;
    contacts: ModulePermissions;
    deals: ModulePermissions;
    folders: ModulePermissions;
    placementandbilling: ModulePermissions;
    interviews: ModulePermissions;
  };
}

const tabDataMap: Record<string, TabContentRows> = {
  "super-admin": superAdmin as unknown as TabContentRows,
  admin: admin as unknown as TabContentRows,
  "standard-user": standardUser as unknown as TabContentRows,
  collaborator: collaborator as unknown as TabContentRows,
};

const getMockTabContentRows = (tabName: string): TabContentRows => {
  const data = tabDataMap[tabName];
  if (!data) throw new Error(`Invalid role: ${tabName}`);
  return structuredClone(data) as unknown as TabContentRows;
};

const formatModulesForTable = (modules: TabContentRows["module"]) => {
  return Object.entries(modules).map(([moduleName, permissions]) => ({
    id: moduleName,
    module: permissions.name,
    ...permissions,
  }));
};

export const TabContent: React.FC<{ tabName: string }> = ({ tabName }) => {
  const formattedModules = useMemo(() => {
    const mod = getMockTabContentRows(tabName);
    return formatModulesForTable(mod.module);
  }, [tabName]);

  type TableRowType = { id: string } & { module: string } & Partial<ModulePermissions>;
  const [rows, setRows] = useState<TableRowType[]>(formattedModules as TableRowType[]);

  useEffect(() => {
    setRows(formattedModules as TableRowType[]);
  }, [formattedModules]);

  const renderDropdown = (row: TableRowType, field: keyof ModulePermissions, isBoolean: boolean) => {
    const fullOptions = [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly, ModuleEnum.Nothing];
    const partialOptions = [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly];
    const moduleFieldOptions: Record<string, ModuleEnum[]> = {
      canView: fullOptions,
      canEdit: fullOptions,
      canDelete: fullOptions,
      changeOwnership: partialOptions,
      fileAccess: partialOptions,
    };
    if (!isBoolean && !(field in moduleFieldOptions)) {
      throw new Error(`No options defined for field "${field}"`);
    }
    const options = isBoolean ? ["Yes", "No"] : moduleFieldOptions[field];

    const rawValue = (row as Partial<ModulePermissions>)[field] as ModulePermissions[keyof ModulePermissions] | undefined;
    const value = isBoolean ? (rawValue ? "Yes" : "No") : (rawValue ?? undefined);

    if (rawValue === null) {
      return null;
    }
    return (
      <SelectDropdown
        value={value}
        disabled={true}
        onChange={(e) => {
          const next = isBoolean ? (e.target.value as string) === "Yes" : (e.target.value as ModuleEnum);
          setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [field]: next } : r)));
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </SelectDropdown>
    );
  };

  const columns: DataTableColumn<TableRowType>[] = [
    {
      id: "module",
      header: "Module",
      field: "module",
      minWidth: 140,
    },
    {
      id: "canView",
      header: "Can View",
      field: "canView",
      minWidth: 140,
      render: (row) => renderDropdown(row, "canView", false),
    },
    {
      id: "canCreate",
      header: "Can Create",
      field: "canCreate",
      minWidth: 140,
      render: (row) => renderDropdown(row, "canCreate", true),
    },
    {
      id: "canEdit",
      header: "Can Edit",
      field: "canEdit",
      minWidth: 140,
      render: (row) => renderDropdown(row, "canEdit", false),
    },
    {
      id: "canDelete",
      header: "Can Delete",
      field: "canDelete",
      minWidth: 140,
      render: (row) => renderDropdown(row, "canDelete", false),
    },
    {
      id: "changeOwnership",
      header: "Change Ownership",
      field: "changeOwnership",
      minWidth: 140,
      render: (row) => renderDropdown(row, "changeOwnership", false),
    },
    {
      id: "fileAccess",
      header: "File Access",
      field: "fileAccess",
      minWidth: 140,
      render: (row) => renderDropdown(row, "fileAccess", false),
    },
  ];

  return (
    <>
      <Typography variant="md" sx={{ mb: 2.25 }}>
        This role is system-defined and cannot be edited or deleted. If custom roles with specific permissions are required, a new role can
        be created.
      </Typography>
      <DataTable<TableRowType> rows={rows} columns={columns} disabled={true} />

      <SwitchSettings tabName={tabName} />
    </>
  );
};

export default TabContent;
