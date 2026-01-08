import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  padding: ${({ theme }) => theme.spacing(4)};
  max-width: 1200px;
  margin: 0 auto;
`;

export const Mail: React.FC = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Mail Page
      </Typography>
      <Typography variant="lg">This is a placeholder for the Mail management page.</Typography>
    </Container>
  );
};

export default Mail;
