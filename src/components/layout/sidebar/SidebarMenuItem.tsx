import { Tooltip } from "@mui/material";
import { type FC } from "react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "./Sidebar";

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
    <Tooltip title={item.label} placement="right" arrow disableHoverListener={isExpanded}>
      <button
        onClick={handleClick}
        className={cn(
          "group relative flex items-center h-[34px] mx-[6px] rounded-[4px] transition-all duration-200 ease-in-out mb-2",
          isExpanded ? "w-[calc(100%-12px)] px-3 justify-start" : "w-[56px] justify-center",
          isSelected
            ? "bg-[#666666] text-white"
            : "bg-transparent text-[#6B7280] hover:bg-[#666666] hover:text-white"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-[34px] shrink-0 transition-all duration-300 ease-in-out",
            !isExpanded && "ml-0"
          )}
        >
          <IconComponent className={cn(
            "w-[24px] h-[24px] transition-colors duration-200",
            isSelected ? "text-white" : "text-inherit group-hover:text-white"
          )} />
        </div>

        <span
          className={cn(
            "text-[14px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "opacity-100 visible max-w-[calc(100%-40px)] ml-2" : "opacity-0 invisible max-w-0 ml-0",
            isSelected ? "text-white" : "text-[#333333] group-hover:text-white"
          )}
        >
          {item.label}
        </span>
      </button>
    </Tooltip>
  );
};

export default SidebarMenuItem;
