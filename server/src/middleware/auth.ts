import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { SupabaseUser } from '../types/auth';
import { Logger } from '../utils/logger';

const prisma = new PrismaClient();

// Initialize Supabase client for JWT verification
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// JWT validation middleware
export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Add user to request object for use in protected routes
    req.user = user as SupabaseUser;
    next();
  } catch (error) {
    Logger.error('Error validating JWT:', { error });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to fetch and inject User ID
export const injectUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    Logger.debug('Processing user authentication:', { supabaseId: req.user.id });

    const user = await prisma.user.findUnique({
      where: {
        supabaseId: req.user.id
      },
      select: {
        id: true
      }
    });

    Logger.info('User lookup result:', { user });

    if (!user) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    Logger.error('Error in injectUserId middleware:', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 