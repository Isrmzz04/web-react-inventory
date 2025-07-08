import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as DashboardAction from './dashboard.action'
import type { IDashboardResponse } from "~/types/main/dashboard"

export const getDashboard = createAsyncThunk('dashboard/index', async () => {
  try {
    const response = await DashboardAction.index()
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export type TDashboardState = {
  isLoading: boolean
  isError: boolean
  datas: IDashboardResponse
}

const initialState: TDashboardState = {
  isLoading: false,
  isError: false,
  datas: {} as IDashboardResponse
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<TDashboardState> }) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers(builder) {
    builder
    .addCase(getDashboard.pending, (state) => {
      state.isLoading = true
      state.isError = false
    })
    .addCase(getDashboard.fulfilled, (state, action) => {
      state.isLoading = false
      state.isError = false
      state.datas = action?.payload
    })
    .addCase(getDashboard.rejected, (state) => {
      state.isLoading = false
      state.isError = true
    })
  }
})

export const { updateState } = dashboardSlice.actions
export default dashboardSlice.reducer