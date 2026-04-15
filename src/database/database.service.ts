import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const { pool } = require('node-jt400');

@Injectable()
export class DatabaseService {
  private connection;

  constructor(private readonly configService: ConfigService) {}

  private getRequiredEnv(name: string) {
    const value = this.configService.get<string>(name)?.trim();

    if (!value) {
      throw new Error(`Missing required database environment variable: ${name}`);
    }

    return value;
  }

  async connect() {
    this.connection = await pool({
      host: this.getRequiredEnv('DATABASE_HOST'),
      user: this.getRequiredEnv('DATABASE_USER'),
      password: this.getRequiredEnv('DATABASE_PASSWORD'),
    });
  }

  async query(sql: string) {
    if (!this.connection) {
      await this.connect();
    }
    return this.connection.query(sql);
  }

  async sqlQuery(sql: string) {
    if (!this.connection) {
      await this.connect();
    }

    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return this.connection.query(sql);
    } else {
      return this.connection.update(sql);
    }
  }
}
