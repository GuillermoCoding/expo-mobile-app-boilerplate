import { Request, Response } from 'express';

import { 
  generateSignedUploadUrl, 
  generateSignedDownloadUrl,
  checkObjectExists,
  deleteObject,
} from 'services/s3Service';
import { Logger } from 'utils/logger';

export async function getSignedUploadUrl (req: Request, res: Response) {
  const userId = req.userId;

  const { logId, contentType = 'image/jpeg', expiresIn = 300 } = req.body;

  const result = await generateSignedUploadUrl(
    String(userId), 
    Number(logId), 
    contentType, 
    Number(expiresIn)
  );

  Logger.info(`Generated signed upload URL for user ${userId}, log ${logId}`);
  
  return res.status(200).json(result);
};

// export const getPresignedPost = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const { logId, contentType = 'image/jpeg', expiresIn = 300 } = req.body;

//   const result = await generatePresignedPost(
//     String(userId), 
//     Number(logId), 
//     contentType, 
//     Number(expiresIn)
//   );

//   Logger.info(`Generated presigned POST for user ${userId}, log ${logId}`);
  
//   return res.status(200).json(result);
// };

export async function getSignedDownloadUrl (req: Request, res: Response) {
  const userId = req.userId;
  const { key, expiresIn = 60 * 60 * 24 * 7 } = req.body; // 7 days default
  const exists = await checkObjectExists(key);

  if (!exists) {
    return res.status(404).json({ error: 'File not found' });
  }

  const signedUrl = await generateSignedDownloadUrl(key, Number(expiresIn));

  Logger.info(`Generated signed download URL for user ${userId}, key ${key}`);
  
  return res.status(200).json({ signedUrl, expiresIn });
};

export async function deleteUploadedFile(req: Request, res: Response) {
  const userId = req.userId;
  const { key } = req.params;

  if (!key) {
    return res.status(400).json({ error: 'key is required' });
  }

  await deleteObject(key);

  Logger.info(`Deleted file for user ${userId}, key ${key}`);
  
  return res.status(200).json({ message: 'File deleted successfully' });
};