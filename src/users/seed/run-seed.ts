import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { User } from '../entities/user.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { Store } from '../../stores/entities/store.entity';
import { getTypeOrmConfig } from '../../config/database.config';

const SEED_ENTITIES = [User, Tenant, Shop, Store];

async function runSeed() {
  const dataSource = new DataSource(getTypeOrmConfig(SEED_ENTITIES) as any);

  try {
    await dataSource.initialize();
    console.log('Database connected');
    await seedUsers(dataSource);
    await dataSource.destroy();
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
}

runSeed();
