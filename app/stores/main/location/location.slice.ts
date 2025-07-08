import type { ILocationRequest, ILocationResponse } from '~/types/main/location.types'
import * as LocationAction from './location.action'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { IPageInfoResponse, TPage, TRequestParams } from '~/types/global.types'

export const getAllLocations = createAsyncThunk('location/index', async (payload: TRequestParams) => {
  try {
    const response = await LocationAction.index(payload)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const getOneLocation = createAsyncThunk('location/show', async (id: number) => {
  try {
    const response = await LocationAction.show(id)
    return response.data
  } catch (error: unknown) {
    throw new Error
  }
})

export const createLocation = createAsyncThunk(
  'location/store',
  async (
    { payload, callback }: {
      payload: ILocationRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await LocationAction.store(payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const updateLocation = createAsyncThunk(
  'location/update',
  async (
    { id, payload, callback }: {
      id: number,
      payload: ILocationRequest,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await LocationAction.update(id, payload);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export const deleteLocation = createAsyncThunk(
  'location/destroy',
  async (
    { id, callback }: {
      id: number,
      callback: (code: number, message: string) => void
    }
  ) => {
    try {
      const response = await LocationAction.destroy(id);
      callback(response.meta.code, response.meta.message);
    } catch (error: any) {
      callback(error.meta.code, error.meta.message);
    }
  }
)

export type TLocationState = {
  isLoading: boolean
  isError: boolean
  listLocations: Array<ILocationResponse>
  detailLocation: ILocationResponse
  pagination: IPageInfoResponse
}

const initialState: TLocationState = {
  isLoading: false,
  isError: false,
  listLocations:[],
  detailLocation: {} as ILocationResponse,
  pagination: {} as IPageInfoResponse
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateState: (state, action: { payload: Partial<TLocationState> }) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAllLocations
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getAllLocations
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.listLocations = action?.payload?.page_data
          state.pagination = action?.payload?.page_info
        })
      .addCase(getAllLocations
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(getOneLocation
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(getOneLocation
        .fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.detailLocation = action?.payload
        })
      .addCase(getOneLocation
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(createLocation
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(createLocation
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(createLocation
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(updateLocation
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(updateLocation
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(updateLocation
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
      .addCase(deleteLocation
        .pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
      .addCase(deleteLocation
        .fulfilled, (state) => {
          state.isLoading = false
          state.isError = false
        })
      .addCase(deleteLocation
        .rejected, (state) => {
          state.isLoading = false
          state.isError = true
        })
  }
})

export const { updateState } = locationSlice.actions
export default locationSlice.reducer