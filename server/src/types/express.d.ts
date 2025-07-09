import { Request } from 'express';
import { SupabaseUser } from './auth';

declare global {
  namespace Express {
    // Extend the Request interface
    interface Request {
      user?: SupabaseUser;
      userId?: number;
    }
  }
}

export {}; 