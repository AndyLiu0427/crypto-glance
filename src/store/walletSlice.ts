import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  network: string | null;
  balance: string | null;
}

const initialState: WalletState = {
  address: null,
  network: null,
  balance: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletInfo: (state, action: PayloadAction<WalletState>) => {
      state.address = action.payload.address;
      state.network = action.payload.network;
      state.balance = action.payload.balance;
    },
    clearWalletInfo: (state) => {
      state.address = null;
      state.network = null;
      state.balance = null;
    },
  },
});

export const { setWalletInfo, clearWalletInfo } = walletSlice.actions;
export default walletSlice.reducer;