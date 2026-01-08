import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const HeaderSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

interface SettingsHeaderProps {
  title: string;
  className?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, className }) => {
  return (
    <HeaderSection className={className}>
      <Typography variant="h3" component="h2">
        {title}
      </Typography>
    </HeaderSection>
  );
};
