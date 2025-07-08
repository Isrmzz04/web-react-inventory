import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IBorrowingRequest, IBorrowingResponse } from "~/types/main/borrowing.types";
import * as GlobalAction from './global.action'
import type { IInventoryBorrowingResponse } from "~/types/main/inventory.types";

export const createBorrowing = createAsyncThunk(
  'borrowingRequest/store',
  async (
    { payload, callback }: {
      payload: IBorrowingRequest,
      callback: (code: number, payload: IBorrowingResponse) => void
    }
  ) => {
    try {
      const response = await GlobalAction.borrowingRequest(payload);
      callback(response.meta.code, response.data);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const getInventoryByBarcode = createAsyncThunk('inventoryByBarcode/show', async (id: number) => {
  try {
    const response = await GlobalAction.inventoryByBarcode(id)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export type IGlobalState = {
  siderCollapsed: boolean
  borrowingRequest: {
    loading: boolean
    data: any
  }
  inventoryByBarcode: {
    loading: boolean,
    data: IInventoryBorrowingResponse
  }
}

const initialState: IGlobalState = {
  siderCollapsed: false,
  borrowingRequest: {
    loading: false,
    data: {} as any | []
  },
  inventoryByBarcode: {
    loading: false,
    data: {} as IInventoryBorrowingResponse
  }
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
  },
  extraReducers(builder) {
    builder
    .addCase(createBorrowing.pending, (state) => {
      state.borrowingRequest.loading = true
    })
    .addCase(createBorrowing.fulfilled, (state, action) => {
      state.borrowingRequest.loading = false
      state.borrowingRequest.data = action.payload
    })
    .addCase(createBorrowing.rejected, (state) => {
      state.borrowingRequest.loading = false
    })
    .addCase(getInventoryByBarcode.pending, (state) => {
      state.inventoryByBarcode.loading = true      
    })
    .addCase(getInventoryByBarcode.fulfilled, (state, action) => {
      state.inventoryByBarcode.loading = false
      state.inventoryByBarcode.data = action.payload
    })
    .addCase(getInventoryByBarcode.rejected, (state) => {
      state.inventoryByBarcode.loading = false
    })
  }
})

export const { toggleSider } = globalSlice.actions;
export default globalSlice.reducer