import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { type FC, type ComponentProps } from "react";
import styled from "styled-components";

import type { MenuItem } from "./Sidebar";

const MenuItemButton = styled(IconButton)<{ $isSelected?: boolean; $isExpanded: boolean }>`
  width: ${({ $isExpanded }) => ($isExpanded ? "calc(100% - 12px)" : "56px")};
  height: 40px;
  margin: 0 6px;
  padding: ${({ $isExpanded }) => ($isExpanded ? "0 16px" : "0")};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${({ $isSelected, theme }) => ($isSelected ? "#666666" : theme.tokens.color.overlay.transparent)};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.tokens.color.text.inverse : theme.tokens.color.text.secondary)};
  transition: all 200ms ease-in-out;

  &:hover {
    background: #666666;
    color: white;

    svg {
      color: white;
    }

    .menu-text {
      color: white;
    }
  }
`;

const IconWrapper = styled(Box)<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  margin-left: ${({ $isExpanded }) => ($isExpanded ? "0" : "8px")};
  transition: margin-left 300ms ease-in-out;

  svg {
    width: 24px;
    height: 24px;
    color: inherit;
  }
`;

const MenuText = styled(Typography)<{ $isSelected?: boolean; $isExpanded: boolean }>`
  font-size: ${({ theme }) => theme.tokens.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily.primary};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.tokens.color.text.inverse : theme.tokens.color.text.primary)};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  visibility: ${({ $isExpanded }) => ($isExpanded ? "visible" : "hidden")};
  transition:
    opacity 280ms ease-in-out,
    visibility 280ms ease-in-out,
    transform 300ms ease-in-out,
    max-width 300ms ease-in-out,
    margin-left 300ms ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  max-width: ${({ $isExpanded }) => ($isExpanded ? "calc(100% - 40px)" : "0")};
  margin-left: ${({ $isExpanded }) => ($isExpanded ? "8px" : "0")};
`;

const StyledTooltip = styled(({ className, ...props }: { className?: string } & ComponentProps<typeof Tooltip>) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  z-index: ${({ theme }) => theme.tokens.zIndex.tooltip};

  & .MuiTooltip-tooltip {
    background-color: ${({ theme }) => theme.tokens.component.tooltip.backgroundColor};
    color: ${({ theme }) => theme.tokens.color.text.inverse};
    border-radius: ${({ theme }) => theme.tokens.radius.sm};
    font-size: ${({ theme }) => theme.tokens.typography.fontSize.md};
    font-family: ${({ theme }) => theme.tokens.typography.fontFamily.primary};
    padding: ${({ theme }) => theme.spacing(1, 1.5)};
    font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
    box-shadow: ${({ theme }) => theme.tokens.shadow.md};
  }

  & .MuiTooltip-arrow {
    color: ${({ theme }) => theme.tokens.component.tooltip.backgroundColor};
  }
`;

interface MenuItemProps {
  item: MenuItem;
  isSelected: boolean;
  isExpanded: boolean;
  onItemClick: (item: MenuItem) => void;
}

const SidebarMenuItem: FC<MenuItemProps> = ({ item, isSelected, isExpanded, onItemClick }) => {
  const IconComponent = item.icon;

  const handleClick = () => {
    onItemClick(item);
  };

  return (
    <StyledTooltip title={item.label} placement="right" arrow disableHoverListener={isExpanded}>
      <MenuItemButton $isSelected={isSelected} $isExpanded={isExpanded} onClick={handleClick}>
        <IconWrapper $isExpanded={isExpanded}>
          <IconComponent />
        </IconWrapper>
        <MenuText className="menu-text" $isSelected={isSelected} $isExpanded={isExpanded}>
          {item.label}
        </MenuText>
      </MenuItemButton>
    </StyledTooltip>
  );
};

export default SidebarMenuItem;
