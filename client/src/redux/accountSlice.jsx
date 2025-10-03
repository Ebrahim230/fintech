import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { depositAmount, withdrawAmount, getAccountTransactions } from '../services/AccountService';

export const depositAmountThunk = createAsyncThunk('account/depositAmount', async ({ id, amount }) => await depositAmount(id, amount));
export const withdrawAmountThunk = createAsyncThunk('account/withdrawAmount', async ({ id, amount }) => await withdrawAmount(id, amount));
export const getAccountTransactionsThunk = createAsyncThunk('account/getAccountTransactions', async (id) => await getAccountTransactions(id));

const accountSlice = createSlice({
  name: 'account',
  initialState: { transactions: [], loading: false, error: null, success: null },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(depositAmountThunk.pending, (state) => { state.loading = true; })
      .addCase(depositAmountThunk.fulfilled, (state, action) => { state.loading = false; state.success = 'Deposit successful'; })
      .addCase(depositAmountThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(withdrawAmountThunk.pending, (state) => { state.loading = true; })
      .addCase(withdrawAmountThunk.fulfilled, (state, action) => { state.loading = false; state.success = 'Withdrawal successful'; })
      .addCase(withdrawAmountThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(getAccountTransactionsThunk.pending, (state) => { state.loading = true; })
      .addCase(getAccountTransactionsThunk.fulfilled, (state, action) => { state.loading = false; state.transactions = action.payload; })
      .addCase(getAccountTransactionsThunk.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export const { clearMessages } = accountSlice.actions;
export default accountSlice.reducer;