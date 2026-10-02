import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // On transforme l'URL de connexion en options comprises par l'adaptateur MySQL.
    const databaseUrl = new URL(process.env.DATABASE_URL as string);
    const adapter = new PrismaMariaDb({
      host: databaseUrl.hostname,
      port: Number(databaseUrl.port || 3306),
      user: decodeURIComponent(databaseUrl.username),
      password: decodeURIComponent(databaseUrl.password),
      database: databaseUrl.pathname.slice(1),
    });

    super({ adapter });
  }

  async onModuleInit() {
    // La connexion est ouverte quand NestJS démarre l'application.
    await this.$connect();
  }

  async onModuleDestroy() {
    // La connexion est fermée proprement quand NestJS s'arrête.
    await this.$disconnect();
  }
}