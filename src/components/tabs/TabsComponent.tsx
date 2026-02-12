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
  value?: string;
  onChange?: (value: string) => void;
}

const StyledTabs = styled(Tabs)`
  background-color: ${({ theme }) => theme.tokens.color.background.secondary};
  color: ${({ theme }) => theme.tokens.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  width: 100%;
 


  .MuiTab-root {
       color: ${({ theme }) => theme.tokens.color.text.primary};
    text-transform: capitalize;
   
    &.Mui-selected {
       background-color: ${({ theme }) => theme.tokens.color.background.primary};
    }
  }

  .MuiTabs-indicator {
     height: 0.25rem;
    border-radius: 4px;
    background-color: #6E41E2;
  }
`;

export default function TabsComponent(props: TabsComponentProps) {
  const [internalValue, setInternalValue] = useState(props.defaultTab || props.tabs[0].value);
  const value = props.value ?? internalValue;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (props.onChange) {
      props.onChange(newValue);
      return;
    }
    setInternalValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <StyledTabs value={value} onChange={handleChange} aria-label="lab API tabs example">
        {props.tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </StyledTabs>
      <Box sx={{ mt: 2 }}>
        {props.tabs.find((tab) => tab.value === value)?.content || "No content"}
      </Box>
    </Box>
  );
}
