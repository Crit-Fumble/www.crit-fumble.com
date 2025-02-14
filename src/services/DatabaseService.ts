import { PrismaClient } from '@prisma/client';
import { postgres } from '../config/services';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: postgres.url_prisma,
    },
  },
});

export default prisma;
