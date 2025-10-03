import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAdminStats, fetchAllAccounts, closeAccount, createAccount, updateAccount, getAccountDetails, fetchAccountTypes } from '../services/adminService';

export const fetchAdminStatsThunk = createAsyncThunk('admin/fetchAdminStats', async () => await fetchAdminStats());
export const fetchAllAccountsThunk = createAsyncThunk('admin/fetchAllAccounts', async () => await fetchAllAccounts());
export const closeAccountThunk = createAsyncThunk('admin/closeAccount', async (id) => await closeAccount(id));
export const createAccountThunk = createAsyncThunk('admin/createAccount', async (accountData) => await createAccount(accountData));
export const updateAccountThunk = createAsyncThunk('admin/updateAccount', async ({ id, accountData }) => await updateAccount(id, accountData));
export const getAccountDetailsThunk = createAsyncThunk('admin/getAccountDetails', async (id) => await getAccountDetails(id));
export const fetchAccountTypesThunk = createAsyncThunk('admin/fetchAccountTypes', async () => await fetchAccountTypes());

const adminAccountsSlice = createSlice({
  name: 'adminAccounts',
  initialState: { stats: null, accounts: [], accountDetails: null, accountTypes: [], loading: false, error: null, success: null },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStatsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminStatsThunk.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchAdminStatsThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchAllAccountsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchAllAccountsThunk.fulfilled, (state, action) => { state.loading = false; state.accounts = action.payload; })
      .addCase(fetchAllAccountsThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createAccountThunk.pending, (state) => { state.loading = true; })
      .addCase(createAccountThunk.fulfilled, (state, action) => { state.loading = false; state.success = 'Account created successfully'; state.accounts.push(action.payload); })
      .addCase(createAccountThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateAccountThunk.fulfilled, (state, action) => { state.loading = false; state.success = 'Account updated successfully'; state.accounts = state.accounts.map((acc) => acc._id === action.payload._id ? action.payload : acc); })
      .addCase(closeAccountThunk.fulfilled, (state, action) => { state.loading = false; state.success = 'Account deleted successfully'; state.accounts = state.accounts.filter((acc) => acc._id !== action.meta.arg); })
      .addCase(getAccountDetailsThunk.fulfilled, (state, action) => { state.loading = false; state.accountDetails = action.payload; })
      .addCase(fetchAccountTypesThunk.fulfilled, (state, action) => { state.loading = false; state.accountTypes = action.payload; });
  },
});

export const { clearMessages } = adminAccountsSlice.actions;
export default adminAccountsSlice.reducer;