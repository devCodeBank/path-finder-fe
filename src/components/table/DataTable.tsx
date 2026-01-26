import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import {
  Box,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  IconButton,
  Checkbox,
} from "@mui/material";
import theme from "@theme/index";
import { useState, type ReactNode } from "react";
import styled from "styled-components";

export type DataTableCellType = "text" | "component" | "dropdown";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** Basic accessor. If omitted, provide `render` */
  field?: keyof T;
  /** Custom cell renderer for full control */
  render?: (row: T) => ReactNode;
  /** Custom header renderer. Useful for header controls (e.g., collapse toggle) */
  headerRender?: (ctx: { collapsed: boolean; toggle: () => void }) => ReactNode;
  /** Text alignment */
  align?: "left" | "right" | "center";
  /** Suggested column width. Accepts px (number) or CSS width string (e.g. "20%", "12rem") */
  width?: number | string;
  /** Optional min/max width constraints */
  minWidth?: number | string;
  maxWidth?: number | string;
  /** Planned cell type support (e.g. dropdown). Not used yet but reserved for future API */
  type?: DataTableCellType;
  /** When true, disables interactive hover states on rows */
  disabled?: boolean;
  /** If true and table is collapsible, renders a built-in toggle in this header cell */
  collapseToggle?: boolean;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  /** Provide unique row id. Defaults to using "id" field if present */
  getRowId?: (row: T, index: number) => string;
  /** Optional ARIA label */
  ariaLabel?: string;
  /** When true, disables interactive hover states on rows */
  disabled?: boolean;
  /** Enables collapsing the table body via a header toggle */
  collapsible?: boolean;
  /** Initial collapsed state when collapsible */
  defaultCollapsed?: boolean;
  /** When true, the table head will not be rendered */
  hideHeader?: boolean;
  /** When true, renders a leading checkbox column for row selection */
  selectable?: boolean;
  /** Controlled selected row ids. If provided, component is controlled. */
  selectedRowIds?: string[];
  /** Fired when selection changes. Works for both controlled and uncontrolled modes. */
  onSelectedRowIdsChange?: (selectedIds: string[]) => void;
}

const StyledTableContainer = styled(TableContainer)`
  background: ${({ theme }) => theme.tokens.color.background.primary};
`;

const HeaderCell = styled(MuiTableCell)`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  background: #FAFAFA;
  border-bottom: 1px solid #CCCCCC80;
  height: 52px;
  padding: 0 16px;
`;

const BodyCell = styled(MuiTableCell)`
  font-size: 13px;
  font-weight: 400;
  border-bottom: 1px solid #CCCCCC80;
  color: #333333;
  height: 52px;
  padding: 0 16px;
`;

const TableRow = styled(MuiTableRow)`
  height: 52px;
  &.MuiTableRow-hover:hover {
    background-color: rgba(234, 234, 234, 0.25);
  }
`;

const toCssSize = (value?: number | string): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const resolveCellValue = <T,>(row: T, column: DataTableColumn<T>): ReactNode => {
  if (column.render) return column.render(row);
  if (column.field) return row[column.field] as ReactNode;
  return null;
};

export const DataTable = <T,>({
  rows,
  columns,
  getRowId,
  ariaLabel = "data table",
  disabled = false,
  collapsible = false,
  defaultCollapsed = false,
  hideHeader = false,
  selectable = false,
  selectedRowIds,
  onSelectedRowIdsChange,
}: DataTableProps<T>) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(defaultCollapsed);
  const collapsed = collapsible ? internalCollapsed : false;
  const toggleCollapsed = () => {
    if (!collapsible) return;
    setInternalCollapsed((prev) => !prev);
  };
  const resolveRowId = (row: T, index: number) => {
    if (getRowId) {
      return getRowId(row, index);
    }

    const possibleId = (row as unknown as { id?: unknown }).id;

    if (typeof possibleId === "string" || typeof possibleId === "number") {
      return String(possibleId);
    }

    return String(index);
  };

  const isSelectionControlled = selectedRowIds !== undefined;
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<Set<string>>(new Set(selectedRowIds ?? []));
  const currentSelectedRowIdSet = isSelectionControlled ? new Set(selectedRowIds) : internalSelectedRowIds;

  const updateSelection = (newSelected: Set<string>) => {
    const nextIds = Array.from(newSelected);
    if (!isSelectionControlled) {
      setInternalSelectedRowIds(new Set(newSelected));
    }
    onSelectedRowIdsChange?.(nextIds);
  };

  const toggleRowSelection = (rowId: string) => {
    if (!selectable || disabled) return;
    const next = new Set(currentSelectedRowIdSet);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    updateSelection(next);
  };

  const areAllRowsSelected = rows.length > 0 && rows.every((row, index) => currentSelectedRowIdSet.has(resolveRowId(row, index)));
  const hasSomeRowsSelected = currentSelectedRowIdSet.size > 0 && !areAllRowsSelected;

  const toggleSelectAll = () => {
    if (!selectable || disabled) return;
    if (areAllRowsSelected) {
      updateSelection(new Set());
    } else {
      const allIds = new Set(rows.map((r, i) => resolveRowId(r, i)));
      updateSelection(allIds);
    }
  };

  return (
    <StyledTableContainer>
      <Table size="small" aria-label={ariaLabel} sx={{ tableLayout: "auto" }}>
        <colgroup>
          {selectable && <col style={{ width: "5%", minWidth: "36px", maxWidth: "36px" }} />}
          {columns.map((col) => (
            <col
              key={col.id}
              style={{
                width: toCssSize(col.width),
                minWidth: toCssSize(col.minWidth),
                maxWidth: toCssSize(col.maxWidth),
              }}
            />
          ))}
        </colgroup>

        {!hideHeader && (
          <TableHead>
            <TableRow>
              {selectable && (
                <HeaderCell align="center" scope="col">
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%" width="5%" minWidth="36px" maxWidth="36px">
                    <Checkbox
                      size="small"
                      checked={areAllRowsSelected}
                      indeterminate={hasSomeRowsSelected}
                      onChange={toggleSelectAll}
                      disabled={disabled}
                      slotProps={{ input: { "aria-label": areAllRowsSelected ? "Deselect all rows" : "Select all rows" } }}
                    />
                  </Box>
                </HeaderCell>
              )}
              {columns.map((col) => (
                <HeaderCell key={col.id} align={col.align ?? "left"} scope="col">
                  {collapsible && col.collapseToggle ? (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                      <IconButton size="small" onClick={toggleCollapsed} aria-label={collapsed ? "Expand table" : "Collapse table"}>
                        {collapsed ? (
                          <KeyboardDoubleArrowDownRoundedIcon fontSize="medium" sx={{ color: theme.tokens.color.text.secondary }} />
                        ) : (
                          <KeyboardDoubleArrowUpRoundedIcon fontSize="medium" sx={{ color: theme.tokens.color.text.secondary }} />
                        )}
                      </IconButton>
                    </Box>
                  ) : col.headerRender ? (
                    col.headerRender({ collapsed, toggle: toggleCollapsed })
                  ) : (
                    col.header
                  )}
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {!collapsed &&
            rows.map((row, rowIndex) => (
              <TableRow key={resolveRowId(row, rowIndex)} hover={!disabled}>
                {selectable && (
                  <BodyCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%" width="36px">
                      <Checkbox
                        size="small"
                        checked={currentSelectedRowIdSet.has(resolveRowId(row, rowIndex))}
                        onChange={() => toggleRowSelection(resolveRowId(row, rowIndex))}
                        disabled={disabled}
                        slotProps={{ input: { "aria-label": `Select row ${resolveRowId(row, rowIndex)}` } }}
                      />
                    </Box>
                  </BodyCell>
                )}
                {columns.map((col) => {
                  const value = resolveCellValue(row, col);
                  const justifyContent = col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start";
                  return (
                    <BodyCell key={col.id} align={col.align ?? "left"}>
                      <Box display="flex" alignItems="center" justifyContent={justifyContent} height="100%" width="100%">
                        {value}
                      </Box>
                    </BodyCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};
