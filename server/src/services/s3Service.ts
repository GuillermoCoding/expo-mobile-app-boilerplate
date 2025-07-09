import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Logger } from '@/utils/logger';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const BUCKET_NAME = 'prod-591213504789';

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

interface SignedUrlResponse {
  signedUrl: string;
  key: string;
  expiresIn: number;
}

export async function generateSignedUploadUrl(
  userId: string,
  logId: string | number,
  fileName: string,
  contentType: string = 'image/jpeg',
  expiresIn: number = 300 // 5 minutes default
): Promise<SignedUrlResponse> {
  const key = `users/${userId}/logs/${logId}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn });
  
  Logger.info(`Generated signed upload URL for key: ${key}`);
  
  return {
    signedUrl,
    key,
    expiresIn,
  };
};



export async function generateSignedDownloadUrl(
  key: string,
  expiresIn: number = 60 * 60 * 24 * 7 // 7 days default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  const signedUrl = await getSignedUrl(s3, command, { expiresIn });
  
  return signedUrl;
};

export const deleteObject = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
  });

  await s3.send(command);
};

export async function checkObjectExists(key: string): Promise<boolean> {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await s3.send(command);
    return true;
  } catch (error) {
    return false;
  }
}