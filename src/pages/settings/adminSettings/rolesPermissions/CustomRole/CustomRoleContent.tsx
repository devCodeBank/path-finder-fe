import SelectDropdown from "@components/selectDropdown/selectDropdown";
import { DataTable } from "@components/table/DataTable";
import type { DataTableColumn } from "@components/table/DataTable";
import { MenuItem } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import mockData from "../mockData/collaboratorMockData.json";

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

type PermissionFields = keyof ModulePermissions;

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

const getContentRows = (): TabContentRows => {
  const paredData = JSON.parse(JSON.stringify(mockData));
  return paredData as unknown as TabContentRows;
};

const formatModulesForTable = (modules: TabContentRows["module"]) => {
  return Object.entries(modules).map(([moduleName, permissions]) => ({
    id: moduleName,
    module: permissions.name,
    ...permissions,
  }));
};

export const CustomRoleContent: React.FC = () => {
  const formattedModules = useMemo(() => {
    const mod = getContentRows();
    return formatModulesForTable(mod.module);
  }, []);

  type TableRowType = { id: string } & { module: string } & Partial<ModulePermissions>;
  const [rows, setRows] = useState<TableRowType[]>(formattedModules as TableRowType[]);

  useEffect(() => {
    setRows(formattedModules as TableRowType[]);
  }, [formattedModules]);

  const fieldOptionsMap: Partial<Record<PermissionFields, ModuleEnum[]>> = {
    canView: [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly, ModuleEnum.Nothing],
    canEdit: [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly, ModuleEnum.Nothing],
    canDelete: [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly, ModuleEnum.Nothing],
    changeOwnership: [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly],
    fileAccess: [ModuleEnum.Everything, ModuleEnum.TeamOnly, ModuleEnum.OwnedOnly],
  };

  const getDropdownOptions = (field: PermissionFields) => {
    if (field === "canCreate") return ["Yes", "No"];
    if (field === "name") return [];
    return fieldOptionsMap[field] ?? Object.values(ModuleEnum);
  };

  const renderDropdown = (row: TableRowType, field: PermissionFields, isBoolean: boolean) => {
    const options = getDropdownOptions(field);
    const rawValue = (row as Partial<ModulePermissions>)[field] as ModulePermissions[PermissionFields] | undefined;
    const value = isBoolean ? (rawValue ? "Yes" : "No") : (rawValue ?? undefined);

    if (rawValue === null) {
      return null;
    }
    return (
      <SelectDropdown
        value={value}
        disabled={false}
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
      <DataTable<TableRowType> rows={rows} columns={columns} disabled={false} />

      <SwitchSettings />
    </>
  );
};

export default CustomRoleContent;
