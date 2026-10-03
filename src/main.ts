import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { seedUsers } from './users/seed/users.seed';
import { backfillStockLots } from './stock-lots/backfill-lots';
import { backfillTenants } from './tenants/backfill-tenants';
import { env } from './config/env';
import { corsOptions } from './config/cors.config';

async function bootstrap() {
  console.log('🚀 Starting server...');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.enableCors(corsOptions);

  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Database connected successfully');
    if (env.dbSynchronize) {
      await dataSource.synchronize();
      console.log(`✅ Schema synced (${dataSource.entityMetadatas.length} tables)`);
    } else {
      console.log('⚠️ DB_SYNCHRONIZE is false — tables will not be created');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }

  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    console.log('🌱 Seeding users...');
    await seedUsers(dataSource);
    console.log('✅ Users seeded successfully');
    await backfillTenants(dataSource);
    console.log('✅ Tenant isolation ready');
    await backfillStockLots(dataSource);
    console.log('✅ FIFO stock lots ready');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }

  await app.listen(env.port);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Server started on port ${env.port}`);
  console.log(`🌐 CORS origins: ${[env.clientUrl, ...env.allowedOrigins].join(', ')}`);
  console.log('═══════════════════════════════════════════════════════');
}

bootstrap();
