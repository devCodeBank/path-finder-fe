import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import initialTeams from "../../mock/teams.json";
import type { Team } from "../../types/teams";

export type TeamsStatus = "idle" | "loading" | "succeeded" | "failed";
export type TeamsState = {
  items: Team[];
  status: TeamsStatus;
  error: string | null;
};

const initialState: TeamsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchTeams = createAsyncThunk<Team[]>("teams/fetchTeams", async () => {
  // Prototype: fetch from static JSON; do not modify the JSON.
  try {
    const response = await fetch("/mock/teams.json");
    if (!response.ok) {
      throw new Error(`Failed to load teams.json (${response.status})`);
    }
    const data = (await response.json()) as Team[];
    return data;
  } catch {
    // Fallback to bundled initial data for prototype resilience
    return initialTeams as Team[];
  }
});

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      const newTeam = action.payload;
      const existingIndex = state.items.findIndex((t) => t.id === newTeam.id);
      if (existingIndex >= 0) {
        state.items[existingIndex] = newTeam;
      } else {
        state.items.push(newTeam);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch teams";
      });
  },
});

export const { addTeam } = teamsSlice.actions;
export default teamsSlice.reducer;
