import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isSyncing: boolean;
  lastSyncedAt: number | null;
}

const initialState: AppState = {
  isSyncing: false,
  lastSyncedAt: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSyncing(state, action: PayloadAction<boolean>) {
      state.isSyncing = action.payload;
    },
    setLastSynced(state, action: PayloadAction<number>) {
      state.lastSyncedAt = action.payload;
    },
  },
});

export const { setSyncing, setLastSynced } = appSlice.actions;
export default appSlice.reducer;
