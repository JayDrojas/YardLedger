import { Model } from '@nozbe/watermelondb';
import {
  field,
  date,
  readonly,
  children,
} from '@nozbe/watermelondb/decorators';
import type { Query } from '@nozbe/watermelondb';
import type LineItem from './LineItem';

export type ReceiptType = 'buy' | 'sell';

export default class Receipt extends Model {
  static table = 'receipts';

  static associations = {
    line_items: { type: 'has_many' as const, foreignKey: 'receipt_id' },
  };

  @field('receipt_number') receiptNumber!: string;
  @field('customer_name') customerName!: string;
  @field('customer_phone') customerPhone!: string;
  @field('type') type!: ReceiptType;
  @field('subtotal') subtotal!: number;
  @field('signature_uri') signatureUri!: string | null;
  @field('worker_id') workerId!: string;
  @field('notes') notes!: string | null;
  @field('synced_at') syncedAt!: number | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('line_items') lineItems!: Query<LineItem>;
}
