import { PrismaClient } from '@prisma/client';

import { Logger } from './logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log Prisma queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    Logger.info('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

// Log Prisma errors
prisma.$on('error', (e) => {
  Logger.error('Prisma Error', e);
});

// Initialize Prisma connection
const initializePrisma = async (): Promise<void> => {
  try {
    await prisma.$connect();
    Logger.info('Successfully connected to database');
    
    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    Logger.info('Database connection test successful');
  } catch (error) {
    Logger.error('Failed to connect to database', error);
    throw error;
  }
};

// Graceful shutdown
const disconnectPrisma = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    Logger.info('Disconnected from database');
  } catch (error) {
    Logger.error('Error disconnecting from database', error);
  }
};

export { prisma, initializePrisma, disconnectPrisma };