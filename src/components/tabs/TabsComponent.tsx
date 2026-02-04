import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";
import styled from "styled-components";

interface TabsComponentProps {
  tabs: {
    label: string;
    value: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
}

const StyledTabs = styled(Tabs)`
  background-color: #F3F4F6;
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  padding: 6px 8px;


  .MuiTab-root {
    color: #333333;
    text-transform: none;
    font-size: 14px;
    font-weight: 500;
    min-height: 36px;
    padding: 8px 14px;
   
    &.Mui-selected {
      color: #333333;
    }
  }

  .MuiTabs-indicator {
    height: 4px;
    border-radius: 4px;
    background-color: #6E41E2;
  }
`;

export default function TabsComponent(props: TabsComponentProps) {
  const [value, setValue] = useState(props.defaultTab || props.tabs[0].value);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <StyledTabs value={value} onChange={handleChange} aria-label="lab API tabs example">
        {props.tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </StyledTabs>
      <Box>{props.tabs.find((tab) => tab.value === value)?.content || "No content"}</Box>
    </Box>
  );
}
