import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import NewTransactionScreen from '../screens/transactions/NewTransactionScreen';
import ReceiptDetailScreen from '../screens/transactions/ReceiptDetailScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import SalesScreen from '../screens/sales/SalesScreen';
import UserApprovalScreen from '../screens/admin/UserApprovalScreen';
import PricingScreen from '../screens/admin/PricingScreen';
import { useAppSelector, useAppDispatch, type RootState } from '../store';
import { signOut } from '../store/authStore';
import { useT } from '../hooks/useT';
import { colors, fontSize, spacing } from '../constants';

export type MainTabParamList = {
  TransactionsTab: undefined;
  Inventory: undefined;
  Sales: undefined;
  AdminTab: undefined;
};

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  NewTransaction: undefined;
  ReceiptDetail: { receiptId: string; printOnLoad?: boolean };
};

export type AdminStackParamList = {
  Users: undefined;
  Pricing: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const TransactionsStack =
  createNativeStackNavigator<TransactionsStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

function TransactionsNavigator() {
  const { t } = useT();
  const dispatch = useAppDispatch();
  return (
    <TransactionsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
      }}
    >
      <TransactionsStack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
        options={{
          title: t.transactions,
          headerRight: () => (
            <TouchableOpacity
              style={navStyles.signOutButton}
              onPress={() => dispatch(signOut())}
            >
              <Text style={navStyles.signOutText}>{t.signOut}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TransactionsStack.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
        options={{ title: t.newBuy }}
      />
      <TransactionsStack.Screen
        name="ReceiptDetail"
        component={ReceiptDetailScreen}
        options={{ title: t.receiptDetail }}
      />
    </TransactionsStack.Navigator>
  );
}

function AdminNavigator() {
  const { t } = useT();
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
      }}
    >
      <AdminStack.Screen
        name="Users"
        component={UserApprovalScreen}
        options={{ title: t.tabUsers }}
      />
      <AdminStack.Screen
        name="Pricing"
        component={PricingScreen}
        options={{ title: t.pricing }}
      />
    </AdminStack.Navigator>
  );
}

export default function MainNavigator() {
  const { t } = useT();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state: RootState) => state.auth.profile);
  const isAdmin = profile?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        headerRight: () => (
          <TouchableOpacity
            style={navStyles.signOutButton}
            onPress={() => dispatch(signOut())}
          >
            <Text style={navStyles.signOutText}>{t.signOut}</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsNavigator}
        options={{ title: t.tabBuy, headerShown: false }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ title: t.tabInventory }}
      />
      <Tab.Screen
        name="Sales"
        component={SalesScreen}
        options={{ title: t.tabSales }}
      />
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminNavigator}
          options={{ title: t.tabAdmin, headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
}

const navStyles = StyleSheet.create({
  signOutButton: {
    marginRight: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  signOutText: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
