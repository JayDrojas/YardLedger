import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { Metal, MetalCategory } from '../../types';
import {
  fetchMetalCategories,
  fetchMetalsByCategory,
  updateMetalPrice,
} from '../../services/metals';
import { useAppSelector, type RootState } from '../../store';
import { useT } from '../../hooks/useT';
import { colors, spacing, fontSize, borderRadius } from '../../constants';

interface MetalSection {
  title: string;
  data: Metal[];
}

export default function PricingScreen() {
  const { t } = useT();
  const profile = useAppSelector((state: RootState) => state.auth.profile);
  const [sections, setSections] = useState<MetalSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingMetal, setEditingMetal] = useState<Metal | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const categories: MetalCategory[] = await fetchMetalCategories();
      const results: MetalSection[] = [];
      for (const cat of categories) {
        const metals = await fetchMetalsByCategory(cat.id);
        if (metals.length > 0) {
          results.push({ title: cat.name, data: metals });
        }
      }
      setSections(results);
    } catch (err) {
      Alert.alert(t.error, (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const openEdit = (metal: Metal) => {
    setEditingMetal(metal);
    setNewPrice(metal.price_per_lb.toString());
  };

  const closeEdit = () => {
    setEditingMetal(null);
    setNewPrice('');
  };

  const handleSave = async () => {
    if (!editingMetal || !profile) return;

    const price = parseFloat(newPrice);
    if (!price || price <= 0) {
      Alert.alert(t.error, t.enterValidPrice);
      return;
    }

    if (price === editingMetal.price_per_lb) {
      closeEdit();
      return;
    }

    setSaving(true);
    try {
      await updateMetalPrice(editingMetal.id, price, profile.id);
      Alert.alert(t.success, t.priceUpdated);
      closeEdit();
      loadData();
    } catch (err) {
      Alert.alert(t.error, (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadData}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.metalRow}
            onPress={() => openEdit(item)}
          >
            <Text style={styles.metalName}>{item.name}</Text>
            <Text style={styles.metalPrice}>
              ${Number(item.price_per_lb).toFixed(4)}
              {t.perLb}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{t.loading}</Text>
            </View>
          ) : null
        }
      />

      {/* Edit Price Modal */}
      <Modal
        visible={editingMetal !== null}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={closeEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.editPricing}</Text>
            <TouchableOpacity onPress={closeEdit}>
              <Text style={styles.modalCancel}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>

          {editingMetal && (
            <View style={styles.modalContent}>
              <Text style={styles.editMetalName}>{editingMetal.name}</Text>
              <Text style={styles.currentPrice}>
                ${Number(editingMetal.price_per_lb).toFixed(4)}
                {t.perLb}
              </Text>

              <Text style={styles.fieldLabel}>{t.pricePerLb}</Text>
              <TextInput
                style={styles.priceInput}
                value={newPrice}
                onChangeText={setNewPrice}
                keyboardType="decimal-pad"
                autoFocus
              />

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.saveButtonText}>{t.save}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  metalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  metalName: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    flex: 1,
  },
  metalPrice: {
    color: colors.accent,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  empty: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  modalCancel: {
    color: colors.danger,
    fontSize: fontSize.lg,
  },
  modalContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  editMetalName: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  currentPrice: {
    color: colors.textSecondary,
    fontSize: fontSize.xl,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  priceInput: {
    backgroundColor: colors.inputBackground,
    color: colors.textPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: fontSize.xxl,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
});
