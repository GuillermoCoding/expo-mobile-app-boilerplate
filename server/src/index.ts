import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';

import { validateJWT, injectUserId } from './middleware/auth';
import privateRouter from './routes/private';
import { Logger } from './utils/logger';
import { initializePrisma, disconnectPrisma } from '@/utils/prisma';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// HTTP request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  Logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Process request
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
    });
  });

  next();
});

app.use(cors());
app.use(express.json());

// Basic health check route (unprotected)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Mount private routes with authentication
app.use('/api', validateJWT, injectUserId, privateRouter);

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  Logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await disconnectPrisma();
    Logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    Logger.error('Error during graceful shutdown', error);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Initialize server
const startServer = async () => {
  try {
    // Initialize Prisma connection
    await initializePrisma();
    
    // Start the server
    app.listen(port, () => {
      Logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    Logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer(); 
