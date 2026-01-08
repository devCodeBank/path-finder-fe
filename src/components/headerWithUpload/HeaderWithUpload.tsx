import InfoCircleIcon from "@assets/icons/info-circle.svg?react";
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

interface HeaderWithUploadProps {
  name: string;
  subtitle?: string;
  onUpload: () => void;
  uploadLabel?: string;
}

const Container = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(4)};
`;

const AvatarTile = styled(Box)`
  width: 94px;
  height: 80px;
  border-radius: 4px;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerCircle = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.tokens.color.background.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InitialsText = styled(Typography)`
  font-weight: 600;
  color: ${({ theme }) => theme.tokens.color.text.primary};
`;

const AvatarColumn = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 104px;
  flex: 0 0 104px;
`;

const Info = styled(Box)`
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.spacing(2)};
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

const NameText = styled(Typography)`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  color: ${({ theme }) => theme.tokens.color.text.primary};
`;

const SubtitleText = styled(Typography)`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  opacity: 0.5;
  color: ${({ theme }) => theme.tokens.color.text.muted};
`;

const UploadText = styled(Typography)`
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.medium};
  color: ${({ theme }) => theme.tokens.color.text.secondary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.tokens.color.brand.primary};
  }
`;

const UploadRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.5)};
  white-space: nowrap;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const InfoIcon = styled(InfoCircleIcon)`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
`;

function computeInitialsFromName(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }

  return parts[0].charAt(0).toUpperCase();
}

export const HeaderWithUpload: React.FC<HeaderWithUploadProps> = ({ name, subtitle, onUpload, uploadLabel = "Upload Photo" }) => {
  const initials = computeInitialsFromName(name);

  return (
    <Container>
      <AvatarColumn>
        <AvatarTile>
          <InnerCircle>
            <InitialsText variant="lg">{initials}</InitialsText>
          </InnerCircle>
        </AvatarTile>
        <UploadRow>
          <UploadText variant="md" onClick={onUpload}>
            {uploadLabel}
          </UploadText>
          <InfoIcon aria-label="upload-info" />
        </UploadRow>
      </AvatarColumn>
      <Info>
        <NameText variant="lg">{name}</NameText>
        {subtitle ? <SubtitleText variant="lg">{subtitle}</SubtitleText> : null}
      </Info>
    </Container>
  );
};

export default HeaderWithUpload;
