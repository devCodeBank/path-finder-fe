import { Button } from "@components/buttons/button/Button";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import React from "react";
import styled from "styled-components";

export interface IntegrationCardProps {
  /** Image source for the integration icon */
  iconSrc: string;
  /** Accessible description for the icon */
  iconAlt: string;
  /** Title of the integration */
  title: string;
  /** Short description under the title */
  subtitle?: string;
  /** Button label */
  buttonText: string;
  /** Click handler for the action button */
  onClick: () => void;
}

const Card = styled(Box)`
  background: ${({ theme }) => theme.tokens.color.background.primary};
  border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  border-radius: 0;
  overflow: hidden;
`;

const CardBody = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(3)};
`;

const LeftGroup = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const Icon = styled.img`
  width: 60px;
  height: 60px;
`;

const TextGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled(Typography)<TypographyProps>`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
`;

const Subtitle = styled(Typography)<TypographyProps>`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  opacity: 0.75;
`;

export const IntegrationCard: React.FC<IntegrationCardProps> = ({ iconSrc, iconAlt, title, subtitle, buttonText, onClick }) => {
  return (
    <Card>
      <CardBody>
        <LeftGroup>
          <Icon src={iconSrc} alt={iconAlt} />
          <TextGroup>
            <Title variant="h4">{title}</Title>
            {subtitle ? <Subtitle variant="lg">{subtitle}</Subtitle> : null}
          </TextGroup>
        </LeftGroup>
        <Button size="lg" onClick={onClick}>
          {buttonText}
        </Button>
      </CardBody>
    </Card>
  );
};

export default IntegrationCard;
