import FilterIcon from "@assets/icons/filter.svg?react";
import { IconButton, type IconButtonProps } from "@mui/material";
import theme from "@theme/index";
import React from "react";
import styled from "styled-components";

interface FilterButtonProps extends IconButtonProps {
  icon?: React.ReactNode;
}

const StyledButton = styled(IconButton)`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.tokens.color.border.primary};
  border-radius: ${({ theme }) => theme.tokens.radius.sm};
  background: ${({ theme }) => theme.tokens.color.background.primary};
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.tokens.color.background.secondary};
  }
`;

export const FilterButton: React.FC<FilterButtonProps> = ({
  icon = <FilterIcon width={16} height={16} style={{ color: theme.tokens.color.brand.primary }} />,
  ...props
}) => (
  <StyledButton aria-label="filter" {...props}>
    {icon}
  </StyledButton>
);

export default FilterButton;
