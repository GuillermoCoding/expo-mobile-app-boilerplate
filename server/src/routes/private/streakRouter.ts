import { Router } from 'express';

import { getStreak, updateStreak } from 'controllers/streakController';

const router = Router();

router.get('/', getStreak);
router.post('/update', updateStreak);

export default router; 