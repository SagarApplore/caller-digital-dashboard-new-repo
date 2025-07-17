import endpoints from "@/lib/endpoints";
import { IAgent } from "@/types/agent";
import apiRequest from "@/utils/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface AgentsState {
  agents: IAgent[];
  loading: boolean;
  error: string | null;
}

const initialState: AgentsState = {
  agents: [],
  loading: false,
  error: null,
};

// Async thunk to create agent
export const createAgent = createAsyncThunk(
  "agents/createAgent",
  async (agentData: Omit<IAgent, "_id" | "createdAt">, thunkAPI) => {
    try {
      const res = await apiRequest(endpoints.assistants.create, agentData);
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create agent");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create agent"
      );
    }
  }
);

// You can add getAllAgents, deleteAgent etc. here too

const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    setAgents(state, action: PayloadAction<IAgent[]>) {
      state.agents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAgent.fulfilled,
        (state, action: PayloadAction<IAgent>) => {
          state.loading = false;
          state.agents.push(action.payload);
        }
      )
      .addCase(createAgent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAgents } = agentsSlice.actions;
export default agentsSlice.reducer;
