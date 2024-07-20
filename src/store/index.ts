import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import walletReducer from './walletSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['wallet'] // 只持久化錢包狀態
};

const persistedReducer = persistReducer(persistConfig, walletReducer);

export const store = configureStore({
  reducer: {
    wallet: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;