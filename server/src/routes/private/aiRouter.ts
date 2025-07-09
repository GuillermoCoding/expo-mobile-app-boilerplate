import { Router } from 'express';

import { analyzeStoolImageWithAI } from '@/controllers/aiController';

const router = Router();

router.post('/analyze-stool', analyzeStoolImageWithAI);

export default router; 