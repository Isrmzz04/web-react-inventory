import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IAuthResponse, IAuthRequest } from '~/types/main/auth.types';
import { Login } from './auth.action';

export const loginAdmin = createAsyncThunk<IAuthResponse, IAuthRequest>(
  'auth/login',
  async (payload: IAuthRequest, { rejectWithValue }) => {
    try {
      const response = await Login(payload)
      
      if (response.meta.code === 200) {
        return response.data;
      }
      
      return rejectWithValue({
        code: response.meta.code,
        message: response.meta.message || 'Login failed'
      });
      
    } catch (error: any) {
      return rejectWithValue({
        code: 500,
        message: error.message || 'Unable to login'
      });
    }
  }
)

export type IAuthState = {
  isLoading: boolean
  isError: boolean
  token: string | null
  userData: IAuthResponse | null
}

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    isError: false,
    token: getInitialToken(),
    userData: {} as IAuthResponse | null
  },
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
    },
    clearError: (state) => {
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.token = action.payload.access_token!;
        state.userData = {
          token_type: action.payload.token_type,
          expires_in: action.payload.expires_in,
          role: action.payload.role,
          menus: action.payload.menus
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', action.payload.access_token!);
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true
        state.token = null;
        state.userData = null;
        
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;