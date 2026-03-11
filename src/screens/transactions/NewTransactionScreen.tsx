import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TransactionsStackParamList } from '../../navigation/MainNavigator';
import type { LineItemInput } from '../../types';
import AdminPinModal from '../../components/AdminPinModal';
import { useT } from '../../hooks/useT';
import { useMetals } from '../../hooks/useMetals';
import { useAppSelector, type RootState } from '../../store';
import { createReceipt } from '../../services/receipts';

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  'NewTransaction'
>;

export default function NewTransactionScreen({ navigation }: Props) {
  const { t } = useT();
  const { metals, loading: metalsLoading } = useMetals();
  const profile = useAppSelector((state: RootState) => state.auth.profile);
  const activeMetals = metals.filter((m) => m.is_active);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedMetal, setSelectedMetal] = useState<{
    id: string;
    name: string;
    price_per_lb: number;
  } | null>(null);
  const [weight, setWeight] = useState('');
  const [lineItems, setLineItems] = useState<LineItemInput[]>([]);
  const [saving, setSaving] = useState(false);

  // Price override state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [overrideIndex, setOverrideIndex] = useState<number | null>(null);
  const [overridePrice, setOverridePrice] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const currentTotal =
    (parseFloat(weight) || 0) * (selectedMetal?.price_per_lb ?? 0);
  const receiptTotal = lineItems.reduce((sum, item) => sum + item.total, 0);

  const handleAddLineItem = () => {
    if (!selectedMetal) return;
    const w = parseFloat(weight);
    if (!w || w <= 0) {
      Alert.alert(t.error, t.enterValidWeight);
      return;
    }

    setLineItems((prev) => [
      ...prev,
      {
        metalId: selectedMetal.id,
        metalName: selectedMetal.name,
        weight: w,
        pricePerLb: selectedMetal.price_per_lb,
        originalPricePerLb: selectedMetal.price_per_lb,
        isPriceOverride: false,
        overrideApprovedBy: null,
        total: w * selectedMetal.price_per_lb,
      },
    ]);
    setWeight('');
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // Step 1: Worker taps price on a line item and enters desired price
  const handleStartPriceEdit = (index: number) => {
    setEditingIndex(index);
    setOverridePrice(lineItems[index].pricePerLb.toString());
  };

  // Step 2: Worker submits new price → triggers admin auth modal
  const handleRequestOverride = (index: number) => {
    const newPrice = parseFloat(overridePrice);
    if (!newPrice || newPrice <= 0) {
      Alert.alert(t.error, t.enterValidPrice);
      return;
    }
    if (newPrice === lineItems[index].originalPricePerLb) {
      // Same as catalog price, just cancel the edit
      setEditingIndex(null);
      return;
    }
    setOverrideIndex(index);
    setShowAdminModal(true);
  };

  // Step 3: Admin authenticates → apply the override
  const handleAdminApproved = (adminUserId: string) => {
    if (overrideIndex === null) return;
    const newPrice = parseFloat(overridePrice);

    setLineItems((prev) =>
      prev.map((item, i) =>
        i === overrideIndex
          ? {
              ...item,
              pricePerLb: newPrice,
              isPriceOverride: true,
              overrideApprovedBy: adminUserId,
              total: item.weight * newPrice,
            }
          : item
      )
    );

    setShowAdminModal(false);
    setOverrideIndex(null);
    setEditingIndex(null);
    setOverridePrice('');
  };

  const handleCancelOverride = () => {
    setShowAdminModal(false);
    setOverrideIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setOverridePrice('');
  };

  const handleSave = async () => {
    if (!customerName) {
      Alert.alert(t.error, t.enterCustomerName);
      return;
    }
    if (lineItems.length === 0) {
      Alert.alert(t.error, t.addAtLeastOneItem);
      return;
    }
    if (!profile) {
      Alert.alert(t.error, 'No user profile found');
      return;
    }

    setSaving(true);
    try {
      await createReceipt({
        customerName,
        customerPhone,
        type: 'buy',
        subtotal: receiptTotal,
        workerId: profile.id,
        notes: '',
        lineItems,
      });
      Alert.alert(t.success, t.receiptSaved, [
        { text: t.ok, onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('[handleSave] Error:', err);
      Alert.alert(t.error, (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>{t.customerInfo}</Text>
        <TextInput
          style={styles.input}
          placeholder={`${t.customerName} *`}
          placeholderTextColor="#666"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.phoneNumber}
          placeholderTextColor="#666"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>{t.addMetals}</Text>
        {metalsLoading ? (
          <ActivityIndicator color="#4ecdc4" style={{ marginVertical: 16 }} />
        ) : (
          <View style={styles.metalGrid}>
            {activeMetals.map((metal) => (
              <TouchableOpacity
                key={metal.id}
                style={[
                  styles.metalChip,
                  selectedMetal?.id === metal.id && styles.metalChipActive,
                ]}
                onPress={() => setSelectedMetal(metal)}
              >
                <Text
                  style={[
                    styles.metalChipText,
                    selectedMetal?.id === metal.id &&
                      styles.metalChipTextActive,
                  ]}
                >
                  {metal.name}
                </Text>
                <Text
                  style={[
                    styles.metalChipPrice,
                    selectedMetal?.id === metal.id &&
                      styles.metalChipTextActive,
                  ]}
                >
                  ${metal.price_per_lb}/lb
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, styles.weightInput]}
            placeholder={t.weightLbs}
            placeholderTextColor="#666"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddLineItem}
          >
            <Text style={styles.addButtonText}>{t.add}</Text>
          </TouchableOpacity>
        </View>

        {weight && selectedMetal ? (
          <Text style={styles.previewText}>
            {selectedMetal.name}: {weight} lbs = ${currentTotal.toFixed(2)}
          </Text>
        ) : null}

        {lineItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.lineItems}</Text>
            <Text style={styles.hintText}>{t.tapPriceToOverride}</Text>
            {lineItems.map((item, index) => (
              <View key={index} style={styles.lineItemRow}>
                <View style={styles.lineItemInfo}>
                  <View style={styles.lineItemHeader}>
                    <Text style={styles.lineItemName}>{item.metalName}</Text>
                    {item.isPriceOverride && (
                      <Text style={styles.overrideBadge}>{t.override}</Text>
                    )}
                  </View>

                  {editingIndex === index ? (
                    <View style={styles.editPriceRow}>
                      <Text style={styles.editPriceLabel}>{t.pricePerLb}</Text>
                      <TextInput
                        style={styles.editPriceInput}
                        value={overridePrice}
                        onChangeText={setOverridePrice}
                        keyboardType="decimal-pad"
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.editPriceConfirm}
                        onPress={() => handleRequestOverride(index)}
                      >
                        <Text style={styles.editPriceConfirmText}>OK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editPriceCancel}
                        onPress={handleCancelEdit}
                      >
                        <Text style={styles.editPriceCancelText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleStartPriceEdit(index)}
                    >
                      <Text style={styles.lineItemDetail}>
                        {item.weight} lbs @{' '}
                        <Text
                          style={
                            item.isPriceOverride
                              ? styles.overridePrice
                              : undefined
                          }
                        >
                          ${item.pricePerLb}/lb
                        </Text>
                        {item.isPriceOverride && (
                          <Text style={styles.originalPrice}>
                            {' '}
                            (was ${item.originalPricePerLb}/lb)
                          </Text>
                        )}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.lineItemTotal}>
                  ${item.total.toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveLineItem(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t.receiptTotal}</Text>
          <Text style={styles.totalValue}>${receiptTotal.toFixed(2)}</Text>
        </View>

        {/* TODO: Signature capture component */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            (lineItems.length === 0 || saving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={lineItems.length === 0 || saving}
        >
          {saving ? (
            <ActivityIndicator color="#0f0f23" />
          ) : (
            <Text style={styles.saveButtonText}>{t.saveReceipt}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <AdminPinModal
        visible={showAdminModal}
        onSuccess={handleAdminApproved}
        onCancel={handleCancelOverride}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 16,
  },
  sectionTitle: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  hintText: {
    color: '#555',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  metalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metalChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  metalChipActive: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
  },
  metalChipText: {
    color: '#888',
    fontSize: 14,
  },
  metalChipPrice: {
    color: '#555',
    fontSize: 11,
    marginTop: 2,
  },
  metalChipTextActive: {
    color: '#0f0f23',
    fontWeight: 'bold',
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  weightInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  addButtonText: {
    color: '#0f0f23',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  lineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  lineItemInfo: {
    flex: 1,
  },
  lineItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineItemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overrideBadge: {
    color: '#ff6b6b',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  lineItemDetail: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  overridePrice: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  originalPrice: {
    color: '#555',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  editPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  editPriceLabel: {
    color: '#888',
    fontSize: 14,
  },
  editPriceInput: {
    backgroundColor: '#0f0f23',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#4ecdc4',
    minWidth: 80,
  },
  editPriceConfirm: {
    backgroundColor: '#4ecdc4',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editPriceConfirmText: {
    color: '#0f0f23',
    fontWeight: 'bold',
    fontSize: 13,
  },
  editPriceCancel: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  editPriceCancelText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 13,
  },
  lineItemTotal: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  totalLabel: {
    color: '#888',
    fontSize: 18,
  },
  totalValue: {
    color: '#4ecdc4',
    fontSize: 28,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 48,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: '#0f0f23',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
