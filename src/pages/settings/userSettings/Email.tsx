import EnvelopeIcon from "@assets/icons/envelope.svg";
import { IntegrationCard } from "@components/integrationCard";
import { SettingsHeader } from "@components/settingsHeader";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled(Typography)<TypographyProps>`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.semibold};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ListHeading = styled(Typography)<TypographyProps>`
  padding-top: ${({ theme }) => theme.spacing(3)};
`;

const Benefits = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  list-style: none;
  margin: ${({ theme }) => theme.spacing(3, 0)};
  padding: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  font-weight: 400;
  gap: ${({ theme }) => theme.spacing(1.5)};
  color: ${({ theme }) => theme.tokens.color.text.primary};
  font-size: 14px;

  &::before {
    content: "✓";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.tokens.color.brand.primary};
    font-weight: 700;
  }
`;

export const Email: React.FC = () => {
  const handleConnect = () => {
    console.warn("Connect email clicked");
  };

  return (
    <Container>
      <SettingsHeader title="Email" />

      <SectionTitle variant="lg" component="h3">
        Connect Your Email Account
      </SectionTitle>
      <IntegrationCard
        iconSrc={EnvelopeIcon}
        iconAlt="Email icon"
        title="Email"
        subtitle="Connect your email with pathfinder ats crm"
        buttonText="Connect"
        onClick={handleConnect}
      />

      <ListHeading variant="lg">Why you should connect your email account to Pathfinder ATS CRM?</ListHeading>
      <Benefits>
        <BenefitItem>Manage all your communication directly from one platform.</BenefitItem>
        <BenefitItem>Emails auto-link to profiles.</BenefitItem>
        <BenefitItem>Parse resumes from email.</BenefitItem>
        <BenefitItem>Get email open notifications.</BenefitItem>
        <BenefitItem>Emails sync automatically (e.g., every couple of hours).</BenefitItem>
        <BenefitItem>Full control, disconnect anytime.</BenefitItem>
      </Benefits>
    </Container>
  );
};

export default Email;
