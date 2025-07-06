import type { IBorrowingRequest, IBorrowingResponse } from '~/types/main/borrowing.types'
import * as BorrowingAction from './borrowing.action'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IPageInfoResponse, TPage, TRequestParams } from '~/types/global.types'
import mockBorrowings from "~/mocks/borrowings.json"

export const getAllBorrowings = createAsyncThunk('borrowing/index', async (payload: TRequestParams) => {
  try {
    const response = await BorrowingAction.index(payload)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const getOneBorrowing = createAsyncThunk('borrowing/show', async (id: number) => {
  try {
    const response = await BorrowingAction.show(id)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const createBorrowing = createAsyncThunk(
  'borrowing/store',
  async (
    { payload, callback }: {
      payload: IBorrowingRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await BorrowingAction.store(payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const updateBorrowing = createAsyncThunk(
  'borrowing/update',
  async (
    { id, payload, callback }: {
      id: number,
      payload: IBorrowingRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await BorrowingAction.update(id, payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const deleteBorrowing = createAsyncThunk(
  'borrowing/destroy',
  async (
    { id, callback }: {
      id: number,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await BorrowingAction.destroy(id);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)


export type TBorrowingState = {
  isLoading: boolean
  isError: boolean
  listBorrowings: Array<IBorrowingResponse>
  detailBorrowing: IBorrowingResponse
  pagination: IPageInfoResponse
}

const initialState: TBorrowingState = {
  isLoading: false,
  isError: false,
  listBorrowings: mockBorrowings.data.page_data,
  detailBorrowing: {} as IBorrowingResponse,
  pagination: mockBorrowings.data.page_info as IPageInfoResponse
}

const borrowingSlice = createSlice({
  name: 'borrowing',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<TBorrowingState> }) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAllBorrowings
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getAllBorrowings
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.listBorrowings = action?.payload?.page_data
          state.pagination = action?.payload?.page_info
        })
      .addCase(getAllBorrowings
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(getOneBorrowing
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getOneBorrowing
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.detailBorrowing = action?.payload
        })
      .addCase(getOneBorrowing
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(createBorrowing
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(createBorrowing
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(createBorrowing
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(updateBorrowing
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(updateBorrowing
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(updateBorrowing
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(deleteBorrowing
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(deleteBorrowing
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(deleteBorrowing
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
  }
})

export const { updateState } = borrowingSlice.actions
export default borrowingSlice.reducer