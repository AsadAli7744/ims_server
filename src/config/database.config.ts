import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { env } from './env';

const ssl = env.dbSsl || env.databaseUrl.includes('rlwy.net') || env.databaseUrl.includes('railway')
  ? { rejectUnauthorized: false }
  : false;

export function getTypeOrmConfig(entities: PostgresConnectionOptions['entities']): TypeOrmModuleOptions {
  if (env.databaseUrl.startsWith('postgresql://') || env.databaseUrl.startsWith('postgres://')) {
    return {
      type: 'postgres',
      url: env.databaseUrl,
      entities,
      autoLoadEntities: true,
      synchronize: env.dbSynchronize,
      ssl,
    };
  }

  return {
    type: 'postgres',
    host: env.dbHost,
    port: env.dbPort,
    username: env.dbUsername,
    password: env.dbPassword,
    database: env.dbName,
    entities,
    autoLoadEntities: true,
    synchronize: env.dbSynchronize,
    ssl,
  };
}
