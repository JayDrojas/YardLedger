import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import authReducer from './authStore';
import appReducer from './appStore';
import settingsReducer from './settingsStore';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Supabase session contains non-serializable values
        ignoredPaths: ['auth.session', 'auth.user'],
        ignoredActions: [
          'auth/initialize/fulfilled',
          'auth/signIn/fulfilled',
          'auth/setSession',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
