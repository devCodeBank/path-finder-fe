import TabsComponent from "@components/tabs/TabsComponent";
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

import { Button } from "../../components/buttons/button/Button";

const DashboardContainer = styled(Box)`
  padding: ${({ theme }) => theme.spacing(4)};
  max-width: 1200px;
  margin: 0 auto;
`;

const ButtonSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ButtonRow = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`;

const SizeLabel = styled(Typography)`
  min-width: 60px;
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.semibold};
`;

export const Dashboard: React.FC = () => {
  const variants = ["solid", "outlined", "neutral", "text", "textNeutral", "soft", "danger"] as const;
  const sizes = ["sm", "md", "lg"] as const;

  return (
    <DashboardContainer>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h3" component="h1" gutterBottom>
        Button Component Testing
      </Typography>
      <Typography variant="body1" gutterBottom>
        Testing all button variants and sizes
      </Typography>

      {variants.map((variant) => (
        <ButtonSection key={variant}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ textTransform: "capitalize" }}>
            {variant} Buttons
          </Typography>

          {sizes.map((size) => (
            <ButtonRow key={size}>
              <SizeLabel variant="body2">{size.toUpperCase()}:</SizeLabel>
              <Button variant={variant} size={size}>
                {variant} {size}
              </Button>
              <Button variant={variant} size={size} disabled>
                Disabled
              </Button>
              <Button variant={variant} size={size} loading>
                Loading
              </Button>
            </ButtonRow>
          ))}
        </ButtonSection>
      ))}

      <ButtonSection>
        <Typography variant="h5" component="h2" gutterBottom>
          Full Width Examples
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <Button variant="solid" size="md" fullWidth>
            Full Width Solid Button
          </Button>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Button variant="outlined" size="md" fullWidth>
            Full Width Outlined Button
          </Button>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Button variant="neutral" size="md" fullWidth>
            Full Width Subtle Button
          </Button>
        </Box>
      </ButtonSection>
      <TabsComponent
        tabs={[
          { label: "tab 1", value: "1", content: <Box>Tab Content 1</Box> },
          { label: "Tab 2", value: "2", content: <Box>Tab Content 2</Box> },
          { label: "Tab 3", value: "3", content: <Box>Tab Content 3</Box> },
        ]}
      />
    </DashboardContainer>
  );
};

export default Dashboard;
