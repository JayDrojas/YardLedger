import { useState } from 'react';
import { Alert } from 'react-native';
import type { LineItemInput, Metal } from '../types';
import { useMetals } from './useMetals';
import { useAppSelector, type RootState } from '../store';
import { useT } from './useT';
import { createReceipt } from '../services/receipts';
import {
  calculateLineItemTotal,
  calculateReceiptTotal,
  calculateCurrentPreview,
} from '../utils/calculations';

export function useNewTransaction() {
  const { t } = useT();
  const { metals, loading: metalsLoading } = useMetals();
  const profile = useAppSelector((state: RootState) => state.auth.profile);
  const activeMetals = metals.filter((m) => m.is_active);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedMetal, setSelectedMetal] = useState<Metal | null>(null);
  const [weight, setWeight] = useState('');
  const [lineItems, setLineItems] = useState<LineItemInput[]>([]);
  const [saving, setSaving] = useState(false);

  // Price override state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [overrideIndex, setOverrideIndex] = useState<number | null>(null);
  const [overridePrice, setOverridePrice] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Derived values
  const currentTotal = calculateCurrentPreview(
    weight,
    selectedMetal?.price_per_lb ?? 0
  );
  const receiptTotal = calculateReceiptTotal(lineItems);

  const addLineItem = () => {
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
        total: calculateLineItemTotal(w, selectedMetal.price_per_lb),
      },
    ]);
    setWeight('');
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const startPriceEdit = (index: number) => {
    setEditingIndex(index);
    setOverridePrice(lineItems[index].pricePerLb.toString());
  };

  const requestOverride = (index: number) => {
    const newPrice = parseFloat(overridePrice);
    if (!newPrice || newPrice <= 0) {
      Alert.alert(t.error, t.enterValidPrice);
      return;
    }
    if (newPrice === lineItems[index].originalPricePerLb) {
      setEditingIndex(null);
      return;
    }
    setOverrideIndex(index);
    setShowAdminModal(true);
  };

  const approveOverride = (adminUserId: string) => {
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
              total: calculateLineItemTotal(item.weight, newPrice),
            }
          : item
      )
    );

    setShowAdminModal(false);
    setOverrideIndex(null);
    setEditingIndex(null);
    setOverridePrice('');
  };

  const cancelOverride = () => {
    setShowAdminModal(false);
    setOverrideIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setOverridePrice('');
  };

  const saveReceipt = async (onSuccess: () => void) => {
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
        { text: t.ok, onPress: onSuccess },
      ]);
    } catch (err) {
      console.error('[saveReceipt] Error:', err);
      Alert.alert(t.error, (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return {
    // Data
    activeMetals,
    metalsLoading,
    lineItems,
    customerName,
    customerPhone,
    selectedMetal,
    weight,
    currentTotal,
    receiptTotal,
    saving,

    // Override UI state
    showAdminModal,
    overridePrice,
    editingIndex,

    // Setters
    setCustomerName,
    setCustomerPhone,
    setSelectedMetal,
    setWeight,
    setOverridePrice,

    // Actions
    addLineItem,
    removeLineItem,
    startPriceEdit,
    requestOverride,
    approveOverride,
    cancelOverride,
    cancelEdit,
    saveReceipt,
  };
}
