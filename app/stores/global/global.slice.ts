import { createSlice } from "@reduxjs/toolkit"

export type IGlobalState = {
  siderCollapsed: boolean
}

const initialState: IGlobalState = {
  siderCollapsed: false,
}

const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<IGlobalState> }) => {
      Object.assign(state, action.payload)
    },
    toggleSider: (state) => {
      state.siderCollapsed = !state.siderCollapsed;
    }
  }
})

export const { toggleSider } = globalSlice.actions;
export default globalSlice.reducer