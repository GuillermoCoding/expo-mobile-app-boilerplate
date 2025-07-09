import { Router } from 'express';

import {
  createStoolRecord,
  getUserStoolRecords,
  getStoolRecord,
  deleteStoolRecord,
  updateStoolRecord,
} from 'controllers/stoolRecordController';
import { validateJWT, injectUserId } from 'middleware/auth';

const router = Router();

// Create a new stool record
router.post('/', validateJWT, injectUserId, createStoolRecord);

// Update a stool record
router.put('/:id', validateJWT, injectUserId, updateStoolRecord);

// Get all stool records for the authenticated user
router.get('/', validateJWT, injectUserId, getUserStoolRecords);

// Get a specific stool record
router.get('/:id', validateJWT, injectUserId, getStoolRecord);

// Delete a stool record
router.delete('/:id', validateJWT, injectUserId, deleteStoolRecord);

export default router; 