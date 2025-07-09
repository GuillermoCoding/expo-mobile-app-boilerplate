import { PrismaClient , Prisma } from '@prisma/client';
import { Request, Response } from 'express';

import { updateStreakRecord } from 'services/streakService';
import { Logger } from 'utils/logger';

const prisma = new PrismaClient();

export const createStoolRecord = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { imageUrl, description, bristolCategoryId, createdAt } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is test required' });
  }

  try {
    const stoolRecord = await prisma.stoolRecord.create({
      data: {
        imageUrl,
        description,
        userId,
        ...(bristolCategoryId && {
          bristolCategoryId
        }),
        ...(createdAt && {
          createdAt: new Date(createdAt)
        })
      },
      include: {
        bristolCategory: true,
      }
    });

    // Update the user's streak
    await updateStreakRecord(userId);

    return res.status(201).json(stoolRecord);
  } catch (error) {
    Logger.error('Error creating stool record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserStoolRecords = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { startDate, endDate } = req.query;
  
  const where: Prisma.StoolRecordWhereInput = { userId };
  
  if (startDate && endDate) {
    // Convert the ISO string dates to UTC Date objects
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  Logger.info('Querying stool records with where clause:');
  Logger.info(where);

  try {
    const stoolRecords = await prisma.stoolRecord.findMany({
      where,
      include: {
        bristolCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(stoolRecords);
  } catch (error) {
    Logger.error('Error getting stool records:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoolRecord = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  try {
    const stoolRecord = await prisma.stoolRecord.findFirst({
      where: {
        id: Number(id),
        userId, // Ensure user can only access their own records
      },
      include: {
        bristolCategory: true,
      },
    });

    if (!stoolRecord) {
      return res.status(404).json({ error: 'Stool record not found' });
    }

    res.json(stoolRecord);
  } catch (error) {
    Logger.error('Error getting stool record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStoolRecord = async (req: Request, res: Response) => {
  const { id } = req.params;

  const stoolRecord = await prisma.stoolRecord.delete({
    where: { id: Number(id) },
  });

  res.status(200).json(stoolRecord);
};

export const updateStoolRecord = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { description } = req.body;

  Logger.info(`Updating stool record with id: ${id} and userId: ${userId}`);

  try {
    const stoolRecord = await prisma.stoolRecord.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!stoolRecord) {
      return res.status(404).json({ error: 'Stool record not found' });
    }

    const updatedRecord = await prisma.stoolRecord.update({
      where: { id: Number(id) },
      data: {
        description,
      },
      include: {
        bristolCategory: true,
      },
    });

    res.json(updatedRecord);
  } catch (error) {
    Logger.error('Error updating stool record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 