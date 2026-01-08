import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OutlinedInput, Select, type SelectProps, styled } from "@mui/material";
import React from "react";

const StyledSelect = styled(Select)(({ theme }) => ({
  width: "100%",

  ".MuiOutlinedInput-notchedOutline": {
    borderColor: theme.tokens.color.border.light,
    borderWidth: theme.tokens.component.input.borderWidth,
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.tokens.color.border.primaryHover,
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.tokens.color.border.focus,
    borderWidth: theme.tokens.component.input.focusBorderWidth,
  },

  "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.tokens.color.border.light,
  },

  "&.Mui-disabled": {
    cursor: "not-allowed",
  },

  "&.Mui-disabled .MuiSelect-select": {
    cursor: "not-allowed",
    color: theme.tokens.color.text.disabled,
  },

  "&.Mui-disabled .MuiSelect-icon": {
    color: theme.tokens.color.text.disabled,
  },

  ".MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    fontFamily: theme.tokens.typography.fontFamily.primary,
    fontSize: theme.tokens.typography.fontSize.sm,
    color: theme.tokens.color.text.primary,
    height: 40,
  },

  ".MuiSelect-select em": {
    fontStyle: "normal",
    color: theme.tokens.color.text.placeholder,
  },

  ".MuiSelect-icon": {
    color: theme.tokens.color.text.secondary,
  },

  backgroundColor: theme.tokens.color.background.primary,
  borderRadius: theme.tokens.radius.md,
  transition: "all 200ms ease-in-out",
}));

export const SelectDropdown: React.FC<SelectProps> = ({
  MenuProps,
  variant = "outlined",
  size = "small",
  displayEmpty,
  children,
  ...props
}) => {
  const mergedMenuProps = {
    ...(MenuProps || {}),
    anchorOrigin: { vertical: "bottom", horizontal: "left", ...(MenuProps?.anchorOrigin || {}) },
    transformOrigin: { vertical: "top", horizontal: "left", ...(MenuProps?.transformOrigin || {}) },
  } as NonNullable<SelectProps["MenuProps"]>;

  return (
    <StyledSelect
      variant={variant}
      size={size}
      displayEmpty={displayEmpty}
      MenuProps={mergedMenuProps}
      input={<OutlinedInput />}
      IconComponent={ExpandMoreIcon}
      {...props}
    >
      {children}
    </StyledSelect>
  );
};

export default SelectDropdown;
