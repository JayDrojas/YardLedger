import { Model } from '@nozbe/watermelondb';
import {
  field,
  date,
  readonly,
  relation,
} from '@nozbe/watermelondb/decorators';
import type { Relation } from '@nozbe/watermelondb';
import type Metal from './Metal';

export default class Sale extends Model {
  static table = 'sales';

  static associations = {
    metals: { type: 'belongs_to' as const, key: 'metal_id' },
  };

  @field('metal_id') metalId!: string;
  @field('metal_name') metalName!: string;
  @field('weight') weight!: number;
  @field('sale_price_per_lb') salePricePerLb!: number;
  @field('cost_basis_per_lb') costBasisPerLb!: number;
  @field('total_revenue') totalRevenue!: number;
  @field('profit') profit!: number;
  @field('buyer_name') buyerName!: string | null;
  @field('worker_id') workerId!: string;
  @field('synced_at') syncedAt!: number | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('metals', 'metal_id') metal!: Relation<Metal>;
}
