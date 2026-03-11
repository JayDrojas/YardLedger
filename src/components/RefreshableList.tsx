import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import type { FlatListProps } from 'react-native';
import { colors } from '../constants';
import EmptyState from './EmptyState';

interface RefreshableListProps<T> extends Omit<FlatListProps<T>, 'data'> {
  data: T[];
  loading: boolean;
  onRefresh: () => void;
  emptyTitle: string;
  emptySubtitle?: string;
}

export default function RefreshableList<T>({
  data,
  loading,
  onRefresh,
  emptyTitle,
  emptySubtitle,
  ListEmptyComponent,
  ...props
}: RefreshableListProps<T>) {
  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={colors.card}
        />
      }
      ListEmptyComponent={
        ListEmptyComponent ??
        (loading ? (
          <ActivityIndicator
            color={colors.accent}
            size="large"
            style={{ marginTop: 100 }}
          />
        ) : (
          <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
        ))
      }
      {...props}
    />
  );
}
