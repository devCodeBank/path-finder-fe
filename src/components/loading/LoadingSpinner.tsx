import { Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export interface LoadingSpinnerProps {
  /** Controls visibility. When false, renders nothing */
  isLoading?: boolean;
  /** Optional MUI `sx` overrides to inject custom styling */
  sx?: SxProps<Theme>;
  /** Optional loading message */
  message?: string;
  /** Spinner size */
  size?: number;
  /** If provided, overrides default spinner + message */
  children?: React.ReactNode;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading = false, sx, message = "Loading...", size = 40, children }) => {
  if (!isLoading) return null;

  return (
    <Container sx={sx}>
      {children ?? (
        <>
          <CircularProgress size={size} />
          <Typography variant="md" color="text.secondary">
            {message}
          </Typography>
        </>
      )}
    </Container>
  );
};

export default LoadingSpinner;
