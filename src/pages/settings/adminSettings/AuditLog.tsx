
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;
const ResultsCard = styled(Box)`
  border: 1px solid #E6E6E6;
  border-radius: 6px;
  background-color: #FFFFFF;
  overflow: hidden;
`;

const ResultsHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid #E6E6E6;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  background-color: #F9FAFB;
`;

const Row = styled(Box)`
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #E6E6E6;
  color: #333333;
  font-size: 13px;

  &:last-child {
    border-bottom: 0;
  }
`;

const Avatar = styled(Box)`
  height: 32px;
  width: 32px;
  border-radius: 9999px;
  background-color: rgba(234, 234, 234, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #333333;
`;

const Timestamp = styled(Box)`
  color: #333333;
  font-size: 13px;
  white-space: nowrap;
  opacity: 0.7;
`;

export const AuditLog: React.FC = () => {
  const results = [
    {
      id: "1",
      actor: "Pankaj Singh",
      action: "added a user S John",
      time: "August 21, 2025 at 7:35pm",
    },
    {
      id: "2",
      actor: "Pankaj Singh",
      action: "modified CS hiring pipeline, added rejected stage",
      time: "October 11, 2025 at 10:15am",
    },
  ];

  return (
    <Container>

      <ResultsCard>
        <ResultsHeader>
          <Typography component="span" sx={{ fontWeight: 500, fontSize: "14px", color: "#333333" }}>
            {results.length} Results
          </Typography>
        </ResultsHeader>
        {results.map((item) => (
          <Row key={item.id}>
            <Avatar>{item.actor.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</Avatar>
            <Typography component="span" sx={{ fontSize: "13px", fontWeight: 400, color: "#333333" }}>
              {item.actor} {item.action}
            </Typography>
            <Timestamp>{item.time}</Timestamp>
          </Row>
        ))}
      </ResultsCard>
    </Container>
  );
};

export default AuditLog;
