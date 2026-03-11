import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import PendingApprovalScreen from '../screens/auth/PendingApprovalScreen';
import { useAppDispatch, useAppSelector, type RootState } from '../store';
import { initializeAuth, setSession } from '../store/authStore';
import { supabase } from '../config/supabase';

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const { session, profile, loading } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(initializeAuth());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      dispatch(setSession(s));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f0f23',
        }}
      >
        <ActivityIndicator size="large" color="#4ecdc4" />
      </View>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  // Logged in but not yet approved by admin
  if (!profile?.isActive) {
    return <PendingApprovalScreen />;
  }

  // Logged in and approved
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
