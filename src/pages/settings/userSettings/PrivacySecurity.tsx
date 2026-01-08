import { Button } from "@components/buttons/button/Button";
import { ToggleSwitch } from "@components/input/toggleSwitch";
import { SettingsHeader } from "@components/settingsHeader";
import { Box, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import styled from "styled-components";

const Container = styled(Box)`
  width: 100%;
  box-sizing: border-box;
`;

const Card = styled(Box)`
  background: ${({ theme }) => theme.tokens.color.background.primary};
  border: 1px solid ${({ theme }) => theme.tokens.color.border.mediumLight};
  border-radius: ${({ theme }) => theme.tokens.radius.md};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const CardHeader = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.medium};
  padding: ${({ theme }) => theme.spacing(1.5, 2)};
`;

const CardHeaderText = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.tokens.color.text.primary};
`;

const Row = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.tokens.color.border.medium};

  &:last-child {
    border-bottom: none;
  }
`;

const RowLeft = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled(Typography)`
  font-size: 16px;
  color: ${({ theme }) => theme.tokens.color.text.primary};
`;

const Description = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
`;

const ValueText = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.secondary};
`;

const LinkText = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.link};
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.tokens.color.text.linkHover};
    text-decoration: underline;
  }
`;

const InlineGroup = styled(Box)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const PrivacySecurity: React.FC = () => {
  const [primaryEmail] = useState<string>("pksaucklandnz@cns.com");
  const [newDeviceVerification, setNewDeviceVerification] = useState<boolean>(false);
  const [twoStepVerification, setTwoStepVerification] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(["64123456789"]);

  const hasPhoneNumbers = useMemo(() => phoneNumbers.length > 0, [phoneNumbers.length]);

  const handleChangePassword = () => {
    console.warn("Change Password clicked");
  };

  const handleShowRecoveryCodes = () => {
    console.warn("Show Recovery Codes clicked");
  };

  const handleAddPhone = () => {
    console.warn("Add Phone clicked");
  };

  const handleDeletePhone = (index: number) => () => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEmail = () => {
    console.warn("Add Email clicked");
  };

  const handleSetupApp = () => {
    console.warn("Set Up App clicked");
  };

  return (
    <Container>
      <SettingsHeader title="Privacy & Security" />

      {/* Default Security */}
      <Card>
        <CardHeader>
          <CardHeaderText>Default Security</CardHeaderText>
        </CardHeader>

        <Row>
          <RowLeft>
            <Label>Primary Email</Label>
            <ValueText>{primaryEmail}</ValueText>
          </RowLeft>
          <Box />
        </Row>

        <Row>
          <RowLeft>
            <Label>Password</Label>
            <Description>Change your password</Description>
          </RowLeft>
          <Button variant="neutral" size="sm" onClick={handleChangePassword}>
            Change Password
          </Button>
        </Row>

        <Row>
          <RowLeft>
            <Label>Recovery Codes</Label>
            <Description>
              If you lose access to your password or verification methods, you will be able to log in with a recovery code.
            </Description>
            <InlineGroup>
              <LinkText>Learn More About Recovery Codes</LinkText>
            </InlineGroup>
          </RowLeft>
          <Button variant="neutral" size="sm" onClick={handleShowRecoveryCodes}>
            Show Codes
          </Button>
        </Row>
      </Card>

      {/* Login Security */}
      <Card>
        <CardHeader>
          <CardHeaderText>Login Security</CardHeaderText>
        </CardHeader>

        <Row>
          <RowLeft>
            <Label>New Device Verification</Label>
            <Description>
              Require additional verification step for logins from a new device or browser. <LinkText>Learn More</LinkText>
            </Description>
          </RowLeft>
          <ToggleSwitch checked={newDeviceVerification} onChange={setNewDeviceVerification} label="" />
        </Row>

        <Row>
          <RowLeft>
            <Label>Two-Step Verification</Label>
            <Description>
              Require a verification code when you log in with a password. <LinkText>Learn More</LinkText>
            </Description>
          </RowLeft>
          <ToggleSwitch checked={twoStepVerification} onChange={setTwoStepVerification} label="" />
        </Row>
      </Card>

      {/* Verification Methods */}
      <Card>
        <CardHeader>
          <CardHeaderText>Verification Methods</CardHeaderText>
        </CardHeader>

        <Row>
          <RowLeft>
            <Label>Phone Numbers</Label>
            <Description>Add a phone number to receive code via TEXT message.</Description>
            {hasPhoneNumbers && (
              <Box style={{ marginTop: 8 }}>
                {phoneNumbers.map((phone, index) => (
                  <InlineGroup key={phone} style={{ marginTop: index === 0 ? 0 : 6 }}>
                    <ValueText>{phone}</ValueText>
                    <LinkText onClick={handleDeletePhone(index)}>Delete</LinkText>
                  </InlineGroup>
                ))}
              </Box>
            )}
          </RowLeft>
          <Button variant="neutral" size="sm" onClick={handleAddPhone}>
            Add Phone
          </Button>
        </Row>

        <Row>
          <RowLeft>
            <Label>Alternate Emails</Label>
            <Description>Add alternate emails in addition to your default email to receive a verification code.</Description>
          </RowLeft>
          <Button variant="neutral" size="sm" onClick={handleAddEmail}>
            Add Email
          </Button>
        </Row>

        <Row>
          <RowLeft>
            <Label>Authenticator App</Label>
            <Description>Set up an authenticator on your mobile device to receive verification code.</Description>
          </RowLeft>
          <Button variant="neutral" size="sm" onClick={handleSetupApp}>
            Set Up App
          </Button>
        </Row>
      </Card>
    </Container>
  );
};

export default PrivacySecurity;
