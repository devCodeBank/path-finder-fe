import { createSelector } from "@reduxjs/toolkit";

import type { Team, TeamRow } from "../../types/teams";
import type { RootState } from "../store";

export const selectTeamsState = (state: RootState) => state.teams;

export const selectTeams = (state: RootState): Team[] => state.teams.items;
export const selectTeamsStatus = (state: RootState) => state.teams.status;
export const selectTeamsError = (state: RootState) => state.teams.error;

export const makeSelectMemberById = () =>
  createSelector(
    [selectTeams, (_: RootState, memberId: string | null) => memberId],
    (teams, memberId): { member: TeamRow; team: Team } | null => {
      if (!memberId) return null;
      for (const team of teams) {
        const member = team.members.find((m) => m.id === memberId);
        if (member) return { member, team };
      }
      return null;
    },
  );
