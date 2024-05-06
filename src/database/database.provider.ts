import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/util/enum/configuration.enum';
import { Environment } from 'src/util/enum/environment.enum';
import { DataSourceOptions } from 'typeorm';

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
