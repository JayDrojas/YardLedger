import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Language } from '../i18n';

interface SettingsState {
  language: Language;
}

const initialState: SettingsState = {
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    toggleLanguage(state) {
      state.language = state.language === 'en' ? 'es' : 'en';
    },
  },
});

export const { setLanguage, toggleLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
