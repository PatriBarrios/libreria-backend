import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { Configuration } from '../util/enum/configuration.enum';
import { Environment } from '../util/enum/environment.enum';

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const isDevelopmentEnv =
      config.get(Configuration.NODE_ENV) !== Environment.Production;

    const dbConfig = {
      type: 'postgres',
      database: config.get(Configuration.DB_NAME),
      host: config.get(Configuration.DB_HOST),
      port: config.get(Configuration.DB_PORT),
      username: config.get(Configuration.DB_USER),
      password: config.get(Configuration.DB_PASSWORD),
      synchronize: isDevelopmentEnv,
      autoLoadEntities: true,
      logging: config.get(Configuration.DB_LOGGING),
    } as DataSourceOptions;

    return dbConfig;
  },
});
