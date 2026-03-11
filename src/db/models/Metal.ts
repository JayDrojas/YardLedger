import { Model } from '@nozbe/watermelondb';
import {
  field,
  date,
  readonly,
  children,
} from '@nozbe/watermelondb/decorators';
import type { Query } from '@nozbe/watermelondb';
import type LineItem from './LineItem';

export default class Metal extends Model {
  static table = 'metals';

  static associations = {
    line_items: { type: 'has_many' as const, foreignKey: 'metal_id' },
  };

  @field('name') name!: string;
  @field('price_per_lb') pricePerLb!: number;
  @field('is_active') isActive!: boolean;
  @field('updated_by') updatedBy!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('line_items') lineItems!: Query<LineItem>;
}
