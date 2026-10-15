import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.get('DATABASE_URL') as string,
    });
    super({ adapter });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
