import { Router } from 'express';

import {
  getSignedUploadUrl,
  getSignedDownloadUrl,
  deleteUploadedFile,
} from 'controllers/uploadController';
import { validateJWT, injectUserId } from 'middleware/auth';

const router = Router();

// Get signed URL for direct S3 upload
router.post('/signed-url', validateJWT, injectUserId, getSignedUploadUrl);

// Get presigned POST data for S3 upload (alternative approach)
// router.post('/presigned-post', validateJWT, injectUserId, getPresignedPost);

// Get signed URL for downloading/viewing files
router.post('/download-url', validateJWT, injectUserId, getSignedDownloadUrl);

// Delete uploaded file
router.delete('/file/:key', validateJWT, injectUserId, deleteUploadedFile);

export default router; 