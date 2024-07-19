import { createSlice } from '@reduxjs/toolkit'

interface Asset {
  symbol: string
  amount: number
  usdValue: number
}

const initialState: Asset[] = []

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setAssets: (state, action) => action.payload,
  },
})

export const { setAssets } = assetsSlice.actions
export default assetsSlice.reducer
