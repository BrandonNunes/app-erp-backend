// database.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConnectionPool, config } from 'mssql';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private pool: ConnectionPool;

    async onModuleInit() {
        try {
            this.pool = await new ConnectionPool({
                  user: process.env.DATABASE_USER,
                  password: process.env.DATABASE_PASS,
                  server: process.env.DATABASE_HOST,
                  database: process.env.DATABASE_NAME,
                  options: {
                    trustServerCertificate: true
                  }

                }).connect();
            console.log('Connected to the database');
        } catch (error) {
            console.error('Error connecting to the database:', error.message);
        }
    }
    connection() {
        return this.pool;
    }

    async executeQuery(query: string, params?: Record<string, any>): Promise<any> {
        try {
            const request = this.pool.request();
            if (params) {
                Object.keys(params).forEach((key) => {
                    request.input(key, params[key]);
                });
            }

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error executing query:', error.message);
            throw error;
        }
    }

    async closeConnection() {
        try {
            await this.pool.close();
            console.log('Connection closed');
        } catch (error) {
            console.error('Error closing connection:', error.message);
        }
    }
}
