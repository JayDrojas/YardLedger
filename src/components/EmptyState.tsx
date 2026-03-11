import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../constants';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    color: colors.textSecondary,
    fontSize: fontSize.xl,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
  },
});
