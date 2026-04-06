import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import type { UserRole } from '../types';

interface UserProfile {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  loading: true,
  error: null,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let profile: UserProfile | null = null;
  if (session?.user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_id', session.user.id)
      .single();

    if (data) {
      profile = {
        id: data.id,
        supabaseId: data.supabase_id,
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.is_active,
      };
    }
  }

  return { session, profile };
});

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (supabaseUserId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_id', supabaseUserId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      supabaseId: data.supabase_id,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.is_active,
    } as UserProfile;
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Fetch profile to check approval status
    let profile: UserProfile | null = null;
    if (data.user) {
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('supabase_id', data.user.id)
        .single();

      if (profileData) {
        profile = {
          id: profileData.id,
          supabaseId: profileData.supabase_id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
          isActive: profileData.is_active,
        };
      }
    }

    return { session: data.session, profile };
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'yardledger://auth/callback',
      },
    });
    if (error) throw error;
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.session?.user ?? null;
        state.profile = action.payload.profile;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.session?.user ?? null;
        state.profile = action.payload.profile;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message ?? 'Sign in failed';
      })
      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.profile = null;
      });
  },
});

export const { setSession, clearError } = authSlice.actions;
export default authSlice.reducer;
