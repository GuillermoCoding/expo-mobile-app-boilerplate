import { Router } from 'express';

import aiRoutes from './private/aiRouter';
import stoolRecordRoutes from './private/stoolRecordRouter';
import streakRoutes from './private/streakRouter';
import uploadRoutes from './private/uploadRouter';

const router = Router();

router.use('/stool-records', stoolRecordRoutes);
router.use('/streak', streakRoutes);
router.use('/ai', aiRoutes);
router.use('/upload', uploadRoutes);

export default router; 