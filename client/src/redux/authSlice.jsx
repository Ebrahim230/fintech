import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'

const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

const initialState = {
  token: userFromStorage?.token || null,
  user: userFromStorage?.role ? { role: userFromStorage.role } : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}

export const registerUser = createAsyncThunk('auth/register', async (formData, thunkAPI) => {
  try {
    const data = await authService.register(formData)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.message)
  }
})

export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData, thunkAPI) => {
    try {
      const data = await authService.login(formData)
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('user')
      toast.success('Logged out successfully.')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.token = action.payload.token
        state.user = { role: action.payload.role }
        localStorage.setItem('user', JSON.stringify({ token: action.payload.token, role: action.payload.role }))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        toast.error(action.payload || 'Login failed')
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer;