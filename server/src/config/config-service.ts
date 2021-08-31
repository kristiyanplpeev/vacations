// src/config/config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPass,
  postgresDB,
} from '../common/constants';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: Array<string>) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue(postgresHost),
      port: parseInt(this.getValue(postgresPort)),
      username: this.getValue(postgresUser),
      password: this.getValue(postgresPass),
      database: this.getValue(postgresDB),

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPass,
  postgresDB,
]);

export { configService };
