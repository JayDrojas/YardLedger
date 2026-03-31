import { useState, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DateRangeSelector, {
  type DatePreset,
  getDateRange,
} from '../../components/DateRangeSelector';
import SummaryCards from '../../components/SummaryCards';
import { fetchDailySummary, type DailySummary } from '../../services/reports';
import { colors, spacing } from '../../constants';

export default function DailySummaryScreen() {
  const isFocused = useIsFocused();
  const [preset, setPreset] = useState<DatePreset>('today');
  const [data, setData] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange(preset);
      const summary = await fetchDailySummary(start, end);
      setData(summary);
    } catch {
      // Will show empty
    } finally {
      setLoading(false);
    }
  }, [preset]);

  useEffect(() => {
    if (isFocused) loadData();
  }, [loadData, isFocused]);

  return (
    <ScrollView style={styles.container}>
      <DateRangeSelector selected={preset} onSelect={setPreset} />

      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={styles.loader}
        />
      ) : data ? (
        <SummaryCards data={data} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    marginTop: spacing.xxxl,
  },
});
