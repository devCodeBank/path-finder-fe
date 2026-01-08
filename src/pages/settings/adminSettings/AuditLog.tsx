import { SettingsHeader } from "@components/settingsHeader";
import ConstructionIcon from "@mui/icons-material/Construction";
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  padding: ${({ theme }) => theme.spacing(4)};
`;

export const AuditLog: React.FC = () => {
  return (
    <Container>
      <SettingsHeader title="Audit Log" />
      <Box display="flex" alignItems="center" gap={1}>
        <ConstructionIcon color="warning" />
        <Typography variant="lg" color="text.secondary">
          Coming soon. This page is currently under construction.
        </Typography>
      </Box>
    </Container>
  );
};

export default AuditLog;
