import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export type UserRole = 'admin' | 'worker';

export default class User extends Model {
  static table = 'users';

  @field('supabase_id') supabaseId!: string;
  @field('email') email!: string;
  @field('name') name!: string;
  @field('role') role!: UserRole;
  @field('is_active') isActive!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
