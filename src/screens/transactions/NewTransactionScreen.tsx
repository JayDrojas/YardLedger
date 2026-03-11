import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TransactionsStackParamList } from '../../navigation/MainNavigator';
import AdminPinModal from '../../components/AdminPinModal';
import { useT } from '../../hooks/useT';
import { useNewTransaction } from '../../hooks/useNewTransaction';

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  'NewTransaction'
>;

export default function NewTransactionScreen({ navigation }: Props) {
  const { t } = useT();
  const tx = useNewTransaction();

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>{t.customerInfo}</Text>
        <TextInput
          style={styles.input}
          placeholder={`${t.customerName} *`}
          placeholderTextColor="#666"
          value={tx.customerName}
          onChangeText={tx.setCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.phoneNumber}
          placeholderTextColor="#666"
          value={tx.customerPhone}
          onChangeText={tx.setCustomerPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>{t.addMetals}</Text>
        {tx.metalsLoading ? (
          <ActivityIndicator color="#4ecdc4" style={{ marginVertical: 16 }} />
        ) : (
          <View style={styles.metalGrid}>
            {tx.activeMetals.map((metal) => (
              <TouchableOpacity
                key={metal.id}
                style={[
                  styles.metalChip,
                  tx.selectedMetal?.id === metal.id && styles.metalChipActive,
                ]}
                onPress={() => tx.setSelectedMetal(metal)}
              >
                <Text
                  style={[
                    styles.metalChipText,
                    tx.selectedMetal?.id === metal.id &&
                      styles.metalChipTextActive,
                  ]}
                >
                  {metal.name}
                </Text>
                <Text
                  style={[
                    styles.metalChipPrice,
                    tx.selectedMetal?.id === metal.id &&
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
            value={tx.weight}
            onChangeText={tx.setWeight}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity style={styles.addButton} onPress={tx.addLineItem}>
            <Text style={styles.addButtonText}>{t.add}</Text>
          </TouchableOpacity>
        </View>

        {tx.weight && tx.selectedMetal ? (
          <Text style={styles.previewText}>
            {tx.selectedMetal.name}: {tx.weight} lbs = $
            {tx.currentTotal.toFixed(2)}
          </Text>
        ) : null}

        {tx.lineItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.lineItems}</Text>
            <Text style={styles.hintText}>{t.tapPriceToOverride}</Text>
            {tx.lineItems.map((item, index) => (
              <View key={index} style={styles.lineItemRow}>
                <View style={styles.lineItemInfo}>
                  <View style={styles.lineItemHeader}>
                    <Text style={styles.lineItemName}>{item.metalName}</Text>
                    {item.isPriceOverride && (
                      <Text style={styles.overrideBadge}>{t.override}</Text>
                    )}
                  </View>

                  {tx.editingIndex === index ? (
                    <View style={styles.editPriceRow}>
                      <Text style={styles.editPriceLabel}>{t.pricePerLb}</Text>
                      <TextInput
                        style={styles.editPriceInput}
                        value={tx.overridePrice}
                        onChangeText={tx.setOverridePrice}
                        keyboardType="decimal-pad"
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.editPriceConfirm}
                        onPress={() => tx.requestOverride(index)}
                      >
                        <Text style={styles.editPriceConfirmText}>OK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editPriceCancel}
                        onPress={tx.cancelEdit}
                      >
                        <Text style={styles.editPriceCancelText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => tx.startPriceEdit(index)}>
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
                  onPress={() => tx.removeLineItem(index)}
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
          <Text style={styles.totalValue}>${tx.receiptTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (tx.lineItems.length === 0 || tx.saving) &&
              styles.saveButtonDisabled,
          ]}
          onPress={() => tx.saveReceipt(() => navigation.goBack())}
          disabled={tx.lineItems.length === 0 || tx.saving}
        >
          {tx.saving ? (
            <ActivityIndicator color="#0f0f23" />
          ) : (
            <Text style={styles.saveButtonText}>{t.saveReceipt}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <AdminPinModal
        visible={tx.showAdminModal}
        onSuccess={tx.approveOverride}
        onCancel={tx.cancelOverride}
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
