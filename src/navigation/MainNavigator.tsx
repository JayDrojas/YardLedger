import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import NewTransactionScreen from '../screens/transactions/NewTransactionScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import SalesScreen from '../screens/sales/SalesScreen';
import UserApprovalScreen from '../screens/admin/UserApprovalScreen';
import { useAppSelector, type RootState } from '../store';
import { useT } from '../hooks/useT';
import { colors } from '../constants';

export type MainTabParamList = {
  TransactionsTab: undefined;
  Inventory: undefined;
  Sales: undefined;
  Admin: undefined;
};

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  NewTransaction: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const TransactionsStack =
  createNativeStackNavigator<TransactionsStackParamList>();

function TransactionsNavigator() {
  const { t } = useT();
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
        options={{ title: t.transactions }}
      />
      <TransactionsStack.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
        options={{ title: t.newBuy }}
      />
    </TransactionsStack.Navigator>
  );
}

export default function MainNavigator() {
  const { t } = useT();
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
          name="Admin"
          component={UserApprovalScreen}
          options={{ title: t.tabUsers }}
        />
      )}
    </Tab.Navigator>
  );
}
