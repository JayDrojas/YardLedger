import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import type { Relation } from '@nozbe/watermelondb';
import type Metal from './Metal';

export default class Inventory extends Model {
  static table = 'inventory';

  static associations = {
    metals: { type: 'belongs_to' as const, key: 'metal_id' },
  };

  @field('metal_id') metalId!: string;
  @field('metal_name') metalName!: string;
  @field('weight') weight!: number;
  @field('avg_cost_per_lb') avgCostPerLb!: number;
  @date('updated_at') updatedAt!: Date;

  @relation('metals', 'metal_id') metal!: Relation<Metal>;
}
