import { CustomBreadCrumbs } from "@components/breadCrumbs/BreadCrumbs";
import { Button } from "@components/buttons/button/Button";
import { AutoComplete } from "@components/input/autoComplete";
import { SelectInput, type SelectOption } from "@components/input/selectInput/SelectInput";
import { TextInput } from "@components/input/textInput/TextInput";
import { SettingsHeader } from "@components/settingsHeader";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import type { SelectChangeEvent } from "@mui/material";
import { Avatar, Box, IconButton } from "@mui/material";
import { useAppDispatch } from "@redux/hooks";
import { addTeam } from "@redux/slices/teamsSlice";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import type { Team, TeamRow } from "../../../../types/teams";

import members from "./membersData.json";

const StyledSettingsHeader = styled(SettingsHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const RightActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const FormGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
`;

// Selected members layout below the toolbar
const SelectedList = styled(Box)`
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: min-content;
  gap: ${({ theme }) => theme.spacing(2)};
  align-content: start;

  /* Make it fill parent container */
  flex: 1;
  height: 100%;

  /* Only scroll if we truly run out of space both directions */
  overflow: visible;
`;

const MemberBadge = styled(Box)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.tokens.color.background.autofill};
  border: 1px solid ${({ theme }) => theme.tokens.color.overlay.grayLight};
  border-radius: ${({ theme }) => theme.tokens.radius.full};
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  margin: 0;
  width: 100%;
  break-inside: avoid;
`;

const TagName = styled.span`
  font-size: ${({ theme }) => theme.tokens.typography.fontSize.sm};
  color: ${({ theme }) => theme.tokens.color.text.primary};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.normal};
`;

const StyledClearRoundedIcon = styled(ClearRoundedIcon)`
  font-size: 14px;
  color: ${({ theme }) => theme.tokens.color.text.primary};
`;

export const CreateTeam: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [teamName, setTeamName] = useState("");
  const [teamAdmin, setTeamAdmin] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [teamStatus, setTeamStatus] = useState("active");

  const [touched, setTouched] = useState({ teamName: false, teamAdmin: false });

  const statusOptions = useMemo<SelectOption[]>(
    () => [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    [],
  );

  const handleCancel = () => {
    navigate("/settings/admin/teams");
  };

  const handleCreateTeam = () => {
    if (!isFormValid) {
      setTouched({ teamName: true, teamAdmin: true });
      return;
    }

    const statusLabel = teamStatus === "active" ? "Active" : "Inactive";
    const rows: TeamRow[] = selectedMembers.map((m) => ({
      id: m.id,
      name: m.name,
      title: "",
      role: m.name === teamAdmin || m.email === teamAdmin ? "Administrator" : "Member",
      status: statusLabel,
    }));

    const newId = `team-${teamName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const newTeam: Team = {
      id: newId,
      teamName: teamName.trim(),
      teamDescription: "",
      metrics: { openJobs: 0, closedJobs: 0, archivedJobs: 0 },
      members: rows,
    };

    dispatch(addTeam(newTeam));
    navigate("/settings/admin/teams");
  };

  const onBlur = (field: keyof typeof touched) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  type Member = { id: string; name: string; email: string; avatar: string };
  const selectedMembers = useMemo<Member[]>(() => (members as Member[]).filter((m) => teamMembers.includes(m.email)), [teamMembers]);

  const filterMembers = (options: Member[], { inputValue }: { inputValue: string }) =>
    options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));

  const isFormValid = teamName.trim() !== "" && teamAdmin.trim() !== "";

  return (
    <Container>
      <StyledSettingsHeader title="Teams" />
      <CustomBreadCrumbs breadcrumbs={[{ label: "Home", href: "/settings/admin/teams" }, { label: "Create Team" }]} />

      <FormGrid>
        <TextInput
          label="Team Name"
          placeholder="E.g. Software Engineering Hiring Team"
          required
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          touched={touched.teamName}
          onBlur={onBlur("teamName")}
        />
        <TextInput
          label="Team Admin Name"
          placeholder="Start Typing Name or Email"
          required
          value={teamAdmin}
          onChange={(e) => setTeamAdmin(e.target.value)}
          touched={touched.teamAdmin}
          onBlur={onBlur("teamAdmin")}
        />
        <Box>
          <AutoComplete
            label="Team Members"
            options={members}
            getOptionLabel={(option) => option.name}
            onChange={(_e, value) => setTeamMembers(value.map((v) => v.email))}
            filterOptions={filterMembers}
            placeholder="Start Typing Name or Email"
            isOptionEqualToValue={(option, value) => option.email === value.email}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={option.avatar} alt={option.name} sx={{ width: 24, height: 24 }} />
                  <Box display="flex" flexDirection="column">
                    <span>{option.name}</span>
                    <span style={{ color: "#666", fontSize: 12 }}>{option.email}</span>
                  </Box>
                </Box>
              </li>
            )}
          />
        </Box>
        <SelectInput
          label="Team Status"
          value={teamStatus}
          options={statusOptions}
          onChange={(e: SelectChangeEvent<string>) => setTeamStatus(e.target.value)}
        />
      </FormGrid>
      <Toolbar>
        <RightActions>
          <Button size="sm" variant="neutral" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreateTeam} disabled={!isFormValid}>
            Create Team
          </Button>
        </RightActions>
      </Toolbar>

      {selectedMembers.length > 0 && (
        <SelectedList aria-label="selected team members">
          {selectedMembers.map((m) => (
            <MemberBadge key={m.id}>
              <TagName>{m.name}</TagName>
              <Box flex={1} />
              <IconButton
                size="small"
                aria-label={`remove ${m.name}`}
                onClick={() => setTeamMembers((prev) => prev.filter((e) => e !== m.email))}
              >
                <StyledClearRoundedIcon />
              </IconButton>
            </MemberBadge>
          ))}
        </SelectedList>
      )}
    </Container>
  );
};

export default CreateTeam;
